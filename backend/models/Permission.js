const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const permissionSchema = new defaultMongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'White Label',
        'Dashboard',
        'Users',
        'Customers',
        'Products',
        'Orders',
        'Inventory',
        'Payments',
        'Reports',
        'Analytics',
        'Settings',
        'Subscription',
        'Notifications',
        'Profile',
        'Audit Logs',
      ],
    },
    module: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    parentKey: { type: String, default: null }, // e.g. 'users.create' depends on 'users.view'
    description: { type: String, default: '' },
    isWhiteLabel: { type: Boolean, default: false },
    isPage: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Standard Master Permission Registry Catalog
const DEFAULT_PERMISSIONS = [
  // --- White Label Permissions ---
  { key: 'branding.company_name.view', name: 'View Company Name', category: 'White Label', module: 'branding', action: 'view', isWhiteLabel: true, description: 'View current company name branding' },
  { key: 'branding.company_name.update', name: 'Change Company Name', category: 'White Label', module: 'branding', action: 'update', parentKey: 'branding.company_name.view', isWhiteLabel: true, description: 'Modify tenant company brand name' },
  { key: 'branding.logo.view', name: 'View Logo', category: 'White Label', module: 'branding', action: 'view', isWhiteLabel: true, description: 'View tenant logo' },
  { key: 'branding.logo.update', name: 'Change Logo', category: 'White Label', module: 'branding', action: 'update', parentKey: 'branding.logo.view', isWhiteLabel: true, description: 'Upload and update light & dark logo' },
  { key: 'branding.favicon.view', name: 'View Favicon', category: 'White Label', module: 'branding', action: 'view', isWhiteLabel: true, description: 'View browser favicon' },
  { key: 'branding.favicon.update', name: 'Change Favicon', category: 'White Label', module: 'branding', action: 'update', parentKey: 'branding.favicon.view', isWhiteLabel: true, description: 'Upload browser favicon' },
  { key: 'branding.theme.view', name: 'View Theme Colors', category: 'White Label', module: 'branding', action: 'view', isWhiteLabel: true, description: 'View theme color settings' },
  { key: 'branding.theme.update', name: 'Change Theme Colors', category: 'White Label', module: 'branding', action: 'update', parentKey: 'branding.theme.view', isWhiteLabel: true, description: 'Change primary, secondary, and accent colors' },
  { key: 'branding.login_page.update', name: 'Change Login Page Branding', category: 'White Label', module: 'branding', action: 'update', isWhiteLabel: true, description: 'Customize authentication page layout and banner' },
  { key: 'branding.dashboard.update', name: 'Change Dashboard Branding', category: 'White Label', module: 'branding', action: 'update', isWhiteLabel: true, description: 'Customize dashboard hero and console widgets' },
  { key: 'branding.footer.update', name: 'Change Footer Copyright', category: 'White Label', module: 'branding', action: 'update', isWhiteLabel: true, description: 'Customize footer text and copyright statements' },
  { key: 'branding.header.update', name: 'Change Header Branding', category: 'White Label', module: 'branding', action: 'update', isWhiteLabel: true, description: 'Customize navigation header title and brand mark' },
  { key: 'branding.meta.update', name: 'Change Website Title & SEO', category: 'White Label', module: 'branding', action: 'update', isWhiteLabel: true, description: 'Customize browser title, meta description & OG tags' },
  { key: 'branding.custom_css.update', name: 'Change Custom CSS', category: 'White Label', module: 'branding', action: 'update', isWhiteLabel: true, description: 'Inject custom stylesheet rules and overrides' },
  { key: 'branding.email.update', name: 'Change Email Branding', category: 'White Label', module: 'branding', action: 'update', isWhiteLabel: true, description: 'Configure notification email banners and footer signatures' },
  { key: 'domain.view', name: 'View Custom Domain', category: 'White Label', module: 'domain', action: 'view', isWhiteLabel: true, description: 'View domain routing records' },
  { key: 'domain.update', name: 'Change Custom Domain & DNS', category: 'White Label', module: 'domain', action: 'update', parentKey: 'domain.view', isWhiteLabel: true, description: 'Bind custom domains and verify SSL' },

  // --- Page-Level & Module Permissions ---
  { key: 'dashboard.view', name: 'Dashboard Page', category: 'Dashboard', module: 'dashboard', action: 'view', isPage: true, description: 'Access dashboard analytics and widgets' },

  // Users
  { key: 'users.view', name: 'Users Page (View Users)', category: 'Users', module: 'users', action: 'view', isPage: true, description: 'View users and employee directory' },
  { key: 'users.create', name: 'Create User', category: 'Users', module: 'users', action: 'create', parentKey: 'users.view', description: 'Create new user accounts' },
  { key: 'users.edit', name: 'Edit User', category: 'Users', module: 'users', action: 'edit', parentKey: 'users.view', description: 'Modify user profiles and roles' },
  { key: 'users.delete', name: 'Delete User', category: 'Users', module: 'users', action: 'delete', parentKey: 'users.view', description: 'Remove user accounts' },
  { key: 'users.block', name: 'Block / Suspend User', category: 'Users', module: 'users', action: 'block', parentKey: 'users.view', description: 'Deactivate or suspend user logins' },

  // Customers
  { key: 'customers.view', name: 'Customers Page (View Customers)', category: 'Customers', module: 'customers', action: 'view', isPage: true, description: 'Access customer and organization directory' },
  { key: 'customers.create', name: 'Create Customer', category: 'Customers', module: 'customers', action: 'create', parentKey: 'customers.view', description: 'Add new client records' },
  { key: 'customers.edit', name: 'Edit Customer', category: 'Customers', module: 'customers', action: 'edit', parentKey: 'customers.view', description: 'Update customer details' },
  { key: 'customers.delete', name: 'Delete Customer', category: 'Customers', module: 'customers', action: 'delete', parentKey: 'customers.view', description: 'Delete customer records' },

  // Products
  { key: 'products.view', name: 'Products Page (View Products)', category: 'Products', module: 'products', action: 'view', isPage: true, description: 'Browse products catalogue' },
  { key: 'products.create', name: 'Create Product', category: 'Products', module: 'products', action: 'create', parentKey: 'products.view', description: 'Add new product offerings' },
  { key: 'products.edit', name: 'Edit Product', category: 'Products', module: 'products', action: 'edit', parentKey: 'products.view', description: 'Modify product configurations' },
  { key: 'products.delete', name: 'Delete Product', category: 'Products', module: 'products', action: 'delete', parentKey: 'products.view', description: 'Delete products' },

  // Orders
  { key: 'orders.view', name: 'Orders Page (View Orders)', category: 'Orders', module: 'orders', action: 'view', isPage: true, description: 'View client purchase orders' },
  { key: 'orders.create', name: 'Create Order', category: 'Orders', module: 'orders', action: 'create', parentKey: 'orders.view', description: 'Generate orders' },
  { key: 'orders.edit', name: 'Edit Order', category: 'Orders', module: 'orders', action: 'edit', parentKey: 'orders.view', description: 'Update order details' },
  { key: 'orders.delete', name: 'Delete Order', category: 'Orders', module: 'orders', action: 'delete', parentKey: 'orders.view', description: 'Remove order entries' },
  { key: 'orders.cancel', name: 'Cancel Order', category: 'Orders', module: 'orders', action: 'cancel', parentKey: 'orders.view', description: 'Mark orders as cancelled' },

  // Inventory
  { key: 'inventory.view', name: 'Inventory Page', category: 'Inventory', module: 'inventory', action: 'view', isPage: true, description: 'View stock and asset inventories' },
  { key: 'inventory.manage', name: 'Manage Inventory', category: 'Inventory', module: 'inventory', action: 'manage', parentKey: 'inventory.view', description: 'Adjust stock levels and assets' },

  // Payments
  { key: 'payments.view', name: 'Payments Page (View Payments)', category: 'Payments', module: 'payments', action: 'view', isPage: true, description: 'View payment transactions and invoices' },
  { key: 'payments.manage', name: 'Manage Payments & Gateways', category: 'Payments', module: 'payments', action: 'manage', parentKey: 'payments.view', description: 'Configure gateways and process refunds' },

  // Reports
  { key: 'reports.view', name: 'Reports Page', category: 'Reports', module: 'reports', action: 'view', isPage: true, description: 'View platform reports' },
  { key: 'reports.export', name: 'Export Reports (CSV/PDF)', category: 'Reports', module: 'reports', action: 'export', parentKey: 'reports.view', description: 'Download report exports' },

  // Analytics
  { key: 'analytics.view', name: 'Analytics Page', category: 'Analytics', module: 'analytics', action: 'view', isPage: true, description: 'View deep performance metrics and graphs' },

  // Settings
  { key: 'settings.view', name: 'Settings Page', category: 'Settings', module: 'settings', action: 'view', isPage: true, description: 'Access workspace settings' },
  { key: 'settings.edit', name: 'Edit Settings', category: 'Settings', module: 'settings', action: 'edit', parentKey: 'settings.view', description: 'Modify workspace preferences' },

  // Subscription
  { key: 'subscription.view', name: 'Subscription Page', category: 'Subscription', module: 'subscription', action: 'view', isPage: true, description: 'View subscription plan details' },
  { key: 'subscription.manage', name: 'Manage Subscription', category: 'Subscription', module: 'subscription', action: 'manage', parentKey: 'subscription.view', description: 'Upgrade, downgrade, or cancel subscription' },

  // Notifications
  { key: 'notifications.view', name: 'Notifications Page', category: 'Notifications', module: 'notifications', action: 'view', isPage: true, description: 'View notifications' },
  { key: 'notifications.manage', name: 'Manage Notification Rules', category: 'Notifications', module: 'notifications', action: 'manage', parentKey: 'notifications.view', description: 'Configure alerts and channel webhooks' },

  // Profile
  { key: 'profile.view', name: 'Profile Page', category: 'Profile', module: 'profile', action: 'view', isPage: true, description: 'Access user profile' },
  { key: 'profile.edit', name: 'Edit Profile', category: 'Profile', module: 'profile', action: 'edit', parentKey: 'profile.view', description: 'Update profile info' },

  // Audit Logs
  { key: 'audit_logs.view', name: 'Audit Logs Page', category: 'Audit Logs', module: 'audit_logs', action: 'view', isPage: true, description: 'View administrative audit logs' },
];

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.Permission) {
    return m.models.Permission;
  }
  return m.model('Permission', permissionSchema);
}

const Permission = new Proxy(function () {}, {
  get(target, prop) {
    if (prop === 'DEFAULT_PERMISSIONS') {
      return DEFAULT_PERMISSIONS;
    }
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

Permission.DEFAULT_PERMISSIONS = DEFAULT_PERMISSIONS;

module.exports = Permission;
