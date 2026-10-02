export type PermissionTaxonomy =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'import'
  | 'export'
  | 'download'
  | 'upload'
  | 'manage';

export interface ActionDefinition {
  _id?: string;
  key: string;
  name: string;
  taxonomy: PermissionTaxonomy;
  description?: string;
  order?: number;
}

export interface ModuleDefinition {
  _id?: string;
  id: string;
  name: string;
  icon?: string;
  route: string;
  description?: string;
  order?: number;
  actions: ActionDefinition[];
}

export interface WhiteLabelProjectDefinition {
  _id?: string;
  projectId: string;
  name: string;
  logo?: string;
  description?: string;
  projectUrl: string;
  totalModules: number;
  totalFeatures: number;
  enabledFeatures?: number;
  disabledFeatures?: number;
  enabledModules?: number;
  accessStatus?: 'Active' | 'Inactive' | 'Trial' | 'Expired';
  lastUpdated?: string;
  modules?: ModuleDefinition[];
}

export interface WhiteLabelOrganization {
  _id: string;
  organizationId: string;
  organizationName: string;
  companyName: string;
  logoUrl: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  assignedProjects: string[];
  enabledFeaturesCount: number;
  enabledModulesCount?: number;
  usersCount: number;
  trialStatus: 'None' | 'Active' | 'Expired';
  subscriptionStatus: 'Active' | 'Trial' | 'Inactive' | 'Past Due';
  subdomain?: string;
  customDomain?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface TrialDetails {
  isActive: boolean;
  status: 'None' | 'Running' | 'Ended' | 'Extended';
  startDate?: string | null;
  endDate?: string | null;
  days?: number;
  startedBy?: string;
}

export interface ProjectAccessAssignmentData {
  _id?: string;
  organizationId: string;
  organizationName?: string;
  projectId: string;
  projectName?: string;
  assigneeType: 'organization' | 'user' | 'role' | 'team';
  targetUserId?: string;
  targetUserEmail: string;
  targetUserName: string;
  targetRole: string;
  team?: string;
  permissions: Record<string, boolean>;
  modulesEnabled: string[];
  totalModulesCount: number;
  enabledModulesCount: number;
  totalFeaturesCount: number;
  enabledFeaturesCount: number;
  status: 'Draft' | 'Pending' | 'Active' | 'Trial' | 'Expired' | 'Suspended' | 'Revoked';
  trial?: TrialDetails;
  accessStart?: string;
  accessEnd?: string | null;
  assignedBy?: string;
  lastUpdated?: string;
}

export interface PermissionTemplateData {
  _id?: string;
  name: string;
  description: string;
  projectId: string;
  modulesEnabled: string[];
  permissions: Record<string, boolean>;
  isSystem: boolean;
}

export interface CustomRoleData {
  _id?: string;
  name: string;
  description: string;
  projectId: string;
  organizationId?: string | null;
  permissions: Record<string, boolean>;
  modulesEnabled: string[];
  isDefault?: boolean;
}

export interface AuditLogChange {
  key: string;
  name: string;
  module: string;
  from: boolean;
  to: boolean;
}

export interface AccessAuditLogData {
  _id: string;
  organizationId: string;
  organizationName?: string;
  projectId: string;
  projectName?: string;
  adminEmail: string;
  targetUserEmail?: string;
  targetUserName?: string;
  targetRole?: string;
  action: string;
  summary: string;
  previousPermissions?: Record<string, boolean>;
  newPermissions?: Record<string, boolean>;
  changes?: AuditLogChange[];
  modulesCount?: number;
  featuresCount?: number;
  timestamp: string;
}

export interface DashboardMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  totalProjects: number;
  activeTrials: number;
  customConfigurations: number;
  totalAssignedUsers: number;
}

export interface TenantPaymentItem {
  _id: string;
  transactionId: string;
  organizationId?: string;
  organizationName: string;
  amount: number;
  currency: string;
  plan: string;
  billingCycle: string;
  paymentMethod: string;
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  invoiceUrl?: string;
  paidAt: string;
}

