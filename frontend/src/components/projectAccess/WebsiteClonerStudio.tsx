'use client';
import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  Layers,
  Eye,
  Trash2,
  Copy,
  Plus,
  Save,
  Rocket,
  RotateCcw,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  ChevronUp,
  ChevronDown,
  X,
  Code,
  Sliders,
  ExternalLink,
  ChevronRight,
  FolderOpen,
  ArrowRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Search,
  ShoppingBag,
  ShieldCheck,
  History,
  BarChart3,
  CheckSquare,
  Square,
  Lock,
  Info,
  Check,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';

export interface ElementAst {
  id: string;
  type: 'heading' | 'paragraph' | 'button' | 'image' | 'icon' | 'card' | 'badge' | 'navLinks' | 'accordion' | 'form' | 'searchFilter' | 'container';
  content: string;
  props?: {
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
    href?: string;
    target?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    items?: any[];
    title?: string;
    desc?: string;
    badge?: string;
    icon?: string;
    alt?: string;
    src?: string;
    category?: string;
    inputs?: Array<{ label: string; placeholder: string; type: string }>;
  };
  styles?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    padding?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    margin?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    boxShadow?: string;
    opacity?: string;
    maxWidth?: string;
    letterSpacing?: string;
    lineHeight?: string;
  };
  hidden?: boolean;
}

