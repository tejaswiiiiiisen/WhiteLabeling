const tenantResolver = require('./middleware/tenantResolver');
const { whitelabelRouter, createWhitelabelRouter } = require('./routes/whitelabelRoutes');
const { superAdminRouter, createSuperAdminRouter } = require('./routes/superAdminRoutes');
const TenantBranding = require('./models/TenantBranding');
const Reseller = require('./models/Reseller');
const WhiteLabelProduct = require('./models/WhiteLabelProduct');
const WhiteLabelTemplate = require('./models/WhiteLabelTemplate');
const FeatureFlag = require('./models/FeatureFlag');
const WhiteLabelAuditLog = require('./models/WhiteLabelAuditLog');
const WhiteLabelDomain = require('./models/WhiteLabelDomain');
const brandingController = require('./controllers/brandingController');
const superAdminController = require('./controllers/superAdminController');
const Permission = require('./models/Permission');
const UserPermission = require('./models/UserPermission');
const PermissionAuditLog = require('./models/PermissionAuditLog');
const permissionController = require('./controllers/permissionController');
const permissionGuard = require('./middleware/permissionGuard');

// Complete White-Label Project & Access Management System
const WhiteLabelProject = require('./models/WhiteLabelProject');
const ProjectAccessAssignment = require('./models/ProjectAccessAssignment');
const AccessAuditLog = require('./models/AccessAuditLog');
const PermissionTemplate = require('./models/PermissionTemplate');
const CustomRole = require('./models/CustomRole');
const { projectAccessRouter, createProjectAccessRouter } = require('./routes/projectAccessRoutes');
const projectAccessController = require('./controllers/projectAccessController');
const { requireProjectPermission } = require('./middleware/projectPermissionGuard');
// Complete White-Label Multi-Tenant SaaS Engine (Plans, Subscriptions, Razorpay, Feature Gate)
const TenantPlan = require('./models/TenantPlan');
const CustomerSubscription = require('./models/CustomerSubscription');
const PaymentTransaction = require('./models/PaymentTransaction');
const TenantPaymentConfig = require('./models/TenantPaymentConfig');
const encryptionService = require('./services/encryptionService');
const razorpayService = require('./services/razorpayService');
const featureGate = require('./middleware/featureGate');
const tenantPlanController = require('./controllers/tenantPlanController');
const paymentController = require('./controllers/paymentController');
const { tenantPlanRouter, createTenantPlanRouter } = require('./routes/tenantPlanRoutes');
const { paymentRouter, createPaymentRouter } = require('./routes/paymentRoutes');

module.exports = {
  tenantResolver,
  whitelabelRouter,
  createWhitelabelRouter,
  superAdminRouter,
  createSuperAdminRouter,
  projectAccessRouter,
  createProjectAccessRouter,
  projectAccessController,
  requireProjectPermission,
  WhiteLabelProject,
  ProjectAccessAssignment,
  AccessAuditLog,
  PermissionTemplate,
  CustomRole,
  TenantBranding,
  Reseller,
  WhiteLabelProduct,
  WhiteLabelTemplate,
  FeatureFlag,
  WhiteLabelAuditLog,
  WhiteLabelDomain,
  Permission,
  UserPermission,
  PermissionAuditLog,
  brandingController,
  superAdminController,
  permissionController,
  permissionGuard,
  // Multi-Tenant SaaS Architecture Extensions
  TenantPlan,
  CustomerSubscription,
  PaymentTransaction,
  TenantPaymentConfig,
  encryptionService,
  razorpayService,
  featureGate,
  requireTenantFeature: featureGate.requireTenantFeature,
  requireActiveSubscription: featureGate.requireActiveSubscription,
  requireCustomerPlanFeature: featureGate.requireCustomerPlanFeature,
  requireCompleteFeatureAccess: featureGate.requireCompleteFeatureAccess,
  tenantPlanController,
  paymentController,
  tenantPlanRouter,
  createTenantPlanRouter,
  paymentRouter,
  createPaymentRouter,
  setMongoose: TenantBranding.setMongoose,
};
