'use client';
import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import {
  Receipt,
  Download,
  CheckCircle2,
  RefreshCw,
  Key,
  Lock,
  Webhook,
  Copy,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function PaymentsTab() {
  const { payments } = useSuperAdmin();
  const [activeTenantId, setActiveTenantId] = useState('6a474a798a36ace2cc04c1be');
  const [gatewayConfig, setGatewayConfig] = useState({
    keyId: '',
    keySecretMasked: '',
    webhookSecretMasked: '',
    isLiveMode: false,
    isEnabled: true,
    currency: 'INR',
    webhookUrl: '',
    isConfigured: false,
  });

  const [inputKeyId, setInputKeyId] = useState('');
  const [inputKeySecret, setInputKeySecret] = useState('');
  const [inputWebhookSecret, setInputWebhookSecret] = useState('');
  const [inputLiveMode, setInputLiveMode] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Transactions ledger state
  const [ledger, setLedger] = useState<any[]>([]);
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);

  // Test checkout simulation state
  const [isSimulatingOrder, setIsSimulatingOrder] = useState(false);
  const [simulatedOrder, setSimulatedOrder] = useState<any | null>(null);

  const apiBase =
    typeof window !== 'undefined' && window.location.port === '3001'
      ? 'http://localhost:5001'
      : '';

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Gateway Config for Tenant
  const fetchGatewayConfig = async () => {
    try {
      const res = await fetch(`${apiBase}/api/payments/config?tenantId=${activeTenantId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setGatewayConfig(json.data);
        setInputKeyId(json.data.keyId || '');
        setInputKeySecret(json.data.keySecretMasked || '');
        setInputWebhookSecret(json.data.webhookSecretMasked || '');
        setInputLiveMode(Boolean(json.data.isLiveMode));
      }
    } catch (err) {
      console.warn('Could not fetch payment config:', err);
    }
  };

  // Fetch Payment Ledger
  const fetchLedger = async () => {
    setIsLoadingLedger(true);
    try {
      const res = await fetch(`${apiBase}/api/payments/ledger?tenantId=${activeTenantId}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setLedger(json.data);
      } else {
        // Fallback to initial contextual payments if empty
        setLedger(
          payments.map((p) => ({
            orderId: p.id,
            customerName: p.customer,
            amount: p.amount,
            currency: p.currency,
            provider: p.gateway || 'Razorpay',
            status: p.status,
            createdAt: p.date,
          }))
        );
      }
    } catch (err) {
      console.warn('Could not fetch ledger:', err);
    } finally {
      setIsLoadingLedger(false);
    }
  };

  useEffect(() => {
    fetchGatewayConfig();
    fetchLedger();
  }, [activeTenantId]);

  // Save Gateway Credentials
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/payments/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: activeTenantId,
          keyId: inputKeyId,
          keySecret: inputKeySecret,
          webhookSecret: inputWebhookSecret,
          isLiveMode: inputLiveMode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification('✓ Client-Owned Razorpay credentials securely encrypted and saved!');
        fetchGatewayConfig();
      } else {
        showNotification(`❌ Error: ${json.message}`);
      }
    } catch (err: any) {
      showNotification(`❌ Network error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Test Payment Simulation
  const handleSimulatePayment = async () => {
    setIsSimulatingOrder(true);
    try {
      // 1. Create order
      const orderRes = await fetch(`${apiBase}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: activeTenantId,
          planId: '6a474a798a36ace2cc04c101', // Starter/Mock ID
          amount: 999,
          currency: 'INR',
          customerName: 'Test Client Ltd',
          customerEmail: 'test@client.com',
          billingCycle: 'monthly',
        }),
      });
      const orderData = await orderRes.json();
      if (orderData.success) {
        setSimulatedOrder(orderData);

        // 2. Automatically verify simulated payment for instant test feedback
        const verifyRes = await fetch(`${apiBase}/api/payments/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: activeTenantId,
            razorpay_order_id: orderData.order.id,
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_signature: 'simulated_sig_ok',
            planId: '6a474a798a36ace2cc04c101',
            customerName: 'Test Client Ltd',
            customerEmail: 'test@client.com',
            billingCycle: 'monthly',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          showNotification('✓ Test Payment order created, signature verified, and subscription activated!');
          fetchLedger();
        }
      } else {
        showNotification(`❌ Order creation failed: ${orderData.message}`);
      }
    } catch (err: any) {
      showNotification(`❌ Test payment error: ${err.message}`);
    } finally {
      setIsSimulatingOrder(false);
    }
  };

  const webhookFullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001'}/api/payments/webhooks/razorpay/${activeTenantId}`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#5E48E8]" />
            Client-Owned Razorpay & Transaction Ledger
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Connect your organization's direct Razorpay account, configure webhooks, and audit customer transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulatePayment}
            disabled={isSimulatingOrder}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-500/20 cursor-pointer transition-all hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulatingOrder ? 'Processing...' : 'Simulate Test Payment'}</span>
          </button>

          <button
            onClick={() => {
              fetchGatewayConfig();
              fetchLedger();
              showNotification('✓ Refreshed payment data.');
            }}
            className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 cursor-pointer transition-colors shadow-2xs"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CLIENT-OWNED RAZORPAY GATEWAY CREDENTIALS (AES-256 SECURED)    */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  Client-Owned Razorpay Credentials
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    gatewayConfig.isConfigured
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {gatewayConfig.isConfigured ? '🟢 Connected & Active' : '⚪ Unconfigured (Mock Fallback)'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Payments route directly into your business bank account via your own Razorpay merchant credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-50/60 dark:bg-blue-950/30 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/50 text-[11px] font-bold text-blue-700 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Encrypted at Rest with AES-256-GCM</span>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1 flex items-center gap-1.5">
              <span>Razorpay Key ID</span>
              <span className="text-[10px] text-gray-400 font-normal">(Public identifier, e.g. rzp_test_...)</span>
            </label>
            <input
              type="text"
              placeholder="rzp_test_... or rzp_live_..."
              value={inputKeyId}
              onChange={(e) => setInputKeyId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Razorpay Key Secret</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSecret ? 'Hide' : 'Reveal'}</span>
              </button>
            </label>
            <input
              type={showSecret ? 'text' : 'password'}
              placeholder="Enter Key Secret..."
              value={inputKeySecret}
              onChange={(e) => setInputKeySecret(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="block text-gray-700 dark:text-gray-300 font-bold flex items-center gap-1.5">
              <Webhook className="w-3.5 h-3.5 text-gray-400" />
              <span>Razorpay Webhook Secret</span>
              <span className="text-[10px] text-gray-400 font-normal">(Used to verify HMAC-SHA256 event signatures)</span>
            </label>
            <input
              type="text"
              placeholder="Your custom webhook secret string..."
              value={inputWebhookSecret}
              onChange={(e) => setInputWebhookSecret(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Webhook Callback Endpoint URL Display with 1-Click Copy */}
          <div className="md:col-span-2 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Razorpay Webhook Callback URL:
              </span>
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold break-all">
                {webhookFullUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(webhookFullUrl);
                showNotification('✓ Webhook endpoint URL copied to clipboard!');
              }}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 hover:bg-gray-100 cursor-pointer shadow-2xs transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-gray-500" />
              <span>Copy URL</span>
            </button>
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inputLiveMode}
                onChange={(e) => setInputLiveMode(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-bold text-xs text-gray-700 dark:text-gray-300">
                Production / Live Merchant Mode (Uncheck for Test Mode)
              </span>
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#5E48E8] hover:bg-[#503DD4] text-white font-bold text-xs shadow-md shadow-indigo-500/25 cursor-pointer transition-all hover:scale-102"
            >
              {isSaving ? 'Encrypting & Saving...' : 'Save Razorpay Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: LIVE TRANSACTION & REVENUE DISTRIBUTION AUDIT LEDGER           */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#5E48E8]" />
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">
                Revenue Distribution & Transaction Ledger
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automated 35% Platform / 65% Partner revenue allocation recorded for recurring subscriptions.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500">{ledger.length} Recorded Transactions</span>
        </div>

        {/* Revenue Split Policy Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[10px] font-black uppercase text-[#5E48E8] dark:text-indigo-400 tracking-wider block">
              Automated Split Rule
            </span>
            <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
              35% Platform • 65% Partner
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Applied to every successful payment</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider block">
              Our Platform Share (35%)
            </span>
            <div className="text-sm font-black text-blue-700 dark:text-blue-300 mt-0.5">
              ₹3,500 / ₹10,000
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Core engine & VPC architecture</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
              Partner Share (65%)
            </span>
            <div className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              ₹6,500 / ₹10,000
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Client organization settlement</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3.5">Order / Subscription</th>
                <th className="px-4 py-3.5">Customer / Org</th>
                <th className="px-4 py-3.5">Plan</th>
                <th className="px-4 py-3.5">Total Amount</th>
                <th className="px-4 py-3.5">Platform (35%)</th>
                <th className="px-4 py-3.5">Partner (65%)</th>
                <th className="px-4 py-3.5">Next Billing</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
              {ledger.map((p, idx) => {
                const totalAmt = p.totalAmount || p.amount || 10000;
                const pShare = p.platformShare || Math.round(totalAmt * 0.35);
                const partnerShare = p.partnerShare || Math.round(totalAmt * 0.65);

                return (
                  <tr key={p._id || p.orderId || idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-gray-900 dark:text-white">
                      <div>{p.orderId || p.paymentId || `TXN-WL-${idx + 1}`}</div>
                      <div className="text-[10px] text-gray-400 font-normal">
                        Sub: {p.subscriptionId || p.razorpaySubscriptionId || `sub_wl_${idx + 1}`}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">
                      {p.customerOrganization || p.customerName || p.customer || 'Acme Global Ltd'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-[#5E48E8] dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                        {p.planName || p.plan || 'Custom White Label (Monthly)'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-black text-gray-900 dark:text-white">
                      ₹{totalAmt.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-gray-400 font-normal">/ mo</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-blue-600 dark:text-blue-400">
                      ₹{pShare.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{partnerShare.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-[11px]">
                      {p.nextBillingDate
                        ? new Date(p.nextBillingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '30 Days'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Captured' || p.status === 'Paid' || p.status === 'PAID'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => alert(`Invoice & Revenue Split breakdown for ${p.orderId || p.paymentId}:\nTotal: ₹${totalAmt}\nPlatform (35%): ₹${pShare}\nPartner (65%): ₹${partnerShare}`)}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                        title="Download Receipt & Breakdown"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
