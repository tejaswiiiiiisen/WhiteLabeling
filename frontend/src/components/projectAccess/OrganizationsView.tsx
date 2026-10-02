'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import { WhiteLabelOrganization } from '../../types/projectAccess';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Users,
  Sliders,
  Play,
  Eye,
  History,
  Trash2,
  Power,
  ExternalLink,
  Edit3,
  Calendar,
  X,
} from 'lucide-react';

export default function OrganizationsView() {
  const {
    organizations,
    setSelectedOrg,
    setActiveView,
    projects,
    setSelectedProject,
    toggleOrgStatus,
    deleteOrganization,
    createOrganization,
  } = useProjectAccess();

  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgLogo, setNewOrgLogo] = useState('');
  const [newOrgSubdomain, setNewOrgSubdomain] = useState('');
  const [newOrgPrimaryColor, setNewOrgPrimaryColor] = useState('#3B82F6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredOrgs = organizations.filter(
    (o) =>
      o.companyName.toLowerCase().includes(search.toLowerCase()) ||
      o.organizationId.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setIsSubmitting(true);
    await createOrganization({
      companyName: newOrgName.trim(),
      logoUrl: newOrgLogo || 'http://localhost:5001/uploads/whitelabel/brand-1788349682625-170765136.png',
      subdomain: newOrgSubdomain.trim() || undefined,
      primaryColor: newOrgPrimaryColor,
      assignedProjects: ['hrms'],
    });
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setNewOrgName('');
    setNewOrgLogo('');
    setNewOrgSubdomain('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Search / Add Org Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            White Label Organizations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage all white-labeled client organizations, brand identity, and application bindings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Organization
          </button>
        </div>
      </div>

      {/* Organization Cards Grid (Requirement 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.map((org) => {
          const isActive = org.status === 'Active';
          const isApex = org.companyName.includes('Apex');
          const hrmsProject = projects.find((p) => p.projectId === 'hrms') || null;

          return (
            <div
              key={org._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={org.logoUrl}
                      alt={org.companyName}
                      className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h2 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        {org.companyName}
                        {isApex && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                            Default
                          </span>
                        )}
                      </h2>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {org.organizationId}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
                    ></span>
                    {org.status}
                  </span>
                </div>

                {/* Subdomain & Creation Info */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(org.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Subdomain: <strong className="text-blue-600 dark:text-blue-400">{org.subdomain || 'apex'}</strong>.hrms.io
                  </span>
                </div>
              </div>

              {/* Card Metrics Grid (Requirement 1) */}
              <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-2 gap-3 text-xs border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Assigned Projects
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    HRMS Project
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Enabled Features
                  </span>
                  <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                    <Sliders className="w-3.5 h-3.5" />
                    {isApex ? '47 / 71' : '71 / 71'} Features
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Total Users
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {org.usersCount || 42} Users
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Trial Status
                  </span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    Active (7d)
                  </div>
                </div>
              </div>

              {/* Action Buttons (Requirement 1: Open, Edit, Manage Access, Preview, Trial, Access Tracker, Disable, Delete) */}
              <div className="p-4 bg-white dark:bg-slate-900 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrg(org);
                      setActiveView('projects');
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => {
                      setSelectedOrg(org);
                      setSelectedProject(hrmsProject);
                      setActiveView('manage-access');
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Manage Access
                  </button>

                  <button
                    onClick={() => {
                      setSelectedOrg(org);
                      setSelectedProject(hrmsProject);
                      setActiveView('trial-preview');
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrg(org);
                        setSelectedProject(hrmsProject);
                        setActiveView('trial-preview');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      Trial
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrg(org);
                        setActiveView('access-tracker');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:underline cursor-pointer"
                    >
                      <History className="w-3 h-3" />
                      Tracker
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrg(org);
                        setActiveView('branding');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:underline cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      Branding
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleOrgStatus(org.organizationId)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                          : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                      title={isActive ? 'Disable Organization' : 'Enable Organization'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    {!isApex && (
                      <button
                        onClick={() => deleteOrganization(org.organizationId)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Organization"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Organization Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Add White-Label Organization
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith Global Corp"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  placeholder="http://localhost:5001/uploads/..."
                  value={newOrgLogo}
                  onChange={(e) => setNewOrgLogo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subdomain
                  </label>
                  <input
                    type="text"
                    placeholder="zenith"
                    value={newOrgSubdomain}
                    onChange={(e) => setNewOrgSubdomain(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newOrgPrimaryColor}
                      onChange={(e) => setNewOrgPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      {newOrgPrimaryColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
