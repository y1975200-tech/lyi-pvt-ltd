import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Building2,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Layers,
  Settings,
  Shield,
  Bot,
  ExternalLink,
  ChevronRight,
  Save,
  Check,
  Eye,
  FileSpreadsheet,
  TrendingUp,
  Briefcase,
  Users,
  ArrowRight,
  Bell,
  Key,
  EyeOff,
  Send,
  MessageSquareQuote,
  Star,
  Globe,
  Palette,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Type,
  Copy,
  Sliders,
  Upload,
  Lock,
  History,
  Database,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { BookingData, ServiceItem, PortfolioItem, SiteSettings, ServiceDivision, AiSubCategory, PageRoute, PageContentItem, TestimonialItem, ClientLogoItem, ThemeCustomization, SeoConfig } from '../types.ts';
import { AI_SERVICES as INITIAL_AI_SERVICES, IP_SERVICES as INITIAL_IP_SERVICES } from '../data/services.ts';
import { PORTFOLIO_ITEMS as INITIAL_PORTFOLIO, DEFAULT_TESTIMONIALS, DEFAULT_CLIENT_LOGOS } from '../data/generalData.ts';
import { ImageSourceSelector } from './ImageSourceSelector.tsx';
import { AdminThemeCustomizer } from './AdminThemeCustomizer.tsx';
import { AdminHeaderLogoManager } from './AdminHeaderLogoManager.tsx';
import { AdminClientLogosManager } from './AdminClientLogosManager.tsx';
import { AdminIndustriesManager } from './AdminIndustriesManager.tsx';
import { AdminSeoGeoManager } from './AdminSeoGeoManager.tsx';
import { AdminStyledField } from './AdminStyledField.tsx';
import { applyFieldStyle, getFieldClassName } from '../lib/styleHelper.ts';
import { INDUSTRIES_LIST } from '../data/generalData.ts';
import { IndustryItem } from '../types.ts';

