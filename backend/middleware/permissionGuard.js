const ProjectAccessAssignment = require('../models/ProjectAccessAssignment');

/**
 * Helper to fetch a 2nd Person's active permissions map.
 * Supports simulation/preview mode for Super Admin when preview headers are present.
 */
async function getEffectivePermissions(user, req) {
  const isPreview =
    req?.headers?.['x-whitelabel-preview'] === 'true' ||
    req?.headers?.['x-preview-mode'] === 'true' ||
    req?.query?.preview === 'true';

  const previewOrgId =
    req?.headers?.['x-whitelabel-org'] ||
    req?.headers?.['x-organization-id'] ||
    req?.query?.organizationId ||
    user?.organizationId ||
    '6a474a798a36ace2cc04c1be';

  const role = String(user?.role || '').toLowerCase();

  // If Super Admin AND NOT in simulated preview mode, grant all
  if (role === 'superadmin' && !isPreview) {
    const all = Permission.DEFAULT_PERMISSIONS || [];
    const map = {};
    for (const p of all) {
      map[p.key] = true;
    }
    // Also include standard project hierarchy keys
    const hrmsMods = [
      'dashboard', 'employees', 'attendance', 'leave', 'projects',
      'payroll', 'recruitment', 'assets', 'policies', 'holidays',
      'notice', 'settings', 'subscription'
    ];
    for (const m of hrmsMods) {
      map[`${m}.view`] = true;
    }
    return map;
  }

  // Otherwise: Resolve real permissions from ProjectAccessAssignment & UserPermission
  const targetOrgId = previewOrgId;
  const userEmail = user?.email?.toLowerCase();

  try {
    // 1. Query ProjectAccessAssignment for organization & project
    const assignment = await ProjectAccessAssignment.findOne({
      $or: [{ organizationId: targetOrgId }, { organizationId: String(targetOrgId) }],
      projectId: 'hrms',
    }).lean();

    let perms = {};
    if (assignment && assignment.permissions) {
      perms = assignment.permissions instanceof Map
        ? Object.fromEntries(assignment.permissions)
        : assignment.permissions;
    }

    // Ensure module-level .view keys reflect modulesEnabled
    if (assignment && assignment.modulesEnabled) {
      for (const modId of assignment.modulesEnabled) {
        if (perms[`${modId}.view`] === undefined) {
          perms[`${modId}.view`] = true;
        }
      }
    }

    // 2. Query UserPermission collection for user overrides
    if (userEmail) {
      const userRecord = await UserPermission.findOne({
        $or: [{ userEmail }, { userId: String(user.id || user._id) }],
      }).lean();

      if (userRecord && userRecord.permissions) {
        const uPerms = userRecord.permissions instanceof Map
          ? Object.fromEntries(userRecord.permissions)
          : userRecord.permissions;
        perms = { ...perms, ...uPerms };
      }
    }

    return perms;
  } catch (err) {
    console.warn('[PermissionGuard] Error reading permissions:', err.message);
    return {};
  }
}

/**
 * Express middleware to strictly enforce a required permission on a route.
 * Returns 403 Forbidden if the user does not possess the permission or if parent dependency fails.
 */
function requirePermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. No user context found.',
        });
      }

      const role = String(req.user.role || '').toLowerCase();

      // 1. Super Admin bypasses all checks
      if (role === 'superadmin') {
        return next();
      }

      // 2. Fetch user's permissions
      const permissions = await getEffectivePermissions(req.user);

      // 3. Check Parent Dependency if permission has one
      const permDefinition = (Permission.DEFAULT_PERMISSIONS || []).find((p) => p.key === requiredPermission);
      if (permDefinition && permDefinition.parentKey) {
        if (!permissions[permDefinition.parentKey]) {
          return res.status(403).json({
            success: false,
            message: `Access Denied: Parent module permission '${permDefinition.parentKey}' is disabled.`,
            missingPermission: permDefinition.parentKey,
          });
        }
      }

      // 4. Check the specific permission
      if (permissions[requiredPermission] === true) {
        return next();
      }

      // 5. Forbidden
      return res.status(403).json({
        success: false,
        message: `Access Denied: Missing required permission '${requiredPermission}'.`,
        missingPermission: requiredPermission,
      });
    } catch (error) {
      console.error('[PermissionGuard] Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal authorization error.',
        error: error.message,
      });
    }
  };
}

/**
 * Middleware ensuring only Super Admins can access Super Admin endpoints.
 */
function requireSuperAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const role = String(req.user.role || '').toLowerCase();
  if (role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Super Admin privileges required.',
    });
  }
  next();
}

module.exports = {
  getEffectivePermissions,
  requirePermission,
  requireSuperAdmin,
};
