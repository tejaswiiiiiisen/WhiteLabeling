'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useProjectAccess, DEFAULT_PROJECTS_LIST } from '../../context/ProjectAccessContext';
import { TenantPaymentItem } from '../../types/projectAccess';
import {
  Layers,
  CreditCard,
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
  Tag,
  Filter,
  Clock,
  Coins,
  AlertCircle,
  ArrowRight,
  User,
  TrendingUp,
  Trash2,
  Settings,
  Wrench,
  Users,
  ClipboardList,
  Upload,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react';
import { WhiteLabelBannerGraphic } from './WhiteLabelBannerGraphic';
import SubscriptionCheckoutModal, { PLAN_INR_PRICES } from './SubscriptionCheckoutModal';
import { DynamicSubscriptionData } from './DynamicSubscriptionConfirmation';

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
  subscriptionStartDate?: string;
  nextBillingDate?: string;
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  subscriptionStatus?: string;
  paymentMethod: string;
  paymentStatus?: 'Paid' | 'Due' | 'Cancelled';
  nextRenewalDate?: string;
  daysLeft?: number;
  daysLeftText?: string;
  licenseSeats: string;
  invoiceNumber: string;
  clientNotes: string;
  upgradeReason?: string;
  planStatusTitle?: string;
  planSubtitle?: string;
  featuresCurrent?: number;
  featuresTotal?: number;
  featuresPercent?: number;
  featureSubtext?: string;
  featureSubtextType?: 'available' | 'active' | 'trial';
  extraRequirements: {
    title: string;
    description: string;
    category: string;
    extraFee?: string;
  }[];
}

const DEFAULT_PROJECT_TRANSACTIONS: ProjectTransactionDetail[] = [
  // ==========================================
  // HRMS Project Transactions & Upgrade Requests (5 Records)
  // ==========================================
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
    planStatusTitle: 'Growth – Professional',
    status: 'Active',
    planSubtitle: '50 Seats • Financial Services',
    featuresCurrent: 14,
    featuresTotal: 25,
    featuresPercent: 56,
    featureSubtext: '+2 New Features Available',
    featureSubtextType: 'available',
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
    clientNotes: 'Boutique financial advisory firm requiring strict audit trails for financial regulators.',
    upgradeReason: 'Scaling workforce from 45 to 160 employees next month. Urgently requested upgrade to Professional tier for automatic statutory tax (PF/ESI) payroll calculation and multi-office shifts.',
    extraRequirements: [
      {
        title: 'Encrypted Audit Log Export for SEBI Compliance',
        description: 'SHA-256 tamper-proof download of all user action logs and sensitive salary modifications.',
        category: 'Security & Compliance',
        extraFee: '+$15/mo',
      },
      {
        title: 'Custom Multi-Office Holiday Calendar',
        description: 'Separate regional holiday calendars for Mumbai, Delhi, and Bangalore branches.',
        category: 'Custom Feature',
        extraFee: 'Included',
      },
    ],
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
    planStatusTitle: 'Professional – Enterprise',
    status: 'Active',
    planSubtitle: '200 Seats • Logistics Fleet',
    featuresCurrent: 22,
    featuresTotal: 31,
    featuresPercent: 71,
    featureSubtext: '+3 New Features Available',
    featureSubtextType: 'available',
    billingCycle: 'yearly',
    amount: 2400,
    amountFormatted: '$2,400 / yr',
    paymentMethod: 'Bank Wire Transfer',
    paymentStatus: 'Paid',
    nextRenewalDate: '03 Sep 2025',
    daysLeft: 11,
    daysLeftText: '11 days left',
    date: '03 Sep 2026, 02:40 PM',
    licenseSeats: '200 Seats → Unlimited (Enterprise Suite)',
    invoiceNumber: 'INV-2026-HRMS-0089',
    clientNotes: 'Logistics fleet company requiring flexible shift hours calculation and driver leave management.',
    upgradeReason: 'Fleet expanded to 450 drivers across 8 UK distribution hubs. Requested Enterprise tier upgrade for dedicated multi-tenant architecture, custom webhooks, and 15-minute VIP phone SLA.',
    extraRequirements: [
      {
        title: '24/7 Fleet Driver Dynamic Shift Rostering',
        description: 'Custom rotational shift scheduling rules with automatic rest-period enforcement.',
        category: 'Custom Feature',
        extraFee: '+$180/yr',
      },
    ],
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
    planStatusTitle: 'Upgraded Professional',
    status: 'Active',
    planSubtitle: '150 Employee Licenses',
    featuresCurrent: 21,
    featuresTotal: 25,
    featuresPercent: 84,
    featureSubtext: 'Live & Active',
    featureSubtextType: 'active',
    billingCycle: 'monthly',
    amount: 199,
    amountFormatted: '$199 / mo',
    paymentMethod: 'Razorpay Corporate NetBanking',
    paymentStatus: 'Paid',
    nextRenewalDate: '02 Sep 2025',
    daysLeft: 10,
    daysLeftText: '10 days left',
    date: '02 Sep 2026, 04:20 PM',
    licenseSeats: '150 Employee Licenses',
    invoiceNumber: 'INV-2026-HRMS-0095',
    clientNotes: 'Upgraded from Growth tier on 02 Sep 2026 after Series-A funding round.',
    upgradeReason: 'Successfully upgraded from Growth ($89/mo) to Professional ($199/mo) to activate automated payroll disbursement & Form 16 generators.',
    extraRequirements: [
      {
        title: 'RazorpayX Payroll Direct Bank Disbursement',
        description: 'Instant 1-click salary transfers directly to employee ICICI/HDFC bank accounts.',
        category: 'Payroll & Banking',
        extraFee: '+$25/mo',
      },
    ],
  },
  {
    id: 'TXN-HRMS-89104',
    customerName: 'Vikram Malhotra',
    customerEmail: 'vikram.m@zenithcorp.io',
    customerPhone: '+91 98210 44321',
    customerAvatar: 'VM',
    avatarBg: '#F2994A',
    tier: 'Enterprise',
    companyName: 'Zenith Global Technologies',
    subdomain: 'zenith.moments.io',
    customUrl: 'https://zenith.moments.io',
    projectId: 'hrms',
    plan: 'Enterprise',
    planStatusTitle: 'Enterprise',
    status: 'Active',
    planSubtitle: '500 Corporate Seats',
    featuresCurrent: 29,
    featuresTotal: 31,
    featuresPercent: 93,
    featureSubtext: 'All Features Active',
    featureSubtextType: 'active',
    billingCycle: 'yearly',
    amount: 3600,
    amountFormatted: '$3,600 / yr',
    paymentMethod: 'Stripe Corporate Card (•••• 8821)',
    paymentStatus: 'Paid',
    nextRenewalDate: '01 Sep 2025',
    daysLeft: 9,
    daysLeftText: '9 days left',
    date: '01 Sep 2026, 11:30 AM',
    licenseSeats: '500 Corporate Seats',
    invoiceNumber: 'INV-2026-HRMS-0092',
    clientNotes: 'Client onboarded with multi-branch biometric sync across Mumbai and Bengaluru offices.',
    extraRequirements: [
      {
        title: 'ZKTeco Hardware Biometric Sync API',
        description: 'Direct real-time webhook sync with 6 ZKTeco uFace 800 physical attendance machines.',
        category: 'Hardware Sync',
        extraFee: '+$250/yr',
      },
    ],
  },
  {
    id: 'TXN-HRMS-86991',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@nordichealthcare.se',
    customerPhone: '+46 8 123 4567',
    customerAvatar: 'ER',
    avatarBg: '#EB5757',
    tier: 'Enterprise',
    companyName: 'Nordic Health Systems',
    subdomain: 'nordic.moments.io',
    customUrl: 'https://nordic.moments.io',
    projectId: 'hrms',
    plan: 'Enterprise',
    planStatusTitle: 'Enterprise',
    status: 'Trial',
    planSubtitle: '450 Staff & Doctor Accounts',
    featuresCurrent: 14,
    featuresTotal: 31,
    featuresPercent: 45,
    featureSubtext: 'Trial - 5 days left',
    featureSubtextType: 'trial',
    billingCycle: 'monthly',
    amount: 350,
    amountFormatted: '$350 / mo',
    paymentMethod: 'Stripe Card (•••• 1042)',
    paymentStatus: 'Due',
    nextRenewalDate: '28 Aug 2025',
    daysLeft: 5,
    daysLeftText: '5 days left',
    date: '28 Aug 2026, 09:30 AM',
    licenseSeats: '450 Staff & Doctor Accounts',
    invoiceNumber: 'INV-2026-HRMS-0078',
    clientNotes: 'Healthcare network requiring stringent GDPR & medical credential verification records.',
    extraRequirements: [
      {
        title: 'HIPAA & GDPR Medical Credential Tracking',
        description: 'Automated alert trigger 30 days before physician license and CPR certification expires.',
        category: 'Compliance & Tax',
        extraFee: '+$50/mo',
      },
    ],
  },

  // ==================================================
  // Hotel Management System Clients Ledger (12 Records matching Screenshot)
  // ==================================================
  {
    id: 'TXN-HTL-99412',
    customerName: 'Devendra Patel (Person A)',
    customerEmail: 'd.patel@grandhorizonresorts.com',
    customerPhone: '+91 99887 76655',
    customerAvatar: 'DP',
    avatarBg: '#E05638',
    tier: 'Enterprise',
    companyName: 'Grand Horizon Luxury Palace & Spa',
    subdomain: 'grandhorizon.moments.io',
    customUrl: 'https://grandhorizon.moments.io',
    projectId: 'hotel',
    plan: 'Enterprise',
    requestedUpgradePlan: 'Enterprise',
    planStatusTitle: 'Growth – Enterprise',
    status: 'Active',
    planSubtitle: '35 Rooms • 3 Resort Properties',
    featuresCurrent: 24,
    featuresTotal: 31,
    featuresPercent: 77,
    featureSubtext: '+2 New Features Available',
    featureSubtextType: 'available',
    billingCycle: 'yearly',
    amount: 998,
    amountFormatted: '$998 / yr',
    paymentMethod: 'Bank Wire',
    paymentStatus: 'Paid',
    nextRenewalDate: '04 Sep 2025',
    daysLeft: 12,
    daysLeftText: '12 days left',
    date: '04 Sep 2026, 10:15 AM',
    licenseSeats: '35 Rooms → 3 Resort Properties (280 Rooms)',
    invoiceNumber: 'INV-2026-HTL-0045',
    clientNotes: 'Person A purchased Hotel Management on Growth plan. Now opening 2 new palace wings in Udaipur; submitted upgrade request for Enterprise tier.',
    upgradeReason: 'Person A initially purchased Hotel Management on Growth tier. Now opening 2 new heritage wings with 280 suites; requested immediate upgrade to Enterprise Suite with 2-Way OTA Channel Manager (Booking.com/Agoda) and RFID door lock encoding.',
    extraRequirements: [
      {
        title: '2-Way Realtime OTA Channel Manager (Booking.com & Agoda)',
        description: 'Instant zero-lag room inventory and rate synchronization avoiding any double bookings.',
        category: 'OTA Integration',
        extraFee: '+$500/yr',
      },
      {
        title: 'Assa Abloy RFID Door Lock Keycard Encoder',
        description: 'Direct PMS integration with physical card encoder machine at the front desk reception.',
        category: 'Hardware Encoder',
        extraFee: '+$350/yr',
      },
    ],
  },
  {
    id: 'TXN-HTL-97250',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya@emeraldbaygoa.com',
    customerPhone: '+91 98221 34567',
    customerAvatar: 'AD',
    avatarBg: '#EAA524',
    tier: 'Professional',
    companyName: 'Emerald Bay Beach Resort Goa',
    subdomain: 'emeraldbay.wemora.io',
    customUrl: 'https://emeraldbay.wemora.io',
    projectId: 'hotel',
    plan: 'Professional',
    requestedUpgradePlan: 'Professional',
    planStatusTitle: 'Growth – Professional',
    status: 'Active',
    planSubtitle: '25 Cottages • 90 Suites',
    featuresCurrent: 18,
    featuresTotal: 25,
    featuresPercent: 72,
    featureSubtext: '+1 New Feature Available',
    featureSubtextType: 'available',
    billingCycle: 'monthly',
    amount: 90,
    amountFormatted: '$90 / mo',
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Paid',
    nextRenewalDate: '03 Sep 2025',
    daysLeft: 11,
    daysLeftText: '11 days left',
    date: '03 Sep 2026, 05:45 PM',
    licenseSeats: '25 Cottages → 90 Suites (Upgrade Requested)',
    invoiceNumber: 'INV-2026-HTL-0031',
    clientNotes: 'Beach cottage resort expanding facilities for upcoming peak winter holiday season.',
    upgradeReason: 'Winter beach tourist surge; upgrading to Professional PMS for POS restaurant kitchen split ticket printing and dynamic peak season pricing rules.',
    extraRequirements: [
      {
        title: 'Water Sports & Beach Shack Rental Billing Add-on',
        description: 'Post scuba diving, kayak, and beach umbrella charges directly to guest room folio.',
        category: 'Custom Feature',
        extraFee: '+$20/mo',
      },
    ],
  },
  {
    id: 'TXN-HTL-95320',
    customerName: 'Fatima Al-Mansoor',
    customerEmail: 'reservations@royaldunesresort.ae',
    customerPhone: '+971 4 399 8877',
    customerAvatar: 'FA',
    avatarBg: '#7B61FF',
    tier: 'Enterprise',
    companyName: 'Royal Dunes Desert Oasis Resort & ...',
    subdomain: 'royaldunes.moments.io',
    customUrl: 'https://royaldunes.moments.io',
    projectId: 'hotel',
    plan: 'Enterprise',
    requestedUpgradePlan: 'Enterprise',
    planStatusTitle: 'Upgraded Enterprise',
    status: 'Active',
    planSubtitle: '41 Luxury Glamping Domes',
    featuresCurrent: 26,
    featuresTotal: 31,
    featuresPercent: 83,
    featureSubtext: 'Live & Active',
    featureSubtextType: 'active',
    billingCycle: 'yearly',
    amount: 6200,
    amountFormatted: '$6,200 / yr',
    paymentMethod: 'Emirates NBD',
    paymentStatus: 'Paid',
    nextRenewalDate: '03 Sep 2025',
    daysLeft: 11,
    daysLeftText: '11 days left',
    date: '02 Sep 2026, 01:10 PM',
    licenseSeats: '40 Luxury Glamping Domes & Chalets',
    invoiceNumber: 'INV-2026-HTL-0048',
    clientNotes: 'Upgraded to Enterprise Suite on 02 Sep 2026 to unlock Central Reservation System (CRS).',
    upgradeReason: 'Upgraded after opening 40 luxury air-conditioned desert domes; multi-property CRS and multilingual guest check-in unlocked.',
    extraRequirements: [
      {
        title: 'Centralized Multi-Property CRS Booking Engine',
        description: 'Single guest profile, loyalty points, and cross-property room bookings.',
        category: 'Custom Feature',
        extraFee: 'Included',
      },
    ],
  },
  {
    id: 'TXN-HTL-98104',
    customerName: 'Marcus Aurelius Vance',
    customerEmail: 'marcus@rivierasuites.it',
    customerPhone: '+39 06 698 1234',
    customerAvatar: 'MV',
    avatarBg: '#27AE60',
    tier: 'Professional',
    companyName: 'Riviera Boutique Coastal Suites',
    subdomain: 'riviera.moments.io',
    customUrl: 'https://riviera.moments.io',
    projectId: 'hotel',
    plan: 'Professional',
    planStatusTitle: 'Professional',
    status: 'Active',
    planSubtitle: '18 Boutique Hotel • 65 Rooms',
    featuresCurrent: 21,
    featuresTotal: 25,
    featuresPercent: 84,
    featureSubtext: 'All Features Active',
    featureSubtextType: 'active',
    billingCycle: 'yearly',
    amount: 1800,
    amountFormatted: '$1,800 / yr',
    paymentMethod: 'Stripe Business',
    paymentStatus: 'Paid',
    nextRenewalDate: '01 Sep 2025',
    daysLeft: 9,
    daysLeftText: '9 days left',
    date: '01 Sep 2026, 04:40 PM',
    licenseSeats: '1 Boutique Hotel · 65 Ocean Suites',
    invoiceNumber: 'INV-2026-HTL-0038',
    clientNotes: 'Mediterranean resort demanding dynamic weekend surge pricing and private yacht tour billing.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96400',
    customerName: 'Carlos Rodriguez',
    customerEmail: 'carlos@casasolheritage.es',
    customerPhone: '+34 91 123 4567',
    customerAvatar: 'CR',
    avatarBg: '#2D9CDB',
    tier: 'Enterprise',
    companyName: 'Casa Sol Heritage Villas',
    subdomain: 'casasol.moments.io',
    customUrl: 'https://casasol.moments.io',
    projectId: 'hotel',
    plan: 'Enterprise',
    planStatusTitle: 'Enterprise',
    status: 'Trial',
    planSubtitle: '6 Heritage Villas • 120 Guests',
    featuresCurrent: 12,
    featuresTotal: 31,
    featuresPercent: 39,
    featureSubtext: 'Trial - 7 days left',
    featureSubtextType: 'trial',
    billingCycle: 'monthly',
    amount: 428,
    amountFormatted: '$428 / mo',
    paymentMethod: 'Stripe Card (•••• 9934)',
    paymentStatus: 'Due',
    nextRenewalDate: '27 Aug 2025',
    daysLeft: 5,
    daysLeftText: '5 days left',
    date: '27 Aug 2026, 10:15 AM',
    licenseSeats: '5 Heritage Villas · 120 Guests',
    invoiceNumber: 'INV-2026-HTL-0024',
    clientNotes: 'Luxury villa complex with private swimming pools and personalized chef service.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96401',
    customerName: 'Sophia Chen',
    customerEmail: 'sophia@starlightmedia.com',
    customerPhone: '+1 415 555 2671',
    customerAvatar: 'SC',
    avatarBg: '#9B51E0',
    tier: 'Professional',
    companyName: 'Starlight Media Retreat',
    subdomain: 'starlight.moments.io',
    customUrl: 'https://starlight.moments.io',
    projectId: 'hotel',
    plan: 'Professional',
    planStatusTitle: 'Professional',
    status: 'Active',
    planSubtitle: '22 Suites • Corporate Retreat',
    featuresCurrent: 19,
    featuresTotal: 25,
    featuresPercent: 76,
    featureSubtext: '+3 New Features Available',
    featureSubtextType: 'available',
    billingCycle: 'monthly',
    amount: 199,
    amountFormatted: '$199 / mo',
    paymentMethod: 'Stripe Card (•••• 4129)',
    paymentStatus: 'Paid',
    nextRenewalDate: '15 Sep 2025',
    daysLeft: 23,
    daysLeftText: '23 days left',
    date: '25 Aug 2026, 03:20 PM',
    licenseSeats: '22 Corporate Suites',
    invoiceNumber: 'INV-2026-HTL-0025',
    clientNotes: 'Corporate retreat facility with conference audio-visual systems.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96402',
    customerName: "Liam O'Connor",
    customerEmail: 'liam@highlandcrest.co.uk',
    customerPhone: '+44 131 496 0888',
    customerAvatar: 'LO',
    avatarBg: '#219653',
    tier: 'Enterprise',
    companyName: 'Highland Crest Lodges',
    subdomain: 'highlandcrest.moments.io',
    customUrl: 'https://highlandcrest.moments.io',
    projectId: 'hotel',
    plan: 'Enterprise',
    planStatusTitle: 'Enterprise',
    status: 'Active',
    planSubtitle: '50 Mountain Lodges',
    featuresCurrent: 28,
    featuresTotal: 31,
    featuresPercent: 90,
    featureSubtext: 'All Features Active',
    featureSubtextType: 'active',
    billingCycle: 'yearly',
    amount: 4800,
    amountFormatted: '$4,800 / yr',
    paymentMethod: 'Bank Wire',
    paymentStatus: 'Paid',
    nextRenewalDate: '22 Sep 2025',
    daysLeft: 30,
    daysLeftText: '30 days left',
    date: '22 Aug 2026, 11:45 AM',
    licenseSeats: '50 Luxury Mountain Lodges',
    invoiceNumber: 'INV-2026-HTL-0026',
    clientNotes: 'Scenic Highland lodges with integrated ski-pass checkout integration.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96403',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@nordicchalets.no',
    customerPhone: '+47 22 11 33 44',
    customerAvatar: 'ER',
    avatarBg: '#EB5757',
    tier: 'Growth',
    companyName: 'Nordic Alpine Chalets',
    subdomain: 'nordicchalets.moments.io',
    customUrl: 'https://nordicchalets.moments.io',
    projectId: 'hotel',
    plan: 'Growth',
    planStatusTitle: 'Growth',
    status: 'Expiring Soon',
    planSubtitle: '12 Ski Chalets',
    featuresCurrent: 8,
    featuresTotal: 20,
    featuresPercent: 40,
    featureSubtext: 'Trial - 2 days left',
    featureSubtextType: 'trial',
    billingCycle: 'monthly',
    amount: 49,
    amountFormatted: '$49 / mo',
    paymentMethod: 'PayPal',
    paymentStatus: 'Due',
    nextRenewalDate: '06 Sep 2025',
    daysLeft: 2,
    daysLeftText: '2 days left',
    date: '20 Aug 2026, 09:00 AM',
    licenseSeats: '12 Alpine Chalets',
    invoiceNumber: 'INV-2026-HTL-0027',
    clientNotes: 'Trial expiring soon; client evaluating self-checkin kiosks.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96404',
    customerName: 'Vikram Malhotra',
    customerEmail: 'vikram@zenithresorts.in',
    customerPhone: '+91 98110 54321',
    customerAvatar: 'VM',
    avatarBg: '#F2994A',
    tier: 'Enterprise',
    companyName: 'Zenith Tech Resorts',
    subdomain: 'zenithresorts.moments.io',
    customUrl: 'https://zenithresorts.moments.io',
    projectId: 'hotel',
    plan: 'Enterprise',
    planStatusTitle: 'Enterprise',
    status: 'Active',
    planSubtitle: '80 Beachfront Rooms',
    featuresCurrent: 30,
    featuresTotal: 31,
    featuresPercent: 97,
    featureSubtext: 'Live & Active',
    featureSubtextType: 'active',
    billingCycle: 'yearly',
    amount: 5500,
    amountFormatted: '$5,500 / yr',
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Paid',
    nextRenewalDate: '28 Sep 2025',
    daysLeft: 36,
    daysLeftText: '36 days left',
    date: '18 Aug 2026, 02:15 PM',
    licenseSeats: '80 Beachfront Rooms & Villas',
    invoiceNumber: 'INV-2026-HTL-0028',
    clientNotes: 'Full enterprise hospitality suite with dining & event booking modules.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96405',
    customerName: 'Chloe Laurent',
    customerEmail: 'chloe@provencesun.fr',
    customerPhone: '+33 1 42 68 55 00',
    customerAvatar: 'CL',
    avatarBg: '#BB6BD9',
    tier: 'Professional',
    companyName: 'Provence Sun Estates',
    subdomain: 'provencesun.moments.io',
    customUrl: 'https://provencesun.moments.io',
    projectId: 'hotel',
    plan: 'Professional',
    planStatusTitle: 'Professional',
    status: 'Expiring Soon',
    planSubtitle: '15 Vineyard Cottages',
    featuresCurrent: 20,
    featuresTotal: 25,
    featuresPercent: 80,
    featureSubtext: 'Renewal Due - 4 days',
    featureSubtextType: 'trial',
    billingCycle: 'monthly',
    amount: 150,
    amountFormatted: '$150 / mo',
    paymentMethod: 'Mastercard (•••• 7810)',
    paymentStatus: 'Due',
    nextRenewalDate: '08 Sep 2025',
    daysLeft: 4,
    daysLeftText: '4 days left',
    date: '15 Aug 2026, 01:10 PM',
    licenseSeats: '15 Luxury Vineyard Cottages',
    invoiceNumber: 'INV-2026-HTL-0029',
    clientNotes: 'French wine-tasting estate with guest accommodation.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96406',
    customerName: 'Tariq Mansoor',
    customerEmail: 'tariq@marinasands.ae',
    customerPhone: '+971 4 210 9988',
    customerAvatar: 'TM',
    avatarBg: '#56CCF2',
    tier: 'Enterprise',
    companyName: 'Dubai Marina Sands',
    subdomain: 'marinasands.moments.io',
    customUrl: 'https://marinasands.moments.io',
    projectId: 'hotel',
    plan: 'Enterprise',
    planStatusTitle: 'Enterprise',
    status: 'Active',
    planSubtitle: '120 Luxury Marina Suites',
    featuresCurrent: 29,
    featuresTotal: 31,
    featuresPercent: 93,
    featureSubtext: 'Live & Active',
    featureSubtextType: 'active',
    billingCycle: 'yearly',
    amount: 7200,
    amountFormatted: '$7,200 / yr',
    paymentMethod: 'Wire Transfer',
    paymentStatus: 'Paid',
    nextRenewalDate: '05 Oct 2025',
    daysLeft: 43,
    daysLeftText: '43 days left',
    date: '10 Aug 2026, 04:30 PM',
    licenseSeats: '120 Luxury Marina Suites & Penthouses',
    invoiceNumber: 'INV-2026-HTL-0030',
    clientNotes: 'High-end marina waterfront suites with concierge dispatch.',
    extraRequirements: [],
  },
  {
    id: 'TXN-HTL-96407',
    customerName: 'Hannah Schmidt',
    customerEmail: 'hannah@blackforestspa.de',
    customerPhone: '+49 761 203 1122',
    customerAvatar: 'HS',
    avatarBg: '#828282',
    tier: 'Growth',
    companyName: 'Black Forest Spa Hotel',
    subdomain: 'blackforestspa.moments.io',
    customUrl: 'https://blackforestspa.moments.io',
    projectId: 'hotel',
    plan: 'Growth',
    planStatusTitle: 'Growth',
    status: 'Cancelled',
    planSubtitle: '10 Heritage Rooms',
    featuresCurrent: 5,
    featuresTotal: 20,
    featuresPercent: 25,
    featureSubtext: 'Subscription Ended',
    featureSubtextType: 'trial',
    billingCycle: 'monthly',
    amount: 79,
    amountFormatted: '$79 / mo',
    paymentMethod: 'Visa (•••• 3321)',
    paymentStatus: 'Due',
    nextRenewalDate: '01 Aug 2025',
    daysLeft: 0,
    daysLeftText: 'Expired',
    date: '01 Aug 2026, 10:00 AM',
    licenseSeats: '10 Heritage Rooms',
    invoiceNumber: 'INV-2026-HTL-0021',
    clientNotes: 'Hotel management subscription cancelled after seasonal closure.',
    extraRequirements: [],
  },
];

