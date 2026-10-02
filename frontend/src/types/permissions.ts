export type PermissionCategory =
  | 'White Label'
  | 'Dashboard'
  | 'Users'
  | 'Customers'
  | 'Products'
  | 'Orders'
  | 'Inventory'
  | 'Payments'
  | 'Reports'
  | 'Analytics'
  | 'Settings'
  | 'Subscription'
  | 'Notifications'
  | 'Profile'
  | 'Audit Logs';

export interface PermissionDefinition {
  _id?: string;
  key: string;
  name: string;
  category: PermissionCategory;
  module: string;
  action: string;
  parentKey?: string | null;
  description?: string;
  isWhiteLabel?: boolean;
  isPage?: boolean;
}

export interface SecondPersonAccount {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  domain?: string;
  tier: 'Agency' | 'Silver' | 'Gold' | 'Platinum';
  status: 'Active' | 'Pending' | 'Suspended';
  commissionRate: number;
  enabledPermissionsCount: number;
  totalPermissionsCount: number;
  createdAt: string;
}

export interface PermissionAuditLogEntry {
  _id: string;
  adminId: string;
  adminEmail: string;
  targetUserId: string;
  targetUserEmail?: string;
  targetUserName?: string;
  permissionKey: string;
  oldValue: boolean;
  newValue: boolean;
  action: string;
  ipAddress: string;
  createdAt: string;
}
