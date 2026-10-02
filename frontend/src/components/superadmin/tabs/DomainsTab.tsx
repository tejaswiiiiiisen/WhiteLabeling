'use client';
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { Globe, Plus, ShieldCheck, AlertTriangle, RefreshCw, X, HelpCircle, Check } from 'lucide-react';
import { DomainItem } from '../../../types/superAdmin';

export default function DomainsTab() {
  const { domains, addDomain, verifyDomain } = useSuperAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dnsModalDomain, setDnsModalDomain] = useState<DomainItem | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    domain: '',
    companyName: '',
    resellerName: 'Direct / System',
    type: 'Custom Domain' as const,
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await addDomain({
      ...formData,
      sslStatus: 'Active',
      verificationStatus: 'Pending DNS',
      cnameTarget: 'whitelabel.macenza.com',
    });
    if (ok) {
      setIsAddModalOpen(false);
      setToast(`Domain '${formData.domain}' added. Please configure DNS CNAME.`);
      setTimeout(() => setToast(null), 4000);
      setFormData({ domain: '', companyName: '', resellerName: 'Direct / System', type: 'Custom Domain' });
    }
  };

  const handleVerify = async (domain: DomainItem) => {
    setVerifyingId(domain._id);
    const ok = await verifyDomain(domain._id);
    setVerifyingId(null);
    if (ok) {
      setToast(`SSL Certificate and DNS routing for '${domain.domain}' verified!`);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Custom Domains & SSL Routing
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Map custom domain hostnames (e.g. portal.clientbrand.com) with automatic Let's Encrypt SSL.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Domain
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Domains Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Hostname / Domain</th>
                <th className="px-5 py-3.5">Tenant / Brand</th>
                <th className="px-5 py-3.5">Partner</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">SSL Certificate</th>
                <th className="px-5 py-3.5">DNS Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {domains.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {d.domain}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {d.companyName}
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                    {d.resellerName}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {d.sslStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.verificationStatus === 'Verified'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {d.verificationStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => setDnsModalDomain(d)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 text-xs font-bold transition-colors cursor-pointer"
                      title="DNS Setup Instructions"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleVerify(d)}
                      disabled={verifyingId === d._id}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${verifyingId === d._id ? 'animate-spin' : ''}`} />
                      Verify DNS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Domain Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Add Custom Domain
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Hostname / Domain
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. portal.acmecorp.com"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Target Company / Tenant
                </label>
                <input
                  type="text"
                  required
                  placeholder="Acme Corporation"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Domain Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Custom Domain">Custom Domain (CNAME)</option>
                  <option value="Subdomain">Subdomain (e.g. client.macenza.com)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DNS Instructions Modal */}
      {dnsModalDomain && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                DNS Instructions for {dnsModalDomain.domain}
              </h3>
              <button
                onClick={() => setDnsModalDomain(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Point your domain's DNS provider (Cloudflare, GoDaddy, Route53, Namecheap) using these records:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-sans font-bold text-gray-400 uppercase">1. CNAME Record</div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Host:</span>
                  <span className="font-bold text-gray-900 dark:text-white">@ or subdomain</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Points To:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{dnsModalDomain.cnameTarget || 'whitelabel.macenza.com'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] font-sans font-bold text-gray-400 uppercase">2. Verification TXT Record</div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Host:</span>
                  <span className="font-bold text-gray-900 dark:text-white">_macenza-challenge</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Value:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">{dnsModalDomain.dnsTxtRecord || 'macenza-verify=v1-ok'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDnsModalDomain(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
