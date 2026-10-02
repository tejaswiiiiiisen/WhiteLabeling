const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const customRoleSchema = new defaultMongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    projectId: { type: String, default: 'hrms', index: true },
    organizationId: { type: defaultMongoose.Schema.Types.Mixed, default: null },
    permissions: {
      type: defaultMongoose.Schema.Types.Mixed,
      default: {},
    },
    modulesEnabled: {
      type: [String],
      default: [],
    },
    isDefault: { type: Boolean, default: false },
    createdBy: { type: String, default: 'Super Admin' },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.CustomRole) {
    return m.models.CustomRole;
  }
  return m.model('CustomRole', customRoleSchema);
}

const CustomRole = new Proxy(function () {}, {
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

module.exports = CustomRole;
