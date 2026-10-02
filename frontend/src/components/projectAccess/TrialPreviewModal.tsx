'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  Play,
  StopCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Eye,
  RefreshCw,
  LayoutDashboard,
  Users,
  CalendarCheck,
  Briefcase,
  DollarSign,
  UserCheck,
  HardDrive,
  ScrollText,
  CalendarDays,
  Bell,
  Settings,
  CreditCard,
  Lock,
  Trash2,
  Plus,
  Edit,
  Download,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function TrialPreviewModal() {
  const {
    selectedOrg,
    selectedProject,
    targetUserName,
    targetUserEmail,
    targetRole,
    enabledModulesCount,
    totalModulesCount,
    enabledFeaturesCount,
    totalFeaturesCount,
    permissions,
    modulesHierarchy,
    startTrial,
    endTrial,
    extendTrial,
    verifyAction,
    assignment,
    setActiveView,
  } = useProjectAccess();

  const orgName = selectedOrg?.companyName || 'Apex Enterprises';
  const projName = selectedProject?.name || 'HRMS Project';
  const projectUrl = selectedProject?.projectUrl || 'http://localhost:3000';

  // Interactive Live Preview Simulation State
  const [previewRoute, setPreviewRoute] = useState<string>('/dashboard');
  const [trialDurationDays, setTrialDurationDays] = useState<number>(7);
  const [testActionKey, setTestActionKey] = useState<string>('employees.delete');
  const [testResult, setTestResult] = useState<{ allowed: boolean; reason: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isTrialRunning = assignment?.trial?.status === 'Running' || assignment?.trial?.isActive;
  const trialEndDate = assignment?.trial?.endDate
    ? new Date(assignment.trial.endDate).toLocaleDateString()
    : '10 Sep 2026';

  const handleTestPermission = async (key: string) => {
    setIsVerifying(true);
    setTestActionKey(key);
    const res = await verifyAction(key);
    setTestResult(res);
    setIsVerifying(false);
  };

  // Nav icons dictionary
  const iconMap: Record<string, React.ElementType> = {
    dashboard: LayoutDashboard,
    employees: Users,
    attendance: CalendarCheck,
    leave: Clock,
    projects: Briefcase,
    payroll: DollarSign,
    recruitment: UserCheck,
    assets: HardDrive,
    policies: ScrollText,
    holidays: CalendarDays,
    notice: Bell,
    settings: Settings,
    subscription: CreditCard,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Trial Control Bar (Requirement 16 & 17) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Application Trial Mode
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  isTrialRunning
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isTrialRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
                />
                Trial Status: {isTrialRunning ? '🟢 Running' : 'Idle'}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Test & Preview Access for {orgName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active User: <strong className="text-slate-700 dark:text-slate-200">{targetUserName}</strong> (
              {targetRole}) • Granted:{' '}
              <strong className="text-blue-600 dark:text-blue-400">{enabledModulesCount} Modules</strong> &{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">{enabledFeaturesCount} Features</strong>
            </p>
          </div>

          {/* Trial Controller Buttons (Requirement 17) */}
          <div className="flex flex-wrap items-center gap-3">
            {isTrialRunning ? (
              <>
                <button
                  onClick={() => extendTrial(7)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                >
                  + Extend Trial (7 Days)
                </button>
                <button
                  onClick={endTrial}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <StopCircle className="w-4 h-4" />
                  End Trial
                </button>
              </>
            ) : (
              <button
                onClick={() => startTrial(trialDurationDays)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Trial ({trialDurationDays} Days)
              </button>
            )}

            <a
              href={projectUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Live App
            </a>
          </div>
        </div>

        {/* Running Trial Details (Requirement 17) */}
        {isTrialRunning && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                Trial Ends: <strong className="text-slate-900 dark:text-white">{trialEndDate}</strong>
              </span>
              <span>•</span>
              <span>Started by: <strong>Super Admin</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('access-tracker')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View Access Tracker →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Application Preview Simulator (Requirement 16, 18, 19) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Browser Mockup Chrome */}
        <div className="h-11 px-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-500 font-medium">
              HRMS Application Sandbox — Second Person Preview Mode
            </span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <span>http://localhost:3000{previewRoute}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          {/* Left: Filtered Navigation Sidebar (Requirement 21) */}
          <div className="md:col-span-3 bg-slate-900 text-white p-4 border-r border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Tenant Branding in Sidebar (Requirement 20) */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <img
                  src={selectedOrg?.logoUrl || 'http://localhost:5001/uploads/whitelabel/brand-1788349682625-170765136.png'}
                  alt={orgName}
                  className="w-8 h-8 rounded-lg object-contain bg-white p-1"
                />
                <div>
                  <div className="font-extrabold text-xs tracking-tight text-white">{orgName}</div>
                  <div className="text-[10px] text-blue-400 font-bold">HRMS Portal</div>
                </div>
              </div>

              {/* Navigation Items: Only Permitted Items Visible or Locked (Requirement 21) */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  Permitted Navigation
                </span>

                {modulesHierarchy.map((mod) => {
                  const actions = mod.actions || [];
                  const isGranted = actions.some((a) => permissions[a.key] === true);
                  const Icon = iconMap[mod.id] || LayoutDashboard;
                  const isCurrent = previewRoute === mod.route;

                  if (!isGranted) {
                    // Optional locked item display (Requirement 21)
                    return (
                      <button
                        key={mod.id}
                        onClick={() => setPreviewRoute(mod.route)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-800/40 transition-colors cursor-pointer"
                        title="Click to test unauthorized access handling"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-slate-600" />
                          <span>{mod.name}</span>
                        </div>
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    );
                  }

                  return (
                    <button
                      key={mod.id}
                      onClick={() => setPreviewRoute(mod.route)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-blue-400'}`} />
                        <span>{mod.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">✓</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Identity Footnote */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="text-white font-bold">{targetUserName}</div>
              <div className="text-[10px] text-slate-500 font-mono">{targetUserEmail}</div>
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-blue-900/60 text-blue-300">
                Role: {targetRole}
              </span>
            </div>
          </div>

          {/* Right: Live Page Content or Unauthorized Access Handling (Requirement 18 & 19) */}
          <div className="md:col-span-9 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
            {/* Check if current preview route is permitted */}
            {(() => {
              const currentMod = modulesHierarchy.find((m) => m.route === previewRoute);
              const isModPermitted =
                currentMod && (currentMod.actions || []).some((a) => permissions[a.key] === true);

              // 1. Unauthorized Access Block (Requirement 19)
              if (!isModPermitted && currentMod) {
                return (
                  <div className="m-auto max-w-md text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
                      <ShieldAlert className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        HTTP 403 Forbidden
                      </span>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                        Access Denied
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        You don't have permission to access the <strong>{currentMod.name}</strong> module. This
                        feature is disabled for your white-label tenant profile.
                      </p>
                    </div>

                    <button
                      onClick={() => setPreviewRoute('/dashboard')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                );
              }

              // 2. Permitted Module View (e.g. Dashboard or Employees)
              if (previewRoute === '/employees') {
                const canDelete = permissions['employees.delete'] === true;
                const canAdd = permissions['employees.create'] === true;
                const canExport = permissions['employees.export'] === true;

                return (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                          Employees Directory
                        </h2>
                        <p className="text-xs text-slate-500">Staff records and profile management</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {canExport && (
                          <button className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" />
                            Export CSV
                          </button>
                        )}
                        {canAdd ? (
                          <button className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                            <Plus className="w-3.5 h-3.5" />
                            Add Employee
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            (Add Employee disabled)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Simulated Table with Feature-Level Authorization Check */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 font-bold border-b border-slate-200 dark:border-slate-800 text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Department</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                          {[
                            { name: 'John Smith', role: 'HR Manager', dept: 'Human Resources' },
                            { name: 'Bessie Hackett', role: 'Lead Developer', dept: 'Engineering' },
                            { name: 'Erma Torp', role: 'UI Designer', dept: 'Product Design' },
                          ].map((emp, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                {emp.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{emp.role}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{emp.dept}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button className="p-1 rounded text-blue-600 hover:bg-blue-50" title="Edit">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Employee Authorization (Requirement 4 & 18) */}
                                  {canDelete ? (
                                    <button
                                      onClick={() => handleTestPermission('employees.delete')}
                                      className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                                      title="Delete Employee (Enabled)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleTestPermission('employees.delete')}
                                      className="p-1 rounded text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                      title="Delete Employee (Blocked by Permissions)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Test Feedback Notice */}
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Real Permission Gate Test:
                        </span>{' '}
                        <span className="font-mono text-slate-600 dark:text-slate-400">
                          employees.delete = {canDelete ? 'true (Allowed)' : 'false (Blocked)'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTestPermission('employees.delete')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Verify API Authorization
                      </button>
                    </div>
                  </div>
                );
              }

              // Default: Dashboard View
              return (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        Dashboard Overview
                      </h2>
                      <p className="text-xs text-slate-500">White-label workspace executive analytics</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
                      Live Telemetry
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-400 font-bold block">Total Employees</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">42</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-400 font-bold block">Present Today</span>
                      <div className="text-2xl font-black text-emerald-600 mt-1">38 (90%)</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-400 font-bold block">On Leave</span>
                      <div className="text-2xl font-black text-indigo-600 mt-1">4</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">
                      Interactive Sandbox Active
                    </span>
                    <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                      Click the sidebar items to test route protection. Clicking disabled items (e.g. 🔒 Payroll)
                      will trigger the HTTP 403 Access Denied block screen.
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Test Action Feedback Banner (Requirement 18) */}
            {testResult && (
              <div
                className={`mt-6 p-4 rounded-2xl border flex items-center justify-between animate-fadeIn text-xs ${
                  testResult.allowed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {testResult.allowed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-extrabold font-mono">[{testActionKey}]:</span>{' '}
                    <span>{testResult.reason}</span>
                  </div>
                </div>
                <button
                  onClick={() => setTestResult(null)}
                  className="text-[11px] font-bold underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
