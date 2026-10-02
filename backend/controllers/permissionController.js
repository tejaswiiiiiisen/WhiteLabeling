const Permission = require('../models/Permission');
const UserPermission = require('../models/UserPermission');
const PermissionAuditLog = require('../models/PermissionAuditLog');
const Reseller = require('../models/Reseller');
const TenantBranding = require('../models/TenantBranding');
const { getEffectivePermissions } = require('../middleware/permissionGuard');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : require('mongoose');
}

/**
 * Auto-seed master permissions catalog if not yet populated
 */
async function ensurePermissionsSeeded() {
  try {
    const count = await Permission.countDocuments();
    if (count === 0) {
      await Permission.insertMany(Permission.DEFAULT_PERMISSIONS);
    }
  } catch (err) {
    console.warn('[PermissionController] Seed note:', err.message);
  }
}

/**
 * GET /api/whitelabel/permissions
 * Returns all system permissions grouped by category
 */
exports.getAllPermissions = async (req, res) => {
  try {
    await ensurePermissionsSeeded();
    const permissions = await Permission.find().sort({ category: 1, order: 1, name: 1 }).lean();

    // Group by category
    const grouped = {};
    for (const p of permissions) {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    }

    return res.status(200).json({
      success: true,
      data: {
        list: permissions,
        grouped,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/whitelabel/permissions/me
 * Returns the active user's permissions
 */
exports.getMyPermissions = async (req, res) => {
  try {
    const role = String(req.user?.role || '').toLowerCase();
    const isSuperAdmin = role === 'superadmin';
    const permissions = await getEffectivePermissions(req.user);

    return res.status(200).json({
      success: true,
      data: {
        isSuperAdmin,
        role: req.user?.role || 'reseller',
        permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/whitelabel/permissions/users/:userId
 * Super Admin gets permissions for a specific 2nd Person
 */
exports.getUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    let record = await UserPermission.findOne({ userId }).lean();

    if (!record) {
      // Return default grant (all module view = true by default)
      const defaultMap = {};
      for (const p of Permission.DEFAULT_PERMISSIONS) {
        defaultMap[p.key] = true;
      }
      return res.status(200).json({
        success: true,
        data: {
          userId,
          permissions: defaultMap,
        },
      });
    }

    const permissions = record.permissions instanceof Map
      ? Object.fromEntries(record.permissions)
      : record.permissions || {};

    return res.status(200).json({
      success: true,
      data: {
        userId,
        permissions,
        lastUpdated: record.lastUpdated,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/whitelabel/permissions/users/:userId
 * Super Admin updates permissions for a specific 2nd Person
 */
exports.updateUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body; // Object with key: boolean

    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid permissions payload' });
    }

    // Read previous permissions for audit logging
    const previous = await UserPermission.findOne({ userId });
    const prevMap = previous?.permissions instanceof Map
      ? Object.fromEntries(previous.permissions)
      : previous?.permissions || {};

    // Calculate diffs and log each change
    const auditEntries = [];
    for (const [key, newVal] of Object.entries(permissions)) {
      const oldVal = Boolean(prevMap[key]);
      const nextVal = Boolean(newVal);

      if (oldVal !== nextVal) {
        auditEntries.push({
          adminId: req.user?.id || req.user?._id || 'superadmin',
          adminEmail: req.user?.email || 'superadmin@system.io',
          targetUserId: userId,
          permissionKey: key,
          oldValue: oldVal,
          newValue: nextVal,
          action: nextVal ? 'permission_enabled' : 'permission_disabled',
          ipAddress: req.ip || '127.0.0.1',
        });
      }
    }

    if (auditEntries.length > 0) {
      await PermissionAuditLog.insertMany(auditEntries);
    }

    // Upsert UserPermission
    const updated = await UserPermission.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          permissions,
          assignedBy: req.user?.id || req.user?._id,
          lastUpdated: new Date(),
        },
      },
      { upsert: true, new: true, returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: 'Permissions updated successfully.',
      data: updated,
      changesCount: auditEntries.length,
    });
  } catch (error) {
    console.error('[PermissionController] Error updating permissions:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2nd Person (Reseller / Client) Account Management ---

/**
 * GET /api/whitelabel/permissions/second-persons
 * Super Admin lists all 2nd Person accounts
 */
exports.getSecondPersons = async (req, res) => {
  try {
    const list = await Reseller.find().sort({ createdAt: -1 }).lean();

    // Attach enabled permissions count for each
    const result = await Promise.all(
      list.map(async (r) => {
        const up = await UserPermission.findOne({ userId: r._id.toString() }).lean();
        let enabledCount = 0;
        if (up?.permissions) {
          const m = up.permissions instanceof Map ? Object.fromEntries(up.permissions) : up.permissions;
          enabledCount = Object.values(m).filter(Boolean).length;
        } else {
          enabledCount = Permission.DEFAULT_PERMISSIONS.length; // Default all enabled
        }

        return {
          ...r,
          enabledPermissionsCount: enabledCount,
          totalPermissionsCount: Permission.DEFAULT_PERMISSIONS.length,
        };
      })
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/whitelabel/permissions/second-persons
 * Super Admin creates a new 2nd Person account with initial permissions
 */
exports.createSecondPerson = async (req, res) => {
  try {
    const { name, email, companyName, domain, tier, commissionRate, permissions } = req.body;

    // Check duplicate
    const existing = await Reseller.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Account with email '${email}' already exists.` });
    }

    const reseller = await Reseller.create({
      name,
      email,
      companyName,
      domain: domain || '',
      tier: tier || 'Silver',
      commissionRate: Number(commissionRate) || 20,
      status: 'Active',
    });

    // Default permissions or passed custom permissions
    const permMap = permissions && typeof permissions === 'object' ? permissions : {};
    if (Object.keys(permMap).length === 0) {
      for (const p of Permission.DEFAULT_PERMISSIONS) {
        permMap[p.key] = true;
      }
    }

    await UserPermission.create({
      userId: reseller._id.toString(),
      userEmail: reseller.email,
      role: 'reseller',
      permissions: permMap,
      assignedBy: req.user?.id || req.user?._id,
    });

    // Log audit
    await PermissionAuditLog.create({
      adminId: req.user?.id || req.user?._id || 'superadmin',
      adminEmail: req.user?.email || 'superadmin@system.io',
      targetUserId: reseller._id.toString(),
      targetUserEmail: reseller.email,
      targetUserName: reseller.name,
      action: 'account_created',
      details: { companyName, tier },
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.status(201).json({
      success: true,
      message: '2nd Person account created successfully.',
      data: reseller,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/whitelabel/permissions/second-persons/:id/status
 * Super Admin toggles 2nd Person account status (Active <-> Suspended)
 */
exports.toggleSecondPersonStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Active' or 'Suspended'

    const reseller = await Reseller.findByIdAndUpdate(id, { status }, { new: true });
    if (!reseller) {
      return res.status(404).json({ success: false, message: '2nd Person account not found' });
    }

    await PermissionAuditLog.create({
      adminId: req.user?.id || req.user?._id || 'superadmin',
      adminEmail: req.user?.email || 'superadmin@system.io',
      targetUserId: id,
      targetUserEmail: reseller.email,
      targetUserName: reseller.name,
      action: status === 'Active' ? 'account_activated' : 'account_suspended',
      details: { newStatus: status },
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.status(200).json({
      success: true,
      message: `Account status updated to ${status}.`,
      data: reseller,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/whitelabel/permissions/second-persons/:id
 * Super Admin deletes a 2nd Person account
 */
exports.deleteSecondPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const reseller = await Reseller.findByIdAndDelete(id);
    if (!reseller) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    await UserPermission.deleteOne({ userId: id });

    await PermissionAuditLog.create({
      adminId: req.user?.id || req.user?._id || 'superadmin',
      adminEmail: req.user?.email || 'superadmin@system.io',
      targetUserId: id,
      targetUserEmail: reseller.email,
      action: 'account_deleted',
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.status(200).json({ success: true, message: 'Account deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/whitelabel/permissions/audit-logs
 * Super Admin views permission change audit logs
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await PermissionAuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
