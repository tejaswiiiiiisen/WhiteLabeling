const TenantBranding = require('../models/TenantBranding');
const ProjectAccessAssignment = require('../models/ProjectAccessAssignment');
const CustomerSubscription = require('../models/CustomerSubscription');
const TenantPlan = require('../models/TenantPlan');

/**
 * Helper to extract tenant ID from req context (attached by tenantResolver, req.user, or headers)
 */
function resolveReqTenantId(req) {
  return (
    req.resolvedOrgId ||
    req.tenantBranding?.organizationId ||
    req.user?.tenantId ||
    req.user?.organizationId ||
    req.headers['x-tenant-id'] ||
    req.headers['x-organization-id'] ||
    req.query.tenantId ||
    req.query.orgId ||
    null
  );
}

/**
 * 1. requireTenantFeature(featureKey, projectId = 'hrms')
 * Enforces that the White-Label Tenant has been assigned permission to use/resell this feature
 * by the Platform Owner in ProjectAccessAssignment.
 */
function requireTenantFeature(featureKey, projectId = 'hrms') {
  return async (req, res, next) => {
    try {
      const tenantId = resolveReqTenantId(req);
      if (!tenantId) {
        return res.status(403).json({
          success: false,
          code: 'TENANT_CONTEXT_MISSING',
          message: 'Access Denied: White-Label tenant context is missing from request.',
        });
      }

      // Check tenant status
      const tenant = await TenantBranding.findOne({
        $or: [{ organizationId: tenantId }, { _id: tenantId }],
      }).lean();

      if (tenant && tenant.status === 'Suspended') {
        return res.status(403).json({
          success: false,
          code: 'TENANT_SUSPENDED',
          message: 'Access Denied: White-Label tenant has been suspended by Platform Owner.',
        });
      }

      // Check assignment
      const assignment = await ProjectAccessAssignment.findOne({
        $or: [{ organizationId: tenantId }, { organizationId: String(tenantId) }],
        projectId,
      }).lean();

      if (!assignment) {
        return res.status(403).json({
          success: false,
          code: 'NO_FEATURE_ASSIGNMENT',
          message: `Access Denied: Tenant has no active feature assignment for ${projectId}.`,
        });
      }

      // Check if assignment is active or valid trial
      if (!['Active', 'Trial'].includes(assignment.status)) {
        return res.status(403).json({
          success: false,
          code: 'ASSIGNMENT_INACTIVE',
          message: `Access Denied: Tenant project access is ${assignment.status}.`,
        });
      }

      // Check module or permission key
      const moduleMatch = assignment.modulesEnabled && assignment.modulesEnabled.includes(featureKey);
      const permMatch = assignment.permissions && assignment.permissions[featureKey] === true;

      // Allow if either the whole module is enabled or specific granular permission is granted
      if (!moduleMatch && !permMatch) {
        return res.status(403).json({
          success: false,
          code: 'FEATURE_NOT_AUTHORIZED_FOR_TENANT',
          message: `Access Denied: Feature "${featureKey}" is not authorized for this White-Label tenant.`,
          requiredFeature: featureKey,
        });
      }

      req.tenantAssignment = assignment;
      next();
    } catch (err) {
      console.error('[FeatureGate] Error checking tenant feature:', err);
      return res.status(500).json({ success: false, message: 'Feature authorization check failed: ' + err.message });
    }
  };
}

/**
 * 2. requireActiveSubscription()
 * Enforces that the customer accessing the service has an Active or Trial subscription.
 */
function requireActiveSubscription() {
  return async (req, res, next) => {
    try {
      const customerId = req.user?.id || req.user?.organizationId || req.query.customerId;
      const tenantId = resolveReqTenantId(req);

      if (!customerId) {
        return res.status(401).json({
          success: false,
          code: 'CUSTOMER_AUTH_REQUIRED',
          message: 'Customer authentication is required to access subscription features.',
        });
      }

      // Find active customer subscription
      const subscription = await CustomerSubscription.findOne({
        customerId,
        ...(tenantId ? { tenantId } : {}),
      })
        .sort({ createdAt: -1 })
        .lean();

      if (!subscription) {
        return res.status(402).json({
          success: false,
          code: 'NO_ACTIVE_SUBSCRIPTION',
          message: 'Payment Required: No active subscription found for this account.',
        });
      }

      const now = new Date();
      const isPeriodValid = !subscription.currentPeriodEnd || now <= new Date(subscription.currentPeriodEnd);
      const isActiveStatus = ['Active', 'Trial'].includes(subscription.status);

      if (!isActiveStatus || !isPeriodValid) {
        return res.status(402).json({
          success: false,
          code: 'SUBSCRIPTION_EXPIRED',
          message: `Payment Required: Your subscription is ${subscription.status}. Please renew your plan.`,
          subscriptionStatus: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
        });
      }

      req.customerSubscription = subscription;
      next();
    } catch (err) {
      console.error('[FeatureGate] Error checking customer subscription:', err);
      return res.status(500).json({ success: false, message: 'Subscription check failed: ' + err.message });
    }
  };
}

/**
 * 3. requireCustomerPlanFeature(featureKey)
 * Enforces that the customer's specific subscribed plan includes the requested feature.
 */
function requireCustomerPlanFeature(featureKey) {
  return async (req, res, next) => {
    try {
      const subscription = req.customerSubscription;
      if (!subscription) {
        // Run subscription check first
        return requireActiveSubscription()(req, res, () => {
          requireCustomerPlanFeature(featureKey)(req, res, next);
        });
      }

      // 1. Check direct featuresGranted on subscription
      if (subscription.featuresGranted && subscription.featuresGranted.includes(featureKey)) {
        return next();
      }

      // 2. Lookup plan details
      const plan = await TenantPlan.findById(subscription.planId).lean();
      if (!plan) {
        return res.status(403).json({
          success: false,
          code: 'PLAN_NOT_FOUND',
          message: 'Subscribed plan record not found.',
        });
      }

      const hasFeature = plan.features?.some(
        (f) => (f.key === featureKey || f.name.toLowerCase() === featureKey.toLowerCase()) && f.included
      );

      if (!hasFeature) {
        return res.status(403).json({
          success: false,
          code: 'FEATURE_NOT_IN_PLAN',
          message: `Upgrade Required: Feature "${featureKey}" is not included in your current plan (${plan.name}).`,
          currentPlan: plan.name,
          requiredFeature: featureKey,
        });
      }

      next();
    } catch (err) {
      console.error('[FeatureGate] Error checking customer plan feature:', err);
      return res.status(500).json({ success: false, message: 'Plan feature check failed: ' + err.message });
    }
  };
}

/**
 * 4. requireCompleteFeatureAccess(featureKey, projectId)
 * Full 4-step pipeline: Tenant Active -> Tenant Feature Allowed -> Customer Active Subscription -> Customer Plan Feature Included
 */
function requireCompleteFeatureAccess(featureKey, projectId = 'hrms') {
  return [
    requireTenantFeature(featureKey, projectId),
    requireActiveSubscription(),
    requireCustomerPlanFeature(featureKey),
  ];
}

module.exports = {
  resolveReqTenantId,
  requireTenantFeature,
  requireActiveSubscription,
  requireCustomerPlanFeature,
  requireCompleteFeatureAccess,
};
