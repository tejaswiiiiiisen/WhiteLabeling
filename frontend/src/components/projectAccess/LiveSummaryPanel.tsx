'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  Save,
  Play,
  Eye,
  Building2,
  Layers,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Sliders,
  Clock,
  ShieldCheck,
  Copy,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export default function LiveSummaryPanel() {
  const {
    selectedOrg,
    selectedProject,
    targetUserEmail,
    setTargetUserEmail,
    targetUserName,
    setTargetUserName,
    targetRole,
    setTargetRole,
    assigneeType,
    setAssigneeType,
    totalModulesCount,
    enabledModulesCount,
    totalFeaturesCount,
    enabledFeaturesCount,
    taxonomyBreakdown,
    accessLevel,
    saveAccessConfiguration,
    startTrial,
    setActiveView,
    setIsCustomRoleModalOpen,
    setIsTemplateModalOpen,
    templates,
    applyTemplate,
  } = useProjectAccess();

  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [cloneEmail, setCloneEmail] = useState('');
  const [isCloneBoxOpen, setIsCloneBoxOpen] = useState(false);
  const { cloneAccess } = useProjectAccess();

  const handleApplyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTemplateId(val);
    if (val) {
      applyTemplate(val);
    }
  };

  const handleCloneSubmit = async () => {
    if (!cloneEmail.trim()) return;
    await cloneAccess(cloneEmail.trim(), 'Sarah Smith', 'HR Manager');
    setCloneEmail('');
    setIsCloneBoxOpen(false);
    alert(`Access settings cloned successfully to ${cloneEmail}`);
  };

  const modulePercentage = Math.round((enabledModulesCount / (totalModulesCount || 1)) * 100);
  const featurePercentage = Math.round((enabledFeaturesCount / (totalFeaturesCount || 1)) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-5 space-y-5 sticky top-6">
      {/* Top Title & Access Level */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Access Summary
          </h2>
          <span className="text-[10px] text-slate-400">Live configuration status</span>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
            accessLevel === 'Full'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : accessLevel === 'Restricted'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
          }`}
        >
          {accessLevel} Access
        </span>
      </div>

      {/* Organization & Project Badges (Requirement 9) */}
      <div className="space-y-2">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Organization</span>
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              {selectedOrg?.companyName || 'Apex Enterprises'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Project</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {selectedProject?.name || 'HRMS Project'}
            </span>
          </div>
        </div>
      </div>

      {/* Second Person Access Section (Requirement 10) */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Who Will Receive This Access?
          </label>
          <button
            onClick={() => setIsCustomRoleModalOpen(true)}
            className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
          >
            + Custom Role
          </button>
        </div>

        {/* Assignee Type Selector */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold text-center">
          {(['user', 'role', 'organization', 'team'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAssigneeType(t)}
              className={`py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                assigneeType === t
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Target User Email
            </label>
            <input
              type="email"
              value={targetUserEmail}
              onChange={(e) => setTargetUserEmail(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={targetUserName}
                onChange={(e) => setTargetUserName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                Assigned Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HR Manager">HR Manager</option>
                <option value="Accountant">Accountant</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Templates Dropdown (Requirement 24) */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Apply Template
          </label>
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            Manage Templates
          </button>
        </div>
        <select
          value={selectedTemplateId}
          onChange={handleApplyTemplate}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">-- Choose Permission Template --</option>
          {templates.map((tpl) => (
            <option key={tpl._id || tpl.name} value={tpl._id || tpl.name}>
              {tpl.name}
            </option>
          ))}
        </select>
      </div>

      {/* Live Ratios & Counters (Requirement 9) */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Modules</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {enabledModulesCount} / {totalModulesCount} Enabled
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${modulePercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Features & Actions</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {enabledFeaturesCount} / {totalFeaturesCount} Enabled
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${featurePercentage}%` }}
            />
          </div>
        </div>

        {/* Permissions Taxonomy Breakdown (Requirement 9) */}
        <div className="pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Taxonomy Breakdown
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              View: {taxonomyBreakdown.view}
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              Create: {taxonomyBreakdown.create}
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              Edit: {taxonomyBreakdown.edit}
            </div>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              Delete: {taxonomyBreakdown.delete}
            </div>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
              Export: {taxonomyBreakdown.export + taxonomyBreakdown.download}
            </div>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
              Approve: {taxonomyBreakdown.approve}
            </div>
          </div>
        </div>
      </div>

      {/* Clone Access Drawer (Requirement 25) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        {!isCloneBoxOpen ? (
          <button
            type="button"
            onClick={() => setIsCloneBoxOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            Clone Access to Another User
          </button>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Clone To Email Address
            </span>
            <input
              type="email"
              placeholder="sarah.smith@example.com"
              value={cloneEmail}
              onChange={(e) => setCloneEmail(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-mono bg-white dark:bg-slate-900"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCloneBoxOpen(false)}
                className="px-2.5 py-1 text-[11px] text-slate-500 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloneSubmit}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] cursor-pointer"
              >
                Clone Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Action Buttons: Save Access Configuration, Start Trial, Preview Access (Requirement 12, 16) */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={saveAccessConfiguration}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Access Configuration
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveView('trial-preview')}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Access
          </button>

          <button
            type="button"
            onClick={() => startTrial(7)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Start Trial (7d)
          </button>
        </div>
      </div>
    </div>
  );
}
