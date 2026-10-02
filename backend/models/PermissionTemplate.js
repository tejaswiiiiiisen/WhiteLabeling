const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const permissionTemplateSchema = new defaultMongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    projectId: { type: String, default: 'hrms', index: true },
    permissions: {
      type: defaultMongoose.Schema.Types.Mixed,
      default: {},
    },
    modulesEnabled: {
      type: [String],
      default: [],
    },
    isSystem: { type: Boolean, default: false },
    icon: { type: String, default: 'ShieldCheck' },
  },
  { timestamps: true }
);

// Standard Predefined System Templates
const DEFAULT_TEMPLATES = [
  {
    name: 'HR Manager Template',
    description: 'Manages employees, attendance, leaves, and recruitment; blocked from payroll and settings.',
    projectId: 'hrms',
    isSystem: true,
    modulesEnabled: ['dashboard', 'employees', 'attendance', 'leave', 'recruitment', 'notice'],
    permissions: {
      'dashboard.view': true,
      'dashboard.statistics': true,
      'dashboard.charts': true,
      'dashboard.export': true,
      'employees.view': true,
      'employees.create': true,
      'employees.edit': true,
      'employees.delete': false,
      'employees.profile': true,
      'employees.import': true,
      'employees.export': true,
      'attendance.view': true,
      'attendance.mark': true,
      'attendance.edit': true,
      'attendance.reports': true,
      'attendance.export': true,
      'leave.view': true,
      'leave.apply': true,
      'leave.approve': true,
      'leave.reject': true,
      'leave.reports': true,
      'recruitment.view': true,
      'recruitment.create': true,
      'recruitment.edit': true,
      'recruitment.interviews': true,
      'recruitment.reports': true,
      'notice.view': true,
      'notice.create': true,
      // Blocked
      'payroll.view': false,
      'payroll.create': false,
      'settings.view': false,
      'subscription.view': false,
    },
  },
  {
    name: 'Accountant Template',
    description: 'Full payroll, invoices, expenses, and compensation ledger; blocked from recruitment.',
    projectId: 'hrms',
    isSystem: true,
    modulesEnabled: ['dashboard', 'payroll', 'employees', 'subscription'],
    permissions: {
      'dashboard.view': true,
      'dashboard.statistics': true,
      'dashboard.export': true,
      'employees.view': true,
      'employees.profile': true,
      'payroll.view': true,
      'payroll.create': true,
      'payroll.edit': true,
      'payroll.delete': false,
      'payroll.generate_payslip': true,
      'payroll.download_payslip': true,
      'payroll.reports': true,
      'subscription.view': true,
      'subscription.billing': true,
      'subscription.invoices': true,
      // Blocked
      'recruitment.view': false,
      'attendance.edit': false,
      'settings.security': false,
    },
  },
  {
    name: 'Recruiter Template',
    description: 'Dedicated talent acquisition pipeline, interview scheduling, and hiring statistics.',
    projectId: 'hrms',
    isSystem: true,
    modulesEnabled: ['dashboard', 'recruitment', 'notice'],
    permissions: {
      'dashboard.view': true,
      'recruitment.view': true,
      'recruitment.create': true,
      'recruitment.edit': true,
      'recruitment.delete': false,
      'recruitment.interviews': true,
      'recruitment.reports': true,
      'notice.view': true,
      // Blocked
      'payroll.view': false,
      'assets.view': false,
    },
  },
  {
    name: 'Full Enterprise Access',
    description: 'Enables every available module and feature across the entire project.',
    projectId: 'hrms',
    isSystem: true,
    modulesEnabled: [
      'dashboard',
      'employees',
      'attendance',
      'leave',
      'projects',
      'payroll',
      'recruitment',
      'assets',
      'policies',
      'holidays',
      'notice',
      'settings',
      'subscription',
    ],
    permissions: {}, // dynamically filled as all true
  },
];

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.PermissionTemplate) {
    return m.models.PermissionTemplate;
  }
  return m.model('PermissionTemplate', permissionTemplateSchema);
}

const PermissionTemplate = new Proxy(function () {}, {
  get(target, prop) {
    if (prop === 'DEFAULT_TEMPLATES') return DEFAULT_TEMPLATES;
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

PermissionTemplate.DEFAULT_TEMPLATES = DEFAULT_TEMPLATES;

module.exports = PermissionTemplate;
