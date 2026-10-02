const express = require('express');
const controller = require('../controllers/projectAccessController');

function createProjectAccessRouter(authenticateMiddleware, authorizeMiddleware) {
  const router = express.Router();

  // Middleware bypass or passthrough for dev/standalone flexibility
  const auth = typeof authenticateMiddleware === 'function' ? authenticateMiddleware : (req, res, next) => next();

  // 1. Organizations
  router.get('/organizations', controller.getOrganizations);
  router.post('/organizations', auth, controller.createOrganization);
  router.put('/organizations/:id', auth, controller.updateOrganization);
  router.delete('/organizations/:id', auth, controller.deleteOrganization);
  router.patch('/organizations/:id/status', auth, controller.toggleOrgStatus);

  // 2. Projects & Hierarchy
  router.get('/projects', controller.getProjects);
  router.get('/projects/:projectId/hierarchy', controller.getProjectHierarchy);

  // 3. Access Assignment & Permissions
  router.get('/assignments/:organizationId/:projectId?', controller.getAssignment);
  router.post('/assignments', auth, controller.saveAssignment);

  // 4. Trial Mode
  router.post('/trial/start', auth, controller.startTrial);
  router.post('/trial/end', auth, controller.endTrial);
  router.post('/trial/extend', auth, controller.extendTrial);

  // 5. Clone Access
  router.post('/clone', auth, controller.cloneAccess);

  // 6. Templates
  router.get('/templates', controller.getTemplates);
  router.post('/templates', auth, controller.createTemplate);
  router.delete('/templates/:id', auth, controller.deleteTemplate);

  // 7. Custom Roles
  router.get('/roles', controller.getCustomRoles);
  router.post('/roles', auth, controller.createCustomRole);

  // 8. Audit Logs & Access Tracker
  router.get('/audit-logs', controller.getAuditLogs);

  // 9. Live Preview Context & Action Verifier
  router.get('/preview-context', controller.getLivePreviewContext);
  router.post('/verify-action', controller.verifyAction);

  // 10. Accept Client Request & Automatic Email
  router.post('/accept-request', controller.acceptClientRequest);
  router.patch('/accept-request', controller.acceptClientRequest);
  router.post('/setup-requests/:id/accept', controller.acceptClientRequest);
  router.patch('/setup-requests/:id/accept', controller.acceptClientRequest);

  return router;
}

const projectAccessRouter = createProjectAccessRouter();

module.exports = {
  projectAccessRouter,
  createProjectAccessRouter,
};
