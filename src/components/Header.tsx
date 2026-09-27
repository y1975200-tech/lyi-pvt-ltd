import React, { useState, useRef, useEffect } from 'react';
import { PageRoute, SiteSettings, ServiceItem } from '../types.ts';
import { ALL_SERVICES, AI_SERVICES, IP_SERVICES } from '../data/services.ts';
import { applyFieldStyle } from '../lib/styleHelper.ts';
import {
  Calendar,
  Mail,
  Menu,
  X,
  ChevronDown,
  Shield,
  Bot,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Layers,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (preselectedService?: string) => void;
  onOpenAdmin: () => void;
  bookingCount: number;
  siteSettings?: SiteSettings;
  services?: ServiceItem[];
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
  bookingCount,
  siteSettings,
  services,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'ai' | 'ip' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);
  const [mobileIpOpen, setMobileIpOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for transparent hero header on Homepage
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (route: PageRoute, slug?: string) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    onNavigate(route, slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sourceServices: ServiceItem[] = services && services.length > 0
    ? services
    : (siteSettings?.services && siteSettings.services.length > 0 ? siteSettings.services : ALL_SERVICES);

  const allAiServices = sourceServices.filter((s: ServiceItem) => s.division === 'AI Hub');
  const allIpServices = sourceServices.filter((s: ServiceItem) => s.division === 'IP Hub');

  const productsList = allAiServices.filter(
    (s: ServiceItem) => s.subCategory && s.subCategory.toLowerCase().includes('product')
  );
  const servicesList = allAiServices.filter(
    (s: ServiceItem) => !s.subCategory || !s.subCategory.toLowerCase().includes('product')
  );

  const isHeroOverlay = currentRoute === 'home' && !isScrolled;

  const headerContainerClass = isHeroOverlay
    ? 'fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent backdrop-blur-[3px] border-b border-white/10 text-white transition-all duration-300'
    : 'fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm text-slate-900 transition-all duration-300';

  const brandTitleClass = isHeroOverlay
    ? 'block font-medium text-white tracking-tight text-lg leading-tight group-hover:text-cyan-300 transition-colors font-heading drop-shadow-sm'
    : 'block font-medium text-slate-900 tracking-tight text-lg leading-tight group-hover:text-purple-600 transition-colors font-heading';

  const taglineClass = isHeroOverlay
    ? 'block text-xs font-normal text-slate-300 tracking-normal'
    : 'block text-xs font-normal text-slate-500 tracking-normal';

  const navItemClass = (isActive: boolean, activeColorClass: string) => {
    if (isHeroOverlay) {
      return `flex items-center gap-1.5 px-3 py-2 text-sm font-normal rounded-lg transition-colors cursor-pointer ${
        isActive
          ? 'text-cyan-300 bg-white/20 font-medium'
          : 'text-slate-100 hover:text-white hover:bg-white/15'
      }`;
    }
    return `flex items-center gap-1.5 px-3 py-2 text-sm font-normal rounded-lg transition-colors cursor-pointer ${
      isActive
        ? `${activeColorClass} bg-blue-50/70`
        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100/70'
    }`;
  };

  const simpleNavItemClass = (isActive: boolean) => {
    if (isHeroOverlay) {
      return `px-3 py-2 text-sm font-normal rounded-lg transition-colors cursor-pointer ${
        isActive
          ? 'text-cyan-300 bg-white/20 font-medium'
          : 'text-slate-100 hover:text-white hover:bg-white/15'
      }`;
    }
    return `px-3 py-2 text-sm font-normal rounded-lg transition-colors cursor-pointer ${
      isActive
        ? 'text-blue-600 bg-blue-50/70'
        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100/70'
    }`;
  };

  return (
    <>
      {/* Main Header (Overlay on Homepage Hero, Sticky on Scroll/Pages) */}
      <header className={headerContainerClass}>
        <div
          ref={dropdownContainerRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4"
        >
          {/* Brand Logo & Name */}
          <button
            id="brand-home-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none cursor-pointer min-w-0"
          >
            {siteSettings?.logoUrl && siteSettings.logoUrl !== '/assets/logo.svg' ? (
              <img
                key={siteSettings.logoUrl}
                src={siteSettings.logoUrl}
                alt={siteSettings?.companyName || 'LYI Tech Pvt. Ltd.'}
                className="max-h-8 sm:max-h-10 max-w-[120px] sm:max-w-[180px] w-auto h-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/logo.svg';
                }}
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform shrink-0">
                LYI
              </div>
            )}
            <div className="min-w-0">
              <span
                style={applyFieldStyle(siteSettings?.companyName_style)}
                className={`${brandTitleClass} truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none text-xs sm:text-lg`}
              >
                {siteSettings?.companyName || 'LockYourIdea Tech Pvt. Ltd.'}
              </span>
              <small
                style={applyFieldStyle(siteSettings?.tagline_style)}
                className={`${taglineClass} truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none hidden xs:block`}
              >
                {siteSettings?.tagline || "India's 360° AI & IP Consulting"}
              </small>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Primary">
            {/* AI HUB DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('ai')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                id="nav-ai-hub-btn"
                onClick={() => {
                  setOpenDropdown((prev) => (prev === 'ai' ? null : 'ai'));
                }}
                className={navItemClass(currentRoute === 'ai-hub' || openDropdown === 'ai', 'text-blue-600')}
              >
                <Bot className={`w-4 h-4 ${isHeroOverlay ? 'text-cyan-300' : 'text-blue-600'}`} />
                <span>AI Hub</span>
                <ChevronDown
                  className={`w-4 h-4 opacity-60 transition-transform duration-200 ${
                    openDropdown === 'ai' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega menu: Explicit Two Parts: LYI Services | LYI Products */}
              {openDropdown === 'ai' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[760px] max-w-[95vw] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 overflow-y-auto max-h-[calc(100vh-5.5rem)] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* PART 1: LYI SERVICES (with dedicated scroller) */}
                      <div className="bg-blue-50/40 rounded-xl p-3 border border-blue-100/60 flex flex-col">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-100 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-blue-600" />
                            <h4 className="font-medium text-xs text-blue-950 uppercase tracking-wider font-heading">
                              LYI Services
                            </h4>
                          </div>
                          <span className="text-[10px] font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            Bespoke &amp; Enterprise
                          </span>
                        </div>
                        <div className="space-y-1 max-h-[320px] sm:max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                          {servicesList.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setOpenDropdown(null);
                                handleNav('service-detail', s.slug);
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all group/item cursor-pointer"
                            >
                              <div className="font-medium text-xs text-slate-900 group-hover/item:text-blue-600 flex items-center justify-between">
                                <span>{s.title}</span>
                                <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                                {s.shortDesc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* PART 2: LYI PRODUCTS */}
                      <div className="bg-cyan-50/40 rounded-xl p-3 border border-cyan-100/60 flex flex-col">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-100 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Cpu className="w-4 h-4 text-cyan-600" />
                            <h4 className="font-medium text-xs text-cyan-950 uppercase tracking-wider font-heading">
                              LYI Products
                            </h4>
                          </div>
                          <span className="text-[10px] font-medium text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">
                            Agentic Platforms &amp; Tools
                          </span>
                        </div>
                        <div className="space-y-1 max-h-[320px] sm:max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                          {productsList.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setOpenDropdown(null);
                                handleNav('service-detail', s.slug);
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all group/item cursor-pointer"
                            >
                              <div className="font-medium text-xs text-slate-900 group-hover/item:text-cyan-600 flex items-center justify-between">
                                <span>{s.title}</span>
                                <ArrowRight className="w-3 h-3 text-cyan-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                                {s.shortDesc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Link to Full AI Hub */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between px-2">
                      <span className="text-xs text-slate-500 font-normal">
                        360° Artificial Intelligence Solutions engineered in Pune
                      </span>
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          handleNav('ai-hub');
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Explore All AI Services &amp; Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* IP HUB DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('ip')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                id="nav-ip-hub-btn"
                onClick={() => {
                  setOpenDropdown((prev) => (prev === 'ip' ? null : 'ip'));
                }}
                className={navItemClass(currentRoute === 'ip-hub' || openDropdown === 'ip', 'text-cyan-600')}
              >
                <Shield className={`w-4 h-4 ${isHeroOverlay ? 'text-cyan-300' : 'text-cyan-600'}`} />
                <span>IP Hub</span>
                <ChevronDown
                  className={`w-4 h-4 opacity-60 transition-transform duration-200 ${
                    openDropdown === 'ip' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* IP Mega menu */}
              {openDropdown === 'ip' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[620px] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5">
                    <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto custom-scrollbar">
                      {allIpServices.map((s) => (
                        <button
                          key={s.id || s.slug}
                          onClick={() => {
                            setOpenDropdown(null);
                            handleNav('service-detail', s.slug);
                          }}
                          className="text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item cursor-pointer"
                        >
                          <div className="font-medium text-xs text-slate-900 group-hover/item:text-cyan-600 flex items-center justify-between">
                            <span>{s.title}</span>
                            <span className="text-[10px] text-cyan-600 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              →
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                            {s.shortDesc}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between px-2">
                      <span className="text-xs text-slate-500 font-normal">
                        Patents, Trademarks, Copyrights &amp; Industrial Designs
                      </span>
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          handleNav('ip-hub');
                        }}
                        className="text-xs font-medium text-cyan-600 hover:text-cyan-700 cursor-pointer"
                      >
                        View All {allIpServices.length} IP Practices →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('portfolio')}
              className={simpleNavItemClass(currentRoute === 'portfolio')}
            >
              Portfolio
            </button>

            <button
              onClick={() => handleNav('industries')}
              className={simpleNavItemClass(currentRoute === 'industries')}
            >
              Industries
            </button>

            <button
              onClick={() => handleNav('case-studies')}
              className={simpleNavItemClass(currentRoute === 'case-studies')}
            >
              Case Studies
            </button>

            <button
              onClick={() => handleNav('about')}
              className={simpleNavItemClass(currentRoute === 'about')}
            >
              About
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={simpleNavItemClass(currentRoute === 'contact')}
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Primary Book Consultation CTA */}
            <button
              id="header-book-consultation-btn"
              onClick={() => onOpenBooking()}
              style={{
                backgroundColor: 'var(--color-button-background, #7c3aed)',
                color: 'var(--color-button-text, #ffffff)',
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm shadow-md shadow-purple-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{siteSettings?.pageContent?.home?.ctaPrimaryText || 'Book Free Consultation'}</span>
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
            </button>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={
                isHeroOverlay
                  ? 'lg:hidden p-2.5 rounded-xl border border-white/30 text-white bg-white/10 hover:bg-white/20 cursor-pointer'
                  : 'lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer'
              }
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-sm flex flex-col">
          <div className="bg-slate-900 text-white w-full max-h-screen overflow-y-auto p-6 pb-20 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-medium text-sm">
                  LYI
                </div>
                <div>
                  <span className="font-medium text-base block font-heading">{siteSettings?.companyName || 'LockYourIdea Tech'}</span>
                  <span className="text-[11px] text-cyan-400 font-normal">{siteSettings?.hqAddress || 'HQ: Pune, Maharashtra'}</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <button
                onClick={() => handleNav('home')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-200"
              >
                Home
              </button>

              {/* AI Hub Mobile Accordion */}
              <div>
                <button
                  onClick={() => setMobileAiOpen(!mobileAiOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-400" /> AI Hub
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileAiOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileAiOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-3 bg-slate-950/50 rounded-xl my-1">
                    {/* Part 1 */}
                    <div>
                      <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider block mb-1">
                        LYI Services
                      </span>
                      {servicesList.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleNav('service-detail', s.slug)}
                          className="block w-full text-left py-1 text-xs text-slate-400 hover:text-white"
                        >
                          • {s.title}
                        </button>
                      ))}
                    </div>
                    {/* Part 2 */}
                    <div>
                      <span className="text-[10px] font-medium text-cyan-400 uppercase tracking-wider block mb-1">
                        LYI Products
                      </span>
                      {productsList.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleNav('service-detail', s.slug)}
                          className="block w-full text-left py-1 text-xs text-slate-400 hover:text-white"
                        >
                          • {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* IP Hub Mobile Accordion */}
              <div>
                <button
                  onClick={() => setMobileIpOpen(!mobileIpOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" /> IP Hub
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileIpOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileIpOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-950/50 rounded-xl my-1 max-h-[260px] overflow-y-auto custom-scrollbar">
                    {allIpServices.map((s) => (
                      <button
                        key={s.id || s.slug}
                        onClick={() => handleNav('service-detail', s.slug)}
                        className="block w-full text-left py-1 text-xs text-slate-400 hover:text-white"
                      >
                        • {s.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNav('portfolio')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-200"
              >
                Portfolio
              </button>
              <button
                onClick={() => handleNav('industries')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-200"
              >
                Industries
              </button>
              <button
                onClick={() => handleNav('case-studies')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-200"
              >
                Case Studies
              </button>
              <button
                onClick={() => handleNav('about')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-200"
              >
                About Us (HQ Pune)
              </button>
              <button
                onClick={() => handleNav('contact')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-slate-200"
              >
                Contact
              </button>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3 px-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  Book Free Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
