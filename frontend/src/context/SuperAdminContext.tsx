'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SuperAdminTab,
  TemplateItem,
  WhiteLabelProductItem,
  ResellerItem,
  CustomerItem,
  SubscriptionItem,
  PaymentItem,
  CommissionItem,
  DomainItem,
  FeatureFlagItem,
  AuditLogItem,
  SuperAdminOverviewMetrics,
} from '../types/superAdmin';

interface SuperAdminContextValue {
  activeTab: SuperAdminTab;
  setActiveTab: (tab: SuperAdminTab) => void;
  isLoading: boolean;
  metrics: SuperAdminOverviewMetrics;
  templates: TemplateItem[];
  products: WhiteLabelProductItem[];
  resellers: ResellerItem[];
  customers: CustomerItem[];
  subscriptions: SubscriptionItem[];
  payments: PaymentItem[];
  commissions: CommissionItem[];
  domains: DomainItem[];
  featureFlags: FeatureFlagItem[];
  auditLogs: AuditLogItem[];
  refreshAll: () => Promise<void>;
  applyTemplate: (templateId: string, orgId?: string) => Promise<boolean>;
  createTemplate: (data: Partial<TemplateItem>) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<WhiteLabelProductItem>) => Promise<boolean>;
  createReseller: (data: Partial<ResellerItem>) => Promise<boolean>;
  addDomain: (data: Partial<DomainItem>) => Promise<boolean>;
  verifyDomain: (id: string) => Promise<boolean>;
  toggleFeatureFlag: (id: string, isGlobalEnabled: boolean) => Promise<boolean>;
  processPayout: (resellerId: string, amount: number) => Promise<boolean>;
}

const SuperAdminContext = createContext<SuperAdminContextValue | null>(null);

const DEFAULT_METRICS: SuperAdminOverviewMetrics = {
  totalRevenue: 284500,
  monthlyRecurringRevenue: 34800,
  activeTenants: 12,
  activeResellers: 4,
  totalProducts: 5,
  totalTemplates: 5,
  verifiedDomains: 3,
  activeFeatures: 5,
  commissionPaid: 48900,
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
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

export function SuperAdminProvider({
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
      ? 'http://localhost:4000'
      : '';

  const [activeTab, setActiveTab] = useState<SuperAdminTab>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [metrics, setMetrics] = useState<SuperAdminOverviewMetrics>(DEFAULT_METRICS);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [products, setProducts] = useState<WhiteLabelProductItem[]>([]);
  const [resellers, setResellers] = useState<ResellerItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  const fetchEndpoint = useCallback(
    async (path: string) => {
      try {
        const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin${path}`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        // Soft fallback
      }
      return null;
    },
    [resolvedBaseUrl]
  );

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        overviewData,
        templatesData,
        productsData,
        resellersData,
        customersData,
        subscriptionsData,
        paymentsData,
        commissionsData,
        domainsData,
        featuresData,
        auditLogsData,
      ] = await Promise.all([
        fetchEndpoint('/overview'),
        fetchEndpoint('/templates'),
        fetchEndpoint('/products'),
        fetchEndpoint('/resellers'),
        fetchEndpoint('/customers'),
        fetchEndpoint('/subscriptions'),
        fetchEndpoint('/payments'),
        fetchEndpoint('/commissions'),
        fetchEndpoint('/domains'),
        fetchEndpoint('/features'),
        fetchEndpoint('/audit-logs'),
      ]);

      if (overviewData?.metrics) setMetrics(overviewData.metrics);
      if (templatesData) setTemplates(templatesData);
      if (productsData) setProducts(productsData);
      if (resellersData) setResellers(resellersData);
      if (customersData) setCustomers(customersData);
      if (subscriptionsData) setSubscriptions(subscriptionsData);
      if (paymentsData) setPayments(paymentsData);
      if (commissionsData) setCommissions(commissionsData);
      if (domainsData) setDomains(domainsData);
      if (featuresData) setFeatureFlags(featuresData);
      if (auditLogsData) setAuditLogs(auditLogsData);
    } finally {
      setIsLoading(false);
    }
  }, [fetchEndpoint]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Actions
  const applyTemplate = async (templateId: string, orgId?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/templates/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ templateId, organizationId: orgId }),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  const createTemplate = async (data: Partial<TemplateItem>): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  const updateProduct = async (id: string, data: Partial<WhiteLabelProductItem>): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  const createReseller = async (data: Partial<ResellerItem>): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/resellers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  const addDomain = async (data: Partial<DomainItem>): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  const verifyDomain = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/domains/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  const toggleFeatureFlag = async (id: string, isGlobalEnabled: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/features/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ isGlobalEnabled }),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  const processPayout = async (resellerId: string, amount: number): Promise<boolean> => {
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/admin/commissions/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ resellerId, amount }),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (e) {}
    return false;
  };

  return (
    <SuperAdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isLoading,
        metrics,
        templates,
        products,
        resellers,
        customers,
        subscriptions,
        payments,
        commissions,
        domains,
        featureFlags,
        auditLogs,
        refreshAll,
        applyTemplate,
        createTemplate,
        updateProduct,
        createReseller,
        addDomain,
        verifyDomain,
        toggleFeatureFlag,
        processPayout,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  return useContext(SuperAdminContext);
}
