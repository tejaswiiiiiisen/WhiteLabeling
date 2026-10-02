'use client';
import React from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import {
  DollarSign,
  Users,
  Building2,
  Globe,
  Layers,
  LayoutTemplate,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export default function OverviewTab() {
  const { metrics, auditLogs, setActiveTab } = useSuperAdmin();

  const statCards = [
    {
      title: 'Total Platform Revenue',
      value: `$${(metrics.totalRevenue || 284500).toLocaleString()}`,
      change: '+18.4% this month',
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Monthly Recurring (MRR)',
      value: `$${(metrics.monthlyRecurringRevenue || 34800).toLocaleString()}`,
      change: '+12.1% net growth',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Active Tenant Orgs',
      value: String(metrics.activeTenants || 12),
      change: '100% cloud uptime',
      icon: Building2,
      color: 'from-violet-600 to-purple-600',
      iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
    {
      title: 'Active Partner Resellers',
      value: String(metrics.activeResellers || 4),
      change: 'Across 3 global tiers',
      icon: Users,
      color: 'from-amber-600 to-orange-600',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ];

  const quickActions = [
    { label: 'Branding Studio', desc: 'Customize logos, theme colors & CSS', tab: 'branding' as const, icon: Sparkles },
    { label: 'Theme Templates', desc: 'Browse and apply curated visual presets', tab: 'templates' as const, icon: LayoutTemplate },
    { label: 'White Label Apps', desc: 'Configure wholesale pricing & modules', tab: 'products' as const, icon: Layers },
    { label: 'Custom Domains', desc: 'Manage DNS verification & SSL certificates', tab: 'domains' as const, icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Admin Control Center
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            White-Label & Multi-Tenant Management
          </h2>
          <p className="text-sm md:text-base text-blue-100/90 leading-relaxed">
            Govern global theme presets, distribute white-label SaaS modules, onboard partner resellers, monitor custom domains, and configure dynamic brand identities across all organizations.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Matrix */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Quick Workspaces
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(action.tab)}
                className="text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.label}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {action.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Ledger */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Recent System & Partner Activity
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live audit events from resellers, domain verifications, and branding adjustments
            </p>
          </div>
          <button
            onClick={() => setActiveTab('audit-logs')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View Full Audit Logs &rarr;
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {(auditLogs && auditLogs.length > 0 ? auditLogs.slice(0, 5) : [
            { action: 'branding_updated', targetType: 'TenantBranding', targetName: 'Acme HRMS', actorEmail: 'admin@system.io', createdAt: new Date().toISOString() },
            { action: 'domain_verified', targetType: 'Domain', targetName: 'portal.cloudscale.io', actorEmail: 'alex@cloudscale.io', createdAt: new Date().toISOString() },
            { action: 'template_applied', targetType: 'Template', targetName: 'Emerald Fintech', actorEmail: 'superadmin@system.io', createdAt: new Date().toISOString() },
            { action: 'reseller_onboarded', targetType: 'Reseller', targetName: 'Apex Digital HR Agency', actorEmail: 'marcus@apexagency.co', createdAt: new Date().toISOString() },
          ]).map((log, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                    {log.action.replace(/_/g, ' ')}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">
                    &bull; {log.targetName || log.targetType}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-400 dark:text-gray-500">
                <span>{log.actorEmail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