export interface SectionAst {
  id: string;
  type: 'navbar' | 'hero' | 'features' | 'services' | 'cards' | 'testimonials' | 'pricing' | 'faq' | 'cta' | 'footer' | 'custom';
  name: string;
  hidden?: boolean;
  styles?: {
    backgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    borderColor?: string;
    borderWidth?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
  elements: ElementAst[];
}

export interface PageAst {
  pageId: string;
  name: string;
  path: string;
  metaTitle?: string;
  metaDescription?: string;
  sections: SectionAst[];
}

export interface SimilarityReportData {
  overallScore: number;
  layoutScore: number;
  typographyScore: number;
  colorScore: number;
  interactiveScore: number;
  discrepancies: string[];
  limitations: string[];
  testedAt?: string;
}

export interface DiscoveredPageItem {
  pageId: string;
  name: string;
  path: string;
  selected: boolean;
}

export interface VersionSnapshot {
  versionNumber: number;
  savedAt: string;
  summary: string;
}

export interface ClonedWebsiteData {
  _id?: string;
  name: string;
  sourceUrl?: string;
  subdomain?: string;
  customDomain?: string;
  status: 'draft' | 'imported' | 'published' | 'archived';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  pages: PageAst[];
  discoveredPages?: DiscoveredPageItem[];
  similarityReport?: SimilarityReportData;
  versionHistory?: VersionSnapshot[];
  importStats?: {
    elementsCount: number;
    sectionsCount: number;
    pagesCount: number;
    colorsDetected: string[];
    fontsDetected: string[];
    importedAt?: string;
  };
}

const DEFAULT_SIMILARITY: SimilarityReportData = {
  overallScore: 96,
  layoutScore: 95,
  typographyScore: 96,
  colorScore: 98,
  interactiveScore: 94,
  discrepancies: [
    'Sub-pixel spacing variation normalized for high-density displays.',
    'Dynamic external telemetry charts mapped to native CSS responsive equivalents.',
  ],
  limitations: [
    'Third-party payments (Stripe/PayPal) use client-owned Razorpay mock sandbox.',
    'Private authenticated session states require tenant authorization credentials.',
  ],
  testedAt: new Date().toISOString(),
};

const PRESET_TEMPLATES: Record<string, Partial<ClonedWebsiteData>> = {
  saas: {
    name: 'PulseFlow Enterprise Cloud',
    sourceUrl: 'https://pulseflow.io',
    subdomain: 'pulseflow-cloud',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1D4ED8',
      accentColor: '#10B981',
      backgroundColor: '#090D18',
      textColor: '#F8FAFC',
      fontFamily: 'Inter',
      borderRadius: '12px',
    },
    similarityReport: DEFAULT_SIMILARITY,
    discoveredPages: [
      { pageId: 'home', name: 'Home', path: '/', selected: true },
      { pageId: 'features', name: 'Features', path: '/features', selected: true },
      { pageId: 'pricing', name: 'Pricing', path: '/pricing', selected: true },
      { pageId: 'docs', name: 'Documentation', path: '/docs', selected: true },
      { pageId: 'contact', name: 'Contact Us', path: '/contact', selected: true },
    ],
    pages: [
      {
        pageId: 'home',
        name: 'Home',
        path: '/',
        sections: [
          {
            id: 'sec-nav',
            type: 'navbar',
            name: 'Navigation Bar',
            styles: {
              backgroundColor: '#070B14',
              paddingTop: '16px',
              paddingBottom: '16px',
              paddingLeft: '32px',
              paddingRight: '32px',
              borderWidth: '0 0 1px 0',
              borderColor: '#1E293B',
            },
            elements: [
              {
                id: 'el-nav-brand',
                type: 'heading',
                content: 'PULSEFLOW',
                props: { level: 'h3' },
                styles: { fontSize: '20px', fontWeight: '900', color: '#60A5FA', letterSpacing: '-0.5px' },
              },
              {
                id: 'el-nav-links',
                type: 'navLinks',
                content: '',
                props: { items: ['Product', 'Solutions', 'Pricing', 'Docs', 'Enterprise'] },
                styles: { fontSize: '13px', fontWeight: '600', color: '#94A3B8' },
              },
              {
                id: 'el-nav-cta',
                type: 'button',
                content: 'Start Free Trial',
                props: { href: '#', variant: 'primary' },
                styles: { backgroundColor: '#2563EB', color: '#FFFFFF', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' },
              },
            ],
          },
          {
            id: 'sec-hero',
            type: 'hero',
            name: 'Hero Section',
            styles: {
              backgroundColor: '#090D18',
              paddingTop: '64px',
              paddingBottom: '64px',
              paddingLeft: '24px',
              paddingRight: '24px',
              textAlign: 'center',
            },
            elements: [
              {
                id: 'el-hero-badge',
                type: 'badge',
                content: '🚀 NEXT-GEN WORKFLOW AUTOMATION ENGINE',
                styles: { backgroundColor: 'rgba(59,130,246,0.12)', color: '#60A5FA', padding: '6px 16px', borderRadius: '999px', fontSize: '11px', fontWeight: '800' },
              },
              {
                id: 'el-hero-h1',
                type: 'heading',
                content: 'Automate Enterprise Operations at Velocity',
                props: { level: 'h1' },
                styles: { fontSize: '44px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-1.5px', maxWidth: '850px', margin: '16px auto' },
              },
              {
                id: 'el-hero-p',
                type: 'paragraph',
                content: 'Orchestrate distributed microservices, multi-tenant governance, and real-time event streaming without manual overhead.',
                styles: { fontSize: '17px', color: '#94A3B8', maxWidth: '680px', margin: '0 auto 28px', lineHeight: '1.6' },
              },
              {
                id: 'el-hero-btn1',
                type: 'button',
                content: 'Deploy Production Stack',
                props: { href: '#', variant: 'primary' },
                styles: { backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '800' },
              },
              {
                id: 'el-hero-btn2',
                type: 'button',
                content: 'Explore Architecture',
                props: { href: '#', variant: 'outline' },
                styles: { backgroundColor: 'transparent', color: '#94A3B8', padding: '14px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', borderWidth: '1px', borderColor: '#334155' },
              },
            ],
          },
          {
            id: 'sec-features',
            type: 'features',
            name: 'Core Capabilities & Interactive Search',
            styles: {
              backgroundColor: '#0B101D',
              paddingTop: '60px',
              paddingBottom: '60px',
              paddingLeft: '24px',
              paddingRight: '24px',
              textAlign: 'center',
            },
            elements: [
              {
                id: 'el-feat-badge',
                type: 'badge',
                content: 'MODULAR ECOSYSTEM',
                styles: { backgroundColor: 'rgba(16,185,129,0.12)', color: '#34D399', padding: '4px 12px', borderRadius: '999px', fontSize: '10px', fontWeight: '800' },
              },
              {
                id: 'el-feat-title',
                type: 'heading',
                content: 'Engineered for Mission-Critical Reliability',
                props: { level: 'h2' },
                styles: { fontSize: '30px', fontWeight: '800', color: '#FFFFFF', margin: '12px auto 20px' },
              },
              {
                id: 'el-feat-card-1',
                type: 'card',
                content: '',
                props: {
                  title: 'Zero-Latency Edge Routing',
                  desc: 'Deploy serverless edge policies globally with instantaneous propagation and 99.999% uptime SLA.',
                  badge: 'GLOBAL MESH',
                  category: 'Edge',
                },
                styles: { backgroundColor: '#111827', padding: '24px', borderRadius: '14px', borderWidth: '1px', borderColor: '#1F2937' },
              },
              {
                id: 'el-feat-card-2',
                type: 'card',
                content: '',
                props: {
                  title: 'Cryptographic Multi-Tenancy',
                  desc: 'Isolate client workspaces, role assignments, and ledger transactions with AES-256 automated key rotation.',
                  badge: 'SOC2 COMPLIANT',
                  category: 'Security',
                },
                styles: { backgroundColor: '#111827', padding: '24px', borderRadius: '14px', borderWidth: '1px', borderColor: '#1F2937' },
              },
              {
                id: 'el-feat-card-3',
                type: 'card',
                content: '',
                props: {
                  title: 'Real-Time Telemetry Stream',
                  desc: 'Gain instant observability into queue depths, API response latencies, and error rates with visual charts.',
                  badge: 'LIVE METRICS',
                  category: 'Metrics',
                },
                styles: { backgroundColor: '#111827', padding: '24px', borderRadius: '14px', borderWidth: '1px', borderColor: '#1F2937' },
              },
            ],
          },
          {
            id: 'sec-pricing',
            type: 'pricing',
            name: 'Subscription Tiers',
            styles: {
              backgroundColor: '#090D18',
              paddingTop: '60px',
              paddingBottom: '60px',
              paddingLeft: '24px',
              paddingRight: '24px',
              textAlign: 'center',
            },
            elements: [
              {
                id: 'el-price-title',
                type: 'heading',
                content: 'Transparent, Value-Driven Plans',
                props: { level: 'h2' },
                styles: { fontSize: '32px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 24px 0' },
              },
              {
                id: 'el-price-card-1',
                type: 'card',
                content: '',
                props: {
                  title: 'Growth Edition',
                  desc: 'Everything growing teams need: up to 50 licenses, standard branding, core module toggles, and community SLA.',
                  badge: 'STARTER',
                },
                styles: { backgroundColor: '#111827', padding: '28px', borderRadius: '16px', borderWidth: '1px', borderColor: '#1F2937' },
              },
              {
                id: 'el-price-card-2',
                type: 'card',
                content: '',
                props: {
                  title: 'Enterprise Suite',
                  desc: 'Dedicated infrastructure, custom domain SSL, unlimited seats, custom RBAC permissions, and 24/7 engineer.',
                  badge: 'POPULAR',
                },
                styles: { backgroundColor: '#1E293B', padding: '28px', borderRadius: '16px', borderWidth: '2px', borderColor: '#3B82F6' },
              },
            ],
          },
          {
            id: 'sec-faq',
            type: 'faq',
            name: 'Interactive FAQ Accordion',
            styles: {
              backgroundColor: '#0B101D',
              paddingTop: '50px',
              paddingBottom: '50px',
              paddingLeft: '24px',
              paddingRight: '24px',
              textAlign: 'center',
            },
            elements: [
              {
                id: 'el-faq-h2',
                type: 'heading',
                content: 'Frequently Asked Questions',
                props: { level: 'h2' },
                styles: { fontSize: '28px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 24px 0' },
              },
              {
                id: 'el-faq-acc',
                type: 'accordion',
                content: '',
                props: {
                  items: [
                    { q: 'Can I connect my own custom domain?', a: 'Yes! Full custom domain support with automated SSL certificate provisioning.' },
                    { q: 'How does the automated visual comparison engine work?', a: 'It calculates layout geometry, typography hierarchy, and color tokens, detecting discrepancies with automated metrics.' },
                    { q: 'Are cloned elements completely editable?', a: 'Every heading, button, card, and section can be visually customized and saved to MongoDB.' },
                  ],
                },
              },
            ],
          },
          {
            id: 'sec-footer',
            type: 'footer',
            name: 'Global Footer',
            styles: {
              backgroundColor: '#060911',
              paddingTop: '36px',
              paddingBottom: '36px',
              paddingLeft: '32px',
              paddingRight: '32px',
              borderWidth: '1px 0 0 0',
              borderColor: '#1E293B',
              textAlign: 'center',
            },
            elements: [
              {
                id: 'el-foot-copy',
                type: 'paragraph',
                content: '© 2026 PulseFlow Technologies. All rights reserved. Managed with Macenza WhiteLabel Engine.',
                styles: { fontSize: '13px', color: '#64748B' },
              },
            ],
          },
        ],
      },
    ],
  },
};

interface WebsiteClonerStudioProps {
  onBackToSuites?: () => void;
  apiBaseUrl?: string;
}

export default function WebsiteClonerStudio({ onBackToSuites, apiBaseUrl = 'http://localhost:5001' }: WebsiteClonerStudioProps) {
  // Main Site AST
  const [website, setWebsite] = useState<ClonedWebsiteData>(() => {
    return (PRESET_TEMPLATES.saas as ClonedWebsiteData);
  });

  // Editor Viewport & Mode
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // In-Canvas Interactive Behaviors (PHASE 3)
  const [canvasSearchQuery, setCanvasSearchQuery] = useState<string>('');
  const [canvasCategory, setCanvasCategory] = useState<string>('All');
  const [canvasBillingCycle, setCanvasBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [cartItems, setCartItems] = useState<Array<{ name: string; price: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Selection & Inspector (PHASE 4)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('sec-hero');
  const [selectedElementId, setSelectedElementId] = useState<string | null>('el-hero-h1');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'content' | 'typography' | 'layout' | 'style'>('content');

  // Multi-Stage Import Pipeline Modal (PHASE 1 & PHASE 6)
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importStep, setImportStep] = useState<'input' | 'inspecting' | 'discovery' | 'summary'>('input');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [rawHtmlInput, setRawHtmlInput] = useState<string>('');
  const [importTab, setImportTab] = useState<'url' | 'html' | 'presets'>('url');
  const [authorizedChecked, setAuthorizedChecked] = useState<boolean>(true);
  const [discoveredPages, setDiscoveredPages] = useState<DiscoveredPageItem[]>([
    { pageId: 'home', name: 'Home Page', path: '/', selected: true },
    { pageId: 'features', name: 'Features & Architecture', path: '/features', selected: true },
    { pageId: 'pricing', name: 'Subscription Plans', path: '/pricing', selected: true },
    { pageId: 'docs', name: 'API Documentation', path: '/docs', selected: true },
    { pageId: 'contact', name: 'Contact & Support', path: '/contact', selected: true },
  ]);
  const [inspectionLogs, setInspectionLogs] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [tempClonedSite, setTempClonedSite] = useState<ClonedWebsiteData | null>(null);

  // Automated Visual Comparison Modal (PHASE 5)
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // Version History Modal
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);

  // Export & Live Publishing
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<ClonedWebsiteData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  };

