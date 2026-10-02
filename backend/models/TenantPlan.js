const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const planFeatureItemSchema = new defaultMongoose.Schema({
  key: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  included: { type: Boolean, default: true },
  customLimit: { type: String, default: '' },
});

const tenantPlanSchema = new defaultMongoose.Schema(
  {
    tenantId: {
      type: defaultMongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    projectId: {
      type: String,
      default: 'hrms',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: '',
    },
    monthlyPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    yearlyPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    features: [planFeatureItemSchema],
    limits: {
      maxEmployees: { type: Number, default: 50 },
      maxUsers: { type: Number, default: 10 },
      maxStorageGB: { type: Number, default: 5 },
      customDomainAllowed: { type: Boolean, default: false },
      apiAccessAllowed: { type: Boolean, default: false },
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'both'],
      default: 'both',
    },
    trialDays: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Archived'],
      default: 'Active',
      index: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    activeSubscribersCount: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of slug per tenant & project
tenantPlanSchema.index({ tenantId: 1, projectId: 1, slug: 1 }, { unique: true });

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.TenantPlan) {
    return m.models.TenantPlan;
  }
  return m.model('TenantPlan', tenantPlanSchema);
}

const TenantPlan = new Proxy(function () {}, {
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

module.exports = TenantPlan;
