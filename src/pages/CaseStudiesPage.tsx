import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { CASE_STUDIES } from '../data/generalData.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { CheckCircle2, ArrowRight, BarChart3, ShieldCheck, MapPin } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';
import { ImageWithEffects } from '../components/ImageWithEffects.tsx';

interface CaseStudiesPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  const pageData = siteSettings?.pageContent?.['case-studies'];

  const bgImage =
    pageData?.bgImage ||
    siteSettings?.caseStudiesBgImage ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80';

  const badgeText = pageData?.badge || 'RESULTS & CLIENT OUTCOMES';
  const headline = pageData?.headline || 'Real Client Outcomes';
  const subheadline =
    pageData?.subheadline ||
    'Detailed technical and legal audits documenting measured efficiency gains, operational cost reductions, and secured intellectual property defenses.';

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH RELEVANT BACKGROUND IMAGE */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-800 text-white min-h-[380px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ImageWithEffects
            key={bgImage}
            src={bgImage}
            alt="Real Client Outcomes & Case Studies"
            isStandalone={true}
            className="w-full h-full object-cover object-center"
            containerClassName="relative w-full h-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80';
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4">
            <nav className="text-xs text-slate-400 flex items-center gap-2">
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-white font-medium">Case Studies</span>
            </nav>

            <div
              style={applyFieldStyle(pageData?.badge_style)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium tracking-widest text-cyan-300 font-heading"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{badgeText}</span>
            </div>

            <h1
              style={applyFieldStyle(pageData?.headline_style)}
              className="text-2xl xs:text-3xl sm:text-5xl font-normal text-white tracking-tight font-heading leading-tight drop-shadow-sm"
            >
              {headline}
            </h1>

            <p
              style={applyFieldStyle(pageData?.subheadline_style)}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal"
            >
              {subheadline}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 font-normal">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audited Deployments from Pune HQ</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quantified ROI &amp; Granted IP</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Case Studies Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CASE_STUDIES.map((c, i) => {
              const isAi = c.division === 'AI Hub';
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 p-8 bg-slate-50/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium font-heading ${
                          isAi ? 'bg-blue-100 text-blue-700' : 'bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {c.division}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{c.client}</span>
                    </div>

                    <h3 className="text-xl font-medium text-slate-900 leading-snug font-heading group-hover:text-blue-600 transition-colors">
                      {c.title}
                    </h3>

                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-900 block font-medium mb-0.5">The Challenge:</span>
                        <span>{c.challenge}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-900 block font-medium mb-0.5">The Solution:</span>
                        <span>{c.solution}</span>
                      </div>
                    </div>

                    {/* Results Metrics */}
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                      <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider block mb-1 font-heading">
                        Measured Client Outcomes:
                      </span>
                      <div className="flex items-start gap-2 text-xs font-normal text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{c.result}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      onClick={() => onOpenBooking(c.title)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Request Scope Like This</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-400 font-mono">Pune HQ Delivery</span>
                  </div>
                </div>
              );
            })}
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
