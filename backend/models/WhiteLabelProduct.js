const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const whiteLabelProductSchema = new defaultMongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Core SaaS' },
    version: { type: String, default: '2.4.0' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Layers' },
    basePrice: { type: Number, default: 49 },
    billingCycle: { type: String, enum: ['monthly', 'annual', 'one-time'], default: 'monthly' },
    status: {
      type: String,
      enum: ['Published', 'Beta', 'Coming Soon', 'Archived'],
      default: 'Published',
    },
    allowedTiers: {
      type: [String],
      default: ['Agency', 'Silver', 'Gold', 'Platinum'],
    },
    featureKeys: [{ type: String }],
    activeResellersCount: { type: Number, default: 0 },
    documentationUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.WhiteLabelProduct) {
    return m.models.WhiteLabelProduct;
  }
  return m.model('WhiteLabelProduct', whiteLabelProductSchema);
}

const WhiteLabelProduct = new Proxy(function () {}, {
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

module.exports = WhiteLabelProduct;
