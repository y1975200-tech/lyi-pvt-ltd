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
      <section className="py-16 bg-slate-950 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CASE_STUDIES.map((c, i) => {
              const isAi = c.division === 'AI Hub';
              return (
                <div
                  key={i}
                  className="card-ai-tech p-8 flex flex-col justify-between group"
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium font-heading border ${
                          isAi
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                        }`}
                      >
                        {c.division}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{c.client}</span>
                    </div>

                    <h3 className="text-xl font-medium text-white leading-snug font-heading group-hover:text-cyan-300 transition-colors">
                      {c.title}
                    </h3>

                    <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
                        <span className="text-white block font-medium mb-1">The Challenge:</span>
                        <span className="text-slate-300">{c.challenge}</span>
                      </div>
                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
                        <span className="text-white block font-medium mb-1">The Solution:</span>
                        <span className="text-slate-300">{c.solution}</span>
                      </div>
                    </div>

                    {/* Results Metrics */}
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                      <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider block mb-1 font-heading">
                        Measured Client Outcomes:
                      </span>
                      <div className="flex items-start gap-2 text-xs font-normal text-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{c.result}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                    <button
                      onClick={() => onOpenBooking(c.title)}
                      className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Request Scope Like This</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-500 font-mono">Pune HQ Delivery</span>
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
