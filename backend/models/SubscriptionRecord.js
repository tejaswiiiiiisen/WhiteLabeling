const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const subscriptionRecordSchema = new defaultMongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    plan: {
      type: String,
      required: true,
      trim: true,
    },
    billingCadence: {
      type: String,
      enum: ['Monthly', 'Yearly', 'monthly', 'yearly'],
      default: 'Monthly',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      default: 'Paid',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'Active', 'PENDING', 'Pending', 'CANCELLED', 'Cancelled', 'PAST_DUE', 'FAILED'],
      default: 'ACTIVE',
      index: true,
    },
    platformRevenuePercentage: {
      type: Number,
      default: 35,
    },
    partnerRevenuePercentage: {
      type: Number,
      default: 65,
    },
    platformRevenueAmount: {
      type: Number,
      required: true,
    },
    partnerRevenueAmount: {
      type: Number,
      required: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailError: {
      type: String,
      default: null,
    },
    projectId: {
      type: String,
      default: 'hotel',
      index: true,
    },
    tenantId: {
      type: defaultMongoose.Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: defaultMongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

subscriptionRecordSchema.index({ projectId: 1, customerEmail: 1, createdAt: -1 });

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.SubscriptionRecord) {
    return m.models.SubscriptionRecord;
  }
  return m.model('SubscriptionRecord', subscriptionRecordSchema);
}

const SubscriptionRecord = new Proxy(function () {}, {
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

module.exports = SubscriptionRecord;
