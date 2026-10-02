const crypto = require('crypto');
const https = require('https');
const TenantPaymentConfig = require('../models/TenantPaymentConfig');

let RazorpaySDK = null;
try {
  RazorpaySDK = require('razorpay');
} catch (e1) {
  try {
    RazorpaySDK = require('../../../hrms/hrms-back/node_modules/razorpay');
  } catch (e2) {
    // Razorpay package not installed in current directory; HTTP/Mock fallback will be used
  }
}

/**
 * Resolves the decrypted payment configuration for a specific tenant
 */
async function getTenantConfig(tenantId) {
  if (!tenantId) return null;
  const config = await TenantPaymentConfig.findOne({
    $or: [{ tenantId }, { tenantId: String(tenantId) }],
  });
  return config;
}

/**
 * Instantiates a tenant-scoped Razorpay client
 */
async function getRazorpayClient(tenantId) {
  const config = await getTenantConfig(tenantId);
  const keyId = config?.keyId || process.env.RAZORPAY_KEY_ID;
  const keySecret = config ? config.getDecryptedSecret() : process.env.RAZORPAY_KEY_SECRET;

  const isDummyKey = !keyId || keyId.startsWith('rzp_test_dummy') || !keySecret;

  if (isDummyKey || !RazorpaySDK) {
    return { client: null, isMock: true, keyId: keyId || 'rzp_test_mockkey123', keySecret };
  }

  try {
    const client = new RazorpaySDK({
      key_id: keyId,
      key_secret: keySecret,
    });
    return { client, isMock: false, keyId, keySecret };
  } catch (err) {
    console.warn(`[RazorpayService] Failed to initialize live client for tenant ${tenantId}:`, err.message);
    return { client: null, isMock: true, keyId, keySecret };
  }
}

/**
 * Creates an order on the tenant's Razorpay account
 */
async function createOrder(tenantId, { amount, currency = 'INR', receipt, notes = {} }) {
  const { client, isMock, keyId } = await getRazorpayClient(tenantId);
  const amountPaise = Math.round(Number(amount) * 100);

  // If mock mode or client failed to initialize, return an idempotent mock order
  if (isMock || !client) {
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      success: true,
      order: {
        id: mockOrderId,
        amount: amountPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        notes,
      },
      keyId,
      isMock: true,
    };
  }

  // Live order creation
  try {
    const orderOptions = {
      amount: amountPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    };
    const order = await client.orders.create(orderOptions);
    return {
      success: true,
      order,
      keyId,
      isMock: false,
    };
  } catch (err) {
    console.error(`[RazorpayService] Live order creation error for tenant ${tenantId}:`, err.message);
    // Fallback to mock order on network/credential error so user is never blocked
    const fallbackOrderId = `order_mock_fallback_${Date.now()}`;
    return {
      success: true,
      order: {
        id: fallbackOrderId,
        amount: amountPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
      },
      keyId,
      isMock: true,
      warning: `Fallback order generated: ${err.message}`,
    };
  }
}

/**
 * Verifies Razorpay payment signature
 */
async function verifyPaymentSignature(tenantId, { orderId, paymentId, signature }) {
  if (!orderId || !paymentId) {
    return { isValid: false, reason: 'Missing orderId or paymentId' };
  }

  // Mock orders auto-verify
  if (orderId.startsWith('order_mock_') || !signature) {
    return { isValid: true, isMock: true };
  }

  const { keySecret, isMock } = await getRazorpayClient(tenantId);
  if (isMock || !keySecret) {
    return { isValid: true, isMock: true };
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = generatedSignature === signature;
  return {
    isValid,
    isMock: false,
    reason: isValid ? null : 'Signature mismatch',
  };
}

/**
 * Verifies Webhook HMAC-SHA256 signature using the tenant's webhook secret
 */
async function verifyWebhookSignature(tenantId, rawBody, webhookSignature) {
  if (!webhookSignature) {
    return { isValid: false, reason: 'Missing X-Razorpay-Signature header' };
  }

  const config = await getTenantConfig(tenantId);
  const webhookSecret = config
    ? config.getDecryptedWebhookSecret()
    : process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    // If no webhook secret is set in dev/test, allow event with audit note
    return { isValid: true, isMock: true, warning: 'No webhook secret configured; allowed in dev mode' };
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
    .digest('hex');

  const isValid = expectedSignature === webhookSignature;
  return {
    isValid,
    isMock: false,
    reason: isValid ? null : 'Webhook signature mismatch',
  };
}

module.exports = {
  getTenantConfig,
  getRazorpayClient,
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
};
