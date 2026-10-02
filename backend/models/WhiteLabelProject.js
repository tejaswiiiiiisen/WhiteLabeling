const defaultMongoose = require('mongoose');
const TenantBranding = require('./TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : defaultMongoose;
}

const actionSchema = new defaultMongoose.Schema({
  key: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  taxonomy: {
    type: String,
    enum: ['view', 'create', 'edit', 'delete', 'approve', 'reject', 'import', 'export', 'download', 'upload', 'manage'],
    default: 'view',
  },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const moduleSchema = new defaultMongoose.Schema({
  id: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  icon: { type: String, default: 'LayoutDashboard' },
  route: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  actions: [actionSchema],
});

const whiteLabelProjectSchema = new defaultMongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    projectUrl: { type: String, default: 'http://localhost:3000' },
    status: { type: String, enum: ['Active', 'Inactive', 'Maintenance'], default: 'Active' },
    modules: [moduleSchema],
    totalModules: { type: Number, default: 0 },
    totalFeatures: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Standard Master Catalog for HRMS (All 13 Modules and complete Features hierarchy)
const HRMS_MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/dashboard',
    description: 'Executive overview, charts, and workforce metrics',
    order: 1,
    actions: [
      { key: 'dashboard.view', name: 'View Dashboard', taxonomy: 'view', description: 'Access dashboard main overview' },
      { key: 'dashboard.statistics', name: 'View Statistics', taxonomy: 'view', description: 'View organization key performance metrics' },
      { key: 'dashboard.charts', name: 'View Charts', taxonomy: 'view', description: 'Analyze dynamic department & attendance charts' },
      { key: 'dashboard.export', name: 'Export Reports', taxonomy: 'export', description: 'Export summary reports to PDF or Excel' },
    ],
  },
  {
    id: 'employees',
    name: 'Employees',
    icon: 'Users',
    route: '/employees',
    description: 'Staff directory, employee records, profiles and onboarding',
    order: 2,
    actions: [
      { key: 'employees.view', name: 'View Employees', taxonomy: 'view', description: 'Browse and search employee list' },
      { key: 'employees.create', name: 'Add Employee', taxonomy: 'create', description: 'Register new employee profiles' },
      { key: 'employees.edit', name: 'Edit Employee', taxonomy: 'edit', description: 'Modify employee personal and job details' },
      { key: 'employees.delete', name: 'Delete Employee', taxonomy: 'delete', description: 'Permanently remove employee records' },
      { key: 'employees.profile', name: 'Employee Profile', taxonomy: 'view', description: 'View comprehensive individual profile data' },
      { key: 'employees.import', name: 'Import Employees', taxonomy: 'import', description: 'Bulk import employees via CSV/Excel' },
      { key: 'employees.export', name: 'Export Employees', taxonomy: 'export', description: 'Download employee directory data' },
    ],
  },
  {
    id: 'attendance',
    name: 'Attendance',
    icon: 'CalendarCheck',
    route: '/attendance',
    description: 'Daily clock-in/out, timesheets, and attendance tracking',
    order: 3,
    actions: [
      { key: 'attendance.view', name: 'View Attendance', taxonomy: 'view', description: 'Inspect daily attendance records' },
      { key: 'attendance.mark', name: 'Mark Attendance', taxonomy: 'create', description: 'Punch in/out and mark presence' },
      { key: 'attendance.edit', name: 'Edit Attendance', taxonomy: 'edit', description: 'Adjust punch times and status' },
      { key: 'attendance.delete', name: 'Delete Attendance', taxonomy: 'delete', description: 'Remove attendance log entries' },
      { key: 'attendance.reports', name: 'Attendance Reports', taxonomy: 'view', description: 'Generate monthly attendance summaries' },
      { key: 'attendance.export', name: 'Export Attendance', taxonomy: 'export', description: 'Export attendance timesheets' },
    ],
  },
  {
    id: 'leave',
    name: 'Leave',
    icon: 'Clock',
    route: '/leave',
    description: 'Time-off requests, balances, approvals, and leave management',
    order: 4,
    actions: [
      { key: 'leave.view', name: 'View Leave', taxonomy: 'view', description: 'View leave requests and balance quotas' },
      { key: 'leave.apply', name: 'Apply Leave', taxonomy: 'create', description: 'Submit new time-off applications' },
      { key: 'leave.approve', name: 'Approve Leave', taxonomy: 'approve', description: 'Grant approval to submitted leave requests' },
      { key: 'leave.reject', name: 'Reject Leave', taxonomy: 'reject', description: 'Decline leave requests with notes' },
      { key: 'leave.delete', name: 'Delete Leave', taxonomy: 'delete', description: 'Cancel or delete leave applications' },
      { key: 'leave.reports', name: 'Leave Reports', taxonomy: 'view', description: 'View organization leave balance reports' },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: 'Briefcase',
    route: '/projects',
    description: 'Project tracking, milestones, team tasks, and member assignment',
    order: 5,
    actions: [
      { key: 'projects.view', name: 'View Projects', taxonomy: 'view', description: 'Browse project directory and progress' },
      { key: 'projects.create', name: 'Create Project', taxonomy: 'create', description: 'Initialize new team projects' },
      { key: 'projects.edit', name: 'Edit Project', taxonomy: 'edit', description: 'Update project timeline and milestones' },
      { key: 'projects.delete', name: 'Delete Project', taxonomy: 'delete', description: 'Archive or remove projects' },
      { key: 'projects.assign', name: 'Assign Members', taxonomy: 'manage', description: 'Allocate team members and managers' },
      { key: 'projects.reports', name: 'Project Reports', taxonomy: 'view', description: 'View productivity and completion metrics' },
    ],
  },
  {
    id: 'payroll',
    name: 'Payroll',
    icon: 'DollarSign',
    route: '/payroll',
    description: 'Salary calculations, payslips, deductions, and payment disbursement',
    order: 6,
    actions: [
      { key: 'payroll.view', name: 'View Payroll', taxonomy: 'view', description: 'Access compensation records and salary tables' },
      { key: 'payroll.create', name: 'Create Payroll', taxonomy: 'create', description: 'Generate monthly payroll runs' },
      { key: 'payroll.edit', name: 'Edit Payroll', taxonomy: 'edit', description: 'Adjust salary structures, bonuses, and deductions' },
      { key: 'payroll.delete', name: 'Delete Payroll', taxonomy: 'delete', description: 'Cancel drafted payroll sheets' },
      { key: 'payroll.generate_payslip', name: 'Generate Payslip', taxonomy: 'manage', description: 'Produce official employee salary slips' },
      { key: 'payroll.download_payslip', name: 'Download Payslip', taxonomy: 'download', description: 'Download PDF payslips' },
      { key: 'payroll.reports', name: 'Payroll Reports', taxonomy: 'view', description: 'Generate tax, PF, and total payroll cost reports' },
    ],
  },
  {
    id: 'recruitment',
    name: 'Recruitment',
    icon: 'UserCheck',
    route: '/recruitment',
    description: 'Job requisitions, candidate pipeline, interviews, and hiring',
    order: 7,
    actions: [
      { key: 'recruitment.view', name: 'View Candidates', taxonomy: 'view', description: 'Browse candidate applications & resumes' },
      { key: 'recruitment.create', name: 'Add Candidate', taxonomy: 'create', description: 'Submit prospective hire profiles' },
      { key: 'recruitment.edit', name: 'Edit Candidate', taxonomy: 'edit', description: 'Update hiring stage and candidate feedback' },
      { key: 'recruitment.delete', name: 'Delete Candidate', taxonomy: 'delete', description: 'Discard candidate submissions' },
      { key: 'recruitment.interviews', name: 'Interviews', taxonomy: 'manage', description: 'Schedule and manage interview rounds' },
      { key: 'recruitment.reports', name: 'Recruitment Reports', taxonomy: 'view', description: 'Analyze time-to-hire and pipeline conversion' },
    ],
  },
  {
    id: 'assets',
    name: 'Asset Management',
    icon: 'HardDrive',
    route: '/assets',
    description: 'Hardware, software licenses, inventory allocation, and tracking',
    order: 8,
    actions: [
      { key: 'assets.view', name: 'View Assets', taxonomy: 'view', description: 'Browse corporate hardware and equipment' },
      { key: 'assets.create', name: 'Add Asset', taxonomy: 'create', description: 'Register new physical or digital equipment' },
      { key: 'assets.edit', name: 'Edit Asset', taxonomy: 'edit', description: 'Modify asset status, serial numbers, and condition' },
      { key: 'assets.delete', name: 'Delete Asset', taxonomy: 'delete', description: 'Decommission or remove assets' },
      { key: 'assets.assign', name: 'Assign Asset', taxonomy: 'manage', description: 'Hand over equipment to specific employees' },
      { key: 'assets.return', name: 'Return Asset', taxonomy: 'manage', description: 'Process equipment check-in upon offboarding' },
    ],
  },
  {
    id: 'policies',
    name: 'Company Policies',
    icon: 'ScrollText',
    route: '/policies',
    description: 'Employee handbooks, code of conduct, compliance, and guidelines',
    order: 9,
    actions: [
      { key: 'policies.view', name: 'View Policies', taxonomy: 'view', description: 'Read corporate guidelines and compliance docs' },
      { key: 'policies.upload', name: 'Upload Policy', taxonomy: 'upload', description: 'Publish new policy PDF documents' },
      { key: 'policies.edit', name: 'Edit Policy', taxonomy: 'edit', description: 'Update policy description, version, and tags' },
      { key: 'policies.delete', name: 'Delete Policy', taxonomy: 'delete', description: 'Revoke or archive policy documents' },
      { key: 'policies.download', name: 'Download Policy', taxonomy: 'download', description: 'Download policy attachments' },
    ],
  },
  {
    id: 'holidays',
    name: 'Holiday Calendar',
    icon: 'CalendarDays',
    route: '/holidays',
    description: 'Public holidays, mandatory closures, and festive calendars',
    order: 10,
    actions: [
      { key: 'holidays.view', name: 'View Holidays', taxonomy: 'view', description: 'Access organization holiday calendar' },
      { key: 'holidays.create', name: 'Add Holiday', taxonomy: 'create', description: 'Add regional or national public holidays' },
      { key: 'holidays.edit', name: 'Edit Holiday', taxonomy: 'edit', description: 'Modify holiday date and description' },
      { key: 'holidays.delete', name: 'Delete Holiday', taxonomy: 'delete', description: 'Remove scheduled holidays' },
    ],
  },
  {
    id: 'notice',
    name: 'Notice',
    icon: 'Bell',
    route: '/notice',
    description: 'Announcements, broadcast messages, and company circulars',
    order: 11,
    actions: [
      { key: 'notice.view', name: 'View Notices', taxonomy: 'view', description: 'Read company bulletins and circulars' },
      { key: 'notice.create', name: 'Create Notice', taxonomy: 'create', description: 'Broadcast notices to all or specific teams' },
      { key: 'notice.edit', name: 'Edit Notice', taxonomy: 'edit', description: 'Revise notice content and expiry' },
      { key: 'notice.delete', name: 'Delete Notice', taxonomy: 'delete', description: 'Remove or archive notices' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    route: '/settings',
    description: 'Company setup, security configurations, notifications, and preferences',
    order: 12,
    actions: [
      { key: 'settings.view', name: 'View Settings', taxonomy: 'view', description: 'Access workspace settings panel' },
      { key: 'settings.company', name: 'Company Settings', taxonomy: 'manage', description: 'Configure corporate profiles, branches, and fiscal calendar' },
      { key: 'settings.user', name: 'User Settings', taxonomy: 'manage', description: 'Manage employee accounts and role mappings' },
      { key: 'settings.notifications', name: 'Notification Settings', taxonomy: 'manage', description: 'Configure email and in-app alert preferences' },
      { key: 'settings.security', name: 'Security Settings', taxonomy: 'manage', description: 'Set 2FA, session timeout, and IP whitelisting' },
    ],
  },
  {
    id: 'subscription',
    name: 'Subscription Management',
    icon: 'CreditCard',
    route: '/subscription',
    description: 'Tier plans, billing details, payment histories, and invoices',
    order: 13,
    actions: [
      { key: 'subscription.view', name: 'View Subscription', taxonomy: 'view', description: 'Check current tier, usage limits, and renewal dates' },
      { key: 'subscription.change_plan', name: 'Change Plan', taxonomy: 'manage', description: 'Upgrade, downgrade, or switch billing cycles' },
      { key: 'subscription.billing', name: 'Billing', taxonomy: 'manage', description: 'Manage credit cards, payment methods, and billing addresses' },
      { key: 'subscription.payment_history', name: 'Payment History', taxonomy: 'view', description: 'Review transaction ledger and payment statuses' },
      { key: 'subscription.invoices', name: 'Invoices', taxonomy: 'download', description: 'Download official tax receipts and monthly invoices' },
    ],
  },
];

// Master Catalog for Hotel Management System
const HOTEL_MODULES = [
  {
    id: 'hotel_dashboard',
    name: 'Hotel Overview',
    icon: 'Building',
    route: '/dashboard',
    description: 'Live occupancy, check-in pipeline, and revenue indicators',
    order: 1,
    actions: [
      { key: 'hotel.dashboard.view', name: 'View Dashboard', taxonomy: 'view', description: 'Occupancy graphs and KPI status' },
      { key: 'hotel.dashboard.stats', name: 'View Revenue & ADR', taxonomy: 'view', description: 'Average Daily Rate and RevPAR indicators' },
    ],
  },
  {
    id: 'hotel_rooms',
    name: 'Rooms & Suites',
    icon: 'DoorOpen',
    route: '/rooms',
    description: 'Room inventory, pricing tiers, cleaning status, and amenities',
    order: 2,
    actions: [
      { key: 'hotel.rooms.view', name: 'View Rooms', taxonomy: 'view', description: 'Browse room inventory grid' },
      { key: 'hotel.rooms.create', name: 'Add Room', taxonomy: 'create', description: 'Register new room number and tier' },
      { key: 'hotel.rooms.edit', name: 'Edit Room', taxonomy: 'edit', description: 'Modify pricing, amenities, and room status' },
      { key: 'hotel.rooms.delete', name: 'Delete Room', taxonomy: 'delete', description: 'Remove room record' },
    ],
  },
  {
    id: 'hotel_bookings',
    name: 'Bookings & Reservations',
    icon: 'Calendar',
    route: '/bookings',
    description: 'Guest bookings, check-in, check-out, and folio management',
    order: 3,
    actions: [
      { key: 'hotel.bookings.view', name: 'View Reservations', taxonomy: 'view', description: 'Inspect reservation calendar and list' },
      { key: 'hotel.bookings.create', name: 'New Reservation', taxonomy: 'create', description: 'Book guest arrival and assign room' },
      { key: 'hotel.bookings.checkin', name: 'Check-In / Check-Out', taxonomy: 'manage', description: 'Process guest check-in & keycard release' },
      { key: 'hotel.bookings.cancel', name: 'Cancel Reservation', taxonomy: 'delete', description: 'Cancel booking with refund rules' },
    ],
  },
];

function getModel() {
  const m = getMongoose();
  if (m.models && m.models.WhiteLabelProject) {
    return m.models.WhiteLabelProject;
  }
  return m.model('WhiteLabelProject', whiteLabelProjectSchema);
}

const WhiteLabelProject = new Proxy(function () {}, {
  get(target, prop) {
    if (prop === 'HRMS_MODULES') return HRMS_MODULES;
    if (prop === 'HOTEL_MODULES') return HOTEL_MODULES;
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

WhiteLabelProject.HRMS_MODULES = HRMS_MODULES;
WhiteLabelProject.HOTEL_MODULES = HOTEL_MODULES;

module.exports = WhiteLabelProject;
