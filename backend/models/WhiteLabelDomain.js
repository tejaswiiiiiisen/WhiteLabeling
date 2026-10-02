const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const domainSchema = new defaultMongoose.Schema(
  {
    domain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    organizationId: { type: defaultMongoose.Schema.Types.Mixed, default: null },
    companyName: { type: String, default: '' },
    resellerName: { type: String, default: 'Direct / System' },
    type: { type: String, enum: ['Custom Domain', 'Subdomain'], default: 'Custom Domain' },
    sslStatus: {
      type: String,
      enum: ['Active', 'Pending', 'Expired', 'Renewing'],
      default: 'Active',
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Pending DNS', 'Failed'],
      default: 'Verified',
    },
    cnameTarget: { type: String, default: 'whitelabel.macenza.com' },
    dnsTxtRecord: { type: String, default: 'macenza-verify=v1-' + Date.now() },
    lastCheckedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.WhiteLabelDomain) {
    return m.models.WhiteLabelDomain;
  }
  return m.model('WhiteLabelDomain', domainSchema);
}

const WhiteLabelDomain = new Proxy(function () {}, {
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

module.exports = WhiteLabelDomain;
