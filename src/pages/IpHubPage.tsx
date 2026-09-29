import React from 'react';
import { PageRoute, SiteSettings, BookingData, ServiceItem } from '../types.ts';
import { IP_SERVICES } from '../data/services.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Shield, ArrowRight } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';
import { ImageWithEffects } from '../components/ImageWithEffects.tsx';

interface IpHubPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const IpHubPage: React.FC<IpHubPageProps> = ({
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  const pageData = siteSettings?.pageContent?.['ip-hub'];

  const bgImage =
    pageData?.bgImage ||
    siteSettings?.ipHubBgImage ||
    siteSettings?.heroBgImage ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';

  const badgeText = pageData?.badge || 'End-to-End Intellectual Property Services';
  const headline = pageData?.headline || 'Protecting Innovation from Idea to Intellectual Property';
  const subheadline =
    pageData?.subheadline ||
    'Patent filing, trademark registration, copyright, industrial design protection, IP strategy, and commercialization — managed by seasoned patent agents and IP attorneys.';

  // Prefer dynamic admin-managed services from siteSettings, fallback to IP_SERVICES
  const dynamicIp = siteSettings?.services && siteSettings.services.length > 0
    ? siteSettings.services.filter((s: ServiceItem) => s.division === 'IP Hub')
    : [];
  const servicesToRender = dynamicIp.length > 0 ? dynamicIp : IP_SERVICES;

  const extraHeading = pageData?.extraHeading1 || `${servicesToRender.length} Dedicated Service Lines`;
  const extraText =
    pageData?.extraText1 ||
    'Full-lifecycle IP defense across India, USPTO, EPO, and WIPO treaties.';
  const ctaBtnText = pageData?.ctaBtnText || 'Book Free IP Consultation';

  return (
    <div className="space-y-0">
      {/* Hero with dynamic background image and homepage theme styling */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-800 text-white min-h-[460px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ImageWithEffects
            key={bgImage}
            src={bgImage}
            alt="IP Hub"
            className="w-full h-full object-cover object-center"
            containerClassName="relative w-full h-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4">
            <nav className="text-xs text-slate-400 flex items-center gap-2">
              <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 cursor-pointer">Home</button>
              <span>/</span>
              <span className="text-white font-medium">IP Hub</span>
            </nav>

            <span
              style={applyFieldStyle(pageData?.badge_style)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-medium text-xs backdrop-blur-md"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> {badgeText}
            </span>

            <h1
              style={applyFieldStyle(pageData?.headline_style)}
              className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight font-heading drop-shadow-sm"
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
                onClick={() => onOpenBooking('Patent Filing & Prosecution')}
                style={applyFieldStyle(pageData?.ctaBtnText_style)}
                className="px-7 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
              >
                {ctaBtnText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Service Lines */}
      <section className="py-20 bg-slate-950 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2 block">
              IP SERVICES
            </span>
            <h2
              style={applyFieldStyle(pageData?.extraHeading1_style, { color: 'var(--color-heading, #ffffff)' })}
              className="text-3xl font-normal text-white tracking-tight font-heading"
            >
              {extraHeading}
            </h2>
            <p
              style={applyFieldStyle(pageData?.extraText1_style, { color: 'var(--color-muted-text, #94a3b8)' })}
              className="text-xs sm:text-sm text-slate-400 mt-1 font-normal"
            >
              {extraText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesToRender.map((s) => (
              <div
                key={s.id}
                className="card-ip-tech p-7 flex flex-col justify-between group"
              >
                <div className="space-y-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-md shadow-cyan-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3
                    className="text-lg font-medium text-white group-hover:text-cyan-300 transition-colors font-heading"
                    style={applyFieldStyle(s.title_style, { color: 'var(--color-heading, #ffffff)' })}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal"
                    style={applyFieldStyle(s.shortDesc_style, { color: 'var(--color-body-text, #cbd5e1)' })}
                  >
                    {s.shortDesc}
                  </p>
                </div>

                <div className="pt-6 mt-5 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                  <button
                    onClick={() => onNavigate('service-detail', s.slug)}
                    className="text-xs font-medium text-cyan-400 group-hover:text-cyan-300 group-hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenBooking(s.title)}
                    className="text-[11px] font-medium text-cyan-200 hover:text-slate-950 px-3 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-400 border border-cyan-400/40 shadow-sm cursor-pointer transition-all"
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
            defaultService="Patent Filing & Prosecution"
            onBookingSuccess={onBookingSuccess}
            onViewEmailPreview={onViewEmailPreview}
            siteSettings={siteSettings}
          />
        </div>
      </section>
    </div>
  );
};
