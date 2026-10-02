const ProjectAccessAssignment = require('../models/ProjectAccessAssignment');
const UserPermission = require('../models/UserPermission');

/**
 * Middleware factory to enforce fine-grained project permissions at the API route level.
 * @param {string} requiredPermission - e.g. 'employees.delete', 'payroll.view', 'recruitment.create'
 * @param {string} projectId - default 'hrms'
 */
function requireProjectPermission(requiredPermission, projectId = 'hrms') {
  return async (req, res, next) => {
    try {
      // 1. Super Admin bypass (System Super Admin has full unrestricted access)
      const userRole = String(req.user?.role || '').toLowerCase();
      if (userRole === 'superadmin') {
        return next();
      }

      // 2. Identify target user & organization context
      const userEmail = req.user?.email ? req.user.email.toLowerCase() : null;
      const organizationId =
        req.user?.organizationId ||
        req.headers['x-organization-id'] ||
        req.headers['x-whitelabel-org'] ||
        req.query.organizationId;

      // 3. First check user-specific permissions (e.g. from UserPermission collection)
      if (userEmail) {
        const userPermRecord = await UserPermission.findOne({ userEmail }).lean();
        if (userPermRecord && userPermRecord.permissions) {
          const uPerms = userPermRecord.permissions instanceof Map
            ? Object.fromEntries(userPermRecord.permissions)
            : userPermRecord.permissions;

          if (uPerms[requiredPermission] === false) {
            return res.status(403).json({
              success: false,
              code: 'ACCESS_DENIED',
              message: `Access Denied: You do not have permission '${requiredPermission}' in this project.`,
              requiredPermission,
            });
          }
        }
      }

      // 4. Check ProjectAccessAssignment for the organization
      if (organizationId) {
        const assignment = await ProjectAccessAssignment.findOne({
          $or: [{ organizationId }, { organizationId: String(organizationId) }],
          projectId,
        }).lean();

        if (assignment) {
          // Check if Trial is expired
          if (assignment.trial?.isActive && assignment.trial.endDate) {
            if (new Date() > new Date(assignment.trial.endDate)) {
              return res.status(403).json({
                success: false,
                code: 'TRIAL_EXPIRED',
                message: 'Access Denied: Organization trial has expired. Please contact your Super Administrator.',
              });
            }
          }

          // Check if module itself is enabled
          const moduleKey = requiredPermission.split('.')[0];
          if (assignment.modulesEnabled && assignment.modulesEnabled.length > 0) {
            if (!assignment.modulesEnabled.includes(moduleKey)) {
              return res.status(403).json({
                success: false,
                code: 'MODULE_DISABLED',
                message: `Access Denied: Module '${moduleKey}' is disabled for your organization.`,
                module: moduleKey,
              });
            }
          }

          // Check feature-level permission
          const perms = assignment.permissions instanceof Map
            ? Object.fromEntries(assignment.permissions)
            : assignment.permissions || {};

          if (perms[requiredPermission] === false) {
            return res.status(403).json({
              success: false,
              code: 'ACCESS_DENIED',
              message: `Access Denied: Action '${requiredPermission}' is blocked in this project configuration.`,
              requiredPermission,
            });
          }
        }
      }

      // Passed all checks
      next();
    } catch (error) {
      console.error('[projectPermissionGuard] Error:', error.message);
      // Fail closed for security
      return res.status(500).json({
        success: false,
        code: 'AUTH_ERROR',
        message: 'Internal authorization error.',
      });
    }
  };
}

module.exports = {
  requireProjectPermission,
};
