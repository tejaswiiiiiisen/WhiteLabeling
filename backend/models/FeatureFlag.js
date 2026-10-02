const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const featureFlagSchema = new defaultMongoose.Schema(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    isGlobalEnabled: { type: Boolean, default: true },
    allowedPlans: {
      type: [String],
      default: ['Growth', 'Professional', 'Enterprise'],
    },
    rolloutStatus: {
      type: String,
      enum: ['GA', 'Beta', 'Alpha', 'Internal Only'],
      default: 'GA',
    },
    tenantOverrides: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.FeatureFlag) {
    return m.models.FeatureFlag;
  }
  return m.model('FeatureFlag', featureFlagSchema);
}

const FeatureFlag = new Proxy(function () {}, {
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

module.exports = FeatureFlag;
