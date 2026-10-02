const TenantPlan = require('../models/TenantPlan');
const TenantBranding = require('../models/TenantBranding');
const ProjectAccessAssignment = require('../models/ProjectAccessAssignment');
const WhiteLabelProject = require('../models/WhiteLabelProject');
const { resolveReqTenantId } = require('../middleware/featureGate');

/**
 * Helper to fetch tenant's assigned features set from ProjectAccessAssignment
 */
async function getTenantEntitlements(tenantId, projectId = 'hrms') {
  const assignment = await ProjectAccessAssignment.findOne({
    $or: [{ organizationId: tenantId }, { organizationId: String(tenantId) }],
    projectId,
  }).lean();

  const allowedKeys = new Set();

  if (assignment) {
    // Add enabled modules
    if (Array.isArray(assignment.modulesEnabled)) {
      assignment.modulesEnabled.forEach((m) => allowedKeys.add(m));
    }
    // Add specific granted permissions
    if (assignment.permissions) {
      for (const [k, v] of Object.entries(assignment.permissions)) {
        if (v === true) allowedKeys.add(k);
      }
    }
  }

  return { assignment, allowedKeys };
}

/**
 * GET /api/tenant-plans/allowed-features
 * Returns the catalog of features this White-Label tenant is authorized to include in plans
 */
