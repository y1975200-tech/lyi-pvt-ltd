/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageRoute, BookingData, SiteSettings, PortfolioItem, ServiceItem } from './types.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { RealTimeBookingModal } from './components/RealTimeBookingModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';
import { SEOHead } from './components/SEOHead.tsx';
import { Check } from 'lucide-react';
import { applyThemeToCssVariables, DEFAULT_ORIGINAL_THEME, DEFAULT_PURPLE_THEME } from './lib/themeEngine.ts';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { AiHubPage } from './pages/AiHubPage.tsx';
import { IpHubPage } from './pages/IpHubPage.tsx';
import { ServiceDetailPage } from './pages/ServiceDetailPage.tsx';
import { PortfolioPage } from './pages/PortfolioPage.tsx';
import { IndustriesPage } from './pages/IndustriesPage.tsx';
import { CaseStudiesPage } from './pages/CaseStudiesPage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { ResourcesPage } from './pages/ResourcesPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { PORTFOLIO_ITEMS as DEFAULT_PORTFOLIO, DEFAULT_TESTIMONIALS, INDUSTRIES_LIST, DEFAULT_CLIENT_LOGOS } from './data/generalData.ts';
import { ALL_SERVICES } from './data/services.ts';

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "LYI Tech Pvt. Ltd.",
  tagline: "India's 360° AI & IP Consulting",
  hqAddress: "HQ: Baner, Pune, Maharashtra 411045, India",
  phone: "+91 75586 31355",
  email: "hello@lockyourideatech.com",
  heroBgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
  aiHubBgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
  ipHubBgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
  portfolioBgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
  industriesBgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  caseStudiesBgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
  aboutBgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
  contactBgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
  web3formsKey: "b91db637-425b-4ce4-8ed1-c2b51bc1b91b",
  logoUrl: "/assets/logo.svg",
  heroHeadline: "Transform Your Business & Protect Your Innovation with AI",
  heroSubhead: "Custom AI software, business automation, enterprise CRM, AI training, government AI capacity building, patents, trademarks, copyrights, and intellectual property services — under one trusted platform.",
  testimonials: DEFAULT_TESTIMONIALS,
  clientLogos: DEFAULT_CLIENT_LOGOS,
  industries: INDUSTRIES_LIST,
  theme: DEFAULT_ORIGINAL_THEME,
  stats: {
    aiProjects: "100+",
    ipRegistrations: "500+",
    enterpriseClients: "100+",
    trainedCount: "1,200+",
    successRate: "90%+",
  },
  pageContent: {
    home: {
      pageId: "home",
      badge: "India's 360° AI & IP Transformation Company · HQ Pune",
      headline: "Transform Your Business & Protect Your Innovation with AI",
      subheadline: "Custom AI software, business automation, enterprise CRM, AI training, government AI capacity building, patents, trademarks, copyrights, and intellectual property services — under one trusted platform.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      extraHeading1: "Transforming Organizations with Artificial Intelligence",
      extraText1: "360° AI solutions — from custom software, computer vision, and agentic CRM to enterprise business automation and government-scale training programs.",
      extraHeading2: "Protecting Innovation from Idea to Intellectual Property",
      extraText2: "End-to-end IP services — securing what you've built with the same precision and technological rigor you used to build it.",
    },
    "ai-hub": {
      pageId: "ai-hub",
      badge: "360° Artificial Intelligence Solutions",
      headline: "Transforming Organizations with Artificial Intelligence",
      subheadline: "Custom AI software, business automation, agentic CRM, corporate training, and government capacity building — delivered end to end with enterprise engineering precision.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      extraHeading1: "Dedicated AI Solutions & Products",
      extraText1: "Production-grade models, workflows, and automated enterprise pipelines built in Baner, Pune.",
    },
    "ip-hub": {
      pageId: "ip-hub",
      badge: "End-to-End Intellectual Property Services",
      headline: "Protecting Innovation from Idea to Intellectual Property",
      subheadline: "Patent filing, trademark registration, copyright, industrial design protection, IP strategy, and commercialization — managed by seasoned patent agents and IP attorneys.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      extraHeading1: "6 Dedicated Service Lines",
      extraText1: "Full-lifecycle IP defense across India, USPTO, EPO, and WIPO treaties.",
    },
    portfolio: {
      pageId: "portfolio",
      badge: "PROVEN TRACK RECORD",
      headline: "Real Work. Real Outsized Impact.",
      subheadline: "Explore 12 representative case studies and deployment highlights across our AI Hub engineering and IP Hub legal prosecution practices.",
      bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
    },
    "case-studies": {
      pageId: "case-studies",
      badge: "RESULTS & CLIENT OUTCOMES",
      headline: "Real Client Outcomes & Case Studies",
      subheadline: "Documented, quantifiable outcomes across Indian manufacturing, pharmaceuticals, logistics, and government bodies.",
      bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
    },
    about: {
      pageId: "about",
      badge: "ABOUT LOCKYOURIDEA TECH · BANER, PUNE",
      headline: "Bridging the Gap Between Engineering & Intellectual Property",
      subheadline: "LockYourIdea Tech was founded in Pune with a single conviction: the companies that build groundbreaking software must also legally own and protect it from day one.",
      bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
    },
    contact: {
      pageId: "contact",
      badge: "GET IN TOUCH WITH OUR SPECIALISTS",
      headline: "Start Your AI & IP Transformation",
      subheadline: "Schedule a confidential consultation at our Pune headquarters or via Google Meet. NDA executed upon request prior to discussion.",
      bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
    },
  },
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [currentServiceSlug, setCurrentServiceSlug] = useState<string>('custom-ai-solutions');

  // Site Dynamic State initialized from cache, updated immediately from Firestore
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('lyi_site_settings');
        if (cached) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(cached) };
        }
      } catch (err) {
        console.warn('Could not read cached site settings:', err);
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);
  const [services, setServices] = useState<ServiceItem[]>(ALL_SERVICES);

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingPreselectedService, setBookingPreselectedService] = useState<string | undefined>(undefined);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [bookingCount, setBookingCount] = useState<number>(4);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [emailHtml, setEmailHtml] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEmailId) {
      fetch(`/api/emails/${selectedEmailId}`)
        .then((res) => {
          if (res.ok) return res.text();
          throw new Error('Email not found');
        })
        .then((html) => setEmailHtml(html))
        .catch(() => setEmailHtml('<div style="padding: 24px; font-family: sans-serif;">Email preview could not be loaded.</div>'));
    } else {
      setEmailHtml(null);
    }
  }, [selectedEmailId]);

  // Load site settings, services, and portfolio directly from MongoDB Atlas via aggregated Express API
  const loadSiteData = async () => {
    try {
      const res = await fetch('/api/site-data', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        
        if (data.settings && data.settings.companyName) {
          setSiteSettings((prev) => {
            const merged = {
              ...prev,
              ...data.settings,
              pageContent: {
                ...(prev.pageContent || {}),
                ...(data.settings.pageContent || {}),
              },
            };
            try {
              localStorage.setItem('lyi_site_settings', JSON.stringify(merged));
            } catch (e) {}
            if (merged.theme) {
              applyThemeToCssVariables(merged.theme);
            }
            return merged;
          });
        }

        if (Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }

        if (Array.isArray(data.portfolio) && data.portfolio.length > 0) {
          setPortfolioItems(data.portfolio);
        }

        if (Array.isArray(data.bookings)) {
          setBookingCount(data.bookings.length);
        }
      } else {
        // Fallback parallel fetch if aggregated route is unavailable
        const [sRes, srvRes, portRes, bRes] = await Promise.allSettled([
          fetch('/api/settings', { cache: 'no-store' }),
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/portfolio', { cache: 'no-store' }),
          fetch('/api/bookings', { cache: 'no-store' }),
        ]);

        if (sRes.status === 'fulfilled' && sRes.value.ok) {
          const settingsData = await sRes.value.json();
          if (settingsData && settingsData.companyName) {
            setSiteSettings((prev) => {
              const merged = {
                ...prev,
                ...settingsData,
                pageContent: {
                  ...(prev.pageContent || {}),
                  ...(settingsData.pageContent || {}),
                },
              };
              try {
                localStorage.setItem('lyi_site_settings', JSON.stringify(merged));
              } catch (e) {}
              if (merged.theme) {
                applyThemeToCssVariables(merged.theme);
              }
              return merged;
            });
          }
        }

        if (srvRes.status === 'fulfilled' && srvRes.value.ok) {
          const srvData = await srvRes.value.json();
          if (Array.isArray(srvData) && srvData.length > 0) {
            setServices(srvData);
          }
        }

        if (portRes.status === 'fulfilled' && portRes.value.ok) {
          const portData = await portRes.value.json();
          if (Array.isArray(portData) && portData.length > 0) {
            setPortfolioItems(portData);
          }
        }

        if (bRes.status === 'fulfilled' && bRes.value.ok) {
          const bData = await bRes.value.json();
          if (Array.isArray(bData)) {
            setBookingCount(bData.length);
          }
        }
      }
    } catch (err) {
      console.warn('MongoDB site data load notice:', err);
    }
  };

  // On initial mount, fetch complete database state directly from MongoDB
  useEffect(() => {
    loadSiteData();
  }, []);

  const handleUpdateSettings = async (newSettings: Partial<SiteSettings>) => {
    if (newSettings.services) {
      setServices(newSettings.services);
    }
    if (newSettings.theme) {
      applyThemeToCssVariables(newSettings.theme);
    }

    // 1. Update local React state & localStorage
    setSiteSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
        pageContent: {
          ...(prev.pageContent || {}),
          ...(newSettings.pageContent || {}),
        },
      };
      try {
        localStorage.setItem('lyi_site_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 2. Persist to MongoDB API if not already persisted
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSiteSettings((prev) => {
            const merged = {
              ...prev,
              ...data.settings,
              pageContent: {
                ...(prev.pageContent || {}),
                ...(data.settings.pageContent || {}),
              },
            };
            try {
              localStorage.setItem('lyi_site_settings', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      }
    } catch (err) {
      console.error('API settings sync error:', err);
    }
  };

  // Live Toast for new bookings / email notifications
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string; emailId?: string } | null>(null);

  // Sync hash routing on popstate & initial mount
  useEffect(() => {
    const handleHash = () => {
      const cleanHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const cleanPath = window.location.pathname.toLowerCase().replace(/^\//, '');

      // Check if Admin Endpoint is requested (via #admin, #/admin, #admin-dashboard, /admin, /admin-dashboard)
      if (
        cleanHash === 'admin' ||
        cleanHash === 'admin-dashboard' ||
        cleanHash === 'admin-crm' ||
        cleanPath === 'admin' ||
        cleanPath === 'admin-dashboard'
      ) {
        setIsAdminDashboardOpen(true);
        setCurrentRoute('admin-dashboard');
        return;
      }

      if (!cleanHash || cleanHash === '') {
        setCurrentRoute('home');
      } else if (cleanHash.startsWith('service/')) {
        const slug = cleanHash.split('service/')[1];
        setCurrentServiceSlug(slug || 'custom-ai-solutions');
        setCurrentRoute('service-detail');
      } else if (cleanHash === 'ai-hub') {
        setCurrentRoute('ai-hub');
      } else if (cleanHash === 'ip-hub') {
        setCurrentRoute('ip-hub');
      } else if (cleanHash === 'portfolio') {
        setCurrentRoute('portfolio');
      } else if (cleanHash === 'industries') {
        setCurrentRoute('industries');
      } else if (cleanHash === 'case-studies') {
        setCurrentRoute('case-studies');
      } else if (cleanHash === 'blog') {
        setCurrentRoute('blog');
      } else if (cleanHash === 'about') {
        setCurrentRoute('about');
      } else if (cleanHash === 'contact') {
        setCurrentRoute('contact');
      } else if (cleanHash === 'resources') {
        setCurrentRoute('resources');
      } else if (cleanHash === 'privacy') {
        setCurrentRoute('privacy');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const handleNavigate = (route: PageRoute, slug?: string) => {
    if (route === 'admin-dashboard') {
      setIsAdminDashboardOpen(true);
      window.location.hash = 'admin';
      setCurrentRoute('admin-dashboard');
      return;
    }
    setCurrentRoute(route);
    if (slug) {
      setCurrentServiceSlug(slug);
      window.location.hash = `service/${slug}`;
    } else {
      window.location.hash = route === 'home' ? '' : route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setIsAdminDashboardOpen(false);
    const cleanHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
    if (cleanHash === 'admin' || cleanHash === 'admin-dashboard' || cleanHash === 'admin-crm') {
      window.location.hash = '';
    }
    setCurrentRoute('home');
  };

  const handleOpenBooking = (serviceName?: string) => {
    setBookingPreselectedService(serviceName);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirmed = (booking: BookingData, emailInfo?: { id: string; recipient: string }) => {
    setBookingCount((prev) => prev + 1);
    setToastMessage({
      title: `Consultation Booked: ${booking.reference}`,
      subtitle: `Confirmation email dispatched to ${booking.email}`,
      emailId: emailInfo?.id,
    });

    // Auto-clear toast after 8 seconds
    setTimeout(() => {
      setToastMessage((prev) => (prev?.title.includes(booking.reference) ? null : prev));
    }, 8000);
  };

  const activeTheme = siteSettings.theme;
  const isDarkMode = activeTheme?.mode === 'dark';

  // Global Theme CSS Variables Synchronization
  useEffect(() => {
    if (activeTheme) {
      applyThemeToCssVariables(activeTheme);
    } else {
      applyThemeToCssVariables(DEFAULT_PURPLE_THEME);
    }
  }, [activeTheme]);

  // Non-blocking theme notification toast
  const [themeToast, setThemeToast] = useState<string | null>(null);

  useEffect(() => {
    const handleToastEvent = (e: any) => {
      if (e.detail) {
        setThemeToast(e.detail);
        setTimeout(() => {
          setThemeToast((curr) => (curr === e.detail ? null : curr));
        }, 5000);
      }
    };
    window.addEventListener('lyi-theme-toast', handleToastEvent);
    return () => window.removeEventListener('lyi-theme-toast', handleToastEvent);
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-page-background, #ffffff)',
        color: 'var(--color-body-text, #334155)',
      }}
      className="min-h-screen flex flex-col font-sans antialiased selection:bg-purple-500 selection:text-white transition-colors duration-200 relative"
    >
      {/* Site-Wide Theme Background Image Wallpaper Layer */}
      {activeTheme?.themeBgImage && (
        <div
          className="fixed inset-0 z-0 pointer-events-none transition-all duration-300 overflow-hidden"
          aria-hidden="true"
        >
          <img
            src={activeTheme.themeBgImage}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{
              filter: `blur(${activeTheme.themeBgBlur ?? 0}px)`,
              transform: (activeTheme.themeBgBlur ?? 0) > 0 ? 'scale(1.08)' : 'none',
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: isDarkMode ? '#090d16' : '#ffffff',
              opacity: (activeTheme.themeBgOverlayOpacity ?? 75) / 100,
            }}
          />
        </div>
      )}

      {/* Live Notification Toast */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-20 right-5 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-cyan-500/50 flex items-center justify-between gap-4 max-w-md animate-in slide-in-from-top-4 duration-200"
        >
          <div>
            <div className="text-xs font-medium text-cyan-400 flex items-center gap-1.5 font-heading">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{toastMessage.title}</span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">{toastMessage.subtitle}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAdminDashboardOpen(true);
                setToastMessage(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs shrink-0 cursor-pointer"
            >
              Open CRM
            </button>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* Non-Blocking Theme Notification Toast */}
      {themeToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 pointer-events-auto bg-purple-950/95 text-white border border-purple-400/50 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white font-heading">{themeToast}</p>
            <p className="text-[11px] text-purple-200">Applied globally across all pages &amp; components</p>
          </div>
          <button
            onClick={() => setThemeToast(null)}
            className="ml-2 text-purple-300 hover:text-white text-xs p-1 cursor-pointer"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </aside>
      )}

      {/* Main Header & SEO Engine */}
      {(() => {
        const activeSiteSettings: SiteSettings = { ...siteSettings, services };
        
        let seoTitle: string | undefined;
        let seoDesc: string | undefined;
        let seoImage: string | undefined;
        let seoType = 'website';

        if (currentRoute === 'service-detail') {
          const srv = services.find(s => s.slug === currentServiceSlug || s.id === currentServiceSlug);
          if (srv) {
            seoTitle = srv.title;
            seoDesc = srv.shortDesc || srv.heroLede;
            seoImage = srv.bgImage || srv.imageUrl;
            seoType = 'article';
          }
        } else {
          const pageTitles: Record<string, string> = {
            home: "India's 360° AI & IP Transformation Company",
            'ai-hub': "AI Hub — 360° Artificial Intelligence Solutions",
            'ip-hub': "IP Hub — Patent Filing, Trademarks & IP Defense",
            portfolio: "Proven Case Studies & Deployments",
            'case-studies': "Client Outcomes & Measurable Results",
            industries: "Industry-Specific AI & IP Solutions",
            about: "About LockYourIdea Tech Pvt. Ltd.",
            contact: "Consultation & Headquarter Office",
            blog: "AI Engineering & Patent Law Insights",
            resources: "Whitepapers & Intellectual Property Guides",
            privacy: "Privacy Policy & Data Security",
          };
          const cmsPage = siteSettings.pageContent?.[currentRoute];
          seoTitle = cmsPage?.title || pageTitles[currentRoute];
          seoDesc = cmsPage?.subheadline || cmsPage?.headline;
          seoImage = cmsPage?.bgImage || siteSettings.heroBgImage;
        }

        return (
          <>
            <SEOHead
              title={seoTitle}
              description={seoDesc}
              ogImage={seoImage}
              ogType={seoType}
              siteSettings={activeSiteSettings}
            />
            <Header
              currentRoute={currentRoute}
              onNavigate={handleNavigate}
              onOpenBooking={() => handleOpenBooking()}
              onOpenAdmin={() => setIsAdminDashboardOpen(true)}
              bookingCount={bookingCount}
              siteSettings={activeSiteSettings}
              services={services}
            />

            {/* Page Content */}
            <main className="flex-grow">
              {currentRoute === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'ai-hub' && (
                <AiHubPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'ip-hub' && (
                <IpHubPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'service-detail' && (
                <ServiceDetailPage
                  slug={currentServiceSlug}
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'portfolio' && (
                <PortfolioPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  portfolioItems={portfolioItems}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'industries' && (
                <IndustriesPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'case-studies' && (
                <CaseStudiesPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'blog' && (
                <BlogPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}
              {currentRoute === 'about' && (
                <AboutPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'contact' && (
                <ContactPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                  onBookingSuccess={handleBookingConfirmed}
                  onViewEmailPreview={(emailId) => setSelectedEmailId(emailId)}
                  siteSettings={activeSiteSettings}
                />
              )}
              {currentRoute === 'resources' && (
                <ResourcesPage
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}
              {currentRoute === 'privacy' && (
                <PrivacyPage onNavigate={handleNavigate} />
              )}
            </main>

            {/* Main Footer */}
            <Footer
              onNavigate={handleNavigate}
              onOpenBooking={() => handleOpenBooking()}
              siteSettings={activeSiteSettings}
            />

            {/* Real-Time Consultation Booking Modal */}
            <RealTimeBookingModal
              isOpen={isBookingModalOpen}
              onClose={() => setIsBookingModalOpen(false)}
              preselectedService={bookingPreselectedService}
              onBookingSuccess={(booking) => handleBookingConfirmed(booking)}
              siteSettings={activeSiteSettings}
            />

            {/* Admin Dashboard: Photos, Details, Services, CRM Slots & Excel Sheet */}
            <AdminDashboard
              isOpen={isAdminDashboardOpen}
              onClose={handleCloseAdmin}
              onRefreshData={loadSiteData}
              siteSettings={activeSiteSettings}
              onUpdateSettings={handleUpdateSettings}
              onNavigate={handleNavigate}
              portfolioItems={portfolioItems}
              onUpdatePortfolio={setPortfolioItems}
              services={services}
              onUpdateServices={(newServices) => {
                setServices(newServices);
                setSiteSettings((prev) => ({ ...prev, services: newServices }));
              }}
              onOpenBookingModal={() => {
                setIsAdminDashboardOpen(false);
                handleOpenBooking();
              }}
            />
          </>
        );
      })()}

      {/* Floating Interactive WhatsApp & Consultation Assistant */}
      <WhatsAppWidget onOpenBooking={handleOpenBooking} />

      {/* Dispatched Email Live Preview Modal */}
      {selectedEmailId && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-heading">
                  Dispatched Notification Email
                </span>
                <h3 className="text-sm font-extrabold text-white">Live Email Preview</h3>
              </div>
              <button
                onClick={() => setSelectedEmailId(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 p-4 bg-slate-50 overflow-hidden">
              {emailHtml ? (
                <iframe
                  title="Dispatched Email"
                  srcDoc={emailHtml}
                  className="w-full h-[500px] rounded-2xl bg-white border border-slate-200 shadow-inner"
                />
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">Loading email preview...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
