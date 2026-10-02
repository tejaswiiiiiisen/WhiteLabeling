// DNS fix for Windows Atlas SRV resolution
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables (.env from backend, parent whitelabelling, or hrms-back)
dotenv.config();
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '..', '..', 'hrms', 'hrms-back', '.env') });
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const {
  tenantResolver,
  whitelabelRouter,
  projectAccessRouter,
  paymentRouter,
  tenantPlanRouter,
} = require('./index');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Silence favicon 404 in dev
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve uploaded logos & favicons statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount tenant resolver middleware
app.use(tenantResolver);

// Mount whitelabel routes
app.use('/api/whitelabel', whitelabelRouter);
app.use('/whitelabel', whitelabelRouter);

// Mount Complete White-Label Project & Access Management System Routes
app.use('/api/whitelabel/project-access', projectAccessRouter);
app.use('/whitelabel/project-access', projectAccessRouter);

// Mount Multi-Tenant SaaS Payments & Client-Owned Razorpay Engine
app.use('/api/payments', paymentRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/whitelabel/payments', paymentRouter);
app.use('/api/webhooks/razorpay', paymentRouter);

// Mount Multi-Tenant Custom Subscription Plans
app.use('/api/tenant-plans', tenantPlanRouter);
app.use('/api/whitelabel/tenant-plans', tenantPlanRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Whitelabelling Standalone Engine',
    status: 'online',
    endpoints: {
      publicBranding: '/api/whitelabel/public-branding',
      config: '/api/whitelabel/config',
      uploadAsset: '/api/whitelabel/upload-asset',
    },
  });
});

const PORT = process.env.WHITELABEL_PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Whitelabelling Engine connected to MongoDB');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning (standalone mode):', err.message);
  });

app.listen(PORT, () => {
  console.log(`🚀 Whitelabelling Standalone Server is running on http://localhost:${PORT}`);
  console.log(`👉 Public Branding API: http://localhost:${PORT}/api/whitelabel/public-branding`);
});
