const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getPublicBranding,
  getTenantBranding,
  updateTenantBranding,
  uploadBrandAsset,
} = require('../controllers/brandingController');

const { createSuperAdminRouter, superAdminRouter } = require('./superAdminRoutes');
const { createPermissionRouter, permissionRouter } = require('./permissionRoutes');
const { createTenantPlanRouter, tenantPlanRouter } = require('./tenantPlanRoutes');
const { createPaymentRouter, paymentRouter } = require('./paymentRoutes');

const router = express.Router();

// 1. Setup local disk storage for Whitelabel assets
const uploadDir = path.join(process.cwd(), 'uploads', 'whitelabel');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'brand-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, SVG, ICO) are allowed!'));
    }
  },
});

/**
 * Public route for pre-login branding resolution
 * Resolves by subdomain, custom domain, or query param
 */
router.get('/public-branding', getPublicBranding);

/**
 * Higher-order middleware injector to support flexible auth middleware:
 * Allows the host app (HRMS) to pass its own `authenticate` & `authorize` middlewares.
 */
function createWhitelabelRouter(authMiddleware = null, adminOnlyMiddleware = null) {
  const customRouter = express.Router();

  // Public route
  customRouter.get('/public-branding', getPublicBranding);

  // If host auth middleware is passed, apply it to protected routes
  if (authMiddleware) {
    customRouter.use(authMiddleware);
  }

  // Tenant admin endpoints
  customRouter.get('/config', getTenantBranding);

  if (adminOnlyMiddleware) {
    customRouter.put('/config', adminOnlyMiddleware, updateTenantBranding);
    customRouter.post('/upload-asset', adminOnlyMiddleware, upload.single('asset'), uploadBrandAsset);
    customRouter.use('/admin', adminOnlyMiddleware, createSuperAdminRouter(null, adminOnlyMiddleware));
    customRouter.use('/permissions', createPermissionRouter(null, adminOnlyMiddleware));
    customRouter.use('/plans', createTenantPlanRouter(null, adminOnlyMiddleware));
    customRouter.use('/payments', createPaymentRouter(null, adminOnlyMiddleware));
  } else {
    customRouter.put('/config', updateTenantBranding);
    customRouter.post('/upload-asset', upload.single('asset'), uploadBrandAsset);
    customRouter.use('/admin', createSuperAdminRouter());
    customRouter.use('/permissions', createPermissionRouter());
    customRouter.use('/plans', createTenantPlanRouter());
    customRouter.use('/payments', createPaymentRouter());
  }

  return customRouter;
}

// Default export without auth wrappers (for open or externally guarded usage)
router.get('/config', getTenantBranding);
router.put('/config', updateTenantBranding);
router.post('/upload-asset', upload.single('asset'), uploadBrandAsset);
router.use('/admin', superAdminRouter);
router.use('/permissions', permissionRouter);
router.use('/plans', tenantPlanRouter);
router.use('/payments', paymentRouter);

module.exports = {
  whitelabelRouter: router,
  createWhitelabelRouter,
};
