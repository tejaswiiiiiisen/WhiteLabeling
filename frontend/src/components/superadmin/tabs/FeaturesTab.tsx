'use client';
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { ToggleLeft, ToggleRight, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FeatureFlagItem } from '../../../types/superAdmin';

export default function FeaturesTab() {
  const { featureFlags, toggleFeatureFlag } = useSuperAdmin();
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = async (flag: FeatureFlagItem) => {
    const nextState = !flag.isGlobalEnabled;
    const ok = await toggleFeatureFlag(flag._id, nextState);
    if (ok) {
      setToast(`Feature '${flag.name}' is now ${nextState ? 'ENABLED' : 'DISABLED'}`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          Feature Management & Plan Entitlements
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Central feature flags governing modular capabilities, beta rollouts, and subscription tier access.
        </p>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Feature Flags Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Feature & Key</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Rollout Ring</th>
                <th className="px-5 py-3.5">Allowed Plan Tiers</th>
                <th className="px-5 py-3.5 text-right">Global Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {featureFlags.map((flag) => (
                <tr key={flag._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900 dark:text-white">{flag.name}</div>
                    <div className="font-mono text-[11px] text-gray-400 dark:text-gray-500">{flag.key}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {flag.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        flag.rolloutStatus === 'GA'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {flag.rolloutStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {flag.allowedPlans?.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleToggle(flag)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                        flag.isGlobalEnabled
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {flag.isGlobalEnabled ? (
                        <>
                          <ToggleRight className="w-4 h-4" /> Enabled
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" /> Disabled
                        </>
                      )}
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
