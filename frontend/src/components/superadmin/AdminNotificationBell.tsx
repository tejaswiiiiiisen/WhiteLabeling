'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check, CheckCheck, ExternalLink, Sparkles, AlertCircle, RefreshCw, X, Clock } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useSuperAdmin } from '../../context/SuperAdminContext';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

interface AdminNotificationBellProps {
  onSelectRequest?: (requestId: string) => void;
}

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

export default function AdminNotificationBell({ onSelectRequest }: AdminNotificationBellProps) {
  const superAdmin = useSuperAdmin();
  const setActiveTab = superAdmin?.setActiveTab;
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const apiBase =
    typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3001' || window.location.port === '3002' || window.location.port === '5001')
      ? 'http://localhost:4000'
      : '';

  // 1. Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const endpoints = [
        `${apiBase}/api/notifications`,
        `${apiBase}/api/admin/notifications`,
        `/api/notifications`,
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            headers: getAuthHeaders(),
            credentials: 'include',
          });
          if (res.ok) {
            const json = await res.json();
            const items = json.data || json.notifications || [];
            setNotifications(items);
            const unread = items.filter((n: NotificationItem) => !n.isRead).length;
            setUnreadCount(unread);
            return;
          }
        } catch {
          // try next
        }
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  }, [apiBase]);

  // 2. Mark Single Notification Read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const url = `${apiBase}/api/notifications/${notificationId}/read`;
      await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // 3. Mark All As Read
  const handleMarkAllRead = async () => {
    try {
      const url = `${apiBase}/api/notifications/read-all`;
      await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNavigateToRequest = (item: NotificationItem) => {
    handleMarkAsRead(item._id);
    setIsOpen(false);
    if (setActiveTab) {
      setActiveTab('setup-requests');
    }

    const reqId =
      item.referenceId ||
      (item.link?.match(/requestId=([a-f\d]+)/i)?.[1]) ||
      (item.link?.match(/id=([a-f\d]+)/i)?.[1]) ||
      '';

    if (onSelectRequest) {
      onSelectRequest(reqId);
    }
  };

  // 5. Real-Time Socket Connection & Fallback Polling
  useEffect(() => {
    fetchNotifications();

    const socketUrl = apiBase || 'http://localhost:4000';
    try {
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: 5000,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        // Socket connected
      });

      socket.on('new_notification', (newNotif: NotificationItem) => {
        setNotifications((prev) => [newNotif, ...prev.filter((n) => n._id !== newNotif._id)]);
        setUnreadCount((prev) => prev + 1);
      });

      socket.on('white_label_request_created', () => {
        fetchNotifications();
      });

      socket.on('setup_request_status_updated', () => {
        fetchNotifications();
      });

      return () => {
        socket.disconnect();
      };
    } catch {
      // socket init fallback
    }

    // Backup polling every 20 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 20000);

    return () => clearInterval(interval);
  }, [apiBase, fetchNotifications]);

  // 6. Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayedNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        title="Notifications"
        aria-label="Admin Notifications"
      >
        <Bell className="w-4 h-4" />

        {/* Counter Badge with Pulse */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 rounded-full bg-red-600 text-white text-[10px] font-black shadow-md border-2 border-white dark:border-gray-900 animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                Admin Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <button
              type="button"
              onClick={fetchNotifications}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
              title="Refresh"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {displayedNotifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-400" />
                <p className="font-bold text-gray-600 dark:text-gray-400">No notifications yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Incoming White Label orders and payment alerts appear here.
                </p>
              </div>
            ) : (
              displayedNotifications.map((item) => {
                const isWhiteLabel = item.type === 'WHITE_LABEL_REQUEST' || item.title.includes('White Label');

                return (
                  <div
                    key={item._id}
                    className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                      !item.isRead ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                          isWhiteLabel
                            ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {isWhiteLabel ? <Sparkles className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          )}
                        </div>

                        <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>

                        <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-gray-100/60 dark:border-gray-800/60">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(item.createdAt)}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Mark Read */}
                            {!item.isRead && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsRead(item._id)}
                                className="text-[10px] font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                              >
                                Mark read
                              </button>
                            )}

                            {/* View Request Link */}
                            {isWhiteLabel && (
                              <button
                                type="button"
                                onClick={() => handleNavigateToRequest(item)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                              >
                                <span>View Request</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (setActiveTab) setActiveTab('setup-requests');
                if (onSelectRequest) onSelectRequest('');
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Open White Label Requests Manager →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
