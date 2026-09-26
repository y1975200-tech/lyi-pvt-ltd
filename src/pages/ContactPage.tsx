import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, Building } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

interface ContactPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  const pageData = siteSettings?.pageContent?.contact;

  const bgImage =
    pageData?.bgImage ||
    siteSettings?.contactBgImage ||
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80';

  const badgeText = pageData?.badge || 'GET IN TOUCH · BANER, PUNE HQ';
  const headline = pageData?.headline || 'Start Your AI & IP Transformation';
  const subheadline =
    pageData?.subheadline ||
    'Connect directly with our engineering architects, patent attorneys, and enterprise delivery teams at our Pune headquarters.';

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH RELEVANT BACKGROUND IMAGE */}
      <section className="relative overflow-hidden py-20 md:py-24 border-b border-slate-800 text-white min-h-[380px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            key={bgImage}
            src={bgImage}
            alt="Contact LockYourIdea Tech Pune Office"
            className="w-full h-full object-cover object-center filter saturate-150"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80';
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
              <span className="text-white font-medium">Contact</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium tracking-widest text-cyan-300 font-heading">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span style={applyFieldStyle(pageData?.badge_style)}>{badgeText}</span>
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
                <span>Single Office Location: Baner, Pune, Maharashtra</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Online &amp; In-Person Consultations</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards & Office Location Details */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Prominent Pune Location Banner */}
          <div className="mb-10 p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-blue-700 block font-heading">
                  OFFICE LOCATION (EXCLUSIVE TO PUNE)
                </span>
                <h3 className="text-base font-normal text-slate-900 font-heading">
                  {siteSettings?.companyName || 'LockYourIdea Tech'} Corporate Headquarters
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-normal">
                  {siteSettings?.address || 'Baner, Pune, Maharashtra 411045, India'} · <span className="font-normal text-slate-800">Note: Our sole physical office and development labs are located exclusively in Pune.</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenBooking('In-Person HQ Consultation')}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
            >
              Book Pune In-Person Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">Direct Phone Desk</h3>
              <a href={`tel:${siteSettings?.phone || '+917558631355'}`} className="text-xs text-blue-600 font-medium hover:underline block">
                {siteSettings?.phone || '+91 75586 31355'}
              </a>
              <p className="text-[11px] text-slate-500">Dedicated desk at Pune headquarters</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-medium">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">WhatsApp Business</h3>
              <a
                href={`https://wa.me/${(siteSettings?.whatsappNumber || siteSettings?.phone || '917558631355').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 font-medium hover:underline block"
              >
                Chat on WhatsApp →
              </a>
              <p className="text-[11px] text-slate-500">Fast response within 15 minutes</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-medium">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">Official Email</h3>
              <a href={`mailto:${siteSettings?.contactEmail || 'support@lockyourideatech.com'}`} className="text-xs text-cyan-700 font-medium hover:underline block">
                {siteSettings?.contactEmail || 'support@lockyourideatech.com'}
              </a>
              <p className="text-[11px] text-slate-500">Proposals, NDAs &amp; RFPs</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-medium">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">Working Hours</h3>
              <p className="text-xs text-slate-800 font-normal">Mon – Sat: 9:30 AM – 7:00 PM IST</p>
              <p className="text-[11px] text-slate-500">Online consultations available 24/7</p>
            </div>
          </div>

          {/* Embedded Real-Time Scheduler */}
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
