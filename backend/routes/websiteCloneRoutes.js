const express = require('express');
const {
  analyzeUrl,
  saveWebsite,
  listWebsites,
  getWebsiteById,
  deleteWebsite,
  publishWebsite,
  renderPublicClonedSite,
} = require('../controllers/websiteCloneController');

function createWebsiteCloneRouter(authMiddleware = null, adminOnlyMiddleware = null) {
  const router = express.Router();

  // Public preview route for published clones
  router.get('/preview/:subdomain', renderPublicClonedSite);

  // Authenticated endpoints if auth middleware provided
  if (authMiddleware) {
    router.use(authMiddleware);
  }

  router.post('/analyze', analyzeUrl);
  router.post('/save', saveWebsite);
  router.get('/list', listWebsites);
  router.get('/:id', getWebsiteById);
  router.delete('/:id', deleteWebsite);
  router.post('/:id/publish', publishWebsite);

  return router;
}

const websiteCloneRouter = createWebsiteCloneRouter();

module.exports = {
  websiteCloneRouter,
  createWebsiteCloneRouter,
};
