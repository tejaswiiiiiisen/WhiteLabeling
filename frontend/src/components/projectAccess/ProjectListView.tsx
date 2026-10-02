'use client';
import React, { useState } from 'react';
import { useProjectAccess, DEFAULT_PROJECTS_LIST } from '../../context/ProjectAccessContext';
import {
  Layers,
  Building2,
  ExternalLink,
  Sliders,
  Eye,
  Play,
  CheckCircle2,
  Download,
  Plus,
  Search,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  Check,
  Star,
  Zap,
  RotateCcw,
  ShoppingBag,
  Crown,
  LayoutGrid,
  Shield,
  Palette,
  Bell,
  MoreVertical,
  Receipt,
  FileText,
  Mail,
  Phone,
  Copy,
  ArrowUpRight,
  Filter,
  Clock,
  Coins,
  AlertCircle,
  ArrowRight,
  User,
  Users,
} from 'lucide-react';
import SubscriptionCheckoutModal from './SubscriptionCheckoutModal';
import { DynamicSubscriptionData } from './DynamicSubscriptionConfirmation';
import { WhiteLabelBannerGraphic } from './WhiteLabelBannerGraphic';

export interface ProjectTransactionDetail {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar: string;
  avatarBg?: string;
  companyName: string;
  subdomain: string;
  customUrl?: string;
  tier?: 'Growth' | 'Professional' | 'Enterprise' | 'Custom White Label' | string;
  projectId: 'hrms' | 'hotel';
  plan: 'Growth' | 'Professional' | 'Enterprise' | 'Custom White Label' | string;
  requestedUpgradePlan?: 'Growth' | 'Professional' | 'Enterprise' | 'Custom White Label' | string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  amountFormatted: string;
  status: 'Completed' | 'Active' | 'Pending' | 'Upgrade Requested' | 'Approved & Upgraded' | 'Accepted' | 'Trial' | 'Expiring Soon' | 'Cancelled';
  date: string;
  paymentMethod: string;
  paymentStatus?: 'Paid' | 'Due' | 'Cancelled';
  nextRenewalDate?: string;
  daysLeft?: number;
  daysLeftText?: string;
  licenseSeats: string;
  invoiceNumber: string;
  clientNotes: string;
  upgradeReason?: string;
}