exports.getTenantAllowedFeatures = async (req, res) => {
  try {
    const tenantId = req.query.tenantId || resolveReqTenantId(req);
    const projectId = req.query.projectId || 'hrms';

    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Tenant ID required' });
    }

    const { assignment, allowedKeys } = await getTenantEntitlements(tenantId, projectId);
    const project = await WhiteLabelProject.findOne({ projectId }).lean();

    const allowedFeaturesList = [];
    if (project && Array.isArray(project.modules)) {
      project.modules.forEach((mod) => {
        const isModuleAllowed = allowedKeys.has(mod.id);
        const allowedActions = (mod.actions || []).filter((act) => allowedKeys.has(act.key) || isModuleAllowed);

        if (isModuleAllowed || allowedActions.length > 0) {
          allowedFeaturesList.push({
            moduleId: mod.id,
            moduleName: mod.name,
            icon: mod.icon,
            isModuleAllowed,
            actions: allowedActions.map((a) => ({
              key: a.key,
              name: a.name,
              taxonomy: a.taxonomy,
              description: a.description,
            })),
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        tenantId,
        projectId,
        totalAllowedKeysCount: allowedKeys.size,
        allowedKeys: Array.from(allowedKeys),
        allowedCatalog: allowedFeaturesList,
      },
    });
  } catch (err) {
    console.error('[TenantPlanController] Error fetching allowed features:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/tenant-plans
 * Lists all custom plans created by the tenant
 */
exports.getTenantPlans = async (req, res) => {
  try {
    const tenantId = req.query.tenantId || resolveReqTenantId(req);
    const projectId = req.query.projectId || 'hrms';

    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Tenant ID required' });
    }

    let plans = await TenantPlan.find({
      tenantId,
      projectId,
      status: { $ne: 'Archived' },
    }).sort({ order: 1, createdAt: 1 }).lean();

    // If no plans exist yet for this tenant, auto-seed default starter plans matching allowed features
    if (plans.length === 0) {
      const defaultPlans = [
        {
          tenantId,
          projectId,
          name: 'Starter Tier',
          slug: 'starter-tier',
          tagline: 'Ideal for small offices & early teams',
          monthlyPrice: 999,
          yearlyPrice: 9990,
          currency: 'INR',
          billingCycle: 'both',
          limits: { maxEmployees: 25, maxUsers: 5, maxStorageGB: 2, customDomainAllowed: false },
          features: [
            { key: 'dashboard', name: 'Dashboard Analytics', included: true },
            { key: 'employees', name: 'Employee Directory', included: true },
            { key: 'attendance', name: 'Attendance Logging', included: true },
            { key: 'leave', name: 'Leave Requests', included: true },
          ],
          order: 1,
        },
        {
          tenantId,
          projectId,
          name: 'Professional Suite',
          slug: 'professional-suite',
          tagline: 'High productivity for growing businesses',
          monthlyPrice: 2499,
          yearlyPrice: 24990,
          currency: 'INR',
          billingCycle: 'both',
          isPopular: true,
          limits: { maxEmployees: 100, maxUsers: 15, maxStorageGB: 10, customDomainAllowed: true },
          features: [
            { key: 'dashboard', name: 'Dashboard Analytics', included: true },
            { key: 'employees', name: 'Employee Directory', included: true },
            { key: 'attendance', name: 'Attendance & Geofence', included: true },
            { key: 'leave', name: 'Leave Approvals', included: true },
            { key: 'payroll', name: 'Payroll Calculations', included: true },
            { key: 'assets', name: 'Asset Management', included: true },
          ],
          order: 2,
        },
      ];

      // Save seed plans
      try {
        await TenantPlan.insertMany(defaultPlans);
        plans = await TenantPlan.find({ tenantId, projectId }).lean();
      } catch (seedErr) {
        // Continue if duplicate
      }
    }

    return res.status(200).json({ success: true, data: plans });
  } catch (err) {
    console.error('[TenantPlanController] Error getting tenant plans:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/tenant-plans
 * Creates a new custom plan with BACKEND ENFORCEMENT of tenant feature permissions
 */
exports.createTenantPlan = async (req, res) => {
  try {
    const tenantId = req.body.tenantId || resolveReqTenantId(req);
    const projectId = req.body.projectId || 'hrms';
    const {
      name,
      slug,
      description,
      tagline,
      monthlyPrice,
      yearlyPrice,
      currency,
      features = [],
      limits,
      billingCycle,
      trialDays,
      isPopular,
    } = req.body;

    if (!tenantId || !name) {
      return res.status(400).json({ success: false, message: 'Tenant ID and Plan Name are required' });
    }

    const planSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug already exists for this tenant
    const existing = await TenantPlan.findOne({ tenantId, projectId, slug: planSlug });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A plan with slug "${planSlug}" already exists for this tenant.`,
      });
    }

    // =========================================================================
    // CRITICAL SECURITY ENFORCEMENT: Validate Tenant Feature Entitlements
    // =========================================================================
    const { allowedKeys } = await getTenantEntitlements(tenantId, projectId);

    const unauthorizedFeatures = [];
    if (Array.isArray(features)) {
      for (const feat of features) {
        if (feat.included === true) {
          // If the feature key is not authorized for the tenant, reject!
          if (!allowedKeys.has(feat.key)) {
            unauthorizedFeatures.push(feat.name || feat.key);
          }
        }
      }
    }

    if (unauthorizedFeatures.length > 0) {
      console.warn(`[Security Alert] Tenant ${tenantId} attempted to add unauthorized features:`, unauthorizedFeatures);
      return res.status(403).json({
        success: false,
        code: 'UNAUTHORIZED_FEATURE_IN_PLAN',
        message: `Plan rejected: You are not authorized to sell or include the following features: ${unauthorizedFeatures.join(', ')}. Please request feature activation from the Platform Owner.`,
        unauthorizedFeatures,
      });
    }

    const newPlan = await TenantPlan.create({
      tenantId,
      projectId,
      name,
      slug: planSlug,
      description,
      tagline,
      monthlyPrice: Number(monthlyPrice) || 0,
      yearlyPrice: Number(yearlyPrice) || 0,
      currency: currency || 'INR',
      features,
      limits: limits || {},
      billingCycle: billingCycle || 'both',
      trialDays: Number(trialDays) || 0,
      isPopular: Boolean(isPopular),
      status: 'Active',
    });

    return res.status(201).json({
      success: true,
      message: `Plan "${newPlan.name}" created successfully.`,
      data: newPlan,
    });
  } catch (err) {
    console.error('[TenantPlanController] Error creating tenant plan:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/tenant-plans/:id
 * Updates an existing plan with BACKEND ENFORCEMENT of tenant feature permissions
 */
exports.updateTenantPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await TenantPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const tenantId = plan.tenantId;
    const projectId = plan.projectId || 'hrms';

    // If updating features, validate permissions again
    if (req.body.features && Array.isArray(req.body.features)) {
      const { allowedKeys } = await getTenantEntitlements(tenantId, projectId);
      const unauthorizedFeatures = [];

      for (const feat of req.body.features) {
        if (feat.included === true && !allowedKeys.has(feat.key)) {
          unauthorizedFeatures.push(feat.name || feat.key);
        }
      }

      if (unauthorizedFeatures.length > 0) {
        return res.status(403).json({
          success: false,
          code: 'UNAUTHORIZED_FEATURE_IN_PLAN',
          message: `Plan update rejected: Unauthorized features requested: ${unauthorizedFeatures.join(', ')}.`,
          unauthorizedFeatures,
        });
      }
    }

    Object.assign(plan, req.body);
    await plan.save();

    return res.status(200).json({
      success: true,
      message: `Plan "${plan.name}" updated successfully.`,
      data: plan,
    });
  } catch (err) {
    console.error('[TenantPlanController] Error updating tenant plan:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/tenant-plans/:id
 */
exports.deleteTenantPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await TenantPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Soft delete if subscribers exist, else hard delete
    if (plan.activeSubscribersCount > 0) {
      plan.status = 'Archived';
      await plan.save();
      return res.status(200).json({ success: true, message: 'Plan has active subscribers; marked as Archived.' });
    }

    await TenantPlan.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Plan deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
