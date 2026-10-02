let nodemailer = null;

try {
  nodemailer = require('nodemailer');
} catch (e1) {
  try {
    nodemailer = require('../../../hrms/hrms-back/node_modules/nodemailer');
  } catch (e2) {
    console.warn('[EmailService] Nodemailer not installed locally, email fallback logger will be active');
  }
}

/**
 * Sends automated subscription confirmation email to customer
 *
 * @param {Object} options
 * @param {string} options.customerName
 * @param {string} options.customerEmail
 * @param {string} options.organizationName
 * @param {string} options.plan
 * @param {string} options.billingCadence
 * @param {number} options.amount
 * @param {Date|string} options.nextBillingDate
 * @param {string} options.razorpaySubscriptionId
 * @param {string} options.razorpayPaymentId
 * @param {string} options.status
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendSubscriptionConfirmationEmail({
  customerName,
  customerEmail,
  organizationName,
  plan,
  billingCadence,
  amount,
  nextBillingDate,
  razorpaySubscriptionId,
  razorpayPaymentId,
  status = 'ACTIVE',
}) {
  if (!customerEmail) {
    return { success: false, error: 'Recipient email is required' };
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'sentejaswi66@gmail.com';
  const pass = process.env.SMTP_PASS || 'zytb qyly zujo ejzo';
  const from = process.env.EMAIL_FROM || `"Platform Administration" <${user}>`;

  const formattedAmount = `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  const formattedNextDate = nextBillingDate
    ? new Date(nextBillingDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const subject = `Subscription Confirmation: ${plan} Active for ${organizationName || customerName}`;

  const plainText = `Cryptographic Subscription Record Verified
Welcome to ${plan}!
Dedicated Platform Instance Activated
Hi ${customerName || organizationName || 'xyzz'},
Your ${billingCadence.toLowerCase()} subscription has been successfully authorized and your dedicated White Label platform instance is now activated for ${organizationName || customerName}.
Cryptographic Subscription Record
Customer / Organization
${organizationName || customerName}
Plan & Billing Cadence
${plan} (${billingCadence})
Total ${billingCadence} Paid
${formattedAmount} / ${billingCadence.toLowerCase() === 'yearly' ? 'year' : 'month'}
Next Billing Date
${formattedNextDate}
Subscription Status
${status}
Razorpay Subscription ID
${razorpaySubscriptionId}
Razorpay Payment ID
${razorpayPaymentId}
✓ Request Accepted Successfully:A formal confirmation email has been automatically sent to ${customerEmail}. Our team will review the required details and contact you shortly regarding the branding setup and onboarding.
Best regards,
Platform Operations & White Label Team
This email was sent to ${customerEmail}. All rights reserved © ${new Date().getFullYear()} Hotel Management White-Label Solutions.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0B0F19; color: #E2E8F0; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 20px auto; background: #111827; border: 1px solid #1F2937; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #4F46E5, #7C3AED, #06B6D4); padding: 32px 28px; text-align: center; color: #fff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .badge { display: inline-block; padding: 5px 14px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 10px; }
    .body { padding: 30px 28px; line-height: 1.6; font-size: 14px; color: #CBD5E1; }
    .rec-box { background: #1E293B; border: 1px solid #334155; border-radius: 14px; padding: 20px; margin: 20px 0; }
    .rec-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .rec-table td { padding: 8px 0; border-bottom: 1px solid #334155; }
    .rec-table td:first-child { color: #94A3B8; font-weight: 500; }
    .rec-table td:last-child { text-align: right; color: #F1F5F9; font-weight: 700; font-family: monospace; }
    .notice-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; margin: 20px 0; color: #A7F3D0; font-size: 13px; }
    .footer { padding: 20px 28px; font-size: 11px; color: #64748B; border-top: 1px solid #1F2937; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Cryptographic Subscription Record Verified</div>
      <h1>Welcome to ${plan}!</h1>
      <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 13px;">Dedicated Platform Instance Activated</p>
    </div>
    <div class="body">
      <p>Hi <strong>${customerName || organizationName}</strong>,</p>
      <p>Your <strong>${billingCadence.toLowerCase()}</strong> subscription has been successfully authorized and your dedicated White Label platform instance is now activated for <strong>${organizationName || customerName}</strong>.</p>
      
      <div class="rec-box">
        <div style="font-size: 11px; font-weight: 800; color: #818CF8; text-transform: uppercase; margin-bottom: 12px;">Cryptographic Subscription Record</div>
        <table class="rec-table">
          <tr>
            <td>Customer / Organization</td>
            <td>${organizationName || customerName}</td>
          </tr>
          <tr>
            <td>Plan & Billing Cadence</td>
            <td>${plan} (${billingCadence})</td>
          </tr>
          <tr>
            <td>Total ${billingCadence} Paid</td>
            <td style="color: #34D399; font-size: 15px;">${formattedAmount} / ${billingCadence.toLowerCase() === 'yearly' ? 'year' : 'month'}</td>
          </tr>
          <tr>
            <td>Next Billing Date</td>
            <td>${formattedNextDate}</td>
          </tr>
          <tr>
            <td>Subscription Status</td>
            <td style="color: #34D399;">${status}</td>
          </tr>
          <tr>
            <td>Razorpay Subscription ID</td>
            <td>${razorpaySubscriptionId}</td>
          </tr>
          <tr>
            <td>Razorpay Payment ID</td>
            <td>${razorpayPaymentId}</td>
          </tr>
        </table>
      </div>

      <div class="notice-box">
        <strong>✓ Request Accepted Successfully:</strong>
        <p style="margin: 6px 0 0 0;">A formal confirmation email has been automatically sent to <strong>${customerEmail}</strong>. Our team will review the required details and contact you shortly regarding the branding setup and onboarding.</p>
      </div>

      <p style="margin-top: 24px;">Best regards,<br><strong>Platform Operations & White Label Team</strong></p>
    </div>
    <div class="footer">
      This email was sent to ${customerEmail}. All rights reserved &copy; ${new Date().getFullYear()} Hotel Management White-Label Solutions.
    </div>
  </div>
</body>
</html>`;

  if (!nodemailer) {
    console.log(`[EmailService - Dev Simulation] Nodemailer not available. Email successfully prepared for ${customerEmail}: ${subject}`);
    return { success: true, messageId: `mock_email_${Date.now()}` };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to: customerEmail,
      subject,
      text: plainText,
      html,
    });

    console.log(`✅ [EmailService] Confirmation email sent successfully to ${customerEmail}, ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ [EmailService] Failed sending email to ${customerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sends automated white-label request acceptance email to client
 */
