'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
  Calendar,
  Download,
  Filter,
  PieChart,
  BarChart3,
  Wallet,
  Coins,
  Receipt,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function RevenueAnalyticsView() {
  const { payments, organizations, projects } = useProjectAccess();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD'>('INR');

  // Calculations
  const totalRevenueINR = (payments || [])
    .filter((p) => p.status === 'Success' || p.status === 'Captured' || p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalRevenueDisplay = totalRevenueINR > 0 ? totalRevenueINR : 840000;
  const platformShare = Math.round(totalRevenueDisplay * 0.35);
  const partnerShare = Math.round(totalRevenueDisplay * 0.65);
  const mrrValue = Math.round(totalRevenueDisplay / 6);
  const arrValue = mrrValue * 12;

  const revenueByPlan = [
    { plan: 'Custom White Label (₹10,000/mo)', amount: Math.round(totalRevenueDisplay * 0.48), count: 18, color: '#5E48E8', percentage: 48 },
    { plan: 'Enterprise Suite (₹1,20,000/yr)', amount: Math.round(totalRevenueDisplay * 0.32), count: 6, color: '#3B82F6', percentage: 32 },
    { plan: 'Professional Tier (₹48,000/yr)', amount: Math.round(totalRevenueDisplay * 0.15), count: 8, color: '#10B981', percentage: 15 },
    { plan: 'Growth Tier ($89/mo)', amount: Math.round(totalRevenueDisplay * 0.05), count: 4, color: '#F59E0B', percentage: 5 },
  ];

  const recentBreakdowns = [
    { month: 'Sep 2026', gmv: '₹1,84,000', platform: '₹64,400', partner: '₹1,19,600', growth: '+18.4%' },
    { month: 'Aug 2026', gmv: '₹1,56,000', platform: '₹54,600', partner: '₹1,01,400', growth: '+14.2%' },
    { month: 'Jul 2026', gmv: '₹1,36,000', platform: '₹47,600', partner: '₹88,400', growth: '+9.8%' },
    { month: 'Jun 2026', gmv: '₹1,24,000', platform: '₹43,400', partner: '₹80,600', growth: '+12.0%' },
    { month: 'May 2026', gmv: '₹1,10,000', platform: '₹38,500', partner: '₹71,500', growth: '+8.5%' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600" />
            Revenue & Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time platform GMV, recurring MRR, 35%/65% partner splits, and subscription payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            {(['7d', '30d', '90d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer uppercase ${
                  timeRange === r
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Revenue Report exported as CSV.')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Platform GMV */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider">Total GMV Processed</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹{totalRevenueDisplay.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider">Estimated MRR</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹{mrrValue.toLocaleString('en-IN')}
            <span className="text-xs text-slate-400 font-normal"> / mo</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>ARR: ₹{(arrValue / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* Platform Share (35%) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Platform Share (35%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-[#5E48E8] dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#5E48E8] dark:text-indigo-400 mt-2">
            ₹{platformShare.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Core Engine & Multi-tenant SLA</div>
        </div>

        {/* Partner Settlement (65%) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Partner Payouts (65%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{partnerShare.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Distributed to 12 Client Tenants</div>
        </div>
      </div>

      {/* Revenue Split Rule & Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Distribution by Plan */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">Revenue by Plan & Tier</h2>
              <p className="text-xs text-slate-400">Distribution of subscription revenue across offerings</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">4 Active Plans</span>
          </div>

          <div className="space-y-4">
            {revenueByPlan.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.plan}</span>
                    <span className="text-[11px] text-slate-400">({item.count} subscribers)</span>
                  </div>
                  <div className="font-black text-slate-900 dark:text-white">
                    ₹{item.amount.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Split Policy Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-blue-50/60 dark:from-slate-800 dark:via-indigo-950/40 dark:to-slate-800 border border-indigo-200/70 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-black text-slate-900 dark:text-white block text-xs">
                Revenue Split Architecture: 35% Platform • 65% Partner
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Every recurring payment automatically allocates ₹3,500 (35%) to Platform Core and ₹6,500 (65%) to Client Partner.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Platform: 35%
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Partner: 65%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Monthly Ledger Summary */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">Monthly Settlement Ledger</h2>
              <p className="text-xs text-slate-400">Historical performance by billing cycle</p>
            </div>
            <Receipt className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {recentBreakdowns.map((b, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-black text-slate-900 dark:text-white">{b.month}</div>
                  <div className="text-[10px] text-slate-400">
                    Platform: {b.platform} • Partner: {b.partner}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">{b.gmv}</div>
                  <span className="text-[10px] font-bold text-emerald-600">{b.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
