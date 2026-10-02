const path = require('path');
const fs = require('fs');
const TenantBranding = require('../models/TenantBranding');

function getMongoose() {
  return TenantBranding.getActiveMongoose ? TenantBranding.getActiveMongoose() : require('mongoose');
}

// Default fallback configuration when no specific tenant is resolved
const DEFAULT_BRANDING = {
  companyName: 'Macenza HRMS',
  legalName: 'Macenza Technologies Inc.',
  tagline: 'Intelligent Enterprise Workspace',
  subdomain: '',
  customDomain: '',
  logoUrl: '',
  darkLogoUrl: '',
  faviconUrl: '',
  loginBannerUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  accentColor: '#10B981',
  sidebarBg: '#0F172A',
  textColor: '#0F172A',
  fontFamily: 'Inter, system-ui, sans-serif',
  metaTitle: 'HRMS Portal',
  metaDescription: 'Enterprise Human Resource Management System',
  supportEmail: '',
  supportPhone: '',
  copyrightText: '© Macenza. All rights reserved.',
  isWhitelabelActive: true,
};

/**
 * GET /api/whitelabel/public-branding
 * Accessible without login so the Login Page, Favicon, and App Head can adapt to the tenant.
 */
exports.getPublicBranding = async (req, res) => {
  try {
    // 1. Check if already resolved by tenantResolver middleware
    if (req.tenantBranding) {
      return res.status(200).json({
        success: true,
        source: 'resolved_host',
        data: req.tenantBranding,
      });
    }

    // 2. Check query params (?subdomain=acme or ?tenantId=xyz)
    const { subdomain, tenantId, domain } = req.query;
    let query = null;

    if (subdomain) {
      query = { subdomain: subdomain.toLowerCase().trim() };
    } else if (tenantId) {
      query = { organizationId: tenantId };
    } else if (domain) {
      query = { customDomain: domain.toLowerCase().trim() };
    }

    if (query) {
      const branding = await TenantBranding.findOne({
        ...query,
        isWhitelabelActive: true,
      }).lean();

      if (branding) {
        return res.status(200).json({
          success: true,
          source: 'query_lookup',
          data: branding,
        });
      }
    }

    // Standalone fallback: If there's an active branding in the DB, return it instead of hardcoded default
    try {
      const latestBranding = await TenantBranding.findOne({ isWhitelabelActive: true }).sort({ updatedAt: -1 }).lean();
      if (latestBranding) {
        return res.status(200).json({
          success: true,
          source: 'latest_db',
          data: latestBranding,
        });
      }
    } catch (err) {}

    // 3. Graceful fallback to default system branding
    return res.status(200).json({
      success: true,
      source: 'default',
      data: DEFAULT_BRANDING,
    });
  } catch (error) {
    console.error('[Whitelabel] Error fetching public branding:', error);
    return res.status(200).json({
      success: true,
      source: 'fallback_error',
      data: DEFAULT_BRANDING,
    });
  }
};

/**
 * Resolves effective organization ID across all environments:
 * 1. HRMS authenticated token (req.user.organizationId)
 * 2. Host / Subdomain resolver (req.resolvedOrgId)
 * 3. Headers: x-tenant-id or x-organization-id
 * 4. Query params: ?tenantId= or ?orgId=
 * 5. Request body: organizationId or tenantId
 * 6. Standalone mode: existing branding document in DB or demo ObjectId
 */
async function getEffectiveOrgId(req) {
  // 1. Authenticated user organization (from HRMS JWT / session)
  if (req.user?.organizationId) {
    return req.user.organizationId;
  }

  // 2. Resolved organization from tenantResolver middleware (domain, subdomain, query)
  if (req.resolvedOrgId) {
    return req.resolvedOrgId;
  }

  // 3. Custom request headers (x-tenant-id or x-organization-id)
  const headerOrgId = req.headers?.['x-tenant-id'] || req.headers?.['x-organization-id'];
  if (headerOrgId) {
    return headerOrgId;
  }

  // 4. Request query params (?tenantId=... or ?orgId=...)
  const queryOrgId = req.query?.tenantId || req.query?.orgId || req.query?.organizationId;
  if (queryOrgId) {
    return queryOrgId;
  }

  // 5. Request body (for PUT / POST requests)
  const bodyOrgId = req.body?.organizationId || req.body?.tenantId;
  if (bodyOrgId) {
    return bodyOrgId;
  }

  // 6. In Standalone Mode / Studio / Demo Mode:
  // Check if any TenantBranding document already exists in DB
  try {
    const existing = await TenantBranding.findOne().sort({ updatedAt: -1 }).lean();
    if (existing && existing.organizationId) {
      return existing.organizationId;
    }
  } catch (err) {}

  // 7. Check if there's any Company or Customer in the DB to associate with
  try {
    const mongoose = getMongoose();
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const companyCol = mongoose.connection.collection('companies');
      const comp = await companyCol.findOne({});
      if (comp && comp._id) {
        return comp._id.toString();
      }
      const custCol = mongoose.connection.collection('customers');
      const cust = await custCol.findOne({});
      if (cust && cust._id) {
        return cust._id.toString();
      }
    }
  } catch (err) {}

  // 8. Safe fallback ObjectId for standalone mode
  const mongoose = getMongoose();
  return new mongoose.Types.ObjectId('650000000000000000000001');
}