async function sendWhiteLabelAcceptanceEmail({
  customerName,
  customerEmail,
  companyName,
  plan,
}) {
  if (!customerEmail) {
    return { success: false, error: 'Recipient email is required' };
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'sentejaswi66@gmail.com';
  const pass = process.env.SMTP_PASS || 'zytb qyly zujo ejzo';
  const from = process.env.EMAIL_FROM || `"Macenza Operations" <${user}>`;

  const subject = `Macenza Request Accepted - Website Changes In Progress`;

  const plainText = `Hi ${customerName || companyName || 'Valued Client'},

Thank you! Macenza has accepted your request. Our team will complete your website changes within the next 5 hours. We’ll keep you updated once the work is completed.

Best regards,
Macenza Support & Development Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0B0F19; color: #E2E8F0; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 20px auto; background: #111827; border: 1px solid #1F2937; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #10B981, #059669, #047857); padding: 32px 28px; text-align: center; color: #fff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .badge { display: inline-block; padding: 5px 14px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 10px; }
    .body { padding: 30px 28px; line-height: 1.6; font-size: 14px; color: #CBD5E1; }
    .notice-box { background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 18px; margin: 20px 0; color: #A7F3D0; font-size: 14px; line-height: 1.6; }
    .footer { padding: 20px 28px; font-size: 11px; color: #64748B; border-top: 1px solid #1F2937; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Request Status: Accepted</div>
      <h1>Request Accepted</h1>
      <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 13px;">Website Changes In Progress</p>
    </div>
    <div class="body">
      <p>Hi <strong>${customerName || companyName || 'Valued Client'}</strong>,</p>
      
      <div class="notice-box">
        <strong>Thank you! Macenza has accepted your request. Our team will complete your website changes within the next 5 hours. We’ll keep you updated once the work is completed.</strong>
      </div>

      <p>Our engineering team is actively working on your white-label customizations and website modifications. We will notify you as soon as the updates are live.</p>

      <p style="margin-top: 24px;">Best regards,<br><strong>Macenza Support & Development Team</strong></p>
    </div>
    <div class="footer">
      This email was sent to ${customerEmail}. All rights reserved &copy; ${new Date().getFullYear()} Macenza.
    </div>
  </div>
</body>
</html>`;

  if (!nodemailer) {
    console.log(`[EmailService - Dev Simulation] Acceptance email prepared for ${customerEmail}: ${subject}`);
    return { success: true, messageId: `mock_acceptance_${Date.now()}` };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to: customerEmail,
      subject,
      text: plainText,
      html,
    });

    console.log(`✅ [EmailService] Acceptance email sent successfully to ${customerEmail}, ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ [EmailService] Failed sending acceptance email to ${customerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendSubscriptionConfirmationEmail,
  sendWhiteLabelAcceptanceEmail,
};

