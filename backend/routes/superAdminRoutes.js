const express = require('express');
const superAdminController = require('../controllers/superAdminController');

function createSuperAdminRouter(authenticateMiddleware, authorizeMiddleware) {
  const router = express.Router();

  // Guard middleware if provided by host app
  const guards = [];
  if (typeof authenticateMiddleware === 'function') guards.push(authenticateMiddleware);
  if (typeof authorizeMiddleware === 'function') guards.push(authorizeMiddleware);

  const applyGuards = (fn) => [...guards, fn];

  // Overview KPIs
  router.get('/overview', ...applyGuards(superAdminController.getSuperAdminOverview));

  // 1. Templates
  router.get('/templates', ...applyGuards(superAdminController.getTemplates));
  router.post('/templates', ...applyGuards(superAdminController.createTemplate));
  router.post('/templates/apply', ...applyGuards(superAdminController.applyTemplate));

  // 2. Products
  router.get('/products', ...applyGuards(superAdminController.getProducts));
  router.put('/products/:id', ...applyGuards(superAdminController.updateProduct));

  // 3. Resellers
  router.get('/resellers', ...applyGuards(superAdminController.getResellers));
  router.post('/resellers', ...applyGuards(superAdminController.createReseller));

  // 4. Customers
  router.get('/customers', ...applyGuards(superAdminController.getCustomers));

  // 5. Subscriptions
  router.get('/subscriptions', ...applyGuards(superAdminController.getSubscriptions));

  // 6. Payments
  router.get('/payments', ...applyGuards(superAdminController.getPayments));

  // 7. Commissions
  router.get('/commissions', ...applyGuards(superAdminController.getCommissions));
  router.post('/commissions/payout', ...applyGuards(superAdminController.processPayout));

  // 8. Domains
  router.get('/domains', ...applyGuards(superAdminController.getDomains));
  router.post('/domains', ...applyGuards(superAdminController.addDomain));
  router.put('/domains/:id/verify', ...applyGuards(superAdminController.verifyDomain));

  // 9. Feature Flags
  router.get('/features', ...applyGuards(superAdminController.getFeatureFlags));
  router.put('/features/:id/toggle', ...applyGuards(superAdminController.toggleFeatureFlag));

  // 10. Audit Logs
  router.get('/audit-logs', ...applyGuards(superAdminController.getAuditLogs));

  return router;
}

module.exports = {
  createSuperAdminRouter,
  superAdminRouter: createSuperAdminRouter(),
};
