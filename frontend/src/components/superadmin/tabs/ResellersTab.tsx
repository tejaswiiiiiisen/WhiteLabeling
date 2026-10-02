'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Shield,
  ShieldCheck,
  Key,
  Trash2,
  Power,
  Search,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import PermissionManagerModal from '../PermissionManagerModal';
import { SecondPersonAccount } from '../../../types/permissions';

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

export default function ResellersTab({ apiBaseUrl = '' }: { apiBaseUrl?: string }) {
  const resolvedBaseUrl =
    apiBaseUrl !== undefined && apiBaseUrl !== ''
      ? apiBaseUrl
      : typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
      : typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3001')
      ? 'http://localhost:4000'
      : '';

  const [secondPersons, setSecondPersons] = useState<SecondPersonAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForPerms, setSelectedForPerms] = useState<SecondPersonAccount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    companyName: '',
    domain: '',
    tier: 'Silver' as const,
    commissionRate: 20,
  });

  const fetchSecondPersons = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/second-persons`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setSecondPersons(json.data);
        }
      }
    } catch (err) {
      console.warn('Error loading 2nd Person list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedBaseUrl]);

  useEffect(() => {
    fetchSecondPersons();
  }, [fetchSecondPersons]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/second-persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(createForm),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsAddModalOpen(false);
        setToast({ type: 'success', text: `2nd Person account '${createForm.companyName}' created successfully.` });
        fetchSecondPersons();
        setCreateForm({ name: '', email: '', companyName: '', domain: '', tier: 'Silver', commissionRate: 20 });
        setTimeout(() => setToast(null), 4000);
      } else {
        setToast({ type: 'error', text: json.message || 'Failed to create account.' });
      }
    } catch (e: any) {
      setToast({ type: 'error', text: e.message || 'Error creating account.' });
    }
  };

  const handleToggleStatus = async (account: SecondPersonAccount) => {
    const nextStatus = account.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/second-persons/${account._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setToast({ type: 'success', text: `Account '${account.companyName}' is now ${nextStatus}.` });
        fetchSecondPersons();
        setTimeout(() => setToast(null), 3000);
      }
    } catch (e) {}
  };

  const handleDelete = async (account: SecondPersonAccount) => {
    if (!confirm(`Are you sure you want to delete '${account.companyName}'? This will remove all assigned permissions.`)) {
      return;
    }
    try {
      const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/second-persons/${account._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        setToast({ type: 'success', text: `Account '${account.companyName}' deleted.` });
        fetchSecondPersons();
        setTimeout(() => setToast(null), 3000);
      }
    } catch (e) {}
  };

  const filtered = secondPersons.filter(
    (s) =>
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            2nd Person (Reseller / Client) & Permission Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Super Admin control center: manage 2nd Person accounts, assign modular & action permissions, and govern white-label rights.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create 2nd Person Account
        </button>
      </div>

      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <Check className="w-4 h-4 shrink-0" />
          {toast.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search 2nd Person by company, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* 2nd Person Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">2nd Person / Client</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Tier</th>
                <th className="px-5 py-3.5">Assigned Permissions</th>
                <th className="px-5 py-3.5">Domain</th>
                <th className="px-5 py-3.5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    Loading 2nd Person accounts...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    No 2nd Person accounts found. Click "Create 2nd Person Account" to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((account) => (
                  <tr key={account._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {account.companyName}
                      </div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500">
                        {account.name} &bull; <span className="font-mono">{account.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          account.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {account.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-extrabold text-gray-900 dark:text-white">
                          {account.enabledPermissionsCount ?? 40}
                        </span>
                        <span className="text-gray-400">/ {account.totalPermissionsCount ?? 40} enabled</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-blue-600 dark:text-blue-400">
                      {account.domain || 'N/A'}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedForPerms(account)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        Manage Permissions
                      </button>

                      <button
                        onClick={() => handleToggleStatus(account)}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          account.status === 'Active'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                        }`}
                        title={account.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(account)}
                        className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-rose-50 hover:border-rose-300 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Manager Modal */}
      {selectedForPerms && (
        <PermissionManagerModal
          secondPerson={selectedForPerms}
          onClose={() => setSelectedForPerms(null)}
          onSaved={() => {
            fetchSecondPersons();
          }}
          apiBaseUrl={resolvedBaseUrl}
        />
      )}

      {/* Create 2nd Person Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Create 2nd Person Account
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex HR Innovations"
                  value={createForm.companyName}
                  onChange={(e) => setCreateForm({ ...createForm, companyName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Sterling"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Email Login
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@apex.io"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Custom Subdomain / Host
                </label>
                <input
                  type="text"
                  placeholder="portal.apex.io"
                  value={createForm.domain}
                  onChange={(e) => setCreateForm({ ...createForm, domain: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Tier
                  </label>
                  <select
                    value={createForm.tier}
                    onChange={(e) => setCreateForm({ ...createForm, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Agency">Agency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={createForm.commissionRate}
                    onChange={(e) => setCreateForm({ ...createForm, commissionRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
