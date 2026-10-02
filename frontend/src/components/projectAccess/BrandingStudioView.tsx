'use client';
import React, { useState, useEffect } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  Sparkles,
  Building2,
  Upload,
  Globe,
  Palette,
  CheckCircle2,
  Save,
  RefreshCw,
  Eye,
  Sliders,
  Mail,
  Shield,
  FileCode,
} from 'lucide-react';

export default function BrandingStudioView() {
  const { selectedOrg, refreshAll } = useProjectAccess();

  const [companyName, setCompanyName] = useState(selectedOrg?.companyName || 'Apex Enterprises');
  const [logoUrl, setLogoUrl] = useState(
    selectedOrg?.logoUrl || 'http://localhost:5001/uploads/whitelabel/brand-1788349682625-170765136.png'
  );
  const [faviconUrl, setFaviconUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState(selectedOrg?.primaryColor || '#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState(selectedOrg?.secondaryColor || '#1D4ED8');
  const [customDomain, setCustomDomain] = useState(selectedOrg?.customDomain || '');
  const [subdomain, setSubdomain] = useState(selectedOrg?.subdomain || 'apex');
  const [supportEmail, setSupportEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (selectedOrg) {
      setCompanyName(selectedOrg.companyName || 'Apex Enterprises');
      setLogoUrl(
        selectedOrg.logoUrl ||
          'http://localhost:5001/uploads/whitelabel/brand-1788349682625-170765136.png'
      );
      setPrimaryColor(selectedOrg.primaryColor || '#3B82F6');
      setSecondaryColor(selectedOrg.secondaryColor || '#1D4ED8');
      setSubdomain(selectedOrg.subdomain || 'apex');
      setCustomDomain(selectedOrg.customDomain || '');
    }
  }, [selectedOrg]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;
    setIsSaving(true);
    try {
      const res = await fetch(
        `http://localhost:5001/api/whitelabel/project-access/organizations/${selectedOrg.organizationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName,
            logoUrl,
            faviconUrl,
            primaryColor,
            secondaryColor,
            customDomain,
            subdomain,
            supportEmail,
          }),
        }
      );
      if (res.ok) {
        setSuccessMessage('White-label branding saved successfully!');
        await refreshAll();
        setTimeout(() => setSuccessMessage(''), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            White Label Branding Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize corporate branding, logo, palette, custom domains, and styles for {companyName}.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving Changes...' : 'Save Branding Changes'}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form (Requirement 20) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* 1. Identity */}
            <div className="space-y-4">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Brand Identity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    placeholder="support@apex.com"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Visual Assets */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                Logos & Visual Assets
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../favicon.ico"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Color Palettes */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                Color Palettes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Domain & Subdomain */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Domain & Custom URL Routing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subdomain Routing
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className="w-full px-3 py-2 rounded-l-xl border border-r-0 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                    />
                    <span className="px-3 py-2 rounded-r-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 font-mono text-[11px]">
                      .hrms.io
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Domain
                  </label>
                  <input
                    type="text"
                    placeholder="portal.apexenterprises.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Live Branding Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 sticky top-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Live Brand Card Preview
            </h2>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 p-2 mx-auto border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{companyName}</h3>
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                  {subdomain}.hrms.io
                </span>
              </div>

              {/* Color Swatch Demonstration */}
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span
                    className="w-4 h-4 rounded-full shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span>Primary</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span
                    className="w-4 h-4 rounded-full shadow-xs"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <span>Secondary</span>
                </div>
              </div>

              {/* Sample Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  style={{ backgroundColor: primaryColor }}
                  className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md"
                >
                  Sign in to {companyName}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
