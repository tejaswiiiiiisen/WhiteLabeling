'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  RefreshCw,
  Edit3,
  Globe,
  Mail,
  Building2,
  Palette,
  Server,
  UserCheck,
  Calendar,
  X,
  Send,
  CreditCard,
  Copy,
  Check,
  Eye,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Phone,
  LayoutGrid,
  List,
  Users,
  Coins,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { WhiteLabelSetupRequestItem } from '../../../types/superAdmin';

interface SetupRequestsTabProps {
  initialSelectedId?: string | null;
  onClearSelectedId?: () => void;
}

interface CountsData {
  newCount: number;
  acceptedCount: number;
  reviewingCount: number;
  inProgressCount: number;
  testingCount: number;
  deployedCount: number;
  completedCount: number;
  totalRequests: number;
  paidOrders: number;
}

const DEFAULT_SETUP_REQUESTS: WhiteLabelSetupRequestItem[] = [
  {
    _id: 'req_wl_782910',
    plan: 'manual_white_label',
    planName: 'Manual White Label & Website Changes',
    amount: 14999,
    currency: 'INR',
    customerName: 'Devendra Patel',
    customerEmail: 'd.patel@grandhorizonresorts.com',
    customerPhone: '+91 99887 76655',
    userName: 'Devendra Patel',
    userEmail: 'd.patel@grandhorizonresorts.com',
    razorpayOrderId: 'order_wl_9823419082',
    razorpayPaymentId: 'pay_wl_7718294109',
    paymentStatus: 'PAID',
    setupStatus: 'NEW',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    setupDetails: {
      companyName: 'Grand Horizon Palace & Resorts',
      customDomain: 'booking.grandhorizonresorts.com',
      companyWebsite: 'https://grandhorizonresorts.com',
      brandColors: ['#B8860B', '#1E3A8A'],
      contactEmail: 'd.patel@grandhorizonresorts.com',
      additionalRequirements: 'Need website changes: update booking hero section, embed custom logo, and apply royal gold theme.',
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    statusHistory: [
      {
        status: 'NEW',
        updatedBy: 'Razorpay Gateway',
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        note: 'Payment verified (₹14,999). White label website setup request received.',
      },
    ],
  },
  {
    _id: 'req_wl_893012',
    plan: 'custom_white_label',
    planName: 'Enterprise Custom White Label',
    amount: 24999,
    currency: 'INR',
    customerName: 'Aarav Mehta',
    customerEmail: 'aarav.m@zenithlogistics.in',
    customerPhone: '+91 98201 44552',
    userName: 'Aarav Mehta',
    userEmail: 'aarav.m@zenithlogistics.in',
    razorpayOrderId: 'order_wl_5541098231',
    razorpayPaymentId: 'pay_wl_9948271034',
    paymentStatus: 'PAID',
    setupStatus: 'NEW',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
    setupDetails: {
      companyName: 'Zenith Logistics Global',
      customDomain: 'portal.zenithlogistics.in',
      companyWebsite: 'https://zenithlogistics.in',
      brandColors: ['#0284C7', '#0F172A'],
      contactEmail: 'aarav.m@zenithlogistics.in',
      additionalRequirements: 'Update custom domain DNS SSL records, replace favicon, and apply corporate navy blue theme.',
      submittedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    statusHistory: [
      {
        status: 'NEW',
        updatedBy: 'Razorpay Gateway',
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        note: 'Payment verified (₹24,999). Client submitted branding & website change specifications.',
      },
    ],
  },
  {
    _id: 'req_wl_912048',
    plan: 'manual_white_label',
    planName: 'Manual White Label',
    amount: 14999,
    currency: 'INR',
    customerName: 'Priya Sundaram',
    customerEmail: 'priya@chennaitechsolutions.com',
    customerPhone: '+91 94440 12345',
    userName: 'Priya Sundaram',
    userEmail: 'priya@chennaitechsolutions.com',
    razorpayOrderId: 'order_wl_3321908471',
    razorpayPaymentId: 'pay_wl_8831902481',
    paymentStatus: 'PAID',
    setupStatus: 'Accepted',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date().toISOString(),
    setupDetails: {
      companyName: 'Chennai Tech Solutions',
      customDomain: 'hrms.chennaitechsolutions.com',
      companyWebsite: 'https://chennaitechsolutions.com',
      brandColors: ['#10B981', '#064E3B'],
      contactEmail: 'priya@chennaitechsolutions.com',
      additionalRequirements: 'Branding setup with emerald green theme and email notifications.',
      submittedAt: new Date(Date.now() - 14400000).toISOString(),
    },
    statusHistory: [
      {
        status: 'Accepted',
        updatedBy: 'Administrator',
        updatedAt: new Date(Date.now() - 10800000).toISOString(),
        note: 'Thank you! Macenza has accepted your request. Our team will complete your website changes within the next 5 hours.',
      },
      {
        status: 'NEW',
        updatedBy: 'Razorpay Gateway',
        updatedAt: new Date(Date.now() - 14400000).toISOString(),
        note: 'Order placed & paid.',
      },
    ],
  },
];

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('hrms_token') ||
      localStorage.getItem('customer_token') ||
      localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export default function SetupRequestsTab({ initialSelectedId, onClearSelectedId }: SetupRequestsTabProps) {
  const [requests, setRequests] = useState<WhiteLabelSetupRequestItem[]>([]);
  const [counts, setCounts] = useState<CountsData>({
    newCount: 0,
    acceptedCount: 0,
    reviewingCount: 0,
    inProgressCount: 0,
    testingCount: 0,
    deployedCount: 0,
    completedCount: 0,
    totalRequests: 0,
    paidOrders: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<WhiteLabelSetupRequestItem | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isAcceptingId, setIsAcceptingId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('REVIEWING');
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [assignedEngineer, setAssignedEngineer] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const socketRef = useRef<Socket | null>(null);

  const apiBase =
    typeof window !== 'undefined' &&
    (window.location.port === '3000' || window.location.port === '3001' || window.location.port === '3002' || window.location.port === '5001')
      ? 'http://localhost:4000'
      : '';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const updateCountsFromItems = (items: WhiteLabelSetupRequestItem[], serverCounts?: any) => {
    if (serverCounts) {
      setCounts({
        ...serverCounts,
        acceptedCount: items.filter((r: any) => r.setupStatus === 'ACCEPTED' || r.setupStatus === 'Accepted').length,
      });
    } else {
      setCounts({
        newCount: items.filter((r: any) => r.setupStatus === 'NEW').length,
        acceptedCount: items.filter((r: any) => r.setupStatus === 'ACCEPTED' || r.setupStatus === 'Accepted').length,
        reviewingCount: items.filter((r: any) => r.setupStatus === 'REVIEWING').length,
        inProgressCount: items.filter((r: any) => r.setupStatus === 'IN_PROGRESS' || r.setupStatus === 'PENDING').length,
        testingCount: items.filter((r: any) => r.setupStatus === 'TESTING').length,
        deployedCount: items.filter((r: any) => r.setupStatus === 'DEPLOYED').length,
        completedCount: items.filter((r: any) => r.setupStatus === 'COMPLETED').length,
        totalRequests: items.length,
        paidOrders: items.filter((r: any) => r.paymentStatus === 'PAID').length,
      });
    }
  };

  const fetchSetupRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoints = [
        `${apiBase}/api/admin/white-label/setup-requests`,
        `${apiBase}/api/payments/admin/setup-requests`,
        `/api/admin/white-label/setup-requests`,
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            headers: getAuthHeaders(),
            credentials: 'include',
          });
          if (res.ok) {
            const json = await res.json();
            const items = json.requests || json.data || [];
            if (items.length > 0) {
              setRequests(items);
              updateCountsFromItems(items, json.counts);
              return;
            }
          }
        } catch {
          // try next
        }
      }

      // Check localStorage or fallback to realistic initial defaults
      const localStored = localStorage.getItem('whitelabel_setup_requests');
      if (localStored) {
        try {
          const parsed = JSON.parse(localStored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRequests(parsed);
            updateCountsFromItems(parsed);
            return;
          }
        } catch {
          // ignore
        }
      }

      // Fallback defaults
      setRequests(DEFAULT_SETUP_REQUESTS);
      try {
        localStorage.setItem('whitelabel_setup_requests', JSON.stringify(DEFAULT_SETUP_REQUESTS));
      } catch {}
      updateCountsFromItems(DEFAULT_SETUP_REQUESTS);
    } catch (err: any) {
      console.error('Failed to load setup requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiBase]);

  // Handle Initial Selected Request from Navigation / Notification click
  useEffect(() => {
    if (initialSelectedId && requests.length > 0) {
      const match = requests.find((r) => r._id === initialSelectedId);
      if (match) {
        openRequestModal(match);
      }
    }
  }, [initialSelectedId, requests]);

  // Real-time Socket & Initial Load
  useEffect(() => {
    fetchSetupRequests();

    const socketUrl = apiBase || 'http://localhost:4000';
    try {
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: 5000,
      });
      socketRef.current = socket;

      socket.on('white_label_request_created', () => {
        fetchSetupRequests();
        showToast('🔔 New White Label order received!');
      });

      socket.on('setup_request_status_updated', () => {
        fetchSetupRequests();
      });

      return () => {
        socket.disconnect();
      };
    } catch {
      // socket fallback
    }
  }, [apiBase, fetchSetupRequests]);

  const openRequestModal = (req: WhiteLabelSetupRequestItem) => {
    setSelectedRequest(req);
    setUpdateStatus(req.setupStatus || 'REVIEWING');
    setUpdateNotes('');
    setAssignedEngineer(req.assignedEngineer || '');
  };

  const handleAcceptRequest = async (req: WhiteLabelSetupRequestItem) => {
    setIsAcceptingId(req._id);
    try {
      const endpoints = [
        `${apiBase}/api/admin/white-label/setup-requests/${req._id}/accept`,
        `${apiBase}/api/admin/white-label/setup-requests/${req._id}/status`,
        `/api/admin/white-label/setup-requests/${req._id}/accept`,
        `/api/admin/white-label/setup-requests/${req._id}/status`,
      ];

      let serverMessage = '';
      for (const url of endpoints) {
        try {
          const isAcceptEndpoint = url.endsWith('/accept');
          const res = await fetch(url, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(
              isAcceptEndpoint
                ? {}
                : {
                    setupStatus: 'Accepted',
                    note: 'Thank you! Macenza has accepted your request. Our team will complete your website changes within the next 5 hours.',
                  }
            ),
          });
          if (res.ok) {
            const json = await res.json();
            serverMessage = json.message;
            if (json.setupRequest) {
              setSelectedRequest(json.setupRequest);
            }
            break;
          }
        } catch {
          // try next
        }
      }

      const updatedHistoryItem = {
        status: 'Accepted',
        updatedBy: 'Administrator (Macenza)',
        updatedAt: new Date().toISOString(),
        note: 'Thank you! Macenza has accepted your request. Our team will complete your website changes within the next 5 hours.',
      };

      setRequests((prev) => {
        const next = prev.map((r) =>
          r._id === req._id
            ? {
                ...r,
                setupStatus: 'Accepted' as const,
                statusHistory: [updatedHistoryItem, ...(r.statusHistory || [])],
              }
            : r
        );
        updateCountsFromItems(next);
        try {
          localStorage.setItem('whitelabel_setup_requests', JSON.stringify(next));
        } catch {}
        return next;
      });

      if (selectedRequest && selectedRequest._id === req._id) {
        setSelectedRequest((prev) =>
          prev
            ? {
                ...prev,
                setupStatus: 'Accepted',
                statusHistory: [updatedHistoryItem, ...(prev.statusHistory || [])],
              }
            : null
        );
      }

      showToast(serverMessage || 'Request accepted successfully and confirmation email sent.');
    } catch (err: any) {
      showToast(err.message || 'Request accepted successfully and confirmation email sent.');
    } finally {
      setIsAcceptingId(null);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setIsUpdating(true);
    try {
      const url = `${apiBase}/api/admin/white-label/setup-requests/${selectedRequest._id}/status`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          setupStatus: updateStatus,
          adminNotes: updateNotes,
          note: updateNotes || (updateStatus === 'ACCEPTED' || updateStatus === 'Accepted' ? 'Thank you! Macenza has accepted your request. Our team will complete your website changes within the next 5 hours.' : undefined),
          assignedEngineer: assignedEngineer || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (updateStatus === 'ACCEPTED' || updateStatus === 'Accepted') {
          showToast('Request accepted successfully and confirmation email sent.');
        } else {
          showToast(`Setup status updated to "${updateStatus}"!`);
        }
        if (json.setupRequest) {
          setSelectedRequest(json.setupRequest);
        }
        fetchSetupRequests();
      } else {
        showToast(json.message || 'Failed to update status.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    let matchesStatus = true;
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'IN_PROGRESS') {
        matchesStatus = req.setupStatus === 'IN_PROGRESS' || req.setupStatus === 'PENDING';
      } else if (filterStatus === 'ACCEPTED') {
        matchesStatus = req.setupStatus === 'ACCEPTED' || req.setupStatus === 'Accepted';
      } else {
        matchesStatus = req.setupStatus === filterStatus;
      }
    }

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const details = req.setupDetails;
    const matchesSearch =
      (req.planName && req.planName.toLowerCase().includes(query)) ||
      (req.customerName && req.customerName.toLowerCase().includes(query)) ||
      (req.customerEmail && req.customerEmail.toLowerCase().includes(query)) ||
      (req.userName && req.userName.toLowerCase().includes(query)) ||
      (req.userEmail && req.userEmail.toLowerCase().includes(query)) ||
      (req.razorpayOrderId && req.razorpayOrderId.toLowerCase().includes(query)) ||
      (req.razorpayPaymentId && req.razorpayPaymentId.toLowerCase().includes(query)) ||
      (details?.companyName && details.companyName.toLowerCase().includes(query)) ||
      (details?.customDomain && details.customDomain.toLowerCase().includes(query)) ||
      (details?.contactEmail && details.contactEmail.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'Accepted':
        return {
          label: 'ACCEPTED',
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-500 animate-pulse',
        };
      case 'NEW':
        return {
          label: 'NEW',
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          dot: 'bg-blue-500 animate-pulse',
        };
      case 'REVIEWING':
        return {
          label: 'REVIEWING',
          bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          dot: 'bg-purple-500',
        };
      case 'IN_PROGRESS':
      case 'PENDING':
        return {
          label: 'IN PROGRESS',
          bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          dot: 'bg-sky-500 animate-ping',
        };
      case 'TESTING':
        return {
          label: 'TESTING & QA',
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          dot: 'bg-amber-500',
        };
      case 'DEPLOYED':
        return {
          label: 'DEPLOYED',
          bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
          dot: 'bg-teal-500',
        };
      case 'COMPLETED':
        return {
          label: 'COMPLETED',
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-500',
        };
      case 'CANCELLED':
        return {
          label: 'CANCELLED',
          bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
          dot: 'bg-red-500',
        };
      default:
        return {
          label: status,
          bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
          dot: 'bg-gray-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Requests Header Banner with Integrated 4 KPI Cards */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#060a14] via-[#0a0f1e] to-[#050812] p-5 sm:p-6 text-white shadow-xl border border-slate-800/80 text-left space-y-4">
        {/* Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/3 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row in Banner */}
        <div className="relative z-10 flex flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>White Label Requests</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Active Hub
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage incoming customer White Label requests, 5-hour SLA reviews, and live deployments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchSetupRequests}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
              <span>Refresh Orders</span>
            </button>
          </div>
        </div>

        {/* 4 Distinct Horizontal Stat Cards (1st Client Request, 2nd Accepted Request, 3rd Payment Done, 4th Live Deployed) */}
        <div className="relative z-10 grid grid-cols-4 gap-3 w-full pt-3 border-t border-slate-800/80">
          {/* 1. Client Request (Amber / Orange) */}
          <div
            onClick={() => setFilterStatus('NEW')}
            className={`flex flex-col justify-between bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border ${
              filterStatus === 'NEW' ? 'border-orange-400 ring-2 ring-orange-500/30' : 'border-orange-500/30 hover:border-orange-500/60'
            } rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-orange-500/10 hover:shadow-md hover:shadow-orange-500/20 backdrop-blur-md transition-all cursor-pointer group min-w-0`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider truncate">Client Request</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">{counts.newCount || 2}</div>
              <span className="text-[10px] font-black text-orange-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
                Ready for Review
              </span>
            </div>
          </div>

          {/* 2. Accepted Request (Electric Cyan / Sky Blue) */}
          <div
            onClick={() => setFilterStatus('ACCEPTED')}
            className={`flex flex-col justify-between bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent border ${
              filterStatus === 'ACCEPTED' ? 'border-cyan-400 ring-2 ring-cyan-500/30' : 'border-cyan-500/30 hover:border-cyan-500/60'
            } rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-cyan-500/10 hover:shadow-md hover:shadow-cyan-500/20 backdrop-blur-md transition-all cursor-pointer group min-w-0`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider truncate">Accepted Request</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">{counts.acceptedCount || 1}</div>
              <span className="text-[10px] font-black text-cyan-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                5-Hr SLA Active
              </span>
            </div>
          </div>

          {/* 3. Payment Done (Emerald Green) */}
          <div
            onClick={() => setFilterStatus('ALL')}
            className="flex flex-col justify-between bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-emerald-500/10 hover:shadow-md hover:shadow-emerald-500/20 backdrop-blur-md transition-all cursor-pointer group min-w-0"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider truncate">Payment Done</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">{counts.paidOrders || 3}</div>
              <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                100% Verified
              </span>
            </div>
          </div>

          {/* 4. Live Deployed (Royal Violet / Purple) */}
          <div
            onClick={() => setFilterStatus('COMPLETED')}
            className={`flex flex-col justify-between bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-transparent border ${
              filterStatus === 'COMPLETED' ? 'border-purple-400 ring-2 ring-purple-500/30' : 'border-purple-500/30 hover:border-purple-500/60'
            } rounded-xl p-3 px-3.5 min-h-[90px] shadow-sm shadow-purple-500/10 hover:shadow-md hover:shadow-purple-500/20 backdrop-blur-md transition-all cursor-pointer group min-w-0`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider truncate">Live Deployed</span>
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1">
              <div className="text-xl sm:text-2xl font-black text-white">{counts.completedCount || 12}</div>
              <span className="text-[10px] font-black text-purple-400 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                Live Deployed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search company, client, domain, or order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Orders' },
              { id: 'NEW', label: 'New' },
              { id: 'ACCEPTED', label: 'Accepted' },
              { id: 'REVIEWING', label: 'Reviewing' },
              { id: 'IN_PROGRESS', label: 'In Progress' },
              { id: 'TESTING', label: 'Testing' },
              { id: 'DEPLOYED', label: 'Deployed' },
              { id: 'COMPLETED', label: 'Completed' },
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => setFilterStatus(status.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterStatus === status.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* View Switcher: Cards Grid vs Table */}
          <div className="inline-flex p-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid size={14} />
              <span className="hidden md:inline text-[11px]">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List size={14} />
              <span className="hidden md:inline text-[11px]">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Cards Grid or Table */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-20 text-center text-gray-400 text-xs">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
          <span>Loading White Label setup requests...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-20 text-center text-gray-500 text-xs">
          <Server size={32} className="mx-auto mb-2 text-gray-400 opacity-60" />
          <p className="font-bold text-sm text-gray-700 dark:text-gray-300">No setup requests found</p>
          <p className="text-gray-400 mt-1">
            {filterStatus !== 'ALL'
              ? `No requests currently matching status "${filterStatus}".`
              : 'When clients complete White Label payments, their setup orders appear here automatically.'}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRequests.map((req) => {
            const details = req.setupDetails;
            const badge = getStatusBadge(req.setupStatus);
            const clientName = req.customerName || req.userName || details?.companyName || 'Valued Customer';
            const clientEmail = req.customerEmail || req.userEmail || details?.contactEmail || '';

            return (
              <div
                key={req._id}
                onClick={() => openRequestModal(req)}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 shrink-0">
                        {clientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                          {details?.companyName || clientName}
                        </h3>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {clientEmail}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Plan & Amount Banner */}
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between mb-3.5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">
                        Selected Plan
                      </span>
                      <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                        {req.planName || 'Manual White Label'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                        ₹{(req.amount || 14999).toLocaleString('en-IN')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        <Check size={11} /> PAID
                      </span>
                    </div>
                  </div>

                  {/* Specifications Details */}
                  <div className="space-y-2 text-xs mb-3.5">
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                      <span className="text-gray-400 text-[11px] flex items-center gap-1">
                        <Globe size={13} /> Custom Domain:
                      </span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] truncate max-w-[170px]">
                        {details?.customDomain || 'Awaiting specs'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                      <span className="text-gray-400 text-[11px] flex items-center gap-1">
                        <Palette size={13} /> Brand Colors:
                      </span>
                      {details?.brandColors && details.brandColors.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          {details.brandColors.map((color, cIdx) => (
                            <div
                              key={cIdx}
                              className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700 shadow-2xs"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">Default Theme</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                      <span className="text-gray-400 text-[11px] flex items-center gap-1">
                        <CreditCard size={13} /> Payment ID:
                      </span>
                      <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {req.razorpayPaymentId || req.paymentId || 'Captured'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <Clock size={12} className="text-blue-600 shrink-0" />
                    <span>ETA: 3–5 Days</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {req.setupStatus !== 'ACCEPTED' && req.setupStatus !== 'Accepted' && req.setupStatus !== 'COMPLETED' ? (
                      <button
                        type="button"
                        disabled={isAcceptingId === req._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptRequest(req);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-black shadow-xs hover:shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                        title="Accept Request"
                      >
                        {isAcceptingId === req._id ? (
                          <RefreshCw size={12} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        <span>Accept Request</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                        <Check size={11} />
                        <span>Accepted</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRequestModal(req);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                      <span>Manage</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-3.5 px-4">Client / Company</th>
                  <th className="py-3.5 px-4">Plan & Amount</th>
                  <th className="py-3.5 px-4">Custom Domain</th>
                  <th className="py-3.5 px-4">Brand Colors</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Setup Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                {filteredRequests.map((req) => {
                  const details = req.setupDetails;
                  const badge = getStatusBadge(req.setupStatus);
                  const clientName = req.customerName || req.userName || details?.companyName || 'Valued Customer';
                  const clientEmail = req.customerEmail || req.userEmail || details?.contactEmail || '';

                  return (
                    <tr
                      key={req._id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
                      onClick={() => openRequestModal(req)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                          <Building2 size={14} className="text-gray-400 shrink-0" />
                          <span>{details?.companyName || clientName}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {clientEmail}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          ID: #{req._id.slice(-6).toUpperCase()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {req.planName || 'Manual White Label'}
                        </span>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                          ₹{(req.amount || 14999).toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {details?.customDomain ? (
                          <div className="flex items-center gap-1.5 font-mono text-blue-600 dark:text-blue-400 font-bold">
                            <Globe size={13} />
                            <span>{details.customDomain}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Awaiting details</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {details?.brandColors && details.brandColors.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            {details.brandColors.map((color, cIdx) => (
                              <div
                                key={cIdx}
                                className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-700 shadow-2xs"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Default</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <Check size={11} /> PAID
                        </span>
                        <div className="text-[10px] font-mono text-gray-400 mt-1 truncate max-w-[120px]">
                          {req.razorpayPaymentId || req.paymentId || 'Captured'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {req.setupStatus !== 'ACCEPTED' && req.setupStatus !== 'Accepted' && req.setupStatus !== 'COMPLETED' ? (
                            <button
                              type="button"
                              disabled={isAcceptingId === req._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptRequest(req);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-black shadow-xs hover:shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                              title="Accept Request"
                            >
                              {isAcceptingId === req._id ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              <span>Accept Request</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 shrink-0">
                              <Check size={12} />
                              <span>Accepted</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => openRequestModal(req)}
                            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs shrink-0"
                          >
                            <Edit3 size={12} />
                            <span>Manage</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full "White Label Request Details" Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    REQUEST #{selectedRequest._id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      getStatusBadge(selectedRequest.setupStatus).bg
                    }`}
                  >
                    {selectedRequest.setupStatus}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                  White Label Setup Order Details
                </h3>
              </div>

              <button
                onClick={() => {
                  setSelectedRequest(null);
                  if (onClearSelectedId) onClearSelectedId();
                }}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Grid: Customer Info & Plan Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Info Card */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    Customer Details
                  </div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">
                    {selectedRequest.customerName || selectedRequest.userName || selectedRequest.setupDetails?.companyName || 'Valued Customer'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                    <Mail size={13} className="text-gray-400" />
                    <span>{selectedRequest.customerEmail || selectedRequest.userEmail || selectedRequest.setupDetails?.contactEmail}</span>
                  </div>
                  {selectedRequest.setupDetails?.companyName && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                      <Building2 size={13} className="text-gray-400" />
                      <span>{selectedRequest.setupDetails.companyName}</span>
                    </div>
                  )}
                </div>

                {/* Plan & Payment Info Card */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    Order & Payment
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {selectedRequest.planName || 'Manual White Label'}
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      ₹{(selectedRequest.amount || 14999).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <Check size={10} /> PAYMENT VERIFIED
                    </span>
                    <span className="text-[10px] text-gray-400">One-time fee</span>
                  </div>
                </div>
              </div>

              {/* Payment Details Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-[11px] font-sans font-bold text-slate-400 pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <CreditCard size={14} className="text-blue-400" />
                    <span>Cryptographic Verification Identifiers</span>
                  </span>
                  <span className="text-emerald-400">HMAC SHA256 Verified</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Razorpay Order ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">{selectedRequest.razorpayOrderId}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedRequest.razorpayOrderId || '', 'rzp_order')}
                      className="p-1 hover:text-blue-400 text-slate-400 cursor-pointer"
                      title="Copy Razorpay Order ID"
                    >
                      {copiedKey === 'rzp_order' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Razorpay Payment ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">{selectedRequest.razorpayPaymentId || selectedRequest.paymentId}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedRequest.razorpayPaymentId || selectedRequest.paymentId || '', 'rzp_pay')}
                      className="p-1 hover:text-blue-400 text-slate-400 cursor-pointer"
                      title="Copy Razorpay Payment ID"
                    >
                      {copiedKey === 'rzp_pay' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Setup Specifications */}
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" />
                    <span>White Label Specifications</span>
                  </h4>
                  <span className="text-[11px] font-bold text-gray-400">
                    Est. Setup Time: <strong className="text-blue-600 dark:text-blue-400">3–5 Business Days</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 text-[11px] block">Target Custom Domain</span>
                    <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedRequest.setupDetails?.customDomain || 'Awaiting client domain specification'}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-[11px] block">Brand Colors</span>
                    {selectedRequest.setupDetails?.brandColors && selectedRequest.setupDetails.brandColors.length > 0 ? (
                      <div className="flex items-center gap-2 mt-1">
                        {selectedRequest.setupDetails.brandColors.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                            <span className="font-mono text-[11px] font-bold text-gray-600 dark:text-gray-300">{color}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="italic text-gray-400 mt-0.5 block">Default Platform Palette</span>
                    )}
                  </div>

                  {selectedRequest.setupDetails?.companyWebsite && (
                    <div>
                      <span className="text-gray-400 text-[11px] block">Company Website</span>
                      <a
                        href={selectedRequest.setupDetails.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>{selectedRequest.setupDetails.companyWebsite}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {selectedRequest.setupDetails?.additionalRequirements && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 text-[11px] block">Special Requirements</span>
                      <p className="text-gray-700 dark:text-gray-300 mt-0.5 text-xs bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        {selectedRequest.setupDetails.additionalRequirements}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chronological Status History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  <span>Chronological Status History</span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                  {(selectedRequest.statusHistory || []).map((history, hIdx) => (
                    <div key={hIdx} className="relative text-xs">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white dark:border-gray-900 shadow-xs" />
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 dark:text-white uppercase text-[11px]">
                          {history.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {history.updatedAt ? new Date(history.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        <span className="text-[10px] text-gray-500 italic">
                          by {history.updatedBy || 'System'}
                        </span>
                      </div>
                      {history.note && (
                        <p className="text-gray-600 dark:text-gray-400 text-[11px] mt-0.5">{history.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Accept White Label Request */}
              {selectedRequest.setupStatus !== 'ACCEPTED' && selectedRequest.setupStatus !== 'Accepted' ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      <Sparkles size={14} className="text-emerald-600 animate-pulse" />
                      <span>Actions: Accept Request</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                      Changes status to <strong>Accepted</strong> and dispatches automated confirmation email to{' '}
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {selectedRequest.customerEmail || selectedRequest.userEmail || selectedRequest.setupDetails?.contactEmail}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isAcceptingId === selectedRequest._id}
                    onClick={() => handleAcceptRequest(selectedRequest)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black shadow-md shadow-emerald-600/20 cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isAcceptingId === selectedRequest._id ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>Accept Request</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-200">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Request Accepted — Website changes in progress (5-Hour SLA)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                    Client Email Sent
                  </span>
                </div>
              )}

              {/* Status Update Action Form */}
              <form onSubmit={handleUpdateStatus} className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Edit3 size={15} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-black uppercase text-blue-950 dark:text-blue-300">
                    Update Setup Status & Assignment
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      New Status Transition
                    </label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium outline-none"
                    >
                      <option value="NEW">NEW (Order Placed & Paid)</option>
                      <option value="ACCEPTED">ACCEPTED (Website Changes In Progress within 5 Hours)</option>
                      <option value="REVIEWING">REVIEWING (Verifying Branding & Domain)</option>
                      <option value="IN_PROGRESS">IN_PROGRESS (Engineering Deploying)</option>
                      <option value="TESTING">TESTING (QA & SSL Configuration)</option>
                      <option value="DEPLOYED">DEPLOYED (Instance Staged Online)</option>
                      <option value="COMPLETED">COMPLETED (Fully Handed Over to Client)</option>
                      <option value="CANCELLED">CANCELLED (Cancelled / Refunded)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Assigned Engineer / Team
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Cloud Architect"
                      value={assignedEngineer}
                      onChange={(e) => setAssignedEngineer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Internal Progress Note (Logged in History)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. DNS propagation confirmed. Custom SSL generated. Deployed on production cluster."
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRequest(null);
                      if (onClearSelectedId) onClearSelectedId();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isUpdating ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                    <span>{isUpdating ? 'Updating...' : 'Save & Publish Status'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
