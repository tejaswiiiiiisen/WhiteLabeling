'use client';
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { LayoutTemplate, Plus, Check, Sparkles, Paintbrush, X } from 'lucide-react';
import { TemplateItem } from '../../../types/superAdmin';

export default function TemplatesTab() {
  const { templates, applyTemplate, createTemplate } = useSuperAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Corporate',
    description: '',
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#10B981',
    sidebarBg: '#0F172A',
    textColor: '#0F172A',
    fontFamily: 'Inter, system-ui, sans-serif',
  });

  const handleApply = async (template: TemplateItem) => {
    setApplyingId(template._id);
    const ok = await applyTemplate(template._id);
    setApplyingId(null);
    if (ok) {
      setSuccessToast(`Template '${template.name}' applied to active branding!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await createTemplate({
      name: formData.name,
      category: formData.category,
      description: formData.description,
      colors: {
        primary: formData.primary,
        secondary: formData.secondary,
        accent: formData.accent,
        sidebarBg: formData.sidebarBg,
        textColor: formData.textColor,
      },
      fontFamily: formData.fontFamily,
    });
    if (ok) {
      setIsModalOpen(false);
      setSuccessToast('New theme preset published successfully!');
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            Theme & Layout Presets
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Curated enterprise color schemes and typography suites. Apply across all tenants or assign to specific resellers.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Theme Preset
        </button>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          {successToast}
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group"
          >
            {/* Visual Header / Palette Preview Banner */}
            <div
              className="h-28 p-4 relative flex flex-col justify-between"
              style={{ backgroundColor: template.colors?.sidebarBg || '#0F172A' }}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">
                  {template.category}
                </span>
                {template.isDefault && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-gray-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Default
                  </span>
                )}
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-2">
                {[
                  { label: 'Primary', color: template.colors?.primary },
                  { label: 'Secondary', color: template.colors?.secondary },
                  { label: 'Accent', color: template.colors?.accent },
                  { label: 'Sidebar', color: template.colors?.sidebarBg },
                ].map((swatch, idx) => (
                  <div
                    key={idx}
                    title={`${swatch.label}: ${swatch.color}`}
                    className="w-6 h-6 rounded-full border-2 border-white/40 shadow-sm transition-transform hover:scale-125"
                    style={{ backgroundColor: swatch.color }}
                  />
                ))}
              </div>
            </div>

            {/* Template Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {template.description}
                </p>
                <div className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                  Font: <span className="font-semibold text-gray-700 dark:text-gray-300">{template.fontFamily}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {template.activeTenantsCount || 0} active tenants
                </span>
                <button
                  onClick={() => handleApply(template)}
                  disabled={applyingId === template._id}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  {applyingId === template._id ? 'Applying...' : 'Apply Preset'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                New Theme Preset
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Preset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Sapphire Dark"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Modern Slate">Modern Slate</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Creative Agency">Creative Agency</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Font Family
                  </label>
                  <select
                    value={formData.fontFamily}
                    onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Inter, system-ui, sans-serif">Inter</option>
                    <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                    <option value="Outfit, sans-serif">Outfit</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Design purpose and targeted brand aesthetics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Primary', field: 'primary' },
                  { label: 'Secondary', field: 'secondary' },
                  { label: 'Accent', field: 'accent' },
                  { label: 'Sidebar Bg', field: 'sidebarBg' },
                ].map((col) => (
                  <div key={col.field}>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                      {col.label}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={(formData as any)[col.field]}
                        onChange={(e) => setFormData({ ...formData, [col.field]: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={(formData as any)[col.field]}
                        onChange={(e) => setFormData({ ...formData, [col.field]: e.target.value })}
                        className="w-full px-2 py-1 text-xs border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
