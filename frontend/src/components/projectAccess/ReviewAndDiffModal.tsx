'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  ShieldCheck,
  AlertCircle,
  X,
  Check,
  Building2,
  Layers,
  User,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function ReviewAndDiffModal() {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    confirmSaveAssignment,
    startTrial,
    comparisonDiff,
    selectedOrg,
    selectedProject,
    targetUserName,
    targetUserEmail,
    targetRole,
    enabledModulesCount,
    totalModulesCount,
    enabledFeaturesCount,
    totalFeaturesCount,
    modulesHierarchy,
    permissions,
  } = useProjectAccess();

  const [isSaving, setIsSaving] = useState(false);

  if (!isReviewModalOpen) return null;

  const orgName = selectedOrg?.companyName || 'Apex Enterprises';
  const projName = selectedProject?.name || 'HRMS Project';
  const changes = comparisonDiff?.changes || [];

  const handleSave = async () => {
    setIsSaving(true);
    await confirmSaveAssignment();
    setIsSaving(false);
  };

  const handleStartTrial = async () => {
    setIsSaving(true);
    await confirmSaveAssignment();
    await startTrial(7);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 mb-1 inline-block">
              Review Access & Permissions Diff
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Confirm Permission Allocation
            </h2>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Confirmation Notice (Requirement 12) */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-blue-950 dark:text-blue-200 text-sm">
                You are granting access to {enabledModulesCount} modules and {enabledFeaturesCount} features for {orgName}.
              </div>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
                Saving will persist these granular permissions to the database and update this user's live access immediately.
              </p>
            </div>
          </div>

          {/* Configuration Summary Grid (Requirement 32) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Organization</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-1 block truncate">
                {orgName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Project</span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block truncate">
                {projName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned To</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-1 block truncate">
                {targetUserName || targetUserEmail}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Role</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 mt-1 block truncate">
                {targetRole}
              </span>
            </div>
          </div>

          {/* Module Level Breakdown (Requirement 32) */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Module Access Checklist ({enabledModulesCount} / {totalModulesCount} Enabled)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {modulesHierarchy.map((mod) => {
                const actions = mod.actions || [];
                const isEnabled = actions.some((a) => permissions[a.key] === true);

                return (
                  <div
                    key={mod.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                      isEnabled
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                    }`}
                  >
                    <span>{mod.name}</span>
                    <span>{isEnabled ? '✓' : '✗'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Before / After Permission Comparison (Requirement 15) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Detailed Changes Log ({changes.length} Total Changes)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Previous: {comparisonDiff?.previousEnabledCount || 0} → New: {enabledFeaturesCount}
              </span>
            </div>

            {changes.length === 0 ? (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-slate-500 text-xs">
                No modifications from previous saved state.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-800/20">
                {changes.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono text-[11px]"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {c.key}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={c.from ? 'text-emerald-600 font-bold' : 'text-rose-500 line-through'}>
                        {c.from ? 'Enabled' : 'Disabled'}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className={c.to ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                        {c.to ? '✓ Enabled' : '✗ Disabled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (Requirement 12, 32) */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsReviewModalOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Back & Edit
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleStartTrial}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Start Trial (7d)
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
