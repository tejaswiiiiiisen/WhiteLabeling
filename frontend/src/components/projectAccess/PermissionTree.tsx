'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import { PermissionTaxonomy } from '../../types/projectAccess';
import {
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  Search,
  Check,
  X,
  Sliders,
  Sparkles,
  Layers,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function PermissionTree() {
  const {
    filteredModules,
    permissions,
    togglePermission,
    toggleModule,
    enableEntireProject,
    disableEntireProject,
    searchQuery,
    setSearchQuery,
    selectedProject,
    selectedOrg,
  } = useProjectAccess();

  // Collapsed / Expanded state per module (all open by default or toggleable)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    dashboard: true,
    employees: true,
    attendance: true,
    leave: true,
    projects: true,
    payroll: true,
    recruitment: true,
    assets: true,
    policies: true,
    holidays: true,
    notice: true,
    settings: true,
    subscription: true,
  });

  const toggleAccordion = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    filteredModules.forEach((m) => (all[m.id] = true));
    setExpandedModules(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    filteredModules.forEach((m) => (all[m.id] = false));
    setExpandedModules(all);
  };

  // Taxonomy Badge Style Helper (Requirement 7)
  const getTaxonomyBadge = (taxonomy: PermissionTaxonomy) => {
    switch (taxonomy) {
      case 'view':
        return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'create':
      case 'upload':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'edit':
        return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'delete':
        return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'approve':
        return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'reject':
        return 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'export':
      case 'download':
        return 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'import':
        return 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'manage':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Project-Level Controls (Requirement 5 & 8) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Level 1: Project Control */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Level 1: {selectedProject?.name || 'HRMS Project'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={enableEntireProject}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
              >
                ✓ Enable Entire Project
              </button>
              <button
                type="button"
                onClick={disableEntireProject}
                className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
              >
                ✗ Disable Entire Project
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Live Search Input (Requirement 8) */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules or features (e.g. Employee, Payroll, Delete, Export, Attendance, Settings)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Modules List (Requirement 3 & 4) */}
      <div className="space-y-3">
        {filteredModules.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching modules or features found
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Try searching with another keyword like "Employee", "Export", "Attendance", or clear the filter.
            </p>
          </div>
        ) : (
          filteredModules.map((module) => {
            const isExpanded = expandedModules[module.id] !== false;
            const actions = module.actions || [];
            const enabledCount = actions.filter((a) => permissions[a.key] === true).length;
            const isAllEnabled = actions.length > 0 && enabledCount === actions.length;
            const isPartiallyEnabled = enabledCount > 0 && !isAllEnabled;

            return (
              <div
                key={module.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                {/* Level 2: Module Header Card (Requirement 4 & 5) */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Collapsible Chevron */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(module.id)}
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer transition-colors"
                      title={isExpanded ? 'Collapse module' : 'Expand module'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      )}
                    </button>

                    {/* Level 2 Module Checkbox */}
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isAllEnabled}
                        ref={(el) => {
                          if (el) el.indeterminate = isPartiallyEnabled;
                        }}
                        onChange={(e) => toggleModule(module.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {module.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {module.route}
                          </span>
                        </div>
                        {module.description && (
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {module.description}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Module Feature Counters & Quick Toggle */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                        enabledCount > 0
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {enabledCount} / {actions.length} Enabled
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleModule(module.id, !isAllEnabled)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                    >
                      {isAllEnabled ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>

                {/* Level 3: Individual Features & Actions (Requirement 4, 6, 7) */}
                {isExpanded && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-white dark:bg-slate-900 animate-fadeIn">
                    {actions.map((action) => {
                      const isChecked = permissions[action.key] === true;

                      return (
                        <div
                          key={action.key}
                          onClick={() => togglePermission(action.key)}
                          className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer select-none ${
                            isChecked
                              ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                              : 'bg-slate-50/30 dark:bg-slate-800/20 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent div onClick
                              className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer shrink-0"
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{action.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {action.key}
                              </div>
                              {action.description && (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                                  {action.description}
                                </div>
                              )}
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border shrink-0 ${getTaxonomyBadge(
                              action.taxonomy
                            )}`}
                          >
                            {action.taxonomy}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
