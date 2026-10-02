'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Lock,
  Layers,
  Save,
  RotateCcw,
} from 'lucide-react';
import { PermissionDefinition, SecondPersonAccount, PermissionCategory } from '../../types/permissions';

interface PermissionManagerModalProps {
  secondPerson: SecondPersonAccount;
  onClose: () => void;
  onSaved: () => void;
  apiBaseUrl?: string;
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

export default function PermissionManagerModal({
  secondPerson,
  onClose,
  onSaved,
  apiBaseUrl = '',
}: PermissionManagerModalProps) {
  const resolvedBaseUrl =
    apiBaseUrl !== undefined && apiBaseUrl !== ''
      ? apiBaseUrl
      : typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
      : typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3001')
      ? 'http://localhost:4000'
      : '';

  const [permissionsList, setPermissionsList] = useState<PermissionDefinition[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const [initialPermissions, setInitialPermissions] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load all system permissions and target user's active permissions
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [permsRes, userPermsRes] = await Promise.all([
          fetch(`${resolvedBaseUrl}/api/whitelabel/permissions`, {
            headers: getAuthHeaders(),
            credentials: 'include',
          }),
          fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/users/${secondPerson._id}`, {
            headers: getAuthHeaders(),
            credentials: 'include',
          }),
        ]);

        const permsJson = await permsRes.json();
        const userPermsJson = await userPermsRes.json();

        if (permsJson?.data?.list) {
          setPermissionsList(permsJson.data.list);
        }

        const userMap = userPermsJson?.data?.permissions || {};
        setSelectedPermissions(userMap);
        setInitialPermissions(userMap);
      } catch (err) {
        console.error('Error fetching permissions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resolvedBaseUrl, secondPerson._id]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    permissionsList.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [permissionsList]);

  // Handle toggle with dependency rule:
  // If parent module is toggled OFF, automatically turn OFF child actions.
  const handleToggle = (key: string) => {
    setSelectedPermissions((prev) => {
      const next = { ...prev };
      const currentVal = Boolean(next[key]);
      const nextVal = !currentVal;
      next[key] = nextVal;

      // If turning OFF a parent permission, also turn OFF all child action permissions
      if (!nextVal) {
        permissionsList.forEach((p) => {
          if (p.parentKey === key) {
            next[p.key] = false;
          }
        });
      }

      return next;
    });
  };

  // Select all permissions in current view / category
  const handleSelectAll = (select: boolean) => {
    setSelectedPermissions((prev) => {
      const next = { ...prev };
      filteredPermissions.forEach((p) => {
        next[p.key] = select;
      });
      return next;
    });
  };

  // Reset to initial state
  const handleReset = () => {
    setSelectedPermissions(initialPermissions);
    setStatusMessage({ type: 'success', text: 'Permissions reset to last saved state.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Filter permissions by category and search
  const filteredPermissions = useMemo(() => {
    return permissionsList.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [permissionsList, activeCategory, searchQuery]);

  // Save permissions to backend
  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/users/${secondPerson._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ permissions: selectedPermissions }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setInitialPermissions(selectedPermissions);
        setStatusMessage({
          type: 'success',
          text: `Permissions successfully updated (${json.changesCount || 0} modifications logged).`,
        });
        onSaved();
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({ type: 'error', text: json.message || 'Failed to save permissions.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Network error saving permissions.' });
    } finally {
      setIsSaving(false);
    }
  };

  const enabledCount = Object.values(selectedPermissions).filter(Boolean).length;
  const totalCount = permissionsList.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn font-sans">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Permissions: {secondPerson.companyName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {secondPerson.tier} Partner
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {secondPerson.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {secondPerson.name} &bull; {secondPerson.email} &bull;{' '}
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {enabledCount} of {totalCount} permissions enabled
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Select All, Deselect All */}
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search permissions by name, key, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleSelectAll(true)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              Select All
            </button>
            <button
              onClick={() => handleSelectAll(false)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 text-gray-400" />
              Deselect All
            </button>
          </div>
        </div>

        {/* Category Pills Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 dark:border-gray-800 flex gap-1.5 overflow-x-auto shrink-0 bg-gray-50/30 dark:bg-gray-950/20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`mx-5 mt-3 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 shrink-0 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}
          >
            <Check className="w-4 h-4 shrink-0" />
            {statusMessage.text}
          </div>
        )}

        {/* Main Permissions Checkboxes List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading permission catalog...</div>
          ) : filteredPermissions.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">No matching permissions found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPermissions.map((perm) => {
                const isEnabled = Boolean(selectedPermissions[perm.key]);
                // Check if parent dependency is unmet
                const isParentDisabled = perm.parentKey ? !Boolean(selectedPermissions[perm.parentKey]) : false;

                return (
                  <div
                    key={perm.key}
                    onClick={() => !isParentDisabled && handleToggle(perm.key)}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isParentDisabled
                        ? 'opacity-40 bg-gray-100 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 cursor-not-allowed'
                        : isEnabled
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/60 shadow-xs'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {perm.name}
                        </span>
                        {perm.isWhiteLabel && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            White Label
                          </span>
                        )}
                        {perm.isPage && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Page
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {perm.description || `Key: ${perm.key}`}
                      </p>
                      <div className="text-[10px] font-mono text-gray-400">
                        {perm.key}
                        {perm.parentKey && (
                          <span className="ml-1 text-amber-600 dark:text-amber-400 font-sans">
                            (requires {perm.parentKey})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        disabled={isParentDisabled}
                        onChange={() => {}} // Handled by outer div
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Changes
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving Permissions...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
