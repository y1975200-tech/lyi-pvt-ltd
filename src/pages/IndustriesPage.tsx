import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { INDUSTRIES_LIST } from '../data/generalData.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Building2, ArrowRight, ShieldCheck, Cpu, MapPin } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';
import { ImageWithEffects } from '../components/ImageWithEffects.tsx';

interface IndustriesPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  const pageData = siteSettings?.pageContent?.industries;

  const bgImage =
    pageData?.bgImage ||
    siteSettings?.industriesBgImage ||
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80';

  const headline = pageData?.headline || 'Industries We Serve';
  const subheadline =
    pageData?.subheadline ||
    'Tailored AI transformation workflows and intellectual property legal strategies designed specifically for sector regulatory realities.';
  const badge = pageData?.badge || 'SECTOR EXPERTISE';

  const industriesList =
    siteSettings?.industries && siteSettings.industries.length > 0
      ? siteSettings.industries
      : INDUSTRIES_LIST;

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH RELEVANT BACKGROUND IMAGE */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-800 text-white min-h-[380px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ImageWithEffects
            src={bgImage}
            alt="Sector Expertise & Industry AI Transformation"
            className="w-full h-full object-cover object-center"
            containerClassName="relative w-full h-full"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4">
            <nav className="text-xs text-slate-300 flex items-center gap-2">
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-white font-medium">Industries</span>
            </nav>

            <div
              style={applyFieldStyle(pageData?.badge_style)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium tracking-widest text-cyan-300 font-heading backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{badge}</span>
            </div>

            <h1
              style={applyFieldStyle(pageData?.headline_style, { color: 'var(--color-heading, #ffffff)' })}
              className="text-2xl xs:text-3xl sm:text-5xl font-normal text-white tracking-tight font-heading leading-tight drop-shadow-sm"
            >
              {headline}
            </h1>

            <p
              style={applyFieldStyle(pageData?.subheadline_style, { color: 'var(--color-body-text, #cbd5e1)' })}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal"
            >
              {subheadline}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 font-normal">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Engineered from HQ: Pune, Maharashtra</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Regulatory Compliance</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Industries Cards */}
      <section className="py-16 bg-slate-950 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industriesList.map((ind, i) => (
              <div
                key={i}
                className="card-ai-tech p-7 flex flex-col justify-between group"
              >
                <div className="space-y-4 text-xs relative z-10">
                  <div className="flex items-center gap-3 text-cyan-400 font-medium">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-md shadow-blue-500/20">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span
                      style={applyFieldStyle(ind.name_style, { color: 'var(--color-heading, #ffffff)' })}
                      className="text-base font-medium text-white font-heading"
                    >
                      {ind.name}
                    </span>
                  </div>

                  <div className="p-3.5 bg-rose-950/30 rounded-2xl border border-rose-500/25">
                    <strong className="text-rose-400 block text-[11px] mb-1 font-semibold uppercase tracking-wider">
                      Core Challenge:
                    </strong>
                    <span className="text-slate-300 leading-relaxed font-normal">{ind.challenge}</span>
                  </div>

                  <div className="p-3.5 bg-blue-950/30 rounded-2xl border border-blue-500/25">
                    <strong className="text-blue-400 block text-[11px] mb-1 font-semibold uppercase tracking-wider">
                      AI Transformation Solution:
                    </strong>
                    <span className="text-slate-300 leading-relaxed font-normal">{ind.aiSolution}</span>
                  </div>

                  <div className="p-3.5 bg-cyan-950/30 rounded-2xl border border-cyan-500/25">
                    <strong className="text-cyan-400 block text-[11px] mb-1 font-semibold uppercase tracking-wider">
                      IP Protection Strategy:
                    </strong>
                    <span className="text-slate-300 leading-relaxed font-normal">{ind.ipSolution}</span>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                  <button
                    onClick={() => onOpenBooking(ind.name + ' Scope & Audit')}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Request Scope Like This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">Pune HQ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Integration */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnquiryBookingSection
            onBookingSuccess={onBookingSuccess}
            onViewEmailPreview={onViewEmailPreview}
            siteSettings={siteSettings}
          />
        </div>
      </section>
    </div>
  );
};
