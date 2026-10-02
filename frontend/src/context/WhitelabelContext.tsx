'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TenantBrandingConfig, WhitelabelContextType } from '../types';
import { applyTenantTheme } from '../injector/themeInjector';

export const DEFAULT_BRANDING: TenantBrandingConfig = {
  companyName: 'Macenza HRMS',
  legalName: 'Macenza Technologies Inc.',
  tagline: 'Intelligent Enterprise Workspace',
  subdomain: '',
  customDomain: '',
  logoUrl: '',
  darkLogoUrl: '',
  faviconUrl: '',
  loginBannerUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  accentColor: '#10B981',
  sidebarBg: '#0F172A',
  textColor: '#0F172A',
  fontFamily: 'Inter, system-ui, sans-serif',
  metaTitle: 'HRMS Portal',
  metaDescription: 'Enterprise Human Resource Management System',
  supportEmail: '',
  supportPhone: '',
  copyrightText: '© Macenza. All rights reserved.',
  isWhitelabelActive: true,
};

const WhitelabelContext = createContext<WhitelabelContextType>({
  branding: DEFAULT_BRANDING,
  isLoading: true,
  isError: false,
  refetch: async () => {},
  updateBranding: async () => false,
  uploadAsset: async () => null,
});

interface WhitelabelProviderProps {
  children: React.ReactNode;
  apiBaseUrl?: string; // Optional custom API base (defaults to NEXT_PUBLIC_API_URL or port 4000)
}

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

export function WhitelabelProvider({ children, apiBaseUrl = '' }: WhitelabelProviderProps) {
  // Intelligent resolution of API base URL across Next.js and standalone Vite
  const resolvedBaseUrl =
    apiBaseUrl !== undefined && apiBaseUrl !== ''
      ? apiBaseUrl
      : typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
      : typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3001')
      ? 'http://localhost:4000'
      : '';

  const [branding, setBranding] = useState<TenantBrandingConfig>(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // 1. Fetch Branding (Tries config first, then falls back to public resolution)
  const fetchBranding = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      let fetchedData: Partial<TenantBrandingConfig> | null = null;
      const authHeaders = getAuthHeaders();

      // First attempt to fetch the configured tenant branding (authenticated / host-resolved)
      try {
        const configRes = await fetch(`${resolvedBaseUrl}/api/whitelabel/config`, {
          headers: authHeaders,
          credentials: 'include',
        });
        if (configRes.ok) {
          const configJson = await configRes.json();
          if (configJson?.data) {
            fetchedData = configJson.data;
          }
        }
      } catch (e) {
        // Fall back to public-branding endpoint
      }

      // Fallback to public-branding
      if (!fetchedData) {
        const host = typeof window !== 'undefined' ? window.location.host : '';
        const url = `${resolvedBaseUrl}/api/whitelabel/public-branding?host=${encodeURIComponent(host)}`;

        const res = await fetch(url, {
          headers: authHeaders,
          credentials: 'include',
        });
        const json = await res.json();
        if (json?.data) {
          fetchedData = json.data;
        }
      }

      if (fetchedData) {
        const merged = { ...DEFAULT_BRANDING, ...fetchedData };
        setBranding(merged);
        applyTenantTheme(merged);
      }
    } catch (err) {
      console.warn('[Whitelabel] Public branding fetch fallback:', err);
      setIsError(true);
      applyTenantTheme(DEFAULT_BRANDING);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedBaseUrl]);

  // 2. Fetch on initial mount
  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  // 3. Always apply theme whenever branding state changes
  useEffect(() => {
    if (branding) {
      applyTenantTheme(branding);
    }
  }, [branding]);

  // 4. Update tenant branding via API
  const updateBranding = async (updated: Partial<TenantBrandingConfig>): Promise<boolean> => {
    try {
      const activeOrgId = updated.organizationId || branding.organizationId;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      };
      if (activeOrgId) {
        headers['x-tenant-id'] = String(activeOrgId);
      }

      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/config`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...updated,
          ...(activeOrgId ? { organizationId: activeOrgId } : {}),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const nextState = { ...branding, ...data.data };
        setBranding(nextState);
        applyTenantTheme(nextState);
        return true;
      } else {
        console.error('[Whitelabel] Update failed:', data.message || 'Server error');
        return false;
      }
    } catch (err) {
      console.error('[Whitelabel] Error updating branding:', err);
      return false;
    }
  };

  // 5. Upload asset (logo, favicon, banner)
  const uploadAsset = async (
    file: File,
    assetType: 'logo' | 'darkLogo' | 'favicon' | 'loginBanner'
  ): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('asset', file);
      formData.append('assetType', assetType);

      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/upload-asset`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        return data.url;
      }
      return null;
    } catch (err) {
      console.error('[Whitelabel] Error uploading asset:', err);
      return null;
    }
  };

  return (
    <WhitelabelContext.Provider
      value={{
        branding,
        isLoading,
        isError,
        refetch: fetchBranding,
        updateBranding,
        uploadAsset,
      }}
    >
      {children}
    </WhitelabelContext.Provider>
  );
}

export function useWhitelabel() {
  const context = useContext(WhitelabelContext);
  if (!context) {
    throw new Error('useWhitelabel must be used within a WhitelabelProvider');
  }
  return context;
}
