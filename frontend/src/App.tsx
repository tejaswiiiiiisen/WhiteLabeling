'use client';
import React, { useState } from 'react';
import { WhitelabelProvider } from './context/WhitelabelContext';
import { SuperAdminProvider } from './context/SuperAdminContext';
import WhiteLabelAccessManager from './components/projectAccess/WhiteLabelAccessManager';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import { Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [suiteMode, setSuiteMode] = useState<'project-access' | 'super-admin'>('project-access');

  const apiBase =
    typeof window !== 'undefined' && window.location.port === '3001'
      ? 'http://localhost:5001'
      : '';

  return (
    <WhitelabelProvider apiBaseUrl={apiBase}>
      <SuperAdminProvider apiBaseUrl={apiBase}>
        <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col">
          {/* Main Viewport Container */}
          <div className="flex-1 w-full flex min-h-0">
            <WhiteLabelAccessManager apiBaseUrl={apiBase} />
          </div>
        </div>
      </SuperAdminProvider>
    </WhitelabelProvider>
  );
}
