'use client';

import React, { useState, useEffect } from 'react';
import { useWhitelabel } from '../context/WhitelabelContext';
import { TenantBrandingConfig } from '../types';

const COLOR_PRESETS = [
  { name: 'Corporate Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
  { name: 'Royal Indigo', primary: '#6366F1', secondary: '#4338CA', accent: '#F59E0B' },
  { name: 'Modern Violet', primary: '#8B5CF6', secondary: '#6D28D9', accent: '#EC4899' },
  { name: 'Emerald Forest', primary: '#10B981', secondary: '#047857', accent: '#3B82F6' },
  { name: 'Sunset Amber', primary: '#F59E0B', secondary: '#B45309', accent: '#6366F1' },
  { name: 'Executive Slate', primary: '#0F172A', secondary: '#334155', accent: '#38BDF8' },
];

export function WhitelabelSettingsPanel() {
  const { branding, updateBranding, uploadAsset, isLoading } = useWhitelabel();

  const [formData, setFormData] = useState<TenantBrandingConfig>(branding);
  const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'domains' | 'assets'>('branding');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (branding) {
      setFormData(branding);
    }
  }, [branding]);

  const handleInputChange = (field: keyof TenantBrandingConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const success = await updateBranding(formData);
    setIsSaving(false);

    if (success) {
      setSaveMessage({ type: 'success', text: 'White-label branding successfully saved & applied!' });
      setTimeout(() => setSaveMessage(null), 4000);
    } else {
      setSaveMessage({ type: 'error', text: 'Failed to update branding. Please check permissions.' });
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    assetType: 'logo' | 'darkLogo' | 'favicon' | 'loginBanner'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadAsset(file, assetType);
    if (uploadedUrl) {
      if (assetType === 'logo') handleInputChange('logoUrl', uploadedUrl);
      if (assetType === 'darkLogo') handleInputChange('darkLogoUrl', uploadedUrl);
      if (assetType === 'favicon') handleInputChange('faviconUrl', uploadedUrl);
      if (assetType === 'loginBanner') handleInputChange('loginBannerUrl', uploadedUrl);

      setSaveMessage({ type: 'success', text: `${assetType} uploaded successfully!` });
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage({ type: 'error', text: 'Asset upload failed.' });
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        Loading White-label Engine Settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            White-label & Branding Studio
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Customize your portal identity, dynamic color palette, custom domain, and corporate logos.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            background: formData.primaryColor || '#3B82F6',
            color: '#ffffff',
            padding: '0.65rem 1.4rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            border: 'none',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.7 : 1,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          {isSaving ? 'Applying Changes...' : 'Save & Publish Branding'}
        </button>
      </div>

      {/* Save Alert Message */}
      {saveMessage && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            background: saveMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: saveMessage.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${saveMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          }}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Studio Layout: Settings on Left, Real-time Preview on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '1.5rem' }}>
        {/* LEFT COLUMN: Settings Tabs & Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            {[
              { id: 'branding', label: 'Identity' },
              { id: 'theme', label: 'Theme Colors' },
              { id: 'assets', label: 'Logos & Assets' },
              { id: 'domains', label: 'Custom Domain' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === tab.id ? '700' : '500',
                  color: activeTab === tab.id ? (formData.primaryColor || '#3B82F6') : '#64748b',
                  background: activeTab === tab.id ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? `2px solid ${formData.primaryColor || '#3B82F6'}` : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
            {/* TAB 1: IDENTITY */}
            {activeTab === 'branding' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Brand / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Tagline / Portal Slogan
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="e.g. Intelligent Workspace for Modern Teams"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={formData.supportEmail || ''}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      placeholder="support@company.com"
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                      Support Phone
                    </label>
                    <input
                      type="text"
                      value={formData.supportPhone || ''}
                      onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Browser Tab Title (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="e.g. Acme Employee Portal"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: THEME COLORS */}
            {activeTab === 'theme' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                    Quick Color Presets
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          handleInputChange('primaryColor', preset.primary);
                          handleInputChange('secondaryColor', preset.secondary);
                          handleInputChange('accentColor', preset.accent);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          border: formData.primaryColor === preset.primary ? '2px solid #0f172a' : '1px solid #e2e8f0',
                          background: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: preset.primary }} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Primary Brand Color (Buttons, Active Tabs, Accents)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      style={{ width: '42px', height: '42px', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      style={{ width: '120px', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Secondary / Hover Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="color"
                      value={formData.secondaryColor || '#1E40AF'}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      style={{ width: '42px', height: '42px', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor || '#1E40AF'}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      style={{ width: '120px', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Sidebar Background */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Sidebar Background
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="color"
                      value={formData.sidebarBg || '#0F172A'}
                      onChange={(e) => handleInputChange('sidebarBg', e.target.value)}
                      style={{ width: '42px', height: '42px', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={formData.sidebarBg || '#0F172A'}
                      onChange={(e) => handleInputChange('sidebarBg', e.target.value)}
                      style={{ width: '120px', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ASSETS */}
            {activeTab === 'assets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Brand Logo (Light Mode / Navbar)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {formData.logoUrl && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={formData.logoUrl} alt="Logo" style={{ maxHeight: '36px', objectFit: 'contain' }} />
                      <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Uploaded & Active</span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Browser Favicon (Tab Icon)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'favicon')}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {formData.faviconUrl && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={formData.faviconUrl} alt="Favicon" style={{ width: '24px', height: '24px' }} />
                      <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Favicon Active</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: DOMAINS */}
            {activeTab === 'domains' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Tenant Subdomain
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={formData.subdomain || ''}
                      onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                      placeholder="acme"
                      style={{ width: '150px', padding: '0.6rem 0.8rem', borderRadius: '0.375rem 0 0 0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                    <span style={{ background: '#f1f5f9', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderLeft: 'none', borderRadius: '0 0.375rem 0.375rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                      .hrms.yourcompany.com
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Employees can access this portal using their tenant-specific subdomain URL.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Custom Domain Mapping
                  </label>
                  <input
                    type="text"
                    value={formData.customDomain || ''}
                    onChange={(e) => handleInputChange('customDomain', e.target.value.toLowerCase())}
                    placeholder="e.g. hrms.acmeenterprise.com"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Point your DNS CNAME record to this server to enable custom white-labeled domain resolution.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Preview */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
              Live Workspace Preview
            </h4>
            <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: '600' }}>
              Real-Time
            </span>
          </div>

          {/* Browser Tab Simulation */}
          <div style={{ background: '#f1f5f9', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <div style={{ marginLeft: '0.5rem', background: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155' }}>
              {formData.faviconUrl ? (
                <img src={formData.faviconUrl} alt="Favicon" style={{ width: '12px', height: '12px' }} />
              ) : (
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: formData.primaryColor }} />
              )}
              <span style={{ fontWeight: '600' }}>{formData.metaTitle || formData.companyName}</span>
            </div>
          </div>

          {/* App Shell Mockup */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '0.5rem', overflow: 'hidden', minHeight: '220px', display: 'flex' }}>
            {/* Mock Sidebar */}
            <div style={{ width: '80px', background: formData.sidebarBg || '#0F172A', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" style={{ maxHeight: '24px', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '0.25rem', background: formData.primaryColor, color: '#fff', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formData.companyName ? formData.companyName.charAt(0) : 'M'}
                </div>
              )}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ height: '8px', borderRadius: '4px', background: formData.primaryColor }} />
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Mock Content Body */}
            <div style={{ flex: 1, background: '#f8fafc', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                  {formData.companyName}
                </span>
                <span style={{ fontSize: '0.7rem', color: formData.primaryColor, fontWeight: '600' }}>
                  Active Tenant
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                {formData.tagline || 'Intelligent Workspace'}
              </p>

              {/* Mock Buttons Adapting to Dynamic Theme */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button
                  type="button"
                  style={{
                    background: formData.primaryColor,
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  Primary Action
                </button>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${formData.primaryColor}`,
                    color: formData.primaryColor,
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
            {formData.copyrightText || '© All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
}
