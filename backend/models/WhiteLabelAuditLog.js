const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const auditLogSchema = new defaultMongoose.Schema(
  {
    actorEmail: { type: String, default: 'superadmin@system.io' },
    actorRole: { type: String, default: 'Super Admin' },
    action: { type: String, required: true },
    targetType: { type: String, default: 'General' },
    targetId: { type: String, default: '' },
    targetName: { type: String, default: '' },
    details: { type: defaultMongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '127.0.0.1' },
    status: {
      type: String,
      enum: ['Success', 'Warning', 'Failed'],
      default: 'Success',
    },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.WhiteLabelAuditLog) {
    return m.models.WhiteLabelAuditLog;
  }
  return m.model('WhiteLabelAuditLog', auditLogSchema);
}

const WhiteLabelAuditLog = new Proxy(function () {}, {
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

module.exports = WhiteLabelAuditLog;
