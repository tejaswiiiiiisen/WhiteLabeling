const express = require('express');
const permissionController = require('../controllers/permissionController');
const { requireSuperAdmin } = require('../middleware/permissionGuard');

function createPermissionRouter(authMiddleware = null, adminOnlyMiddleware = null) {
  const router = express.Router();

  // If host auth passed, apply it
  if (typeof authMiddleware === 'function') {
    router.use(authMiddleware);
  }

  // 1. Logged in user can view their active permissions
  router.get('/me', permissionController.getMyPermissions);

  // 2. Public / authenticated catalog of permissions
  router.get('/', permissionController.getAllPermissions);

  // Guard for Super Admin management endpoints
  const adminGuard = typeof adminOnlyMiddleware === 'function' ? adminOnlyMiddleware : requireSuperAdmin;

  // 3. Super Admin permission management per 2nd Person
  router.get('/users/:userId', adminGuard, permissionController.getUserPermissions);
  router.put('/users/:userId', adminGuard, permissionController.updateUserPermissions);

  // 4. Super Admin 2nd Person account lifecycle
  router.get('/second-persons', adminGuard, permissionController.getSecondPersons);
  router.post('/second-persons', adminGuard, permissionController.createSecondPerson);
  router.put('/second-persons/:id/status', adminGuard, permissionController.toggleSecondPersonStatus);
  router.delete('/second-persons/:id', adminGuard, permissionController.deleteSecondPerson);

  // 5. Audit logs
  router.get('/audit-logs', adminGuard, permissionController.getAuditLogs);

  return router;
}

module.exports = {
  createPermissionRouter,
  permissionRouter: createPermissionRouter(),
};
