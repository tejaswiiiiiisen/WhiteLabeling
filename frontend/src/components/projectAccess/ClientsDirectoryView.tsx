'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  Users,
  Search,
  ExternalLink,
  Plus,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  Tag,
  Filter,
} from 'lucide-react';

export default function ClientsDirectoryView() {
  const { organizations, setActiveView, setSelectedOrg } = useProjectAccess();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  const defaultClients = [
    {
      id: 'cli-1',
      name: 'Devendra Patel',
      companyName: 'Grand Horizon Palace & Resorts',
      email: 'd.patel@grandhorizonresorts.com',
      phone: '+91 99887 76655',
      domain: 'booking.grandhorizonresorts.com',
      plan: 'Manual White Label',
      tier: 'Enterprise',
      mrr: 14999,
      usersCount: 180,
      status: 'Active',
      joinedAt: 'Today',
    },
    {
      id: 'cli-2',
      name: 'Aarav Mehta',
      companyName: 'Zenith Logistics Global',
      email: 'aarav.m@zenithlogistics.in',
      phone: '+91 98201 44552',
      domain: 'portal.zenithlogistics.in',
      plan: 'Custom White Label',
      tier: 'Enterprise',
      mrr: 24999,
      usersCount: 350,
      status: 'Active',
      joinedAt: 'Yesterday',
    },
    {
      id: 'cli-3',
      name: 'Priya Sundaram',
      companyName: 'Chennai Tech Solutions',
      email: 'priya@chennaitechsolutions.com',
      phone: '+91 94440 12345',
      domain: 'hrms.chennaitechsolutions.com',
      plan: 'Growth Tier',
      tier: 'Growth',
      mrr: 9999,
      usersCount: 45,
      status: 'Active',
      joinedAt: '2 days ago',
    },
    {
      id: 'cli-4',
      name: 'Rajesh Sharma',
      companyName: 'FinEdge Capital Solutions',
      email: 'rajesh@finedgecapital.in',
      phone: '+91 94140 23119',
      domain: 'finedge.moments.io',
      plan: 'Professional Tier',
      tier: 'Professional',
      mrr: 18000,
      usersCount: 120,
      status: 'Active',
      joinedAt: '04 Sep 2026',
    },
    {
      id: 'cli-5',
      name: 'Sarah Jenkins',
      companyName: 'Starlight Logistics UK',
      email: 'sarah.j@starlightlogistics.co.uk',
      phone: '+44 20 7946 0912',
      domain: 'starlight.moments.io',
      plan: 'Enterprise Suite',
      tier: 'Enterprise',
      mrr: 35000,
      usersCount: 450,
      status: 'Active',
      joinedAt: '03 Sep 2026',
    },
  ];

  const clientList = organizations && organizations.length > 0
    ? organizations.map((org, i) => ({
        id: org.organizationId || `cli-org-${i}`,
        name: org.companyName,
        companyName: org.companyName,
        email: `${org.subdomain || 'admin'}@${org.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: '+91 98000 12345',
        domain: org.customDomain || `${org.subdomain || 'tenant'}.moments.io`,
        plan: org.subscriptionStatus || 'Custom White Label',
        tier: 'Enterprise',
        mrr: 10000,
        usersCount: org.usersCount || 50,
        status: org.status || 'Active',
        joinedAt: 'Active',
      }))
    : defaultClients;

  const filtered = clientList.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q);

    const matchPlan = filterPlan === 'all' || c.tier.toLowerCase() === filterPlan.toLowerCase();
    return matchSearch && matchPlan;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Client Directory & Multi-Tenants
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage all onboarded enterprise clients, active organizations, licenses, and custom portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search client, company or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={() => setActiveView('organizations')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Org</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Clients</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{clientList.length}</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Provisioned</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Subscriptions</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {clientList.filter((c) => c.status === 'Active').length}
          </div>
          <span className="text-[10px] text-slate-400">Live Accounts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Users</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {clientList.reduce((sum, c) => sum + (c.usersCount || 0), 0)}
          </div>
          <span className="text-[10px] text-slate-400">Active Licenses</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Monthly MRR</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ₹{(clientList.reduce((sum, c) => sum + (c.mrr || 10000), 0) / 1000).toFixed(0)}k
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">+18.4% MRR Growth</span>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Client & Company</th>
                <th className="px-5 py-3.5">Custom Domain / Portal</th>
                <th className="px-5 py-3.5">Subscription Tier</th>
                <th className="px-5 py-3.5">Licensed Users</th>
                <th className="px-5 py-3.5">Monthly Value</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {c.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">{c.companyName}</div>
                        <div className="text-[11px] text-slate-400">{c.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                    <a
                      href={`https://${c.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{c.domain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {c.plan}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    {c.usersCount} seats
                  </td>

                  <td className="px-5 py-4 font-black text-emerald-600 dark:text-emerald-400">
                    ₹{c.mrr.toLocaleString('en-IN')}/mo
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {c.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setActiveView('settings')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>Manage</span>
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
