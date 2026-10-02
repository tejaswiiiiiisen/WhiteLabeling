const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const customerSubscriptionSchema = new defaultMongoose.Schema(
  {
    tenantId: {
      type: defaultMongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    customerId: {
      type: defaultMongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: '',
    },
    customerEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    companyName: {
      type: String,
      default: '',
    },
    planId: {
      type: defaultMongoose.Schema.Types.ObjectId,
      ref: 'TenantPlan',
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['Trial', 'Active', 'Past_Due', 'Cancelled', 'Expired', 'Suspended'],
      default: 'Active',
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    trialEndsAt: {
      type: Date,
      default: null,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
      default: null,
    },
    paymentProvider: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'Manual'],
      default: 'Razorpay',
    },
    latestPaymentId: {
      type: String,
      default: null,
    },
    latestOrderId: {
      type: String,
      default: null,
    },
    // Instant lookup array of granted feature keys
    featuresGranted: {
      type: [String],
      default: [],
    },
    limits: {
      maxEmployees: { type: Number, default: 50 },
      maxUsers: { type: Number, default: 10 },
      maxStorageGB: { type: Number, default: 5 },
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual check to verify if subscription is actively entitled
customerSubscriptionSchema.methods.isEntitled = function () {
  if (['Active', 'Trial'].includes(this.status)) {
    if (this.currentPeriodEnd && new Date() <= new Date(this.currentPeriodEnd)) {
      return true;
    }
  }
  return false;
};

customerSubscriptionSchema.index({ tenantId: 1, customerId: 1, status: 1 });

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.CustomerSubscription) {
    return m.models.CustomerSubscription;
  }
  return m.model('CustomerSubscription', customerSubscriptionSchema);
}

const CustomerSubscription = new Proxy(function () {}, {
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

module.exports = CustomerSubscription;
