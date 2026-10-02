'use client';
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { CreditCard, Check, Sparkles, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import TenantPlansTab from './TenantPlansTab';

export default function SubscriptionsTab() {
  const { subscriptions } = useSuperAdmin();
  const [subList, setSubList] = useState(subscriptions);
  const [activeSubTab, setActiveSubTab] = useState<'tenant-plans' | 'master-tiers'>('tenant-plans');

  const toggleAutoRenew = (id: string) => {
    setSubList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, autoRenew: !s.autoRenew } : s))
    );
  };

  const planTiers = [
    { name: 'Growth Tier', price: '$99', cycle: 'mo', features: ['Up to 50 Users', 'Standard Branding', '1 Custom Subdomain', 'Email Support'] },
    { name: 'Professional HRMS', price: '$199', cycle: 'mo', features: ['Up to 250 Users', 'Full White-Label Suite', 'Custom CNAME Domain', 'Payroll & Tax Automation', 'Priority Support'] },
    {
      name: 'Custom White Label',
      price: '₹10,000',
      cycle: 'mo',
      featured: true,
      badge: 'Most Powerful',
      features: [
        'Full Core Platform Access',
        '20 Enterprise Custom Modules',
        'Automated 35%/65% Revenue Split',
        'Razorpay Recurring Monthly Billing',
        'Dedicated Staging & VPC Setup',
        '24/7 Dedicated Technical Support',
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub-tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 bg-gray-100 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('tenant-plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tenant-plans'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tenant Dynamic Plans Studio</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold">
              Dynamic
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('master-tiers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'master-tiers'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Platform Master Tiers</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 font-extrabold">
              Contracts ({subList.length})
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Feature Gating: Active</span>
        </div>
      </div>

      {activeSubTab === 'tenant-plans' ? (
        <TenantPlansTab />
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Header */}
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Subscription Tiers & Active Lifecycles
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Monitor recurring subscriptions, billing renewals, user limits, and tier entitlements.
            </p>
          </div>

          {/* Plan Tier Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planTiers.map((tier, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border transition-all flex flex-col justify-between ${
              tier.featured
                ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                : 'border-gray-200 dark:border-gray-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{tier.name}</h3>
                {tier.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                {tier.price}
                <span className="text-xs font-semibold text-gray-400">/{tier.cycle}</span>
              </div>
              <div className="space-y-2.5">
                {tier.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Subscription Contracts</h3>
          <span className="text-xs font-semibold text-gray-500">{subList.length} Active Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Assigned Plan</th>
                <th className="px-5 py-3.5">Billing Cadence</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Next Renewal</th>
                <th className="px-5 py-3.5">Auto Renew</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {subList.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {sub.customerName}
                  </td>
                  <td className="px-5 py-4 font-semibold text-blue-600 dark:text-blue-400">
                    {sub.plan}
                  </td>
                  <td className="px-5 py-4">{sub.billingCycle}</td>
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    ${sub.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                    {sub.nextBilling}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleAutoRenew(sub.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        sub.autoRenew
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {sub.autoRenew ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}
</div>
);
}
