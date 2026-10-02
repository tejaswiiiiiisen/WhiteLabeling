const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const userPermissionSchema = new defaultMongoose.Schema(
  {
    userId: {
      type: defaultMongoose.Schema.Types.Mixed,
      required: true,
      unique: true,
      index: true,
    },
    userEmail: { type: String, lowercase: true, trim: true },
    role: { type: String, default: 'reseller' }, // 'reseller' or 2nd Person
    // Map of permissionKey -> boolean (e.g. 'branding.logo.update': true)
    permissions: {
      type: Map,
      of: Boolean,
      default: {},
    },
    assignedBy: { type: defaultMongoose.Schema.Types.Mixed, default: null },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.UserPermission) {
    return m.models.UserPermission;
  }
  return m.model('UserPermission', userPermissionSchema);
}

const UserPermission = new Proxy(function () {}, {
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

module.exports = UserPermission;
