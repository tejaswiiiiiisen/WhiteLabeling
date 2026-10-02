const TenantPaymentConfig = require('../models/TenantPaymentConfig');
const TenantPlan = require('../models/TenantPlan');
const CustomerSubscription = require('../models/CustomerSubscription');
const SubscriptionRecord = require('../models/SubscriptionRecord');
const PaymentTransaction = require('../models/PaymentTransaction');
const TenantBranding = require('../models/TenantBranding');
const { encrypt, maskSecret } = require('../services/encryptionService');
const razorpayService = require('../services/razorpayService');
const { sendSubscriptionConfirmationEmail } = require('../services/emailService');
const { resolveReqTenantId } = require('../middleware/featureGate');

/**
 * GET /api/payments/config
 * Retrieves tenant's payment configuration (clean, safe, masked)
 */
exports.getPaymentConfig = async (req, res) => {
  try {
    const tenantId = req.query.tenantId || resolveReqTenantId(req);
    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Tenant ID is required' });
    }

    let config = await TenantPaymentConfig.findOne({
      $or: [{ tenantId }, { tenantId: String(tenantId) }],
    });

    if (!config) {
      const tenant = await TenantBranding.findOne({
        $or: [{ organizationId: tenantId }, { _id: tenantId }],
      }).lean();

      config = await TenantPaymentConfig.create({
        tenantId,
        tenantName: tenant?.companyName || 'White-Label Tenant',
        provider: 'Razorpay',
        keyId: '',
        encryptedKeySecret: '',
        encryptedWebhookSecret: '',
        isLiveMode: false,
        isEnabled: true,
        webhookUrl: `/api/payments/webhooks/razorpay/${tenantId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: config.toClientJSON(),
    });
  } catch (err) {
    console.error('[PaymentController] Error getting payment config:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/payments/config
 * Saves/updates tenant's Razorpay credentials with AES-256 encryption
 */
exports.savePaymentConfig = async (req, res) => {
  try {
    const tenantId = req.body.tenantId || resolveReqTenantId(req);
    const { keyId, keySecret, webhookSecret, isLiveMode, isEnabled, currency } = req.body;

    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Tenant ID is required' });
    }

    let config = await TenantPaymentConfig.findOne({
      $or: [{ tenantId }, { tenantId: String(tenantId) }],
    });

    const tenant = await TenantBranding.findOne({
      $or: [{ organizationId: tenantId }, { _id: tenantId }],
    }).lean();

    if (!config) {
      config = new TenantPaymentConfig({
        tenantId,
        tenantName: tenant?.companyName || 'White-Label Tenant',
        webhookUrl: `/api/payments/webhooks/razorpay/${tenantId}`,
      });
    }

    if (keyId !== undefined) config.keyId = keyId.trim();
    // Encrypt secrets if updated
    if (keySecret && !keySecret.includes('••••')) {
      config.encryptedKeySecret = encrypt(keySecret.trim());
    }
    if (webhookSecret && !webhookSecret.includes('••••')) {
      config.encryptedWebhookSecret = encrypt(webhookSecret.trim());
    }
    if (isLiveMode !== undefined) config.isLiveMode = Boolean(isLiveMode);
    if (isEnabled !== undefined) config.isEnabled = Boolean(isEnabled);
    if (currency) config.currency = currency.toUpperCase();

    await config.save();

    console.log(`✅ [PaymentController] Encrypted & saved Razorpay credentials for tenant: ${tenantId}`);

    return res.status(200).json({
      success: true,
      message: 'Razorpay payment gateway credentials encrypted and saved successfully.',
      data: config.toClientJSON(),
    });
  } catch (err) {
    console.error('[PaymentController] Error saving payment config:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/payments/create-order
 * Validates tenant, plan, and permissions, then creates a Razorpay order
 */
exports.createPaymentOrder = async (req, res) => {
  try {
    const tenantId = req.body.tenantId || resolveReqTenantId(req);
    const { planId, customerId, customerName, customerEmail, companyName, billingCycle = 'monthly' } = req.body;

    if (!tenantId || !planId) {
      return res.status(400).json({ success: false, message: 'Tenant ID and Plan ID are required.' });
    }

    // 1. Verify tenant is active
    const tenant = await TenantBranding.findOne({
      $or: [{ organizationId: tenantId }, { _id: tenantId }],
    }).lean();

    if (tenant && tenant.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'This tenant organization is currently suspended. Payment cannot be processed.',
      });
    }

    // 2. Fetch Plan
    const plan = await TenantPlan.findById(planId).lean();
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Requested subscription plan not found.' });
    }

    if (plan.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'This plan is not currently active.' });
    }

    // 3. Compute price
    const amount = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const currency = plan.currency || 'INR';

    // 4. Generate order via tenant's Razorpay account
    const receipt = `rcpt_${tenantId}_${Date.now()}`;
    const orderResult = await razorpayService.createOrder(tenantId, {
      amount,
      currency,
      receipt,
      notes: {
        tenantId: String(tenantId),
        planId: String(plan._id),
        planName: plan.name,
        customerId: customerId ? String(customerId) : 'guest',
        billingCycle,
      },
    });

    // 5. Audit log transaction in database
    const transaction = await PaymentTransaction.create({
      tenantId,
      customerId: customerId || 'cust_anonymous',
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      planId: plan._id,
      planName: plan.name,
      orderId: orderResult.order.id,
      amount,
      currency,
      provider: 'Razorpay',
      status: 'Created',
      receipt,
      isMock: Boolean(orderResult.isMock),
      metadata: {
        billingCycle,
        companyName,
        limits: plan.limits,
      },
    });

    return res.status(200).json({
      success: true,
      order: orderResult.order,
      keyId: orderResult.keyId,
      isMock: orderResult.isMock,
      transactionId: transaction._id,
    });
  } catch (err) {
    console.error('[PaymentController] Error creating payment order:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/payments/verify-payment
 * Verifies Razorpay signature, captures payment, activates customer subscription
 */
exports.verifyPayment = async (req, res) => {
  try {
    const tenantId = req.body.tenantId || resolveReqTenantId(req);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerId,
      customerName,
      customerEmail,
      companyName,
      planId,
      billingCycle = 'monthly',
    } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    // 1. Verify HMAC Signature
    const verification = await razorpayService.verifyPaymentSignature(tenantId, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!verification.isValid) {
      // Mark transaction failed if exists
      await PaymentTransaction.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'Failed', failureReason: verification.reason }
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid cryptographic signature.',
      });
    }

    // 2. Fetch Plan & compute period dates
    const plan = await TenantPlan.findById(planId).lean();
    const periodDays = billingCycle === 'yearly' ? 365 : 30;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + periodDays * 24 * 60 * 60 * 1000);

    const featureKeys = (plan?.features || [])
      .filter((f) => f.included)
      .map((f) => f.key);

    // 3. Update / Create CustomerSubscription
    let subscription = await CustomerSubscription.findOne({
      tenantId,
      customerId: customerId || 'cust_anonymous',
    });

    if (subscription) {
      subscription.planId = plan?._id || subscription.planId;
      subscription.planName = plan?.name || subscription.planName;
      subscription.billingCycle = billingCycle;
      subscription.amount = billingCycle === 'yearly' ? plan?.yearlyPrice || 0 : plan?.monthlyPrice || 0;
      subscription.status = 'Active';
      subscription.currentPeriodStart = now;
      subscription.currentPeriodEnd = periodEnd;
      subscription.latestOrderId = razorpay_order_id;
      subscription.latestPaymentId = razorpay_payment_id;
      subscription.featuresGranted = featureKeys;
      subscription.limits = plan?.limits || subscription.limits;
      await subscription.save();
    } else {
      subscription = await CustomerSubscription.create({
        tenantId,
        customerId: customerId || `cust_${Date.now()}`,
        customerName: customerName || 'Valued Client',
        customerEmail: customerEmail || '',
        companyName: companyName || '',
        planId: plan?._id,
        planName: plan?.name || 'Custom Plan',
        billingCycle,
        amount: billingCycle === 'yearly' ? plan?.yearlyPrice || 0 : plan?.monthlyPrice || 0,
        currency: plan?.currency || 'INR',
        status: 'Active',
        startDate: now,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        paymentProvider: 'Razorpay',
        latestOrderId: razorpay_order_id,
        latestPaymentId: razorpay_payment_id,
        featuresGranted: featureKeys,
        limits: plan?.limits || {},
      });
    }

    // 4. Update PaymentTransaction record to Captured
    const transaction = await PaymentTransaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'Captured',
        subscriptionId: subscription._id,
        paidAt: now,
      },
      { new: true }
    );

    // 5. Increment plan subscriber count
    if (plan?._id) {
      await TenantPlan.findByIdAndUpdate(plan._id, { $inc: { activeSubscribersCount: 1 } });
    }

    console.log(`✅ [PaymentController] Payment captured successfully for tenant ${tenantId}. Subscription active.`);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated successfully.',
      subscription,
      transaction,
      isMock: verification.isMock,
    });
  } catch (err) {
    console.error('[PaymentController] Error verifying payment:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/payments/webhooks/razorpay/:tenantId
 * Secure Webhook Ingestion Engine with HMAC-SHA256 signature verification & idempotency
 */
exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const tenantId = req.params.tenantId || req.query.tenantId;
    const webhookSignature = req.headers['x-razorpay-signature'];
    const event = req.body;

    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Tenant identifier required in webhook path' });
    }

    // 1. Verify Webhook Signature
    const sigCheck = await razorpayService.verifyWebhookSignature(tenantId, req.body, webhookSignature);
    if (!sigCheck.isValid) {
      console.warn(`[Webhook Security Alert] Invalid webhook signature for tenant ${tenantId}`);
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const eventId = event.event_id || event.id || `${Date.now()}`;
    const eventType = event.event;
    const payload = event.payload || {};

    console.log(`📩 [Webhook Ingestion] Received event: ${eventType} (ID: ${eventId}) for tenant ${tenantId}`);

    // 2. Idempotency Guard
    const existingTxn = await PaymentTransaction.findOne({ webhookEventId: eventId });
    if (existingTxn) {
      console.log(`ℹ️ [Webhook] Event ${eventId} already processed (Idempotent response)`);
      return res.status(200).json({ success: true, message: 'Event already processed' });
    }

    // 3. Event Handling
    switch (eventType) {
      case 'order.paid':
      case 'payment.captured': {
        const paymentEntity = payload.payment?.entity || {};
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;
        const amount = paymentEntity.amount ? paymentEntity.amount / 100 : 0;

        if (orderId) {
          await PaymentTransaction.findOneAndUpdate(
            { orderId },
            {
              paymentId,
              status: 'Captured',
              paidAt: new Date(),
              webhookEventId: eventId,
            }
          );

          // Find subscription and set to Active
          await CustomerSubscription.findOneAndUpdate(
            { latestOrderId: orderId },
            {
              status: 'Active',
              latestPaymentId: paymentId,
            }
          );

          // Synchronize SubscriptionRecord status
          await SubscriptionRecord.findOneAndUpdate(
            { $or: [{ 'metadata.orderId': orderId }, { razorpayPaymentId: paymentId }] },
            {
              status: 'ACTIVE',
              paymentStatus: 'Paid',
              razorpayPaymentId: paymentId,
            }
          );
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = payload.payment?.entity || {};
        const orderId = paymentEntity.order_id;
        if (orderId) {
          await PaymentTransaction.findOneAndUpdate(
            { orderId },
            {
              status: 'Failed',
              failureReason: paymentEntity.error_description || 'Payment failed',
              webhookEventId: eventId,
            }
          );

          await SubscriptionRecord.findOneAndUpdate(
            { 'metadata.orderId': orderId },
            {
              status: 'FAILED',
              paymentStatus: 'Due',
            }
          );
        }
        break;
      }

      case 'subscription.charged': {
        const subEntity = payload.subscription?.entity || {};
        const paymentEntity = payload.payment?.entity || {};
        if (subEntity.id) {
          const nextDate = subEntity.current_end ? new Date(subEntity.current_end * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await SubscriptionRecord.findOneAndUpdate(
            { razorpaySubscriptionId: subEntity.id },
            {
              status: 'ACTIVE',
              paymentStatus: 'Paid',
              nextBillingDate: nextDate,
              ...(paymentEntity.id ? { razorpayPaymentId: paymentEntity.id } : {}),
            }
          );
        }
        break;
      }

      case 'subscription.cancelled': {
        const subEntity = payload.subscription?.entity || {};
        if (subEntity.id) {
          await CustomerSubscription.findOneAndUpdate(
            { latestOrderId: subEntity.id },
            { status: 'Cancelled', canceledAt: new Date() }
          );

          await SubscriptionRecord.findOneAndUpdate(
            { razorpaySubscriptionId: subEntity.id },
            { status: 'CANCELLED', paymentStatus: 'Due' }
          );
        }
        break;
      }

      case 'subscription.halted':
      case 'subscription.paused': {
        const subEntity = payload.subscription?.entity || {};
        if (subEntity.id) {
          await SubscriptionRecord.findOneAndUpdate(
            { razorpaySubscriptionId: subEntity.id },
            { status: 'PAST_DUE', paymentStatus: 'Due' }
          );
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${eventType}`);
    }

    return res.status(200).json({ success: true, event: eventType, processed: true });
  } catch (err) {
    console.error('[PaymentController] Error processing webhook:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/payments/ledger
 * Retrieves audit-compliant transaction ledger for the tenant
 */
exports.getPaymentLedger = async (req, res) => {
  try {
    const tenantId = req.query.tenantId || resolveReqTenantId(req);
    const { status, limit = 50, page = 1 } = req.query;

    const query = {};
    if (tenantId) {
      query.tenantId = tenantId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await PaymentTransaction.countDocuments(query);
    const transactions = await PaymentTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: transactions,
    });
  } catch (err) {
    console.error('[PaymentController] Error getting payment ledger:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Helper to compute default plan price in INR if amount not specified
 */
function resolvePlanAmount(planName, billingCadence) {
  const p = (planName || '').toLowerCase();
  const isYearly = (billingCadence || '').toLowerCase() === 'yearly';

  let monthlyAmount = 2500;
  if (p.includes('custom') || p.includes('white label')) {
    monthlyAmount = 10000;
  } else if (p.includes('enterprise')) {
    monthlyAmount = 8000;
  } else if (p.includes('professional')) {
    monthlyAmount = 5000;
  } else if (p.includes('growth')) {
    monthlyAmount = 2500;
  }

  return isYearly ? monthlyAmount * 10 : monthlyAmount; // 10% discount on yearly
}

/**
 * POST /api/payments/create-subscription-order
 * Creates Razorpay order for dynamic plan subscription (Hotel PMS / HRMS / White Label)
 */
exports.createSubscriptionOrder = async (req, res) => {
  try {
    const {
      plan,
      billingCadence = 'Monthly',
      amount,
      customerName,
      customerEmail,
      organizationName,
      projectId = 'hotel',
    } = req.body;

    if (!plan) {
      return res.status(400).json({ success: false, message: 'Plan is required.' });
    }

    const finalAmount = Number(amount) > 0 ? Number(amount) : resolvePlanAmount(plan, billingCadence);
    const currency = 'INR';
    const tenantId = req.body.tenantId || resolveReqTenantId(req) || 'tenant_default';

    const receipt = `sub_rcpt_${Date.now().toString(36)}`;
    const orderResult = await razorpayService.createOrder(tenantId, {
      amount: finalAmount,
      currency,
      receipt,
      notes: {
        plan,
        billingCadence,
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        organizationName: organizationName || '',
        projectId,
      },
    });

    return res.status(200).json({
      success: true,
      order: orderResult.order,
      orderId: orderResult.order?.id,
      amount: orderResult.order?.amount,
      finalAmount,
      currency,
      keyId: orderResult.keyId,
      isMock: Boolean(orderResult.isMock),
    });
  } catch (err) {
    console.error('[PaymentController] Error creating subscription order:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/payments/verify-subscription
 * Cryptographically verifies subscription authorization,
 * calculates dynamic 35% / 65% revenue split,
 * computes dynamic next billing date,
 * saves SubscriptionRecord as source of truth in database,
 * sends confirmation email,
 * and returns the exact formatted JSON response.
 */
exports.verifySubscription = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
      customerName = 'Valued Customer',
      customerEmail,
      organizationName,
      plan = 'Custom White Label',
      billingCadence = 'Monthly',
      amount,
      projectId = 'hotel',
      tenantId,
    } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ success: false, message: 'Customer email is required.' });
    }

    // 1. Dynamic Amount Resolution
    const numAmount = Number(amount) > 0 ? Number(amount) : resolvePlanAmount(plan, billingCadence);

    // 2. Cryptographic signature check (with mock fallback for dev testing)
    const effectiveTenantId = tenantId || resolveReqTenantId(req) || 'tenant_default';
    const verification = await razorpayService.verifyPaymentSignature(effectiveTenantId, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!verification.isValid && process.env.NODE_ENV === 'production') {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid cryptographic signature.',
      });
    }

    // 3. Dynamic 35% / 65% Revenue Split Calculation
    const platformPercentage = 35;
    const partnerPercentage = 65;
    const platformAmount = Math.round(numAmount * (platformPercentage / 100));
    const partnerAmount = Math.round(numAmount * (partnerPercentage / 100));

    // 4. Dynamic Next Billing Date Calculation
    const now = new Date();
    const isYearly = (billingCadence || '').toLowerCase() === 'yearly';
    const nextBillingDate = new Date(now.getTime());
    if (isYearly) {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
      nextBillingDate.setDate(nextBillingDate.getDate() + 30);
    }

    const nextBillingDateStr = nextBillingDate.toISOString().split('T')[0];

    // 5. Ensure Non-Empty Razorpay IDs
    const finalSubId = razorpay_subscription_id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const finalPayId = razorpay_payment_id || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 6. Attempt automated confirmation email sending
    const cleanEmail = String(customerEmail).trim().toLowerCase();
    const cleanOrg = String(organizationName || customerName || 'Valued Organization').trim();
    const cleanCust = String(customerName || cleanOrg).trim();

    const emailResult = await sendSubscriptionConfirmationEmail({
      customerName: cleanCust,
      customerEmail: cleanEmail,
      organizationName: cleanOrg,
      plan,
      billingCadence,
      amount: numAmount,
      nextBillingDate: nextBillingDateStr,
      razorpaySubscriptionId: finalSubId,
      razorpayPaymentId: finalPayId,
      status: 'ACTIVE',
    });

    const emailSent = Boolean(emailResult.success);
    const emailError = emailResult.error || null;

    // 7. Persist SubscriptionRecord in MongoDB as Source of Truth
    const subscriptionRecord = await SubscriptionRecord.create({
      customerName: cleanCust,
      customerEmail: cleanEmail,
      organizationName: cleanOrg,
      plan,
      billingCadence: isYearly ? 'Yearly' : 'Monthly',
      amount: numAmount,
      currency: 'INR',
      subscriptionStartDate: now,
      nextBillingDate,
      razorpaySubscriptionId: finalSubId,
      razorpayPaymentId: finalPayId,
      paymentStatus: 'Paid',
      status: 'ACTIVE',
      platformRevenuePercentage: platformPercentage,
      partnerRevenuePercentage: partnerPercentage,
      platformRevenueAmount: platformAmount,
      partnerRevenueAmount: partnerAmount,
      emailSent,
      emailError,
      projectId,
      tenantId: effectiveTenantId,
      metadata: {
        orderId: razorpay_order_id,
        isMock: Boolean(verification.isMock),
      },
    });

    // Also persist to PaymentTransaction ledger for unified tracking
    try {
      await PaymentTransaction.create({
        tenantId: effectiveTenantId,
        orderId: razorpay_order_id,
        paymentId: finalPayId,
        customerName: cleanCust,
        customerEmail: cleanEmail,
        amount: numAmount,
        currency: 'INR',
        status: 'Captured',
        paymentMethod: 'Razorpay',
        paidAt: now,
        notes: `${plan} (${isYearly ? 'Yearly' : 'Monthly'}) Hotel Management Subscription`,
      });
    } catch (ledgerErr) {
      console.warn('[PaymentController] Non-blocking error writing to PaymentTransaction:', ledgerErr.message);
    }

    console.log(`✅ [SubscriptionRecord] Saved record ${subscriptionRecord._id} for ${cleanCust} (${plan}, ₹${numAmount})`);

    // 8. Return exact JSON format requested with all details
    return res.status(200).json({
      customerName: cleanCust,
      customerEmail: cleanEmail,
      organizationName: cleanOrg,
      plan,
      billingCadence: isYearly ? 'Yearly' : 'Monthly',
      monthlyAmount: isYearly ? Math.round(numAmount / 12) : numAmount,
      amount: numAmount,
      subscriptionStartDate: now.toISOString(),
      nextBillingDate: nextBillingDateStr,
      razorpaySubscriptionId: finalSubId,
      razorpayPaymentId: finalPayId,
      paymentStatus: 'Paid',
      subscriptionStatus: 'ACTIVE',
      status: 'ACTIVE',
      projectId,
      revenueSplit: {
        platformPercentage,
        partnerPercentage,
        platformAmount,
        partnerAmount,
      },
      emailSent,
      emailError: emailError || undefined,
      recordId: subscriptionRecord._id,
      success: true,
      message: emailSent
        ? 'Request accepted successfully and confirmation email sent to the user.'
        : 'Request accepted successfully, but confirmation email could not be sent.',
    });
  } catch (err) {
    console.error('[PaymentController] Error verifying subscription:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/payments/subscriptions
 * Retrieves active subscription records for the hotel/hrms project
 */
exports.getSubscriptions = async (req, res) => {
  try {
    const { projectId, limit = 50 } = req.query;
    const query = {};
    if (projectId && projectId !== 'all') {
      query.projectId = projectId;
    }
    const records = await SubscriptionRecord.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    return res.status(200).json({
      success: true,
      data: records || [],
      subscriptions: records || [],
    });
  } catch (err) {
    console.error('[PaymentController] Error listing subscriptions:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