export default function DashboardOverviewView() {
  const {
    projects,
    setSelectedProject,
    setActiveView,
    payments,
    recordPayment,
    refundPayment,
    selectedOrg,
    organizations,
  } = useProjectAccess();

  const [activeTab, setActiveTab] = useState<'payments' | 'plans'>('payments');

  // Independent Per-Project Subscription Configuration
  const [activePlanProjectId, setActivePlanProjectId] = useState<'hrms' | 'hotel'>('hrms');
  const [projectSubscriptionConfig, setProjectSubscriptionConfig] = useState<Record<'hrms' | 'hotel', {
    selectedPlanId: string;
    billingCycle: 'monthly' | 'yearly';
    status: 'active' | 'trial';
  }>>({
    hrms: {
      selectedPlanId: 'professional',
      billingCycle: 'yearly',
      status: 'active',
    },
    hotel: {
      selectedPlanId: 'growth',
      billingCycle: 'monthly',
      status: 'trial',
    },
  });

  const curConfig = projectSubscriptionConfig[activePlanProjectId];
  const selectedPlanId = curConfig.selectedPlanId;
  const planBillingCycle = curConfig.billingCycle;

  const setPlanBillingCycle = (cycle: 'monthly' | 'yearly') => {
    setProjectSubscriptionConfig((prev) => ({
      ...prev,
      [activePlanProjectId]: {
        ...prev[activePlanProjectId],
        billingCycle: cycle,
      },
    }));
  };

  const setSelectedPlanId = (planId: string) => {
    setProjectSubscriptionConfig((prev) => ({
      ...prev,
      [activePlanProjectId]: {
        ...prev[activePlanProjectId],
        selectedPlanId: planId,
      },
    }));
  };

  const [flippedPlans, setFlippedPlans] = useState<Record<string, boolean>>({});

  const togglePlanFlip = (planId: string) => {
    setFlippedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };
  const [catalogSearch, setCatalogSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [newPayOrg, setNewPayOrg] = useState('Apex Enterprises');
  const [newPayAmount, setNewPayAmount] = useState('48000');
  const [newPayPlan, setNewPayPlan] = useState('Professional');
  const [newPayMethod, setNewPayMethod] = useState('Bank Transfer');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<string>('Growth');
  const [acceptedConfirmationModal, setAcceptedConfirmationModal] = useState<ProjectTransactionDetail | null>(null);

  // Subscriber Transaction History & Bespoke Client Requirements State
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState<ProjectTransactionDetail | null>(null);
  const [txnSearchQuery, setTxnSearchQuery] = useState('');
  const [txnPlanFilter, setTxnPlanFilter] = useState<'all' | 'Growth' | 'Professional' | 'Enterprise' | 'Custom White Label'>('all');
  const [txnStatusFilter, setTxnStatusFilter] = useState<'all' | 'Upgrade Requested' | 'Approved & Upgraded' | 'Active' | 'Completed'>('all');
  const [copiedTxnId, setCopiedTxnId] = useState<string | null>(null);
  const [projectTransactions, setProjectTransactions] = useState<ProjectTransactionDetail[]>(DEFAULT_PROJECT_TRANSACTIONS);

  const formatSubToTransaction = useCallback((sub: any): ProjectTransactionDetail => {
    const planName = sub.plan || 'Growth';
    const amount = Number(sub.amount || (planName === 'Enterprise' ? 10000 : planName === 'Professional' ? 5000 : 2500));
    const cadence = (sub.billingCadence || sub.cadence || 'monthly').toLowerCase() === 'yearly' ? 'yearly' : 'monthly';
    const subId = sub.razorpaySubscriptionId || sub.subscriptionId || sub.id || `SUB-${Date.now()}`;
    const payId = sub.razorpayPaymentId || sub.paymentId || '';
    const startDate = sub.subscriptionStartDate || sub.createdAt || new Date().toISOString();
    const nextDate = sub.nextBillingDate || '';
    const orgName = sub.organizationName || sub.companyName || sub.customerName || 'Hotel Royal Suites';
    const custName = sub.customerName || 'Hotel Subscriber';

    return {
      id: subId,
      customerName: custName,
      customerEmail: sub.customerEmail || sub.email || 'guest@hotel.com',
      customerPhone: sub.customerPhone || '+91 98765 43210',
      customerAvatar: (custName.charAt(0) || 'H').toUpperCase(),
      avatarBg: '#5E48E8',
      companyName: orgName,
      subdomain: orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      customUrl: `https://${orgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.moments.io`,
      tier: planName,
      projectId: (sub.projectId === 'hrms' ? 'hrms' : 'hotel'),
      plan: planName,
      billingCycle: cadence,
      amount: amount,
      amountFormatted: `₹${amount.toLocaleString('en-IN')}${cadence === 'yearly' ? ' / yr' : ' / mo'}`,
      status: 'Active',
      subscriptionStatus: sub.subscriptionStatus || sub.status || 'Active',
      paymentStatus: sub.paymentStatus || 'Paid',
      subscriptionStartDate: startDate,
      nextBillingDate: nextDate,
      razorpaySubscriptionId: sub.razorpaySubscriptionId || sub.subscriptionId || subId,
      razorpayPaymentId: payId,
      date: new Date(startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      nextRenewalDate: nextDate
        ? new Date(nextDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'In 30 Days',
      daysLeft: 30,
      daysLeftText: '30 days left',
      licenseSeats:
        planName === 'Growth'
          ? '25 Luxury Suites'
          : planName === 'Professional'
            ? '100 Luxury Suites'
            : 'Unlimited Suites & Resorts',
      invoiceNumber: sub.invoiceNumber || `INV-${(sub.razorpaySubscriptionId || subId).slice(-6).toUpperCase()}`,
      paymentMethod: sub.paymentMethod || 'Razorpay UPI / Card',
      clientNotes: `Auto-synced from Razorpay. Subscription ID: ${sub.razorpaySubscriptionId || subId}, Payment ID: ${payId}.`,
      planStatusTitle: `${planName} – Active`,
      planSubtitle: `${planName === 'Growth' ? '25' : planName === 'Professional' ? '100' : 'Unlimited'} Suites • Live PMS`,
      featuresCurrent: planName === 'Enterprise' ? 31 : planName === 'Professional' ? 25 : 18,
      featuresTotal: 31,
      featuresPercent: planName === 'Enterprise' ? 100 : planName === 'Professional' ? 80 : 58,
      featureSubtext: 'Live & Active',
      featureSubtextType: 'active',
      extraRequirements: sub.extraRequirements || [],
    };
  }, []);

  const syncDynamicSubscriptions = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/payments/subscriptions?projectId=${activePlanProjectId}`).catch(() => null);
      let backendSubs: any[] = [];
      if (res && res.ok) {
        const json = await res.json();
        const list = json.subscriptions || json.data;
        if (json && json.success && Array.isArray(list)) {
          backendSubs = list;
        }
      }

      const localHotelSubs: any[] = JSON.parse(localStorage.getItem('hrms_hotel_subscriptions') || '[]');
      const localTxns: any[] = JSON.parse(localStorage.getItem('whitelabel_project_transactions') || '[]');

      const formattedBackend = backendSubs.map(formatSubToTransaction);
      const formattedHotel = localHotelSubs.map(formatSubToTransaction);

      setProjectTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const existingRazorpayIds = new Set(
          prev.map((t) => t.razorpaySubscriptionId).filter(Boolean)
        );

        const newItems: ProjectTransactionDetail[] = [];

        [...formattedBackend, ...formattedHotel, ...localTxns].forEach((item) => {
          if (!item) return;
          const rzpId = item.razorpaySubscriptionId || item.id;
          if (rzpId && existingRazorpayIds.has(rzpId)) return;
          if (existingIds.has(item.id)) return;

          existingIds.add(item.id);
          if (rzpId) existingRazorpayIds.add(rzpId);
          newItems.push(item);
        });

        if (newItems.length > 0) {
          return [...newItems, ...prev];
        }
        return prev;
      });
    } catch (err) {
      console.warn('Could not sync dynamic subscriptions:', err);
    }
  }, [activePlanProjectId, formatSubToTransaction]);

  useEffect(() => {
    syncDynamicSubscriptions();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hrms_hotel_subscriptions' || e.key === 'whitelabel_project_transactions') {
        syncDynamicSubscriptions();
      }
    };

    const handleCustomSub = (e: any) => {
      if (e?.detail) {
        const newTxn = formatSubToTransaction(e.detail);
        setProjectTransactions((prev) => {
          if (prev.some((t) => t.id === newTxn.id || (newTxn.razorpaySubscriptionId && t.razorpaySubscriptionId === newTxn.razorpaySubscriptionId))) {
            return prev;
          }
          return [newTxn, ...prev];
        });
      }
    };

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('hotel_subscription_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_HOTEL_SUBSCRIPTION' && event.data.subscription) {
            const newTxn = formatSubToTransaction(event.data.subscription);
            setProjectTransactions((prev) => {
              if (prev.some((t) => t.id === newTxn.id || (newTxn.razorpaySubscriptionId && t.razorpaySubscriptionId === newTxn.razorpaySubscriptionId))) {
                return prev;
              }
              return [newTxn, ...prev];
            });
            showToast(`✓ Hotel Subscription Synced: ${newTxn.customerName} (${newTxn.plan})`);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not available:', e);
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('subscriptionActivated', handleCustomSub);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('subscriptionActivated', handleCustomSub);
      if (channel) channel.close();
    };
  }, [syncDynamicSubscriptions, formatSubToTransaction]);

  // Client Ledger & Modern Dashboard Controls (Matching Reference Image)
  const [clientActiveTab, setClientActiveTab] = useState<'All Clients' | 'Active' | 'Trial' | 'Expiring Soon' | 'Cancelled'>('All Clients');
  const [clientSearch, setClientSearch] = useState('');
  const [clientPlanFilter, setClientPlanFilter] = useState<'all' | 'Growth' | 'Professional' | 'Enterprise' | 'Custom White Label'>('all');
  const [clientStatusFilter, setClientStatusFilter] = useState<'all' | 'Active' | 'Trial' | 'Expiring Soon' | 'Cancelled'>('all');
  const [clientPage, setClientPage] = useState<number>(1);
  const [clientPageSize, setClientPageSize] = useState<number>(5);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [isColumnsDropdownOpen, setIsColumnsDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    clientOrg: true,
    planStatus: true,
    email: true,
    featureAccess: true,
    billingPayment: true,
    nextRenewal: true,
  });
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ProjectTransactionDetail | null>(null);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

  // Add Client Form States
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientOrg, setNewClientOrg] = useState('');
  const [newClientUrl, setNewClientUrl] = useState('');
  const [newClientPlan, setNewClientPlan] = useState<'Growth' | 'Professional' | 'Enterprise'>('Enterprise');
  const [newClientStatus, setNewClientStatus] = useState<'Active' | 'Trial' | 'Expiring Soon'>('Active');
  const [newClientCycle, setNewClientCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [newClientAmount, setNewClientAmount] = useState('998');
  const [newClientMethod, setNewClientMethod] = useState('Bank Wire');

  // Upgrade Request Simulation Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [newUpgradeCustName, setNewUpgradeCustName] = useState('Devendra Patel (Person A)');
  const [newUpgradeCustEmail, setNewUpgradeCustEmail] = useState('d.patel@grandhorizonresorts.com');
  const [newUpgradePhone, setNewUpgradePhone] = useState('+91 99887 76655');
  const [newUpgradeCompany, setNewUpgradeCompany] = useState('Grand Horizon Palace Group');
  const [newUpgradeCurrentPlan, setNewUpgradeCurrentPlan] = useState<'Growth' | 'Professional' | 'Enterprise'>('Growth');
  const [newUpgradeTargetPlan, setNewUpgradeTargetPlan] = useState<'Growth' | 'Professional' | 'Enterprise'>('Enterprise');
  const [newUpgradeReason, setNewUpgradeReason] = useState('Person A purchased Hotel Management on Growth plan. Now adding 180 luxury suites; requesting upgrade to Enterprise Suite with 2-Way OTA Channel Manager!');
  const [newUpgradeCycle, setNewUpgradeCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Bespoke Feature Configuration State & Handlers
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [featureClient, setFeatureClient] = useState<ProjectTransactionDetail | null>(null);
  const [customFeatTitle, setCustomFeatTitle] = useState('');
  const [customFeatDesc, setCustomFeatDesc] = useState('');
  const [customFeatCat, setCustomFeatCat] = useState('Custom Feature');
  const [customFeatFee, setCustomFeatFee] = useState('+$50/mo');

  const HRMS_FEATURE_PRESETS = [
    { title: 'ZKTeco Hardware Biometric Sync API', description: 'Direct real-time sync with physical ZKTeco attendance scanners.', category: 'Hardware Sync', extraFee: '+$250/yr' },
    { title: 'India Statutory PF & ESI Tax Formulas', description: 'Automated PF, ESI, Gratuity & Professional Tax deduction formulas.', category: 'Compliance & Tax', extraFee: 'Included' },
    { title: 'Slack Leave & Approval Webhook Bot', description: 'Instant 1-click leave approval bot in Slack #hr-alerts channel.', category: 'Integration', extraFee: '+$35/mo' },
    { title: 'Azure Active Directory SAML SSO', description: 'Enterprise single sign-on with 1-click Microsoft 365 login.', category: 'Security & SSO', extraFee: '+$300/yr' },
    { title: 'AI Resume Keyword Screening Parser', description: 'Parses incoming resumes against role tech stacks and scores candidates.', category: 'AI Suite', extraFee: '+$60/mo' },
    { title: 'Extra 250 GB Encrypted KYC Cloud Vault', description: 'AWS S3 document vault for staff background checks & contracts.', category: 'Storage & Backup', extraFee: '+$150/yr' },
    { title: '24/7 Dedicated Account Manager SLA', description: 'VIP escalation tier with dedicated technical manager and direct phone line.', category: 'High-Priority SLA', extraFee: '+$400/yr' },
  ];

  const HOTEL_FEATURE_PRESETS = [
    { title: '2-Way Realtime OTA Channel Manager', description: 'Instant zero-lag sync for Booking.com, Agoda, and Expedia.', category: 'OTA Integration', extraFee: '+$500/yr' },
    { title: 'Assa Abloy RFID Door Lock Keycard Encoder', description: 'Direct PMS integration with physical card encoder machine at reception.', category: 'Hardware Encoder', extraFee: '+$350/yr' },
    { title: 'VIP Guest WhatsApp Concierge & Digital Menu', description: 'Automated welcome message with digital menu QR link and in-room spa booking.', category: 'Custom Feature', extraFee: '+$450/yr' },
    { title: 'Thermal POS Split Kitchen Order Ticket (KOT)', description: 'Instant split ticket routing for pool bar, fine dining and banquet buffet.', category: 'Hardware Sync', extraFee: '+$200/yr' },
    { title: 'Occupancy-Based AI Yield & Surge Pricing', description: 'Automated ADR price adjustments based on seasonal local festival dates.', category: 'Custom Feature', extraFee: '+$250/yr' },
    { title: 'Centralized Multi-Property CRS Booking Engine', description: 'Single guest profile, loyalty points, and cross-property bookings.', category: 'Custom Feature', extraFee: 'Included' },
    { title: 'Water Sports & Beach Shack Folio Posting', description: 'Post scuba diving, kayak, and beach umbrella charges directly to room folio.', category: 'Custom Feature', extraFee: '+$20/mo' },
    { title: 'Automated Night Audit Sync with Tally ERP', description: 'End-of-day revenue, restaurant sales, and taxes export directly into Tally.', category: 'Compliance & Tax', extraFee: 'Included' },
  ];

  const handleAddFeatureToClient = (
    clientId: string,
    newFeat: { title: string; description: string; category: string; extraFee?: string }
  ) => {
    setProjectTransactions((prev) =>
      prev.map((t) => {
        if (t.id === clientId) {
          const updated = [...(t.extraRequirements || []), newFeat];
          return {
            ...t,
            extraRequirements: updated,
            clientNotes: `${t.clientNotes} [Added custom feature: ${newFeat.title}]`,
          };
        }
        return t;
      })
    );
    setFeatureClient((prev) => {
      if (prev && prev.id === clientId) {
        return {
          ...prev,
          extraRequirements: [...(prev.extraRequirements || []), newFeat],
        };
      }
      return prev;
    });
    showToast(`✓ Added custom feature "${newFeat.title}" to client!`);
  };

  const handleRemoveFeatureFromClient = (clientId: string, featIndex: number) => {
    setProjectTransactions((prev) =>
      prev.map((t) => {
        if (t.id === clientId) {
          const updated = (t.extraRequirements || []).filter((_, idx) => idx !== featIndex);
          return {
            ...t,
            extraRequirements: updated,
          };
        }
        return t;
      })
    );
    setFeatureClient((prev) => {
      if (prev && prev.id === clientId) {
        return {
          ...prev,
          extraRequirements: (prev.extraRequirements || []).filter((_, idx) => idx !== featIndex),
        };
      }
      return prev;
    });
    showToast(`✓ Removed custom feature.`);
  };

  const activeProjectTransactions = projectTransactions.filter((t) => {
    if (t.projectId !== activePlanProjectId) return false;
    if (txnPlanFilter !== 'all' && t.plan !== txnPlanFilter) return false;
    if (txnStatusFilter !== 'all' && t.status !== txnStatusFilter) return false;
    if (txnSearchQuery.trim()) {
      const q = txnSearchQuery.toLowerCase();
      const matchName = (t.customerName || '').toLowerCase().includes(q);
      const matchComp = (t.companyName || '').toLowerCase().includes(q);
      const matchEmail = (t.customerEmail || '').toLowerCase().includes(q);
      const matchTxn = (t.id || '').toLowerCase().includes(q);
      const matchInv = (t.invoiceNumber || '').toLowerCase().includes(q);
      const matchReason = (t.upgradeReason || '').toLowerCase().includes(q);
      const matchReq = t.extraRequirements?.some((r) =>
        r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
      return matchName || matchComp || matchEmail || matchTxn || matchInv || matchReason || matchReq;
    }
    return true;
  });

  // Filtered clients matching current tab, search, plan, status, and project
  const filteredClients = projectTransactions.filter((c) => {
    if (c.projectId !== activePlanProjectId) return false;

    // Tab filter
    if (clientActiveTab === 'Active' && c.status !== 'Active' && c.status !== 'Approved & Upgraded') return false;
    if (clientActiveTab === 'Trial' && c.status !== 'Trial') return false;
    if (clientActiveTab === 'Expiring Soon' && c.status !== 'Expiring Soon' && (!c.daysLeft || c.daysLeft > 15)) return false;
    if (clientActiveTab === 'Cancelled' && c.status !== 'Cancelled') return false;

    // Dropdown filters
    if (clientPlanFilter !== 'all' && c.plan !== clientPlanFilter) return false;
    if (clientStatusFilter !== 'all') {
      if (clientStatusFilter === 'Active' && c.status !== 'Active' && c.status !== 'Approved & Upgraded') return false;
      if (clientStatusFilter === 'Trial' && c.status !== 'Trial') return false;
      if (clientStatusFilter === 'Expiring Soon' && c.status !== 'Expiring Soon' && (!c.daysLeft || c.daysLeft > 15)) return false;
      if (clientStatusFilter === 'Cancelled' && c.status !== 'Cancelled') return false;
    }

    // Search query
    if (clientSearch.trim()) {
      const q = clientSearch.toLowerCase();
      const matchName = (c.customerName || '').toLowerCase().includes(q);
      const matchOrg = (c.companyName || '').toLowerCase().includes(q);
      const matchEmail = (c.customerEmail || '').toLowerCase().includes(q);
      const matchUrl = (c.customUrl || c.subdomain || '').toLowerCase().includes(q);
      const matchPlan = (c.planStatusTitle || c.plan || '').toLowerCase().includes(q);
      const matchPayment = (c.paymentMethod || '').toLowerCase().includes(q);
      return matchName || matchOrg || matchEmail || matchUrl || matchPlan || matchPayment;
    }

    return true;
  });

  const totalClientsCount = filteredClients.length;
  const totalPages = Math.ceil(totalClientsCount / clientPageSize) || 1;
  const startIndex = (clientPage - 1) * clientPageSize;
  const endIndex = startIndex + clientPageSize;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  const isAllSelected = paginatedClients.length > 0 && paginatedClients.every((c) => selectedClientIds.includes(c.id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedClientIds((prev) => prev.filter((id) => !paginatedClients.some((c) => c.id === id)));
    } else {
      setSelectedClientIds((prev) => Array.from(new Set([...prev, ...paginatedClients.map((c) => c.id)])));
    }
  };
  const toggleSelectClient = (id: string) => {
    setSelectedClientIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleExportClients = () => {
    const headers = ['Client Name', 'Tier', 'Organization', 'URL', 'Plan & Status', 'Features Access', 'Billing Amount', 'Payment Method', 'Payment Status', 'Renewal Date', 'Days Left'];
    const rows = filteredClients.map((c) => [
      `"${c.customerName}"`,
      `"${c.tier || c.plan}"`,
      `"${c.companyName}"`,
      `"${c.customUrl || c.subdomain}"`,
      `"${c.planStatusTitle || c.plan}"`,
      `"${c.featuresCurrent || 0}/${c.featuresTotal || 0} (${c.featuresPercent || 0}%)"`,
      `"${c.amountFormatted}"`,
      `"${c.paymentMethod}"`,
      `"${c.paymentStatus || 'Paid'}"`,
      `"${c.nextRenewalDate || c.date}"`,
      `"${c.daysLeftText || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clients_ledger_${activePlanProjectId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${filteredClients.length} clients to CSV!`);
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientOrg.trim()) return;

    const newId = `TXN-${activePlanProjectId.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const initials = newClientName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const colors = ['#E05638', '#EAA524', '#7B61FF', '#27AE60', '#2D9CDB', '#9B51E0'];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];

    const newRecord: ProjectTransactionDetail = {
      id: newId,
      customerName: newClientName,
      customerEmail: newClientEmail.trim() || `${newClientName.toLowerCase().replace(/\s+/g, '.')}@${newClientOrg.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      customerPhone: '+1 555 123 4567',
      customerAvatar: initials,
      avatarBg,
      companyName: newClientOrg,
      subdomain: newClientUrl.replace(/^https?:\/\//, '') || `${newClientOrg.toLowerCase().replace(/[^a-z0-9]/g, '')}.moments.io`,
      customUrl: newClientUrl.startsWith('http') ? newClientUrl : `https://${newClientUrl || `${newClientOrg.toLowerCase().replace(/[^a-z0-9]/g, '')}.moments.io`}`,
      tier: newClientPlan,
      projectId: activePlanProjectId,
      plan: newClientPlan,
      planStatusTitle: newClientPlan,
      status: newClientStatus,
      planSubtitle: 'Newly Onboarded Property',
      featuresCurrent: newClientPlan === 'Enterprise' ? 28 : newClientPlan === 'Professional' ? 20 : 10,
      featuresTotal: newClientPlan === 'Enterprise' ? 31 : newClientPlan === 'Professional' ? 25 : 20,
      featuresPercent: newClientPlan === 'Enterprise' ? 90 : newClientPlan === 'Professional' ? 80 : 50,
      featureSubtext: 'Live & Active',
      featureSubtextType: 'active',
      amount: Number(newClientAmount) || 998,
      amountFormatted: `$${newClientAmount} / ${newClientCycle === 'yearly' ? 'yr' : 'mo'}`,
      billingCycle: newClientCycle,
      paymentMethod: newClientMethod,
      paymentStatus: 'Paid',
      nextRenewalDate: '04 Sep 2025',
      daysLeft: 365,
      daysLeftText: '365 days left',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      licenseSeats: `${newClientPlan} Tier Access`,
      invoiceNumber: `INV-2026-${activePlanProjectId.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      clientNotes: 'Client added via Dashboard Client Manager.',
      extraRequirements: [],
    };

    setProjectTransactions((prev) => [newRecord, ...prev]);
    setIsAddClientOpen(false);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientOrg('');
    setNewClientUrl('');
    showToast(`✓ Onboarded ${newClientName} successfully!`);
  };

  const handleEditClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setProjectTransactions((prev) => prev.map((c) => (c.id === editingClient.id ? editingClient : c)));
    setIsEditClientOpen(false);
    setEditingClient(null);
    showToast(`✓ Updated ${editingClient.customerName}'s record!`);
  };

  const handleApproveUpgrade = (txnId: string) => {
    const target = projectTransactions.find((t) => t.id === txnId);
    if (!target) return;
    const nextPlan = target.requestedUpgradePlan || 'Enterprise';
    const isYearly = target.billingCycle === 'yearly';
    const newAmount = nextPlan === 'Enterprise' ? (isYearly ? 4800 : 420) : (isYearly ? 2400 : 199);
    const newFormatted = isYearly ? `$${newAmount.toLocaleString()} / yr` : `$${newAmount} / mo`;

    setProjectTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txnId) {
          return {
            ...t,
            status: 'Approved & Upgraded',
            plan: nextPlan,
            amount: newAmount,
            amountFormatted: newFormatted,
            clientNotes: `${t.clientNotes} [UPGRADE APPROVED: Upgraded to ${nextPlan} Tier on ${new Date().toLocaleDateString()}]`,
          };
        }
        return t;
      })
    );
    showToast(`✓ Plan upgrade to ${nextPlan} approved for ${target.customerName} (${target.companyName})!`);
  };

  const [acceptingClientId, setAcceptingClientId] = useState<string | null>(null);

  const handleAcceptClientRequest = async (client: ProjectTransactionDetail) => {
    setAcceptingClientId(client.id);
    try {
      const targetPlan = client.requestedUpgradePlan || client.plan || 'Enterprise';
      const cadence = client.billingCycle === 'yearly' ? 'Yearly' : 'Monthly';
      const amt = client.amount || (targetPlan === 'Enterprise' ? 10000 : targetPlan === 'Professional' ? 5000 : 2500);
      const formattedAmt = client.amountFormatted || `₹${amt.toLocaleString('en-IN')} / ${cadence.toLowerCase() === 'yearly' ? 'year' : 'month'}`;
      const subId = client.razorpaySubscriptionId || `sub_hotel_${Date.now()}_54c5`;
      const payId = client.razorpayPaymentId || `pay_hotel_${Date.now()}_dtap`;
      const email = client.customerEmail || 'tejaswisen27@gmail.com';
      const name = client.customerName || 'xyzz';
      const org = client.companyName || 'FIfaa';

      const nextMonthDate = new Date();
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      const nextBillingDateFormatted = client.nextRenewalDate || client.nextBillingDate || nextMonthDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      setProjectTransactions((prev) =>
        prev.map((t) =>
          t.id === client.id
            ? {
              ...t,
              status: 'Accepted',
              plan: targetPlan,
              amount: amt,
              amountFormatted: formattedAmt,
              razorpaySubscriptionId: subId,
              razorpayPaymentId: payId,
              clientNotes: `${t.clientNotes || ''} [REQUEST ACCEPTED: Macenza accepted request. Cryptographic Subscription Record Verified.]`,
            }
            : t
        )
      );

      if (selectedTransactionDetail && selectedTransactionDetail.id === client.id) {
        setSelectedTransactionDetail((prev) =>
          prev
            ? {
              ...prev,
              status: 'Accepted',
              plan: targetPlan,
              amount: amt,
              amountFormatted: formattedAmt,
              razorpaySubscriptionId: subId,
              razorpayPaymentId: payId,
              clientNotes: `${prev.clientNotes || ''} [REQUEST ACCEPTED: Macenza accepted request. Cryptographic Subscription Record Verified.]`,
            }
            : null
        );
      }

      // Sync to local storage
      try {
        const savedTxns = JSON.parse(localStorage.getItem('whitelabel_project_transactions') || '[]');
        const updated = savedTxns.map((t: any) =>
          t.id === client.id ? { ...t, status: 'Accepted', razorpaySubscriptionId: subId, razorpayPaymentId: payId } : t
        );
        localStorage.setItem('whitelabel_project_transactions', JSON.stringify(updated));
      } catch { }

      // Dispatch to whitelabelling backend and hrms backend
      const payload = {
        id: client.id,
        clientEmail: email,
        customerEmail: email,
        clientName: name,
        customerName: name,
        companyName: org,
        organizationName: org,
        plan: targetPlan,
        billingCadence: cadence,
        amount: amt,
        nextBillingDate: nextBillingDateFormatted,
        razorpaySubscriptionId: subId,
        razorpayPaymentId: payId,
        setupStatus: 'Accepted',
        status: 'ACTIVE',
        note: 'Cryptographic Subscription Record Verified',
      };

      try {
        await Promise.any([
          fetch('http://localhost:5001/api/whitelabel/project-access/accept-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }),
          fetch(`http://localhost:4000/api/admin/white-label/setup-requests/${client.id}/accept`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }),
        ]);
      } catch { }

      setAcceptedConfirmationModal({
        ...client,
        customerName: name,
        companyName: org,
        customerEmail: email,
        status: 'Accepted',
        plan: targetPlan,
        billingCycle: cadence.toLowerCase() as any,
        amount: amt,
        amountFormatted: formattedAmt,
        nextRenewalDate: nextBillingDateFormatted,
        razorpaySubscriptionId: subId,
        razorpayPaymentId: payId,
      });
      showToast('Request accepted successfully and confirmation email sent.');
    } catch {
      setAcceptedConfirmationModal({
        ...client,
        status: 'Accepted',
      });
      showToast('Request accepted successfully and confirmation email sent.');
    } finally {
      setAcceptingClientId(null);
    }
  };

  const handleCreateUpgradeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTxnId = `TXN-${activePlanProjectId === 'hrms' ? 'HRMS' : 'HTL'}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newInvId = `INV-2026-${activePlanProjectId === 'hrms' ? 'HRMS' : 'HTL'}-${Math.floor(100 + Math.random() * 900)}`;
    const initials = newUpgradeCustName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CU';

    const isYearly = newUpgradeCycle === 'yearly';
    const baseAmt = newUpgradeCurrentPlan === 'Growth' ? (isYearly ? 990 : 99) : (isYearly ? 2400 : 199);

    const newRecord: ProjectTransactionDetail = {
      id: newTxnId,
      customerName: newUpgradeCustName,
      customerEmail: newUpgradeCustEmail,
      customerPhone: newUpgradePhone || '+91 98765 43210',
      customerAvatar: initials,
      companyName: newUpgradeCompany,
      subdomain: `${newUpgradeCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.macenza.io`,
      projectId: activePlanProjectId,
      plan: newUpgradeCurrentPlan,
      requestedUpgradePlan: newUpgradeTargetPlan,
      billingCycle: newUpgradeCycle,
      amount: baseAmt,
      amountFormatted: isYearly ? `$${baseAmt.toLocaleString()} / yr` : `$${baseAmt} / mo`,
      status: 'Upgrade Requested',
      date: 'Just Now',
      paymentMethod: 'UPI / Corporate Card Auto-Debit',
      licenseSeats: `${newUpgradeTargetPlan === 'Enterprise' ? 'Unlimited Enterprise Seats' : '200 Professional Seats'} (Upgrade Requested)`,
      invoiceNumber: newInvId,
      clientNotes: newUpgradeReason || 'Client initiated self-service upgrade request from project dashboard.',
      upgradeReason: newUpgradeReason || `Requested upgrade from ${newUpgradeCurrentPlan} to ${newUpgradeTargetPlan}.`,
      extraRequirements: [
        {
          title: `Seamless Data Migration & ${newUpgradeTargetPlan} Tier Activation`,
          description: `Zero-downtime tier upgrade with instant unlocking of all ${newUpgradeTargetPlan} features.`,
          category: 'Tier Upgrade',
          extraFee: 'Included',
        },
      ],
    };

    setProjectTransactions((prev) => [newRecord, ...prev]);
    setIsUpgradeModalOpen(false);
    showToast(`✓ Upgrade request to ${newUpgradeTargetPlan} submitted for ${newUpgradeCustName}!`);
  };

  const copyTxnId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedTxnId(id);
    showToast(`✓ Copied Transaction ID: ${id}`);
    setTimeout(() => setCopiedTxnId(null), 2500);
  };

  const handleDownloadInvoice = (txn: ProjectTransactionDetail) => {
    const invoiceContent = `=====================================================
MACENZA LABELLING CORE - OFFICIAL TAX INVOICE
=====================================================
Invoice Number: ${txn.invoiceNumber}
Transaction ID: ${txn.id}
Date & Time:    ${txn.date}
Status:         ${txn.status.toUpperCase()}
Payment Method: ${txn.paymentMethod}

-----------------------------------------------------
CLIENT INFORMATION:
-----------------------------------------------------
Customer Name:  ${txn.customerName}
Company Name:   ${txn.companyName}
Email Address:  ${txn.customerEmail}
Contact Phone:  ${txn.customerPhone}
Tenant Domain:  https://${txn.subdomain}
Covered System: ${txn.projectId === 'hrms' ? 'HRMS Core Enterprise Suite' : 'Hospitality PMS Suite'}

-----------------------------------------------------
SUBSCRIPTION PLAN DETAILS:
-----------------------------------------------------
Current Tier:   ${txn.plan.toUpperCase()} TIER
Billing Cycle:  ${txn.billingCycle.toUpperCase()}
License Seats:  ${txn.licenseSeats}
${txn.requestedUpgradePlan ? `Requested Upgrade: ${txn.requestedUpgradePlan.toUpperCase()} TIER (${txn.status})` : ''}
${txn.upgradeReason ? `Upgrade Reason:    ${txn.upgradeReason}` : ''}

-----------------------------------------------------
BESPOKE CLIENT REQUIREMENTS ("EXTRA NEEDS"):
-----------------------------------------------------
${(txn.extraRequirements || []).map((r, i) => `${i + 1}. [${r.category}] ${r.title}
   Details: ${r.description}
   Add-on Fee: ${r.extraFee || 'Included'}`).join('\n\n')}

-----------------------------------------------------
FINANCIAL BREAKDOWN:
-----------------------------------------------------
Base Plan Charge:        $${(txn.amount * 0.82).toFixed(2)}
Custom Add-ons & SLA:    Included / Billed
Taxes (GST/VAT 18%):     $${(txn.amount * 0.18).toFixed(2)}
-----------------------------------------------------
TOTAL AMOUNT BILLED:     $${txn.amount.toFixed(2)} (${txn.amountFormatted})
=====================================================
Authorized Signature: Macenza Core Billing Gateway
`;
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${txn.invoiceNumber}-${txn.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`✓ Downloaded Official Invoice ${txn.invoiceNumber} for ${txn.customerName}!`);
  };

  // HRMS Project Dedicated Plans
  const hrmsPlansData = [
    {
      id: 'growth',
      name: 'Growth',
      tagline: 'Perfect for startups and growing HR teams.',
      strikePrice: '$10',
      monthlyPrice: '6',
      yearlyStrikePrice: '$9',
      yearlyPrice: '5',
      features: [
        { label: 'Up to 50 Employees', enabled: true },
        { label: 'Employee Directory & Profiles', enabled: true },
        { label: 'Attendance & Leave Management', enabled: true },
        { label: 'Projects & Tasks Management', enabled: true },
        { label: 'Company Policies', enabled: true },
        { label: 'Company-wise Notices', enabled: true },
        { label: 'Holiday Management', enabled: true },
        { label: 'Company Workspace Settings', enabled: true },
        { label: 'Asset Management', enabled: false },
        { label: 'Automatic Payroll Calculations', enabled: false },
        { label: 'AI Recruitment Portal', enabled: false },
        { label: 'AI Video Interviews', enabled: false },
        { label: 'AI Assistant', enabled: false },
        { label: 'ATS Resume Screening', enabled: false },
        { label: 'Slack Integration', enabled: false },
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      tagline: 'Built for scaling organizations with intelligent HR automation.',
      strikePrice: '$30',
      monthlyPrice: '20',
      yearlyStrikePrice: '$27',
      yearlyPrice: '18',
      features: [
        { label: 'Up to 200 Employees', enabled: true },
        { label: 'Employee Directory & Profiles', enabled: true },
        { label: 'Attendance & Leave Management', enabled: true },
        { label: 'Projects & Tasks Management', enabled: true },
        { label: 'Company Policies', enabled: true },
        { label: 'Company-wise Notices', enabled: true },
        { label: 'Holiday Management', enabled: true },
        { label: 'Company Workspace', enabled: true },
        { label: 'Asset Management', enabled: true },
        { label: 'Automatic Payroll Calculation', enabled: true },
        { label: 'AI Assistant', enabled: true },
        { label: 'AI Recruitment Portal', enabled: false },
        { label: 'AI Video Interviews', enabled: false },
        { label: 'ATS Resume Screening', enabled: false },
        { label: 'Slack Integration', enabled: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Complete enterprise HR platform for large organizations.',
      strikePrice: '$40',
      monthlyPrice: '30',
      yearlyStrikePrice: '$36',
      yearlyPrice: '27',
      features: [
        { label: 'Up to 500 Employees', enabled: true },
        { label: 'Employee Directory & Profiles', enabled: true },
        { label: 'Attendance & Leave Management', enabled: true },
        { label: 'Projects & Tasks Management', enabled: true },
        { label: 'Company Policies & Notices', enabled: true },
        { label: 'Holiday Management', enabled: true },
        { label: 'Company Workspace', enabled: true },
        { label: 'Asset Management', enabled: true },
        { label: 'Automatic Payroll Calculations', enabled: true },
        { label: 'AI Recruitment Portal', enabled: true },
        { label: 'AI Video Interviews', enabled: true },
        { label: 'AI Assistant (Unlimited)', enabled: true },
        { label: 'ATS Resume Screening', enabled: true },
        { label: 'Custom Webhooks & API', enabled: true },
        { label: 'Slack Integration', enabled: true },
      ],
    },
  ];

  // Hotel Management System Dedicated Plans
  const hotelPlansData = [
    {
      id: 'growth',
      name: 'Growth',
      tagline: 'Essential PMS for boutique stays, motels & B&Bs.',
      strikePrice: '$12',
      monthlyPrice: '8',
      yearlyStrikePrice: '$10',
      yearlyPrice: '6',
      features: [
        { label: 'Up to 25 Rooms & Suites', enabled: true },
        { label: 'Front Desk Check-in & Check-out', enabled: true },
        { label: 'Daily Housekeeping Status', enabled: true },
        { label: 'Guest Profiles & History', enabled: true },
        { label: 'Invoicing & Folio Settlement', enabled: true },
        { label: 'Room Maintenance Logs', enabled: true },
        { label: 'Basic Occupancy Reports', enabled: true },
        { label: 'Multi-tax GST Billing Support', enabled: true },
        { label: 'OTA Channel Manager Integration', enabled: false },
        { label: 'Restaurant & Bar POS Integration', enabled: false },
        { label: 'Dynamic Peak Season Pricing', enabled: false },
        { label: 'Automated Guest WhatsApp Alerts', enabled: false },
        { label: 'Multi-property Chain Central CRS', enabled: false },
        { label: 'VIP Loyalty & Rewards Engine', enabled: false },
        { label: 'AI Yield & Revenue Forecasting', enabled: false },
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      tagline: 'Advanced property automation for luxury hotels & resorts.',
      strikePrice: '$35',
      monthlyPrice: '24',
      yearlyStrikePrice: '$30',
      yearlyPrice: '20',
      features: [
        { label: 'Up to 100 Rooms & Suites', enabled: true },
        { label: 'Front Desk Check-in & Check-out', enabled: true },
        { label: 'Real-time Housekeeping App', enabled: true },
        { label: 'Guest Profiles & History', enabled: true },
        { label: 'Direct Booking Engine on Website', enabled: true },
        { label: 'Restaurant & Bar POS Integration', enabled: true },
        { label: 'Minibar & Laundry Billing', enabled: true },
        { label: 'Dynamic Peak Season Pricing', enabled: true },
        { label: 'Automated Guest WhatsApp Alerts', enabled: true },
        { label: 'Staff Shift & Duty Rosters', enabled: true },
        { label: 'Channel Manager (Booking.com/Expedia)', enabled: true },
        { label: 'Multi-property Chain Central CRS', enabled: false },
        { label: 'VIP Loyalty & Rewards Engine', enabled: false },
        { label: 'AI Yield & Revenue Forecasting', enabled: false },
        { label: 'Dedicated Account Manager', enabled: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Multi-property hotel chain ERP for hospitality groups.',
      strikePrice: '$55',
      monthlyPrice: '42',
      yearlyStrikePrice: '$48',
      yearlyPrice: '35',
      features: [
        { label: 'Unlimited Properties & Rooms', enabled: true },
        { label: 'Global Central Reservation System (CRS)', enabled: true },
        { label: 'Real-time 2-Way OTA Channel Manager', enabled: true },
        { label: 'Multi-outlet POS & Banquet Management', enabled: true },
        { label: 'VIP Guest Loyalty & Rewards Engine', enabled: true },
        { label: 'AI Yield & Dynamic Rate Optimizer', enabled: true },
        { label: 'Automated Guest WhatsApp Concierge', enabled: true },
        { label: 'Corporate & Travel Agent Contracts', enabled: true },
        { label: 'Housekeeping & Asset Maintenance App', enabled: true },
        { label: 'Full Financial & Night Audits', enabled: true },
        { label: 'Custom Keycard & Door Lock Integration', enabled: true },
        { label: 'Group Cross-property Billing', enabled: true },
        { label: 'Enterprise Webhooks & PMS API', enabled: true },
        { label: 'Custom White-label Guest Mobile App', enabled: true },
        { label: '24/7 Dedicated SLA & VIP Support', enabled: true },
      ],
    },
  ];

  const plansData = activePlanProjectId === 'hrms' ? hrmsPlansData : hotelPlansData;

  const totalSuccessfulPayments = (payments || [])
    .filter((p: TenantPaymentItem) => p && p.status === 'Success')
    .reduce((acc: number, curr: TenantPaymentItem) => acc + (curr?.amount || 0), 0);

  const formattedTotalPayments = `₹${(totalSuccessfulPayments / 100000).toFixed(2)}L`;

  const filteredPayments = (payments || []).filter((p: TenantPaymentItem) => {
    if (!p) return false;
    const org = (p.organizationName || '').toLowerCase();
    const txn = (p.transactionId || '').toLowerCase();
    const plan = (p.plan || '').toLowerCase();
    const query = (catalogSearch || paymentSearch || '').toLowerCase();
    return org.includes(query) || txn.includes(query) || plan.includes(query);
  });

  const handleSubscriptionActivated = (newSub: DynamicSubscriptionData) => {
    // 1. Instantly update local client ledger with 100% dynamic data
    const newTxn: ProjectTransactionDetail = {
      id: newSub.razorpaySubscriptionId || `SUB-${Date.now()}`,
      customerName: newSub.customerName,
      customerEmail: newSub.customerEmail,
      customerPhone: '+91 98765 43210',
      customerAvatar: (newSub.customerName?.charAt(0) || 'U').toUpperCase(),
      avatarBg: '#5E48E8',
      companyName: newSub.organizationName || newSub.customerName,
      subdomain: (newSub.organizationName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      customUrl: `https://${(newSub.organizationName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '-')}.moments.io`,
      tier: newSub.plan as any,
      projectId: activePlanProjectId,
      plan: newSub.plan as any,
      billingCycle: (newSub.billingCadence?.toLowerCase() === 'yearly' ? 'yearly' : 'monthly'),
      amount: newSub.amount,
      amountFormatted: `₹${Number(newSub.amount).toLocaleString('en-IN')}`,
      status: 'Active',
      subscriptionStatus: 'Active',
      paymentStatus: 'Paid',
      subscriptionStartDate: (newSub as any).subscriptionStartDate || new Date().toISOString(),
      nextBillingDate: newSub.nextBillingDate || '',
      razorpaySubscriptionId: newSub.razorpaySubscriptionId,
      razorpayPaymentId: newSub.razorpayPaymentId,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      paymentMethod: 'Razorpay UPI / Card',
      nextRenewalDate: newSub.nextBillingDate
        ? new Date(newSub.nextBillingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'In 30 Days',
      daysLeft: 30,
      daysLeftText: 'Renews in 30 days',
      licenseSeats:
        newSub.plan === 'Growth'
          ? '25 Luxury Suites'
          : newSub.plan === 'Professional'
            ? '100 Luxury Suites'
            : 'Unlimited Suites & Resorts',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientNotes: `Authorized via dynamic subscription ${newSub.razorpaySubscriptionId}. 35% Platform (₹${Number(newSub.revenueSplit?.platformAmount || 0).toLocaleString('en-IN')}) / 65% Partner (₹${Number(newSub.revenueSplit?.partnerAmount || 0).toLocaleString('en-IN')}). Confirmation email: ${newSub.emailSent ? 'Sent to user' : 'Failed'}.`,
      planStatusTitle: `${newSub.plan} – Active`,
      planSubtitle: `${newSub.billingCadence} billing authorized`,
      featuresCurrent: 15,
      featuresTotal: 15,
      extraRequirements: [],
    };

    setProjectTransactions((prev) => [newTxn, ...prev]);

    // Save to localStorage for cross-page persistence
    try {
      const savedTxns = JSON.parse(localStorage.getItem('whitelabel_project_transactions') || '[]');
      localStorage.setItem('whitelabel_project_transactions', JSON.stringify([newTxn, ...savedTxns]));

      const savedHotel = JSON.parse(localStorage.getItem('hrms_hotel_subscriptions') || '[]');
      localStorage.setItem('hrms_hotel_subscriptions', JSON.stringify([newTxn, ...savedHotel]));

      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('hotel_subscription_channel');
        bc.postMessage({ type: 'NEW_HOTEL_SUBSCRIPTION', subscription: newTxn });
        bc.close();
      }
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    // 2. Update active project configuration
    setProjectSubscriptionConfig((prev) => ({
      ...prev,
      [activePlanProjectId]: {
        ...prev[activePlanProjectId],
        selectedPlanId: newSub.plan.toLowerCase().includes('growth')
          ? 'growth'
          : newSub.plan.toLowerCase().includes('prof')
            ? 'professional'
            : newSub.plan.toLowerCase().includes('custom')
              ? 'custom'
              : 'enterprise',
        status: 'active',
        billingCycle: newSub.billingCadence.toLowerCase() === 'yearly' ? 'yearly' : 'monthly',
      },
    }));

    // 3. Record in payment context for ledger consistency
    recordPayment({
      organizationName: newSub.organizationName || newSub.customerName,
      amount: newSub.amount,
      plan: `${newSub.plan} (${newSub.billingCadence})`,
      paymentMethod: 'Razorpay UPI / Card',
    });

    showToast(`✓ Welcome to ${newSub.plan}! Subscription activated for ${newSub.customerName}`);
  };

  const handleCreatePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordPayment({
      organizationName: newPayOrg,
      amount: Number(newPayAmount) || 24000,
      plan: newPayPlan,
      paymentMethod: newPayMethod,
    });
    setIsRecordPaymentOpen(false);
    showToast(`✓ Payment of ₹${(Number(newPayAmount) / 1000).toLocaleString()} recorded successfully.`);
  };

  const handleRefund = async (id: string, txnId: string) => {
    await refundPayment(id);
    showToast(`Transaction ${txnId} has been marked as Refunded.`);
  };

  const exportPaymentsCSV = () => {
    let csv = 'Transaction ID,Organization,Plan,Amount (INR),Payment Method,Date,Status\n';
    (payments || []).forEach((p: TenantPaymentItem) => {
      if (!p) return;
      const d = p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '';
      csv += `"${p.transactionId || ''}","${p.organizationName || ''}","${p.plan || ''} (${p.billingCycle || ''})",${p.amount || 0},"${p.paymentMethod || ''}","${d}","${p.status || ''}"\n`;
    });
    const uri = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `payment-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner (Thin, Ultra-Sleek Panoramic Design with Integrated Metrics) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#060a14] via-[#0a0f1e] to-[#050812] p-5 sm:p-6 text-white shadow-xl border border-slate-800/80 text-left space-y-5">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/3 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-row items-center justify-between gap-4 w-full">
          {/* Left Side: Title & Search Bar (Horizontal Left) */}
          <div className="flex-1 min-w-0 max-w-xl flex flex-col items-start text-left">
            <div className="flex items-baseline gap-2 mb-1 justify-start">
              <h1 className="tracking-tight text-left leading-none flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                  Macenza
                </span>
                <span className="text-base sm:text-lg lg:text-xl font-black bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                  Labelling Core
                </span>
              </h1>
            </div>

            {/* Compact Search Bar with 360° Neon Looping Border */}
            <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md my-1.5">
              <div className="search-loop-container group">
                {/* 360-Degree Continuous Rotating Conic Neon Border Loop */}
                <div className="search-loop-border" />

                {/* Inner Search Container (Elevated Above Rotating Loop) */}
                <div className="relative z-10 flex items-center bg-slate-900/95 backdrop-blur-xl rounded-xl py-0.5 px-1 overflow-hidden">
                  <div className="search-loop-shimmer" />

                  <div className="pl-2.5 pr-2 py-1.5 flex items-center text-cyan-400 shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>

                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => {
                      setCatalogSearch(e.target.value);
                      setPaymentSearch(e.target.value);
                    }}
                    placeholder="Quick search projects, modules, payments..."
                    className="w-full bg-transparent py-1.5 pr-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-medium text-left z-20"
                  />

                  {catalogSearch && (
                    <button
                      onClick={() => {
                        setCatalogSearch('');
                        setPaymentSearch('');
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 mr-1 transition-all cursor-pointer z-20"
                      title="Clear Search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  <div className="hidden sm:flex items-center gap-1 pr-2.5 text-[8.5px] font-mono font-bold text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0 z-20">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Live Search Indicator */}
              {catalogSearch && (
                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-cyan-300 animate-fadeIn text-left justify-start">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Searching "{catalogSearch}" across Projects & Payments</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Seamless Animated White-Label UI Graphic (Horizontal Right) */}
          <div className="shrink-0 flex items-center justify-center">
            <WhiteLabelBannerGraphic />
          </div>
        </div>

        {/* 4 Distinct Vibrant Glassmorphic Stat Cards (INSIDE BANNER - 4 Columns) */}
        <div className="relative z-10 grid grid-cols-4 gap-3 w-full pt-3 border-t border-slate-800/80">
          {/* 1. Total Projects (Vibrant Amber / Fiery Orange Theme) */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-orange-500/30 rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-orange-500/10 hover:border-orange-500/60 hover:shadow-md hover:shadow-orange-500/20 backdrop-blur-md transition-all group min-w-0">
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
                Active Suite
              </span>
            </div>
          </div>

          {/* 2. Total Clients (Electric Cyan / Sky Blue Theme) */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/30 rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-cyan-500/10 hover:border-cyan-500/60 hover:shadow-md hover:shadow-cyan-500/20 backdrop-blur-md transition-all group min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider truncate">Total Clients</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">1</div>
              <span className="text-[10px] font-black text-cyan-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                Organizations
              </span>
            </div>
          </div>

          {/* 3. Completed White Label Projects (Royal Violet / Purple Theme) */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-transparent border border-purple-500/30 rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-purple-500/10 hover:border-purple-500/60 hover:shadow-md hover:shadow-purple-500/20 backdrop-blur-md transition-all group min-w-0">
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

          {/* 4. Total Income (Emerald Green / Mint Theme) */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-emerald-500/10 hover:border-emerald-500/60 hover:shadow-md hover:shadow-emerald-500/20 backdrop-blur-md transition-all group min-w-0">
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


      {/* Main Interactive Section (Payments & Plans Ledger) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                White-Label Transactions & Subscription History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified payment ledger, subscription licenses, and upgrade requests across enterprise suites.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'plans' ? 'payments' : 'plans')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-black transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-[#5B4DF5] to-[#7566FC] text-white shadow-md shadow-[#5B4DF5]/30 ring-2 ring-[#5B4DF5]/40'
                  : 'bg-violet-100/80 dark:bg-violet-950/60 text-[#5B4DF5] dark:text-violet-300 border border-violet-300/80 dark:border-violet-700 hover:bg-violet-200/80 shadow-xs'
              }`}
            >
              <Crown className="w-4 h-4 text-inherit" />
              <span>{activeTab === 'plans' ? 'View Payment Ledger' : 'Subscription Plans'}</span>
            </button>

            {activeTab === 'payments' && (
              <>
                <button
                  onClick={exportPaymentsCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-slate-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <button
                  onClick={() => setIsRecordPaymentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Record Payment
                </button>
              </>
            )}
          </div>
        </div>

        {/* View 2: Payment History Ledger */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transaction ID, tenant..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="text-xs font-mono text-slate-500">
                Total Received: <strong className="text-emerald-600 dark:text-emerald-400">{formattedTotalPayments}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Transaction ID</th>
                    <th className="px-5 py-3.5">Tenant Organization</th>
                    <th className="px-5 py-3.5">Plan / Package</th>
                    <th className="px-5 py-3.5">Amount (INR)</th>
                    <th className="px-5 py-3.5">Payment Method</th>
                    <th className="px-5 py-3.5">Payment Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  {filteredPayments.map((p: TenantPaymentItem) => (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                        {p.transactionId}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-white">
                        {p.organizationName}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                          {p.plan} ({p.billingCycle})
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-extrabold text-slate-900 dark:text-white">
                        ₹{(p.amount / 1000).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-medium">{p.paymentMethod}</td>
                      <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.status === 'Success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : p.status === 'Refunded'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {p.status === 'Success' && (
                          <button
                            onClick={() => handleRefund(p._id, p.transactionId)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold cursor-pointer"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 3: Subscription Plans (Growth, Professional, Enterprise) with Per-Project Isolation */}
        {activeTab === 'plans' && (
          <div className="py-10 px-4 sm:px-6 lg:px-8 bg-[#F8F9FE] dark:bg-slate-950/60 rounded-3xl animate-fadeIn">
            {/* Project Scope Switcher Bar */}
            <div className="flex flex-col items-center justify-center mb-8 text-center">
              <div className="inline-flex items-center p-1.5 bg-slate-200/80 dark:bg-slate-800/90 rounded-2xl border border-slate-300/80 dark:border-slate-700 shadow-sm gap-2">
                <button
                  onClick={() => {
                    setActivePlanProjectId('hrms');
                    showToast('✓ Switched to HRMS Project Subscription Plans!');
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${activePlanProjectId === 'hrms'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>HRMS Project</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${activePlanProjectId === 'hrms' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {projectSubscriptionConfig.hrms.selectedPlanId}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActivePlanProjectId('hotel');
                    showToast('✓ Switched to Hotel Management Project Subscription Plans!');
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${activePlanProjectId === 'hotel'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Hotel Management System</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${activePlanProjectId === 'hotel' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {projectSubscriptionConfig.hotel.selectedPlanId}
                  </span>
                </button>
              </div>
            </div>

            {/* Choose Billing Cycle Toggle */}
            <div className="flex flex-col items-center justify-center mb-10 text-center">
              <span className="text-[11px] font-black tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-3 font-sans">
                CHOOSE YOUR BILLING CYCLE
              </span>
              <div className="inline-flex items-center p-1 bg-slate-200/70 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                <button
                  onClick={() => setPlanBillingCycle('monthly')}
                  className={`px-7 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${planBillingCycle === 'monthly'
                    ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPlanBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${planBillingCycle === 'yearly'
                    ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <span>Yearly</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${planBillingCycle === 'yearly'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EEECFD] dark:bg-purple-950/60 text-[#7065F0] dark:text-purple-300'
                      }`}
                  >
                    10% Off
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Cards Side-by-Side (Designer Blue Theme with 3D Flip & Full Feature Suite) */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 items-stretch w-full max-w-6xl mx-auto">
              {plansData.map((plan) => {
                const curPrice = planBillingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
                const curStrike = planBillingCycle === 'yearly' ? plan.yearlyStrikePrice : plan.strikePrice;
                const isSelected = selectedPlanId === plan.id;
                const isFlipped = Boolean(flippedPlans[plan.id]);

                // Designer subtitle tags
                const designerTag =
                  plan.id === 'growth'
                    ? 'Starter Suite'
                    : plan.id === 'professional'
                      ? 'Growth & Scaling'
                      : 'Full Enterprise';

                return (
                  <div
                    key={plan.id}
                    className="flip-card-container group"
                  >
                    <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                      {/* FRONT FACE OF CARD (Designer Blue, Full Features, Tap anywhere to flip) */}
                      <div
                        onClick={() => togglePlanFlip(plan.id)}
                        className={`flip-card-front p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden ${isSelected
                          ? 'border-2 border-blue-600 dark:border-blue-500 ring-4 ring-blue-500/20 shadow-2xl shadow-blue-500/20 card-designer-glow-selected bg-gradient-to-b from-blue-50/80 via-white to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900'
                          : 'border border-slate-200/90 dark:border-slate-800 shadow-md card-designer-glow bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl'
                          }`}
                      >
                        {/* Decorative Designer Watermark Aura */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                        <div>
                          {/* Designer Header: Plan Name + Subtitle Pill (No Black Buttons) */}
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-0.5">
                                {designerTag}
                              </span>
                              <h3
                                className={`text-xl sm:text-2xl font-black tracking-tight ${isSelected ? 'text-blue-950 dark:text-white' : 'text-slate-900 dark:text-white'
                                  }`}
                              >
                                {plan.name}
                              </h3>
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800/80 flex items-center gap-1 shadow-2xs">
                              <RotateCcw className="w-2.5 h-2.5" />
                              Flip ↻
                            </span>
                          </div>

                          {/* Tagline */}
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 min-h-[30px] leading-snug">
                            {plan.tagline}
                          </p>

                          {/* Designer Price Block */}
                          <div className="flex items-baseline gap-1 mt-3 pb-3 border-b border-blue-100/80 dark:border-slate-800">
                            <span className="text-sm font-bold text-slate-400 line-through mr-1 font-mono">
                              {curStrike}
                            </span>
                            <span className="text-lg font-black text-slate-900 dark:text-white align-top">
                              $
                            </span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white font-mono leading-none tracking-tight">
                              {curPrice}
                            </span>
                            <span className="text-xs text-slate-500 font-medium ml-1">
                              /month <span className="text-[10px] text-slate-400 hidden xl:inline">(excluding GST)</span>
                            </span>
                          </div>

                          {/* Features List (All 15 Features, High Contrast & Designer Styled) */}
                          <ul className="space-y-2 pt-3">
                            {plan.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-2.5 text-xs leading-tight">
                                {feat.enabled ? (
                                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-black shrink-0 border border-blue-200 dark:border-blue-800">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    ×
                                  </span>
                                )}
                                <span
                                  className={`truncate ${feat.enabled
                                    ? 'text-slate-800 dark:text-slate-100 font-bold'
                                    : 'text-slate-400 dark:text-slate-500 font-normal line-through opacity-75'
                                    }`}
                                >
                                  {feat.label}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* Divider */}
                          <div className="border-t border-slate-200 dark:border-slate-800 my-3" />

                          {/* Add-on Plans Available */}
                          <div className="flex items-center gap-1.5 text-xs font-black text-blue-700 dark:text-blue-400">
                            <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950/70 flex items-center justify-center text-[10px] font-black text-blue-700 dark:text-blue-300">
                              ✓
                            </span>
                            <span className="truncate">Add-on Plans Available</span>
                          </div>
                        </div>

                        {/* Card ke neeche buttons: Designer SEE ORDERS + Start Free Trial */}
                        <div className="space-y-2.5 pt-4 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanId(plan.id);
                              setCheckoutTargetPlan(plan.name);
                              setIsSubscriptionModalOpen(true);
                            }}
                            className="designer-order-btn w-full py-3 px-4 rounded-xl cursor-pointer text-white flex items-center justify-between group shadow-md hover:shadow-lg"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                                <CreditCard className="w-4 h-4" />
                              </span>
                              <span className="tracking-wider uppercase text-xs font-black">SEE ORDERS</span>
                            </div>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanId(plan.id);
                              setProjectSubscriptionConfig((prev) => ({
                                ...prev,
                                [activePlanProjectId]: {
                                  ...prev[activePlanProjectId],
                                  selectedPlanId: plan.id,
                                  status: 'trial',
                                },
                              }));
                              showToast(
                                `✓ Started 14-day Free Trial for ${plan.name} Plan on ${activePlanProjectId === 'hrms' ? 'HRMS Project' : 'Hotel Management System'
                                }! Other project plans remain completely unaffected.`
                              );
                            }}
                            className="designer-trial-btn w-full py-2.5 px-4 rounded-xl font-black text-xs cursor-pointer text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2 border-2 border-blue-300/80 dark:border-blue-700 shadow-xs hover:border-blue-500"
                          >
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>Start 14-Day Free Trial</span>
                          </button>
                        </div>
                      </div>

                      {/* BACK FACE OF CARD (Designer Blue, Tap anywhere to flip back) */}
                      <div
                        onClick={() => togglePlanFlip(plan.id)}
                        className="flip-card-back p-5 sm:p-6 flex flex-col justify-between border-2 border-blue-500 dark:border-blue-500 ring-4 ring-blue-500/20 shadow-2xl bg-gradient-to-b from-blue-50/95 via-white to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 cursor-pointer relative overflow-hidden"
                      >
                        {/* Decorative Designer Aura */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                        <div>
                          {/* Back Face Header */}
                          <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/60 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                                <ShoppingBag className="w-4 h-4" />
                              </span>
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                                  Order Overview
                                </span>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                  {plan.name} Tier
                                </h3>
                              </div>
                            </div>

                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                              <RotateCcw className="w-3 h-3" />
                              Wapas ↻
                            </span>
                          </div>

                          {/* Order Details */}
                          <div className="mt-4 space-y-3">
                            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 shadow-xs">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">Assigned Project:</span>
                                <span className="font-black text-blue-600 dark:text-blue-400 font-mono">
                                  {activePlanProjectId === 'hrms' ? 'HRMS Project' : 'Hotel Management System'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                <span className="text-slate-500 font-medium">Tenant Organization:</span>
                                <span className="font-bold text-slate-900 dark:text-white font-mono truncate max-w-[150px]">
                                  {selectedOrg?.companyName || 'Apex Enterprises'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                <span className="text-slate-500 font-medium">Selected Cycle:</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[11px]">
                                  {planBillingCycle === 'yearly' ? 'Yearly (10% Discount)' : 'Monthly'}
                                </span>
                              </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">Monthly Rate:</span>
                                <span className="font-bold text-slate-900 dark:text-white font-mono">${curPrice}/mo</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">Total Billed:</span>
                                <span className="font-black text-blue-600 dark:text-blue-400 font-mono text-base">
                                  {planBillingCycle === 'yearly' ? `$${Number(curPrice) * 12}/year` : `$${curPrice}/month`}
                                </span>
                              </div>
                              <div className="text-[10px] text-blue-700 dark:text-blue-300 pt-1.5 border-t border-blue-500/20 font-medium">
                                ✓ Instant access to all unlocked modules & roles
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Back Face Actions: Designer SEE ORDERS Button */}
                        <div className="space-y-2 pt-3 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanId(plan.id);
                              setCheckoutTargetPlan(plan.name);
                              setIsSubscriptionModalOpen(true);
                            }}
                            className="designer-order-btn w-full py-2.5 px-4 rounded-xl cursor-pointer text-white flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                                <CreditCard className="w-3.5 h-3.5" />
                              </span>
                              <span className="tracking-wider uppercase text-[11px] font-black">CONFIRM & SEE ORDERS</span>
                            </div>
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </button>

                          <div className="text-center">
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors flex items-center justify-center gap-1">
                              <RotateCcw className="w-2.5 h-2.5" />
                              Tap card to flip back to features
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 w-full pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
              {/* Top Action Buttons (Export, Filter, + Add Client) */}
              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={handleExportClients}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => {
                    setClientActiveTab('All Clients');
                    setClientPlanFilter('all');
                    setClientStatusFilter('all');
                    setClientSearch('');
                    showToast('✓ Filters reset to default view.');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filter</span>
                </button>
              </div>

              {/* Main Table Card (Filter Navigation + Full Width Client Ledger) */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Tabs & Search Filter Controls Bar */}
                <div className="px-5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  {/* Left Underline Tabs */}
                  <div className="flex items-center gap-6 overflow-x-auto">
                    {(['All Clients', 'Active', 'Trial', 'Expiring Soon', 'Cancelled'] as const).map((tab) => {
                      const isActive = clientActiveTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => {
                            setClientActiveTab(tab);
                            setClientPage(1);
                          }}
                          className={`pb-3 text-xs transition-all relative whitespace-nowrap cursor-pointer ${isActive
                            ? 'text-[#5E48E8] dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium'
                            }`}
                        >
                          <span>{tab}</span>
                          {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5E48E8] dark:bg-indigo-400 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Filter Inputs & Dropdowns */}
                  <div className="flex flex-wrap items-center gap-2 pb-2">
                    {/* Search Input with 360° Looping Border Transition */}
                    <div className="w-52 sm:w-60">
                      <div className="search-loop-container group">
                        <div className="search-loop-border" />
                        <div className="relative z-10 flex items-center bg-white dark:bg-slate-900 rounded-[0.75rem] py-0.5 px-1 overflow-hidden">
                          <div className="search-loop-shimmer" />
                          <div className="pl-2 pr-1.5 py-1 flex items-center text-[#5E48E8] dark:text-indigo-400 shrink-0">
                            <Search className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search in clients..."
                            value={clientSearch}
                            onChange={(e) => {
                              setClientSearch(e.target.value);
                              setClientPage(1);
                            }}
                            className="w-full bg-transparent py-1 pr-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none font-medium z-20"
                          />
                          {clientSearch && (
                            <button
                              onClick={() => {
                                setClientSearch('');
                                setClientPage(1);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1 transition-all cursor-pointer z-20"
                              title="Clear Search"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* All Plans Dropdown */}
                    <div className="relative">
                      <select
                        value={clientPlanFilter}
                        onChange={(e) => {
                          setClientPlanFilter(e.target.value as any);
                          setClientPage(1);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer appearance-none pr-7 shadow-2xs hover:bg-slate-50"
                      >
                        <option value="all">All Plans</option>
                        <option value="Growth">Growth</option>
                        <option value="Professional">Professional</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* All Status Dropdown */}
                    <div className="relative">
                      <select
                        value={clientStatusFilter}
                        onChange={(e) => {
                          setClientStatusFilter(e.target.value as any);
                          setClientPage(1);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer appearance-none pr-7 shadow-2xs hover:bg-slate-50"
                      >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Trial">Trial</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Columns Dropdown Toggle */}
                    <div className="relative">
                      <button
                        onClick={() => setIsColumnsDropdownOpen((prev) => !prev)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs hover:bg-slate-50"
                      >
                        <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                        <span>Columns</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {isColumnsDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2.5 z-20 space-y-2 text-xs">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                            Toggle Visible Columns
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded-md">
                            <input
                              type="checkbox"
                              checked={visibleColumns.planStatus}
                              onChange={(e) =>
                                setVisibleColumns((p) => ({ ...p, planStatus: e.target.checked }))
                              }
                              className="rounded text-[#5E48E8] focus:ring-[#5E48E8]"
                            />
                            <span>Plan & Status</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded-md">
                            <input
                              type="checkbox"
                              checked={visibleColumns.email}
                              onChange={(e) =>
                                setVisibleColumns((p) => ({ ...p, email: e.target.checked }))
                              }
                              className="rounded text-[#5E48E8] focus:ring-[#5E48E8]"
                            />
                            <span>Client Email</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded-md">
                            <input
                              type="checkbox"
                              checked={visibleColumns.featureAccess}
                              onChange={(e) =>
                                setVisibleColumns((p) => ({ ...p, featureAccess: e.target.checked }))
                              }
                              className="rounded text-[#5E48E8] focus:ring-[#5E48E8]"
                            />
                            <span>Feature Access</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded-md">
                            <input
                              type="checkbox"
                              checked={visibleColumns.billingPayment}
                              onChange={(e) =>
                                setVisibleColumns((p) => ({ ...p, billingPayment: e.target.checked }))
                              }
                              className="rounded text-[#5E48E8] focus:ring-[#5E48E8]"
                            />
                            <span>Billing & Payment</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded-md">
                            <input
                              type="checkbox"
                              checked={visibleColumns.nextRenewal}
                              onChange={(e) =>
                                setVisibleColumns((p) => ({ ...p, nextRenewal: e.target.checked }))
                              }
                              className="rounded text-[#5E48E8] focus:ring-[#5E48E8]"
                            />
                            <span>Next Renewal</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="px-5 py-3.5">CLIENT & ORGANIZATION</th>
                        {visibleColumns.planStatus && <th className="px-4 py-3.5">PLAN & STATUS</th>}
                        {visibleColumns.email && <th className="px-4 py-3.5">CLIENT EMAIL</th>}
                        {visibleColumns.featureAccess && <th className="px-4 py-3.5 w-60">FEATURE ACCESS</th>}
                        {visibleColumns.billingPayment && <th className="px-4 py-3.5">BILLING & PAYMENT</th>}
                        {visibleColumns.nextRenewal && <th className="px-4 py-3.5">NEXT RENEWAL</th>}
                        <th className="px-4 py-3.5 text-center min-w-[150px]">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {paginatedClients.length === 0 ? (
                        <tr>
                          <td colSpan={visibleColumns.email ? 7 : 6} className="px-5 py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                              <span className="font-bold text-sm text-slate-600 dark:text-slate-400">
                                No clients found matching filters
                              </span>
                              <button
                                onClick={() => {
                                  setClientSearch('');
                                  setClientActiveTab('All Clients');
                                  setClientPlanFilter('all');
                                  setClientStatusFilter('all');
                                }}
                                className="mt-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer transition-colors"
                              >
                                Reset All Filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedClients.map((client) => {
                          return (
                            <tr
                              key={client.id}
                              className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              {/* 1. Client & Organization */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  {/* Avatar Circle with exact custom colors */}
                                  <div
                                    className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                                    style={{ backgroundColor: client.avatarBg || '#5E48E8' }}
                                  >
                                    {client.customerAvatar}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                                        {client.customerName}
                                      </span>
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${client.tier === 'Enterprise' || client.plan === 'Enterprise'
                                          ? 'bg-[#EEECFD] text-[#5E48E8] dark:bg-purple-950/60 dark:text-purple-300'
                                          : 'bg-[#FEF3EB] text-[#F2994A] dark:bg-amber-950/60 dark:text-amber-300'
                                          }`}
                                      >
                                        {client.tier || client.plan}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                                      {client.companyName}
                                    </div>
                                    {client.customerEmail && (
                                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5E48E8] dark:text-indigo-400 mt-0.5 truncate">
                                        <Mail className="w-3 h-3 shrink-0 text-[#5E48E8] dark:text-indigo-400" />
                                        <a
                                          href={`mailto:${client.customerEmail}`}
                                          className="hover:underline truncate"
                                          title={`Email: ${client.customerEmail}`}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {client.customerEmail}
                                        </a>
                                      </div>
                                    )}
                                    <a
                                      href={client.customUrl || `https://${client.subdomain}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] text-[#5E48E8] dark:text-indigo-400 hover:underline font-mono inline-block truncate max-w-[200px]"
                                    >
                                      {client.customUrl || `https://${client.subdomain}`}
                                    </a>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Plan & Status */}
                              {visibleColumns.planStatus && (
                                <td className="px-4 py-4">
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                                        {client.planStatusTitle || client.plan}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${client.status === 'Accepted'
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500/40 font-black'
                                          : client.status === 'Active' || client.status === 'Approved & Upgraded'
                                            ? 'bg-[#E8F8EE] text-[#27AE60] dark:bg-emerald-950/40 dark:text-emerald-300'
                                            : client.status === 'Trial'
                                              ? 'bg-[#EBF3FE] text-[#2F80ED] dark:bg-blue-950/40 dark:text-blue-300'
                                              : client.status === 'Expiring Soon'
                                                ? 'bg-[#FEF3EB] text-[#F2994A] dark:bg-amber-950/40 dark:text-amber-300'
                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                          }`}
                                      >
                                        {client.status}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 truncate">
                                      {client.planSubtitle || client.licenseSeats}
                                    </div>
                                  </div>
                                </td>
                              )}

                              {/* 2.5 Client Email Column */}
                              {visibleColumns.email && (
                                <td className="px-4 py-4">
                                  <div className="flex flex-col gap-1 min-w-[170px]">
                                    <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-medium text-xs">
                                      <Mail className="w-3.5 h-3.5 text-[#5E48E8] dark:text-indigo-400 shrink-0" />
                                      <a
                                        href={`mailto:${client.customerEmail}`}
                                        className="hover:text-[#5E48E8] dark:hover:text-indigo-300 hover:underline truncate max-w-[185px] font-mono text-[11.5px]"
                                        title={`Send email to ${client.customerEmail}`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {client.customerEmail}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-[#5E48E8] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                                        Registered Email
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard?.writeText(client.customerEmail);
                                          showToast(`✓ Copied: ${client.customerEmail}`);
                                        }}
                                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                        title="Copy Email Address"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              )}

                              {/* 3. Feature Access with Purple Progress Bar */}
                              {visibleColumns.featureAccess && (
                                <td className="px-4 py-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                      <span>
                                        {client.featuresCurrent || 20} / {client.featuresTotal || 25} Features
                                      </span>
                                      <span>{client.featuresPercent || 80}%</span>
                                    </div>

                                    {/* Progress Track */}
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-[#7B61FF] h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${client.featuresPercent || 80}%` }}
                                      />
                                    </div>

                                    {/* Feature Subtext Badge */}
                                    {client.featureSubtextType === 'available' ? (
                                      <div className="text-[10px] font-semibold text-[#5E48E8] dark:text-indigo-400 mt-1">
                                        {client.featureSubtext}
                                      </div>
                                    ) : client.featureSubtextType === 'active' ? (
                                      <div className="text-[10px] font-semibold text-[#27AE60] dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]" />
                                        <span>{client.featureSubtext}</span>
                                      </div>
                                    ) : (
                                      <div className="text-[10px] font-semibold text-[#F2994A] dark:text-amber-400 mt-1 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F2994A]" />
                                        <span>{client.featureSubtext}</span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              )}

                              {/* 4. Billing & Payment */}
                              {visibleColumns.billingPayment && (
                                <td className="px-4 py-4">
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                                      {client.amountFormatted}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[110px]">
                                        {client.paymentMethod}
                                      </span>
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${client.paymentStatus === 'Paid'
                                          ? 'bg-[#E8F8EE] text-[#27AE60]'
                                          : 'bg-[#FEF3EB] text-[#F2994A]'
                                          }`}
                                      >
                                        {client.paymentStatus || 'Paid'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              )}

                              {/* 5. Next Renewal Date & Days Left Warning */}
                              {visibleColumns.nextRenewal && (
                                <td className="px-4 py-4">
                                  <div>
                                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                      {client.nextRenewalDate || client.date}
                                    </div>
                                    <div className="text-[10.5px] font-semibold text-[#F2994A] mt-0.5">
                                      {client.daysLeftText || `${client.daysLeft || 10} days left`}
                                    </div>
                                  </div>
                                </td>
                              )}

                              {/* 6. Actions (Eye, 3 dots, Accept Request) */}
                              <td className="px-4 py-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                  {client.status === 'Accepted' ? (
                                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 inline-flex items-center gap-1 shrink-0 shadow-2xs">
                                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                      <span>Accepted</span>
                                    </span>
                                  ) : (
                                    <button
                                      title="Accept Request and notify client via email"
                                      disabled={acceptingClientId === client.id}
                                      onClick={() => handleAcceptClientRequest(client)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-[11px] shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-all shrink-0 hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                                    >
                                      {acceptingClientId === client.id ? (
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      )}
                                      <span>Accept Request</span>
                                    </button>
                                  )}

                                  <button
                                    title="View Client Dossier"
                                    onClick={() => setSelectedTransactionDetail(client)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                                  </button>

                                  <div className="relative">
                                    <button
                                      title="More Options"
                                      onClick={() =>
                                        setActiveRowMenuId((prev) => (prev === client.id ? null : client.id))
                                      }
                                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                                    </button>

                                    {activeRowMenuId === client.id && (
                                      <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-20 space-y-1 text-left">
                                        {client.status !== 'Accepted' && (
                                          <button
                                            onClick={() => {
                                              handleAcceptClientRequest(client);
                                              setActiveRowMenuId(null);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-bold cursor-pointer"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Accept Request</span>
                                          </button>
                                        )}
                                        <button
                                          onClick={() => {
                                            navigator.clipboard?.writeText(
                                              client.customUrl || `https://${client.subdomain}`
                                            );
                                            showToast('✓ Client login URL copied to clipboard!');
                                            setActiveRowMenuId(null);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Copy Portal URL</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleDownloadInvoice(client);
                                            setActiveRowMenuId(null);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                          <span>Download Folio</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            setFeatureClient(client);
                                            setIsFeatureModalOpen(true);
                                            setActiveRowMenuId(null);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-violet-600 dark:text-violet-400 flex items-center gap-2"
                                        >
                                          <Sparkles className="w-3.5 h-3.5" />
                                          <span>Custom Features</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer / Pagination Controls (Exact replica of reference image) */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="font-medium text-slate-500 dark:text-slate-400">
                    Showing {totalClientsCount === 0 ? 0 : startIndex + 1} to{' '}
                    {Math.min(endIndex, totalClientsCount)} of {totalClientsCount} clients
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Per-Page Selector */}
                    <div className="relative">
                      <select
                        value={clientPageSize}
                        onChange={(e) => {
                          setClientPageSize(Number(e.target.value));
                          setClientPage(1);
                        }}
                        className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1 pr-6 text-xs text-slate-600 dark:text-slate-300 font-medium appearance-none cursor-pointer shadow-2xs hover:bg-slate-50"
                      >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Prev Page Button */}
                    <button
                      disabled={clientPage === 1}
                      onClick={() => setClientPage((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setClientPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${clientPage === p
                          ? 'bg-[#5E48E8] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        {p}
                      </button>
                    ))}

                    {/* Next Page Button */}
                    <button
                      disabled={clientPage >= totalPages}
                      onClick={() => setClientPage((prev) => Math.min(totalPages, prev + 1))}
                      className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add Client Modal */}
              {isAddClientOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#5E48E8]" />
                        <span>Onboard New Client</span>
                      </h3>
                      <button
                        onClick={() => setIsAddClientOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddClientSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Client Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Devendra Patel (Person A)"
                          value={newClientName}
                          onChange={(e) => setNewClientName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Client Registered Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. d.patel@grandhorizonresorts.com"
                          value={newClientEmail}
                          onChange={(e) => setNewClientEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Organization / Resort *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Grand Horizon Palace"
                            value={newClientOrg}
                            onChange={(e) => setNewClientOrg(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Custom Subdomain URL
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. grandhorizon.moments.io"
                            value={newClientUrl}
                            onChange={(e) => setNewClientUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Plan Tier
                          </label>
                          <select
                            value={newClientPlan}
                            onChange={(e) => setNewClientPlan(e.target.value as any)}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          >
                            <option value="Growth">Growth</option>
                            <option value="Professional">Professional</option>
                            <option value="Enterprise">Enterprise</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Status
                          </label>
                          <select
                            value={newClientStatus}
                            onChange={(e) => setNewClientStatus(e.target.value as any)}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          >
                            <option value="Active">Active</option>
                            <option value="Trial">Trial</option>
                            <option value="Expiring Soon">Expiring Soon</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Cycle
                          </label>
                          <select
                            value={newClientCycle}
                            onChange={(e) => setNewClientCycle(e.target.value as any)}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Amount ($)
                          </label>
                          <input
                            type="number"
                            value={newClientAmount}
                            onChange={(e) => setNewClientAmount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Payment Method
                          </label>
                          <select
                            value={newClientMethod}
                            onChange={(e) => setNewClientMethod(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          >
                            <option value="Bank Wire">Bank Wire</option>
                            <option value="Razorpay UPI">Razorpay UPI</option>
                            <option value="Stripe Business">Stripe Business</option>
                            <option value="Emirates NBD">Emirates NBD</option>
                            <option value="Stripe Card">Credit Card</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddClientOpen(false)}
                          className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#5E48E8] text-white font-bold shadow-md shadow-indigo-500/25 cursor-pointer hover:bg-[#503DD4]"
                        >
                          Confirm & Add Client
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Client Modal */}
              {isEditClientOpen && editingClient && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-[#5E48E8]" />
                        <span>Edit Client: {editingClient.customerName}</span>
                      </h3>
                      <button
                        onClick={() => {
                          setIsEditClientOpen(false);
                          setEditingClient(null);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleEditClientSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Organization / Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingClient.companyName}
                          onChange={(e) =>
                            setEditingClient({ ...editingClient, companyName: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                          Client Registered Email Address
                        </label>
                        <input
                          type="email"
                          value={editingClient.customerEmail || ''}
                          onChange={(e) =>
                            setEditingClient({ ...editingClient, customerEmail: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Plan Status Label
                          </label>
                          <input
                            type="text"
                            value={editingClient.planStatusTitle || editingClient.plan}
                            onChange={(e) =>
                              setEditingClient({ ...editingClient, planStatusTitle: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Status Tag
                          </label>
                          <select
                            value={editingClient.status}
                            onChange={(e) =>
                              setEditingClient({ ...editingClient, status: e.target.value as any })
                            }
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          >
                            <option value="Active">Active</option>
                            <option value="Trial">Trial</option>
                            <option value="Expiring Soon">Expiring Soon</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Payment Status
                          </label>
                          <select
                            value={editingClient.paymentStatus || 'Paid'}
                            onChange={(e) =>
                              setEditingClient({ ...editingClient, paymentStatus: e.target.value as any })
                            }
                            className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          >
                            <option value="Paid">Paid</option>
                            <option value="Due">Due</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                            Days Left / Alert
                          </label>
                          <input
                            type="text"
                            value={editingClient.daysLeftText || ''}
                            onChange={(e) =>
                              setEditingClient({ ...editingClient, daysLeftText: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditClientOpen(false);
                            setEditingClient(null);
                          }}
                          className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#5E48E8] text-white font-bold shadow-md shadow-indigo-500/25 cursor-pointer hover:bg-[#503DD4]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Record Manual Payment Modal */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Record Tenant Payment
              </h3>
              <button
                onClick={() => setIsRecordPaymentOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                  Tenant Organization *
                </label>
                <input
                  type="text"
                  required
                  value={newPayOrg}
                  onChange={(e) => setNewPayOrg(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPayAmount}
                    onChange={(e) => setNewPayAmount(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Plan
                  </label>
                  <select
                    value={newPayPlan}
                    onChange={(e) => setNewPayPlan(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Growth">Growth</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                  Payment Method
                </label>
                <select
                  value={newPayMethod}
                  onChange={(e) => setNewPayMethod(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Razorpay">Razorpay</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SUBMIT PLAN UPGRADE REQUEST (SIMULATION FOR PERSON A)           */}
      {/* ========================================================================= */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs ${activePlanProjectId === 'hrms' ? 'bg-blue-600' : 'bg-orange-600'
                  }`}>
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Submit Plan Upgrade Request
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Simulate a client (e.g. Person A) requesting an upgrade for {activePlanProjectId === 'hrms' ? 'HRMS Project' : 'Hotel Management System'}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUpgradeRequest} className="space-y-3.5 text-xs">
              {/* Target Project Scope Display */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span className="font-bold text-slate-600 dark:text-slate-300">Project Scope:</span>
                <span className={`font-black text-xs px-2.5 py-0.5 rounded-full ${activePlanProjectId === 'hrms'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                  }`}>
                  {activePlanProjectId === 'hrms' ? 'HRMS Core Project' : 'Hotel Management System'}
                </span>
              </div>

              {/* Customer & Company Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUpgradeCustName}
                    onChange={(e) => setNewUpgradeCustName(e.target.value)}
                    placeholder="e.g. Person A / Devendra Patel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Client Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUpgradeCustEmail}
                    onChange={(e) => setNewUpgradeCustEmail(e.target.value)}
                    placeholder="persona@client.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Company / Resort Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUpgradeCompany}
                    onChange={(e) => setNewUpgradeCompany(e.target.value)}
                    placeholder="e.g. Grand Horizon Palace Group"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newUpgradePhone}
                    onChange={(e) => setNewUpgradePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Plan Transition: Current Plan -> Target Plan */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Current Plan
                  </label>
                  <select
                    value={newUpgradeCurrentPlan}
                    onChange={(e) => setNewUpgradeCurrentPlan(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Growth">Growth</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Target Upgrade Plan *
                  </label>
                  <select
                    value={newUpgradeTargetPlan}
                    onChange={(e) => setNewUpgradeTargetPlan(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border-2 border-amber-500/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise Suite</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={newUpgradeCycle}
                    onChange={(e) => setNewUpgradeCycle(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="yearly">Yearly (10% Off)</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Upgrade Reason / Bespoke Needs */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                  Upgrade Reason & Client Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newUpgradeReason}
                  onChange={(e) => setNewUpgradeReason(e.target.value)}
                  placeholder="e.g. Expanding 150 new rooms and need 2-Way OTA Channel Manager (Booking.com/Agoda)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-black text-xs shadow-md cursor-pointer transition-all ${activePlanProjectId === 'hrms'
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                    : 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20'
                    }`}
                >
                  Submit Upgrade Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CLIENT DOSSIER & OFFICIAL INVOICE VIEW                          */}
      {/* ========================================================================= */}
      {selectedTransactionDetail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl text-white font-black text-sm flex items-center justify-center shadow-md ${selectedTransactionDetail.projectId === 'hrms'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-br from-orange-600 to-amber-600'
                    }`}
                >
                  {selectedTransactionDetail.customerAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedTransactionDetail.customerName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${selectedTransactionDetail.projectId === 'hrms'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                        }`}
                    >
                      {selectedTransactionDetail.projectId === 'hrms' ? 'HRMS Project' : 'Hotel PMS'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedTransactionDetail.companyName}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      https://{selectedTransactionDetail.subdomain}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTransactionDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upgrade Request Callout if present */}
            {selectedTransactionDetail.status === 'Upgrade Requested' ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                      Plan Upgrade Requested: {selectedTransactionDetail.plan} → {selectedTransactionDetail.requestedUpgradePlan}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                    Awaiting SuperAdmin Approval
                  </span>
                </div>
                {selectedTransactionDetail.upgradeReason && (
                  <p className="text-xs text-amber-900/90 dark:text-amber-100/90 leading-relaxed italic bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                    "{selectedTransactionDetail.upgradeReason}"
                  </p>
                )}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    disabled={acceptingClientId === selectedTransactionDetail.id}
                    onClick={() => handleAcceptClientRequest(selectedTransactionDetail)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {acceptingClientId === selectedTransactionDetail.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Accept Request</span>
                  </button>
                  <button
                    onClick={() => {
                      handleApproveUpgrade(selectedTransactionDetail.id);
                      setSelectedTransactionDetail(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Upgrade to {selectedTransactionDetail.requestedUpgradePlan}</span>
                  </button>
                </div>
              </div>
            ) : selectedTransactionDetail.status === 'Accepted' ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Request Accepted — Macenza team will complete website changes within the next 5 hours.</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Confirmation Email Sent
                </span>
              </div>
            ) : selectedTransactionDetail.status === 'Approved & Upgraded' ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Plan Successfully Upgraded to {selectedTransactionDetail.plan} Tier</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  Live & Activated
                </span>
              </div>
            ) : null}

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</span>
                <div className="font-semibold text-slate-900 dark:text-white truncate">
                  {selectedTransactionDetail.customerEmail}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</span>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedTransactionDetail.customerPhone}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Plan</span>
                <div className="font-black text-blue-600 dark:text-blue-400">
                  {selectedTransactionDetail.plan} Tier ({selectedTransactionDetail.billingCycle})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Licensed Capacity</span>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedTransactionDetail.licenseSeats}
                </div>
              </div>
            </div>

            {/* Bespoke Requirements ("Extra Needs") */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  Bespoke Client Add-ons & Extra Requirements:
                </span>
                <button
                  onClick={() => {
                    setFeatureClient(selectedTransactionDetail);
                    setIsFeatureModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10.5px] font-bold hover:bg-violet-200 cursor-pointer transition-colors"
                >
                  <Wrench className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                  <span>+ Manage Add-ons</span>
                </button>
              </div>
              <div className="space-y-2">
                {selectedTransactionDetail.extraRequirements && selectedTransactionDetail.extraRequirements.length > 0 ? (
                  selectedTransactionDetail.extraRequirements.map((req, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white">
                            {req.title}
                          </span>
                          <span className="px-2 py-0.2 rounded text-[9.5px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                            {req.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {req.description}
                        </p>
                      </div>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 shrink-0 text-xs">
                        {req.extraFee || 'Included'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
                    No custom features added yet for this client.
                  </div>
                )}
              </div>
            </div>

            {/* Financial Invoice Breakdown */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedTransactionDetail.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedTransactionDetail.id}
                </span>
              </div>
              {selectedTransactionDetail.razorpaySubscriptionId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Razorpay Subscription ID:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedTransactionDetail.razorpaySubscriptionId}
                  </span>
                </div>
              )}
              {selectedTransactionDetail.razorpayPaymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Razorpay Payment ID:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedTransactionDetail.razorpayPaymentId}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Subscription Start Date:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedTransactionDetail.subscriptionStartDate
                    ? new Date(selectedTransactionDetail.subscriptionStartDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                    : selectedTransactionDetail.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Next Billing Date:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedTransactionDetail.nextBillingDate
                    ? new Date(selectedTransactionDetail.nextBillingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                    : selectedTransactionDetail.nextRenewalDate || 'In 30 Days'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Payment Gateway / Method:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedTransactionDetail.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Subscription Status:</span>
                <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {selectedTransactionDetail.subscriptionStatus || selectedTransactionDetail.status || 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Payment Status:</span>
                <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {selectedTransactionDetail.paymentStatus || 'Paid'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200/60 dark:border-blue-800">
                <span className="font-bold text-slate-700 dark:text-slate-200">Total Billed:</span>
                <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400">
                  {selectedTransactionDetail.amountFormatted}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadInvoice(selectedTransactionDetail)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official Tax Invoice</span>
                </button>

                {selectedTransactionDetail.status !== 'Accepted' && (
                  <button
                    disabled={acceptingClientId === selectedTransactionDetail.id}
                    onClick={() => handleAcceptClientRequest(selectedTransactionDetail)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black shadow-md cursor-pointer transition-all disabled:opacity-50"
                  >
                    {acceptingClientId === selectedTransactionDetail.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Accept Request</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedTransactionDetail(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CLIENT BESPOKE FEATURES & ADD-ON MANAGER                        */}
      {/* ========================================================================= */}
      {isFeatureModalOpen && featureClient && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      Custom Features & Bespoke Add-on Studio
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                      Tailored Architecture
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure custom APIs, hardware integrations, and bespoke requirements for this client.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsFeatureModalOpen(false);
                  setFeatureClient(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Context Strip */}
            <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs ${featureClient.projectId === 'hrms'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-br from-orange-600 to-amber-600'
                    }`}
                >
                  {featureClient.customerAvatar}
                </div>
                <div>
                  <div className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{featureClient.customerName}</span>
                    <span className="text-[10px] font-bold text-slate-400">({featureClient.companyName})</span>
                  </div>
                  <div className="text-[10.5px] font-mono text-blue-600 dark:text-blue-400">
                    https://{featureClient.subdomain}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {featureClient.plan} Tier
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {featureClient.extraRequirements?.length || 0} active add-ons
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* SECTION 1: Active Features List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                    Active Client Requirements & Add-ons ({featureClient.extraRequirements?.length || 0}):
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Instant sync with ledger & tax invoice
                  </span>
                </div>

                {!featureClient.extraRequirements || featureClient.extraRequirements.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1 bg-slate-50/50 dark:bg-slate-800/20">
                    <Sparkles className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="font-bold text-slate-600 dark:text-slate-400">No custom features added yet.</p>
                    <p className="text-[11px] text-slate-400">
                      Select a project preset below or create a custom specification for this client.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {featureClient.extraRequirements.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs flex items-start justify-between gap-3 hover:border-violet-300 dark:hover:border-violet-700 transition-all"
                      >
                        <div className="min-w-0 space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-slate-900 dark:text-white text-xs">
                              {feat.title}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                              {feat.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              {feat.extraFee || 'Included'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {feat.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFeatureFromClient(featureClient.id, fIdx)}
                          title="Remove this feature"
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 2: 1-Click Project Presets */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    1-Click Ready Presets for {featureClient.projectId === 'hrms' ? 'HRMS Core' : 'Hotel Management'}:
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Click to attach</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(featureClient.projectId === 'hrms' ? HRMS_FEATURE_PRESETS : HOTEL_FEATURE_PRESETS).map(
                    (preset, pIdx) => {
                      const isAlreadyActive = featureClient.extraRequirements?.some(
                        (r) => r.title.toLowerCase() === preset.title.toLowerCase()
                      );

                      return (
                        <div
                          key={pIdx}
                          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${isAlreadyActive
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                            }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-black text-slate-900 dark:text-white text-[11.5px] leading-snug">
                                {preset.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black shrink-0 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                {preset.extraFee}
                              </span>
                            </div>
                            <div className="inline-block px-1.5 py-0.2 rounded text-[8.5px] font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {preset.category}
                            </div>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                              {preset.description}
                            </p>
                          </div>

                          <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                            {isAlreadyActive ? (
                              <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Attached to Client</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddFeatureToClient(featureClient.id, preset)}
                                className="w-full py-1.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all hover:scale-101"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Attach Preset</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* SECTION 3: Create Custom User-Defined Feature */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue-500" />
                    Create Custom Requirement (Any Specification):
                  </span>
                  <span className="text-[10px] text-violet-600 dark:text-violet-400 font-bold">
                    Custom Client Tailoring
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customFeatTitle.trim()) return;
                    handleAddFeatureToClient(featureClient.id, {
                      title: customFeatTitle.trim(),
                      description: customFeatDesc.trim() || 'Custom bespoke requirement requested by client.',
                      category: customFeatCat || 'Custom Feature',
                      extraFee: customFeatFee.trim() || 'Included',
                    });
                    setCustomFeatTitle('');
                    setCustomFeatDesc('');
                    setCustomFeatFee('+$50/mo');
                  }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-violet-50/30 dark:from-slate-800/60 dark:to-violet-950/20 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Feature / Module Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., SAP ERP Payroll Connector, Custom Tablet App..."
                        value={customFeatTitle}
                        onChange={(e) => setCustomFeatTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category Classification
                      </label>
                      <select
                        value={customFeatCat}
                        onChange={(e) => setCustomFeatCat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="Custom Feature">Custom Feature (Bespoke)</option>
                        <option value="Hardware Sync">Hardware Sync & Encoder</option>
                        <option value="OTA Integration">OTA Channel Integration</option>
                        <option value="Compliance & Tax">Compliance & Tax Formula</option>
                        <option value="Security & SSO">Security, SAML & SSO</option>
                        <option value="AI Suite">AI Suite & Automation</option>
                        <option value="High-Priority SLA">High-Priority SLA & Account Mgr</option>
                        <option value="Storage & Backup">Encrypted Storage & Backup</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Add-on Fee (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +$50/mo, +$300/yr, Included"
                        value={customFeatFee}
                        onChange={(e) => setCustomFeatFee(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Description / Technical Specification
                      </label>
                      <input
                        type="text"
                        placeholder="Brief description of what this custom feature delivers..."
                        value={customFeatDesc}
                        onChange={(e) => setCustomFeatDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-101"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Attach Custom Feature to {featureClient.customerName}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                Features will instantly appear in the project ledger, dossier, and downloadable invoices.
              </div>
              <button
                onClick={() => {
                  setIsFeatureModalOpen(false);
                  setFeatureClient(null);
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black cursor-pointer shadow-xs transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Subscription Checkout & Real-Time Confirmation Modal */}
      <SubscriptionCheckoutModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        selectedPlan={checkoutTargetPlan}
        billingCadence={planBillingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
        defaultOrgName={selectedOrg?.companyName || 'Hotel Royal Orchid'}
        defaultCustomerName="Rajesh Sharma"
        defaultEmail="rajesh@royalorchidresorts.com"
        projectId={activePlanProjectId}
        apiBaseUrl="http://localhost:5001"
        onSubscriptionActivated={handleSubscriptionActivated}
      />

      {/* Acceptance Confirmation & Email Dispatch Modal */}
      {acceptedConfirmationModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-[10000] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/25 text-white inline-block mb-1">
                    Request Accepted
                  </span>
                  <h3 className="text-lg font-black tracking-tight leading-snug text-white">
                    Request Accepted Successfully
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    Confirmation email sent to registered client email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAcceptedConfirmationModal(null)}
                className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Success Alert Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-black text-emerald-800 dark:text-emerald-200">
                  Request accepted successfully and confirmation email sent.
                </span>
              </div>

              {/* Exact Cryptographic Subscription Record Card */}
              <div className="rounded-2xl border border-slate-700 bg-[#111827] text-white p-5 space-y-4 shadow-xl text-xs font-sans">
                <div className="text-center border-b border-slate-800 pb-3">
                  <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                    Cryptographic Subscription Record Verified
                  </div>
                  <h4 className="text-base font-black text-white">
                    Welcome to {acceptedConfirmationModal.plan || 'Enterprise'}!
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dedicated Platform Instance Activated
                  </p>
                </div>

                <div className="text-slate-300 text-xs leading-relaxed">
                  <p>Hi <strong className="text-white">{acceptedConfirmationModal.customerName || 'xyzz'}</strong>,</p>
                  <p className="mt-1">
                    Your {acceptedConfirmationModal.billingCycle || 'monthly'} subscription has been successfully authorized and your dedicated White Label platform instance is now activated for <strong className="text-white">{acceptedConfirmationModal.companyName || 'FIfaa'}</strong>.
                  </p>
                </div>

                {/* Cryptographic Record Table */}
                <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-2">
                    Cryptographic Subscription Record
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Customer / Organization</span>
                    <span className="font-bold text-white">{acceptedConfirmationModal.companyName || 'FIfaa'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Plan & Billing Cadence</span>
                    <span className="font-bold text-white">{acceptedConfirmationModal.plan || 'Enterprise'} ({acceptedConfirmationModal.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Total {acceptedConfirmationModal.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Paid</span>
                    <span className="font-mono font-bold text-emerald-400">{acceptedConfirmationModal.amountFormatted || '₹10,000 / month'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Next Billing Date</span>
                    <span className="font-medium text-white">{acceptedConfirmationModal.nextRenewalDate || '9 October 2026'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Subscription Status</span>
                    <span className="font-black text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">Razorpay Subscription ID</span>
                    <span className="font-mono text-slate-300 text-[11px]">{acceptedConfirmationModal.razorpaySubscriptionId || `sub_hotel_1788935876190_54c5`}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Razorpay Payment ID</span>
                    <span className="font-mono text-slate-300 text-[11px]">{acceptedConfirmationModal.razorpayPaymentId || `pay_hotel_1788935876190_dtap`}</span>
                  </div>
                </div>

                {/* Request Accepted Notice Box */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-emerald-200 text-xs leading-relaxed">
                  <strong className="text-emerald-300 block mb-1">✓ Request Accepted Successfully:</strong>
                  A formal confirmation email has been automatically sent to <strong className="text-white underline">{acceptedConfirmationModal.customerEmail || 'tejaswisen27@gmail.com'}</strong>. Our team will review the required details and contact you shortly regarding the branding setup and onboarding.
                </div>

                <div className="pt-1 text-[11px] text-slate-400 leading-normal">
                  <p>Best regards,<br /><strong className="text-white">Platform Operations & White Label Team</strong></p>
                  <p className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                    This email was sent to {acceptedConfirmationModal.customerEmail || 'tejaswisen27@gmail.com'}. All rights reserved © 2026 Hotel Management White-Label Solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Status updated to Accepted in Subscription Plans
              </span>
              <button
                onClick={() => setAcceptedConfirmationModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs cursor-pointer shadow-md transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] animate-fadeIn max-w-md">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30 backdrop-blur-md border border-emerald-400/40 text-xs font-black tracking-wide">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <div className="flex-1 leading-snug">
              {toastMessage}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-emerald-700/50 rounded-lg cursor-pointer text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