const DEFAULT_PROJECT_TRANSACTIONS: ProjectTransactionDetail[] = [
  {
    id: 'TXN-HRMS-87615',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh@finedgecapital.in',
    customerPhone: '+91 94140 23119',
    customerAvatar: 'RS',
    avatarBg: '#2F80ED',
    tier: 'Growth',
    companyName: 'FinEdge Capital Solutions',
    subdomain: 'finedge.moments.io',
    customUrl: 'https://finedge.moments.io',
    projectId: 'hrms',
    plan: 'Growth',
    requestedUpgradePlan: 'Professional',
    status: 'Active',
    billingCycle: 'monthly',
    amount: 89,
    amountFormatted: '$89 / mo',
    paymentMethod: 'Razorpay UPI Auto-Debit',
    paymentStatus: 'Paid',
    nextRenewalDate: '04 Sep 2025',
    daysLeft: 12,
    daysLeftText: '12 days left',
    date: '04 Sep 2026, 09:15 AM',
    licenseSeats: '50 Seats → 200 Seats (Upgrade Pending)',
    invoiceNumber: 'INV-2026-HRMS-0084',
    clientNotes: 'Boutique financial advisory firm requiring strict audit trails.',
  },
  {
    id: 'TXN-HRMS-88320',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@starlightlogistics.co.uk',
    customerPhone: '+44 20 7946 0912',
    customerAvatar: 'SJ',
    avatarBg: '#7B61FF',
    tier: 'Professional',
    companyName: 'Starlight Logistics UK',
    subdomain: 'starlight.moments.io',
    customUrl: 'https://starlight.moments.io',
    projectId: 'hrms',
    plan: 'Professional',
    requestedUpgradePlan: 'Enterprise',
    status: 'Active',
    billingCycle: 'yearly',
    amount: 2400,
    amountFormatted: '$2,400 / yr',
    paymentMethod: 'Bank Wire Transfer',
    paymentStatus: 'Paid',
    nextRenewalDate: '03 Sep 2025',
    daysLeft: 11,
    daysLeftText: '11 days left',
    date: '03 Sep 2026, 02:40 PM',
    licenseSeats: '200 Seats → Unlimited',
    invoiceNumber: 'INV-2026-HRMS-0089',
    clientNotes: 'Logistics fleet company requiring flexible shift hours.',
  },
  {
    id: 'TXN-HRMS-85410',
    customerName: 'Amitav Sen',
    customerEmail: 'amitav@bengalurufintech.in',
    customerPhone: '+91 98450 11223',
    customerAvatar: 'AS',
    avatarBg: '#27AE60',
    tier: 'Professional',
    companyName: 'Bengaluru FinTech Labs',
    subdomain: 'bfl.moments.io',
    customUrl: 'https://bfl.moments.io',
    projectId: 'hrms',
    plan: 'Professional',
    requestedUpgradePlan: 'Professional',
    status: 'Active',
    billingCycle: 'monthly',
    amount: 199,
    amountFormatted: '$199 / mo',
    paymentMethod: 'Razorpay NetBanking',
    paymentStatus: 'Paid',
    nextRenewalDate: '02 Sep 2025',
    daysLeft: 10,
    daysLeftText: '10 days left',
    date: '02 Sep 2026, 04:20 PM',
    licenseSeats: '150 Employee Licenses',
    invoiceNumber: 'INV-2026-HRMS-0095',
    clientNotes: 'Upgraded from Growth tier after Series-A funding round.',
  },
  {
    id: 'TXN-HRMS-89104',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@aegiscloud.com',
    customerPhone: '+1 415 892 4410',
    customerAvatar: 'MV',
    avatarBg: '#F2994A',
    tier: 'Enterprise',
    companyName: 'Aegis Cloud Infrastructure',
    subdomain: 'aegis.moments.io',
    customUrl: 'https://aegis.moments.io',
    projectId: 'hrms',
    plan: 'Enterprise',
    status: 'Active',
    billingCycle: 'yearly',
    amount: 4800,
    amountFormatted: '$4,800 / yr',
    paymentMethod: 'Stripe Card (•••• 8821)',
    paymentStatus: 'Paid',
    nextRenewalDate: '01 Sep 2025',
    daysLeft: 9,
    daysLeftText: '9 days left',
    date: '01 Sep 2026, 11:30 AM',
    licenseSeats: '500+ Distributed Seats',
    invoiceNumber: 'INV-2026-HRMS-0102',
    clientNotes: 'Global cybersecurity enterprise with multi-region SSO.',
  },
  {
    id: 'TXN-HRMS-82199',
    customerName: 'Dr. Priya Nambiar',
    customerEmail: 'priya@apexhealthtech.in',
    customerPhone: '+91 99880 77665',
    customerAvatar: 'PN',
    avatarBg: '#9B51E0',
    tier: 'Growth',
    companyName: 'Apex HealthTech Hospitals',
    subdomain: 'apexhealth.moments.io',
    customUrl: 'https://apexhealth.moments.io',
    projectId: 'hrms',
    plan: 'Growth',
    status: 'Active',
    billingCycle: 'monthly',
    amount: 89,
    amountFormatted: '$89 / mo',
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Paid',
    nextRenewalDate: '29 Aug 2025',
    daysLeft: 7,
    daysLeftText: '7 days left',
    date: '29 Aug 2026, 05:10 PM',
    licenseSeats: '40 Medical Staff Licenses',
    invoiceNumber: 'INV-2026-HRMS-0078',
    clientNotes: 'Multi-specialty hospital pilot for clinical nurse shifts.',
  },
  // Hotel PMS Transactions (12 Records)
  {
    id: 'TXN-HTL-98210',
    customerName: 'Antoine Dubois',
    customerEmail: 'antoine@grandazurecannes.fr',
    customerPhone: '+33 4 93 39 00 00',
    customerAvatar: 'AD',
    avatarBg: '#56CCF2',
    tier: 'Enterprise',
    companyName: 'Grand Azure Cannes Resort',
    subdomain: 'grandazure.moments.io',
    customUrl: 'https://grandazure.moments.io',
    projectId: 'hotel',
    plan: 'Enterprise',
    status: 'Active',
    billingCycle: 'yearly',
    amount: 5200,
    amountFormatted: '$5,200 / yr',
    paymentMethod: 'Direct Bank Wire (IBAN FR76...)',
    paymentStatus: 'Paid',
    nextRenewalDate: '04 Sep 2025',
    daysLeft: 12,
    daysLeftText: '12 days left',
    date: '04 Sep 2026, 01:10 PM',
    licenseSeats: '120 Luxury Suites & Penthouse',
    invoiceNumber: 'INV-2026-HTL-0042',
    clientNotes: 'Luxury 5-star French Riviera resort hotel.',
  },
  {
    id: 'TXN-HTL-97834',
    customerName: 'Karan Mehra',
    customerEmail: 'karan@tajpalacedelhi.in',
    customerPhone: '+91 98101 22334',
    customerAvatar: 'KM',
    avatarBg: '#F2C94C',
    tier: 'Growth',
    companyName: 'The Heritage Palace Hotel',
    subdomain: 'heritagepalace.moments.io',
    customUrl: 'https://heritagepalace.moments.io',
    projectId: 'hotel',
    plan: 'Growth',
    requestedUpgradePlan: 'Professional',
    status: 'Active',
    billingCycle: 'monthly',
    amount: 79,
    amountFormatted: '$79 / mo',
    paymentMethod: 'Razorpay UPI Corporate',
    paymentStatus: 'Paid',
    nextRenewalDate: '03 Sep 2025',
    daysLeft: 11,
    daysLeftText: '11 days left',
    date: '03 Sep 2026, 03:25 PM',
    licenseSeats: '35 Heritage Rooms → 90 Rooms',
    invoiceNumber: 'INV-2026-HTL-0040',
    clientNotes: 'Boutique heritage palace hotel in Jaipur.',
  },
  {
    id: 'TXN-HTL-95120',
    customerName: 'Elena Kostas',
    customerEmail: 'elena@santorinicliffe.gr',
    customerPhone: '+30 2286 071234',
    customerAvatar: 'EK',
    avatarBg: '#6FCF97',
    tier: 'Professional',
    companyName: 'Santorini Cliffside Suites',
    subdomain: 'santorinicliffe.moments.io',
    customUrl: 'https://santorinicliffe.moments.io',
    projectId: 'hotel',
    plan: 'Professional',
    status: 'Active',
    billingCycle: 'yearly',
    amount: 2200,
    amountFormatted: '$2,200 / yr',
    paymentMethod: 'Stripe Business',
    paymentStatus: 'Paid',
    nextRenewalDate: '01 Sep 2025',
    daysLeft: 9,
    daysLeftText: '9 days left',
    date: '01 Sep 2026, 04:40 PM',
    licenseSeats: '1 Boutique Hotel · 65 Ocean Suites',
    invoiceNumber: 'INV-2026-HTL-0038',
    clientNotes: 'Mediterranean resort demanding dynamic weekend surge pricing.',
  },
];

