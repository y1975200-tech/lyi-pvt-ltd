import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Target, Compass, Sparkles, Award, MapPin, Building, ShieldCheck, Users } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

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

  const badgeText = pageData?.badge || 'ABOUT LOCKYOURIDEA TECH · BANER, PUNE';
  const headline =
    pageData?.headline || "India's 360° AI & Intellectual Property Transformation Company";
  const subheadline =
    pageData?.subheadline ||
    'LockYourIdea Tech helps businesses, startups, enterprises, educational institutions, and governments accelerate growth through Artificial Intelligence, Business Automation, and rigorous Intellectual Property Protection.';

  const timeline = [
    {
      num: '01',
      title: 'Founded in Pune with a Dual Mandate',
      desc: 'LockYourIdea Tech was founded in Baner, Pune to bridge the gap between building software and legally defending proprietary intellectual property.',
    },
    {
      num: '02',
      title: 'IP Hub Scale-Up',
      desc: 'Built out end-to-end patent drafting, search, prosecution, and international PCT filing practices with registered patent attorneys.',
    },
    {
      num: '03',
      title: 'AI Hub Launch',
      desc: 'Expanded into production AI engineering — building custom models, Agentic CRM architectures, and enterprise business automation suites.',
    },
    {
      num: '04',
      title: 'Government Capacity Programs',
      desc: 'Selected by state municipal and urban development departments to conduct executive AI capacity building programs.',
    },
    {
      num: '05',
      title: 'Unified 360° Platform',
      desc: 'Serving 50+ enterprise and institutional clients with synchronized innovation development and balance-sheet IP asset defense from our Pune headquarters.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH RELEVANT BACKGROUND IMAGE */}
      <section className="relative overflow-hidden py-20 md:py-24 border-b border-slate-800 text-white min-h-[400px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            key={bgImage}
            src={bgImage}
            alt="About LockYourIdea Tech Pune"
            className="w-full h-full object-cover object-center filter saturate-150"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-[#0b1d3a]/75 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
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
              className="text-4xl sm:text-5xl font-normal text-white tracking-tight font-heading leading-tight drop-shadow-sm"
            >
              {headline}
            </h1>

            <p
              style={applyFieldStyle(pageData?.subheadline_style)}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal"
            >
              {subheadline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-normal">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Headquarters: Baner, Pune, Maharashtra (Sole Office Location)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Specialists, Engineers &amp; Attorneys Under One Roof</span>
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
              OUR MILESTONES
            </span>
            <h2 className="text-3xl font-normal text-slate-900 tracking-tight font-heading">
              Our Journey of Innovation &amp; IP Protection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                HEADQUARTERS &amp; LABS
              </span>
              <h3 className="text-2xl md:text-3xl font-normal text-white font-heading">
                Exclusively Located in Pune, Maharashtra
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                All engineering architecture, machine learning model fine-tuning, Agentic CRM development, and patent prosecution workflows are conducted directly from our unified headquarters in Baner, Pune. We welcome clients for in-person strategy sessions and live technical demonstrations.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-normal">
                <div className="flex items-center gap-2 text-cyan-300">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Baner, Pune, Maharashtra 411045, India</span>
                </div>
                <button
                  onClick={() => onOpenBooking('In-Person HQ Consultation')}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Book In-Person Pune Slot
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
