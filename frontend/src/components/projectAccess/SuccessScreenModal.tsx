'use client';
import React from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  History,
  Edit3,
  X,
  Sparkles,
  Building2,
  Layers,
  UserCheck,
} from 'lucide-react';

export default function SuccessScreenModal() {
  const {
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    selectedOrg,
    selectedProject,
    targetUserName,
    targetUserEmail,
    enabledModulesCount,
    totalModulesCount,
    enabledFeaturesCount,
    totalFeaturesCount,
    setActiveView,
  } = useProjectAccess();

  if (!isSuccessModalOpen) return null;

  const orgName = selectedOrg?.companyName || 'Apex Enterprises';
  const projName = selectedProject?.name || 'HRMS Project';
  const projectUrl = selectedProject?.projectUrl || 'http://localhost:3000';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Confetti / Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-2 inline-block">
          Database Updated & Synchronized
        </span>

        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Access Successfully Configured
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Permissions have been persisted and assigned to the user profile with real-time audit logging.
        </p>

        {/* Configuration Summary Card (Requirement 33) */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Organization:</span>
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              {orgName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">User:</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {targetUserName || targetUserEmail}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Project:</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {projName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Modules:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
              {enabledModulesCount} / {totalModulesCount} Enabled
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Features:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {enabledFeaturesCount} / {totalFeaturesCount} Enabled
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Status:</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
              Active
            </span>
          </div>
        </div>

        {/* 4 Action Buttons (Requirement 33: Open Project, Preview Access, View Access Tracker, Edit Permissions) */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={projectUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Project
          </a>

          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              setActiveView('trial-preview');
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Access
          </button>

          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              setActiveView('access-tracker');
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            View Access Tracker
          </button>

          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              setActiveView('manage-access');
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