export default function ProjectListView() {
  const {
    projects,
    setSelectedProject,
    setActiveView,
    activePlanProjectId,
    setActivePlanProjectId,
    projectSubscriptionConfig,
    setProjectSubscriptionConfig,
  } = useProjectAccess();

  const [catalogSearch, setCatalogSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'plans' | 'history'>('projects');
  const [selectedDrawerProject, setSelectedDrawerProject] = useState<'hrms' | 'hotel' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscription Plans Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<any>(null);
  const [checkoutBillingCycle, setCheckoutBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Plan billing toggle for plans view
  const [planBillingCycle, setPlanBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const projectTransactions = DEFAULT_PROJECT_TRANSACTIONS;

  const hrmsTransactions = projectTransactions.filter((t) => t.projectId === 'hrms');
  const hotelTransactions = projectTransactions.filter((t) => t.projectId === 'hotel');

  const plansData = [
    {
      id: 'growth',
      name: 'Growth',
      monthlyPrice: 89,
      yearlyPrice: 79,
      yearlyTotal: 948,
      strikePrice: '$119',
      yearlyStrikePrice: '$1,188',
      desc: 'Ideal for early-stage white-label deployments with essential modular access and standard branding.',
      tag: 'Starter Suite',
      badge: 'POPULAR',
      features: [
        'Up to 50 active user licenses',
        'Standard White-Label Theme & Subdomain',
        'Core Module Access & Permissions',
        'Email Support (24-48 hr SLA)',
        'Standard Analytics Dashboard',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 199,
      yearlyPrice: 169,
      yearlyTotal: 2028,
      strikePrice: '$249',
      yearlyStrikePrice: '$2,490',
      desc: 'Advanced enterprise capabilities with custom role creation, granular feature flags, and custom domains.',
      tag: 'Growth & Scaling',
      badge: 'RECOMMENDED',
      features: [
        'Up to 250 active user licenses',
        'Full Custom Domain & CNAME SSL',
        'Granular Feature Flags & Access Gates',
        'Custom Role Builder & Audit Logs',
        'Priority Phone & Chat Support (4-hr SLA)',
        'Automated Billing & Invoice Generator',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 499,
      yearlyPrice: 399,
      yearlyTotal: 4788,
      strikePrice: '$599',
      yearlyStrikePrice: '$5,988',
      desc: 'Unlimited scale for high-volume enterprise organizations with dedicated multi-tenant infrastructure.',
      tag: 'Full Enterprise',
      badge: 'MAX POWER',
      features: [
        'Unlimited active user licenses',
        'Dedicated Multi-Tenant Isolation',
        'Full White-Label API & Webhook Access',
        'Custom SLA & 24/7 Dedicated Account Rep',
        'Custom SSO & Enterprise SAML',
        'Raw Audit Log Exports & Compliance Suite',
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Panoramic 4 Stat Cards Header Banner with White Labels Title */}
      <div className="relative overflow-hidden rounded-2xl bg-[#090D16] border border-slate-800 shadow-2xl p-4 sm:p-5 text-white space-y-3.5">
        {/* Subtle Ambient Depth Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-40 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Title Bar: White Labels */}
        <div className="relative z-10 flex items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
                  White Labels
                </h2>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Live Suites
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Manage white-label applications, access permissions, and subscriptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              2 Active Suites
            </span>
          </div>
        </div>

        {/* 4 Distinct Vibrant Stat Cards */}
        <div className="relative z-10 grid grid-cols-4 gap-3 w-full pt-1">
          {/* 1. Total Projects (Amber / Orange Theme) */}
          <div className="flex flex-col justify-between bg-[#111624] border border-orange-500/30 rounded-xl p-3 px-3.5 min-h-[85px] shadow-sm shadow-orange-500/5 hover:border-orange-500/60 hover:shadow-md hover:shadow-orange-500/10 transition-all group min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider truncate">Total Projects</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">2</div>
              <span className="text-[10px] font-black text-orange-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
                Active Suites
              </span>
            </div>
          </div>

          {/* 2. In Progress / Active (Electric Cyan / Sky Blue Theme) */}
          <div className="flex flex-col justify-between bg-[#111624] border border-cyan-500/30 rounded-xl p-3 px-3.5 min-h-[85px] shadow-sm shadow-cyan-500/5 hover:border-cyan-500/60 hover:shadow-md hover:shadow-cyan-500/10 transition-all group min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider truncate">In Progress</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">4</div>
              <span className="text-[10px] font-black text-cyan-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                Under Provisioning
              </span>
            </div>
          </div>

          {/* 3. Completed White Label (Royal Violet / Purple Theme) */}
          <div className="flex flex-col justify-between bg-[#111624] border border-purple-500/30 rounded-xl p-3 px-3.5 min-h-[85px] shadow-sm shadow-purple-500/5 hover:border-purple-500/60 hover:shadow-md hover:shadow-purple-500/10 transition-all group min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider truncate">Completed WL</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">12</div>
              <span className="text-[10px] font-black text-purple-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                Live Deployed
              </span>
            </div>
          </div>

          {/* 4. Total Income / Revenue (Emerald Green / Mint Theme) */}
          <div className="flex flex-col justify-between bg-[#111624] border border-emerald-500/30 rounded-xl p-3 px-3.5 min-h-[85px] shadow-sm shadow-emerald-500/5 hover:border-emerald-500/60 hover:shadow-md hover:shadow-emerald-500/10 transition-all group min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider truncate">Total Income</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">₹8.42L</div>
              <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                INR Gross
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View 1: Main Projects & Modules Catalog */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {(() => {
            const list = Array.isArray(projects) && projects.length > 0 ? [...projects] : [];
            const hasHrms = list.some((p) => p.projectId === 'hrms');
            const hasHotel = list.some((p) => p.projectId === 'hotel');
            if (!hasHrms) list.unshift(DEFAULT_PROJECTS_LIST[0]);
            if (!hasHotel) list.push(DEFAULT_PROJECTS_LIST[1]);

            if (catalogSearch.trim()) {
              const q = catalogSearch.toLowerCase();
              return list.filter((p) => {
                const nameMatch = (p.name || '').toLowerCase().includes(q);
                const descMatch = (p.description || '').toLowerCase().includes(q);
                const idMatch = (p.projectId || '').toLowerCase().includes(q);
                const modMatch = (p.modules || []).some((m: any) =>
                  (m.name || '').toLowerCase().includes(q)
                );
                return nameMatch || descMatch || idMatch || modMatch;
              });
            }
            return list;
          })().map((proj) => {
            const isHrms = proj.projectId === 'hrms';
            const totalModules = isHrms ? 13 : proj.totalModules || 3;
            const totalFeatures = isHrms ? 71 : proj.totalFeatures || 10;
            const enabledFeatures = isHrms ? 47 : proj.enabledFeatures || 10;
            const enabledModules = isHrms ? 8 : proj.enabledModules || 3;
            const pKey = isHrms ? 'hrms' : 'hotel';
            const cfg = projectSubscriptionConfig?.[pKey] || {
              selectedPlanId: isHrms ? 'professional' : 'growth',
              billingCycle: isHrms ? 'yearly' : 'monthly',
            };

            const dedicatedCount = isHrms ? hrmsTransactions.length : hotelTransactions.length;
            const upgradeCount = (isHrms ? hrmsTransactions : hotelTransactions).filter(
              (t) => t.status === 'Upgrade Requested'
            ).length;

            return (
              <div
                key={proj._id || proj.projectId}
                className={`rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 ${
                  isHrms
                    ? 'bg-gradient-to-b from-[#F7FAFF] via-[#FBFCFF] to-[#F5F9FF] dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'
                    : 'bg-gradient-to-b from-[#FFFDF9] via-[#FFFEFA] to-[#FFFBF5] dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'
                }`}
              >
                {/* TOP SECTION: Header Row */}
                <div
                  className={`px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 ${
                    isHrms
                      ? 'bg-gradient-to-r from-blue-50/50 via-indigo-50/20 to-transparent dark:from-blue-950/40 dark:to-slate-900'
                      : 'bg-gradient-to-r from-orange-50/50 via-amber-50/20 to-transparent dark:from-orange-950/40 dark:to-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Glossy Rounded Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 ${
                        isHrms
                          ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 shadow-indigo-500/20 ring-1 ring-white/30'
                          : 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-orange-500/20 ring-1 ring-white/30'
                      }`}
                    >
                      {isHrms ? <Layers className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    </div>

                    {/* Project Info & Badges */}
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                          {proj.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                          {isHrms ? 'Core HRMS Suite' : 'Hospitality PMS Suite'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span>
                            Plan: {cfg.selectedPlanId.toUpperCase()} ({cfg.billingCycle})
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <p className="font-medium truncate max-w-sm sm:max-w-md">
                          {isHrms
                            ? 'Enterprise Human Resource & Workforce Management System'
                            : 'Complete Hotel Property Management, Guest Check-In & Reservations ERP'}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                          <span className="text-slate-400 font-normal">URL:</span>
                          <a
                            href={proj.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline flex items-center gap-0.5 font-mono"
                          >
                            <span>{proj.projectUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-blue-500" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Status Badge on Right */}
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>

                {/* MIDDLE SECTION: 4 Quick Actions + Ratio Widget + Subscription Plans & Previews */}
                <div
                  className={`px-5 py-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 ${
                    isHrms ? 'bg-[#F1F6FE]/60 dark:bg-slate-950/60' : 'bg-[#FFF7EF]/60 dark:bg-slate-950/60'
                  }`}
                >
                  {/* Left: 4 Quick Access Action Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 min-w-0">
                    {/* 1. Module Access */}
                    <div
                      onClick={() => {
                        setSelectedProject(proj);
                        setActiveView('manage-access');
                      }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight truncate">
                          Module Access
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                          Configure visibility
                        </p>
                      </div>
                    </div>

                    {/* 2. Roles & Permissions */}
                    <div
                      onClick={() => {
                        setSelectedProject(proj);
                        setActiveView('manage-access');
                      }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight truncate">
                          Roles & Permissions
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                          Manage user roles
                        </p>
                      </div>
                    </div>

                    {/* 3. Branding */}
                    <div
                      onClick={() => {
                        setSelectedProject(proj);
                        setActiveView('branding');
                      }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight truncate">
                          Branding
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                          Colors & identity
                        </p>
                      </div>
                    </div>

                    {/* 4. Notifications */}
                    <div
                      onClick={() => {
                        showToast(`✓ Notification preferences for ${proj.name} ready.`);
                      }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight truncate">
                          Notifications
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                          Alerts & emails
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden lg:block w-[1px] h-9 bg-slate-200 dark:bg-slate-800 shrink-0" />

                  {/* Permission Ratio Widget */}
                  <div className="flex items-center gap-2.5 shrink-0 min-w-[135px] p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono">
                          {enabledModules}/{totalModules} Mods
                        </span>
                        <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                          ({Math.round((enabledFeatures / totalFeatures) * 100)}%)
                        </span>
                      </div>
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                          style={{ width: `${Math.round((enabledFeatures / totalFeatures) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden lg:block w-[1px] h-9 bg-slate-200 dark:bg-slate-800 shrink-0" />

                  {/* Right: Subscription Plans Button + Action Buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-[210px]">
                    {/* Subscription Plans Button */}
                    <button
                      onClick={() => {
                        const pId = (proj.projectId === 'hotel' ? 'hotel' : 'hrms') as 'hrms' | 'hotel';
                        setActivePlanProjectId(pId);
                        setActiveTab('plans');
                        showToast(`✓ Opened Subscription Plans for ${proj.name}!`);
                      }}
                      className="w-full bg-gradient-to-r from-[#5443F4] via-[#5F50F6] to-[#7163FB] hover:from-[#4937E8] hover:to-[#6555F5] text-white shadow-xs rounded-xl px-3 py-1.5 flex items-center justify-between group cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6.5 h-6.5 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                          <Crown className="w-3.5 h-3.5 text-white fill-white/30" />
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-black text-white leading-tight">
                            Subscription Plans
                          </div>
                          <div className="text-[9px] text-violet-100 font-bold leading-tight">
                            Growth · Professional · Enterprise
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>

                    {/* Bottom Two Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedProject(proj);
                          setActiveView('trial-preview');
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProject(proj);
                          setActiveView('trial-preview');
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Start Trial</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dedicated Project Payment & Upgrade Bar */}
                <div
                  className={`px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 border-t ${
                    isHrms
                      ? 'bg-blue-50/70 dark:bg-slate-900/90 border-blue-100 dark:border-slate-800'
                      : 'bg-orange-50/70 dark:bg-slate-900/90 border-orange-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Receipt
                      className={`w-4 h-4 ${
                        isHrms ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
                      }`}
                    />
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {isHrms ? 'HRMS' : 'Hotel PMS'} Dedicated Payment History:
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {dedicatedCount} Dedicated Subscribers ·{' '}
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {upgradeCount} Upgrade Requests
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDrawerProject(isHrms ? 'hrms' : 'hotel');
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                      isHrms
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                        : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/20'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View {isHrms ? 'HRMS' : 'Hotel'} History & Upgrades</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* BOTTOM FOOTER */}
                <div
                  className={`px-5 py-2 flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs border-t border-slate-100 dark:border-slate-800/60 ${
                    isHrms ? 'bg-[#F3F7FE]/60 dark:bg-slate-950/60' : 'bg-[#FFF6EC]/60 dark:bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Last Updated: 03 Sep 2026, 10:30 AM</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProject(proj);
                      setActiveView('manage-access');
                    }}
                    className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Subscription Plans Tab */}
      {activeTab === 'plans' && (
        <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-fadeIn space-y-8">
          {/* Project Scope Switcher Bar */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs gap-2">
              <button
                onClick={() => {
                  setActivePlanProjectId('hrms');
                  showToast('✓ Switched to HRMS Project Subscription Plans!');
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activePlanProjectId === 'hrms'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>HRMS Project</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                    activePlanProjectId === 'hrms' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {projectSubscriptionConfig?.hrms?.selectedPlanId || 'Professional'}
                </span>
              </button>

              <button
                onClick={() => {
                  setActivePlanProjectId('hotel');
                  showToast('✓ Switched to Hotel Management Project Subscription Plans!');
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activePlanProjectId === 'hotel'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Hotel Management System</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                    activePlanProjectId === 'hotel' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {projectSubscriptionConfig?.hotel?.selectedPlanId || 'Growth'}
                </span>
              </button>
            </div>
          </div>

          {/* Choose Billing Cycle Toggle */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-3 font-mono">
              CHOOSE YOUR BILLING CYCLE
            </span>
            <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPlanBillingCycle('monthly')}
                className={`px-7 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  planBillingCycle === 'monthly'
                    ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPlanBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  planBillingCycle === 'yearly'
                    ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Yearly</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    planBillingCycle === 'yearly'
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  10% Off
                </span>
              </button>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {plansData.map((plan) => {
              const curPrice = planBillingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
              const curStrike = planBillingCycle === 'yearly' ? plan.yearlyStrikePrice : plan.strikePrice;
              const isSelected =
                (projectSubscriptionConfig?.[activePlanProjectId]?.selectedPlanId || 'professional') ===
                plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 ring-4 ring-blue-500/20 shadow-xl bg-gradient-to-b from-blue-50/40 via-white to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {plan.tag}
                      </span>
                      {plan.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {plan.desc}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                        ${curPrice}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono">{curStrike}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                        / {planBillingCycle === 'yearly' ? 'mo (billed yr)' : 'month'}
                      </span>
                    </div>

                    <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedCheckoutPlan(plan);
                        setCheckoutBillingCycle(planBillingCycle);
                        setIsCheckoutOpen(true);
                      }}
                      className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                        isSelected
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                      }`}
                    >
                      <span>{isSelected ? 'Active Subscription' : `Upgrade to ${plan.name}`}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dedicated Project History Drawer Modal */}
      {selectedDrawerProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                      selectedDrawerProject === 'hrms' ? 'bg-blue-600' : 'bg-orange-600'
                    }`}
                  >
                    {selectedDrawerProject === 'hrms' ? (
                      <Layers className="w-5 h-5" />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedDrawerProject === 'hrms' ? 'HRMS Project' : 'Hotel Management System'}{' '}
                      Dedicated History
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Subscribers, active plans, and pending upgrade requests.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDrawerProject(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                {(selectedDrawerProject === 'hrms' ? hrmsTransactions : hotelTransactions).map((txn) => (
                  <div
                    key={txn.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {txn.companyName}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            ({txn.id})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {txn.customerName} · {txn.customerEmail}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          txn.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : txn.status === 'Upgrade Requested'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="font-bold text-slate-600 dark:text-slate-400">
                        Plan: {txn.plan} ({txn.billingCycle})
                      </span>
                      <span className="font-black text-slate-900 dark:text-white font-mono">
                        {txn.amountFormatted}
                      </span>
                    </div>

                    {txn.upgradeReason && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-medium">
                        <strong>Upgrade Reason:</strong> {txn.upgradeReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedDrawerProject(null)}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Checkout Modal */}
      {isCheckoutOpen && selectedCheckoutPlan && (
        <SubscriptionCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          projectId={activePlanProjectId}
          projectName={activePlanProjectId === 'hotel' ? 'Hotel Management System' : 'HRMS Project'}
          selectedPlan={selectedCheckoutPlan}
          billingCycle={checkoutBillingCycle}
          onSuccess={(subscriptionData: DynamicSubscriptionData) => {
            setIsCheckoutOpen(false);
            showToast(`✓ Upgraded ${subscriptionData.projectName} to ${subscriptionData.planName}!`);
            if (setProjectSubscriptionConfig) {
              setProjectSubscriptionConfig((prev) => ({
                ...prev,
                [activePlanProjectId]: {
                  selectedPlanId: selectedCheckoutPlan.id,
                  billingCycle: checkoutBillingCycle,
                  activeFeatures: selectedCheckoutPlan.features || [],
                },
              }));
            }
          }}
        />
      )}
    </div>
  );
}
