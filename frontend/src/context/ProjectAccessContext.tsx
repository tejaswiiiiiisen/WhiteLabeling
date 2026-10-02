'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  WhiteLabelOrganization,
  WhiteLabelProjectDefinition,
  ModuleDefinition,
  ProjectAccessAssignmentData,
  PermissionTemplateData,
  CustomRoleData,
  AccessAuditLogData,
  DashboardMetrics,
  PermissionTaxonomy,
  TenantPaymentItem,
} from '../types/projectAccess';

export type ActiveView =
  | 'dashboard'
  | 'requests'
  | 'whitelabels'
  | 'clients'
  | 'revenue'
  | 'transactions'
  | 'activity-logs'
  | 'settings'
  | 'setup-requests'
  | 'organizations'
  | 'projects'
  | 'plans'
  | 'payments'
  | 'manage-access'
  | 'access-tracker'
  | 'trial-preview'
  | 'branding';

interface ProjectAccessContextValue {
  // Navigation & View
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedOrg: WhiteLabelOrganization | null;
  setSelectedOrg: (org: WhiteLabelOrganization | null) => void;
  selectedProject: WhiteLabelProjectDefinition | null;
  setSelectedProject: (proj: WhiteLabelProjectDefinition | null) => void;

  // Data Collections
  organizations: WhiteLabelOrganization[];
  projects: WhiteLabelProjectDefinition[];
  modulesHierarchy: ModuleDefinition[];
  templates: PermissionTemplateData[];
  customRoles: CustomRoleData[];
  auditLogs: AccessAuditLogData[];
  payments: TenantPaymentItem[];
  metrics: DashboardMetrics;
  isLoading: boolean;

  // Active Assignment & Permissions State
  assignment: ProjectAccessAssignmentData | null;
  permissions: Record<string, boolean>;
  targetUserEmail: string;
  setTargetUserEmail: (email: string) => void;
  targetUserName: string;
  setTargetUserName: (name: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  assigneeType: 'organization' | 'user' | 'role' | 'team';
  setAssigneeType: (type: 'organization' | 'user' | 'role' | 'team') => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredModules: ModuleDefinition[];

  // Live Summary Calculations
  totalModulesCount: number;
  enabledModulesCount: number;
  totalFeaturesCount: number;
  enabledFeaturesCount: number;
  taxonomyBreakdown: Record<PermissionTaxonomy, number>;
  accessLevel: 'Full' | 'Custom' | 'Restricted';

  // Modal / Review States
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isSuccessModalOpen: boolean;
  setIsSuccessModalOpen: (open: boolean) => void;
  isCustomRoleModalOpen: boolean;
  setIsCustomRoleModalOpen: (open: boolean) => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (open: boolean) => void;
  comparisonDiff: any | null;

  // Actions
  togglePermission: (key: string) => void;
  toggleModule: (moduleId: string, enableAll?: boolean) => void;
  enableEntireProject: () => void;
  disableEntireProject: () => void;
  applyTemplate: (templateId: string) => void;
  cloneAccess: (targetEmail: string, targetName: string, targetRole: string) => Promise<boolean>;
  saveAccessConfiguration: () => Promise<boolean>;
  confirmSaveAssignment: () => Promise<boolean>;
  startTrial: (days?: number) => Promise<boolean>;
  endTrial: () => Promise<boolean>;
  extendTrial: (days?: number) => Promise<boolean>;
  toggleOrgStatus: (orgId: string) => Promise<void>;
  createOrganization: (data: Partial<WhiteLabelOrganization>) => Promise<boolean>;
  deleteOrganization: (orgId: string) => Promise<boolean>;
  createCustomRole: (role: { name: string; description: string }) => Promise<boolean>;
  createTemplate: (template: { name: string; description: string }) => Promise<boolean>;
  recordPayment: (payment: Partial<TenantPaymentItem>) => Promise<boolean>;
  refundPayment: (paymentId: string) => Promise<boolean>;
  refreshAll: () => Promise<void>;
  verifyAction: (actionKey: string) => Promise<{ allowed: boolean; reason: string }>;
}

const ProjectAccessContext = createContext<ProjectAccessContextValue | null>(null);

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('hrms_token') ||
      localStorage.getItem('token') ||
      (document.cookie.match(/(?:^|;\s*)hrms_token=([^;]*)/)?.[1]
        ? decodeURIComponent(document.cookie.match(/(?:^|;\s*)hrms_token=([^;]*)/)![1])
        : null);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const DEFAULT_PROJECTS_LIST: WhiteLabelProjectDefinition[] = [
  {
    _id: 'proj-hrms',
    projectId: 'hrms',
    name: 'HRMS Project',
    description: 'Enterprise Human Resource & Workforce Management System with 13 Core Modules',
    projectUrl: 'http://localhost:3000',
    totalModules: 13,
    totalFeatures: 71,
    enabledFeatures: 47,
    disabledFeatures: 24,
    enabledModules: 8,
    accessStatus: 'Active',
    order: 1,
  },
  {
    _id: 'proj-hotel',
    projectId: 'hotel',
    name: 'Hotel Management System',
    description: 'Property management, room inventory, booking engine, guest check-in, and folios',
    projectUrl: 'http://localhost:5173',
    totalModules: 3,
    totalFeatures: 10,
    enabledFeatures: 10,
    disabledFeatures: 0,
    enabledModules: 3,
    accessStatus: 'Active',
    order: 2,
  },
];

export function ProjectAccessProvider({
  children,
  apiBaseUrl = '',
}: {
  children: React.ReactNode;
  apiBaseUrl?: string;
}) {
  const resolvedBaseUrl =
    apiBaseUrl !== undefined && apiBaseUrl !== ''
      ? apiBaseUrl
      : typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
        : typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3001')
          ? 'http://localhost:5001'
          : '';

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedOrg, setSelectedOrg] = useState<WhiteLabelOrganization | null>(null);
  const [selectedProject, setSelectedProject] = useState<WhiteLabelProjectDefinition | null>(null);

