# 🌟 Enterprise Decoupled White-labeling Engine

This repository houses the complete, independent White-labeling Core Engine for multi-tenant applications.

---

## 📁 Architecture Overview

```
whitelabelling/
├── package.json
├── backend/
│   ├── index.js                      # Master Backend Entry Point
│   ├── middleware/
│   │   └── tenantResolver.js         # Subdomain, Domain & Header Tenant Identification
│   ├── models/
│   │   └── TenantBranding.js         # Multi-tenant White-label Schema
│   ├── controllers/
│   │   └── brandingController.js     # Public Branding, Admin Config & Asset Uploads
│   └── routes/
│       └── whitelabelRoutes.js       # Express Router (/public-branding, /config, /upload-asset)
│
└── frontend/
    └── src/
        ├── index.ts                  # Master Frontend Entry Point
        ├── types/                    # TypeScript Data Contracts
        ├── injector/
        │   └── themeInjector.ts      # CSS Variables, Favicon & Document Title Injector
        ├── context/
        │   └── WhitelabelContext.tsx  # React Context & useWhitelabel() Hook
        └── components/
            └── WhitelabelSettingsPanel.tsx # Live Preview & Studio Settings Panel
```

---

## 🔌 Integration Instructions

### 1. Backend Integration (Express)
Mount the whitelabel engine non-invasively into any Express host application:

```javascript
const { tenantResolver, createWhitelabelRouter } = require('../../whitelabelling/backend');

// 1. Mount Tenant Identification Middleware
app.use(tenantResolver);

// 2. Mount Whitelabel Routes with Host Auth Middleware
app.use('/api/whitelabel', createWhitelabelRouter(authenticate, authorize('admin', 'hr', 'superadmin')));
```

### 2. Frontend Integration (React / Next.js)
Wrap your application in the `WhitelabelProvider`:

```tsx
import { WhitelabelProvider } from '../../../whitelabelling/frontend/src';

export default function RootLayout({ children }) {
  return (
    <WhitelabelProvider>
      {children}
    </WhitelabelProvider>
  );
}
```

Mount the Settings Panel in your Admin Settings:

```tsx
import { WhitelabelSettingsPanel } from '../../../whitelabelling/frontend/src';

export default function BrandingPage() {
  return <WhitelabelSettingsPanel />;
}
```