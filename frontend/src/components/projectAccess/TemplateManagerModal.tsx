'use client';
import React, { useState } from 'react';
import { useProjectAccess } from '../../context/ProjectAccessContext';
import {
  FileSpreadsheet,
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function TemplateManagerModal() {
  const {
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    templates,
    applyTemplate,
    createTemplate,
  } = useProjectAccess();

  const [newTplName, setNewTplName] = useState('');
  const [newTplDesc, setNewTplDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isTemplateModalOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplName.trim()) return;
    setIsCreating(true);
    await createTemplate({
      name: newTplName.trim(),
      description: newTplDesc.trim(),
    });
    setIsCreating(false);
    setNewTplName('');
    setNewTplDesc('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            Permission Templates Library
          </h2>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Create Template Form */}
          <form
            onSubmit={handleCreate}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
              Save Current Tree as New Template
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Template Name (e.g. Operations Manager)"
                value={newTplName}
                onChange={(e) => setNewTplName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-850 text-xs"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newTplDesc}
                onChange={(e) => setNewTplDesc(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-850 text-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                {isCreating ? 'Saving...' : '+ Save Template'}
              </button>
            </div>
          </form>

          {/* Templates List */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Available Templates ({templates.length})
            </span>

            {templates.map((tpl) => (
              <div
                key={tpl._id || tpl.name}
                className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {tpl.name}
                    </h3>
                    {tpl.isSystem && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        System Built-in
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      applyTemplate(tpl.name);
                      setIsTemplateModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
