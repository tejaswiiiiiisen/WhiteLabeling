'use client';
import React, { useState } from 'react';
import { SuperAdminProvider, useSuperAdmin } from '../../context/SuperAdminContext';
import {
  LayoutDashboard,
  LayoutTemplate,
  Layers,
  Users,
  Building2,
  CreditCard,
  Receipt,
  Coins,
  Globe,
  Sparkles,
  Sliders,
  History,
  Shield,
  Search,
  RefreshCw,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { SuperAdminTab } from '../../types/superAdmin';

// Individual tab views
import OverviewTab from './tabs/OverviewTab';
import TemplatesTab from './tabs/TemplatesTab';
import ProductsTab from './tabs/ProductsTab';
import ResellersTab from './tabs/ResellersTab';
import CustomersTab from './tabs/CustomersTab';
import SubscriptionsTab from './tabs/SubscriptionsTab';
import PaymentsTab from './tabs/PaymentsTab';
import CommissionsTab from './tabs/CommissionsTab';
import DomainsTab from './tabs/DomainsTab';
import BrandingTab from './tabs/BrandingTab';
import FeaturesTab from './tabs/FeaturesTab';
import AuditLogsTab from './tabs/AuditLogsTab';
import SetupRequestsTab from './tabs/SetupRequestsTab';
import AdminNotificationBell from './AdminNotificationBell';
import { ClipboardList } from 'lucide-react';

function DashboardContent() {
  const { activeTab, setActiveTab, isLoading, refreshAll } = useSuperAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleSelectRequest = (id: string) => {
    setSelectedRequestId(id);
    setActiveTab('setup-requests');
  };

  const navItems: { id: SuperAdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: ClipboardList },
    { id: 'whitelabels', label: 'White Labels', icon: Layers },
    { id: 'clients', label: 'Clients', icon: Building2 },
    { id: 'revenue', label: 'Revenue', icon: Coins },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'activity-logs', label: 'Activity Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'requests':
      case 'setup-requests':
        return (
          <SetupRequestsTab
            initialSelectedId={selectedRequestId}
            onClearSelectedId={() => setSelectedRequestId(null)}
          />
        );
      case 'whitelabels':
      case 'products':
        return <ProductsTab />;
      case 'clients':
      case 'customers':
      case 'resellers':
        return <CustomersTab />;
      case 'revenue':
      case 'commissions':
        return <CommissionsTab />;
      case 'transactions':
      case 'payments':
      case 'subscriptions':
        return <PaymentsTab />;
      case 'activity-logs':
      case 'audit-logs':
        return <AuditLogsTab />;
      case 'settings':
      case 'branding':
      case 'domains':
      case 'templates':
      case 'features':
        return <BrandingTab />;
      default:
        return <OverviewTab />;
    }
  };

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="flex min-h-[700px] w-full bg-[#F8FAFC] dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden font-sans">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between shrink-0 min-h-screen z-30 shadow-sm">
          {/* Clean White MACENZA Logo Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider text-gray-900 dark:text-white uppercase font-sans">
                MACENZA
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase mt-0.5">
              White-Label Cloud
            </p>
          </div>

          {/* Navigation Links (Balanced Sleek Sizing with Divider Lines) */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left border group ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25 scale-[1.01]'
                        : 'bg-transparent text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-100/90 dark:hover:bg-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-blue-500'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="truncate font-bold tracking-tight">{item.label}</span>
                    </div>

                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-all ${
                        isActive
                          ? 'text-white opacity-100 translate-x-0.5'
                          : 'text-gray-400 dark:text-gray-600 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5'
                      }`}
                    />
                  </button>

                  {/* Elegant Thin Divider Line */}
                  {index < navItems.length - 1 && (
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200/60 dark:via-gray-800/70 to-transparent my-1" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Card */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-gray-500">Platform Status</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="text-gray-400 text-[11px]">Multi-Tenant v3.2</div>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Viewport Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default function SuperAdminDashboard({ apiBaseUrl = '' }: { apiBaseUrl?: string }) {
  return (
    <SuperAdminProvider apiBaseUrl={apiBaseUrl}>
      <DashboardContent />
    </SuperAdminProvider>
  );
}
