const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const projectAccessAssignmentSchema = new defaultMongoose.Schema(
  {
    organizationId: {
      type: defaultMongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    organizationName: { type: String, default: '' },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    projectName: { type: String, default: 'HRMS Project' },
    assigneeType: {
      type: String,
      enum: ['organization', 'user', 'role', 'team'],
      default: 'organization',
    },
    targetUserId: { type: defaultMongoose.Schema.Types.Mixed, default: null },
    targetUserEmail: { type: String, lowercase: true, trim: true, default: '' },
    targetUserName: { type: String, default: '' },
    targetRole: { type: String, default: 'HR Manager' },
    team: { type: String, default: '' },
    // Granular map of feature keys -> boolean (e.g. 'employees.delete': false)
    permissions: {
      type: defaultMongoose.Schema.Types.Mixed,
      default: {},
    },
    // Array of enabled module ids (e.g. ['dashboard', 'employees', 'attendance'])
    modulesEnabled: {
      type: [String],
      default: [],
    },
    totalModulesCount: { type: Number, default: 13 },
    enabledModulesCount: { type: Number, default: 0 },
    totalFeaturesCount: { type: Number, default: 96 },
    enabledFeaturesCount: { type: Number, default: 0 },
    // Access lifecycle status
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Active', 'Trial', 'Expired', 'Suspended', 'Revoked'],
      default: 'Active',
      index: true,
    },
    // Trial mode data
    trial: {
      isActive: { type: Boolean, default: false },
      status: { type: String, enum: ['None', 'Running', 'Ended', 'Extended'], default: 'None' },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      days: { type: Number, default: 7 },
      startedBy: { type: String, default: 'Super Admin' },
    },
    // Access validity window
    accessStart: { type: Date, default: Date.now },
    accessEnd: { type: Date, default: null },
    assignedBy: { type: String, default: 'Super Admin' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for fast lookups
projectAccessAssignmentSchema.index({ organizationId: 1, projectId: 1, targetUserEmail: 1 });

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.ProjectAccessAssignment) {
    return m.models.ProjectAccessAssignment;
  }
  return m.model('ProjectAccessAssignment', projectAccessAssignmentSchema);
}

const ProjectAccessAssignment = new Proxy(function () {}, {
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

module.exports = ProjectAccessAssignment;
