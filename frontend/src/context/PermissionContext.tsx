'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PermissionDefinition } from '../types/permissions';

interface PermissionContextValue {
  permissions: Record<string, boolean>;
  isSuperAdmin: boolean;
  role: string;
  isLoading: boolean;
  hasPermission: (key: string) => boolean;
  can: (module: string, action: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

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

export function PermissionProvider({
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

  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(true); // Super Admin by default
  const [role, setRole] = useState<string>('superadmin');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/me`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setIsSuperAdmin(Boolean(json.data.isSuperAdmin));
          setRole(json.data.role || 'reseller');
          setPermissions(json.data.permissions || {});
        }
      }
    } catch (e) {
      // Soft fallback
    } finally {
      setIsLoading(false);
    }
  }, [resolvedBaseUrl]);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  const hasPermission = useCallback(
    (key: string): boolean => {
      // Super Admin bypasses all checks
      if (isSuperAdmin) return true;
      return Boolean(permissions[key]);
    },
    [isSuperAdmin, permissions]
  );

  const can = useCallback(
    (module: string, action: string): boolean => {
      if (isSuperAdmin) return true;
      const key = `${module}.${action}`;
      return Boolean(permissions[key]);
    },
    [isSuperAdmin, permissions]
  );

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        isSuperAdmin,
        role,
        isLoading,
        hasPermission,
        can,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    // If used outside provider, default to safe superadmin permissive pass
    return {
      permissions: {},
      isSuperAdmin: true,
      role: 'superadmin',
      isLoading: false,
      hasPermission: () => true,
      can: () => true,
      refreshPermissions: async () => {},
    };
  }
  return ctx;
}