  const [organizations, setOrganizations] = useState<WhiteLabelOrganization[]>([]);
  const [projects, setProjects] = useState<WhiteLabelProjectDefinition[]>(DEFAULT_PROJECTS_LIST);
  const [modulesHierarchy, setModulesHierarchy] = useState<ModuleDefinition[]>([]);
  const [templates, setTemplates] = useState<PermissionTemplateData[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRoleData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AccessAuditLogData[]>([]);
  const [payments, setPayments] = useState<TenantPaymentItem[]>([
    { _id: 'pay-1', transactionId: 'TXN-901', organizationName: 'Apex Enterprises', amount: 120000, currency: 'INR', plan: 'Enterprise', billingCycle: 'Annual', paymentMethod: 'Bank Transfer', status: 'Success', paidAt: new Date('2026-08-15').toISOString() },
    { _id: 'pay-2', transactionId: 'TXN-902', organizationName: 'Zenith Global Corp', amount: 48000, currency: 'INR', plan: 'Professional', billingCycle: 'Annual', paymentMethod: 'UPI', status: 'Success', paidAt: new Date('2026-08-18').toISOString() },
    { _id: 'pay-3', transactionId: 'TXN-903', organizationName: 'Quantum Health', amount: 120000, currency: 'INR', plan: 'Enterprise', billingCycle: 'Annual', paymentMethod: 'Credit Card', status: 'Success', paidAt: new Date('2026-08-20').toISOString() },
    { _id: 'pay-4', transactionId: 'TXN-904', organizationName: 'Hyperion Systems', amount: 48000, currency: 'INR', plan: 'Professional', billingCycle: 'Annual', paymentMethod: 'Razorpay', status: 'Success', paidAt: new Date('2026-08-24').toISOString() },
    { _id: 'pay-5', transactionId: 'TXN-905', organizationName: 'Titan Industrial', amount: 120000, currency: 'INR', plan: 'Enterprise', billingCycle: 'Annual', paymentMethod: 'Bank Transfer', status: 'Success', paidAt: new Date('2026-08-26').toISOString() },
    { _id: 'pay-6', transactionId: 'TXN-906', organizationName: 'BlueWave Retail', amount: 120000, currency: 'INR', plan: 'Enterprise', billingCycle: 'Annual', paymentMethod: 'Credit Card', status: 'Success', paidAt: new Date('2026-08-28').toISOString() },
    { _id: 'pay-7', transactionId: 'TXN-907', organizationName: 'Nexa Logistics', amount: 48000, currency: 'INR', plan: 'Professional', billingCycle: 'Annual', paymentMethod: 'UPI', status: 'Success', paidAt: new Date('2026-08-30').toISOString() },
    { _id: 'pay-8', transactionId: 'TXN-908', organizationName: 'Aurora FinTech', amount: 120000, currency: 'INR', plan: 'Enterprise', billingCycle: 'Annual', paymentMethod: 'Bank Transfer', status: 'Success', paidAt: new Date('2026-09-01').toISOString() },
    { _id: 'pay-9', transactionId: 'TXN-909', organizationName: 'Starlight Media', amount: 48000, currency: 'INR', plan: 'Professional', billingCycle: 'Annual', paymentMethod: 'UPI', status: 'Success', paidAt: new Date('2026-09-02').toISOString() },
    { _id: 'pay-10', transactionId: 'TXN-910', organizationName: 'Solis Energy', amount: 50000, currency: 'INR', plan: 'Custom', billingCycle: 'Annual', paymentMethod: 'Bank Transfer', status: 'Success', paidAt: new Date('2026-09-02').toISOString() },
  ]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrganizations: 12,
    activeOrganizations: 9,
    totalProjects: 2,
    activeTrials: 4,
    customConfigurations: 7,
    totalAssignedUsers: 84,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assignment, setAssignment] = useState<ProjectAccessAssignmentData | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [targetUserEmail, setTargetUserEmail] = useState<string>('john@example.com');
  const [targetUserName, setTargetUserName] = useState<string>('John Smith');
  const [targetRole, setTargetRole] = useState<string>('HR Manager');
  const [assigneeType, setAssigneeType] = useState<'organization' | 'user' | 'role' | 'team'>('user');

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCustomRoleModalOpen, setIsCustomRoleModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [comparisonDiff, setComparisonDiff] = useState<any | null>(null);

  // 1. Fetch Master Organizations & Metrics
  const fetchOrganizations = useCallback(async () => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/organizations`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setOrganizations(json.data.organizations || []);
        if (json.data.metrics) setMetrics(json.data.metrics);

        // Auto select Apex Enterprises if not selected
        if (!selectedOrg && json.data.organizations && json.data.organizations.length > 0) {
          const apex =
            json.data.organizations.find((o: WhiteLabelOrganization) => o.companyName.includes('Apex')) ||
            json.data.organizations[0];
          setSelectedOrg(apex);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch organizations:', e);
    }
  }, [resolvedBaseUrl, selectedOrg]);

  // 2. Fetch Projects
  const fetchProjects = useCallback(async () => {
    try {
      const orgParam = selectedOrg ? `?organizationId=${selectedOrg.organizationId}` : '';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/projects${orgParam}`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const list = Array.isArray(json.data) ? json.data : [];
        const hasHrms = list.some((p: any) => p.projectId === 'hrms');
        const hasHotel = list.some((p: any) => p.projectId === 'hotel');
        const merged = [...list];
        if (!hasHrms) merged.unshift(DEFAULT_PROJECTS_LIST[0]);
        if (!hasHotel) merged.push(DEFAULT_PROJECTS_LIST[1]);
        setProjects(merged);
        if (!selectedProject && merged.length > 0) {
          setSelectedProject(merged[0]); // default to HRMS
        }
      }
    } catch (e) {
      console.warn('Failed to fetch projects:', e);
    }
  }, [resolvedBaseUrl, selectedOrg, selectedProject]);

  // 3. Fetch Project Hierarchy (HRMS all 13 modules)
  const fetchHierarchy = useCallback(
    async (projectId = 'hrms') => {
      try {
        const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/projects/${projectId}/hierarchy`, {
          headers: getAuthHeaders(),
        });
        const json = await res.json();
        if (json.success && json.data && json.data.modules) {
          setModulesHierarchy(json.data.modules);
        }
      } catch (e) {
        console.warn('Failed to fetch hierarchy:', e);
      }
    },
    [resolvedBaseUrl]
  );

  // 4. Fetch Assignment
  const fetchAssignment = useCallback(async () => {
    if (!selectedOrg) return;
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(
        `${resolvedBaseUrl}/api/whitelabel/project-access/assignments/${selectedOrg.organizationId}/${projId}`,
        { headers: getAuthHeaders() }
      );
      const json = await res.json();
      if (json.success && json.data) {
        const asgn = json.data.assignment;
        setAssignment(asgn);
        if (asgn?.permissions) {
          setPermissions(asgn.permissions);
        }
        if (asgn?.targetUserEmail) setTargetUserEmail(asgn.targetUserEmail);
        if (asgn?.targetUserName) setTargetUserName(asgn.targetUserName);
        if (asgn?.targetRole) setTargetRole(asgn.targetRole);
      }
    } catch (e) {
      console.warn('Failed to fetch assignment:', e);
    }
  }, [resolvedBaseUrl, selectedOrg, selectedProject]);

  // 5. Fetch Templates & Roles & Audit Logs
  const fetchAuxiliaryData = useCallback(async () => {
    try {
      const [tplRes, rolesRes, auditRes] = await Promise.all([
        fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/templates`, { headers: getAuthHeaders() }),
        fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/roles`, { headers: getAuthHeaders() }),
        fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/audit-logs`, { headers: getAuthHeaders() }),
      ]);
      const tplJson = await tplRes.json();
      const rolesJson = await rolesRes.json();
      const auditJson = await auditRes.json();

      if (tplJson.success) setTemplates(tplJson.data || []);
      if (rolesJson.success) setCustomRoles(rolesJson.data || []);
      if (auditJson.success) setAuditLogs(auditJson.data || []);
    } catch (e) {
      console.warn('Failed auxiliary fetch:', e);
    }
  }, [resolvedBaseUrl]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchOrganizations(), fetchProjects(), fetchHierarchy(), fetchAuxiliaryData()]);
    if (selectedOrg) {
      await fetchAssignment();
    }
    setIsLoading(false);
  }, [fetchOrganizations, fetchProjects, fetchHierarchy, fetchAuxiliaryData, fetchAssignment, selectedOrg]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // When selectedOrg or selectedProject changes, fetch assignment
  useEffect(() => {
    if (selectedOrg) {
      fetchAssignment();
    }
  }, [selectedOrg, selectedProject, fetchAssignment]);

  // Live Calculations
  const allActionKeys = useMemo(() => {
    const keys: { key: string; taxonomy: PermissionTaxonomy; moduleId: string }[] = [];
    modulesHierarchy.forEach((m) => {
      (m.actions || []).forEach((a) => {
        keys.push({ key: a.key, taxonomy: a.taxonomy, moduleId: m.id });
      });
    });
    return keys;
  }, [modulesHierarchy]);

  const totalModulesCount = modulesHierarchy.length || 13;
  const totalFeaturesCount = allActionKeys.length || 71;

  const enabledFeaturesCount = useMemo(() => {
    return Object.values(permissions).filter(Boolean).length;
  }, [permissions]);

  const enabledModulesCount = useMemo(() => {
    return modulesHierarchy.filter((m) => {
      const actions = m.actions || [];
      return actions.some((a) => permissions[a.key] === true);
    }).length;
  }, [modulesHierarchy, permissions]);

  const taxonomyBreakdown = useMemo(() => {
    const breakdown: Record<PermissionTaxonomy, number> = {
      view: 0,
      create: 0,
      edit: 0,
      delete: 0,
      approve: 0,
      reject: 0,
      import: 0,
      export: 0,
      download: 0,
      upload: 0,
      manage: 0,
    };

    allActionKeys.forEach((item) => {
      if (permissions[item.key]) {
        if (breakdown[item.taxonomy] !== undefined) {
          breakdown[item.taxonomy] += 1;
        }
      }
    });
    return breakdown;
  }, [allActionKeys, permissions]);

  const accessLevel = useMemo(() => {
    if (enabledFeaturesCount === totalFeaturesCount) return 'Full';
    if (enabledFeaturesCount <= 10) return 'Restricted';
    return 'Custom';
  }, [enabledFeaturesCount, totalFeaturesCount]);

  // Filtered Hierarchy for instant search (Requirement 8)
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modulesHierarchy;
    const q = searchQuery.toLowerCase().trim();

    return modulesHierarchy
      .map((mod) => {
        const modMatch = mod.name.toLowerCase().includes(q) || mod.id.toLowerCase().includes(q);
        const matchingActions = (mod.actions || []).filter(
          (act) =>
            act.name.toLowerCase().includes(q) ||
            act.key.toLowerCase().includes(q) ||
            act.taxonomy.toLowerCase().includes(q) ||
            (act.description && act.description.toLowerCase().includes(q))
        );

        if (modMatch) {
          return mod;
        }
        if (matchingActions.length > 0) {
          return {
            ...mod,
            actions: matchingActions,
          };
        }
        return null;
      })
      .filter(Boolean) as ModuleDefinition[];
  }, [modulesHierarchy, searchQuery]);

  // Permission Modification Actions
  const togglePermission = useCallback((key: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const toggleModule = useCallback(
    (moduleId: string, enableAll?: boolean) => {
      const targetMod = modulesHierarchy.find((m) => m.id === moduleId);
      if (!targetMod) return;

      setPermissions((prev) => {
        const next = { ...prev };
        const actions = targetMod.actions || [];
        const isCurrentlyAnyEnabled = actions.some((a) => prev[a.key]);
        const shouldEnable = enableAll !== undefined ? enableAll : !isCurrentlyAnyEnabled;

        actions.forEach((a) => {
          next[a.key] = shouldEnable;
        });
        return next;
      });
    },
    [modulesHierarchy]
  );

  const enableEntireProject = useCallback(() => {
    setPermissions((prev) => {
      const next = { ...prev };
      allActionKeys.forEach((item) => {
        next[item.key] = true;
      });
      return next;
    });
  }, [allActionKeys]);

  const disableEntireProject = useCallback(() => {
    setPermissions((prev) => {
      const next = { ...prev };
      allActionKeys.forEach((item) => {
        next[item.key] = false;
      });
      return next;
    });
  }, [allActionKeys]);

  const applyTemplate = useCallback(
    (templateId: string) => {
      const tpl = templates.find((t) => t._id === templateId || t.name === templateId);
      if (!tpl) return;

      setPermissions((prev) => {
        const next = { ...prev };
        // If template has specific keys, apply them
        if (tpl.name === 'Full Enterprise Access') {
          allActionKeys.forEach((a) => {
            next[a.key] = true;
          });
        } else {
          // Reset then apply template mappings
          allActionKeys.forEach((a) => {
            next[a.key] = Boolean(tpl.permissions[a.key]);
          });
        }
        return next;
      });
    },
    [templates, allActionKeys]
  );

  // Saving Access & Diff Preparation
  const saveAccessConfiguration = async () => {
    if (!selectedOrg) return false;

    // Calculate changes against current assignment
    const prevMap = assignment?.permissions || {};
    const newMap = permissions;
    const allKeys = Array.from(new Set([...Object.keys(prevMap), ...Object.keys(newMap)]));
    const changes: any[] = [];

    for (const key of allKeys) {
      const oldVal = Boolean(prevMap[key]);
      const newVal = Boolean(newMap[key]);
      if (oldVal !== newVal) {
        changes.push({
          key,
          name: key.replace('.', ' ').toUpperCase(),
          from: oldVal,
          to: newVal,
        });
      }
    }

    setComparisonDiff({
      changes,
      previousEnabledCount: Object.values(prevMap).filter(Boolean).length,
      newEnabledCount: Object.values(newMap).filter(Boolean).length,
      modulesCount: enabledModulesCount,
      featuresCount: enabledFeaturesCount,
    });

    // Open confirmation review modal
    setIsReviewModalOpen(true);
    return true;
  };

  const confirmSaveAssignment = async (): Promise<boolean> => {
    if (!selectedOrg) return false;
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const enabledModules = modulesHierarchy
        .filter((m) => (m.actions || []).some((a) => permissions[a.key]))
        .map((m) => m.id);

      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/assignments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          organizationId: selectedOrg.organizationId,
          projectId: projId,
          targetUserEmail,
          targetUserName,
          targetRole,
          assigneeType,
          permissions,
          modulesEnabled: enabledModules,
          status: 'Active',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsReviewModalOpen(false);
        setIsSuccessModalOpen(true);
        await refreshAll();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to save assignment:', e);
      return false;
    }
  };

  // Trial Operations
  const startTrial = async (days = 7): Promise<boolean> => {
    if (!selectedOrg) return false;
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/trial/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          organizationId: selectedOrg.organizationId,
          projectId: projId,
          days,
          targetUserEmail,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshAll();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const endTrial = async (): Promise<boolean> => {
    if (!selectedOrg) return false;
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/trial/end`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          organizationId: selectedOrg.organizationId,
          projectId: projId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshAll();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const extendTrial = async (extraDays = 7): Promise<boolean> => {
    if (!selectedOrg) return false;
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/trial/extend`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          organizationId: selectedOrg.organizationId,
          projectId: projId,
          extraDays,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshAll();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const cloneAccess = async (targetEmail: string, targetName: string, targetRole: string): Promise<boolean> => {
    if (!selectedOrg) return false;
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/clone`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          sourceOrgId: selectedOrg.organizationId,
          sourceProjectId: projId,
          targetUserEmail: targetEmail,
          targetUserName: targetName,
          targetRole: targetRole,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshAll();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const toggleOrgStatus = async (orgId: string) => {
    try {
      await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/organizations/${orgId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      await fetchOrganizations();
    } catch (e) {
      console.error(e);
    }
  };

  const createOrganization = async (data: Partial<WhiteLabelOrganization>): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/organizations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        await fetchOrganizations();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const deleteOrganization = async (orgId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/organizations/${orgId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        await fetchOrganizations();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const createCustomRole = async (role: { name: string; description: string }): Promise<boolean> => {
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/roles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: role.name,
          description: role.description,
          projectId: projId,
          permissions,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchAuxiliaryData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const createTemplate = async (tpl: { name: string; description: string }): Promise<boolean> => {
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: tpl.name,
          description: tpl.description,
          projectId: projId,
          permissions,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchAuxiliaryData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const verifyAction = async (actionKey: string): Promise<{ allowed: boolean; reason: string }> => {
    if (!selectedOrg) return { allowed: false, reason: 'No organization selected' };
    try {
      const projId = selectedProject ? selectedProject.projectId : 'hrms';
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/project-access/verify-action`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          organizationId: selectedOrg.organizationId,
          projectId: projId,
          actionKey,
        }),
      });
      const json = await res.json();
      return { allowed: Boolean(json.allowed), reason: json.reason || '' };
    } catch (e) {
      return { allowed: false, reason: 'Verification request failed' };
    }
  };

  const recordPayment = async (paymentData: Partial<TenantPaymentItem>): Promise<boolean> => {
    try {
      const amt = Number(paymentData.amount) || 24000;
      const newPay: TenantPaymentItem = {
        _id: `pay-${Date.now()}`,
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        organizationName: paymentData.organizationName || 'Custom Organization',
        amount: amt,
        currency: 'INR',
        plan: paymentData.plan || 'Professional',
        billingCycle: paymentData.billingCycle || 'Annual',
        paymentMethod: paymentData.paymentMethod || 'Bank Transfer',
        status: 'Success',
        paidAt: new Date().toISOString(),
      };
      setPayments((prev) => [newPay, ...prev]);
      return true;
    } catch (e) {
      return false;
    }
  };

  const refundPayment = async (paymentId: string): Promise<boolean> => {
    try {
      setPayments((prev) =>
        prev.map((p) =>
          p._id === paymentId || p.transactionId === paymentId
            ? { ...p, status: 'Refunded' }
            : p
        )
      );
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <ProjectAccessContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedOrg,
        setSelectedOrg,
        selectedProject,
        setSelectedProject,
        organizations,
        projects,
        modulesHierarchy,
        templates,
        customRoles,
        auditLogs,
        payments,
        metrics,
        isLoading,
        assignment,
        permissions,
        targetUserEmail,
        setTargetUserEmail,
        targetUserName,
        setTargetUserName,
        targetRole,
        setTargetRole,
        assigneeType,
        setAssigneeType,
        searchQuery,
        setSearchQuery,
        filteredModules,
        totalModulesCount,
        enabledModulesCount,
        totalFeaturesCount,
        enabledFeaturesCount,
        taxonomyBreakdown,
        accessLevel,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        isCustomRoleModalOpen,
        setIsCustomRoleModalOpen,
        isTemplateModalOpen,
        setIsTemplateModalOpen,
        comparisonDiff,
        togglePermission,
        toggleModule,
        enableEntireProject,
        disableEntireProject,
        applyTemplate,
        cloneAccess,
        saveAccessConfiguration,
        confirmSaveAssignment,
        startTrial,
        endTrial,
        extendTrial,
        toggleOrgStatus,
        createOrganization,
        deleteOrganization,
        createCustomRole,
        createTemplate,
        recordPayment,
        refundPayment,
        refreshAll,
        verifyAction,
      }}
    >
      {children}
    </ProjectAccessContext.Provider>
  );
}

export function useProjectAccess() {
  const ctx = useContext(ProjectAccessContext);
  if (!ctx) {
    throw new Error('useProjectAccess must be used within a ProjectAccessProvider');
  }
  return ctx;
}
