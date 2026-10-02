'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  History,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  Calendar,
  User,
  Building2,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function AccessTrackerView() {
  const {
    selectedOrg,
    selectedProject,
    targetUserName,
    targetUserEmail,
    targetRole,
    modulesHierarchy,
    permissions,
    auditLogs,
  } = useProjectAccess();

  const [activeTab, setActiveTab] = useState<'matrix' | 'timeline'>('matrix');
  const [filterQuery, setFilterQuery] = useState('');

  const orgName = selectedOrg?.companyName || 'Apex Enterprises';
  const projName = selectedProject?.name || 'HRMS Project';

  const exportCSV = () => {
    let csv = 'Module,Feature Key,Feature Name,Status\n';
    modulesHierarchy.forEach((mod) => {
      (mod.actions || []).forEach((act) => {
        const isGranted = permissions[act.key] === true;
        csv += `"${mod.name}","${act.key}","${act.name}","${isGranted ? 'GRANTED' : 'DENIED'}"\n`;
      });
    });

    const uri = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `access-tracker-${orgName.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Access Tracker & Audit History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable audit trace of exact permissions granted to {orgName} ({targetUserName || targetRole}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Current Access Matrix
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Change History Timeline ({auditLogs.length})
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Overview Metadata Card (Requirement 13) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Organization</span>
          <div className="font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            {orgName}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Granted To & Role</span>
          <div className="font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-500" />
            {targetUserName || 'John Smith'} ({targetRole || 'HR Manager'})
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Changed By</span>
          <div className="font-extrabold text-slate-900 dark:text-white mt-1">Super Admin</div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Status & Date</span>
          <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Active (03 Sep 2026)
          </div>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        /* Access Matrix Tab (Requirement 13) */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter permissions..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing all 13 modules
            </span>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulesHierarchy.map((mod) => {
              const actions = (mod.actions || []).filter(
                (a) =>
                  !filterQuery ||
                  a.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  a.key.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  mod.name.toLowerCase().includes(filterQuery.toLowerCase())
              );

              if (actions.length === 0 && filterQuery) return null;

              const isModEnabled = actions.some((a) => permissions[a.key] === true);

              return (
                <div
                  key={mod.id}
                  className={`p-4 rounded-2xl border ${
                    isModEnabled
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/40 dark:bg-slate-800/10 border-slate-200/60 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {mod.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isModEnabled
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {isModEnabled ? '✓ Enabled' : '✗ Disabled'}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1 text-xs">
                    {actions.map((act) => {
                      const isGranted = permissions[act.key] === true;
                      return (
                        <div
                          key={act.key}
                          className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        >
                          <span className="text-[11px] text-slate-700 dark:text-slate-300">
                            {act.name}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold ${
                              isGranted ? 'text-emerald-600' : 'text-rose-500 line-through'
                            }`}
                          >
                            {isGranted ? '✓ Granted' : '✗ Blocked'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Access Change History Timeline (Requirement 14) */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Chronological Access Timeline
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {auditLogs.length} Events Recorded
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
            {auditLogs.length === 0 ? (
              <div className="text-xs text-slate-400 py-4">No audit events recorded yet.</div>
            ) : (
              auditLogs.map((log, idx) => (
                <div key={log._id || idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-1.5 ring-4 ring-white dark:ring-slate-900 shadow-xs" />

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {log.adminEmail || 'Super Admin'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          {log.action}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {log.summary}
                    </p>

                    {log.changes && log.changes.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Modified Permissions ({log.changes.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {log.changes.map((c, cIdx) => (
                            <span
                              key={cIdx}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                c.to
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200'
                              }`}
                            >
                              {c.to ? '✓ Enabled:' : '✗ Disabled:'} {c.key}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
