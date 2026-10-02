const express = require('express');
const controller = require('../controllers/tenantPlanController');

function createTenantPlanRouter(authenticateMiddleware, authorizeMiddleware) {
  const router = express.Router();

  const auth = typeof authenticateMiddleware === 'function' ? authenticateMiddleware : (req, res, next) => next();

  // Public/tenant catalog
  router.get('/allowed-features', controller.getTenantAllowedFeatures);
  router.get('/', controller.getTenantPlans);

  // Protected Tenant Admin CRUD
  router.post('/', auth, controller.createTenantPlan);
  router.put('/:id', auth, controller.updateTenantPlan);
  router.delete('/:id', auth, controller.deleteTenantPlan);

  return router;
}

const tenantPlanRouter = createTenantPlanRouter();

module.exports = {
  tenantPlanRouter,
  createTenantPlanRouter,
};
