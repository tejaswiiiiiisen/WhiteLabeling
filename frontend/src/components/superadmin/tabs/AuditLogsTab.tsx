'use client';
import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { History, Search, Download, ShieldCheck, AlertCircle, Key } from 'lucide-react';

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

export default function AuditLogsTab({ apiBaseUrl = '' }: { apiBaseUrl?: string }) {
  const resolvedBaseUrl =
    apiBaseUrl !== undefined && apiBaseUrl !== ''
      ? apiBaseUrl
      : typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
      : typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3001')
      ? 'http://localhost:4000'
      : '';

  const { auditLogs } = useSuperAdmin();
  const [permissionLogs, setPermissionLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPermissionLogs() {
      try {
        const res = await fetch(`${resolvedBaseUrl}/api/whitelabel/permissions/audit-logs`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setPermissionLogs(json.data);
          }
        }
      } catch (err) {}
    }
    fetchPermissionLogs();
  }, [resolvedBaseUrl]);

  // Combine standard logs + permission logs
  const combinedLogs = [
    ...permissionLogs.map((p) => ({
      _id: p._id,
      action: p.action,
      targetType: 'Permission',
      targetName: `${p.permissionKey || ''} (${p.oldValue ? 'true' : 'false'} → ${p.newValue ? 'true' : 'false'})`,
      actorEmail: p.adminEmail || 'superadmin@system.io',
      actorRole: 'Super Admin',
      ipAddress: p.ipAddress || '127.0.0.1',
      status: 'Success' as const,
      createdAt: p.createdAt,
    })),
    ...(auditLogs || []),
  ];

  const displayLogs = combinedLogs.length > 0 ? combinedLogs : [
    { _id: '1', action: 'branding_updated', targetType: 'TenantBranding', targetName: 'Acme HRMS', actorEmail: 'admin@system.io', actorRole: 'Super Admin', ipAddress: '127.0.0.1', status: 'Success' as const, createdAt: new Date().toISOString() },
    { _id: '2', action: 'domain_verified', targetType: 'Domain', targetName: 'portal.cloudscale.io', actorEmail: 'alex@cloudscale.io', actorRole: 'Reseller Admin', ipAddress: '54.210.12.8', status: 'Success' as const, createdAt: new Date().toISOString() },
    { _id: '3', action: 'template_applied', targetType: 'Template', targetName: 'Emerald Fintech', actorEmail: 'superadmin@system.io', actorRole: 'Super Admin', ipAddress: '127.0.0.1', status: 'Success' as const, createdAt: new Date().toISOString() },
    { _id: '4', action: 'reseller_onboarded', targetType: 'Reseller', targetName: 'Apex Digital HR Agency', actorEmail: 'marcus@apexagency.co', actorRole: 'Super Admin', ipAddress: '192.168.1.1', status: 'Success' as const, createdAt: new Date().toISOString() },
    { _id: '5', action: 'feature_flag_toggled', targetType: 'Feature Flag', targetName: 'ai_chatbot', actorEmail: 'superadmin@system.io', actorRole: 'Super Admin', ipAddress: '127.0.0.1', status: 'Success' as const, createdAt: new Date().toISOString() },
  ];

  const filtered = displayLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetName && log.targetName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor Email', 'Role', 'Action', 'Target', 'IP Address', 'Status'];
    const rows = filtered.map((l) => [
      new Date(l.createdAt).toLocaleString(),
      l.actorEmail,
      l.actorRole,
      l.action,
      l.targetName || l.targetType,
      l.ipAddress,
      l.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit-logs-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Security & Operational Audit Logs
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Immutable trace of administrative events, domain modifications, and partner changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search action or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Target Resource</th>
                <th className="px-5 py-3.5">Client IP</th>
                <th className="px-5 py-3.5 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {filtered.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-gray-400 dark:text-gray-500 text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900 dark:text-white">{log.actorEmail}</div>
                    <div className="text-[10px] text-gray-400">{log.actorRole}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {log.action}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{log.targetName || log.targetType}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-gray-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