/**
 * GET /api/whitelabel/config
 * Retrieves full white-label settings for the authenticated organization.
 */
exports.getTenantBranding = async (req, res) => {
  try {
    const orgId = await getEffectiveOrgId(req);

    let branding = await TenantBranding.findOne({ organizationId: orgId });

    // If not found by this orgId, but running in standalone/demo mode, check if any branding exists
    if (!branding && !req.user?.organizationId) {
      branding = await TenantBranding.findOne().sort({ updatedAt: -1 });
    }

    // Auto-seed initial branding document if not yet created for this org
    if (!branding) {
      branding = await TenantBranding.create({
        organizationId: orgId,
        companyName: req.user?.companyName || 'Macenza HRMS',
        ...DEFAULT_BRANDING,
      });
    }

    return res.status(200).json({
      success: true,
      data: branding,
    });
  } catch (error) {
    console.error('[Whitelabel] Error retrieving tenant branding:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve white-label settings.',
      error: error.message,
    });
  }
};

/**
 * PUT /api/whitelabel/config
 * Updates white-label settings for the authenticated organization.
 */
exports.updateTenantBranding = async (req, res) => {
  try {
    const orgId = await getEffectiveOrgId(req);

    const {
      companyName,
      legalName,
      tagline,
      subdomain,
      customDomain,
      logoUrl,
      darkLogoUrl,
      faviconUrl,
      loginBannerUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      sidebarBg,
      textColor,
      fontFamily,
      metaTitle,
      metaDescription,
      supportEmail,
      supportPhone,
      copyrightText,
      isWhitelabelActive,
      customCss,
    } = req.body;

    // Field-level permission enforcement for 2nd Person (Reseller)
    if (req.user && String(req.user.role || '').toLowerCase() !== 'superadmin') {
      const { getEffectivePermissions } = require('../middleware/permissionGuard');
      const perms = await getEffectivePermissions(req.user);

      if (companyName !== undefined && !perms['branding.company_name.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.company_name.update' to change Company Name.",
          missingPermission: 'branding.company_name.update',
        });
      }
      if ((logoUrl !== undefined || darkLogoUrl !== undefined) && !perms['branding.logo.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.logo.update' to change Logo.",
          missingPermission: 'branding.logo.update',
        });
      }
      if (faviconUrl !== undefined && !perms['branding.favicon.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.favicon.update' to change Favicon.",
          missingPermission: 'branding.favicon.update',
        });
      }
      if ((primaryColor !== undefined || secondaryColor !== undefined || accentColor !== undefined) && !perms['branding.theme.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.theme.update' to change Theme Colors.",
          missingPermission: 'branding.theme.update',
        });
      }
      if (loginBannerUrl !== undefined && !perms['branding.login_page.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.login_page.update' to change Login Page Branding.",
          missingPermission: 'branding.login_page.update',
        });
      }
      if ((customDomain !== undefined || subdomain !== undefined) && !perms['domain.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'domain.update' to configure Custom Domain.",
          missingPermission: 'domain.update',
        });
      }
      if (customCss !== undefined && !perms['branding.custom_css.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.custom_css.update' to modify Custom CSS.",
          missingPermission: 'branding.custom_css.update',
        });
      }
      if ((metaTitle !== undefined || metaDescription !== undefined) && !perms['branding.meta.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.meta.update' to modify Website Title / SEO.",
          missingPermission: 'branding.meta.update',
        });
      }
      if (copyrightText !== undefined && !perms['branding.footer.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.footer.update' to modify Footer Copyright.",
          missingPermission: 'branding.footer.update',
        });
      }
    }

    // Check subdomain collision if subdomain is provided
    if (subdomain) {
      const cleanSub = subdomain.toLowerCase().trim();
      const existing = await TenantBranding.findOne({
        subdomain: cleanSub,
        organizationId: { $ne: orgId },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Subdomain '${cleanSub}' is already taken by another organization.`,
        });
      }
    }

    // Check custom domain collision
    if (customDomain) {
      const cleanDomain = customDomain.toLowerCase().trim();
      const existingDomain = await TenantBranding.findOne({
        customDomain: cleanDomain,
        organizationId: { $ne: orgId },
      });
      if (existingDomain) {
        return res.status(400).json({
          success: false,
          message: `Domain '${cleanDomain}' is already configured for another organization.`,
        });
      }
    }

    // Upsert branding configuration
    const updated = await TenantBranding.findOneAndUpdate(
      { organizationId: orgId },
      {
        $set: {
          organizationId: orgId,
          ...(companyName !== undefined && { companyName: companyName.trim() }),
          ...(legalName !== undefined && { legalName: legalName.trim() }),
          ...(tagline !== undefined && { tagline: tagline.trim() }),
          ...(subdomain !== undefined && { subdomain: subdomain.toLowerCase().trim() }),
          ...(customDomain !== undefined && { customDomain: customDomain.toLowerCase().trim() }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(darkLogoUrl !== undefined && { darkLogoUrl }),
          ...(faviconUrl !== undefined && { faviconUrl }),
          ...(loginBannerUrl !== undefined && { loginBannerUrl }),
          ...(primaryColor !== undefined && { primaryColor }),
          ...(secondaryColor !== undefined && { secondaryColor }),
          ...(accentColor !== undefined && { accentColor }),
          ...(sidebarBg !== undefined && { sidebarBg }),
          ...(textColor !== undefined && { textColor }),
          ...(fontFamily !== undefined && { fontFamily }),
          ...(metaTitle !== undefined && { metaTitle }),
          ...(metaDescription !== undefined && { metaDescription }),
          ...(supportEmail !== undefined && { supportEmail }),
          ...(supportPhone !== undefined && { supportPhone }),
          ...(copyrightText !== undefined && { copyrightText }),
          ...(isWhitelabelActive !== undefined && { isWhitelabelActive: Boolean(isWhitelabelActive) }),
          ...(customCss !== undefined && { customCss }),
        },
      },
      { new: true, returnDocument: 'after', upsert: true, runValidators: true }
    );

    // Two-way sync with core HRMS collections (CompanySettings & Company) if present
    try {
      const mongoose = getMongoose();
      if (mongoose.connection?.readyState === 1) {
        const syncUpdates = {};
        if (companyName !== undefined) syncUpdates.companyName = companyName.trim();
        if (logoUrl !== undefined) syncUpdates.companyLogoUrl = logoUrl;
        if (primaryColor !== undefined) syncUpdates.brandColor = primaryColor;

        if (Object.keys(syncUpdates).length > 0) {
          syncUpdates.lastCompanyUpdate = new Date();
          const orgObj = mongoose.Types.ObjectId.isValid(String(orgId))
            ? new mongoose.Types.ObjectId(String(orgId))
            : orgId;

          // 1. Sync with companysettings collection
          await mongoose.connection.collection('companysettings').updateMany(
            { $or: [{ organizationId: orgObj }, { organizationId: String(orgId) }] },
            { $set: syncUpdates }
          );

          // 2. Sync with company collection
          if (companyName !== undefined) {
            await mongoose.connection.collection('company').updateMany(
              { $or: [{ _id: orgObj }, { organizationId: orgObj }, { customerId: orgObj }] },
              { $set: { companyName: companyName.trim() } }
            );
          }

          // 3. Sync with customers collection
          if (companyName !== undefined) {
            await mongoose.connection.collection('customers').updateMany(
              { _id: orgObj },
              { $set: { companyName: companyName.trim() } }
            );
          }
        }
      }
    } catch (syncErr) {
      console.warn('[Whitelabel] Sync with Company/CompanySettings warning:', syncErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'White-label branding updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('[Whitelabel] Error updating branding:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update white-label settings.',
      error: error.message,
    });
  }
};

/**
 * POST /api/whitelabel/upload-asset
 * Handles uploaded logo / favicon / banner file and returns accessible URL.
 */
exports.uploadBrandAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    const assetType = req.body.assetType || 'logo';

    // Permission enforcement for 2nd Person (Reseller)
    if (req.user && String(req.user.role || '').toLowerCase() !== 'superadmin') {
      const { getEffectivePermissions } = require('../middleware/permissionGuard');
      const perms = await getEffectivePermissions(req.user);

      if ((assetType === 'logo' || assetType === 'darkLogo') && !perms['branding.logo.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.logo.update' to upload logo.",
        });
      }
      if (assetType === 'favicon' && !perms['branding.favicon.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.favicon.update' to upload favicon.",
        });
      }
      if (assetType === 'loginBanner' && !perms['branding.login_page.update']) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: Missing permission 'branding.login_page.update' to upload login banner.",
        });
      }
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/whitelabel/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: `${assetType} uploaded successfully.`,
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('[Whitelabel] Error uploading brand asset:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process asset upload.',
      error: error.message,
    });
  }
};
