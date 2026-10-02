'use client';
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { Building2, Search, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CustomersTab() {
  const { customers, setActiveTab } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reseller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Customer & Tenant Directory
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Global multi-tenant organizations provisioned directly or under partner reseller accounts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenant or reseller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Organization</th>
                <th className="px-5 py-3.5">Assigned Reseller</th>
                <th className="px-5 py-3.5">Plan Tier</th>
                <th className="px-5 py-3.5">Users</th>
                <th className="px-5 py-3.5">Monthly MRR</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900 dark:text-white">{c.name}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500">{c.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">{c.reseller}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {c.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {c.usersCount} users
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                    ${c.mrr}/mo
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setActiveTab('branding')}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Configure Branding
                    </button>
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
