const defaultMongoose = require('mongoose');

let explicitMongoose = null;

function setMongooseInstance(customMongoose) {
  if (customMongoose) {
    explicitMongoose = customMongoose;
  }
}

function getActiveMongoose() {
  if (explicitMongoose && (explicitMongoose.connection?.readyState === 1 || explicitMongoose.model)) {
    return explicitMongoose;
  }
  if (defaultMongoose.connection && defaultMongoose.connection.readyState === 1) {
    return defaultMongoose;
  }
  // Check require.cache for any connected or host application mongoose instance
  for (const key in require.cache) {
    if ((key.includes('mongoose\\index.js') || key.includes('mongoose/index.js')) && !key.includes('whitelabelling')) {
      const cached = require.cache[key]?.exports;
      if (cached && (cached.connection?.readyState === 1 || cached.model)) {
        return cached;
      }
    }
  }
  return explicitMongoose || defaultMongoose;
}

const tenantBrandingSchema = new defaultMongoose.Schema(
  {
    organizationId: {
      type: defaultMongoose.Schema.Types.Mixed,
      ref: 'Company',
      required: true,
      unique: true,
      index: true,
    },
    // --- Brand Identity ---
    companyName: {
      type: String,
      required: true,
      trim: true,
      default: 'Macenza HRMS',
    },
    legalName: {
      type: String,
      trim: true,
      default: '',
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Intelligent Enterprise Workspace',
    },

    // --- Domain & Subdomain Routing ---
    subdomain: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
      match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'],
    },
    customDomain: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },

    // --- Visual Assets ---
    logoUrl: {
      type: String,
      default: '',
    },
    darkLogoUrl: {
      type: String,
      default: '',
    },
    faviconUrl: {
      type: String,
      default: '',
    },
    loginBannerUrl: {
      type: String,
      default: '',
    },

    // --- Theme Color Palette ---
    primaryColor: {
      type: String,
      default: '#3B82F6', // Vibrant Blue
    },
    secondaryColor: {
      type: String,
      default: '#1E40AF',
    },
    accentColor: {
      type: String,
      default: '#10B981', // Emerald
    },
    sidebarBg: {
      type: String,
      default: '#0F172A', // Dark Slate
    },
    textColor: {
      type: String,
      default: '#0F172A',
    },
    fontFamily: {
      type: String,
      default: 'Inter, system-ui, sans-serif',
    },

    // --- SEO & Page Meta ---
    metaTitle: {
      type: String,
      default: 'HRMS Portal',
    },
    metaDescription: {
      type: String,
      default: 'Enterprise Human Resource Management System',
    },

    // --- Support & Footer Metadata ---
    supportEmail: {
      type: String,
      trim: true,
      default: '',
    },
    supportPhone: {
      type: String,
      trim: true,
      default: '',
    },
    copyrightText: {
      type: String,
      default: '© All rights reserved.',
    },

    // --- Switch & Custom CSS ---
    isWhitelabelActive: {
      type: Boolean,
      default: true,
    },
    // --- White Label Organization Status & Projects ---
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    assignedProjects: {
      type: [String],
      default: ['hrms'],
    },
    trialStatus: {
      type: String,
      enum: ['None', 'Active', 'Expired'],
      default: 'None',
    },
    subscriptionStatus: {
      type: String,
      enum: ['Active', 'Trial', 'Inactive', 'Past Due'],
      default: 'Active',
    },
    usersCount: {
      type: Number,
      default: 0,
    },
    enabledFeaturesCount: {
      type: Number,
      default: 0,
    },
    customCss: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'tenant_brandings',
  }
);

// Helper method to export safe public branding object (no sensitive internal fields)
tenantBrandingSchema.methods.toPublicJSON = function () {
  return {
    organizationId: this.organizationId,
    companyName: this.companyName,
    tagline: this.tagline,
    subdomain: this.subdomain,
    customDomain: this.customDomain,
    logoUrl: this.logoUrl,
    darkLogoUrl: this.darkLogoUrl,
    faviconUrl: this.faviconUrl,
    loginBannerUrl: this.loginBannerUrl,
    primaryColor: this.primaryColor,
    secondaryColor: this.secondaryColor,
    accentColor: this.accentColor,
    sidebarBg: this.sidebarBg,
    textColor: this.textColor,
    fontFamily: this.fontFamily,
    metaTitle: this.metaTitle,
    metaDescription: this.metaDescription,
    supportEmail: this.supportEmail,
    supportPhone: this.supportPhone,
    copyrightText: this.copyrightText,
    isWhitelabelActive: this.isWhitelabelActive,
  };
};

function getModel() {
  const m = getActiveMongoose();
  if (m.models && m.models.TenantBranding) {
    return m.models.TenantBranding;
  }
  return m.model('TenantBranding', tenantBrandingSchema);
}

// Proxy wrapper so model calls (findOne, create, findOneAndUpdate, etc.) always execute on the active connected mongoose
const TenantBranding = new Proxy(function () {}, {
  get(target, prop) {
    const model = getModel();
    const val = model[prop];
    if (typeof val === 'function') {
      return val.bind(model);
    }
    return val;
  },
  apply(target, thisArg, args) {
    const model = getModel();
    return Reflect.apply(model, thisArg, args);
  },
  construct(target, args) {
    const ModelClass = getModel();
    return new ModelClass(...args);
  }
});

TenantBranding.setMongoose = setMongooseInstance;
TenantBranding.getActiveMongoose = getActiveMongoose;
TenantBranding.schema = tenantBrandingSchema;

module.exports = TenantBranding;
