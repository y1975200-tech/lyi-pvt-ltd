import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Target, Compass, Sparkles, Award, MapPin, Building, ShieldCheck, Users } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';
import { ImageWithEffects } from '../components/ImageWithEffects.tsx';

interface AboutPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  const pageData = siteSettings?.pageContent?.about;

  const bgImage =
    pageData?.bgImage ||
    siteSettings?.aboutBgImage ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80';

  const badgeText = pageData?.badge || 'ABOUT LOCKYOURIDEA TECH PUNE';
  const headline =
    pageData?.headline || 'Bridging the Gap Between Engineering & Intellectual Property';
  const subheadline =
    pageData?.subheadline ||
    'LockYourIdea Tech was founded in Pune with a single conviction: the companies that build groundbreaking software must also legally own and protect it from day one.';

  const hqTagline = pageData?.hqTagline || 'Headquarters: Baner, Pune, Maharashtra (Sole Office Location)';
  const teamTagline = pageData?.teamTagline || 'Specialists, Engineers & Attorneys Under One Roof';
  const milestonesHeader = pageData?.milestonesHeader || 'OUR MILESTONES';
  const milestonesSubhead = pageData?.milestonesSubhead || 'Our Journey of Innovation & IP Protection';

  const hqBadge = pageData?.hqBadge || 'HEADQUARTERS & LABS';
  const hqHeadline = pageData?.hqHeadline || 'Exclusively Located in Pune, Maharashtra';
  const hqDesc = pageData?.hqDesc || 'All engineering architecture, machine learning model fine-tuning, Agentic CRM development, and patent prosecution workflows are conducted directly from our unified headquarters in Baner, Pune. We welcome clients for in-person strategy sessions and live technical demonstrations.';
  const hqAddress = pageData?.hqAddress || siteSettings?.address || 'Baner, Pune, Maharashtra 411045, India';
  const hqCtaText = pageData?.hqCtaText || 'Book In-Person Pune Slot';

  const timeline = [
    {
      num: '01',
      title: pageData?.milestone1Title || 'Founded in Pune with a Dual Mandate',
      desc: pageData?.milestone1Desc || 'LockYourIdea Tech was founded in Baner, Pune to bridge the gap between building software and legally defending proprietary intellectual property.',
    },
    {
      num: '02',
      title: pageData?.milestone2Title || 'IP Hub Scale-Up',
      desc: pageData?.milestone2Desc || 'Built out end-to-end patent drafting, search, prosecution, and international PCT filing practices with registered patent attorneys.',
    },
    {
      num: '03',
      title: pageData?.milestone3Title || 'AI Hub Launch',
      desc: pageData?.milestone3Desc || 'Expanded into production AI engineering — building custom models, Agentic CRM architectures, and enterprise business automation suites.',
    },
    {
      num: '04',
      title: pageData?.milestone4Title || 'Government Capacity Programs',
      desc: pageData?.milestone4Desc || 'Selected by state municipal and urban development departments to conduct executive AI capacity building programs.',
    },
    {
      num: '05',
      title: pageData?.milestone5Title || 'Unified 360° Platform',
      desc: pageData?.milestone5Desc || 'Serving 50+ enterprise and institutional clients with synchronized innovation development and balance-sheet IP asset defense from our Pune headquarters.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH RELEVANT BACKGROUND IMAGE */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 border-b border-slate-800 text-white min-h-[380px] sm:min-h-[420px] lg:min-h-[440px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ImageWithEffects
            key={bgImage}
            src={bgImage}
            alt="About LockYourIdea Tech Pune"
            isStandalone={true}
            className="w-full h-full object-cover object-center"
            containerClassName="relative w-full h-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80';
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
              <span className="text-white font-medium">About</span>
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
              className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight font-heading leading-tight drop-shadow-sm"
            >
              {headline}
            </h1>

            <p
              style={applyFieldStyle(pageData?.subheadline_style)}
              className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal"
            >
              {subheadline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-normal">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{hqTagline}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{teamTagline}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-normal text-slate-900 font-heading">Our Vision</h3>
              <p
                style={applyFieldStyle(pageData?.visionText_style)}
                className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal"
              >
                {pageData?.visionText || "To be India's most trusted partner for organizations that need to build with cutting-edge AI and protect what they build — treated as one continuous journey, not two fragmented vendors."}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-medium">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-normal text-slate-900 font-heading">Our Mission</h3>
              <p
                style={applyFieldStyle(pageData?.missionText_style)}
                className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal"
              >
                {pageData?.missionText || "To equip Indian enterprise, startups, and public bodies with production-grade AI systems while securing defensible, high-value patent and trademark registrations from our central Pune base."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-medium uppercase tracking-widest text-blue-600 block mb-1 font-heading">
              {milestonesHeader}
            </span>
            <h2 className="text-3xl font-normal text-slate-900 tracking-tight font-heading">
              {milestonesSubhead}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {timeline.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <span className="text-2xl font-normal text-blue-600/40 block mb-2 font-mono">
                    {t.num}
                  </span>
                  <h4 className="text-sm font-medium text-slate-900 mb-2 font-heading">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pune HQ Spotlight Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden border border-slate-800">
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest font-heading">
                {hqBadge}
              </span>
              <h3 className="text-2xl md:text-3xl font-normal text-white font-heading">
                {hqHeadline}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                {hqDesc}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-normal">
                <div className="flex items-center gap-2 text-cyan-300">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{hqAddress}</span>
                </div>
                <button
                  onClick={() => onOpenBooking('In-Person HQ Consultation')}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {hqCtaText}
                </button>
              </div>
            </div>
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
