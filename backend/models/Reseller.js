const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const resellerSchema = new defaultMongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    domain: { type: String, trim: true, default: '' },
    subdomain: { type: String, lowercase: true, trim: true, default: '' },
    commissionRate: { type: Number, default: 20, min: 0, max: 100 }, // Percentage
    tier: {
      type: String,
      enum: ['Agency', 'Silver', 'Gold', 'Platinum'],
      default: 'Silver',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Suspended'],
      default: 'Active',
    },
    totalCustomers: { type: Number, default: 0 },
    totalGMV: { type: Number, default: 0 },
    payoutDetails: {
      method: { type: String, default: 'Bank Transfer' },
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      routingNumber: { type: String, default: '' },
      upiId: { type: String, default: '' },
    },
    assignedProducts: [{ type: String }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.Reseller) {
    return m.models.Reseller;
  }
  return m.model('Reseller', resellerSchema);
}

const Reseller = new Proxy(function () {}, {
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

module.exports = Reseller;