interface SuccessPopupState {
  isOpen: boolean;
  title: string;
  message: string;
  targetPage?: PageRoute;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  onOpenBookingModal?: () => void;
  onNavigate?: (route: PageRoute) => void;
  portfolioItems?: PortfolioItem[];
  onUpdatePortfolio?: (items: PortfolioItem[]) => void;
  services?: ServiceItem[];
  onUpdateServices?: (services: ServiceItem[]) => void;
  seoConfigs?: Record<string, SeoConfig>;
  onSaveSeoConfig?: (page: string, config: SeoConfig) => Promise<void>;
  onResetSeoConfig?: (page: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  siteSettings,
  onUpdateSettings,
  onOpenBookingModal,
  onNavigate,
  portfolioItems: initialPortfolioProp,
  onUpdatePortfolio,
  services: initialServicesProp,
  onUpdateServices,
  seoConfigs,
  onSaveSeoConfig,
  onResetSeoConfig,
}) => {
  const [activeTab, setActiveTab] = useState<
    'crm' | 'styling' | 'header-logo' | 'logos' | 'industries' | 'pages' | 'seo' | 'settings' | 'services' | 'portfolio' | 'testimonials' | 'emails'
  >('pages');

  const [isCmsDropdownOpen, setIsCmsDropdownOpen] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('lyi_admin_token'));
    }
    return false;
  });
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passkeyInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('lyi_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid admin passkey');
      }
    } catch (err: any) {
      setAuthError('Authentication error: ' + err.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('lyi_admin_token');
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  const [savingIndustries, setSavingIndustries] = useState<boolean>(false);

  // Theme & Styling Customization State
  const defaultTheme: ThemeCustomization = {
    primaryColor: '#7c3aed',
    primaryButtonColor: '#7c3aed',
    primaryButtonTextColor: '#ffffff',
    secondaryButtonColor: '#4c1d95',
    secondaryButtonTextColor: '#e9d5ff',
    textColor: '#ffffff',
    cardBgColor: '#0f172a',
    cardBorderColor: '#334155',
    headlineFontWeight: 'normal',
    headlineItalic: false,
    headlineUnderline: false,
    buttonFontWeight: 'medium',
    buttonItalic: false,
    buttonUnderline: false,
  };

  const [themeData, setThemeData] = useState<ThemeCustomization>(
    siteSettings.theme || defaultTheme
  );
  const [savingTheme, setSavingTheme] = useState<boolean>(false);

  // Client Logos Scroller State
  const [clientLogos, setClientLogos] = useState<ClientLogoItem[]>(
    siteSettings.clientLogos && siteSettings.clientLogos.length > 0
      ? siteSettings.clientLogos
      : DEFAULT_CLIENT_LOGOS
  );
  const [isAddLogoModalOpen, setIsAddLogoModalOpen] = useState<boolean>(false);
  const [editingLogo, setEditingLogo] = useState<ClientLogoItem | null>(null);
  const [newLogo, setNewLogo] = useState<Partial<ClientLogoItem>>({
    name: '',
    logoUrl: '',
    tag: 'Enterprise Client',
    websiteUrl: '',
    accentColor: '#7c3aed',
  });
  const [savingLogos, setSavingLogos] = useState<boolean>(false);

  // Pages CMS State (All pages text, headings, and background images)
  const [selectedCmsPage, setSelectedCmsPage] = useState<
    'home' | 'ai-hub' | 'ip-hub' | 'portfolio' | 'industries' | 'case-studies' | 'about' | 'contact'
  >('home');
  const [savingPageContent, setSavingPageContent] = useState<boolean>(false);

  // Popup Box Confirmation for Successful Changes
  const [successPopup, setSuccessPopup] = useState<SuccessPopupState | null>(null);

  // CRM State
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [crmSearch, setCrmSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  // Client Reminder State
  const [reminderBooking, setReminderBooking] = useState<BookingData | null>(null);
  const [reminderCustomMessage, setReminderCustomMessage] = useState<string>('');
  const [sendingReminder, setSendingReminder] = useState<boolean>(false);
  const [reminderStatusMsg, setReminderStatusMsg] = useState<{ success: boolean; message: string } | null>(null);

  // Web3Forms Settings & Test State
  const [testingWeb3Forms, setTestingWeb3Forms] = useState<boolean>(false);
  const [web3formsTestResult, setWeb3formsTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showWeb3Key, setShowWeb3Key] = useState<boolean>(false);

  // Settings Form State
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    siteSettings.testimonials && siteSettings.testimonials.length > 0
      ? siteSettings.testimonials
      : DEFAULT_TESTIMONIALS
  );
  const [isAddTestimonialModalOpen, setIsAddTestimonialModalOpen] = useState<boolean>(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Partial<TestimonialItem>>({
    quote: '',
    author: '',
    role: '',
    company: '',
    initials: '',
    rating: 5,
  });

  // Keep form data synchronized whenever siteSettings loads or updates
  useEffect(() => {
    if (siteSettings) {
      setFormData(siteSettings);
      if (siteSettings.testimonials && siteSettings.testimonials.length > 0) {
        setTestimonials(siteSettings.testimonials);
      }
      if (siteSettings.theme) {
        setThemeData(siteSettings.theme);
      }
      if (siteSettings.clientLogos && siteSettings.clientLogos.length > 0) {
        setClientLogos(siteSettings.clientLogos);
      }
    }
  }, [siteSettings]);

  // Services Management State
  const [allServices, setAllServices] = useState<ServiceItem[]>(
    initialServicesProp && initialServicesProp.length > 0
      ? initialServicesProp
      : [...INITIAL_AI_SERVICES, ...INITIAL_IP_SERVICES]
  );
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [serviceDivisionFilter, setServiceDivisionFilter] = useState<'all' | 'AI Hub' | 'IP Hub'>('all');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceModalTab, setServiceModalTab] = useState<'hero' | 'challenges' | 'methodology' | 'scope' | 'process' | 'faqs'>('hero');
  const [newIndustryTag, setNewIndustryTag] = useState<string>('');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState<boolean>(false);
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    division: 'AI Hub',
    subCategory: 'Our Services',
    title: '',
    shortDesc: '',
    heroHeadline: '',
    heroLede: '',
    solutionText: '',
  });

  useEffect(() => {
    if (initialServicesProp && initialServicesProp.length > 0) {
      setAllServices(initialServicesProp);
    }
  }, [initialServicesProp]);

  // Portfolio Management State
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(
    initialPortfolioProp && initialPortfolioProp.length > 0
      ? initialPortfolioProp
      : INITIAL_PORTFOLIO
  );
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState<boolean>(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState<Partial<PortfolioItem>>({
    title: '',
    category: 'AI Software',
    description: '',
    tag: 'AI Software',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    client: '',
    result: '',
  });

  useEffect(() => {
    if (initialPortfolioProp && initialPortfolioProp.length > 0) {
      setPortfolioItems(initialPortfolioProp);
    }
  }, [initialPortfolioProp]);

  // Dispatched Emails State
  const [dispatchedEmails, setDispatchedEmails] = useState<any[]>([]);
  const [previewEmailHtml, setPreviewEmailHtml] = useState<string | null>(null);

  // Load Bookings & Server Data with resilient Firestore / cache fallbacks
  const fetchBookings = async () => {
    setLoadingBookings(true);
    let loaded = false;
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
          try {
            localStorage.setItem('lyi_stored_bookings', JSON.stringify(data.slice(0, 50)));
          } catch (_) {}
          loaded = true;
        }
      }
    } catch (e) {
      console.warn('Notice: API bookings fetch unfulfilled, checking Firestore fallback.');
    } finally {
      setLoadingBookings(false);
    }

    if (!loaded) {
      try {
        const cached = localStorage.getItem('lyi_stored_bookings');
        if (cached) {
          setBookings(JSON.parse(cached));
        }
      } catch (_) {}
    }
  };

  const fetchEmails = async () => {
    let loaded = false;
    try {
      const res = await fetch('/api/emails');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDispatchedEmails(data);
          try {
            localStorage.setItem('lyi_stored_emails', JSON.stringify(data.slice(0, 50)));
          } catch (_) {}
          loaded = true;
        }
      }
    } catch (e) {
      console.warn('Notice: API emails fetch unfulfilled, using local cached emails.');
    }

    if (!loaded) {
      try {
        const cached = localStorage.getItem('lyi_stored_emails');
        if (cached) {
          setDispatchedEmails(JSON.parse(cached));
        }
      } catch (_) {}
    }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPortfolioItems(data);
        }
      }
    } catch (e) {
      console.warn('Notice: API portfolio fetch unfulfilled.');
    }
  };

  const fetchCustomServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAllServices((prev) => {
            const map = new Map<string, ServiceItem>();
            [...prev, ...data].forEach((s) => map.set(s.id, s));
            return Array.from(map.values());
          });
        }
      }
    } catch (e) {
      console.warn('Notice: API services fetch unfulfilled.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
      fetchEmails();
      fetchPortfolio();
      fetchCustomServices();
      setFormData({
        ...siteSettings,
        heroBgImage: siteSettings.heroBgImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
        portfolioBgImage: siteSettings.portfolioBgImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
        industriesBgImage: siteSettings.industriesBgImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
        caseStudiesBgImage: siteSettings.caseStudiesBgImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80',
        aboutBgImage: siteSettings.aboutBgImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80',
        contactBgImage: siteSettings.contactBgImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
        web3formsKey: siteSettings.web3formsKey || '',
        logoUrl: siteSettings.logoUrl || '/assets/logo.svg',
      });
    }
  }, [isOpen, siteSettings]);

  if (!isOpen) return null;

  // Handle Web3Forms Connection Test (Probes direct Web3Forms API from client)
  const handleTestWeb3Forms = async () => {
    const keyToTest = (formData.web3formsKey || 'b91db637-425b-4ce4-8ed1-c2b51bc1b91b').trim().replace(/\/+$/, '');
    if (!keyToTest) {
      setWeb3formsTestResult({
        success: false,
        message: 'Please provide a Web3Forms Access Key first.',
      });
      return;
    }
    setTestingWeb3Forms(true);
    setWeb3formsTestResult(null);

    try {
      // Direct Web3Forms submission test from browser
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: keyToTest,
          subject: 'LockYourIdea Tech - Web3Forms Verification Test',
          from_name: formData.companyName || 'LockYourIdea Tech Admin',
          name: 'LockYourIdea Admin Verification Probe',
          email: formData.email || 'hello@lockyourideatech.com',
          message: `Testing live Web3Forms delivery for LockYourIdea Tech slot booking alerts and client reminders. Verification timestamp: ${new Date().toISOString()}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWeb3formsTestResult({
          success: true,
          message: 'Web3Forms API key is verified and operational! Live email delivery is active.',
        });
        // Also persist tested key to settings
        onUpdateSettings({ web3formsKey: keyToTest });
      } else {
        // Fallback to server route if direct call blocked
        const serverRes = await fetch('/api/test-web3forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessKey: keyToTest,
            testEmail: formData.email,
          }),
        });
        const serverData = await serverRes.json();
        setWeb3formsTestResult({
          success: serverData.success,
          message: serverData.message || data.message || 'Web3Forms verification test failed. Please verify the key.',
        });
      }
    } catch (err: any) {
      setWeb3formsTestResult({
        success: false,
        message: err.message || 'Error connecting to Web3Forms API directly.',
      });
    } finally {
      setTestingWeb3Forms(false);
    }
  };

  // Handle Dispatching Consultation Reminder to Client
  const handleSendReminder = async () => {
    if (!reminderBooking) return;
    setSendingReminder(true);
    setReminderStatusMsg(null);
    try {
      const activeKey = (formData.web3formsKey || 'b91db637-425b-4ce4-8ed1-c2b51bc1b91b').trim().replace(/\/+$/, '');
      let web3Success = false;

      // 1. Direct Web3Forms submission to client email & admin
      if (activeKey) {
        try {
          const web3Payload = {
            access_key: activeKey,
            subject: `[Reminder] Upcoming ${reminderBooking.service} Consultation with LockYourIdea Tech (${reminderBooking.reference})`,
            from_name: formData.companyName || 'LockYourIdea Tech',
            name: reminderBooking.fullName,
            email: reminderBooking.email,
            message: `CONSULTATION SESSION REMINDER:
---------------------------------------------
Client Name: ${reminderBooking.fullName}
Client Email: ${reminderBooking.email}
Client Mobile: ${reminderBooking.mobile}
Booking Reference: ${reminderBooking.reference}
Service Topic: ${reminderBooking.service}
Specialist Division: ${reminderBooking.division}
Scheduled Date: ${reminderBooking.date}
Scheduled Time Slot: ${reminderBooking.timeSlot}
Format / Mode: ${reminderBooking.mode}
Meeting Link: ${reminderBooking.meetingLink}
Assigned Lead Specialist: ${reminderBooking.assignedConsultant.name} (${reminderBooking.assignedConsultant.role})
${reminderCustomMessage ? `\nPersonal Note from Admin:\n"${reminderCustomMessage}"\n` : ''}
---------------------------------------------
LockYourIdea Tech Administration
HQ: ${formData.hqAddress}
Phone: ${formData.phone} | Email: ${formData.email}`,
            Consultation_Reference: reminderBooking.reference,
            Date: reminderBooking.date,
            TimeSlot: reminderBooking.timeSlot,
            MeetingLink: reminderBooking.meetingLink,
          };

          const web3Res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(web3Payload),
          });
          const web3Data = await web3Res.json();
          if (web3Data.success) {
            web3Success = true;
          }
        } catch (wErr) {
          console.warn('Direct Web3Forms reminder error:', wErr);
        }
      }

      // 2. Dispatch to backend API (to log in email outbox audit trail and handle SMTP if configured)
      const res = await fetch(`/api/bookings/${reminderBooking.id}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customMessage: reminderCustomMessage,
          reminderType: 'Slot Consultation Reminder',
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || web3Success)) {
        setReminderStatusMsg({
          success: true,
          message: `Consultation reminder successfully dispatched to ${reminderBooking.fullName} (${reminderBooking.email})! Live notifications sent.`,
        });
        fetchEmails();
        if (onRefreshData) onRefreshData();
      } else {
        setReminderStatusMsg({
          success: false,
          message: data.error || 'Failed to dispatch reminder to client.',
        });
      }
    } catch (err: any) {
      setReminderStatusMsg({
        success: false,
        message: err.message || 'Error connecting to reminder service.',
      });
    } finally {
      setSendingReminder(false);
    }
  };

  // Handle Instant Save for Individual Photos with immediate MongoDB persistence
  const handleInstantSaveImage = async (
    field: keyof SiteSettings,
    newUrl: string,
    label: string,
    targetRoute?: PageRoute
  ) => {
    setSavingSettings(true);
    try {
      const updated = { ...formData, [field]: newUrl };
      setFormData(updated);

      // Single write to backend MongoDB API
      await onUpdateSettings({ [field]: newUrl });

      setSuccessPopup({
        isOpen: true,
        title: `${label} Published to Database!`,
        message: `Your image URL has been saved to MongoDB and is live across all pages.`,
        targetPage: targetRoute,
      });
    } catch (err: any) {
      console.error('Instant photo save failed:', err);
      alert('Failed to save image: ' + (err.message || err));
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle Save Page Content & Background Image for any specific page
  const handleSavePageContent = async (
    pageId: string,
    content: any,
    pageLabel: string,
    targetRoute: PageRoute
  ) => {
    setSavingPageContent(true);
    try {
      const updatedPageContent = {
        ...(formData.pageContent || {}),
        [pageId]: {
          ...(formData.pageContent?.[pageId] || {}),
          ...content,
        },
      };

      const updatedSettings: Partial<SiteSettings> = {
        ...formData,
        pageContent: updatedPageContent,
      };

      if (content.bgImage) {
        if (pageId === 'home') updatedSettings.heroBgImage = content.bgImage;
        if (pageId === 'ai-hub') updatedSettings.aiHubBgImage = content.bgImage;
        if (pageId === 'ip-hub') updatedSettings.ipHubBgImage = content.bgImage;
        if (pageId === 'portfolio') updatedSettings.portfolioBgImage = content.bgImage;
        if (pageId === 'case-studies') updatedSettings.caseStudiesBgImage = content.bgImage;
        if (pageId === 'about') updatedSettings.aboutBgImage = content.bgImage;
        if (pageId === 'contact') updatedSettings.contactBgImage = content.bgImage;
      }
      if (content.aiCardBg) updatedSettings.aiHubBgImage = content.aiCardBg;
      if (content.ipCardBg) updatedSettings.ipHubBgImage = content.ipCardBg;
      if (content.headline && pageId === 'home') updatedSettings.heroHeadline = content.headline;
      if (content.subheadline && pageId === 'home') updatedSettings.heroSubhead = content.subheadline;
      if (pageId === 'home') {
        if (content.companyName) updatedSettings.companyName = content.companyName;
        if (content.companyName_style) updatedSettings.companyName_style = content.companyName_style;
        if (content.tagline) {
          updatedSettings.tagline = content.tagline;
          updatedSettings.headerSubtitle = content.tagline;
        }
        if (content.tagline_style) {
          updatedSettings.tagline_style = content.tagline_style;
          updatedSettings.headerSubtitle_style = content.tagline_style;
        }
        if (content.headerSubtitle) updatedSettings.headerSubtitle = content.headerSubtitle;
        if (content.headerSubtitle_style) updatedSettings.headerSubtitle_style = content.headerSubtitle_style;
        if (content.logoUrl) updatedSettings.logoUrl = content.logoUrl;
        if (content.hqAddress) updatedSettings.hqAddress = content.hqAddress;
        if (content.phone) updatedSettings.phone = content.phone;
        if (content.stat1Value || content.stat2Value || content.stat3Value || content.stat4Value || content.stat5Value) {
          updatedSettings.stats = {
            aiProjects: content.stat1Value || formData.stats?.aiProjects || '150+',
            ipRegistrations: content.stat2Value || formData.stats?.ipRegistrations || '500+',
            enterpriseClients: content.stat3Value || formData.stats?.enterpriseClients || '80+',
            trainedCount: content.stat4Value || formData.stats?.trainedCount || '1,200+',
            successRate: content.stat5Value || formData.stats?.successRate || '99.4%',
          };
        }
      }

      // Single write to Express server API (which updates Page collection and syncs to Settings)
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      setFormData(updatedSettings as SiteSettings);
      await onUpdateSettings(updatedSettings);

      setSuccessPopup({
        isOpen: true,
        title: `${pageLabel} Saved to Database!`,
        message: `Headings, description copy, and images for ${pageLabel} are permanently saved in MongoDB.`,
        targetPage: targetRoute,
      });
    } catch (err: any) {
      console.error('Failed to save page content:', err);
      alert('Error saving page: ' + (err.message || err));
    } finally {
      setSavingPageContent(false);
    }
  };

  // Handle Editing & Saving Service/Product
  const handleSaveEditedService = async (serviceToSave: ServiceItem) => {
    try {
      const res = await fetch(`/api/services/${serviceToSave.slug || serviceToSave.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceToSave),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const updated = allServices.map((s) => (s.id === serviceToSave.id || s.slug === serviceToSave.slug ? serviceToSave : s));
      setAllServices(updated);
      if (onUpdateServices) onUpdateServices(updated);
      setFormData((prev) => ({ ...prev, services: updated }));

      setEditingService(null);
      setSuccessPopup({
        isOpen: true,
        title: 'Service Updated Successfully!',
        message: `"${serviceToSave.title}" has been saved to MongoDB and is updated live across all pages.`,
        targetPage: serviceToSave.division === 'AI Hub' ? 'ai-hub' : 'ip-hub',
      });
    } catch (err: any) {
      console.error('Failed to update service:', err);
      alert('Error updating service: ' + (err.message || err));
    }
  };

  // Handle Deleting Service/Product
  const handleDeleteService = async (serviceId: string, serviceTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${serviceTitle}"? This will remove it from the database.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const remaining = allServices.filter((s) => s.id !== serviceId && s.slug !== serviceId);
      setAllServices(remaining);
      if (onUpdateServices) onUpdateServices(remaining);
      setFormData((prev) => ({ ...prev, services: remaining }));

      if (editingService?.id === serviceId) {
        setEditingService(null);
      }
      setSuccessPopup({
        isOpen: true,
        title: 'Service Deleted Successfully',
        message: `"${serviceTitle}" was deleted from MongoDB.`,
      });
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      alert('Error deleting service: ' + (err.message || err));
    }
  };

  // Handle Creating New Service or Product
  const handleCreateService = async () => {
    if (!newService.title || !newService.title.trim()) {
      alert('Please enter a service or product title.');
      return;
    }
    try {
      const title = newService.title.trim();
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const serviceId = `srv_${Date.now()}`;
      const div = newService.division || 'AI Hub';
      const subCat = div === 'AI Hub' ? (newService.subCategory || 'LYI Services') : undefined;

      const constructed: ServiceItem = {
        id: serviceId,
        slug,
        title,
        division: div,
        subCategory: subCat,
        shortDesc: newService.shortDesc || `${title} delivered by ${formData.companyName || 'LockYourIdea Tech'}.`,
        heroHeadline: newService.heroHeadline || `${title} for Enterprise Scale`,
        heroLede: newService.heroLede || newService.shortDesc || 'Engineered with production-grade reliability.',
        problemPoints: ['Manual workflow delays', 'Lack of custom automated tools', 'Inconsistent operational scale'],
        solutionText: newService.solutionText || `Full-lifecycle ${title} customized and deployed by LockYourIdea Tech specialists.`,
        features: [
          { title: 'Enterprise Architecture', desc: 'Secure, high-availability deployment tailored to your stack.' },
          { title: 'Full IP & Code Ownership', desc: 'All algorithms, code, and patents belong entirely to the client.' },
        ],
        benefits: ['Direct business efficiency', 'Measurable cost reduction', 'Pune HQ dedicated support'],
        industries: ['Manufacturing', 'Healthcare', 'Legal Tech', 'Retail', 'Logistics'],
        processSteps: [
          { step: '01', title: 'Audit & Scope', desc: 'Identify objectives, bottlenecks, and tech stack.' },
          { step: '02', title: 'Architect & Prototype', desc: 'Build initial pipeline and validate performance.' },
          { step: '03', title: 'Deployment & Training', desc: 'Roll out to production with seamless handover.' },
        ],
        faqs: [
          { q: `What is the delivery timeline for ${title}?`, a: 'Standard turnaround is 2 to 8 weeks depending on integration requirements.' },
        ],
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(constructed),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const updated = [constructed, ...allServices];
      setAllServices(updated);
      if (onUpdateServices) onUpdateServices(updated);
      setFormData((prev) => ({ ...prev, services: updated }));

      setIsAddServiceModalOpen(false);
      setNewService({
        division: 'AI Hub',
        subCategory: 'LYI Services',
        title: '',
        shortDesc: '',
        heroHeadline: '',
        heroLede: '',
        solutionText: '',
      });

      setSuccessPopup({
        isOpen: true,
        title: 'New Service Created Successfully!',
        message: `"${constructed.title}" is now published in ${constructed.division}${constructed.subCategory ? ` (${constructed.subCategory})` : ''} and saved to MongoDB.`,
        targetPage: constructed.division === 'AI Hub' ? 'ai-hub' : 'ip-hub',
      });
    } catch (err: any) {
      console.error('Failed to create service:', err);
      alert('Error creating service: ' + (err.message || err));
    }
  };

  // Handle Creating New Portfolio Item
  const handleCreatePortfolioItem = async () => {
    if (!newPortfolioItem.title || !newPortfolioItem.title.trim()) {
      alert('Please enter a project title.');
      return;
    }
    try {
      const portId = `port_${Date.now()}`;
      const itemToSave: PortfolioItem = {
        id: portId,
        title: newPortfolioItem.title.trim(),
        category: newPortfolioItem.category || 'AI Software',
        tag: newPortfolioItem.tag || newPortfolioItem.category || 'AI Software',
        description: newPortfolioItem.description || '',
        imageUrl:
          newPortfolioItem.imageUrl ||
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        client: newPortfolioItem.client || '',
        result: newPortfolioItem.result || '',
        projectUrl: newPortfolioItem.projectUrl || '',
        title_style: newPortfolioItem.title_style,
        client_style: newPortfolioItem.client_style,
        result_style: newPortfolioItem.result_style,
        description_style: newPortfolioItem.description_style,
      };

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const updated = [itemToSave, ...portfolioItems];
      setPortfolioItems(updated);
      if (onUpdatePortfolio) onUpdatePortfolio(updated);

      setIsAddPortfolioModalOpen(false);
      setNewPortfolioItem({
        title: '',
        category: 'AI Software',
        description: '',
        tag: 'AI Software',
        imageUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        client: '',
        result: '',
        projectUrl: '',
      });

      setSuccessPopup({
        isOpen: true,
        title: 'Project Card Created Successfully!',
        message: `Project "${itemToSave.title}" has been published to the portfolio and saved to MongoDB.`,
        targetPage: 'portfolio',
      });
    } catch (err: any) {
      console.error('Failed to create portfolio item:', err);
      alert('Error creating portfolio item: ' + (err.message || err));
    }
  };

  // Handle Editing & Saving Portfolio Item
  const handleSaveEditedPortfolioItem = async (itemToSave: PortfolioItem) => {
    try {
      const res = await fetch(`/api/portfolio/${itemToSave.id || (itemToSave as any)._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const updated = portfolioItems.map((p) => (p.id === itemToSave.id ? itemToSave : p));
      setPortfolioItems(updated);
      if (onUpdatePortfolio) onUpdatePortfolio(updated);

      setEditingPortfolioItem(null);
      setSuccessPopup({
        isOpen: true,
        title: 'Project Card Updated Successfully!',
        message: `Project "${itemToSave.title}" has been saved to MongoDB and updated live on the website.`,
        targetPage: 'portfolio',
      });
    } catch (err: any) {
      console.error('Failed to update portfolio item:', err);
      alert('Error updating portfolio item: ' + (err.message || err));
    }
  };

  // Handle Deleting Portfolio Item
  const handleDeletePortfolioItem = async (portfolioId: string, portfolioTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${portfolioTitle}"? This will remove it from the database.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/portfolio/${portfolioId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const updated = portfolioItems.filter((p) => p.id !== portfolioId);
      setPortfolioItems(updated);
      if (onUpdatePortfolio) onUpdatePortfolio(updated);

      if (editingPortfolioItem?.id === portfolioId) {
        setEditingPortfolioItem(null);
      }

      setSuccessPopup({
        isOpen: true,
        title: 'Project Deleted Successfully',
        message: `"${portfolioTitle}" was removed from MongoDB.`,
        targetPage: 'portfolio',
      });
    } catch (err: any) {
      console.error('Failed to delete portfolio item:', err);
      alert('Error deleting portfolio item: ' + (err.message || err));
    }
  };

  // Handle Saving Testimonial (Add or Edit)
  const handleSaveTestimonial = async (t: TestimonialItem) => {
    if (!t.author || !t.quote) {
      alert('Please provide both an author and a testimonial quote.');
      return;
    }
    try {
      const initials = t.initials || t.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
      const testimonialToSave: TestimonialItem = {
        ...t,
        initials,
        rating: t.rating || 5,
      };

      let updatedList: TestimonialItem[];
      const existingIdx = testimonials.findIndex((item) => item.id === testimonialToSave.id);
      if (existingIdx >= 0) {
        updatedList = testimonials.map((item) => (item.id === testimonialToSave.id ? testimonialToSave : item));
      } else {
        updatedList = [testimonialToSave, ...testimonials];
      }

      setTestimonials(updatedList);
      setFormData((prev) => ({ ...prev, testimonials: updatedList }));

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonials: updatedList }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      await onUpdateSettings({ testimonials: updatedList });

      setIsAddTestimonialModalOpen(false);
      setEditingTestimonial(null);
      setNewTestimonial({
        quote: '',
        author: '',
        role: '',
        company: '',
        initials: '',
        rating: 5,
      });

      setSuccessPopup({
        isOpen: true,
        title: existingIdx >= 0 ? 'Testimonial Updated!' : 'New Testimonial Added!',
        message: `Testimonial from "${testimonialToSave.author}" (${testimonialToSave.company || 'Client'}) is saved to MongoDB and live on the website.`,
        targetPage: 'home',
      });
    } catch (err: any) {
      console.error('Failed to save testimonial:', err);
      alert('Error saving testimonial: ' + (err.message || err));
    }
  };

  // Handle Deleting Testimonial
  const handleDeleteTestimonial = async (testimonialId: string, author: string) => {
    if (!window.confirm(`Are you sure you want to remove the testimonial from "${author}"?`)) {
      return;
    }
    try {
      const updatedList = testimonials.filter((t) => t.id !== testimonialId);
      setTestimonials(updatedList);
      setFormData((prev) => ({ ...prev, testimonials: updatedList }));

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonials: updatedList }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      await onUpdateSettings({ testimonials: updatedList });

      if (editingTestimonial?.id === testimonialId) {
        setEditingTestimonial(null);
      }

      setSuccessPopup({
        isOpen: true,
        title: 'Testimonial Removed',
        message: `Testimonial from "${author}" was removed from MongoDB.`,
        targetPage: 'home',
      });
    } catch (err: any) {
      console.error('Failed to delete testimonial:', err);
      alert('Error deleting testimonial: ' + (err.message || err));
    }
  };

  // Handle Theme & Styling Save
  const handleSaveTheme = async (themeToSave: ThemeCustomization) => {
    setSavingTheme(true);
    try {
      const updatedFormData: SiteSettings = {
        ...formData,
        theme: themeToSave,
      };
      setFormData(updatedFormData);
      setThemeData(themeToSave);

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeToSave }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      await onUpdateSettings(updatedFormData);

      setSuccessPopup({
        isOpen: true,
        title: 'Theme & Typography Saved!',
        message: 'Your custom button colors, typography, and theme styling were saved to MongoDB.',
        targetPage: 'home',
      });
    } catch (err: any) {
      console.error('Failed to save theme:', err);
      alert('Error saving theme: ' + (err.message || err));
    } finally {
      setSavingTheme(false);
    }
  };

  // Handle Client Logos Save
  const handleSaveClientLogos = async (updatedLogos: ClientLogoItem[]) => {
    setSavingLogos(true);
    try {
      const updatedFormData: SiteSettings = {
        ...formData,
        clientLogos: updatedLogos,
      };
      setFormData(updatedFormData);
      setClientLogos(updatedLogos);

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientLogos: updatedLogos }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      await onUpdateSettings(updatedFormData);

      setSuccessPopup({
        isOpen: true,
        title: 'Client Logos Scroller Saved!',
        message: 'The infinite client logo slider has been saved to MongoDB.',
        targetPage: 'home',
      });
    } catch (err: any) {
      console.error('Failed to save client logos:', err);
      alert('Error saving client logos: ' + (err.message || err));
    } finally {
      setSavingLogos(false);
    }
  };

  // Handle Industries Save
  const handleSaveIndustries = async (updatedIndustries: IndustryItem[], pageContentUpdate?: any) => {
    setSavingIndustries(true);
    try {
      const updatedFormData: SiteSettings = {
        ...formData,
        industries: updatedIndustries,
        ...(pageContentUpdate?.industriesBgImage ? { industriesBgImage: pageContentUpdate.industriesBgImage } : {}),
        pageContent: {
          ...(formData.pageContent || {}),
          ...(pageContentUpdate?.industries ? { industries: pageContentUpdate.industries } : {}),
        },
      };
      setFormData(updatedFormData);

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      await onUpdateSettings(updatedFormData);

      setSuccessPopup({
        isOpen: true,
        title: 'Industries Page & Sectors Saved!',
        message: 'Your industry sectors and hero styling are now live on the website and saved in MongoDB.',
        targetPage: 'industries',
      });
    } catch (err: any) {
      console.error('Failed to save industries:', err);
      alert('Error saving industries: ' + (err.message || err));
    } finally {
      setSavingIndustries(false);
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      await onUpdateSettings(formData);

      setSaveSuccessMsg('All details & images saved to MongoDB!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
      setSuccessPopup({
        isOpen: true,
        title: 'Saved to MongoDB Database!',
        message: 'All company details, background photos, numbers, and settings have been written to MongoDB.',
        targetPage: 'home',
      });
    } catch (err: any) {
      console.error('Save to MongoDB failed:', err);
      alert('Error saving settings: ' + (err.message || err));
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle Booking Status Change
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
        );
        setSuccessPopup({
          isOpen: true,
          title: 'Booking Status Updated Successfully!',
          message: `Consultation status changed to "${newStatus}".`,
        });
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Handle Single Booking Delete
  const handleDeleteBooking = async (id: string, reference: string) => {
    if (!window.confirm(`Are you sure you want to remove consultation booking "${reference}"? This will delete it from MongoDB.`)) {
      return;
    }
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      const remaining = bookings.filter((b) => b.id !== id);
      setBookings(remaining);
      try {
        localStorage.setItem('lyi_stored_bookings', JSON.stringify(remaining.slice(0, 50)));
      } catch (_) {}

      setSuccessPopup({
        isOpen: true,
        title: 'Booking Deleted',
        message: `Consultation ${reference} was removed from the database. Active bookings remaining: ${remaining.length}`,
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Delete booking error:', err);
    }
  };

  // Handle Clear All Bookings (Reset to 0 Bookings)
  const handleClearAllBookings = async () => {
    if (!window.confirm('Are you sure you want to clear ALL bookings? This will reset the database to 0 bookings and release all slots.')) {
      return;
    }
    try {
      await fetch('/api/bookings', { method: 'DELETE' });
      setBookings([]);
      try {
        localStorage.setItem('lyi_stored_bookings', JSON.stringify([]));
      } catch (_) {}

      setSuccessPopup({
        isOpen: true,
        title: 'All Bookings Reset to 0',
        message: 'Active bookings in the database have been reset to 0. All calendar slots are now fully open.',
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Clear all bookings error:', err);
    }
  };

  // Handle Export CSV
  const handleDownloadCsv = () => {
    window.open('/api/bookings/export-csv', '_blank');
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(crmSearch.toLowerCase()) ||
      b.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
      b.reference.toLowerCase().includes(crmSearch.toLowerCase()) ||
      b.service.toLowerCase().includes(crmSearch.toLowerCase()) ||
      (b.organization && b.organization.toLowerCase().includes(crmSearch.toLowerCase())) ||
      (b.message && b.message.toLowerCase().includes(crmSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesDivision = divisionFilter === 'all' || b.division === divisionFilter;

    return matchesSearch && matchesStatus && matchesDivision;
  });

  // Calculate Real Figures for Dashboard
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in-progress').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-md flex justify-center items-center p-4">
        <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight font-heading">LockYourIdea Admin Portal</h3>
            <p className="text-xs text-slate-400">Enter master administrator passkey to access MongoDB CMS controls.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Admin Passkey</label>
              <input
                type="password"
                required
                autoFocus
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter passkey (e.g. lyiadmin2026)"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {authenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{authenticating ? 'Verifying Credentials...' : 'Unlock CMS Dashboard'}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel &amp; Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Toggle Navigation Menu"
            >
              <Sliders className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 flex items-center justify-center font-extrabold text-xs shadow-md">
              LYI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight font-heading">
                  Admin Control Panel
                </h2>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  HQ: Pune
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                CMS &amp; Data Management Portal · MongoDB Atlas Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/#admin`);
                setSuccessPopup({
                  isOpen: true,
                  title: 'Admin Link Copied!',
                  message: `Admin Endpoint URL copied: ${window.location.origin}/#admin`,
                });
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold border border-purple-700/50 transition-colors cursor-pointer"
              title="Copy Admin Endpoint URL"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Admin URL</span>
            </button>
            <button
              onClick={fetchBookings}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 text-amber-200 font-bold text-xs transition-colors cursor-pointer"
              title="Lock and Log Out"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Exit Dashboard ✕
            </button>
          </div>
        </div>

        {/* Main Content Layout: Vertical Sidebar + Right Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Vertical Sidebar Navigation */}
          <aside
            className={`w-64 sm:w-72 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto transition-all duration-300 absolute md:relative z-40 inset-y-0 left-0 ${
              isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <div className="p-3.5 space-y-1 font-sans">
              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center justify-between">
                <span>ADMIN SIDEBAR MENU</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Option 1: All Pages (CMS) Dropdown */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsCmsDropdownOpen(!isCmsDropdownOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'pages'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <span>All Pages (CMS)</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isCmsDropdownOpen ? 'rotate-90 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Items */}
                {isCmsDropdownOpen && (
                  <div className="ml-3 pl-3 border-l-2 border-slate-800 space-y-1 py-1">
                    {[
                      { id: 'home', label: '1. Home Page' },
                      { id: 'ai-hub', label: '2. AI Hub' },
                      { id: 'ip-hub', label: '3. IP Hub' },
                      { id: 'portfolio', label: '4. Portfolio' },
                      { id: 'industries', label: '5. Industries' },
                      { id: 'case-studies', label: '6. Case Studies' },
                      { id: 'about', label: '7. About Us' },
                      { id: 'contact', label: '8. Contact' },
                    ].map((p) => {
                      const isSelected = activeTab === 'pages' && selectedCmsPage === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setActiveTab('pages');
                            setSelectedCmsPage(p.id as any);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg font-medium text-xs transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/25'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                          }`}
                        >
                          <span>{p.label}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-xs shadow-cyan-300" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Option: SEO / GEO / LLM Optimization */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('seo');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'seo'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-purple-400" />
                  <span>SEO / GEO / LLM Optimization</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  CMS
                </span>
              </button>

              {/* Option 2: AI & IP Services Cards */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('services');
                  setIsMobileSidebarOpen(false);

                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>AI &amp; IP Services Cards</span>
              </button>

              {/* Option 3: Portfolios Cards */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('portfolio');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>Portfolios Cards</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {portfolioItems.length}
                </span>
              </button>

              {/* Option 4: Industries Cards */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('industries');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'industries'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Industries Cards</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {(formData.industries || INDUSTRIES_LIST).length}
                </span>
              </button>

              {/* Option 5: Client Logos Scroller */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('logos');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'logos'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Client Logos Scroller</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {clientLogos.length}
                </span>
              </button>

              {/* Option 6: Client Testimonials */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('testimonials');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                  <span>Client Testimonials</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  {testimonials.length}
                </span>
              </button>

              {/* Option 7: Theme, Colors & Typography */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('styling');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'styling'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Theme, Colors &amp; Typography</span>
              </button>

              {/* Option 8: Header Logo & Size Manager */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('header-logo');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'header-logo'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>Header Logo &amp; Size</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  {formData.logoHeight || 40}px
                </span>
              </button>

              {/* Option 9: Website Info & Settings */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Website Info &amp; Settings</span>
              </button>

              {/* Option 8: Real-Time Slots & CRM */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('crm');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'crm'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Real-Time Slots &amp; CRM</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  {bookings.length}
                </span>
              </button>

              {/* Option 9: Email Dispatch Audit */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('emails');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'emails'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email Dispatch Audit</span>
              </button>
            </div>
          </aside>

          {/* Mobile backdrop */}
          {isMobileSidebarOpen && (
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-950/60 z-30 backdrop-blur-xs"
            />
          )}

          {/* Right Main Content Panel */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {/* TAB 1: REAL-TIME SLOTS & CRM PORTAL */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              {/* Real Figures Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Total Consultations
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-heading">
                      {bookings.length} Slots
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Live Real-Time Pipeline
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Confirmed Slots
                    </span>
                    <span className="text-2xl font-extrabold text-blue-600 mt-1 block font-heading">
                      {confirmedCount} Active
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {inProgressCount} in progress
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Pipeline Value (Real)
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-700 mt-1 block font-heading">
                      ₹48.5 Lakhs
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      Avg budget: ₹3.8L / client
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Headquarters
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 mt-1 block font-heading">
                      Pune, MH
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> Baner, Pune
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Action & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex-1 flex flex-wrap items-center gap-2.5">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by client name, email, ref, company, requirements..."
                      value={crmSearch}
                      onChange={(e) => setCrmSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={divisionFilter}
                    onChange={(e) => setDivisionFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Divisions</option>
                    <option value="AI Hub">AI Hub</option>
                    <option value="IP Hub">IP Hub</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Reset / Clear to 0 Bookings Button */}
                  <button
                    type="button"
                    onClick={handleClearAllBookings}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors cursor-pointer"
                    title="Reset database to 0 bookings and release all slots"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Reset to 0 Bookings</span>
                  </button>

                  {/* EXCEL SHEET DOWNLOAD BUTTON */}
                  <button
                    onClick={handleDownloadCsv}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Download Excel Sheet (.csv)</span>
                  </button>

                  {/* Book new slot directly */}
                  {onOpenBookingModal && (
                    <button
                      onClick={onOpenBookingModal}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Book Slot</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SpreadSheet / Table View */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                      Company Scheduled Consultations Master Sheet
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {filteredBookings.length} of {bookings.length} Bookings
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-3.5">Ref #</th>
                        <th className="p-3.5">Client &amp; Contact</th>
                        <th className="p-3.5">Organization</th>
                        <th className="p-3.5">Service &amp; Division</th>
                        <th className="p-3.5">Date &amp; Slot</th>
                        <th className="p-3.5">Budget</th>
                        <th className="p-3.5 min-w-[200px]">Client Requirement (What They Want)</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-10 text-center">
                            <div className="max-w-md mx-auto space-y-2">
                              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-bold">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div className="font-extrabold text-sm text-slate-900 font-heading">
                                {bookings.length === 0 ? '0 Active Bookings in Database' : 'No Matching Consultation Slots'}
                              </div>
                              <p className="text-xs text-slate-500">
                                {bookings.length === 0
                                  ? 'The database currently contains 0 bookings. All calendar dates and time slots are 100% open for website visitors.'
                                  : 'No consultations match your search query or selected filter criteria.'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-blue-600">
                              {b.reference}
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{b.fullName}</div>
                              <div className="text-[11px] text-slate-500">{b.email}</div>
                              <div className="text-[10px] text-slate-400">{b.mobile}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-slate-800">
                                {b.organization || 'Individual'}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {b.designation || b.orgType}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.division === 'AI Hub'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-cyan-100 text-cyan-700'
                                }`}
                              >
                                {b.division}
                              </span>
                              <div className="font-medium text-slate-700 mt-1 line-clamp-1">
                                {b.service}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{b.date}</div>
                              <div className="text-slate-600 text-[11px]">{b.timeSlot}</div>
                              <div className="text-[10px] text-blue-600">{b.mode}</div>
                            </td>
                            <td className="p-3.5 font-semibold text-slate-900">
                              {b.budget || '—'}
                            </td>
                            <td className="p-3.5">
                              <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-slate-700 text-[11px] line-clamp-2 max-w-xs">
                                {b.message || 'No specific requirement entered.'}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : b.status === 'in-progress'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : b.status === 'completed'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="in-progress">In-Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReminderBooking(b);
                                    setReminderCustomMessage('');
                                    setReminderStatusMsg(null);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Send consultation slot reminder to client"
                                >
                                  <Bell className="w-3 h-3" />
                                  <span>Remind</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedBooking(b)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEO / GEO / LLM OPTIMIZATION CMS */}
          {activeTab === 'seo' && (
            <AdminSeoGeoManager
              seoConfigs={seoConfigs || {}}
              onSaveSeoConfig={onSaveSeoConfig || (async () => {})}
              onResetSeoConfig={onResetSeoConfig || (async () => {})}
            />
          )}

          {/* TAB: THEME, COLORS & TYPOGRAPHY CUSTOMIZER */}
          {activeTab === 'styling' && (

            <AdminThemeCustomizer
              initialTheme={themeData}
              onSaveTheme={handleSaveTheme}
              saving={savingTheme}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB: HEADER LOGO MANAGEMENT */}
          {activeTab === 'header-logo' && (
            <AdminHeaderLogoManager
              siteSettings={siteSettings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {/* TAB: COLORFUL CLIENT LOGOS SCROLLER MANAGER */}
          {activeTab === 'logos' && (
            <AdminClientLogosManager
              initialLogos={clientLogos}
              onSaveLogos={handleSaveClientLogos}
              saving={savingLogos}
            />
          )}

          {/* TAB: INDUSTRIES PAGE & SECTOR SOLUTIONS MANAGER */}
          {activeTab === 'industries' && (
            <AdminIndustriesManager
              siteSettings={formData}
              onSaveIndustries={handleSaveIndustries}
              saving={savingIndustries}
            />
          )}

          {/* TAB: SEO / GEO / LLM OPTIMIZATION */}
          {activeTab === 'seo' && (
            <AdminSeoGeoManager
              seoConfigs={seoConfigs || {}}
              onSaveSeoConfig={onSaveSeoConfig || (async () => {})}
              onResetSeoConfig={onResetSeoConfig || (async () => {})}
            />
          )}

          {/* TAB: ALL PAGES CONTENT & IMAGES CMS */}
          {activeTab === 'pages' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[11px] font-bold text-cyan-300">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Real-Time Cloud CMS · Powered by Firebase &amp; Local Persistence</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Pages Content, Headings &amp; Photos Manager
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Update all text, badges, headlines, descriptions, and background images across every page. Changes take effect on the website in real-time.
                  </p>
                </div>
              </div>

              {/* Page Selector Tabs */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
                {(
                  [
                    { id: 'home', label: '1. Home Page', route: 'home' },
                    { id: 'ai-hub', label: '2. AI Hub', route: 'ai-hub' },
                    { id: 'ip-hub', label: '3. IP Hub', route: 'ip-hub' },
                    { id: 'portfolio', label: '4. Portfolio', route: 'portfolio' },
                    { id: 'industries', label: '5. Industries', route: 'industries' },
                    { id: 'case-studies', label: '6. Case Studies', route: 'case-studies' },
                    { id: 'about', label: '7. About Us', route: 'about' },
                    { id: 'contact', label: '8. Contact', route: 'contact' },
                  ] as const
                ).map((p) => {
                  const isSelected = selectedCmsPage === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedCmsPage(p.id)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Page Editor Form */}
              {(() => {
                const cur = (formData.pageContent?.[selectedCmsPage] || {}) as PageContentItem;

                const updateCurField = (field: string, val: any) => {
                  setFormData((prev) => ({
                    ...prev,
                    pageContent: {
                      ...(prev.pageContent || {}),
                      [selectedCmsPage]: {
                        pageId: selectedCmsPage,
                        ...(prev.pageContent?.[selectedCmsPage] || {}),
                        [field]: val,
                      },
                    },
                  }));
                };

                const pageTitles: Record<string, { title: string; route: PageRoute; sub: string }> = {
                  home: {
                    title: 'Home Page Content & Division Showcase Cards',
                    route: 'home',
                    sub: 'Configure hero headline, badges, and the AI Hub & IP Hub showcase cards displayed on the homepage.',
                  },
                  'ai-hub': {
                    title: 'AI Hub Page Content & Header Background',
                    route: 'ai-hub',
                    sub: 'Configure AI Hub hero headline, badges, descriptions, and high-tech background image.',
                  },
                  'ip-hub': {
                    title: 'IP Hub Page Content & Header Background',
                    route: 'ip-hub',
                    sub: 'Configure IP Hub hero headline, legal-tech descriptions, and header background image.',
                  },
                  portfolio: {
                    title: 'Portfolio & Deliveries Page Content',
                    route: 'portfolio',
                    sub: 'Configure Selected Engagements header text, badges, and background image.',
                  },
                  industries: {
                    title: 'Industries We Serve Page Content & Background',
                    route: 'industries',
                    sub: 'Configure sector expertise header headline, descriptions, badges, and background image.',
                  },
                  'case-studies': {
                    title: 'Case Studies & Results Page Content',
                    route: 'case-studies',
                    sub: 'Configure Real Client Outcomes header text, descriptions, and background image.',
                  },
                  about: {
                    title: 'About Us & Pune HQ Page Content',
                    route: 'about',
                    sub: 'Configure India 360° AI & IP company story headline, descriptions, and background image.',
                  },
                  contact: {
                    title: 'Contact & Consultation Page Content',
                    route: 'contact',
                    sub: 'Configure Get In Touch headline, Pune HQ coordination copy, and background image.',
                  },
                };

                const currentMeta = pageTitles[selectedCmsPage] || {
                  title: 'Page Editor',
                  route: 'home',
                  sub: 'Manage page text and images',
                };

                return (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    {/* Header with live preview button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase font-mono">
                          Editing: {selectedCmsPage.toUpperCase()}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 font-heading mt-1">
                          {currentMeta.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{currentMeta.sub}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onNavigate && (
                          <button
                            type="button"
                            onClick={() => {
                              onNavigate(currentMeta.route);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Preview Live Page ↗</span>
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={savingPageContent}
                          onClick={() =>
                            handleSavePageContent(
                              selectedCmsPage,
                              cur,
                              currentMeta.title,
                              currentMeta.route
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <Save className="w-4 h-4 text-cyan-300" />
                          <span>{savingPageContent ? 'Saving...' : 'Save & Publish Page'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Standard Fields: Badge, Headline, Subheadline with Styling Controls */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <AdminStyledField
                            label="Pill / Badge Tagline"
                            value={cur.badge || ''}
                            styleValue={cur.badge_style}
                            onChange={(val) => updateCurField('badge', val)}
                            onStyleChange={(style) => updateCurField('badge_style', style)}
                            placeholder="e.g. 360° AI & INTELLECTUAL PROPERTY"
                            helperText="Small uppercase badge at top of section"
                            headingLevel="badge"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <AdminStyledField
                            label="Main Headline / Title"
                            value={cur.headline || ''}
                            styleValue={cur.headline_style}
                            onChange={(val) => updateCurField('headline', val)}
                            onStyleChange={(style) => updateCurField('headline_style', style)}
                            placeholder="Enter main page title..."
                            helperText="Main prominent heading rendered on this page"
                            headingLevel="h1"
                          />
                        </div>
                      </div>

                      <div>
                        <AdminStyledField
                          label="Subheadline / Descriptive Lede Paragraph"
                          value={cur.subheadline || ''}
                          styleValue={cur.subheadline_style}
                          onChange={(val) => updateCurField('subheadline', val)}
                          onStyleChange={(style) => updateCurField('subheadline_style', style)}
                          placeholder="Enter descriptive copy..."
                          isTextarea
                          rows={3}
                        />
                      </div>

                      {/* Header / Hero Background Image */}
                      <div className="pt-2">
                        <ImageSourceSelector
                          label={`Header Background Image for ${currentMeta.title}`}
                          value={cur.bgImage || ''}
                          onChange={(newVal) => updateCurField('bgImage', newVal)}
                          onInstantSave={(url) => {
                            updateCurField('bgImage', url);
                            handleSavePageContent(
                              selectedCmsPage,
                              { ...cur, bgImage: url },
                              `${currentMeta.title} Background Image`,
                              currentMeta.route
                            );
                          }}
                          presets={[
                            {
                              label: 'Deep Fluid Sapphire (Eye-Soothing AI)',
                              url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85',
                            },
                            {
                              label: 'Luminous Neural Synapses',
                              url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2400&q=85',
                            },
                            {
                              label: 'Quantum Hologram & Tech Light',
                              url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2400&q=85',
                            },
                            {
                              label: 'Modern Tech Engineering Studio',
                              url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80',
                            },
                            {
                              label: 'Deep Tech Connected Globe',
                              url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80',
                            },
                            {
                              label: 'Pune Tech Innovation',
                              url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2000&q=80',
                            },
                          ]}
                          helperText="Applied as the full-width high-resolution background with eye-soothing theme overlays and grid."
                        />
                      </div>
                    </div>

                    {/* Specific Extra Fields for Home Page */}
                    {selectedCmsPage === 'home' && (
                      <div className="pt-6 border-t border-slate-200 space-y-6">
                        {/* Section A: Header Logo, Company Name & Branding */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                              Section 1: Header Brand Logo, Company Name &amp; Direct Helplines
                            </span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                              Header &amp; Navbar Settings
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Company Name (Header Main Title)"
                              value={cur.companyName || formData.companyName || ''}
                              styleValue={cur.companyName_style || formData.companyName_style}
                              onChange={(val) => {
                                updateCurField('companyName', val);
                                setFormData((prev) => ({ ...prev, companyName: val }));
                              }}
                              onStyleChange={(style) => {
                                updateCurField('companyName_style', style);
                                setFormData((prev) => ({ ...prev, companyName_style: style }));
                              }}
                              placeholder="e.g. LYI Tech Pvt. Ltd."
                              helperText="Main company name shown in header next to logo"
                              headingLevel="h1"
                            />

                            <AdminStyledField
                              label="Header Subtitle (Tagline)"
                              value={cur.tagline || cur.headerSubtitle || formData.tagline || formData.headerSubtitle || ''}
                              styleValue={cur.tagline_style || cur.headerSubtitle_style || formData.tagline_style || formData.headerSubtitle_style}
                              onChange={(val) => {
                                updateCurField('tagline', val);
                                updateCurField('headerSubtitle', val);
                                setFormData((prev) => ({ ...prev, tagline: val, headerSubtitle: val }));
                              }}
                              onStyleChange={(style) => {
                                updateCurField('tagline_style', style);
                                updateCurField('headerSubtitle_style', style);
                                setFormData((prev) => ({ ...prev, tagline_style: style, headerSubtitle_style: style }));
                              }}
                              placeholder="e.g. India's 360° AI & IP Company"
                              helperText="Subtitle text shown right below the company name in header"
                              headingLevel="badge"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="HQ Office Location Text"
                              value={cur.hqAddress || formData.hqAddress || ''}
                              styleValue={cur.hqAddress_style}
                              onChange={(val) => {
                                updateCurField('hqAddress', val);
                                setFormData((prev) => ({ ...prev, hqAddress: val }));
                              }}
                              onStyleChange={(style) => updateCurField('hqAddress_style', style)}
                              placeholder="HQ: Baner, Pune, Maharashtra 411045"
                            />

                            <AdminStyledField
                              label="Direct Phone Helpline"
                              value={cur.phone || formData.phone || ''}
                              styleValue={cur.phone_style}
                              onChange={(val) => {
                                updateCurField('phone', val);
                                setFormData((prev) => ({ ...prev, phone: val }));
                              }}
                              onStyleChange={(style) => updateCurField('phone_style', style)}
                              placeholder="+91 75586 31355"
                            />
                          </div>

                          {/* Company Logo Image Selector & Upload */}
                          <div className="pt-2 border-t border-slate-200">
                            <ImageSourceSelector
                              label="Company Brand Logo (Header & Footer)"
                              value={cur.logoUrl || formData.logoUrl || '/assets/logo.svg'}
                              onChange={(newUrl) => {
                                updateCurField('logoUrl', newUrl);
                                setFormData((prev) => ({ ...prev, logoUrl: newUrl }));
                              }}
                              onInstantSave={(url) => {
                                updateCurField('logoUrl', url);
                                setFormData((prev) => ({ ...prev, logoUrl: url }));
                                onUpdateSettings({ logoUrl: url });
                              }}
                              helperText="Upload or enter image link for company logo. Appears in header and footer."
                            />
                          </div>
                        </div>

                        {/* Section B: Hero Buttons & Trust Bullets */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Section 2: Hero Call-to-Action Buttons &amp; Trust Points
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminStyledField
                              label="Primary CTA Button Text"
                              value={cur.ctaPrimaryText || ''}
                              styleValue={cur.ctaPrimaryText_style}
                              onChange={(val) => updateCurField('ctaPrimaryText', val)}
                              onStyleChange={(style) => updateCurField('ctaPrimaryText_style', style)}
                              placeholder="Book Free Consultation"
                            />
                            <AdminStyledField
                              label="Secondary CTA Button Text"
                              value={cur.ctaSecondaryText || ''}
                              styleValue={cur.ctaSecondaryText_style}
                              onChange={(val) => updateCurField('ctaSecondaryText', val)}
                              onStyleChange={(style) => updateCurField('ctaSecondaryText_style', style)}
                              placeholder="Explore AI & IP Solutions"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <AdminStyledField
                              label="Trust Point 1"
                              value={cur.trustPoint1 || ''}
                              styleValue={cur.trustPoint1_style}
                              onChange={(val) => updateCurField('trustPoint1', val)}
                              onStyleChange={(style) => updateCurField('trustPoint1_style', style)}
                              placeholder="Real-Time Slot Scheduling"
                            />
                            <AdminStyledField
                              label="Trust Point 2"
                              value={cur.trustPoint2 || ''}
                              styleValue={cur.trustPoint2_style}
                              onChange={(val) => updateCurField('trustPoint2', val)}
                              onStyleChange={(style) => updateCurField('trustPoint2_style', style)}
                              placeholder="Instant Calendar & Video Invite"
                            />
                            <AdminStyledField
                              label="Trust Point 3"
                              value={cur.trustPoint3 || ''}
                              styleValue={cur.trustPoint3_style}
                              onChange={(val) => updateCurField('trustPoint3', val)}
                              onStyleChange={(style) => updateCurField('trustPoint3_style', style)}
                              placeholder="Baner, Pune Headquarters"
                            />
                          </div>
                        </div>

                        {/* Section C: Hero Live CRM Command Center Card */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Section 3: Live CRM Command Center Showcase Card (Hero Right Side)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminStyledField
                              label="Command Center Card Title"
                              value={cur.commandCenterTitle || ''}
                              styleValue={cur.commandCenterTitle_style}
                              onChange={(val) => updateCurField('commandCenterTitle', val)}
                              onStyleChange={(style) => updateCurField('commandCenterTitle_style', style)}
                              placeholder="Live CRM Portal · Pune"
                            />
                            <AdminStyledField
                              label="Action Button Text"
                              value={cur.commandCenterActionText || ''}
                              styleValue={cur.commandCenterActionText_style}
                              onChange={(val) => updateCurField('commandCenterActionText', val)}
                              onStyleChange={(style) => updateCurField('commandCenterActionText_style', style)}
                              placeholder="Click to Book Live Consultation Slot →"
                            />
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                            <AdminStyledField
                              label="Metric 1 Value"
                              value={cur.metric1Value || ''}
                              styleValue={cur.metric1Value_style}
                              onChange={(val) => updateCurField('metric1Value', val)}
                              onStyleChange={(style) => updateCurField('metric1Value_style', style)}
                              placeholder="150+ Live"
                            />
                            <AdminStyledField
                              label="Metric 1 Label"
                              value={cur.metric1Label || ''}
                              styleValue={cur.metric1Label_style}
                              onChange={(val) => updateCurField('metric1Label', val)}
                              onStyleChange={(style) => updateCurField('metric1Label_style', style)}
                              placeholder="Active AI Pipelines"
                            />
                            <AdminStyledField
                              label="Metric 2 Value"
                              value={cur.metric2Value || ''}
                              styleValue={cur.metric2Value_style}
                              onChange={(val) => updateCurField('metric2Value', val)}
                              onStyleChange={(style) => updateCurField('metric2Value_style', style)}
                              placeholder="500+ Filings"
                            />
                            <AdminStyledField
                              label="Metric 2 Label"
                              value={cur.metric2Label || ''}
                              styleValue={cur.metric2Label_style}
                              onChange={(val) => updateCurField('metric2Label', val)}
                              onStyleChange={(style) => updateCurField('metric2Label_style', style)}
                              placeholder="IP Prosecution"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <AdminStyledField
                              label="Metric 2 Green Tag"
                              value={cur.metric2Tag || ''}
                              styleValue={cur.metric2Tag_style}
                              onChange={(val) => updateCurField('metric2Tag', val)}
                              onStyleChange={(style) => updateCurField('metric2Tag_style', style)}
                              placeholder="99.4% Granted"
                            />
                            <AdminStyledField
                              label="Specialist Availability Label"
                              value={cur.availLabel || ''}
                              styleValue={cur.availLabel_style}
                              onChange={(val) => updateCurField('availLabel', val)}
                              onStyleChange={(style) => updateCurField('availLabel_style', style)}
                              placeholder="Pune Specialist Availability"
                            />
                            <AdminStyledField
                              label="Availability Status Text"
                              value={cur.availStatus || ''}
                              styleValue={cur.availStatus_style}
                              onChange={(val) => updateCurField('availStatus', val)}
                              onStyleChange={(style) => updateCurField('availStatus_style', style)}
                              placeholder="Slots Available Today"
                            />
                          </div>
                        </div>

                        {/* Section D: Trust Bar Stats Numbers & Labels */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Section 4: Impact Numbers &amp; Metrics Bar (Non-Bold Clean Numbers)
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div className="space-y-2">
                              <AdminStyledField
                                label="Stat 1 Number"
                                value={cur.stat1Value || formData.stats?.aiProjects || ''}
                                styleValue={cur.stat1Value_style}
                                onChange={(val) => updateCurField('stat1Value', val)}
                                onStyleChange={(style) => updateCurField('stat1Value_style', style)}
                                placeholder="150+"
                              />
                              <AdminStyledField
                                label="Stat 1 Label"
                                value={cur.stat1Label || ''}
                                styleValue={cur.stat1Label_style}
                                onChange={(val) => updateCurField('stat1Label', val)}
                                onStyleChange={(style) => updateCurField('stat1Label_style', style)}
                                placeholder="AI Projects Delivered"
                              />
                            </div>

                            <div className="space-y-2">
                              <AdminStyledField
                                label="Stat 2 Number"
                                value={cur.stat2Value || formData.stats?.ipRegistrations || ''}
                                styleValue={cur.stat2Value_style}
                                onChange={(val) => updateCurField('stat2Value', val)}
                                onStyleChange={(style) => updateCurField('stat2Value_style', style)}
                                placeholder="500+"
                              />
                              <AdminStyledField
                                label="Stat 2 Label"
                                value={cur.stat2Label || ''}
                                styleValue={cur.stat2Label_style}
                                onChange={(val) => updateCurField('stat2Label', val)}
                                onStyleChange={(style) => updateCurField('stat2Label_style', style)}
                                placeholder="IP Registrations"
                              />
                            </div>

                            <div className="space-y-2">
                              <AdminStyledField
                                label="Stat 3 Number"
                                value={cur.stat3Value || formData.stats?.enterpriseClients || ''}
                                styleValue={cur.stat3Value_style}
                                onChange={(val) => updateCurField('stat3Value', val)}
                                onStyleChange={(style) => updateCurField('stat3Value_style', style)}
                                placeholder="80+"
                              />
                              <AdminStyledField
                                label="Stat 3 Label"
                                value={cur.stat3Label || ''}
                                styleValue={cur.stat3Label_style}
                                onChange={(val) => updateCurField('stat3Label', val)}
                                onStyleChange={(style) => updateCurField('stat3Label_style', style)}
                                placeholder="Enterprise Clients"
                              />
                            </div>

                            <div className="space-y-2">
                              <AdminStyledField
                                label="Stat 4 Number"
                                value={cur.stat4Value || formData.stats?.trainedCount || ''}
                                styleValue={cur.stat4Value_style}
                                onChange={(val) => updateCurField('stat4Value', val)}
                                onStyleChange={(style) => updateCurField('stat4Value_style', style)}
                                placeholder="1,200+"
                              />
                              <AdminStyledField
                                label="Stat 4 Label"
                                value={cur.stat4Label || ''}
                                styleValue={cur.stat4Label_style}
                                onChange={(val) => updateCurField('stat4Label', val)}
                                onStyleChange={(style) => updateCurField('stat4Label_style', style)}
                                placeholder="Professionals Trained"
                              />
                            </div>

                            <div className="space-y-2">
                              <AdminStyledField
                                label="Stat 5 Number"
                                value={cur.stat5Value || formData.stats?.successRate || ''}
                                styleValue={cur.stat5Value_style}
                                onChange={(val) => updateCurField('stat5Value', val)}
                                onStyleChange={(style) => updateCurField('stat5Value_style', style)}
                                placeholder="99.4%"
                              />
                              <AdminStyledField
                                label="Stat 5 Label"
                                value={cur.stat5Label || ''}
                                styleValue={cur.stat5Label_style}
                                onChange={(val) => updateCurField('stat5Label', val)}
                                onStyleChange={(style) => updateCurField('stat5Label_style', style)}
                                placeholder="Success Rate"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section D2: Client Success Network Scroller Banner */}
                        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4">
                          <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block font-heading">
                            Section 4B: Client Success Network Banner (Logos Scroller Title &amp; Badge)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminStyledField
                              label="Badge Tagline"
                              value={cur.clientsBadge || 'CLIENT SUCCESS NETWORK'}
                              styleValue={cur.clientsBadge_style}
                              onChange={(val) => updateCurField('clientsBadge', val)}
                              onStyleChange={(style) => updateCurField('clientsBadge_style', style)}
                              placeholder="CLIENT SUCCESS NETWORK"
                              headingLevel="badge"
                            />
                            <AdminStyledField
                              label="Scroller Heading / Title"
                              value={cur.clientsTitle || 'TRUSTED BY ENTERPRISES, HIGH-GROWTH STARTUPS & INSTITUTIONS'}
                              styleValue={cur.clientsTitle_style}
                              onChange={(val) => updateCurField('clientsTitle', val)}
                              onStyleChange={(style) => updateCurField('clientsTitle_style', style)}
                              placeholder="TRUSTED BY ENTERPRISES, HIGH-GROWTH STARTUPS & INSTITUTIONS"
                              headingLevel="h3"
                            />
                          </div>
                        </div>

                        {/* Section E: Dual Hubs Showcase Header & Cards */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Section 5: Dual Flagship Hubs Showcase Cards &amp; Backgrounds
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <AdminStyledField
                              label="Divisions Section Title"
                              value={cur.divisionsTitle || ''}
                              styleValue={cur.divisionsTitle_style}
                              onChange={(val) => updateCurField('divisionsTitle', val)}
                              onStyleChange={(style) => updateCurField('divisionsTitle_style', style)}
                              placeholder="Two Flagship Divisions. One Transformation Partner."
                              headingLevel="h2"
                            />
                            <AdminStyledField
                              label="Divisions Section Subtitle"
                              value={cur.divisionsSubtitle || ''}
                              styleValue={cur.divisionsSubtitle_style}
                              onChange={(val) => updateCurField('divisionsSubtitle', val)}
                              onStyleChange={(style) => updateCurField('divisionsSubtitle_style', style)}
                              placeholder="AI Hub and IP Hub operate as equal, dedicated divisions..."
                              isTextarea
                              rows={2}
                            />
                          </div>

                          {/* Card 1: AI Hub Card */}
                          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                              AI Hub Showcase Card
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <AdminStyledField
                                label="AI Hub Card Title"
                                value={cur.aiCardTitle || ''}
                                styleValue={cur.aiCardTitle_style}
                                onChange={(val) => updateCurField('aiCardTitle', val)}
                                onStyleChange={(style) => updateCurField('aiCardTitle_style', style)}
                                placeholder="Transforming Organizations with Artificial Intelligence"
                                headingLevel="h3"
                              />
                              <AdminStyledField
                                label="AI Hub Card Description"
                                value={cur.aiCardDesc || ''}
                                styleValue={cur.aiCardDesc_style}
                                onChange={(val) => updateCurField('aiCardDesc', val)}
                                onStyleChange={(style) => updateCurField('aiCardDesc_style', style)}
                                placeholder="360° AI solutions — from custom software, computer vision..."
                                isTextarea
                                rows={2}
                              />
                            </div>

                            <ImageSourceSelector
                              label="AI Hub Card Custom Background Image"
                              value={cur.aiCardBg || ''}
                              onChange={(newVal) => updateCurField('aiCardBg', newVal)}
                              presets={[
                                {
                                  label: 'Deep Blue Neural Network',
                                  url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2400&q=85',
                                },
                                {
                                  label: 'Quantum Tech Light',
                                  url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2400&q=85',
                                },
                              ]}
                              helperText="Applied directly as the background image for the AI Hub card on the homepage."
                            />
                          </div>

                          {/* Card 2: IP Hub Card */}
                          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
                              IP Hub Showcase Card
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <AdminStyledField
                                label="IP Hub Card Title"
                                value={cur.ipCardTitle || ''}
                                styleValue={cur.ipCardTitle_style}
                                onChange={(val) => updateCurField('ipCardTitle', val)}
                                onStyleChange={(style) => updateCurField('ipCardTitle_style', style)}
                                placeholder="Protecting Innovation from Idea to Intellectual Property"
                                headingLevel="h3"
                              />
                              <AdminStyledField
                                label="IP Hub Card Description"
                                value={cur.ipCardDesc || ''}
                                styleValue={cur.ipCardDesc_style}
                                onChange={(val) => updateCurField('ipCardDesc', val)}
                                onStyleChange={(style) => updateCurField('ipCardDesc_style', style)}
                                placeholder="End-to-end IP services — securing what you've built..."
                                isTextarea
                                rows={2}
                              />
                            </div>

                            <ImageSourceSelector
                              label="IP Hub Card Custom Background Image"
                              value={cur.ipCardBg || ''}
                              onChange={(newVal) => updateCurField('ipCardBg', newVal)}
                              presets={[
                                {
                                  label: 'High-Tech IP Vault & Defense',
                                  url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80',
                                },
                                {
                                  label: 'Cyber Grid Security',
                                  url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80',
                                },
                              ]}
                              helperText="Applied directly as the background image for the IP Hub card on the homepage."
                            />
                          </div>
                        </div>

                        {/* Section F: Why LockYourIdea 4 Pillar Cards */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Section 6: Why LockYourIdea Pillars (4 Cards)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminStyledField
                              label="Section Badge Tagline"
                              value={cur.whyBadge || ''}
                              styleValue={cur.whyBadge_style}
                              onChange={(val) => updateCurField('whyBadge', val)}
                              onStyleChange={(style) => updateCurField('whyBadge_style', style)}
                              placeholder="WHY LOCKYOURIDEA TECH"
                              headingLevel="badge"
                            />
                            <AdminStyledField
                              label="Section Heading"
                              value={cur.whyTitle || ''}
                              styleValue={cur.whyTitle_style}
                              onChange={(val) => updateCurField('whyTitle', val)}
                              onStyleChange={(style) => updateCurField('whyTitle_style', style)}
                              placeholder="Built for Organizations That Need Both Innovation and Protection"
                              headingLevel="h2"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-600 block">Pillar Card 1</span>
                              <AdminStyledField
                                label="Title"
                                value={cur.whyCard1Title || ''}
                                styleValue={cur.whyCard1Title_style}
                                onChange={(val) => updateCurField('whyCard1Title', val)}
                                onStyleChange={(style) => updateCurField('whyCard1Title_style', style)}
                                placeholder="Dual-Engine Capability"
                                headingLevel="h3"
                              />
                              <AdminStyledField
                                label="Description"
                                value={cur.whyCard1Desc || ''}
                                styleValue={cur.whyCard1Desc_style}
                                onChange={(val) => updateCurField('whyCard1Desc', val)}
                                onStyleChange={(style) => updateCurField('whyCard1Desc_style', style)}
                                placeholder="Card description..."
                                isTextarea
                                rows={2}
                              />
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-600 block">Pillar Card 2</span>
                              <AdminStyledField
                                label="Title"
                                value={cur.whyCard2Title || ''}
                                styleValue={cur.whyCard2Title_style}
                                onChange={(val) => updateCurField('whyCard2Title', val)}
                                onStyleChange={(style) => updateCurField('whyCard2Title_style', style)}
                                placeholder="Speed & Rigor"
                                headingLevel="h3"
                              />
                              <AdminStyledField
                                label="Description"
                                value={cur.whyCard2Desc || ''}
                                styleValue={cur.whyCard2Desc_style}
                                onChange={(val) => updateCurField('whyCard2Desc', val)}
                                onStyleChange={(style) => updateCurField('whyCard2Desc_style', style)}
                                placeholder="Card description..."
                                isTextarea
                                rows={2}
                              />
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-600 block">Pillar Card 3</span>
                              <AdminStyledField
                                label="Title"
                                value={cur.whyCard3Title || ''}
                                styleValue={cur.whyCard3Title_style}
                                onChange={(val) => updateCurField('whyCard3Title', val)}
                                onStyleChange={(style) => updateCurField('whyCard3Title_style', style)}
                                placeholder="Deep Enterprise Track Record"
                                headingLevel="h3"
                              />
                              <AdminStyledField
                                label="Description"
                                value={cur.whyCard3Desc || ''}
                                styleValue={cur.whyCard3Desc_style}
                                onChange={(val) => updateCurField('whyCard3Desc', val)}
                                onStyleChange={(style) => updateCurField('whyCard3Desc_style', style)}
                                placeholder="Card description..."
                                isTextarea
                                rows={2}
                              />
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-600 block">Pillar Card 4</span>
                              <AdminStyledField
                                label="Title"
                                value={cur.whyCard4Title || ''}
                                styleValue={cur.whyCard4Title_style}
                                onChange={(val) => updateCurField('whyCard4Title', val)}
                                onStyleChange={(style) => updateCurField('whyCard4Title_style', style)}
                                placeholder="Sole Pune Headquarters"
                                headingLevel="h3"
                              />
                              <AdminStyledField
                                label="Description"
                                value={cur.whyCard4Desc || ''}
                                styleValue={cur.whyCard4Desc_style}
                                onChange={(val) => updateCurField('whyCard4Desc', val)}
                                onStyleChange={(style) => updateCurField('whyCard4Desc_style', style)}
                                placeholder="Card description..."
                                isTextarea
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section G: Testimonials */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Section 7: Client Testimonials (3 Quotes &amp; Companies)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminStyledField
                              label="Testimonials Badge Tagline"
                              value={cur.testiBadge || ''}
                              styleValue={cur.testiBadge_style}
                              onChange={(val) => updateCurField('testiBadge', val)}
                              onStyleChange={(style) => updateCurField('testiBadge_style', style)}
                              placeholder="CLIENTS SAY"
                              headingLevel="badge"
                            />
                            <AdminStyledField
                              label="Testimonials Section Heading"
                              value={cur.testiTitle || ''}
                              styleValue={cur.testiTitle_style}
                              onChange={(val) => updateCurField('testiTitle', val)}
                              onStyleChange={(style) => updateCurField('testiTitle_style', style)}
                              placeholder="Trusted Across Enterprises, Startups and Government"
                              headingLevel="h2"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-600 block">Testimonial 1</span>
                              <AdminStyledField
                                label="Quote"
                                value={cur.testi1Quote || ''}
                                styleValue={cur.testi1Quote_style}
                                onChange={(val) => updateCurField('testi1Quote', val)}
                                onStyleChange={(style) => updateCurField('testi1Quote_style', style)}
                                placeholder="Client feedback quote..."
                                isTextarea
                                rows={2}
                              />
                              <AdminStyledField
                                label="Author Name & Role"
                                value={cur.testi1Author || ''}
                                styleValue={cur.testi1Author_style}
                                onChange={(val) => updateCurField('testi1Author', val)}
                                onStyleChange={(style) => updateCurField('testi1Author_style', style)}
                                placeholder="Author Name & Role"
                              />
                              <AdminStyledField
                                label="Company / Enterprise"
                                value={cur.testi1Company || ''}
                                styleValue={cur.testi1Company_style}
                                onChange={(val) => updateCurField('testi1Company', val)}
                                onStyleChange={(style) => updateCurField('testi1Company_style', style)}
                                placeholder="Company / Enterprise"
                              />
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-600 block">Testimonial 2</span>
                              <AdminStyledField
                                label="Quote"
                                value={cur.testi2Quote || ''}
                                styleValue={cur.testi2Quote_style}
                                onChange={(val) => updateCurField('testi2Quote', val)}
                                onStyleChange={(style) => updateCurField('testi2Quote_style', style)}
                                placeholder="Client feedback quote..."
                                isTextarea
                                rows={2}
                              />
                              <AdminStyledField
                                label="Author Name & Role"
                                value={cur.testi2Author || ''}
                                styleValue={cur.testi2Author_style}
                                onChange={(val) => updateCurField('testi2Author', val)}
                                onStyleChange={(style) => updateCurField('testi2Author_style', style)}
                                placeholder="Author Name & Role"
                              />
                              <AdminStyledField
                                label="Company / Enterprise"
                                value={cur.testi2Company || ''}
                                styleValue={cur.testi2Company_style}
                                onChange={(val) => updateCurField('testi2Company', val)}
                                onStyleChange={(style) => updateCurField('testi2Company_style', style)}
                                placeholder="Company / Enterprise"
                              />
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-600 block">Testimonial 3</span>
                              <AdminStyledField
                                label="Quote"
                                value={cur.testi3Quote || ''}
                                styleValue={cur.testi3Quote_style}
                                onChange={(val) => updateCurField('testi3Quote', val)}
                                onStyleChange={(style) => updateCurField('testi3Quote_style', style)}
                                placeholder="Client feedback quote..."
                                isTextarea
                                rows={2}
                              />
                              <AdminStyledField
                                label="Author Name & Role"
                                value={cur.testi3Author || ''}
                                styleValue={cur.testi3Author_style}
                                onChange={(val) => updateCurField('testi3Author', val)}
                                onStyleChange={(style) => updateCurField('testi3Author_style', style)}
                                placeholder="Author Name & Role"
                              />
                              <AdminStyledField
                                label="Company / Enterprise"
                                value={cur.testi3Company || ''}
                                styleValue={cur.testi3Company_style}
                                onChange={(val) => updateCurField('testi3Company', val)}
                                onStyleChange={(style) => updateCurField('testi3Company_style', style)}
                                placeholder="Company / Enterprise"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section H: Consultation Scheduler Section */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Section 8: Consultation Scheduler Header &amp; Copy
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminStyledField
                              label="Scheduler Badge Tagline"
                              value={cur.schedulerBadge || ''}
                              styleValue={cur.schedulerBadge_style}
                              onChange={(val) => updateCurField('schedulerBadge', val)}
                              onStyleChange={(style) => updateCurField('schedulerBadge_style', style)}
                              placeholder="REAL-TIME CONSULTATION SCHEDULER"
                              headingLevel="badge"
                            />
                            <AdminStyledField
                              label="Scheduler Heading Title"
                              value={cur.schedulerTitle || ''}
                              styleValue={cur.schedulerTitle_style}
                              onChange={(val) => updateCurField('schedulerTitle', val)}
                              onStyleChange={(style) => updateCurField('schedulerTitle_style', style)}
                              placeholder="Request a Free Consultation"
                              headingLevel="h2"
                            />
                          </div>
                          <div className="pt-1">
                            <AdminStyledField
                              label="Scheduler Description Paragraph"
                              value={cur.schedulerDesc || ''}
                              styleValue={cur.schedulerDesc_style}
                              onChange={(val) => updateCurField('schedulerDesc', val)}
                              onStyleChange={(style) => updateCurField('schedulerDesc_style', style)}
                              placeholder="Select your preferred slot & requirement — our scheduling engine instantly locks your appointment and delivers a formal calendar invite with video link to your email."
                              isTextarea
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Specific Extra Fields for AI Hub and IP Hub */}
                    {(selectedCmsPage === 'ai-hub' || selectedCmsPage === 'ip-hub') && (
                      <div className="pt-6 border-t border-slate-200 space-y-4">
                        <h4 className="font-bold text-sm text-slate-900 font-heading">
                          Additional Section Headings &amp; Copy
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AdminStyledField
                            label="Services Section Heading"
                            value={cur.extraHeading1 || ''}
                            styleValue={cur.extraHeading1_style}
                            onChange={(val) => updateCurField('extraHeading1', val)}
                            onStyleChange={(style) => updateCurField('extraHeading1_style', style)}
                            placeholder="e.g. 11 Dedicated Service Lines"
                            headingLevel="h2"
                          />
                          <AdminStyledField
                            label="Services Section Subtext"
                            value={cur.extraText1 || ''}
                            styleValue={cur.extraText1_style}
                            onChange={(val) => updateCurField('extraText1', val)}
                            onStyleChange={(style) => updateCurField('extraText1_style', style)}
                            placeholder="Enter section description..."
                            isTextarea
                            rows={2}
                          />
                        </div>
                      </div>
                    )}

                    {/* Specific Extra Fields for About Us Page */}
                    {selectedCmsPage === 'about' && (
                      <div className="pt-6 border-t border-slate-200 space-y-6">
                        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block font-heading">
                            Header Sub-Taglines &amp; Core Pillars
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Headquarters Location Sub-Tagline"
                              value={cur.hqTagline || 'Headquarters: Baner, Pune, Maharashtra (Sole Office Location)'}
                              styleValue={cur.hqTagline_style}
                              onChange={(val) => updateCurField('hqTagline', val)}
                              onStyleChange={(style) => updateCurField('hqTagline_style', style)}
                              placeholder="Headquarters: Baner, Pune, Maharashtra (Sole Office Location)"
                            />
                            <AdminStyledField
                              label="Team Composition Tagline"
                              value={cur.teamTagline || 'Specialists, Engineers & Attorneys Under One Roof'}
                              styleValue={cur.teamTagline_style}
                              onChange={(val) => updateCurField('teamTagline', val)}
                              onStyleChange={(style) => updateCurField('teamTagline_style', style)}
                              placeholder="Specialists, Engineers & Attorneys Under One Roof"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Vision &amp; Mission Statements
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Vision Statement"
                              value={cur.visionText || ''}
                              styleValue={cur.visionText_style}
                              onChange={(val) => updateCurField('visionText', val)}
                              onStyleChange={(style) => updateCurField('visionText_style', style)}
                              placeholder="To be India's most trusted partner for organizations that need to build with cutting-edge AI and protect what they build..."
                              isTextarea
                              rows={3}
                            />
                            <AdminStyledField
                              label="Mission Statement"
                              value={cur.missionText || ''}
                              styleValue={cur.missionText_style}
                              onChange={(val) => updateCurField('missionText', val)}
                              onStyleChange={(style) => updateCurField('missionText_style', style)}
                              placeholder="To equip Indian enterprise, startups, and public bodies with production-grade AI systems..."
                              isTextarea
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Milestones Section */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Our Journey Milestones (01 to 05)
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Milestones Section Badge"
                              value={cur.milestonesHeader || 'OUR MILESTONES'}
                              styleValue={cur.milestonesHeader_style}
                              onChange={(val) => updateCurField('milestonesHeader', val)}
                              onStyleChange={(style) => updateCurField('milestonesHeader_style', style)}
                              placeholder="OUR MILESTONES"
                              headingLevel="badge"
                            />
                            <AdminStyledField
                              label="Milestones Section Title"
                              value={cur.milestonesSubhead || 'Our Journey of Innovation & IP Protection'}
                              styleValue={cur.milestonesSubhead_style}
                              onChange={(val) => updateCurField('milestonesSubhead', val)}
                              onStyleChange={(style) => updateCurField('milestonesSubhead_style', style)}
                              placeholder="Our Journey of Innovation & IP Protection"
                              headingLevel="h2"
                            />
                          </div>

                          <div className="space-y-3 pt-2">
                            {/* Milestone 01 */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                              <AdminStyledField
                                label="Milestone 01 Title"
                                value={cur.milestone1Title || 'Founded in Pune with a Dual Mandate'}
                                onChange={(val) => updateCurField('milestone1Title', val)}
                                placeholder="Founded in Pune with a Dual Mandate"
                              />
                              <div className="md:col-span-2">
                                <AdminStyledField
                                  label="Milestone 01 Description"
                                  value={cur.milestone1Desc || 'LockYourIdea Tech was founded in Baner, Pune to bridge the gap between building software and legally defending proprietary intellectual property.'}
                                  onChange={(val) => updateCurField('milestone1Desc', val)}
                                  placeholder="Description..."
                                  isTextarea
                                  rows={2}
                                />
                              </div>
                            </div>

                            {/* Milestone 02 */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                              <AdminStyledField
                                label="Milestone 02 Title"
                                value={cur.milestone2Title || 'IP Hub Scale-Up'}
                                onChange={(val) => updateCurField('milestone2Title', val)}
                                placeholder="IP Hub Scale-Up"
                              />
                              <div className="md:col-span-2">
                                <AdminStyledField
                                  label="Milestone 02 Description"
                                  value={cur.milestone2Desc || 'Built out end-to-end patent drafting, search, prosecution, and international PCT filing practices with registered patent attorneys.'}
                                  onChange={(val) => updateCurField('milestone2Desc', val)}
                                  placeholder="Description..."
                                  isTextarea
                                  rows={2}
                                />
                              </div>
                            </div>

                            {/* Milestone 03 */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                              <AdminStyledField
                                label="Milestone 03 Title"
                                value={cur.milestone3Title || 'AI Hub Launch'}
                                onChange={(val) => updateCurField('milestone3Title', val)}
                                placeholder="AI Hub Launch"
                              />
                              <div className="md:col-span-2">
                                <AdminStyledField
                                  label="Milestone 03 Description"
                                  value={cur.milestone3Desc || 'Expanded into production AI engineering — building custom models, Agentic CRM architectures, and enterprise business automation suites.'}
                                  onChange={(val) => updateCurField('milestone3Desc', val)}
                                  placeholder="Description..."
                                  isTextarea
                                  rows={2}
                                />
                              </div>
                            </div>

                            {/* Milestone 04 */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                              <AdminStyledField
                                label="Milestone 04 Title"
                                value={cur.milestone4Title || 'Government Capacity Programs'}
                                onChange={(val) => updateCurField('milestone4Title', val)}
                                placeholder="Government Capacity Programs"
                              />
                              <div className="md:col-span-2">
                                <AdminStyledField
                                  label="Milestone 04 Description"
                                  value={cur.milestone4Desc || 'Selected by state municipal and urban development departments to conduct executive AI capacity building programs.'}
                                  onChange={(val) => updateCurField('milestone4Desc', val)}
                                  placeholder="Description..."
                                  isTextarea
                                  rows={2}
                                />
                              </div>
                            </div>

                            {/* Milestone 05 */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                              <AdminStyledField
                                label="Milestone 05 Title"
                                value={cur.milestone5Title || 'Unified 360° Platform'}
                                onChange={(val) => updateCurField('milestone5Title', val)}
                                placeholder="Unified 360° Platform"
                              />
                              <div className="md:col-span-2">
                                <AdminStyledField
                                  label="Milestone 05 Description"
                                  value={cur.milestone5Desc || 'Serving 50+ enterprise and institutional clients with synchronized innovation development and balance-sheet IP asset defense from our Pune headquarters.'}
                                  onChange={(val) => updateCurField('milestone5Desc', val)}
                                  placeholder="Description..."
                                  isTextarea
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Headquarters Spotlight Card */}
                        <div className="p-4 bg-slate-900 text-white border border-slate-800 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block font-heading">
                            Headquarters &amp; Labs Spotlight Section
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Spotlight Badge"
                              value={cur.hqBadge || 'HEADQUARTERS & LABS'}
                              onChange={(val) => updateCurField('hqBadge', val)}
                              placeholder="HEADQUARTERS & LABS"
                            />
                            <AdminStyledField
                              label="Spotlight Headline"
                              value={cur.hqHeadline || 'Exclusively Located in Pune, Maharashtra'}
                              onChange={(val) => updateCurField('hqHeadline', val)}
                              placeholder="Exclusively Located in Pune, Maharashtra"
                            />
                          </div>
                          <AdminStyledField
                            label="Spotlight Description"
                            value={cur.hqDesc || 'All engineering architecture, machine learning model fine-tuning, Agentic CRM development, and patent prosecution workflows are conducted directly from our unified headquarters in Baner, Pune. We welcome clients for in-person strategy sessions and live technical demonstrations.'}
                            onChange={(val) => updateCurField('hqDesc', val)}
                            placeholder="HQ Description..."
                            isTextarea
                            rows={3}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            <AdminStyledField
                              label="HQ Address Line"
                              value={cur.hqAddress || 'Baner, Pune, Maharashtra 411045, India'}
                              onChange={(val) => updateCurField('hqAddress', val)}
                              placeholder="Baner, Pune, Maharashtra 411045, India"
                            />
                            <AdminStyledField
                              label="Booking CTA Button Text"
                              value={cur.hqCtaText || 'Book In-Person Pune Slot'}
                              onChange={(val) => updateCurField('hqCtaText', val)}
                              placeholder="Book In-Person Pune Slot"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Specific Extra Fields for Contact Page */}
                    {selectedCmsPage === 'contact' && (
                      <div className="pt-6 border-t border-slate-200 space-y-6">
                        {/* Section A: Hero Badges */}
                        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block font-heading">
                            Contact Hero Sub-Badges
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Location Badge 1"
                              value={cur.locationBadge1 || 'Single Office Location: Baner, Pune, Maharashtra'}
                              onChange={(val) => updateCurField('locationBadge1', val)}
                              placeholder="Single Office Location: Baner, Pune, Maharashtra"
                            />
                            <AdminStyledField
                              label="Location Badge 2"
                              value={cur.locationBadge2 || 'Online & In-Person Consultations'}
                              onChange={(val) => updateCurField('locationBadge2', val)}
                              placeholder="Online & In-Person Consultations"
                            />
                          </div>
                        </div>

                        {/* Section B: Exclusive Pune Office Banner */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            Exclusive Pune Office Location Banner
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Banner Category Badge"
                              value={cur.officeBadge || 'OFFICE LOCATION (EXCLUSIVE TO PUNE)'}
                              onChange={(val) => updateCurField('officeBadge', val)}
                              placeholder="OFFICE LOCATION (EXCLUSIVE TO PUNE)"
                            />
                            <AdminStyledField
                              label="Banner Headline"
                              value={cur.officeHeadline || `${formData.companyName || 'LockYourIdea Tech'} Corporate Headquarters`}
                              onChange={(val) => updateCurField('officeHeadline', val)}
                              placeholder="LockYourIdea Tech Corporate Headquarters"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminStyledField
                              label="Banner Address"
                              value={cur.officeAddress || formData.address || 'Baner, Pune, Maharashtra 411045, India'}
                              onChange={(val) => updateCurField('officeAddress', val)}
                              placeholder="Baner, Pune, Maharashtra 411045, India"
                            />
                            <AdminStyledField
                              label="Banner Pune Note"
                              value={cur.officeNote || 'Note: Our sole physical office and development labs are located exclusively in Pune.'}
                              onChange={(val) => updateCurField('officeNote', val)}
                              placeholder="Note: Our sole physical office and development labs are located exclusively in Pune."
                            />
                          </div>
                          <AdminStyledField
                            label="Banner CTA Button Text"
                            value={cur.officeCtaText || 'Book Pune In-Person Slot'}
                            onChange={(val) => updateCurField('officeCtaText', val)}
                            placeholder="Book Pune In-Person Slot"
                          />
                        </div>

                        {/* Section C: Contact Cards (4 Cards) */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                            4 Key Contact Cards
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card 1: Phone */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-xs font-bold text-blue-600 block">Card 1: Direct Phone</span>
                              <AdminStyledField
                                label="Card Title"
                                value={cur.phoneTitle || 'Direct Phone Desk'}
                                onChange={(val) => updateCurField('phoneTitle', val)}
                                placeholder="Direct Phone Desk"
                              />
                              <AdminStyledField
                                label="Phone Number"
                                value={cur.phone || formData.phone || '+91 75586 31355'}
                                onChange={(val) => updateCurField('phone', val)}
                                placeholder="+91 75586 31355"
                              />
                              <AdminStyledField
                                label="Note"
                                value={cur.phoneNote || 'Dedicated desk at Pune headquarters'}
                                onChange={(val) => updateCurField('phoneNote', val)}
                                placeholder="Dedicated desk at Pune headquarters"
                              />
                            </div>

                            {/* Card 2: WhatsApp */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-xs font-bold text-emerald-600 block">Card 2: WhatsApp Business</span>
                              <AdminStyledField
                                label="Card Title"
                                value={cur.whatsappTitle || 'WhatsApp Business'}
                                onChange={(val) => updateCurField('whatsappTitle', val)}
                                placeholder="WhatsApp Business"
                              />
                              <AdminStyledField
                                label="Link Text"
                                value={cur.whatsappText || 'Chat on WhatsApp →'}
                                onChange={(val) => updateCurField('whatsappText', val)}
                                placeholder="Chat on WhatsApp →"
                              />
                              <AdminStyledField
                                label="Note"
                                value={cur.whatsappNote || 'Fast response within 15 minutes'}
                                onChange={(val) => updateCurField('whatsappNote', val)}
                                placeholder="Fast response within 15 minutes"
                              />
                            </div>

                            {/* Card 3: Official Email */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-xs font-bold text-cyan-700 block">Card 3: Official Email</span>
                              <AdminStyledField
                                label="Card Title"
                                value={cur.emailTitle || 'Official Email'}
                                onChange={(val) => updateCurField('emailTitle', val)}
                                placeholder="Official Email"
                              />
                              <AdminStyledField
                                label="Email Address"
                                value={cur.contactEmail || formData.contactEmail || 'support@lockyourideatech.com'}
                                onChange={(val) => updateCurField('contactEmail', val)}
                                placeholder="support@lockyourideatech.com"
                              />
                              <AdminStyledField
                                label="Note"
                                value={cur.emailNote || 'Proposals, NDAs & RFPs'}
                                onChange={(val) => updateCurField('emailNote', val)}
                                placeholder="Proposals, NDAs & RFPs"
                              />
                            </div>

                            {/* Card 4: Working Hours */}
                            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-xs font-bold text-slate-700 block">Card 4: Working Hours</span>
                              <AdminStyledField
                                label="Card Title"
                                value={cur.hoursTitle || 'Working Hours'}
                                onChange={(val) => updateCurField('hoursTitle', val)}
                                placeholder="Working Hours"
                              />
                              <AdminStyledField
                                label="Hours Detail"
                                value={cur.hoursText || 'Mon – Sat: 9:30 AM – 7:00 PM IST'}
                                onChange={(val) => updateCurField('hoursText', val)}
                                placeholder="Mon – Sat: 9:30 AM – 7:00 PM IST"
                              />
                              <AdminStyledField
                                label="Note"
                                value={cur.hoursNote || 'Online consultations available 24/7'}
                                onChange={(val) => updateCurField('hoursNote', val)}
                                placeholder="Online consultations available 24/7"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save Button Footer */}
                    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Saves directly to MongoDB database and takes effect instantly across the website.</span>
                      </div>

                      <button
                        type="button"
                        disabled={savingPageContent}
                        onClick={() =>
                          handleSavePageContent(
                            selectedCmsPage,
                            cur,
                            currentMeta.title,
                            currentMeta.route
                          )
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-cyan-300" />
                        <span>
                          {savingPageContent
                            ? 'Saving Changes...'
                            : `Save & Publish ${currentMeta.title}`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {saveSuccessMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* Company Basic Information */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900 font-heading flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>Company Basic Information &amp; Headquarters</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <AdminStyledField
                        label="Company Name"
                        value={formData.companyName}
                        styleValue={formData.companyName_style}
                        onChange={(val) => setFormData({ ...formData, companyName: val })}
                        onStyleChange={(st) => setFormData({ ...formData, companyName_style: st })}
                        placeholder="LockYourIdea Tech Pvt. Ltd."
                        required
                      />
                    </div>

                    <div>
                      <AdminStyledField
                        label="Tagline / Main Description"
                        value={formData.tagline}
                        styleValue={formData.tagline_style}
                        onChange={(val) => setFormData({ ...formData, tagline: val })}
                        onStyleChange={(st) => setFormData({ ...formData, tagline_style: st })}
                        placeholder="India's 360° AI & Intellectual Property Transformation Company"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <AdminStyledField
                        label="Headquarters (HQ Pune Address)"
                        value={formData.hqAddress}
                        styleValue={formData.hqAddress_style}
                        onChange={(val) => setFormData({ ...formData, hqAddress: val })}
                        onStyleChange={(st) => setFormData({ ...formData, hqAddress_style: st })}
                        placeholder="HQ: Baner, Pune, Maharashtra 411045, India"
                        required
                      />
                      <small className="text-[11px] text-slate-500">Official Pune Headquarters registered address</small>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Official Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Official Work Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Web3Forms API Key & Email Notification Integration */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 font-heading flex items-center gap-2">
                          <span>Web3Forms API Key &amp; Booking Dispatch</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Active Integration
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Automate consultation slot alerts &amp; client reminders via Web3Forms API
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://web3forms.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors shrink-0"
                    >
                      <span>Get Free API Key</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Web3Forms Access Key</span>
                      {formData.web3formsKey ? (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Configured</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-semibold">
                          Not Configured (Optional)
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showWeb3Key ? 'text' : 'password'}
                          value={formData.web3formsKey || ''}
                          onChange={(e) => setFormData({ ...formData, web3formsKey: e.target.value })}
                          placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                          className="w-full p-2.5 pr-10 text-xs rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowWeb3Key(!showWeb3Key)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                          title={showWeb3Key ? 'Hide key' : 'Show key'}
                        >
                          {showWeb3Key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleTestWeb3Forms}
                        disabled={testingWeb3Forms}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {testingWeb3Forms ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      Your Web3Forms Access Key is used for automated consultation slot booking notifications and enables the admin to dispatch meeting reminders directly to clients.
                    </p>

                    {web3formsTestResult && (
                      <div
                        className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          web3formsTestResult.success
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border border-rose-200 text-rose-800'
                        }`}
                      >
                        {web3formsTestResult.success ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{web3formsTestResult.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos & Page Background Images (Upload Local File or Apply Link) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="font-extrabold text-base text-slate-900 font-heading">
                        Page Background Images &amp; Media Manager
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Customize background images for each page. You can apply images by uploading from your local computer system or pasting an external image web link.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* 1. Home Page Background */}
                    <ImageSourceSelector
                      label="1. Home Page Hero Background Image"
                      value={formData.heroBgImage}
                      onChange={(newVal) => {
                        setFormData({ ...formData, heroBgImage: newVal });
                        if (newVal) {
                          onUpdateSettings({ heroBgImage: newVal });
                        }
                      }}
                      onInstantSave={(url) => handleInstantSaveImage('heroBgImage', url, 'Home Page Background Image', 'home')}
                      presets={[
                        {
                          label: 'Deep Fluid Sapphire (Eye-Soothing AI)',
                          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85',
                        },
                        {
                          label: 'Luminous Neural Synapses',
                          url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2400&q=85',
                        },
                        {
                          label: 'Quantum Hologram & Tech Light',
                          url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2400&q=85',
                        },
                        {
                          label: 'Deep Tech Connected Globe',
                          url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Neural Circuit Dark',
                          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
                        },
                      ]}
                      helperText="Displayed in the main hero header of LockYourIdea Tech home page with high-contrast Poppins typography. Can be uploaded from local computer or external link."
                    />

                    {/* 2. Portfolio Page Background */}
                    <ImageSourceSelector
                      label="2. Portfolio / Client Success Page Background Image"
                      value={formData.portfolioBgImage || ''}
                      onChange={(newVal) => {
                        setFormData({ ...formData, portfolioBgImage: newVal });
                        if (newVal) {
                          onUpdateSettings({ portfolioBgImage: newVal });
                        }
                      }}
                      onInstantSave={(url) => handleInstantSaveImage('portfolioBgImage', url, 'Portfolio Background Image', 'portfolio')}
                      presets={[
                        {
                          label: 'Software Innovation Lab & Code',
                          url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Neural Circuit Tech & Hardware',
                          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Cyber Grid & Patents Hub',
                          url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Modern Tech Engineering Studio',
                          url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80',
                        },
                      ]}
                      helperText="Displayed in the header of the 'Selected Engagements & Deliveries' portfolio page."
                    />

                    {/* 3. Industries Page Background */}
                    <ImageSourceSelector
                      label="3. Sector Expertise / Industries Page Background Image"
                      value={formData.industriesBgImage || ''}
                      onChange={(newVal) => setFormData({ ...formData, industriesBgImage: newVal })}
                      onInstantSave={(url) => handleInstantSaveImage('industriesBgImage', url, 'Sector Expertise / Industries Background Image', 'industries')}
                      presets={[
                        {
                          label: 'Corporate Architecture',
                          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Industrial Automation',
                          url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Smart Manufacturing',
                          url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=2000&q=80',
                        },
                      ]}
                      helperText="Displayed across the 'Industries We Serve' sector expertise header."
                    />

                    {/* 4. Case Studies Page Background */}
                    <ImageSourceSelector
                      label="4. Results / Case Studies Page Background Image"
                      value={formData.caseStudiesBgImage || ''}
                      onChange={(newVal) => setFormData({ ...formData, caseStudiesBgImage: newVal })}
                      onInstantSave={(url) => handleInstantSaveImage('caseStudiesBgImage', url, 'Results / Case Studies Background Image', 'case-studies')}
                      presets={[
                        {
                          label: 'Analytics & Dashboards',
                          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Data Server Center',
                          url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Cloud Infrastructure',
                          url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80',
                        },
                      ]}
                      helperText="Displayed in the 'Real Client Outcomes' case studies header."
                    />

                    {/* 5. About Us Page Background */}
                    <ImageSourceSelector
                      label="5. About Us / India's 360° AI & IP Company Background Image"
                      value={formData.aboutBgImage || ''}
                      onChange={(newVal) => setFormData({ ...formData, aboutBgImage: newVal })}
                      onInstantSave={(url) => handleInstantSaveImage('aboutBgImage', url, 'About Us Background Image', 'about')}
                      presets={[
                        {
                          label: 'Engineering Team & Lab',
                          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Pune Tech Innovation',
                          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Boardroom Strategy',
                          url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80',
                        },
                      ]}
                      helperText="Displayed in the About Us company story and Pune HQ profile header."
                    />

                    {/* 6. Contact Page Background */}
                    <ImageSourceSelector
                      label="6. Contact / Get In Touch Page Background Image"
                      value={formData.contactBgImage || ''}
                      onChange={(newVal) => setFormData({ ...formData, contactBgImage: newVal })}
                      onInstantSave={(url) => handleInstantSaveImage('contactBgImage', url, 'Contact Page Background Image', 'contact')}
                      presets={[
                        {
                          label: 'Pune Headquarters Campus',
                          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Client Consultation Suite',
                          url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80',
                        },
                        {
                          label: 'Modern Reception Desk',
                          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
                        },
                      ]}
                      helperText="Displayed in the 'Start Your AI & IP Transformation' contact header (Baner, Pune, Maharashtra)."
                    />

                    {/* 7. Company Logo Asset */}
                    <ImageSourceSelector
                      label="7. Company Logo Asset (SVG / Image / Vector)"
                      value={formData.logoUrl}
                      onChange={(newVal) => setFormData({ ...formData, logoUrl: newVal })}
                      onInstantSave={(url) => handleInstantSaveImage('logoUrl', url, 'Company Logo Asset')}
                      presets={[
                        { label: 'Default Vector Logo', url: '/assets/logo.svg' },
                      ]}
                      previewHeightClass="h-20"
                      helperText="Displayed in the navigation bar and footer branding."
                    />

                    {/* Logo Dimensions Controller (Height Range up to 220px) */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-800">Brand Logo Dimensions (Increase or Decrease Size)</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('header-logo');
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            Open Advanced Logo Studio →
                          </button>
                          <span className="text-slate-300">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev: any) => ({ ...prev, logoWidth: 40, logoHeight: 40 }));
                              onUpdateSettings({ logoHeight: 40, logoWidth: 40 });
                              handleInstantSaveImage('logoHeight', 40 as any, 'Logo Height');
                            }}
                            className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                          >
                            Reset to Default (40×40px)
                          </button>
                        </div>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">Presets:</span>
                        {[
                          { label: 'Tiny', h: 24, w: 24 },
                          { label: 'Small', h: 32, w: 32 },
                          { label: 'Default', h: 40, w: 40 },
                          { label: 'Medium', h: 54, w: 54 },
                          { label: 'Large', h: 72, w: 72 },
                          { label: 'Extra Large', h: 96, w: 96 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setFormData((prev: any) => ({ ...prev, logoHeight: preset.h, logoWidth: preset.w }));
                              onUpdateSettings({ logoHeight: preset.h, logoWidth: preset.w });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              (formData.logoHeight || 40) === preset.h && (formData.logoWidth || 40) === preset.w
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-white hover:bg-slate-200 border border-slate-200 text-slate-700'
                            }`}
                          >
                            {preset.label} ({preset.h}px)
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                            <span>Height: {formData.logoHeight || 40}px (16px to 220px)</span>
                            <input
                              type="number"
                              min={16}
                              max={220}
                              value={formData.logoHeight || 40}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFormData({ ...formData, logoHeight: val });
                                onUpdateSettings({ logoHeight: val });
                              }}
                              className="w-16 px-1.5 py-0.5 text-right rounded border border-slate-200 text-xs font-mono font-bold text-purple-700"
                            />
                          </div>
                          <input
                            type="range"
                            min={16}
                            max={220}
                            step={2}
                            value={formData.logoHeight || 40}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormData({ ...formData, logoHeight: val });
                              onUpdateSettings({ logoHeight: val });
                            }}
                            className="w-full accent-purple-600 cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                            <span>Width: {formData.logoWidth || 40}px (16px to 450px)</span>
                            <input
                              type="number"
                              min={16}
                              max={450}
                              value={formData.logoWidth || 40}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFormData({ ...formData, logoWidth: val });
                                onUpdateSettings({ logoWidth: val });
                              }}
                              className="w-16 px-1.5 py-0.5 text-right rounded border border-slate-200 text-xs font-mono font-bold text-purple-700"
                            />
                          </div>
                          <input
                            type="range"
                            min={16}
                            max={450}
                            step={2}
                            value={formData.logoWidth || 40}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormData({ ...formData, logoWidth: val });
                              onUpdateSettings({ logoWidth: val });
                            }}
                            className="w-full accent-purple-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Homepage Hero Copy */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900 font-heading">
                    Homepage Hero Copy &amp; Live Numbers
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Heading</label>
                    <input
                      type="text"
                      value={formData.heroHeadline}
                      onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Sub-headline / Paragraph</label>
                    <textarea
                      rows={3}
                      value={formData.heroSubhead}
                      onChange={(e) => setFormData({ ...formData, heroSubhead: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">AI Projects</label>
                      <input
                        type="text"
                        value={formData.stats.aiProjects}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats, aiProjects: e.target.value },
                          })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">IP Registrations</label>
                      <input
                        type="text"
                        value={formData.stats.ipRegistrations}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats, ipRegistrations: e.target.value },
                          })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Enterprise Clients</label>
                      <input
                        type="text"
                        value={formData.stats.enterpriseClients}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats, enterpriseClients: e.target.value },
                          })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Success Rate</label>
                      <input
                        type="text"
                        value={formData.stats.successRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats, successRate: e.target.value },
                          })
                        }
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? 'Saving Changes...' : 'Save & Publish All Details'}</span>
                  </button>
                </div>

                {/* Floating/Sticky Save Action Bar for Settings & Photos */}
                <div className="sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-md -mx-4 -mb-6 px-6 py-4 border-t border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl rounded-b-3xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300">
                      Changes made to photos or details will take effect on the website immediately.
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition-all shrink-0"
                  >
                    <Save className="w-4 h-4 text-cyan-300" />
                    <span>{savingSettings ? 'Saving...' : 'Save & Publish All Details'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SERVICES & PRODUCTS MANAGER */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search services or products..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 min-w-[240px]"
                  />
                  <select
                    value={serviceDivisionFilter}
                    onChange={(e) => setServiceDivisionFilter(e.target.value as any)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="all">All Divisions</option>
                    <option value="AI Hub">AI Hub Only</option>
                    <option value="IP Hub">IP Hub Only</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsAddServiceModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service / Product</span>
                </button>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allServices
                  .filter((s) => {
                    const matchDiv = serviceDivisionFilter === 'all' || s.division === serviceDivisionFilter;
                    const matchQuery =
                      s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                      s.shortDesc.toLowerCase().includes(serviceSearch.toLowerCase());
                    return matchDiv && matchQuery;
                  })
                  .map((s) => (
                    <div
                      key={s.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.division === 'AI Hub'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-cyan-100 text-cyan-700'
                            }`}
                          >
                            {s.division}
                          </span>
                          {s.subCategory && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {s.subCategory}
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 font-heading mb-1.5">
                          {s.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                          {s.shortDesc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-mono">/{s.slug}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingService(s)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
                            title="Edit Service / Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.id, s.title)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Delete Service / Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO CARDS & RELEVANT PHOTOS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                    Portfolio Projects &amp; Card Photos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Change photos, titles, and metrics for all portfolio cards across the website.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddPortfolioModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project Card</span>
                </button>
              </div>

              {/* Grid of Portfolio Cards with live photo editing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {portfolioItems.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/70 text-white backdrop-blur-sm">
                          {p.category}
                        </span>
                        <button
                          onClick={() => setEditingPortfolioItem(p)}
                          className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-[11px] font-bold shadow flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Change Photo
                        </button>
                      </div>

                      <div className="p-4">
                        <h4 className="font-extrabold text-sm text-slate-900 font-heading mb-1 line-clamp-1">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                          {p.description}
                        </p>
                        {p.client && (
                          <div className="text-[11px] text-slate-400">
                            <strong>Client:</strong> {p.client}
                          </div>
                        )}
                        {p.result && (
                          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                            ★ {p.result}
                          </div>
                        )}
                        {p.projectUrl && (
                          <div className="text-[11px] text-blue-600 font-medium truncate mt-1.5 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{p.projectUrl}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">ID: {p.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingPortfolioItem(p)}
                          className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                        >
                          Edit Details →
                        </button>
                        <button
                          onClick={() => handleDeletePortfolioItem(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Project Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CLIENT TESTIMONIALS MANAGER */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                    Client Testimonials &amp; Trust Reviews
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage client reviews, author titles, companies, and star ratings shown on the homepage.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddTestimonialModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Testimonial</span>
                </button>
              </div>

              {/* Grid of Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">#{t.id}</span>
                      </div>

                      <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {t.initials || (t.author ? t.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'CL')}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">{t.author}</div>
                          <div className="text-[11px] text-slate-500">
                            {t.role ? `${t.role} · ` : ''}{t.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingTestimonial(t)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                          title="Edit Testimonial"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id, t.author)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EMAIL DISPATCH AUDIT */}
          {activeTab === 'emails' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                    Dispatched Email Notifications Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Audit trail of all calendar confirmations and notices sent to users.
                  </p>
                </div>
                <button
                  onClick={fetchEmails}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Recipient</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Sent At</th>
                      <th className="p-3.5">Delivery Status</th>
                      <th className="p-3.5 text-right">HTML Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dispatchedEmails.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No dispatched emails logged in this session yet.
                        </td>
                      </tr>
                    ) : (
                      dispatchedEmails.map((em) => (
                        <tr key={em.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-900">{em.recipient}</td>
                          <td className="p-3.5 text-slate-700">{em.subject}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                              {em.type}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500">{new Date(em.sentAt).toLocaleString()}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 w-max">
                              <Check className="w-3 h-3" /> Delivered
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setPreviewEmailHtml(em.htmlContent)}
                              className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors"
                            >
                              View Email Body
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>

      {/* MODAL: View Single Booking Details */}
      {selectedBooking && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedBooking.reference}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  Consultation Lead Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[11px] text-slate-400 font-semibold block">Client Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedBooking.fullName}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[11px] text-slate-400 font-semibold block">Company</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedBooking.organization || 'Individual'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[11px] text-slate-400 font-semibold block">Email</span>
                  <span className="font-bold text-slate-900">{selectedBooking.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[11px] text-slate-400 font-semibold block">Mobile</span>
                  <span className="font-bold text-slate-900">{selectedBooking.mobile}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  What Client Wants (Requirements / Problem Statement):
                </span>
                <p className="text-slate-800 text-xs leading-relaxed font-medium">
                  {selectedBooking.message || 'No detailed message provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[11px] text-slate-400 font-semibold block">Date &amp; Slot</span>
                  <span className="font-bold text-slate-900">
                    {selectedBooking.date} @ {selectedBooking.timeSlot}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[11px] text-slate-400 font-semibold block">Meeting Link</span>
                  <a
                    href={selectedBooking.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-600 truncate block"
                  >
                    {selectedBooking.meetingLink}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setReminderBooking(selectedBooking);
                  setReminderCustomMessage('');
                  setReminderStatusMsg(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Send Slot Reminder</span>
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Send Consultation Slot Reminder to Client */}
      {reminderBooking && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-heading">
                    Send Consultation Reminder
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dispatches meeting details to client via Web3Forms &amp; Email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReminderBooking(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Recipient Dossier summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Client:</span>
                <span className="font-bold text-slate-900">{reminderBooking.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Email:</span>
                <span className="font-mono text-slate-900">{reminderBooking.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Scheduled Slot:</span>
                <span className="font-bold text-blue-600">
                  {reminderBooking.date} @ {reminderBooking.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Service:</span>
                <span className="font-medium text-slate-800 truncate max-w-[240px]">
                  {reminderBooking.service}
                </span>
              </div>
            </div>

            {/* Web3Forms status badge */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
              <span className="text-[11px] font-semibold text-amber-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Web3Forms API Notification:</span>
              </span>
              {formData.web3formsKey ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Configured &amp; Active
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Key Optional (SMTP Active)
                </span>
              )}
            </div>

            {/* Admin Custom Message / Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Note or Preparation Instructions (Optional)
              </label>
              <textarea
                rows={3}
                value={reminderCustomMessage}
                onChange={(e) => setReminderCustomMessage(e.target.value)}
                placeholder="e.g. Please be ready with your product architecture diagram or patent claims sheet 5 minutes prior to the slot."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Feedback message */}
            {reminderStatusMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  reminderStatusMsg.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {reminderStatusMsg.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{reminderStatusMsg.message}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReminderBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReminder}
                disabled={sendingReminder}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {sendingReminder ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Reminder...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reminder Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Portfolio Card Photo */}
      {editingPortfolioItem && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-slate-900 font-heading">
              Edit Portfolio Photo &amp; Card Details
            </h3>

            <ImageSourceSelector
              label="Portfolio Card Photo (Upload from System or Apply via Link)"
              value={editingPortfolioItem.imageUrl}
              onChange={(newVal) =>
                setEditingPortfolioItem({ ...editingPortfolioItem, imageUrl: newVal })
              }
              presets={[
                {
                  label: 'AI Logistics Robotics',
                  url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
                },
                {
                  label: 'Data Analytics Screen',
                  url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                },
                {
                  label: 'IP & Patent Legal Shield',
                  url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
                },
                {
                  label: 'Defense & Aerospace AI',
                  url: 'https://images.unsplash.com/photo-1517976487502-5f653459c7f6?auto=format&fit=crop&w=800&q=80',
                },
              ]}
              helperText="Upload any local photo file directly from your computer or paste an external image link."
            />

            <AdminStyledField
              label="Project Title"
              value={editingPortfolioItem.title}
              onChange={(val) =>
                setEditingPortfolioItem({ ...editingPortfolioItem, title: val })
              }
              styleValue={editingPortfolioItem.title_style}
              onStyleChange={(st) =>
                setEditingPortfolioItem({ ...editingPortfolioItem, title_style: st })
              }
              placeholder="e.g. Pune Metro Smart Fleet AI"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={editingPortfolioItem.category || 'AI Software'}
                  onChange={(e) =>
                    setEditingPortfolioItem({
                      ...editingPortfolioItem,
                      category: e.target.value,
                      tag: e.target.value,
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                >
                  <option value="AI Software">AI Software</option>
                  <option value="IP Protection">IP Protection</option>
                  <option value="Agentic Automation">Agentic Automation</option>
                  <option value="Patent Defense">Patent Defense</option>
                  <option value="Hardware AI">Hardware AI</option>
                </select>
              </div>

              <div>
                <AdminStyledField
                  label="Client Name"
                  value={editingPortfolioItem.client || ''}
                  onChange={(val) =>
                    setEditingPortfolioItem({ ...editingPortfolioItem, client: val })
                  }
                  styleValue={editingPortfolioItem.client_style}
                  onStyleChange={(st) =>
                    setEditingPortfolioItem({ ...editingPortfolioItem, client_style: st })
                  }
                  placeholder="e.g. Kirloskar Heavy Eng."
                />
              </div>
            </div>

            <AdminStyledField
              label="Impact Result / Metric"
              value={editingPortfolioItem.result || ''}
              onChange={(val) =>
                setEditingPortfolioItem({ ...editingPortfolioItem, result: val })
              }
              styleValue={editingPortfolioItem.result_style}
              onStyleChange={(st) =>
                setEditingPortfolioItem({ ...editingPortfolioItem, result_style: st })
              }
              placeholder="e.g. 98.4% Accuracy, 65% Cost Cut"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project or Live Website Link (URL) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://example.com (optional — leave blank if no live link)"
                  value={editingPortfolioItem.projectUrl || ''}
                  onChange={(e) =>
                    setEditingPortfolioItem({ ...editingPortfolioItem, projectUrl: e.target.value })
                  }
                  className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <AdminStyledField
              label="Description"
              value={editingPortfolioItem.description}
              onChange={(val) =>
                setEditingPortfolioItem({ ...editingPortfolioItem, description: val })
              }
              styleValue={editingPortfolioItem.description_style}
              onStyleChange={(st) =>
                setEditingPortfolioItem({ ...editingPortfolioItem, description_style: st })
              }
              placeholder="Brief technical or legal achievements..."
              isTextarea={true}
              rows={2}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleDeletePortfolioItem(editingPortfolioItem.id, editingPortfolioItem.title)}
                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPortfolioItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEditedPortfolioItem(editingPortfolioItem)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Photo &amp; Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View Email Body HTML */}
      {previewEmailHtml && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl h-[80vh] rounded-3xl p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                Rendered HTML Email Notification
              </h4>
              <button
                onClick={() => setPreviewEmailHtml(null)}
                className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-50 rounded-xl my-4 border border-slate-200">
              <div dangerouslySetInnerHTML={{ __html: previewEmailHtml }} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Service / Product */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 font-heading">
              Add New Service or Product
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Division</label>
                <select
                  value={newService.division}
                  onChange={(e) =>
                    setNewService({ ...newService, division: e.target.value as ServiceDivision })
                  }
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                >
                  <option value="AI Hub">AI Hub</option>
                  <option value="IP Hub">IP Hub</option>
                </select>
              </div>

              {newService.division === 'AI Hub' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newService.subCategory || 'LYI Services'}
                    onChange={(e) =>
                      setNewService({ ...newService, subCategory: e.target.value as AiSubCategory })
                    }
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="LYI Services">LYI Services (Bespoke &amp; Custom)</option>
                    <option value="LYI Products">LYI Products (Agentic Tools &amp; SaaS)</option>
                    <option value="Our Services">Our Services (General)</option>
                    <option value="Our Products">Our Products (General)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">IP Classification</label>
                  <select
                    value={newService.heroHeadline || 'Patent Prosecution'}
                    onChange={(e) =>
                      setNewService({ ...newService, heroHeadline: e.target.value })
                    }
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="Patent & Technology Prosecution">Patent Filing &amp; Prosecution</option>
                    <option value="Trademark & Brand Armor">Trademark &amp; Brand Armor</option>
                    <option value="IP Audit & Valuation">IP Audit &amp; Valuation</option>
                    <option value="Trade Secrets & IP Contracts">Trade Secrets &amp; Contracts</option>
                    <option value="Patent Defense & Litigation">Patent Defense &amp; Litigation</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. WhatsApp Automation or Enterprise RAG AI"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
              <textarea
                rows={2}
                placeholder="Brief summary shown on cards & menus"
                value={newService.shortDesc}
                onChange={(e) => setNewService({ ...newService, shortDesc: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddServiceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateService}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Service / Product */}
      {editingService && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs ${editingService.division === 'AI Hub' ? 'bg-blue-600' : 'bg-cyan-600'}`}>
                  {editingService.division === 'AI Hub' ? <Bot className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {editingService.division} · {editingService.subCategory || 'Core Practice'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/{editingService.slug}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-heading mt-0.5">
                    Edit Service / Product Details
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex items-center gap-1.5 py-2.5 border-b border-slate-100 overflow-x-auto shrink-0 custom-scrollbar">
              {[
                { id: 'hero', label: '1. Hero & Identity', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'challenges', label: '2. Challenges (Friction)', icon: <AlertCircle className="w-3.5 h-3.5" />, count: (editingService.problemPoints || []).length },
                { id: 'methodology', label: '3. Methodology & Sectors', icon: <Building className="w-3.5 h-3.5" />, count: (editingService.industries || []).length },
                { id: 'scope', label: '4. Scope of Work', icon: <CheckCircle className="w-3.5 h-3.5" />, count: (editingService.features || []).length },
                { id: 'process', label: '5. Execution Process', icon: <Clock className="w-3.5 h-3.5" />, count: (editingService.processSteps || []).length },
                { id: 'faqs', label: '6. FAQs & Details', icon: <HelpCircle className="w-3.5 h-3.5" />, count: (editingService.faqs || []).length },
              ].map((tab) => {
                const isActive = serviceModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setServiceModalTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-700'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Tab Content */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 custom-scrollbar">
              {/* TAB 1: HERO & IDENTITY */}
              {serviceModalTab === 'hero' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Division</label>
                      <select
                        value={editingService.division}
                        onChange={(e) =>
                          setEditingService({ ...editingService, division: e.target.value as ServiceDivision })
                        }
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium bg-white"
                      >
                        <option value="AI Hub">AI Hub</option>
                        <option value="IP Hub">IP Hub</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category / Grouping</label>
                      <select
                        value={editingService.subCategory || 'LYI Services'}
                        onChange={(e) =>
                          setEditingService({ ...editingService, subCategory: e.target.value as AiSubCategory })
                        }
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium bg-white"
                      >
                        <option value="LYI Services">LYI Services (Bespoke &amp; Custom)</option>
                        <option value="LYI Products">LYI Products (Agentic Tools &amp; SaaS)</option>
                        <option value="Our Services">Our Services (General)</option>
                        <option value="Our Products">Our Products (General)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Badge Pill / Category Text</label>
                      <input
                        type="text"
                        value={editingService.categoryLabel || editingService.breadcrumbText || ''}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            categoryLabel: e.target.value,
                            breadcrumbText: e.target.value,
                          })
                        }
                        placeholder="e.g. AI Hub · Core Practice"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <AdminStyledField
                        label="Service Title"
                        value={editingService.title}
                        onChange={(val) => setEditingService({ ...editingService, title: val })}
                        styleValue={editingService.title_style}
                        onStyleChange={(st) => setEditingService({ ...editingService, title_style: st })}
                        placeholder="e.g. Custom AI Software Development for Enterprises"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">URL Identifier (Slug)</label>
                      <input
                        type="text"
                        value={editingService.slug}
                        onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-mono text-slate-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <AdminStyledField
                        label="Short Description (Cards & Previews)"
                        value={editingService.shortDesc || ''}
                        onChange={(val) => setEditingService({ ...editingService, shortDesc: val })}
                        styleValue={editingService.shortDesc_style}
                        onStyleChange={(st) => setEditingService({ ...editingService, shortDesc_style: st })}
                        placeholder="Brief summary shown on homepage & dropdown menus..."
                        isTextarea={true}
                        rows={2}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <AdminStyledField
                        label="Hero Main Headline (Detail Page)"
                        value={editingService.heroHeadline || ''}
                        onChange={(val) => setEditingService({ ...editingService, heroHeadline: val })}
                        styleValue={editingService.heroHeadline_style}
                        onStyleChange={(st) => setEditingService({ ...editingService, heroHeadline_style: st })}
                        placeholder="e.g. Custom AI Software Development for Enterprises"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <AdminStyledField
                        label="Hero Subhead / Lede Paragraph"
                        value={editingService.heroLede || ''}
                        onChange={(val) => setEditingService({ ...editingService, heroLede: val })}
                        styleValue={editingService.heroLede_style}
                        onStyleChange={(st) => setEditingService({ ...editingService, heroLede_style: st })}
                        placeholder="e.g. AI software, AI websites, AI apps and AI platforms architected around your workflows, not a template."
                        isTextarea={true}
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button Text</label>
                      <input
                        type="text"
                        value={editingService.ctaButtonText || ''}
                        onChange={(e) => setEditingService({ ...editingService, ctaButtonText: e.target.value })}
                        placeholder="e.g. Book Real-Time Consultation"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Custom Link (Optional)</label>
                      <input
                        type="text"
                        value={editingService.ctaButtonLink || ''}
                        onChange={(e) => setEditingService({ ...editingService, ctaButtonLink: e.target.value })}
                        placeholder="Leave empty for instant booking modal"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Background Image & Visual Contrast Controls */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Hero Background Image &amp; Overlay Contrast
                    </span>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Background Image URL or Upload</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingService.bgImage || editingService.backgroundImageUrl || ''}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              bgImage: e.target.value,
                              backgroundImageUrl: e.target.value,
                            })
                          }
                          placeholder="https://images.unsplash.com/... or upload image"
                          className="flex-1 p-2 text-xs rounded-lg border border-slate-200 bg-white"
                        />
                        <label className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const MAX_SIZE = 2 * 1024 * 1024;
                                if (file.size > MAX_SIZE) {
                                  alert('Image size must be 2 MB or smaller.');
                                  e.target.value = '';
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  const rawData = reader.result as string;
                                  try {
                                    const res = await fetch('/api/upload-image', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        imageData: rawData,
                                        fileName: file.name,
                                        target: 'service-bg',
                                      }),
                                    });
                                    const data = await res.json();
                                    if (res.ok && data.url) {
                                      setEditingService((prev: any) => ({
                                        ...prev,
                                        bgImage: data.url,
                                        backgroundImageUrl: data.url,
                                      }));
                                      return;
                                    } else {
                                      alert(data.error || 'Image size must be 2 MB or smaller.');
                                    }
                                  } catch (err: any) {
                                    alert('Upload failed: ' + (err.message || 'Image size must be 2 MB or smaller.'));
                                  }
                                };
                                reader.readAsDataURL(file);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Overlay Type</label>
                        <select
                          value={editingService.overlayType || 'dark'}
                          onChange={(e) => setEditingService({ ...editingService, overlayType: e.target.value as any })}
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="dark">Dark Slate Overlay (High Contrast)</option>
                          <option value="gradient">Deep Gradient Vignette</option>
                          <option value="light">Light Glass Overlay</option>
                          <option value="none">No Overlay (Raw Image)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Overlay Opacity: {editingService.overlayOpacity !== undefined ? editingService.overlayOpacity : 80}%
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={editingService.overlayOpacity !== undefined ? editingService.overlayOpacity : 80}
                          onChange={(e) => setEditingService({ ...editingService, overlayOpacity: Number(e.target.value) })}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Text Mode</label>
                        <select
                          value={editingService.textMode || 'auto'}
                          onChange={(e) => setEditingService({ ...editingService, textMode: e.target.value as any })}
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="auto">Auto Contrast (Recommended)</option>
                          <option value="light">Crisp Light / White Text</option>
                          <option value="dark">Dark / Slate Text</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHALLENGES WE SOLVE (FRICTION POINTS) */}
              {serviceModalTab === 'challenges' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                          THE CHALLENGES WE SOLVE
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                          Friction Points &amp; Operational Vulnerabilities
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentPoints = editingService.problemPoints || [];
                          setEditingService({
                            ...editingService,
                            problemPoints: [...currentPoints, 'New operational friction point...'],
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm shadow-rose-600/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Challenge</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-600">
                      Displayed with prominent ✕ bullet indicators in the Challenges section.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {(editingService.problemPoints || []).map((point, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                        <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                          ✕
                        </span>
                        <textarea
                          rows={2}
                          value={point}
                          onChange={(e) => {
                            const updated = [...(editingService.problemPoints || [])];
                            updated[index] = e.target.value;
                            setEditingService({ ...editingService, problemPoints: updated });
                          }}
                          placeholder="Describe the challenge / bottleneck..."
                          className="flex-1 p-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingService.problemPoints || []).filter((_, i) => i !== index);
                            setEditingService({ ...editingService, problemPoints: updated });
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {(editingService.problemPoints || []).length === 0 && (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                        No friction points added yet. Click "+ Add Challenge" above to add items.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: OUR METHODOLOGY & SECTORS */}
              {serviceModalTab === 'methodology' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                      OUR METHODOLOGY
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                      Engineered for Predictable Delivery
                    </h4>
                    <p className="text-xs text-slate-600">
                      Configure the delivery philosophy and primary industry sectors served.
                    </p>
                  </div>

                  <AdminStyledField
                    label="Methodology Narrative / Delivery Approach"
                    value={editingService.solutionText || ''}
                    onChange={(val) => setEditingService({ ...editingService, solutionText: val })}
                    styleValue={editingService.solutionText_style}
                    onStyleChange={(st) => setEditingService({ ...editingService, solutionText_style: st })}
                    placeholder="e.g. We design and build custom AI software, websites, apps and platforms end to end — from architecture to LLM integration, computer vision and predictive analytics — engineered to fit inside your existing stack instead of forcing you to change how you work."
                    isTextarea={true}
                    rows={4}
                  />

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Primary Sectors / Verticals</span>
                        <p className="text-[11px] text-slate-500">Tags rendered under the methodology card.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(editingService.industries || []).map((sector, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 text-xs font-medium text-slate-800 shadow-xs"
                        >
                          <span>{sector}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingService.industries || []).filter((_, i) => i !== index);
                              setEditingService({ ...editingService, industries: updated });
                            }}
                            className="text-slate-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        value={newIndustryTag}
                        onChange={(e) => setNewIndustryTag(e.target.value)}
                        placeholder="Add industry (e.g. Manufacturing, Healthcare, Banking & Finance)..."
                        className="flex-1 p-2 text-xs rounded-xl border border-slate-200 bg-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newIndustryTag.trim()) {
                              const current = editingService.industries || [];
                              setEditingService({ ...editingService, industries: [...current, newIndustryTag.trim()] });
                              setNewIndustryTag('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newIndustryTag.trim()) {
                            const current = editingService.industries || [];
                            setEditingService({ ...editingService, industries: [...current, newIndustryTag.trim()] });
                            setNewIndustryTag('');
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                      >
                        + Add Sector
                      </button>
                    </div>

                    {/* Quick presets */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                      <span className="font-bold">Quick presets:</span>
                      {['Manufacturing', 'Banking & Finance', 'Healthcare', 'Retail', 'Government', 'Logistics', 'Pharma', 'Defense', 'Legal Tech'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const current = editingService.industries || [];
                            if (!current.includes(preset)) {
                              setEditingService({ ...editingService, industries: [...current, preset] });
                            }
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SCOPE OF WORK (WHAT IS INCLUDED) */}
              {serviceModalTab === 'scope' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block">
                        SCOPE OF WORK
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                        What Is Included (Deliverables Grid)
                      </h4>
                      <p className="text-xs text-slate-600">
                        Numbered feature cards displayed in the 3-column Scope of Work section.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentFeatures = editingService.features || [];
                        setEditingService({
                          ...editingService,
                          features: [
                            ...currentFeatures,
                            { title: 'New Deliverable / Capability', desc: 'Detailed description of what is included in this scope.' },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm shadow-cyan-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Scope Item</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(editingService.features || []).map((feat, index) => (
                      <div key={index} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 font-mono font-bold text-xs flex items-center justify-center">
                              0{index + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800">Scope Deliverable #{index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingService.features || []).filter((_, i) => i !== index);
                              setEditingService({ ...editingService, features: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 text-xs p-1 rounded cursor-pointer"
                            title="Delete scope item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...(editingService.features || [])];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setEditingService({ ...editingService, features: updated });
                          }}
                          placeholder="e.g. AI Software Development or LLM Integration"
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 font-bold text-slate-900"
                        />

                        <textarea
                          rows={2}
                          value={feat.desc}
                          onChange={(e) => {
                            const updated = [...(editingService.features || [])];
                            updated[index] = { ...updated[index], desc: e.target.value };
                            setEditingService({ ...editingService, features: updated });
                          }}
                          placeholder="e.g. Bespoke applications built around your data and business rules."
                          className="w-full p-2 text-xs rounded-xl border border-slate-200"
                        />
                      </div>
                    ))}

                    {(editingService.features || []).length === 0 && (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                        No deliverables in scope yet. Click "+ Add Scope Item" above to add one.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: EXECUTION PROCESS */}
              {serviceModalTab === 'process' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                        EXECUTION PROCESS
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                        How Implementation Works (5-Step Roadmap)
                      </h4>
                      <p className="text-xs text-slate-600">
                        Sequential timeline steps displayed in the Execution Process section.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentSteps = editingService.processSteps || [];
                        const nextStepNum = `0${currentSteps.length + 1}`;
                        setEditingService({
                          ...editingService,
                          processSteps: [
                            ...currentSteps,
                            { step: nextStepNum, title: 'Implementation Step', desc: 'Detailed description of milestone delivery and handover.' },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm shadow-indigo-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Step</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(editingService.processSteps || []).map((st, index) => (
                      <div key={index} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={st.step}
                              onChange={(e) => {
                                const updated = [...(editingService.processSteps || [])];
                                updated[index] = { ...updated[index], step: e.target.value };
                                setEditingService({ ...editingService, processSteps: updated });
                              }}
                              className="w-12 p-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 bg-indigo-50 text-indigo-700"
                              placeholder="01"
                            />
                            <span className="text-xs font-bold text-slate-800">Process Step #{index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingService.processSteps || []).filter((_, i) => i !== index);
                              setEditingService({ ...editingService, processSteps: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 text-xs p-1 rounded cursor-pointer"
                            title="Delete step"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const updated = [...(editingService.processSteps || [])];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setEditingService({ ...editingService, processSteps: updated });
                          }}
                          placeholder="e.g. Discovery, Architecture, Build, Deploy, Support"
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 font-bold text-slate-900"
                        />

                        <textarea
                          rows={2}
                          value={st.desc}
                          onChange={(e) => {
                            const updated = [...(editingService.processSteps || [])];
                            updated[index] = { ...updated[index], desc: e.target.value };
                            setEditingService({ ...editingService, processSteps: updated });
                          }}
                          placeholder="e.g. We map your workflows, data sources and constraints."
                          className="w-full p-2 text-xs rounded-xl border border-slate-200"
                        />
                      </div>
                    ))}

                    {(editingService.processSteps || []).length === 0 && (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                        No execution steps added yet. Click "+ Add Step" above.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: FAQS & DETAILS */}
              {serviceModalTab === 'faqs' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        FAQS &amp; SPECIFICATIONS
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                        Frequently Asked Questions &amp; Executive Notes
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentFaqs = editingService.faqs || [];
                        setEditingService({
                          ...editingService,
                          faqs: [
                            ...currentFaqs,
                            { q: 'What is the implementation timeline?', a: 'Standard timeline ranges from 2 to 8 weeks depending on scope.' },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm shadow-amber-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(editingService.faqs || []).map((faq, index) => (
                      <div key={index} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">FAQ Question #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingService.faqs || []).filter((_, i) => i !== index);
                              setEditingService({ ...editingService, faqs: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 text-xs p-1 rounded cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => {
                            const updated = [...(editingService.faqs || [])];
                            updated[index] = { ...updated[index], q: e.target.value };
                            setEditingService({ ...editingService, faqs: updated });
                          }}
                          placeholder="e.g. Can this be deployed on-premises in our own VPC?"
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 font-bold text-slate-900"
                        />

                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) => {
                            const updated = [...(editingService.faqs || [])];
                            updated[index] = { ...updated[index], a: e.target.value };
                            setEditingService({ ...editingService, faqs: updated });
                          }}
                          placeholder="Answer explaining technical details, SLA or security..."
                          className="w-full p-2 text-xs rounded-xl border border-slate-200"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Executive Overview & Specifications */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Executive Overview &amp; Specifications (Optional HTML or Markdown)
                    </label>
                    <textarea
                      rows={4}
                      value={editingService.richTextContent || ''}
                      onChange={(e) => setEditingService({ ...editingService, richTextContent: e.target.value })}
                      placeholder="<p>Detailed technical scope, deliverables, patent claims, architecture...</p>"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleDeleteService(editingService.id, editingService.title)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Service</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEditedService(editingService)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Save &amp; Publish to MongoDB</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Portfolio Card Item */}
      {isAddPortfolioModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-slate-900 font-heading">
              Add New Portfolio Project Card
            </h3>

            {/* Photo using ImageSourceSelector (local upload or link) */}
            <ImageSourceSelector
              label="Project Card Photo (Upload from System or Apply via Link)"
              value={newPortfolioItem.imageUrl || ''}
              onChange={(newVal) =>
                setNewPortfolioItem({ ...newPortfolioItem, imageUrl: newVal })
              }
              presets={[
                {
                  label: 'AI Robotics Warehouse',
                  url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
                },
                {
                  label: 'Analytics Dashboard',
                  url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                },
                {
                  label: 'IP Patent Protection',
                  url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
                },
                {
                  label: 'Aerospace Engineering',
                  url: 'https://images.unsplash.com/photo-1517976487502-5f653459c7f6?auto=format&fit=crop&w=800&q=80',
                },
              ]}
              helperText="Upload any local photo directly from your files or enter an image web URL."
            />

            <AdminStyledField
              label="Project Title"
              value={newPortfolioItem.title || ''}
              onChange={(val) =>
                setNewPortfolioItem({ ...newPortfolioItem, title: val })
              }
              styleValue={newPortfolioItem.title_style}
              onStyleChange={(st) =>
                setNewPortfolioItem({ ...newPortfolioItem, title_style: st })
              }
              placeholder="e.g. Pune Metro Smart Fleet AI"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newPortfolioItem.category || 'AI Software'}
                  onChange={(e) =>
                    setNewPortfolioItem({
                      ...newPortfolioItem,
                      category: e.target.value,
                      tag: e.target.value,
                    })
                  }
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                >
                  <option value="AI Software">AI Software</option>
                  <option value="IP Protection">IP Protection</option>
                  <option value="Agentic Automation">Agentic Automation</option>
                  <option value="Patent Defense">Patent Defense</option>
                  <option value="Hardware AI">Hardware AI</option>
                </select>
              </div>

              <div>
                <AdminStyledField
                  label="Client Name"
                  value={newPortfolioItem.client || ''}
                  onChange={(val) =>
                    setNewPortfolioItem({ ...newPortfolioItem, client: val })
                  }
                  styleValue={newPortfolioItem.client_style}
                  onStyleChange={(st) =>
                    setNewPortfolioItem({ ...newPortfolioItem, client_style: st })
                  }
                  placeholder="e.g. Kirloskar Heavy Eng."
                />
              </div>
            </div>

            <AdminStyledField
              label="Impact Result / Metric"
              value={newPortfolioItem.result || ''}
              onChange={(val) =>
                setNewPortfolioItem({ ...newPortfolioItem, result: val })
              }
              styleValue={newPortfolioItem.result_style}
              onStyleChange={(st) =>
                setNewPortfolioItem({ ...newPortfolioItem, result_style: st })
              }
              placeholder="e.g. 98.4% Accuracy, 65% Cost Cut"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project or Live Website Link (URL) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://example.com (optional — leave blank if no live link)"
                  value={newPortfolioItem.projectUrl || ''}
                  onChange={(e) =>
                    setNewPortfolioItem({ ...newPortfolioItem, projectUrl: e.target.value })
                  }
                  className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <AdminStyledField
              label="Description"
              value={newPortfolioItem.description || ''}
              onChange={(val) =>
                setNewPortfolioItem({ ...newPortfolioItem, description: val })
              }
              styleValue={newPortfolioItem.description_style}
              onStyleChange={(st) =>
                setNewPortfolioItem({ ...newPortfolioItem, description_style: st })
              }
              placeholder="Brief technical or legal achievements..."
              isTextarea={true}
              rows={2}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddPortfolioModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePortfolioItem}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Add Project Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Testimonial */}
      {isAddTestimonialModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 font-heading">
                Add Client Testimonial
              </h3>
              <button
                type="button"
                onClick={() => setIsAddTestimonialModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <AdminStyledField
              label="Client Quote / Review"
              value={newTestimonial.quote || ''}
              onChange={(val) => setNewTestimonial({ ...newTestimonial, quote: val })}
              styleValue={newTestimonial.quote_style}
              onStyleChange={(st) => setNewTestimonial({ ...newTestimonial, quote_style: st })}
              placeholder="Client feedback, impact metrics, or experience working with LockYourIdea..."
              isTextarea={true}
              rows={3}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminStyledField
                  label="Author Name"
                  value={newTestimonial.author || ''}
                  onChange={(val) => setNewTestimonial({ ...newTestimonial, author: val })}
                  styleValue={newTestimonial.author_style}
                  onStyleChange={(st) => setNewTestimonial({ ...newTestimonial, author_style: st })}
                  placeholder="e.g. Vikramaditya Shinde"
                  required
                />
              </div>
              <div>
                <AdminStyledField
                  label="Role / Designation"
                  value={newTestimonial.role || ''}
                  onChange={(val) => setNewTestimonial({ ...newTestimonial, role: val })}
                  styleValue={newTestimonial.role_style}
                  onStyleChange={(st) => setNewTestimonial({ ...newTestimonial, role_style: st })}
                  placeholder="e.g. Head of Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminStyledField
                  label="Company / Organization"
                  value={newTestimonial.company || ''}
                  onChange={(val) => setNewTestimonial({ ...newTestimonial, company: val })}
                  styleValue={newTestimonial.company_style}
                  onStyleChange={(st) => setNewTestimonial({ ...newTestimonial, company_style: st })}
                  placeholder="e.g. Precision Tech Labs, Pune"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                <select
                  value={newTestimonial.rating || 5}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddTestimonialModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = `test_${Date.now()}`;
                  handleSaveTestimonial({
                    id,
                    quote: newTestimonial.quote || '',
                    author: newTestimonial.author || '',
                    role: newTestimonial.role || '',
                    company: newTestimonial.company || '',
                    rating: newTestimonial.rating || 5,
                    quote_style: newTestimonial.quote_style,
                    author_style: newTestimonial.author_style,
                    role_style: newTestimonial.role_style,
                    company_style: newTestimonial.company_style,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save &amp; Publish Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Testimonial */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 font-heading">
                Edit Client Testimonial
              </h3>
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <AdminStyledField
              label="Client Quote / Review"
              value={editingTestimonial.quote}
              onChange={(val) => setEditingTestimonial({ ...editingTestimonial, quote: val })}
              styleValue={editingTestimonial.quote_style}
              onStyleChange={(st) => setEditingTestimonial({ ...editingTestimonial, quote_style: st })}
              placeholder="Client feedback, impact metrics, or experience working with LockYourIdea..."
              isTextarea={true}
              rows={3}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminStyledField
                  label="Author Name"
                  value={editingTestimonial.author}
                  onChange={(val) => setEditingTestimonial({ ...editingTestimonial, author: val })}
                  styleValue={editingTestimonial.author_style}
                  onStyleChange={(st) => setEditingTestimonial({ ...editingTestimonial, author_style: st })}
                  placeholder="e.g. Vikramaditya Shinde"
                  required
                />
              </div>
              <div>
                <AdminStyledField
                  label="Role / Designation"
                  value={editingTestimonial.role || ''}
                  onChange={(val) => setEditingTestimonial({ ...editingTestimonial, role: val })}
                  styleValue={editingTestimonial.role_style}
                  onStyleChange={(st) => setEditingTestimonial({ ...editingTestimonial, role_style: st })}
                  placeholder="e.g. Head of Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminStyledField
                  label="Company / Organization"
                  value={editingTestimonial.company}
                  onChange={(val) => setEditingTestimonial({ ...editingTestimonial, company: val })}
                  styleValue={editingTestimonial.company_style}
                  onStyleChange={(st) => setEditingTestimonial({ ...editingTestimonial, company_style: st })}
                  placeholder="e.g. Precision Tech Labs, Pune"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                <select
                  value={editingTestimonial.rating || 5}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 font-medium"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleDeleteTestimonial(editingTestimonial.id, editingTestimonial.author)}
                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTestimonial(editingTestimonial)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP BOX: CONFIRMATION FOR SUCCESSFUL CHANGES */}
      {successPopup && successPopup.isOpen && (
        <div className="fixed inset-0 z-80 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 border border-emerald-200">
                Action Successful
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                {successPopup.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {successPopup.message}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              {successPopup.targetPage && onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    const page = successPopup.targetPage!;
                    setSuccessPopup(null);
                    onClose();
                    onNavigate(page);
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>View on Website</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSuccessPopup(null)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Continue in Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
