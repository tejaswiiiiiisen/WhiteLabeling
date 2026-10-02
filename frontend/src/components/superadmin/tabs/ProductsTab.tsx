'use client';
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { Layers, CheckCircle2, AlertCircle, Edit3, Tag } from 'lucide-react';
import { WhiteLabelProductItem } from '../../../types/superAdmin';

export default function ProductsTab() {
  const { products, updateProduct } = useSuperAdmin();
  const [editingProduct, setEditingProduct] = useState<WhiteLabelProductItem | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleStatusToggle = async (product: WhiteLabelProductItem) => {
    const nextStatus = product.status === 'Published' ? 'Beta' : 'Published';
    const ok = await updateProduct(product._id, { status: nextStatus });
    if (ok) {
      setSaveToast(`Product status updated to '${nextStatus}'`);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const ok = await updateProduct(editingProduct._id, {
      basePrice: Number(editingProduct.basePrice),
      version: editingProduct.version,
      description: editingProduct.description,
    });
    if (ok) {
      setEditingProduct(null);
      setSaveToast('Product configuration updated!');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            White Label Product Catalogue
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Core SaaS suites and micro-apps distributed to resellers and tenants under custom branding.
          </p>
        </div>
      </div>

      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {saveToast}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                    {prod.category}
                  </span>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white mt-1.5">
                    {prod.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleStatusToggle(prod)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-colors ${
                    prod.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                  }`}
                >
                  {prod.status}
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {prod.description}
              </p>

              {/* Badges / Allowed Tiers */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {prod.allowedTiers?.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Wholesale Base</span>
                <div className="text-lg font-black text-gray-900 dark:text-white">
                  ${prod.basePrice}
                  <span className="text-xs font-medium text-gray-500">/mo</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingProduct(prod)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold transition-colors cursor-pointer"
                  title="Configure Product"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-scaleIn">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Configure {editingProduct.name}
            </h3>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Wholesale Price ($/month)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProduct.basePrice}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={editingProduct.version}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, version: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Update Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
