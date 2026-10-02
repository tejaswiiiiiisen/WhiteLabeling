'use client';
import React, { useState, useEffect } from 'react';
import { ProjectAccessProvider, useProjectAccess, ActiveView } from '../../context/ProjectAccessContext';
import {
  Shield,
  Building2,
  Layers,
  Sliders,
  History,
  Play,
  Sparkles,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  RefreshCw,
  ExternalLink,
  CreditCard,
  Receipt,
  ClipboardList,
  Users,
  Coins,
  Activity,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';

import DashboardOverviewView from './DashboardOverviewView';
import OrganizationsView from './OrganizationsView';
import ProjectListView from './ProjectListView';
import PermissionTree from './PermissionTree';
import LiveSummaryPanel from './LiveSummaryPanel';
import AccessTrackerView from './AccessTrackerView';
import TrialPreviewModal from './TrialPreviewModal';
import BrandingStudioView from './BrandingStudioView';
import ReviewAndDiffModal from './ReviewAndDiffModal';
import SuccessScreenModal from './SuccessScreenModal';
import CustomRoleModal from './CustomRoleModal';
import TemplateManagerModal from './TemplateManagerModal';
import TenantPlansTab from '../superadmin/tabs/TenantPlansTab';
import PaymentsTab from '../superadmin/tabs/PaymentsTab';
import SetupRequestsTab from '../superadmin/tabs/SetupRequestsTab';
import CustomersTab from '../superadmin/tabs/CustomersTab';
import AuditLogsTab from '../superadmin/tabs/AuditLogsTab';
import AdminNotificationBell from '../superadmin/AdminNotificationBell';
import RevenueAnalyticsView from './RevenueAnalyticsView';
import ClientsDirectoryView from './ClientsDirectoryView';
import { WhitelabelSettingsPanel } from '../WhitelabelSettingsPanel';

function MainLayoutContent() {
  const {
    activeView,
    setActiveView,
    selectedOrg,
    selectedProject,
    refreshAll,
    isLoading,
  } = useProjectAccess();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dark Mode State (default to dark mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark') || true;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const orgName = selectedOrg?.companyName || 'Apex Enterprises';
  const projName = selectedProject?.name || 'HRMS Project';

  const navTabs: { id: ActiveView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: ClipboardList },
    { id: 'whitelabels', label: 'White Labels', icon: Layers },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: Coins },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'activity-logs', label: 'Activity Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans min-h-0">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Primary Left Sidebar Navigation (Fixed & Non-Scrolling) */}
      <aside
        className={`h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 z-30 shadow-sm transition-all duration-300 select-none ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header with MACENZA Logo & Collapse/Expand Arrow Button */}
          <div className="px-3.5 py-4 border-b border-slate-100 dark:border-slate-800/80 mb-2">
            <div className="flex items-center justify-between gap-1.5">
              {!isSidebarCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-2xl font-black tracking-wider text-slate-900 dark:text-white uppercase font-sans truncate">
                    MACENZA
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                    PRO
                  </span>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-md shadow-blue-500/30">
                    M
                  </div>
                </div>
              )}

              {/* Sidebar Open/Close Toggle Arrow Button & Quick Mode */}
              <div className="flex items-center gap-1 shrink-0">
                {!isSidebarCollapsed && (
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
                  >
                    {isDarkMode ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                    )}
                  </button>
                )}

                {/* Open / Close Collapse Arrow Button */}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  title={isSidebarCollapsed ? 'Expand Sidebar (Show)' : 'Collapse Sidebar (Hide)'}
                  className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30 transition-all cursor-pointer group"
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  )}
                </button>
              </div>
            </div>

            {!isSidebarCollapsed && (
              <div className="flex items-center justify-between mt-1 px-0.5">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                  White-Label Cloud
                </p>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="px-2.5 py-1.5 space-y-1 overflow-y-auto flex-1 scrollbar-none">
            {navTabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive =
                activeView === tab.id ||
                (tab.id === 'requests' && activeView === 'setup-requests') ||
                (tab.id === 'whitelabels' && activeView === 'projects') ||
                (tab.id === 'clients' && activeView === 'organizations') ||
                (tab.id === 'transactions' && activeView === 'payments') ||
                (tab.id === 'activity-logs' && activeView === 'access-tracker') ||
                (tab.id === 'settings' && activeView === 'branding');

              return (
                <React.Fragment key={tab.id}>
                  <button
                    onClick={() => {
                      setActiveView(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    title={isSidebarCollapsed ? tab.label : undefined}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'
                    } rounded-xl text-sm font-bold transition-all cursor-pointer text-left border group ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/25 scale-[1.01]'
                        : 'bg-transparent text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-blue-500'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="truncate font-bold tracking-tight">{tab.label}</span>
                      )}
                    </div>

                    {!isSidebarCollapsed && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-all ${
                          isActive
                            ? 'text-white opacity-100 translate-x-0.5'
                            : 'text-slate-400 dark:text-slate-600 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5'
                        }`}
                      />
                    )}
                  </button>

                  {/* Divider Line */}
                  {!isSidebarCollapsed && index < navTabs.length - 1 && (
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200/60 dark:via-slate-800/70 to-transparent my-1" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Footer Status & Dark Mode Switcher */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2.5 shrink-0 bg-slate-50/70 dark:bg-slate-900/90">
            {!isSidebarCollapsed ? (
              <>
                {/* Dark Mode Toggle Switch */}
                <div className="flex items-center justify-between p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl border border-slate-300/60 dark:border-slate-700/60">
                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isDarkMode
                        ? 'bg-white text-amber-600 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isDarkMode
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Dark</span>
                  </button>
                </div>

                <div className="flex items-center justify-between font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-xs">System Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">White-Label Enterprise Suite v4.0</div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs transition-colors"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area (Independent Smooth Scroll) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* View Switcher Container */}
        <div className="p-5 sm:p-6 md:p-8 flex-1 overflow-y-auto min-h-0">
          {activeView === 'dashboard' && <DashboardOverviewView />}
          {(activeView === 'requests' || activeView === 'setup-requests') && <SetupRequestsTab />}
          {(activeView === 'whitelabels' || activeView === 'projects') && <ProjectListView />}
          {(activeView === 'clients' || activeView === 'organizations') && <ClientsDirectoryView />}
          {activeView === 'revenue' && <RevenueAnalyticsView />}
          {(activeView === 'transactions' || activeView === 'payments') && <PaymentsTab />}
          {(activeView === 'activity-logs' || activeView === 'access-tracker') && <AuditLogsTab />}
          {(activeView === 'settings' || activeView === 'branding') && <WhitelabelSettingsPanel />}
          {activeView === 'plans' && <TenantPlansTab tenantId={selectedOrg?._id || '6a474a798a36ace2cc04c1be'} />}

          {activeView === 'manage-access' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 3-Level Permission Hierarchy Tree */}
              <div className="lg:col-span-8">
                <PermissionTree />
              </div>

              {/* Right Column: Live Sticky Summary Panel */}
              <div className="lg:col-span-4">
                <LiveSummaryPanel />
              </div>
            </div>
          )}

          {activeView === 'trial-preview' && <TrialPreviewModal />}
        </div>
      </main>

      {/* Global Modals */}
      <ReviewAndDiffModal />
      <SuccessScreenModal />
      <CustomRoleModal />
      <TemplateManagerModal />
    </div>
  );
}

export default function WhiteLabelAccessManager({ apiBaseUrl = '' }: { apiBaseUrl?: string }) {
  return (
    <ProjectAccessProvider apiBaseUrl={apiBaseUrl}>
      <MainLayoutContent />
    </ProjectAccessProvider>
  );
}
