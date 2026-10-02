'use client';
import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Check,
  X,
  Lock,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  Users,
  HardDrive,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AllowedFeatureModule {
  moduleId: string;
  moduleName: string;
  icon: string;
  isModuleAllowed: boolean;
  actions: { key: string; name: string; taxonomy: string; description: string }[];
}

interface TenantPlanItem {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'both';
  trialDays: number;
  isPopular: boolean;
  activeSubscribersCount: number;
  limits: {
    maxEmployees: number;
    maxUsers: number;
    maxStorageGB: number;
    customDomainAllowed: boolean;
  };
  features: { key: string; name: string; category?: string; included: boolean }[];
  status: 'Active' | 'Draft' | 'Archived';
}

export default function TenantPlansTab({ tenantId = '6a474a798a36ace2cc04c1be' }: { tenantId?: string }) {
  const [plans, setPlans] = useState<TenantPlanItem[]>([]);
  const [allowedCatalog, setAllowedCatalog] = useState<AllowedFeatureModule[]>([]);
  const [allowedKeys, setAllowedKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Create Plan Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planTagline, setPlanTagline] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('999');
  const [yearlyPrice, setYearlyPrice] = useState('9990');
  const [trialDays, setTrialDays] = useState('14');
  const [maxEmployees, setMaxEmployees] = useState('50');
  const [maxUsers, setMaxUsers] = useState('10');
  const [maxStorageGB, setMaxStorageGB] = useState('5');
  const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBase =
    typeof window !== 'undefined' && window.location.port === '3001'
      ? 'http://localhost:5001'
      : '';

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Tenant Plans and Allowed Entitlements
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Tenant Custom Plans
      const plansRes = await fetch(`${apiBase}/api/tenant-plans?tenantId=${tenantId}&projectId=hrms`);
      const plansJson = await plansRes.json();
      if (plansJson.success) {
        setPlans(plansJson.data || []);
      }

      // 2. Fetch Super Admin Allowed Entitlements
      const featRes = await fetch(`${apiBase}/api/tenant-plans/allowed-features?tenantId=${tenantId}&projectId=hrms`);
      const featJson = await featRes.json();
      if (featJson.success && featJson.data) {
        setAllowedCatalog(featJson.data.allowedCatalog || []);
        setAllowedKeys(featJson.data.allowedKeys || []);

        // Pre-select allowed features
        const initFeatures: { [key: string]: boolean } = {};
        (featJson.data.allowedKeys || []).forEach((k: string) => {
          initFeatures[k] = true;
        });
        setSelectedFeatures(initFeatures);
      }
    } catch (err) {
      console.warn('Error fetching plan data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const featureItems = Object.entries(selectedFeatures)
      .filter(([_, isChecked]) => isChecked)
      .map(([key]) => ({
        key,
        name: key.replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        included: true,
      }));

    try {
      const res = await fetch(`${apiBase}/api/tenant-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          projectId: 'hrms',
          name: planName,
          tagline: planTagline,
          monthlyPrice: Number(monthlyPrice),
          yearlyPrice: Number(yearlyPrice),
          currency: 'INR',
          billingCycle: 'both',
          trialDays: Number(trialDays),
          limits: {
            maxEmployees: Number(maxEmployees),
            maxUsers: Number(maxUsers),
            maxStorageGB: Number(maxStorageGB),
            customDomainAllowed: Number(monthlyPrice) >= 2000,
          },
          features: featureItems,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showNotification(`✓ Plan "${planName}" created and validated successfully!`);
        setIsModalOpen(false);
        setPlanName('');
        setPlanTagline('');
        fetchData();
      } else {
        showNotification(`❌ Validation Error: ${json.message}`);
      }
    } catch (err: any) {
      showNotification(`❌ Error creating plan: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#5E48E8]" />
            Tenant Subscription Plans Studio
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Build custom pricing tiers. Tenants can only resell features authorized by the Platform Owner.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#5E48E8] hover:bg-[#503DD4] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Plan</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 cursor-pointer transition-colors shadow-2xs"
            title="Refresh Plans"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Platform Owner Entitlement Summary Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <span className="font-extrabold text-blue-900 dark:text-blue-200">
              Master Feature Catalog Enforcement Active:
            </span>
            <span className="text-blue-700 dark:text-blue-300 ml-1">
              Your tenant organization is currently entitled to {allowedKeys.length} master features across{' '}
              {allowedCatalog.length} modules.
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-blue-900/40 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
          Strict Backend Validation ON
        </div>
      </div>

      {/* Active Tenant Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200/90 dark:border-gray-800 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md"
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-[#5E48E8] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                Popular Tier
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-black text-lg text-gray-900 dark:text-white tracking-tight">{plan.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    plan.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {plan.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{plan.tagline || plan.description || 'Enterprise suite'}</p>

              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  ₹{plan.monthlyPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-gray-400">/mo</span>
                <span className="text-[11px] text-gray-400 ml-2 font-mono">
                  (₹{plan.yearlyPrice.toLocaleString()}/yr)
                </span>
              </div>

              {/* Limits Badges */}
              <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Max {plan.limits?.maxEmployees || 50} Staff</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{plan.limits?.maxStorageGB || 5} GB Cloud</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                <span className="text-[10.5px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                  Included Features ({plan.features?.filter((f) => f.included).length || 0}):
                </span>
                {(plan.features || []).slice(0, 6).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{feat.name}</span>
                  </div>
                ))}
                {(plan.features || []).length > 6 && (
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block pt-1">
                    + {(plan.features || []).length - 6} more included features
                  </span>
                )}
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <span>{plan.activeSubscribersCount || 0} active subscribers</span>
              <span className="font-mono text-[10px]">Slug: {plan.slug}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE CUSTOM TENANT PLAN                                          */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-[#5E48E8] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">Create Custom Tenant Plan</h3>
                  <p className="text-xs text-gray-400">
                    Only features authorized for your tenant by the Platform Owner can be included.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth Enterprise"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced PMS & AI Automation"
                    value={planTagline}
                    onChange={(e) => setPlanTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Monthly Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Yearly Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={yearlyPrice}
                    onChange={(e) => setYearlyPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Free Trial Days</label>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Max Staff Limit</label>
                  <input
                    type="number"
                    value={maxEmployees}
                    onChange={(e) => setMaxEmployees(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Admin Users</label>
                  <input
                    type="number"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    value={maxStorageGB}
                    onChange={(e) => setMaxStorageGB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
              </div>

              {/* FEATURE SELECTION WITH STRICT AUTHORIZATION GATING */}
              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Select Included Features (Strictly Enforced):
                  </span>
                  <span className="text-[10.5px] text-gray-400">
                    Locked features require Super Admin entitlement
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  {allowedCatalog.map((mod) => (
                    <div
                      key={mod.moduleId}
                      className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200 truncate">
                          <span>{mod.moduleName}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded font-mono font-bold">
                            Authorized
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono truncate block">
                          Module Key: {mod.moduleId}
                        </span>
                      </div>

                      <input
                        type="checkbox"
                        checked={Boolean(selectedFeatures[mod.moduleId])}
                        onChange={() => toggleFeature(mod.moduleId)}
                        className="w-4 h-4 rounded text-[#5E48E8] focus:ring-[#5E48E8] cursor-pointer ml-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#5E48E8] hover:bg-[#503DD4] text-white font-bold shadow-md shadow-indigo-500/25 cursor-pointer"
                >
                  {isSubmitting ? 'Validating Entitlements...' : 'Confirm & Publish Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
