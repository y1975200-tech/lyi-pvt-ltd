import React, { useState } from 'react';
import { PageRoute, ServiceItem, BookingData, SiteSettings } from '../types.ts';
import { ALL_SERVICES } from '../data/services.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import {
  Cpu,
  Shield,
  ChevronDown,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';
import { ImageWithEffects } from '../components/ImageWithEffects.tsx';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: any;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  // 1. Dynamic lookup: prefer admin-saved services from siteSettings, fallback to ALL_SERVICES
  const dynamicServices: ServiceItem[] =
    siteSettings?.services && siteSettings.services.length > 0
      ? siteSettings.services
      : ALL_SERVICES;

  const service =
    dynamicServices.find((s) => s.slug === slug || s.id === slug) ||
    ALL_SERVICES.find((s) => s.slug === slug || s.id === slug) ||
    ALL_SERVICES[0];

  const isAi = service.division === 'AI Hub';

  const defaultBg = isAi
    ? (siteSettings?.aiHubBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85')
    : (siteSettings?.ipHubBgImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=2400&q=85');

  // 2. Determine background image & contrast mode
  const bgImg = service.bgImage || service.backgroundImageUrl || defaultBg;
  const overlayType = service.overlayType || 'dark';
  const overlayOpacity = service.overlayOpacity !== undefined ? service.overlayOpacity : 80;
  const textMode = service.textMode || 'auto';

  // Determine if hero is dark
  const isDarkHero =
    textMode === 'light' ||
    (textMode === 'auto' && Boolean(bgImg && (overlayType === 'dark' || overlayType === 'gradient')));

  // Headline styling attributes
  const headlineColor =
    service.headlineColor ||
    (isDarkHero ? '#ffffff' : 'var(--color-heading, #0f172a)');
  const ledeColor =
    service.ledeColor ||
    (isDarkHero ? '#e2e8f0' : 'var(--color-body-text, #334155)');

  const headlineWeight = service.headlineWeight
    ? `font-${service.headlineWeight}`
    : 'font-normal';
  const headlineItalic = service.headlineItalic ? 'italic' : '';
  const headlineUnderline = service.headlineUnderline ? 'underline underline-offset-4' : '';
  const headlineAlign = service.headlineAlign
    ? service.headlineAlign === 'center'
      ? 'text-center'
      : service.headlineAlign === 'right'
      ? 'text-right'
      : 'text-left'
    : 'text-left';

  const headlineSize = service.headlineSize || 'text-3xl sm:text-5xl';
  const ledeSize = service.ledeSize || 'text-base sm:text-lg';

  // Breadcrumbs & labels
  const breadcrumbCategory = service.breadcrumbText || service.categoryLabel || service.division;
  const ctaBtnText = service.ctaButtonText || 'Book Real-Time Consultation';

  // FAQ open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-0">
      {/* SERVICE HERO */}
      <section
        className={`relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b transition-colors duration-200 ${
          isDarkHero
            ? 'border-slate-800 text-white min-h-[440px] flex items-center bg-slate-950'
            : isAi
            ? 'border-slate-200 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 text-slate-900'
            : 'border-slate-200 bg-gradient-to-br from-cyan-50/70 via-white to-slate-50 text-slate-900'
        }`}
      >
        {/* Dynamic Background Image Layer */}
        {bgImg && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <ImageWithEffects
              src={bgImg}
              alt={service.title}
              isStandalone={true}
              className="w-full h-full object-cover object-center"
              containerClassName="relative w-full h-full"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';
              }}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className={`max-w-3xl space-y-4 ${headlineAlign === 'text-center' ? 'mx-auto' : ''}`}>
            {/* Breadcrumb Navigation */}
            <nav
              className={`text-xs flex items-center gap-2 ${
                isDarkHero ? 'text-slate-300' : 'text-slate-500'
              } ${headlineAlign === 'text-center' ? 'justify-center' : ''}`}
            >
              <button
                onClick={() => onNavigate('home')}
                className={`hover:underline cursor-pointer ${
                  isDarkHero ? 'hover:text-white' : 'hover:text-blue-600'
                }`}
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => onNavigate(isAi ? 'ai-hub' : 'ip-hub')}
                className={`hover:underline cursor-pointer ${
                  isDarkHero ? 'hover:text-white' : 'hover:text-blue-600'
                }`}
              >
                {breadcrumbCategory}
              </button>
              <span>/</span>
              <span className={isDarkHero ? 'text-white font-medium' : 'text-slate-900 font-medium'}>
                {service.title}
              </span>
            </nav>

            {/* Division & Practice Badge */}
            <div className={headlineAlign === 'text-center' ? 'flex justify-center' : ''}>
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                  isDarkHero
                    ? 'bg-white/10 text-cyan-300 border border-white/20'
                    : isAi
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-cyan-100 text-cyan-800'
                }`}
              >
                {isAi ? <Cpu className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                <span>{service.division} · Core Practice</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{ color: headlineColor, ...applyFieldStyle(service.heroHeadline_style) }}
              className={`${headlineSize} ${headlineWeight} ${headlineAlign} ${headlineItalic} ${headlineUnderline} tracking-tight leading-tight font-heading drop-shadow-sm`}
            >
              {service.heroHeadline}
            </h1>

            {/* Subhead / Lede */}
            <p
              style={{ color: ledeColor, ...applyFieldStyle(service.heroLede_style) }}
              className={`${ledeSize} ${headlineAlign} leading-relaxed font-normal`}
            >
              {service.heroLede}
            </p>

            {/* CTAs */}
            <div
              className={`pt-2 flex flex-wrap items-center gap-3 ${
                headlineAlign === 'text-center' ? 'justify-center' : ''
              }`}
            >
              {service.ctaButtonLink && service.ctaButtonLink.startsWith('http') ? (
                <a
                  href={service.ctaButtonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-7 py-3 rounded-full text-white font-medium text-xs shadow-lg flex items-center gap-2 cursor-pointer ${
                    isAi
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20'
                  }`}
                >
                  <span>{ctaBtnText}</span>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                </a>
              ) : (
                <button
                  onClick={() => onOpenBooking(service.title)}
                  className={`px-7 py-3 rounded-full text-white font-medium text-xs shadow-lg flex items-center gap-2 cursor-pointer ${
                    isAi
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20'
                  }`}
                >
                  <span>{ctaBtnText}</span>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                </button>
              )}

              <button
                onClick={() => {
                  const el = document.getElementById('faqs');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-5 py-3 rounded-full font-medium text-xs cursor-pointer transition-colors ${
                  isDarkHero
                    ? 'border border-white/30 text-white hover:bg-white/10'
                    : 'border border-slate-300 hover:bg-white text-slate-700'
                }`}
              >
                View FAQs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RICH TEXT CONTENT (IF ADMIN CONFIGURED) */}
      {service.richTextContent && service.richTextContent.trim().length > 0 && (
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 font-heading">
                <FileText className="w-4 h-4" />
                <span>Executive Overview &amp; Specifications</span>
              </div>
              <div
                className="text-sm text-slate-700 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: service.richTextContent }}
              />
            </div>
          </div>
        </section>
      )}

      {/* PROBLEM & SOLUTION DUAL SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <span className="text-xs font-medium uppercase tracking-widest text-red-600 block">
                THE CHALLENGES WE SOLVE
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight font-heading">
                Friction Points &amp; Operational Vulnerabilities
              </h2>
              <ul className="space-y-3 pt-2 text-sm text-slate-700 font-normal">
                {service.problemPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 bg-red-50/60 p-3 rounded-xl border border-red-100">
                    <span className="text-red-500 font-medium">✕</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <span className={`text-xs font-medium uppercase tracking-widest block ${isAi ? 'text-blue-600' : 'text-cyan-600'}`}>
                OUR METHODOLOGY
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight font-heading">
                Engineered for Predictable Delivery
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {service.solutionText}
              </p>

              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-medium text-slate-500 block mb-2">Primary Sectors:</span>
                <div className="flex flex-wrap gap-2">
                  {service.industries.map((ind, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-normal text-slate-700">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / WHAT IS INCLUDED */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className={`text-xs font-medium uppercase tracking-widest block mb-2 ${isAi ? 'text-blue-600' : 'text-cyan-600'}`}>
              SCOPE OF WORK
            </span>
            <h2 className="text-3xl font-normal text-slate-900 tracking-tight font-heading">
              What Is Included
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-medium flex items-center justify-center text-xs">
                  0{i + 1}
                </div>
                <h3 className="text-base font-medium text-slate-900 font-heading">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className={`text-xs font-medium uppercase tracking-widest block mb-2 ${isAi ? 'text-blue-600' : 'text-cyan-600'}`}>
              EXECUTION PROCESS
            </span>
            <h2 className="text-3xl font-normal text-slate-900 tracking-tight font-heading">
              How Implementation Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {service.processSteps.map((step, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-2xl font-normal text-blue-600 font-mono block">
                  {step.step}
                </span>
                <h4 className="font-medium text-slate-900 text-sm font-heading">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING & SCOPING PACKAGES */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-medium uppercase tracking-widest text-blue-600 mb-2 block">
              ENGAGEMENT MODELS
            </span>
            <h2 className="text-3xl font-normal text-slate-900 tracking-tight font-heading">
              Consultation &amp; Pricing
            </h2>
            <p className="text-xs text-slate-500 mt-2 font-normal">
              Every project begins with a 30-minute scoping call to map out technical architecture, legal claims, and milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between text-center">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Discovery</span>
                <h3 className="text-xl font-normal text-slate-900 mt-2 mb-3 font-heading">Free Consultation</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  30-minute scoping call with an architect or attorney to assess feasibility and roadmap.
                </p>
              </div>
              <button
                onClick={() => onOpenBooking(service.title)}
                className="mt-6 w-full py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-900 font-medium text-xs cursor-pointer"
              >
                Book 30-Min Slot
              </button>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between text-center relative -translate-y-2">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-medium uppercase tracking-wider rounded-full shadow">
                Recommended
              </span>
              <div>
                <span className="text-xs font-medium text-cyan-400 uppercase tracking-wide">Custom Project</span>
                <h3 className="text-xl font-normal text-white mt-2 mb-3 font-heading">Custom Proposal</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Detailed technical specification, milestones, SLA guarantees, and transparent fee schedule.
                </p>
              </div>
              <button
                onClick={() => onOpenBooking(service.title)}
                className="mt-6 w-full py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium text-xs shadow cursor-pointer"
              >
                Request Proposal
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between text-center">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Institutional</span>
                <h3 className="text-xl font-normal text-slate-900 mt-2 mb-3 font-heading">Enterprise / Government</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Dedicated squad, on-premise infrastructure, custom security audits, and formal public tender RFP support.
                </p>
              </div>
              <button
                onClick={() => onOpenBooking(service.title)}
                className="mt-6 w-full py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-900 font-medium text-xs cursor-pointer"
              >
                Talk to Enterprise Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS ACCORDION */}
      <section className="py-20 bg-white border-t border-slate-200" id="faqs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className={`text-xs font-medium uppercase tracking-widest block mb-2 ${isAi ? 'text-blue-600' : 'text-cyan-600'}`}>
              FAQS
            </span>
            <h2 className="text-3xl font-normal text-slate-900 tracking-tight font-heading">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="border-t border-slate-200 divide-y divide-slate-200">
            {service.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left flex items-center justify-between gap-4 font-medium text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-3 pr-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REAL-TIME BOOKING INLINE COMPONENT */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnquiryBookingSection
            defaultService={service.title}
            onBookingSuccess={onBookingSuccess}
            onViewEmailPreview={onViewEmailPreview}
            siteSettings={siteSettings}
          />
        </div>
      </section>
    </div>
  );
};