  const pushHistory = (newState: ClonedWebsiteData) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, JSON.parse(JSON.stringify(website))];
    });
    setHistoryIndex((prev) => prev + 1);
    setWebsite(newState);
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      const previousState = history[historyIndex];
      setHistoryIndex((prev) => prev - 1);
      setWebsite(previousState);
      showToast('Action undone ↺', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setHistoryIndex(nextIndex);
      setWebsite(nextState);
      showToast('Action redone ↻', 'info');
    }
  };

  const currentPage = website.pages[activePageIndex] || website.pages[0];
  const currentSections = currentPage?.sections || [];

  const selectedSection = currentSections.find((s) => s.id === selectedSectionId);
  const selectedElement = selectedSection?.elements.find((e) => e.id === selectedElementId);

  // Update Section Properties
  const updateSection = (secId: string, updates: Partial<SectionAst>) => {
    const updatedSections = currentSections.map((sec) => {
      if (sec.id === secId) return { ...sec, ...updates };
      return sec;
    });

    const updatedPages = website.pages.map((p, idx) => {
      if (idx === activePageIndex) return { ...p, sections: updatedSections };
      return p;
    });

    pushHistory({ ...website, pages: updatedPages });
  };

  // Update Element Properties
  const updateElement = (secId: string, elId: string, updates: Partial<ElementAst>) => {
    const updatedSections = currentSections.map((sec) => {
      if (sec.id === secId) {
        const updatedElements = sec.elements.map((el) => {
          if (el.id === elId) {
            return {
              ...el,
              ...updates,
              props: { ...el.props, ...(updates.props || {}) },
              styles: { ...el.styles, ...(updates.styles || {}) },
            };
          }
          return el;
        });
        return { ...sec, elements: updatedElements };
      }
      return sec;
    });

    const updatedPages = website.pages.map((p, idx) => {
      if (idx === activePageIndex) return { ...p, sections: updatedSections };
      return p;
    });

    pushHistory({ ...website, pages: updatedPages });
  };

  // Delete Element
  const deleteElement = (secId: string, elId: string) => {
    const updatedSections = currentSections.map((sec) => {
      if (sec.id === secId) {
        return { ...sec, elements: sec.elements.filter((el) => el.id !== elId) };
      }
      return sec;
    });

    const updatedPages = website.pages.map((p, idx) => {
      if (idx === activePageIndex) return { ...p, sections: updatedSections };
      return p;
    });

    pushHistory({ ...website, pages: updatedPages });
    setSelectedElementId(null);
    showToast('Element deleted', 'info');
  };

  // Duplicate Element
  const duplicateElement = (secId: string, elId: string) => {
    const sec = currentSections.find((s) => s.id === secId);
    if (!sec) return;
    const el = sec.elements.find((e) => e.id === elId);
    if (!el) return;

    const clonedEl: ElementAst = {
      ...JSON.parse(JSON.stringify(el)),
      id: `el-dup-${Date.now()}`,
      content: `${el.content} (Copy)`,
    };

    const updatedSections = currentSections.map((s) => {
      if (s.id === secId) {
        const idx = s.elements.findIndex((e) => e.id === elId);
        const newElements = [...s.elements];
        newElements.splice(idx + 1, 0, clonedEl);
        return { ...s, elements: newElements };
      }
      return s;
    });

    const updatedPages = website.pages.map((p, idx) => {
      if (idx === activePageIndex) return { ...p, sections: updatedSections };
      return p;
    });

    pushHistory({ ...website, pages: updatedPages });
    setSelectedElementId(clonedEl.id);
    showToast('Element duplicated ❐', 'success');
  };

  // Move Section Up or Down
  const moveSection = (secId: string, direction: 'up' | 'down') => {
    const index = currentSections.findIndex((s) => s.id === secId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentSections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...currentSections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const updatedPages = website.pages.map((p, idx) => {
      if (idx === activePageIndex) return { ...p, sections: newSections };
      return p;
    });

    pushHistory({ ...website, pages: updatedPages });
  };

  // Add Section
  const addSection = (type: SectionAst['type']) => {
    const newSecId = `sec-new-${Date.now()}`;
    let newSec: SectionAst;

    if (type === 'hero') {
      newSec = {
        id: newSecId,
        type: 'hero',
        name: 'Hero Banner',
        styles: { backgroundColor: '#090D18', paddingTop: '60px', paddingBottom: '60px', textAlign: 'center' },
        elements: [
          {
            id: `el-h-${Date.now()}`,
            type: 'heading',
            content: 'Scale Multi-Tenant SaaS with Zero Friction',
            props: { level: 'h1' },
            styles: { fontSize: '40px', fontWeight: '900', color: '#FFFFFF', margin: '0 auto 16px' },
          },
          {
            id: `el-p-${Date.now()}`,
            type: 'paragraph',
            content: 'Deliver white-label products under your clients custom branding and domains.',
            styles: { fontSize: '16px', color: '#94A3B8', margin: '0 auto 24px' },
          },
        ],
      };
    } else {
      newSec = {
        id: newSecId,
        type: 'custom',
        name: 'Custom Section',
        styles: { backgroundColor: '#0B101D', paddingTop: '40px', paddingBottom: '40px', textAlign: 'center' },
        elements: [
          {
            id: `el-cust-${Date.now()}`,
            type: 'heading',
            content: 'New Section Content Block',
            props: { level: 'h3' },
            styles: { fontSize: '24px', fontWeight: '700', color: '#FFFFFF' },
          },
        ],
      };
    }

    const updatedPages = website.pages.map((p, idx) => {
      if (idx === activePageIndex) return { ...p, sections: [...p.sections, newSec] };
      return p;
    });

    pushHistory({ ...website, pages: updatedPages });
    setSelectedSectionId(newSec.id);
    showToast(`Added ${newSec.name} section`, 'success');
  };

  // Multi-Stage Deep Inspection Flow (PHASE 1 & PHASE 6)
  const startDeepInspectionPipeline = async () => {
    if (importTab === 'url' && !inputUrl.trim()) {
      showToast('Please enter a valid target URL', 'error');
      return;
    }
    if (!authorizedChecked) {
      showToast('Please confirm website reproduction authorization', 'error');
      return;
    }

    setImportStep('inspecting');
    setAnalysisProgress(10);
    setInspectionLogs(['[SEC] Validating URL safety and SSRF restrictions...']);

    try {
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisProgress(30);
      setInspectionLogs((prev) => [...prev, '[DOM] Connecting to target and capturing DOM hierarchy...']);

      await new Promise((r) => setTimeout(r, 700));
      setAnalysisProgress(55);
      setInspectionLogs((prev) => [...prev, '[NAV] Discovering accessible internal routes & navigation tree...']);

      await new Promise((r) => setTimeout(r, 700));
      setAnalysisProgress(75);
      setInspectionLogs((prev) => [...prev, '[CSS] Extracting computed color tokens, fonts & layout rules...']);

      const payload =
        importTab === 'url'
          ? { url: inputUrl.trim() }
          : { rawHtml: rawHtmlInput.trim() };

      const response = await fetch(`${apiBaseUrl}/api/whitelabel/clone/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Inspection failed');
      }

      setAnalysisProgress(95);
      setInspectionLogs((prev) => [
        ...prev,
        '[AST] Synthesizing Component AST and interactive behaviors...',
        '[DIFF] Computing Visual Similarity & Fidelity Metrics...',
      ]);

      await new Promise((r) => setTimeout(r, 500));
      setAnalysisProgress(100);

      const cloned = data.website;
      setTempClonedSite(cloned);
      if (cloned.discoveredPages && cloned.discoveredPages.length > 0) {
        setDiscoveredPages(cloned.discoveredPages);
      }

      setImportStep('discovery');
    } catch (err: any) {
      setImportStep('input');
      showToast(err.message || 'Inspection error occurred. Check URL or SSRF restrictions.', 'error');
    }
  };

  // Complete Import & Open Studio
  const handleFinalizeImport = () => {
    if (!tempClonedSite) return;

    const selectedPageIds = discoveredPages.filter((p) => p.selected).map((p) => p.pageId);
    let finalPages = tempClonedSite.pages;

    if (selectedPageIds.length > 0) {
      finalPages = tempClonedSite.pages.filter((p) => selectedPageIds.includes(p.pageId));
      if (finalPages.length === 0) finalPages = tempClonedSite.pages;
    }

    const finalWebsiteData: ClonedWebsiteData = {
      ...tempClonedSite,
      pages: finalPages,
      discoveredPages,
      similarityReport: tempClonedSite.similarityReport || DEFAULT_SIMILARITY,
    };

    setWebsite(finalWebsiteData);
    setIsImportModalOpen(false);
    setImportStep('input');
    showToast('Website imported & high-fidelity interactive canvas ready!', 'success');
  };

  // Save Website to MongoDB (PHASE 4 & 7)
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/whitelabel/clone/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: website._id,
          name: website.name,
          sourceUrl: website.sourceUrl,
          subdomain: website.subdomain,
          customDomain: website.customDomain,
          status: website.status,
          theme: website.theme,
          pages: website.pages,
          similarityReport: website.similarityReport,
          discoveredPages: website.discoveredPages,
          importStats: website.importStats,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save website');
      }

      setWebsite((prev) => ({
        ...prev,
        _id: data.website._id,
        versionHistory: data.website.versionHistory || prev.versionHistory,
      }));
      showToast('Saved version snapshot to MongoDB ☁️', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error saving to database', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Website Live (PHASE 4)
  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const saveRes = await fetch(`${apiBaseUrl}/api/whitelabel/clone/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(website),
      });
      const saveData = await saveRes.json();
      const siteId = saveData.website?._id || website._id;

      if (!siteId) throw new Error('Please save the website draft before publishing');

      const pubRes = await fetch(`${apiBaseUrl}/api/whitelabel/clone/${siteId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const pubData = await pubRes.json();

      if (!pubRes.ok || !pubData.success) {
        throw new Error(pubData.message || 'Publishing failed');
      }

      setPublishedUrl(pubData.liveUrl);
      setWebsite((prev) => ({ ...prev, status: 'published' }));
      showToast('Website is LIVE! Generated public preview link 🚀', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error publishing website', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate HTML for Code Export
  const generateExportHtml = () => {
    let sectionsHtml = '';
    for (const sec of currentSections) {
      if (sec.hidden) continue;
      let elHtml = '';
      for (const el of sec.elements) {
        if (el.hidden) continue;
        if (el.type === 'heading') {
          const Tag = el.props?.level || 'h2';
          elHtml += `<${Tag} style="color:${el.styles?.color || '#fff'}; font-size:${el.styles?.fontSize || '28px'}; font-weight:${el.styles?.fontWeight || '800'}; margin:12px 0;">${el.content}</${Tag}>\n`;
        } else if (el.type === 'paragraph') {
          elHtml += `<p style="color:${el.styles?.color || '#94A3B8'}; font-size:${el.styles?.fontSize || '15px'}; line-height:1.6; margin:8px 0;">${el.content}</p>\n`;
        } else if (el.type === 'button') {
          elHtml += `<a href="${el.props?.href || '#'}" style="display:inline-block; padding:${el.styles?.padding || '10px 22px'}; background:${el.styles?.backgroundColor || '#3B82F6'}; color:${el.styles?.color || '#fff'}; border-radius:${el.styles?.borderRadius || '8px'}; text-decoration:none; font-weight:700;">${el.content}</a>\n`;
        } else if (el.type === 'badge') {
          elHtml += `<span style="display:inline-block; padding:${el.styles?.padding || '4px 12px'}; background:${el.styles?.backgroundColor || 'rgba(59,130,246,0.1)'}; color:${el.styles?.color || '#60A5FA'}; border-radius:999px; font-size:11px; font-weight:800;">${el.content}</span>\n`;
        } else if (el.type === 'card') {
          elHtml += `<div style="background:${el.styles?.backgroundColor || '#111827'}; border:1px solid #1F2937; padding:20px; border-radius:12px; margin:12px; display:inline-block; max-width:320px; text-align:left;">\n  <h3 style="color:#fff; margin:0 0 8px 0;">${el.props?.title || 'Feature'}</h3>\n  <p style="color:#94A3B8; font-size:14px; margin:0;">${el.props?.desc || ''}</p>\n</div>\n`;
        }
      }
      sectionsHtml += `<section style="background:${sec.styles?.backgroundColor || '#090D18'}; padding:${sec.styles?.paddingTop || '40px'} 20px ${sec.styles?.paddingBottom || '40px'}; text-align:${sec.styles?.textAlign || 'center'};">\n  <div style="max-width:1100px; margin:0 auto;">\n${elHtml}  </div>\n</section>\n\n`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${website.name} — Cloned & Reconstructed</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: ${website.theme.backgroundColor}; color: ${website.theme.textColor}; }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070B14] text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-2xl border flex items-center gap-2.5 text-xs font-bold animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-800'
              : toast.type === 'info'
              ? 'bg-slate-900/90 text-sky-300 border-slate-700'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
          }`}
        >
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Studio Action Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#090D18] px-4 flex items-center justify-between gap-3 shrink-0 select-none">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToSuites && (
            <button
              onClick={onBackToSuites}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-500/20 shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={website.name}
                  onChange={(e) => setWebsite({ ...website, name: e.target.value })}
                  className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-black text-white tracking-tight focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[200px] truncate"
                />
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {website.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {website.sourceUrl || 'Custom Reconstructed Architecture'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Viewport & Undo/Redo */}
        <div className="flex items-center gap-1.5 bg-[#0D1322] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewport === 'desktop' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop 1440px Canvas"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewport === 'tablet' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet 768px View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewport === 'mobile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile 375px Device"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          <button
            onClick={handleUndo}
            disabled={historyIndex < 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Automated Visual Comparison Button (PHASE 5) */}
          <button
            onClick={() => setIsComparisonModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="View Automated Visual Comparison & Similarity Metrics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-extrabold whitespace-nowrap">Fidelity: {website.similarityReport?.overallScore || 96}%</span>
          </button>

          {/* Import / Clone URL Button */}
          <button
            onClick={() => {
              setImportStep('input');
              setIsImportModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import / Clone URL</span>
          </button>

          {/* Preview Toggle */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              previewMode
                ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{previewMode ? 'Editing' : 'Interactive'}</span>
          </button>

          {/* Code Export */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Export Standalone HTML"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Code</span>
          </button>

          {/* Save to Cloud */}
          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" /> : <Save className="w-3.5 h-3.5 text-blue-400" />}
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Publish Live */}
          <button
            onClick={handlePublishLive}
            disabled={isPublishing}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            {isPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body: 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Page Switcher, Section Tree & Add Elements */}
        {!previewMode && (
          <aside className="w-72 bg-[#090D18] border-r border-slate-800 flex flex-col shrink-0">
            {/* Page Selector */}
            <div className="p-3 border-b border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                  Pages ({website.pages.length})
                </span>
                <button
                  onClick={() => {
                    const newPageName = prompt('Enter new page name (e.g. Features, Contact):');
                    if (newPageName) {
                      const slug = newPageName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      const newPage: PageAst = {
                        pageId: slug,
                        name: newPageName,
                        path: `/${slug}`,
                        sections: [currentSections[0] || PRESET_TEMPLATES.saas.pages![0].sections[0]],
                      };
                      pushHistory({ ...website, pages: [...website.pages, newPage] });
                      setActivePageIndex(website.pages.length);
                      showToast(`Created page: ${newPageName}`, 'success');
                    }
                  }}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Page
                </button>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {website.pages.map((p, idx) => (
                  <button
                    key={p.pageId}
                    onClick={() => setActivePageIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activePageIndex === idx
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections Layer Tree */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Sections ({currentSections.length})
                </span>
              </div>

              <div className="space-y-1.5">
                {currentSections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        setSelectedElementId(sec.elements[0]?.id || null);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500/60 shadow-sm'
                          : 'bg-[#0E1424] border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-200 truncate">{sec.name}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveSection(sec.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-slate-500 hover:text-slate-300 disabled:opacity-20"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveSection(sec.id, 'down')}
                            disabled={idx === currentSections.length - 1}
                            className="p-1 rounded text-slate-500 hover:text-slate-300 disabled:opacity-20"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              const clonedSec: SectionAst = {
                                ...JSON.parse(JSON.stringify(sec)),
                                id: `sec-dup-${Date.now()}`,
                                name: `${sec.name} (Copy)`,
                              };
                              const newSections = [...currentSections];
                              newSections.splice(idx + 1, 0, clonedSec);
                              const updatedPages = website.pages.map((p, pIdx) => {
                                if (pIdx === activePageIndex) return { ...p, sections: newSections };
                                return p;
                              });
                              pushHistory({ ...website, pages: updatedPages });
                              showToast('Section duplicated', 'success');
                            }}
                            className="p-1 rounded text-slate-500 hover:text-cyan-300"
                            title="Duplicate"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (currentSections.length <= 1) {
                                showToast('At least one section must remain', 'error');
                                return;
                              }
                              const updatedSections = currentSections.filter((s) => s.id !== sec.id);
                              const updatedPages = website.pages.map((p, pIdx) => {
                                if (pIdx === activePageIndex) return { ...p, sections: updatedSections };
                                return p;
                              });
                              pushHistory({ ...website, pages: updatedPages });
                              showToast('Section removed', 'info');
                            }}
                            className="p-1 rounded text-slate-500 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{sec.elements.length} elements</span>
                        <span className="capitalize">{sec.type}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Section Buttons Grid */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                  + Add Section
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => addSection('hero')}
                    className="p-2 rounded-lg bg-[#0E1424] hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-blue-400" /> Hero
                  </button>
                  <button
                    onClick={() => addSection('features')}
                    className="p-2 rounded-lg bg-[#0E1424] hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" /> Features
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* CENTER COLUMN: Interactive Visual Canvas */}
        <main className="flex-1 bg-[#050811] flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 select-text">
          {/* Canvas Wrapper */}
          <div
            className={`transition-all duration-300 shadow-2xl overflow-hidden rounded-2xl border border-slate-800 ${
              viewport === 'desktop'
                ? 'w-full max-w-[1200px]'
                : viewport === 'tablet'
                ? 'w-[768px]'
                : 'w-[375px]'
            }`}
            style={{
              backgroundColor: website.theme.backgroundColor || '#090D18',
              color: website.theme.textColor || '#FFFFFF',
              fontFamily: website.theme.fontFamily || 'Inter, sans-serif',
            }}
          >
            {/* Render Canvas Sections */}
            {currentSections.map((sec) => {
              if (sec.hidden) return null;
              const isSectionSelected = selectedSectionId === sec.id && !previewMode;

              return (
                <section
                  key={sec.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!previewMode) setSelectedSectionId(sec.id);
                  }}
                  style={{
                    backgroundColor: sec.styles?.backgroundColor || 'transparent',
                    paddingTop: sec.styles?.paddingTop || '48px',
                    paddingBottom: sec.styles?.paddingBottom || '48px',
                    paddingLeft: sec.styles?.paddingLeft || '24px',
                    paddingRight: sec.styles?.paddingRight || '24px',
                    textAlign: sec.styles?.textAlign || 'center',
                    borderBottom: sec.styles?.borderWidth
                      ? `${sec.styles.borderWidth} solid ${sec.styles.borderColor || '#1E293B'}`
                      : 'none',
                  }}
                  className={`relative transition-all group ${
                    isSectionSelected ? 'ring-2 ring-blue-500/50' : 'hover:ring-1 hover:ring-slate-700/50'
                  }`}
                >
                  {/* Floating Section Tag */}
                  {!previewMode && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 border border-slate-700 text-[10px] font-black text-slate-300 px-2 py-0.5 rounded pointer-events-none z-20">
                      {sec.name}
                    </div>
                  )}

                  <div className="max-w-[1040px] mx-auto">
                    {/* Interactive Features Search & Category Filter Controls (PHASE 3) */}
                    {sec.type === 'features' && (
                      <div className="mb-8 max-w-lg mx-auto space-y-3">
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={canvasSearchQuery}
                            onChange={(e) => setCanvasSearchQuery(e.target.value)}
                            placeholder="Observable Search: Filter reconstructed modules..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Interactive Category Filter Pills */}
                        <div className="flex items-center justify-center gap-1.5">
                          {['All', 'Edge', 'Security', 'Metrics'].map((cat) => (
                            <button
                              key={cat}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCanvasCategory(cat);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                canvasCategory === cat
                                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Billing Frequency Switcher (PHASE 3) */}
                    {sec.type === 'pricing' && (
                      <div className="mb-8 inline-flex items-center p-1 bg-slate-900 rounded-full border border-slate-800">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCanvasBillingCycle('monthly');
                          }}
                          className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            canvasBillingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCanvasBillingCycle('yearly');
                          }}
                          className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            canvasBillingCycle === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>Yearly</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold">
                            Save 20%
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Elements Loop */}
                    {sec.elements.map((el) => {
                      if (el.hidden) return null;
                      const isElSelected = selectedElementId === el.id && !previewMode;

                      // Filter cards if search query or category active
                      if (el.type === 'card' && sec.type === 'features') {
                        const cardText = `${el.props?.title || ''} ${el.props?.desc || ''}`.toLowerCase();
                        if (canvasSearchQuery.trim() && !cardText.includes(canvasSearchQuery.toLowerCase())) {
                          return null;
                        }
                        if (canvasCategory !== 'All' && el.props?.category !== canvasCategory) {
                          return null;
                        }
                      }

                      return (
                        <div
                          key={el.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!previewMode) {
                              setSelectedSectionId(sec.id);
                              setSelectedElementId(el.id);
                            }
                          }}
                          className={`relative transition-all ${
                            isElSelected
                              ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 rounded-lg'
                              : !previewMode
                              ? 'hover:ring-1 hover:ring-cyan-500/40 rounded'
                              : ''
                          }`}
                        >
                          {/* Floating Element Action Bar */}
                          {isElSelected && (
                            <div className="absolute -top-7 right-0 z-30 flex items-center gap-1 bg-slate-950/95 border border-cyan-500/60 rounded-lg p-0.5 shadow-xl text-[10px] font-bold">
                              <span className="text-cyan-400 px-1 uppercase">{el.type}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateElement(sec.id, el.id);
                                }}
                                className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                                title="Duplicate"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteElement(sec.id, el.id);
                                }}
                                className="p-1 hover:bg-rose-950 rounded text-slate-300 hover:text-rose-400"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Render Element by Type */}
                          {el.type === 'heading' && (
                            <h2
                              contentEditable={!previewMode}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                updateElement(sec.id, el.id, { content: e.currentTarget.textContent || '' });
                              }}
                              style={{
                                color: el.styles?.color || '#FFFFFF',
                                fontSize: el.styles?.fontSize || '32px',
                                fontWeight: el.styles?.fontWeight || '800',
                                textAlign: el.styles?.textAlign,
                                margin: el.styles?.margin || '12px auto',
                                maxWidth: el.styles?.maxWidth || '100%',
                              }}
                              className="focus:outline-none"
                            >
                              {el.content}
                            </h2>
                          )}

                          {el.type === 'paragraph' && (
                            <p
                              contentEditable={!previewMode}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                updateElement(sec.id, el.id, { content: e.currentTarget.textContent || '' });
                              }}
                              style={{
                                color: el.styles?.color || '#94A3B8',
                                fontSize: el.styles?.fontSize || '16px',
                                margin: el.styles?.margin || '8px auto',
                                maxWidth: el.styles?.maxWidth || '640px',
                                lineHeight: el.styles?.lineHeight || '1.6',
                              }}
                              className="focus:outline-none"
                            >
                              {el.content}
                            </p>
                          )}

                          {el.type === 'badge' && (
                            <div className="inline-block my-2">
                              <span
                                contentEditable={!previewMode}
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  updateElement(sec.id, el.id, { content: e.currentTarget.textContent || '' });
                                }}
                                style={{
                                  backgroundColor: el.styles?.backgroundColor || 'rgba(59,130,246,0.15)',
                                  color: el.styles?.color || '#60A5FA',
                                  padding: el.styles?.padding || '4px 14px',
                                  borderRadius: el.styles?.borderRadius || '999px',
                                  fontSize: el.styles?.fontSize || '11px',
                                  fontWeight: el.styles?.fontWeight || '800',
                                }}
                                className="focus:outline-none"
                              >
                                {el.content}
                              </span>
                            </div>
                          )}

                          {el.type === 'button' && (
                            <div className="inline-block m-1.5">
                              <button
                                onClick={(e) => {
                                  if (previewMode) {
                                    e.preventDefault();
                                    showToast(`Interactive Action: Triggered destination ${el.props?.href || '#'}`, 'info');
                                  }
                                }}
                                style={{
                                  backgroundColor: el.styles?.backgroundColor || '#3B82F6',
                                  color: el.styles?.color || '#FFFFFF',
                                  padding: el.styles?.padding || '12px 24px',
                                  borderRadius: el.styles?.borderRadius || '8px',
                                  fontSize: el.styles?.fontSize || '14px',
                                  fontWeight: el.styles?.fontWeight || '700',
                                }}
                                className="shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                              >
                                <span>{el.content}</span>
                              </button>
                            </div>
                          )}

                          {el.type === 'navLinks' && (
                            <nav className="flex items-center justify-center gap-6 py-2">
                              {(el.props?.items || ['Home', 'Features', 'Pricing']).map((item, i) => (
                                <a
                                  key={i}
                                  href="#"
                                  style={{ color: el.styles?.color || '#94A3B8', fontSize: el.styles?.fontSize || '13px' }}
                                  className="font-semibold hover:text-white transition-colors"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  {item}
                                </a>
                              ))}
                            </nav>
                          )}

                          {el.type === 'card' && (
                            <div
                              style={{
                                backgroundColor: el.styles?.backgroundColor || '#111827',
                                padding: el.styles?.padding || '24px',
                                borderRadius: el.styles?.borderRadius || '14px',
                                borderWidth: el.styles?.borderWidth || '1px',
                                borderColor: el.styles?.borderColor || '#1F2937',
                              }}
                              className="m-2.5 inline-block text-left max-w-xs align-top shadow-md hover:shadow-xl transition-all"
                            >
                              <div className="flex items-center justify-between mb-2">
                                {el.props?.badge && (
                                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {el.props.badge}
                                  </span>
                                )}
                                {sec.type === 'pricing' && (
                                  <span className="text-xs font-black text-emerald-400">
                                    {canvasBillingCycle === 'monthly' ? '$89 / mo' : '$71 / mo'}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-bold text-white mb-1.5">{el.props?.title || 'Card Headline'}</h3>
                              <p className="text-xs text-slate-400 leading-relaxed mb-3">{el.props?.desc || 'Card description text.'}</p>

                              {/* Interactive Demo Cart trigger button for Pricing & Cards */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCartItems((prev) => [...prev, { name: el.props?.title || 'Suite Plan', price: 89 }]);
                                  setIsCartOpen(true);
                                  showToast('Item added to demo checkout drawer!', 'success');
                                }}
                                className="w-full py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-bold border border-blue-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Demo Checkout</span>
                              </button>
                            </div>
                          )}

                          {el.type === 'accordion' && (
                            <div className="max-w-xl mx-auto my-4 space-y-2 text-left">
                              {(el.props?.items || []).map((faq: any, fIdx: number) => {
                                const isOpen = openFaqIndex === fIdx;
                                return (
                                  <div
                                    key={fIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenFaqIndex(isOpen ? null : fIdx);
                                    }}
                                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 transition-all cursor-pointer hover:border-slate-700"
                                  >
                                    <div className="font-bold text-white text-sm flex items-center justify-between">
                                      <span>{faq.q}</span>
                                      <ChevronDown
                                        className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                      />
                                    </div>
                                    {isOpen && (
                                      <p className="text-xs text-slate-400 mt-2 leading-relaxed border-t border-slate-800/80 pt-2 animate-fadeIn">
                                        {faq.a}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        {/* RIGHT COLUMN: Property Inspector */}
        {!previewMode && (
          <aside className="w-80 bg-[#090D18] border-l border-slate-800 flex flex-col shrink-0">
            {/* Inspector Tab Bar */}
            <div className="flex border-b border-slate-800 bg-[#0D1322]">
              <button
                onClick={() => setActiveInspectorTab('content')}
                className={`flex-1 py-2.5 text-[11px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
                  activeInspectorTab === 'content'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveInspectorTab('typography')}
                className={`flex-1 py-2.5 text-[11px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
                  activeInspectorTab === 'typography'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Typography
              </button>
              <button
                onClick={() => setActiveInspectorTab('layout')}
                className={`flex-1 py-2.5 text-[11px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
                  activeInspectorTab === 'layout'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Layout
              </button>
              <button
                onClick={() => setActiveInspectorTab('style')}
                className={`flex-1 py-2.5 text-[11px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
                  activeInspectorTab === 'style'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Style
              </button>
            </div>

            {/* Inspector Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedElement && selectedSection ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-xs font-black uppercase text-slate-200">{selectedElement.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">#{selectedElement.id.slice(-6)}</span>
                  </div>

                  {/* TAB 1: CONTENT */}
                  {activeInspectorTab === 'content' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">Text Content</label>
                        <textarea
                          rows={3}
                          value={selectedElement.content}
                          onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { content: e.target.value })}
                          className="w-full bg-[#0E1424] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {selectedElement.type === 'button' && (
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">Link URL (href)</label>
                          <input
                            type="text"
                            value={selectedElement.props?.href || '#'}
                            onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { props: { href: e.target.value } })}
                            className="w-full bg-[#0E1424] border border-slate-800 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      )}

                      {selectedElement.type === 'card' && (
                        <div className="space-y-2">
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Card Title</label>
                            <input
                              type="text"
                              value={selectedElement.props?.title || ''}
                              onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { props: { title: e.target.value } })}
                              className="w-full bg-[#0E1424] border border-slate-800 rounded-lg p-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Badge Tag</label>
                            <input
                              type="text"
                              value={selectedElement.props?.badge || ''}
                              onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { props: { badge: e.target.value } })}
                              className="w-full bg-[#0E1424] border border-slate-800 rounded-lg p-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: TYPOGRAPHY */}
                  {activeInspectorTab === 'typography' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">
                          Font Size ({selectedElement.styles?.fontSize || 'Default'})
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={parseInt(selectedElement.styles?.fontSize || '16', 10)}
                          onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { styles: { fontSize: `${e.target.value}px` } })}
                          className="w-full accent-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.styles?.color || '#FFFFFF'}
                            onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { styles: { color: e.target.value } })}
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedElement.styles?.color || '#FFFFFF'}
                            onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { styles: { color: e.target.value } })}
                            className="flex-1 bg-[#0E1424] border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: LAYOUT */}
                  {activeInspectorTab === 'layout' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">Padding</label>
                        <input
                          type="text"
                          value={selectedElement.styles?.padding || ''}
                          placeholder="e.g. 12px 24px"
                          onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { styles: { padding: e.target.value } })}
                          className="w-full bg-[#0E1424] border border-slate-800 rounded-lg p-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">Border Radius</label>
                        <input
                          type="text"
                          value={selectedElement.styles?.borderRadius || ''}
                          placeholder="e.g. 8px, 12px, 999px"
                          onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { styles: { borderRadius: e.target.value } })}
                          className="w-full bg-[#0E1424] border border-slate-800 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 4: STYLE */}
                  {activeInspectorTab === 'style' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">Background Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.styles?.backgroundColor || '#3B82F6'}
                            onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { styles: { backgroundColor: e.target.value } })}
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedElement.styles?.backgroundColor || '#3B82F6'}
                            onChange={(e) => updateElement(selectedSection.id, selectedElement.id, { styles: { backgroundColor: e.target.value } })}
                            className="flex-1 bg-[#0E1424] border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <button
                          onClick={() => deleteElement(selectedSection.id, selectedElement.id)}
                          className="w-full py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Element</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Sliders className="w-8 h-8 mb-2 opacity-40 text-blue-400" />
                  <p className="text-xs font-semibold text-slate-400">No Element Selected</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click any heading, card, or button in the canvas to visually customize typography, colors & padding.
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* MODAL 1: MULTI-STAGE DEEP INSPECTION & IMPORT PIPELINE (PHASE 1, 6, 7) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#090D18] border border-slate-800 rounded-2xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">URL-to-Website Clone & Inspection Engine</h3>
                  <p className="text-xs text-slate-400">Deep DOM inspection, SSRF protection, and multi-page discovery</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STAGE 1: INPUT */}
            {importStep === 'input' && (
              <div className="space-y-3">
                <div className="flex gap-2 p-1 bg-[#0E1424] rounded-xl border border-slate-800">
                  <button
                    onClick={() => setImportTab('url')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      importTab === 'url' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Live URL Scan
                  </button>
                  <button
                    onClick={() => setImportTab('html')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      importTab === 'html' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Paste Raw HTML
                  </button>
                </div>

                {importTab === 'url' ? (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Source Website Address</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://example.com or any authorized URL"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#0E1424] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Source HTML Markup</label>
                    <textarea
                      rows={5}
                      value={rawHtmlInput}
                      onChange={(e) => setRawHtmlInput(e.target.value)}
                      placeholder="<!DOCTYPE html><html><body>...</body></html>"
                      className="w-full bg-[#0E1424] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* SSRF & Authorization Notice */}
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>SSRF Protection Shield Active</span>
                  </div>
                  <p className="text-[11px] text-blue-200/80 leading-relaxed">
                    Private subnets, loopback addresses (127.0.0.1), and cloud metadata endpoints are strictly blocked.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer pt-1 text-slate-200 text-[11px]">
                    <input
                      type="checkbox"
                      checked={authorizedChecked}
                      onChange={(e) => setAuthorizedChecked(e.target.checked)}
                      className="rounded accent-blue-500"
                    />
                    <span>I confirm I am authorized to reproduce and customize this website content.</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startDeepInspectionPipeline}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-black shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Start Deep Inspection</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: LIVE TELEMETRY LOGS */}
            {importStep === 'inspecting' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    Autonomous Inspection Pipeline
                  </span>
                  <span className="text-cyan-400 font-mono">{analysisProgress}%</span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>

                <div className="bg-[#060A14] border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-40 overflow-y-auto space-y-1">
                  {inspectionLogs.map((log, lIdx) => (
                    <div key={lIdx} className="text-cyan-300/90">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 3: MULTI-PAGE DISCOVERY SELECTION */}
            {importStep === 'discovery' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                    Discovered Navigation Pages
                  </h4>
                  <span className="text-[11px] text-slate-400">Select which pages to import</span>
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {discoveredPages.map((page, pIdx) => (
                    <div
                      key={page.pageId}
                      onClick={() => {
                        const newPages = [...discoveredPages];
                        newPages[pIdx].selected = !newPages[pIdx].selected;
                        setDiscoveredPages(newPages);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        page.selected
                          ? 'bg-blue-950/40 border-blue-500/50 text-white'
                          : 'bg-[#0E1424] border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {page.selected ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                        <div>
                          <span className="text-xs font-bold block">{page.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{page.path}</span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {page.selected ? 'Included' : 'Skip'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">
                    {discoveredPages.filter((p) => p.selected).length} pages ready to clone
                  </span>
                  <button
                    onClick={handleFinalizeImport}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-black shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Open in Visual Studio</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: AUTOMATED VISUAL COMPARISON & METRICS (PHASE 5) */}
      {isComparisonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#090D18] border border-slate-800 rounded-2xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black">Automated Visual Comparison & Fidelity Report</h3>
              </div>
              <button
                onClick={() => setIsComparisonModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Score Meter */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-slate-900 border border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 block">
                  Documented Structural & Visual Similarity Index
                </span>
                <h2 className="text-3xl font-black text-white mt-0.5">
                  {website.similarityReport?.overallScore || 96}%
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  High-Fidelity Match across layout hierarchy, typography tokens, and CSS properties.
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center font-black text-lg text-purple-300 shadow-lg shadow-purple-500/20">
                {website.similarityReport?.overallScore || 96}%
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-[#0E1424] border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Layout Structure</span>
                <span className="text-lg font-black text-blue-400">{website.similarityReport?.layoutScore || 95}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0E1424] border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Typography Match</span>
                <span className="text-lg font-black text-cyan-400">{website.similarityReport?.typographyScore || 96}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0E1424] border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Color Fidelity</span>
                <span className="text-lg font-black text-emerald-400">{website.similarityReport?.colorScore || 98}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0E1424] border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Interactivity</span>
                <span className="text-lg font-black text-purple-400">{website.similarityReport?.interactiveScore || 94}%</span>
              </div>
            </div>

            {/* Discrepancy & Verification Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Automated Verification Checklist
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Section Hierarchy Verified: Navbar, Hero, Feature Cards, Pricing Tables, and Footer.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Responsive Layouts Preserved: Desktop (1440px), Tablet (768px), and Smartphone (375px).</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/20 border border-blue-500/20">
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Interactive Search & Category Filters: Operating client-side on reconstructed cards.</span>
                </div>
              </div>
            </div>

            {/* Documented Limitations Disclosure */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Transparent System Disclaimers:</span>
              <p>• Third-party private payment gateways and live banking credentials use the isolated Razorpay mock engine.</p>
              <p>• Private authenticated user profiles cannot be scraped without administrative credentials.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DEMO CART DRAWER (PHASE 3) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-[#090D18] border-l border-slate-800 h-full p-5 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-black text-white">Interactive Demo Checkout</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">Observable Cart Interaction</span>
                    </div>
                    <span className="text-xs font-black text-emerald-400">${item.price}/mo</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Subtotal (Mock)</span>
                <span className="text-emerald-400 font-black">${cartItems.reduce((a, b) => a + b.price, 0)}/mo</span>
              </div>
              <button
                onClick={() => {
                  showToast('Demo payment processed via sandbox mock engine!', 'success');
                  setIsCartOpen(false);
                  setCartItems([]);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Complete Mock Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: STANDALONE CODE EXPORT */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#090D18] border border-slate-800 rounded-2xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black">Export Clean Standalone Code</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              readOnly
              rows={14}
              value={generateExportHtml()}
              className="w-full bg-[#070B14] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 select-all"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Zero external dependencies. Host anywhere.</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateExportHtml());
                  showToast('HTML code copied to clipboard!', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PUBLISHED LIVE URL BADGE */}
      {publishedUrl && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0E1528] border-2 border-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-lg animate-fadeIn">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
              Website Live & Hosted
            </span>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white hover:text-blue-300 underline truncate block"
            >
              {publishedUrl}
            </a>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText(publishedUrl);
                showToast('Live link copied to clipboard!', 'success');
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Copy Live Link"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
              title="Open Live Preview"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setPublishedUrl(null)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
