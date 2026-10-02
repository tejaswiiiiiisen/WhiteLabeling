'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Calendar,
  PieChart,
  RefreshCw,
  X,
  Building2,
  Mail,
  AlertTriangle,
} from 'lucide-react';

export interface DynamicSubscriptionData {
  customerName: string;
  customerEmail: string;
  organizationName: string;
  plan: string;
  billingCadence: string;
  amount: number;
  nextBillingDate: string;
  razorpaySubscriptionId: string;
  razorpayPaymentId: string;
  status: string;
  revenueSplit: {
    platformPercentage: number;
    partnerPercentage: number;
    platformAmount: number;
    partnerAmount: number;
  };
  emailSent: boolean;
  emailError?: string;
  message?: string;
}

export type SubscriptionUIState =
  | 'processing'
  | 'success'
  | 'payment_failed'
  | 'subscription_failed'
  | 'email_failed'
  | 'backend_error';

interface DynamicSubscriptionConfirmationProps {
  state: SubscriptionUIState;
  data: DynamicSubscriptionData | null;
  errorMessage?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export default function DynamicSubscriptionConfirmation({
  state,
  data,
  errorMessage,
  onRetry,
  onClose,
}: DynamicSubscriptionConfirmationProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showRevenueSplit, setShowRevenueSplit] = useState<boolean>(true);

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // -------------------------------------------------------------
  // STATE 1: PROCESSING / VERIFYING
  // -------------------------------------------------------------
  if (state === 'processing') {
    return (
      <div className="py-14 px-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-blue-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Verifying Subscription & Authorization
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Cryptographically validating Razorpay authorization, executing database ledger persistence,
            and activating your dedicated platform instance in real-time...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: PAYMENT FAILED
  // -------------------------------------------------------------
  if (state === 'payment_failed') {
    return (
      <div className="py-10 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
          <X size={32} className="stroke-[2.5]" />
        </div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 mb-1.5">
            Payment Declined / Incomplete
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Payment Authorization Failed
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            {errorMessage || 'Your payment could not be authorized by Razorpay. No funds were debited.'}
          </p>
        </div>

        <div className="pt-3 flex items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Try Payment Again
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 3: SUBSCRIPTION FAILED
  // -------------------------------------------------------------
  if (state === 'subscription_failed' || state === 'backend_error') {
    return (
      <div className="py-10 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <AlertTriangle size={32} className="stroke-[2.5]" />
        </div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 mb-1.5">
            Subscription Creation Error
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Unable to Finalize Subscription
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            {errorMessage || 'A backend error occurred while persisting your subscription record.'}
          </p>
        </div>

        <div className="pt-3 flex items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Retry
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 4: SUCCESS / ACTIVE (WITH DYNAMIC DATA & EMAIL STATUS)
  // -------------------------------------------------------------
  if (!data) return null;

  const cadenceUpper = (data.billingCadence || 'Monthly').toUpperCase();
  const cadenceUnit = cadenceUpper === 'YEARLY' ? 'year' : 'month';
  const formattedAmount = `₹${Number(data.amount || 0).toLocaleString('en-IN')}`;
  const formattedNextDate = data.nextBillingDate
    ? new Date(data.nextBillingDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const isEmailSuccessful = Boolean(data.emailSent);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 dark:text-white">
      {/* 1. Header Banner */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-1">
          <CheckCircle2 size={34} className="stroke-[2.5]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Subscription Authorized & Active</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome to {data.plan || 'Custom White Label'}!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
          Your monthly subscription has been successfully authorized and your dedicated White Label
          platform instance is now activated for <strong>{data.customerName || data.organizationName}</strong>.
        </p>
      </div>

      {/* 2. Cryptographic Subscription Record Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 text-xs space-y-3 font-mono shadow-xl">
        <div className="flex items-center justify-between text-[11px] font-sans font-bold text-slate-400 pb-2 border-b border-slate-800">
          <span className="flex items-center gap-1.5">
            <CreditCard size={14} className="text-blue-400" />
            <span className="text-slate-300 font-extrabold">Cryptographic Subscription Record</span>
          </span>
          <span className="text-emerald-400 font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE • {cadenceUpper}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-slate-400 text-[10px] block">Customer / Organization:</span>
            <span className="font-bold text-white text-xs truncate block">
              {data.customerName}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">Plan & Billing Cadence:</span>
            <span className="font-bold text-blue-300 text-xs truncate block">
              {data.plan} ({data.billingCadence})
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">Total Monthly Paid:</span>
            <span className="font-black text-emerald-400 text-sm">
              {formattedAmount} <span className="text-[10px] text-slate-400 font-normal">/ {cadenceUnit}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">Next Billing Date:</span>
            <span className="font-bold text-slate-200 text-xs flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              <span>{formattedNextDate}</span>
            </span>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <div className="min-w-0">
              <span className="text-slate-400 text-[10px] block">Razorpay Subscription ID:</span>
              <span className="text-slate-200 text-xs font-semibold truncate block">
                {data.razorpaySubscriptionId}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(data.razorpaySubscriptionId, 'sub_id')}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Copy Razorpay Subscription ID"
            >
              {copiedKey === 'sub_id' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-slate-400 text-[10px] block">Razorpay Payment ID:</span>
              <span className="text-slate-200 text-xs font-semibold truncate block">
                {data.razorpayPaymentId}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(data.razorpayPaymentId, 'pay_id')}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Copy Razorpay Payment ID"
            >
              {copiedKey === 'pay_id' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Backend Revenue Distribution Ledger (Dynamic 35% / 65%) */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black text-blue-950 dark:text-blue-300 uppercase tracking-wider">
              Backend Revenue Distribution Ledger (35% / 65% Split)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowRevenueSplit(!showRevenueSplit)}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {showRevenueSplit ? 'Hide Details' : 'View Split (35% / 65%)'}
          </button>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          Recorded in the platform settlement records for every successful monthly subscription payment.
        </p>

        {showRevenueSplit && (
          <div className="mt-3 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider block">
                Platform Fee (35%):
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                ₹{Number(data.revenueSplit?.platformAmount || 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">35% platform fee recorded to DB</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
                Partner / Tenant Share (65%):
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                ₹{Number(data.revenueSplit?.partnerAmount || 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">65% partner tenant settlement</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Automated Confirmation Email Status Message Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex items-start gap-3 shadow-2xs ${
          isEmailSuccessful
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
        }`}
      >
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isEmailSuccessful
              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
          }`}
        >
          {isEmailSuccessful ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-sm">
            {isEmailSuccessful
              ? 'Request accepted successfully and confirmation email sent to the user.'
              : 'Subscription activated, but confirmation email could not be sent.'}
          </span>
          <p className="text-[11px] opacity-90 leading-relaxed">
            {isEmailSuccessful ? (
              <>
                A formal confirmation email has been automatically sent to{' '}
                <strong className="font-mono font-bold">{data.customerEmail}</strong>. Our team will review the required details and contact you shortly regarding the branding setup and onboarding.
              </>
            ) : (
              <>
                Your subscription was registered under{' '}
                <strong className="font-mono font-bold">{data.customerEmail}</strong>. Our operations team will contact you directly to complete the onboarding setup.
              </>
            )}
          </p>
        </div>
      </div>

      {/* 5. Modal Footer Action */}
      {onClose && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check size={16} />
            <span>Close & Return to Plans</span>
          </button>
        </div>
      )}
    </div>
  );
}
