const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const whiteLabelTemplateSchema = new defaultMongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Corporate' },
    description: { type: String, default: '' },
    colors: {
      primary: { type: String, default: '#3B82F6' },
      secondary: { type: String, default: '#1E40AF' },
      accent: { type: String, default: '#10B981' },
      sidebarBg: { type: String, default: '#0F172A' },
      textColor: { type: String, default: '#0F172A' },
    },
    fontFamily: { type: String, default: 'Inter, system-ui, sans-serif' },
    borderRadius: { type: String, default: '12px' },
    previewImage: { type: String, default: '' },
    customCss: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    activeTenantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.WhiteLabelTemplate) {
    return m.models.WhiteLabelTemplate;
  }
  return m.model('WhiteLabelTemplate', whiteLabelTemplateSchema);
}

const WhiteLabelTemplate = new Proxy(function () {}, {
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

module.exports = WhiteLabelTemplate;
