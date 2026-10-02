const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');
const { encrypt, decrypt, maskSecret } = require('../services/encryptionService');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const tenantPaymentConfigSchema = new defaultMongoose.Schema(
  {
    tenantId: {
      type: defaultMongoose.Schema.Types.Mixed,
      required: true,
      unique: true,
      index: true,
    },
    tenantName: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'Manual'],
      default: 'Razorpay',
    },
    // Public Razorpay Key ID (e.g. "rzp_live_abc123" or "rzp_test_xyz789")
    keyId: {
      type: String,
      trim: true,
      default: '',
    },
    // AES-256-GCM Encrypted Razorpay Key Secret
    encryptedKeySecret: {
      type: String,
      default: '',
    },
    // AES-256-GCM Encrypted Webhook Signing Secret
    encryptedWebhookSecret: {
      type: String,
      default: '',
    },
    // Live vs Test Mode
    isLiveMode: {
      type: Boolean,
      default: false,
    },
    // Active gateway switch
    isEnabled: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    autoActivateSubscriptions: {
      type: Boolean,
      default: true,
    },
    webhookUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Virtual methods to decrypt credentials safely in backend services
tenantPaymentConfigSchema.methods.getDecryptedSecret = function () {
  return decrypt(this.encryptedKeySecret);
};

tenantPaymentConfigSchema.methods.getDecryptedWebhookSecret = function () {
  return decrypt(this.encryptedWebhookSecret);
};

// Safe JSON serialization: never expose decrypted or raw secrets to client
tenantPaymentConfigSchema.methods.toClientJSON = function () {
  const decryptedSecret = decrypt(this.encryptedKeySecret);
  const decryptedWebhook = decrypt(this.encryptedWebhookSecret);

  return {
    _id: this._id,
    tenantId: this.tenantId,
    tenantName: this.tenantName,
    provider: this.provider,
    keyId: this.keyId,
    keySecretMasked: maskSecret(decryptedSecret),
    webhookSecretMasked: maskSecret(decryptedWebhook),
    isConfigured: Boolean(this.keyId && this.encryptedKeySecret),
    isLiveMode: this.isLiveMode,
    isEnabled: this.isEnabled,
    currency: this.currency,
    webhookUrl: this.webhookUrl || `/api/payments/webhooks/razorpay/${this.tenantId}`,
    updatedAt: this.updatedAt,
  };
};

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.TenantPaymentConfig) {
    return m.models.TenantPaymentConfig;
  }
  return m.model('TenantPaymentConfig', tenantPaymentConfigSchema);
}

const TenantPaymentConfig = new Proxy(function () {}, {
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

module.exports = TenantPaymentConfig;
