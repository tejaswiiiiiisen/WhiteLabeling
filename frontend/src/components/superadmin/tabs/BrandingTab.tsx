'use client';
import React, { useState, useEffect } from 'react';
import { useWhitelabel } from '../../../context/WhitelabelContext';
import { usePermission } from '../../../context/PermissionContext';
import {
  Sparkles,
  Upload,
  Check,
  Layout,
  Palette,
  Eye,
  Type,
  Code,
  Globe,
  Building,
  Lock,
} from 'lucide-react';
import { TenantBrandingConfig } from '../../../types';

export default function BrandingTab() {
  const { branding, updateBranding, uploadAsset, isLoading } = useWhitelabel();
  const { hasPermission, isSuperAdmin } = usePermission();

  const [formData, setFormData] = useState<TenantBrandingConfig>(branding);
  const [activeSection, setActiveSection] = useState<'identity' | 'colors' | 'seo' | 'css'>('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Permission rights
  const canCompanyName = isSuperAdmin || hasPermission('branding.company_name.update');
  const canLogo = isSuperAdmin || hasPermission('branding.logo.update');
  const canColors = isSuperAdmin || hasPermission('branding.theme.update');
  const canSeo = isSuperAdmin || hasPermission('branding.meta.update');
  const canFooter = isSuperAdmin || hasPermission('branding.footer.update');
  const canCss = isSuperAdmin || hasPermission('branding.custom_css.update');

  const canIdentity = canCompanyName || canLogo;

  const availableSections = [
    canIdentity && { id: 'identity', label: 'Brand Identity', icon: Building },
    canColors && { id: 'colors', label: 'Color Palette', icon: Palette },
    (canSeo || canFooter) && { id: 'seo', label: 'SEO & Meta', icon: Globe },
    canCss && { id: 'css', label: 'Custom CSS', icon: Code },
  ].filter(Boolean) as { id: 'identity' | 'colors' | 'seo' | 'css'; label: string; icon: any }[];

  useEffect(() => {
    if (availableSections.length > 0 && !availableSections.some((s) => s.id === activeSection)) {
      setActiveSection(availableSections[0].id);
    }
  }, [availableSections, activeSection]);

  useEffect(() => {
    if (branding) {
      setFormData(branding);
    }
  }, [branding]);

  const handleChange = (field: keyof TenantBrandingConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    assetType: 'logo' | 'darkLogo' | 'favicon' | 'loginBanner'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadAsset(file, assetType);
    if (url) {
      const fieldMap: Record<string, keyof TenantBrandingConfig> = {
        logo: 'logoUrl',
        darkLogo: 'darkLogoUrl',
        favicon: 'faviconUrl',
        loginBanner: 'loginBannerUrl',
      };
      handleChange(fieldMap[assetType], url);
      setToast({ type: 'success', message: `${assetType} uploaded successfully!` });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const ok = await updateBranding(formData);
    setIsSaving(false);

    if (ok) {
      setToast({ type: 'success', message: 'White-label branding saved and broadcast across HRMS!' });
      setTimeout(() => setToast(null), 4000);
    } else {
      setToast({ type: 'error', message: 'Failed to update branding settings.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            White-Label Studio & Visual Identity
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Configure live logos, company names, typography, and color tokens with real-time UI preview.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/10 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Applying Changes...' : 'Save & Broadcast Branding'}
        </button>
      </div>

      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          <Check className="w-4 h-4 shrink-0" />
          {toast.message}
        </div>
      )}

      {/* Main Grid: Controls on Left, Real-Time Interactive Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 overflow-x-auto">
            {availableSections.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    activeSection === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 space-y-6">
            {/* 1. Identity Section */}
            {activeSection === 'identity' && (
              <div className="space-y-5 animate-fadeIn">
                {canCompanyName && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Company Brand Name
                        </label>
                        <input
                          type="text"
                          value={formData.companyName || ''}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          placeholder="e.g. Acme Technologies"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Legal Business Name
                        </label>
                        <input
                          type="text"
                          value={formData.legalName || ''}
                          onChange={(e) => handleChange('legalName', e.target.value)}
                          placeholder="e.g. Acme Technologies Pvt. Ltd."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Brand Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.tagline || ''}
                        onChange={(e) => handleChange('tagline', e.target.value)}
                        placeholder="e.g. Intelligent Enterprise Workspace"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Logo & Asset Uploads */}
                {canLogo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Light Mode Logo</span>
                      {formData.logoUrl && (
                        <span className="text-[10px] text-emerald-600 font-bold">Uploaded</span>
                      )}
                    </div>
                    {formData.logoUrl ? (
                      <div className="h-12 flex items-center justify-center p-2 bg-white rounded-lg border border-gray-200">
                        <img src={formData.logoUrl} alt="Logo" className="max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No logo configured
                      </div>
                    )}
                    <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Light Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logo')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Dark Mode Logo</span>
                      {formData.darkLogoUrl && (
                        <span className="text-[10px] text-emerald-600 font-bold">Uploaded</span>
                      )}
                    </div>
                    {formData.darkLogoUrl ? (
                      <div className="h-12 flex items-center justify-center p-2 bg-gray-900 rounded-lg border border-gray-800">
                        <img src={formData.darkLogoUrl} alt="Dark Logo" className="max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        Using light logo
                      </div>
                    )}
                    <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Dark Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'darkLogo')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                )}
              </div>
            )}

            {/* 2. Color Palette Section */}
            {activeSection === 'colors' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Primary Brand Color', key: 'primaryColor', desc: 'Buttons, active indicators, and highlights' },
                    { label: 'Secondary Color', key: 'secondaryColor', desc: 'Hover states and auxiliary buttons' },
                    { label: 'Accent Color', key: 'accentColor', desc: 'Success badges, pills, and accents' },
                    { label: 'Sidebar Background', key: 'sidebarBg', desc: 'Console navigation sidebar hue' },
                  ].map((colorItem) => (
                    <div key={colorItem.key} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {colorItem.label}
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: (formData as any)[colorItem.key] }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3">{colorItem.desc}</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(formData as any)[colorItem.key] || '#3B82F6'}
                          onChange={(e) => handleChange(colorItem.key as any, e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0"
                        />
                        <input
                          type="text"
                          value={(formData as any)[colorItem.key] || '#3B82F6'}
                          onChange={(e) => handleChange(colorItem.key as any, e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 uppercase"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Typography Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    System Typography Suite
                  </label>
                  <select
                    value={formData.fontFamily || 'Inter, system-ui, sans-serif'}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Inter, system-ui, sans-serif">Inter (Modern & Neutral)</option>
                    <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Sleek SaaS)</option>
                    <option value="Outfit, sans-serif">Outfit (Bold & Geometric)</option>
                    <option value="Roboto, sans-serif">Roboto (Clean Corporate)</option>
                  </select>
                </div>
              </div>
            )}

            {/* 3. SEO Section */}
            {activeSection === 'seo' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Browser Window / Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    placeholder="e.g. Acme HRMS - Enterprise Portal"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.metaDescription || ''}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    placeholder="Enterprise Human Resource Management & Payroll Suite"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Footer Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={formData.copyrightText || ''}
                    onChange={(e) => handleChange('copyrightText', e.target.value)}
                    placeholder="&copy; 2026 Acme Corp. All rights reserved."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 4. Custom CSS Section */}
            {activeSection === 'css' && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Custom CSS Overrides
                </label>
                <textarea
                  rows={8}
                  value={formData.customCss || ''}
                  onChange={(e) => handleChange('customCss', e.target.value)}
                  placeholder="/* Injected directly into head on load */&#10;.custom-btn { border-radius: 9999px; }"
                  className="w-full font-mono text-xs p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Mockup Canvas (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              Live HRMS Preview Canvas
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              Interactive
            </span>
          </div>

          {/* Mini Mockup Window */}
          <div className="rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-950 flex flex-col font-sans">
            {/* Mockup Browser Window Header */}
            <div className="bg-gray-200 dark:bg-gray-800 px-3 py-2 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="mx-auto text-[10px] text-gray-500 font-mono truncate max-w-[180px]">
                https://portal.{formData.companyName ? formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'client'}.com
              </div>
            </div>

            {/* Mockup Portal Body */}
            <div className="flex h-72">
              {/* Mockup Sidebar */}
              <div
                className="w-32 p-3 text-white flex flex-col justify-between shrink-0 transition-colors duration-200"
                style={{ backgroundColor: formData.sidebarBg || '#0F172A' }}
              >
                <div className="space-y-3">
                  {/* Brand Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-white/15">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-5 h-5 object-contain" />
                    ) : (
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center font-black text-[10px] text-white shadow-sm"
                        style={{ backgroundColor: formData.primaryColor || '#3B82F6' }}
                      >
                        {(formData.companyName || 'M').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-extrabold truncate text-white">
                      {formData.companyName || 'MACENZA'}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1 text-[10px]">
                    <div
                      className="px-2 py-1 rounded font-bold text-white shadow-sm flex items-center gap-1.5"
                      style={{ backgroundColor: formData.primaryColor || '#3B82F6' }}
                    >
                      <Layout className="w-2.5 h-2.5" /> Dashboard
                    </div>
                    <div className="px-2 py-1 rounded text-white/60 hover:text-white flex items-center gap-1.5">
                      Employees
                    </div>
                    <div className="px-2 py-1 rounded text-white/60 hover:text-white flex items-center gap-1.5">
                      Attendance
                    </div>
                    <div className="px-2 py-1 rounded text-white/60 hover:text-white flex items-center gap-1.5">
                      Payroll
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-white/40 truncate">
                  v3.2 &bull; Active
                </div>
              </div>

              {/* Mockup Main View */}
              <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between bg-white dark:bg-gray-900">
                <div className="space-y-3">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                    <div>
                      <div className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">Workspace</div>
                      <div className="text-[11px] font-black text-gray-900 dark:text-white">
                        {formData.companyName || 'Portal Console'}
                      </div>
                    </div>
                    <div
                      className="px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: formData.primaryColor || '#3B82F6' }}
                    >
                      Action Button
                    </div>
                  </div>

                  {/* Sample Card */}
                  <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Live Team Status</span>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: formData.accentColor || '#10B981' }}
                      />
                    </div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">
                      124 Online
                    </div>
                  </div>
                </div>

                {/* Footer in canvas */}
                <div className="text-[8px] text-gray-400 text-center truncate pt-2">
                  {formData.copyrightText || `&copy; 2026 ${formData.companyName || 'Acme'}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
