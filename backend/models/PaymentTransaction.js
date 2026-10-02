const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const paymentTransactionSchema = new defaultMongoose.Schema(
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
      default: '',
    },
    customerEmail: {
      type: String,
      default: '',
    },
    subscriptionId: {
      type: defaultMongoose.Schema.Types.ObjectId,
      ref: 'CustomerSubscription',
      default: null,
    },
    planId: {
      type: defaultMongoose.Schema.Types.ObjectId,
      ref: 'TenantPlan',
      default: null,
    },
    planName: {
      type: String,
      default: '',
    },
    // Razorpay or gateway order ID
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    // Razorpay payment ID (populated upon capture)
    paymentId: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },
    signature: {
      type: String,
      default: null,
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
    provider: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'Manual'],
      default: 'Razorpay',
    },
    status: {
      type: String,
      enum: ['Created', 'Captured', 'Failed', 'Refunded', 'Pending'],
      default: 'Created',
      index: true,
    },
    method: {
      type: String,
      default: 'Razorpay UPI/Card',
    },
    failureReason: {
      type: String,
      default: null,
    },
    receipt: {
      type: String,
      default: null,
    },
    isMock: {
      type: Boolean,
      default: false,
    },
    idempotencyKey: {
      type: String,
      sparse: true,
      unique: true,
    },
    webhookEventId: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: defaultMongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Fast composite indexes for ledger auditing
paymentTransactionSchema.index({ tenantId: 1, createdAt: -1 });
paymentTransactionSchema.index({ tenantId: 1, status: 1 });

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.PaymentTransaction) {
    return m.models.PaymentTransaction;
  }
  return m.model('PaymentTransaction', paymentTransactionSchema);
}

const PaymentTransaction = new Proxy(function () {}, {
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

module.exports = PaymentTransaction;
