export type SuperAdminTab =
  | 'overview'
  | 'requests'
  | 'whitelabels'
  | 'clients'
  | 'revenue'
  | 'transactions'
  | 'activity-logs'
  | 'settings'
  | 'templates'
  | 'products'
  | 'setup-requests'
  | 'resellers'
  | 'customers'
  | 'subscriptions'
  | 'payments'
  | 'commissions'
  | 'domains'
  | 'branding'
  | 'features'
  | 'audit-logs';

export interface WhiteLabelSetupRequestItem {
  _id: string;
  orderId?: any;
  paymentOrderId?: any;
  internalOrderId?: any;
  userId?: any;
  userModel?: string;
  userEmail?: string;
  customerEmail?: string;
  userName?: string;
  customerName?: string;
  plan: string;
  planName: string;
  amount?: number;
  currency?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  setupStatus: 'NEW' | 'REVIEWING' | 'IN_PROGRESS' | 'TESTING' | 'DEPLOYED' | 'COMPLETED' | 'CANCELLED' | 'PENDING' | 'ACCEPTED' | 'Accepted';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentId?: string;
  setupDetails?: {
    companyName?: string;
    logoUrl?: string;
    brandColors?: string[];
    faviconUrl?: string;
    customDomain?: string;
    contactEmail?: string;
    companyWebsite?: string;
    additionalRequirements?: string;
    submittedAt?: string;
  };
  notes?: string;
  adminNotes?: string;
  assignedEngineer?: string;
  estimatedCompletion?: string;
  completedAt?: string;
  statusHistory?: Array<{
    status: string;
    updatedBy?: string;
    updatedAt?: string | Date;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    sidebarBg: string;
    textColor: string;
  };
  fontFamily: string;
  borderRadius?: string;
  previewImage?: string;
  isDefault?: boolean;
  activeTenantsCount: number;
}

export interface WhiteLabelProductItem {
  _id: string;
  slug: string;
  name: string;
  category: string;
  version: string;
  description: string;
  basePrice: number;
  billingCycle: 'monthly' | 'annual' | 'one-time';
  status: 'Published' | 'Beta' | 'Coming Soon' | 'Archived';
  allowedTiers: string[];
  featureKeys: string[];
  activeResellersCount: number;
}

export interface ResellerItem {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  domain: string;
  subdomain?: string;
  commissionRate: number;
  tier: 'Agency' | 'Silver' | 'Gold' | 'Platinum';
  status: 'Active' | 'Pending' | 'Suspended';
  totalCustomers: number;
  totalGMV: number;
  payoutDetails?: {
    method: string;
    bankName?: string;
    accountNumber?: string;
    upiId?: string;
  };
  assignedProducts?: string[];
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  plan: string;
  reseller: string;
  usersCount: number;
  mrr: number;
  status: 'Active' | 'Trial' | 'Suspended' | 'Past Due';
  createdAt?: string | Date;
}

export interface SubscriptionItem {
  id: string;
  customerName: string;
  plan: string;
  billingCycle: 'Monthly' | 'Annual';
  amount: number;
  nextBilling: string;
  status: 'Active' | 'In Trial' | 'Grace Period' | 'Canceled';
  autoRenew: boolean;
}

export interface PaymentItem {
  id: string;
  customer: string;
  reseller: string;
  amount: number;
  currency: string;
  gateway: 'Stripe' | 'Razorpay' | 'Bank Wire';
  status: 'Captured' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
}

export interface CommissionItem {
  id: string;
  resellerName: string;
  totalEarned: number;
  pendingPayout: number;
  paidOut: number;
  rate: number;
  nextPayout: string;
  status: 'Ready for Batch' | 'Approved' | 'Paid';
}

export interface DomainItem {
  _id: string;
  domain: string;
  companyName: string;
  resellerName: string;
  type: 'Custom Domain' | 'Subdomain';
  sslStatus: 'Active' | 'Pending' | 'Expired' | 'Renewing';
  verificationStatus: 'Verified' | 'Pending DNS' | 'Failed';
  cnameTarget: string;
  dnsTxtRecord?: string;
  lastCheckedAt?: string | Date;
}

export interface FeatureFlagItem {
  _id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  isGlobalEnabled: boolean;
  allowedPlans: string[];
  rolloutStatus: 'GA' | 'Beta' | 'Alpha' | 'Internal Only';
}

export interface AuditLogItem {
  _id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetName: string;
  details?: Record<string, any>;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
  createdAt: string;
}

export interface SuperAdminOverviewMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeTenants: number;
  activeResellers: number;
  totalProducts: number;
  totalTemplates: number;
  verifiedDomains: number;
  activeFeatures: number;
  commissionPaid: number;
}
