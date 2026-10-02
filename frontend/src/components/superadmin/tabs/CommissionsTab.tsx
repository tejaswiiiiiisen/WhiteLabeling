'use client';
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { Coins, CheckCircle2, ArrowRight, Banknote } from 'lucide-react';

export default function CommissionsTab() {
  const { commissions, processPayout } = useSuperAdmin();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleApprovePayout = async (commId: string, resellerName: string, amount: number) => {
    const ok = await processPayout(resellerName, amount);
    if (ok) {
      setToast(`Payout batch of $${amount.toLocaleString()} for ${resellerName} queued for bank transfer.`);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const totalPending = commissions.reduce((sum, c) => sum + (c.pendingPayout || 0), 0);
  const totalPaid = commissions.reduce((sum, c) => sum + (c.paidOut || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" />
            Reseller Commissions & Revenue Share
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Automated affiliate and partner revenue distributions, pending balances, and settlement batches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">Custom White Label: </span>
            <span className="font-extrabold text-[#5E48E8] dark:text-indigo-300">65% Partner / 35% Platform</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">Total Pending: </span>
            <span className="font-extrabold text-amber-700 dark:text-amber-300">${totalPending.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Revenue Split Rule Summary Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-blue-50/60 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200/70 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-black text-gray-900 dark:text-white block text-sm">
            Custom White Label Revenue Split: 35% Platform • 65% Partner
          </span>
          <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
            Every recurring ₹10,000 monthly subscription automatically allocates ₹3,500 (35%) to Platform Core and ₹6,500 (65%) to the Partner organization.
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

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Reseller Partner</th>
                <th className="px-5 py-3.5">Share Rate</th>
                <th className="px-5 py-3.5">Total Earned</th>
                <th className="px-5 py-3.5">Paid to Date</th>
                <th className="px-5 py-3.5">Pending Payout</th>
                <th className="px-5 py-3.5">Next Cycle</th>
                <th className="px-5 py-3.5 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {commissions.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {c.resellerName}
                  </td>
                  <td className="px-5 py-4 font-bold text-blue-600 dark:text-blue-400">
                    {c.rate}%
                  </td>
                  <td className="px-5 py-4 font-extrabold text-gray-900 dark:text-white">
                    ${c.totalEarned.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-emerald-600 dark:text-emerald-400 font-bold">
                    ${c.paidOut.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-black text-amber-600 dark:text-amber-400">
                    ${c.pendingPayout.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                    {c.nextPayout}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleApprovePayout(c.id, c.resellerName, c.pendingPayout)}
                      disabled={c.pendingPayout <= 0}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      Approve Payout
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
