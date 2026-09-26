import React from 'react';
import { PageRoute, SiteSettings, BookingData, ServiceItem } from '../types.ts';
import { AI_SERVICES } from '../data/services.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Cpu, ArrowRight } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

interface AiHubPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const AiHubPage: React.FC<AiHubPageProps> = ({
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  const pageData = siteSettings?.pageContent?.['ai-hub'];

  const bgImage =
    pageData?.bgImage ||
    siteSettings?.aiHubBgImage ||
    siteSettings?.heroBgImage ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';

  const badgeText = pageData?.badge || '360° Artificial Intelligence Solutions';
  const headline = pageData?.headline || 'Transforming Organizations with Artificial Intelligence';
  const subheadline =
    pageData?.subheadline ||
    'Custom AI software, business automation, agentic CRM, corporate training, and government capacity building — delivered end to end with enterprise engineering precision.';

  // Prefer dynamic admin-managed services from siteSettings, fallback to AI_SERVICES
  const dynamicAi = siteSettings?.services && siteSettings.services.length > 0
    ? siteSettings.services.filter((s: ServiceItem) => s.division === 'AI Hub')
    : [];
  const servicesToRender = dynamicAi.length > 0 ? dynamicAi : AI_SERVICES;

  const extraHeading = pageData?.extraHeading1 || `${servicesToRender.length} Dedicated AI Solutions & Products`;
  const extraText =
    pageData?.extraText1 ||
    'Select any service to review technical scope, implementation steps, and FAQs.';
  const ctaBtnText = pageData?.ctaBtnText || 'Book Free AI Consultation';

  return (
    <div className="space-y-0">
      {/* Hero with dynamic background image and homepage theme styling */}
      <section className="relative overflow-hidden py-20 sm:py-24 border-b border-slate-800 text-white min-h-[460px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            key={bgImage}
            src={bgImage}
            alt="AI Hub"
            className="w-full h-full object-cover object-center filter saturate-150"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-[#0e2246]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4">
            <nav className="text-xs text-slate-400 flex items-center gap-2">
              <button onClick={() => onNavigate('home')} className="hover:text-blue-400 cursor-pointer">Home</button>
              <span>/</span>
              <span className="text-white font-medium">AI Hub</span>
            </nav>

            <span
              style={applyFieldStyle(pageData?.badge_style)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-medium text-xs backdrop-blur-md"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> {badgeText}
            </span>

            <h1
              style={applyFieldStyle(pageData?.headline_style)}
              className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight font-heading drop-shadow-sm"
            >
              {headline}
            </h1>

            <p
              style={applyFieldStyle(pageData?.subheadline_style)}
              className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
            >
              {subheadline}
            </p>

            <div className="pt-3">
              <button
                onClick={() => onOpenBooking('Custom AI Solutions')}
                style={applyFieldStyle(pageData?.ctaBtnText_style)}
                className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xl shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                {ctaBtnText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Service Lines */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-medium uppercase tracking-widest text-blue-600 mb-2 block">
              AI SERVICES &amp; PRODUCTS
            </span>
            <h2
              style={applyFieldStyle(pageData?.extraHeading1_style, { color: 'var(--color-heading, #0f172a)' })}
              className="text-3xl font-normal text-slate-900 tracking-tight font-heading"
            >
              {extraHeading}
            </h2>
            <p
              style={applyFieldStyle(pageData?.extraText1_style, { color: 'var(--color-muted-text, #64748b)' })}
              className="text-xs sm:text-sm text-slate-500 mt-1 font-normal"
            >
              {extraText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesToRender.map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-medium shadow-sm">
                      <Cpu className="w-5 h-5" />
                    </div>
                    {s.subCategory && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {s.subCategory}
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors font-heading"
                    style={applyFieldStyle(s.title_style, { color: 'var(--color-heading, #0f172a)' })}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-xs text-slate-600 leading-relaxed font-normal"
                    style={applyFieldStyle(s.shortDesc_style, { color: 'var(--color-body-text, #475569)' })}
                  >
                    {s.shortDesc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('service-detail', s.slug)}
                    className="text-xs font-medium text-blue-600 group-hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenBooking(s.title)}
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 cursor-pointer"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Embed */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnquiryBookingSection
            defaultService="Custom AI Solutions"
            onBookingSuccess={onBookingSuccess}
            onViewEmailPreview={onViewEmailPreview}
            siteSettings={siteSettings}
          />
        </div>
      </section>
    </div>
  );
};
