const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const changeItemSchema = new defaultMongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, default: '' },
  module: { type: String, default: '' },
  from: { type: Boolean, default: false },
  to: { type: Boolean, default: false },
});

const accessAuditLogSchema = new defaultMongoose.Schema(
  {
    organizationId: { type: defaultMongoose.Schema.Types.Mixed, required: true, index: true },
    organizationName: { type: String, default: '' },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, default: '' },
    adminEmail: { type: String, default: 'Super Admin' },
    targetUserId: { type: defaultMongoose.Schema.Types.Mixed, default: null },
    targetUserEmail: { type: String, default: '' },
    targetUserName: { type: String, default: '' },
    targetRole: { type: String, default: '' },
    action: {
      type: String,
      required: true,
      enum: [
        'permissions_saved',
        'trial_started',
        'trial_ended',
        'trial_extended',
        'status_changed',
        'template_applied',
        'access_cloned',
        'role_created',
        'organization_created',
      ],
    },
    summary: { type: String, default: '' },
    previousPermissions: { type: defaultMongoose.Schema.Types.Mixed, default: {} },
    newPermissions: { type: defaultMongoose.Schema.Types.Mixed, default: {} },
    changes: [changeItemSchema],
    modulesCount: { type: Number, default: 0 },
    featuresCount: { type: Number, default: 0 },
    ipAddress: { type: String, default: '127.0.0.1' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.AccessAuditLog) {
    return m.models.AccessAuditLog;
  }
  return m.model('AccessAuditLog', accessAuditLogSchema);
}

const AccessAuditLog = new Proxy(function () {}, {
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

module.exports = AccessAuditLog;
