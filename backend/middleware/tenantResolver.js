const TenantBranding = require('../models/TenantBranding');

/**
 * Enterprise Tenant Resolver Middleware
 * Automatically extracts and attaches tenant white-label context to incoming requests.
 */
async function tenantResolver(req, res, next) {
  try {
    let resolvedOrgId = null;
    let queryFilter = null;

    // 1. Check custom headers
    const headerOrgId = req.headers['x-tenant-id'] || req.headers['x-organization-id'];
    if (headerOrgId) {
      resolvedOrgId = headerOrgId;
      queryFilter = { organizationId: headerOrgId };
    }

    // 2. Check query params (useful for public links or preview)
    if (!queryFilter && (req.query.tenantId || req.query.orgId)) {
      resolvedOrgId = req.query.tenantId || req.query.orgId;
      queryFilter = { organizationId: resolvedOrgId };
    }

    // 3. Check Subdomain / Host Header
    if (!queryFilter) {
      const host = req.headers.host || '';
      // Clean host from port (e.g. "acme.localhost:3000" -> "acme.localhost")
      const hostname = host.split(':')[0].toLowerCase();

      // Check if hostname is an exact match for a custom domain (e.g. hrms.client.com)
      if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        // First check custom domain
        const customDomainBrand = await TenantBranding.findOne({
          customDomain: hostname,
          isWhitelabelActive: true,
        }).lean();

        if (customDomainBrand) {
          req.tenantBranding = customDomainBrand;
          req.resolvedOrgId = customDomainBrand.organizationId;
          return next();
        }

        // Next, check subdomain (e.g. "acme.myhrms.com" or "acme.localhost")
        const parts = hostname.split('.');
        if (parts.length >= 2) {
          const possibleSubdomain = parts[0];
          if (possibleSubdomain && !['www', 'api', 'app', 'admin'].includes(possibleSubdomain)) {
            queryFilter = { subdomain: possibleSubdomain };
          }
        }
      }
    }

    // 4. If we have a query filter, resolve branding from DB
    if (queryFilter) {
      const branding = await TenantBranding.findOne({
        ...queryFilter,
        isWhitelabelActive: true,
      }).lean();

      if (branding) {
        req.tenantBranding = branding;
        req.resolvedOrgId = branding.organizationId;
      } else if (resolvedOrgId) {
        req.resolvedOrgId = resolvedOrgId;
      }
    } else if (resolvedOrgId) {
      req.resolvedOrgId = resolvedOrgId;
    }

    next();
  } catch (err) {
    console.error('[Whitelabel] Tenant resolution warning:', err.message);
    // Non-blocking: Proceed to next middleware even if resolution hits an issue
    next();
  }
}

module.exports = tenantResolver;
