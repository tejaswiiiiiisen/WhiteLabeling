const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const permissionAuditLogSchema = new defaultMongoose.Schema(
  {
    adminId: { type: defaultMongoose.Schema.Types.Mixed, default: 'superadmin' },
    adminEmail: { type: String, default: 'superadmin@system.io' },
    targetUserId: { type: defaultMongoose.Schema.Types.Mixed, required: true, index: true },
    targetUserEmail: { type: String, default: '' },
    targetUserName: { type: String, default: '' },
    permissionKey: { type: String, default: '' },
    oldValue: { type: Boolean, default: false },
    newValue: { type: Boolean, default: false },
    action: {
      type: String,
      required: true,
      enum: [
        'permission_enabled',
        'permission_disabled',
        'permissions_batch_updated',
        'account_created',
        'account_updated',
        'account_activated',
        'account_suspended',
        'account_deleted',
      ],
    },
    details: { type: defaultMongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.PermissionAuditLog) {
    return m.models.PermissionAuditLog;
  }
  return m.model('PermissionAuditLog', permissionAuditLogSchema);
}

const PermissionAuditLog = new Proxy(function () {}, {
  get(target, prop) {
    const model = getModel();
    const val = model[prop];
    if (typeof val === 'function') {
      return val.bind(model);
    }
    return val;
  },
  apply(target, thisArg, args) {
    return Reflect.apply(getModel(), thisArg, args);
  },
  construct(target, args) {
    const ModelClass = getModel();
    return new ModelClass(...args);
  },
});

module.exports = PermissionAuditLog;
