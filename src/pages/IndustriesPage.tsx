import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { INDUSTRIES_LIST } from '../data/generalData.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Building2, ArrowRight, ShieldCheck, Cpu, MapPin } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

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
      {/* HERO SECTION WITH RELEVANT BACKGROUND IMAGE - High Contrast Black Text */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-200 text-slate-900 min-h-[380px] flex items-center">
        {/* Background Image Layer with light-protective overlay for black text */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Sector Expertise & Industry AI Transformation"
            className="w-full h-full object-cover object-center animate-slow-motion"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/75 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4">
            <nav className="text-xs text-slate-600 flex items-center gap-2">
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-blue-700 transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-slate-950 font-bold">Industries</span>
            </nav>

            <div
              style={applyFieldStyle(pageData?.badge_style)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-xs font-extrabold tracking-widest text-blue-900 font-heading"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>{badge}</span>
            </div>

            <h1
              style={applyFieldStyle(pageData?.headline_style)}
              className="text-2xl xs:text-3xl sm:text-5xl font-normal text-slate-950 tracking-tight font-heading leading-tight drop-shadow-xs"
            >
              {headline}
            </h1>

            <p
              style={applyFieldStyle(pageData?.subheadline_style)}
              className="text-slate-800 text-base sm:text-lg leading-relaxed font-normal"
            >
              {subheadline}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Engineered from HQ: Pune, Maharashtra</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full Regulatory Compliance</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Industries Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industriesList.map((ind, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 className="w-4.5 h-4.5" />
                    </div>
                    <span
                      style={applyFieldStyle(ind.name_style)}
                      className="text-base font-extrabold text-slate-900 font-heading"
                    >
                      {ind.name}
                    </span>
                  </div>

                  <div className="p-3 bg-red-50/70 rounded-xl border border-red-100">
                    <strong className="text-red-700 block text-[11px] mb-0.5 font-bold uppercase tracking-wider">
                      Core Challenge:
                    </strong>
                    <span className="text-slate-700 leading-relaxed">{ind.challenge}</span>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                    <strong className="text-blue-700 block text-[11px] mb-0.5 font-bold uppercase tracking-wider">
                      AI Transformation Solution:
                    </strong>
                    <span className="text-slate-700 leading-relaxed">{ind.aiSolution}</span>
                  </div>

                  <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-100">
                    <strong className="text-cyan-800 block text-[11px] mb-0.5 font-bold uppercase tracking-wider">
                      IP Protection Strategy:
                    </strong>
                    <span className="text-slate-700 leading-relaxed">{ind.ipSolution}</span>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <button
                    onClick={() => onOpenBooking(ind.name + ' Scope & Audit')}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Scope Like This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">Pune HQ</span>
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
