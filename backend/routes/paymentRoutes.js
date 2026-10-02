const express = require('express');
const controller = require('../controllers/paymentController');

function createPaymentRouter(authenticateMiddleware, authorizeMiddleware) {
  const router = express.Router();

  const auth = typeof authenticateMiddleware === 'function' ? authenticateMiddleware : (req, res, next) => next();

  // Tenant Gateway Configuration
  router.get('/config', auth, controller.getPaymentConfig);
  router.post('/config', auth, controller.savePaymentConfig);

  // Customer Order Creation & Verification
  router.post('/create-order', controller.createPaymentOrder);
  router.post('/verify-payment', controller.verifyPayment);

  // Secure Webhook Ingestion (Raw/JSON parsed)
  router.post('/webhooks/razorpay/:tenantId?', controller.handleRazorpayWebhook);

  // Dynamic Subscription Plans Flow (Hotel PMS / HRMS / White Label)
  router.post('/create-subscription-order', controller.createSubscriptionOrder);
  router.post('/verify-subscription', controller.verifySubscription);
  router.get('/subscriptions', controller.getSubscriptions);

  // Transaction Ledger & Auditing
  router.get('/ledger', auth, controller.getPaymentLedger);

  return router;
}

const paymentRouter = createPaymentRouter();

module.exports = {
  paymentRouter,
  createPaymentRouter,
};
