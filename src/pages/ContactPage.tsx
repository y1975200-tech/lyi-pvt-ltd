import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, Building } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';
import { ImageWithEffects } from '../components/ImageWithEffects.tsx';
import { getImageEffects } from '../utils/imageEffectsHelper.ts';

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

  const badgeText = pageData?.badge || 'GET IN TOUCH WITH OUR SPECIALISTS';
  const headline = pageData?.headline || 'Start Your AI & IP Transformation';
  const subheadline =
    pageData?.subheadline ||
    'Schedule a confidential consultation at our Pune headquarters or via Google Meet. NDA executed upon request prior to discussion.';
  const locationBadge1 = pageData?.locationBadge1 || 'Single Office Location: Baner, Pune, Maharashtra';
  const locationBadge2 = pageData?.locationBadge2 || 'Online & In-Person Consultations';

  const officeBadge = pageData?.officeBadge || 'OFFICE LOCATION (EXCLUSIVE TO PUNE)';
  const officeHeadline = pageData?.officeHeadline || `${siteSettings?.companyName || 'LockYourIdea Tech'} Corporate Headquarters`;
  const officeAddress = pageData?.officeAddress || siteSettings?.address || 'Baner, Pune, Maharashtra 411045, India';
  const officeNote = pageData?.officeNote || 'Note: Our sole physical office and development labs are located exclusively in Pune.';
  const officeCtaText = pageData?.officeCtaText || 'Book Pune In-Person Slot';

  const phoneTitle = pageData?.phoneTitle || 'Direct Phone Desk';
  const phone = pageData?.phone || siteSettings?.phone || '+91 75586 31355';
  const phoneNote = pageData?.phoneNote || 'Dedicated desk at Pune headquarters';

  const whatsappTitle = pageData?.whatsappTitle || 'WhatsApp Business';
  const whatsappText = pageData?.whatsappText || 'Chat on WhatsApp →';
  const whatsappNote = pageData?.whatsappNote || 'Fast response within 15 minutes';

  const emailTitle = pageData?.emailTitle || 'Official Email';
  const contactEmail = pageData?.contactEmail || siteSettings?.contactEmail || 'support@lockyourideatech.com';
  const emailNote = pageData?.emailNote || 'Proposals, NDAs & RFPs';

  const hoursTitle = pageData?.hoursTitle || 'Working Hours';
  const hoursText = pageData?.hoursText || 'Mon – Sat: 9:30 AM – 7:00 PM IST';
  const hoursNote = pageData?.hoursNote || 'Online consultations available 24/7';

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH RELEVANT BACKGROUND IMAGE */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-800 text-white min-h-[380px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ImageWithEffects
            key={bgImage}
            src={bgImage}
            alt="Contact LockYourIdea Tech Pune Office"
            effects={getImageEffects(siteSettings, 'page_contact_hero')}
            className="w-full h-full object-cover object-center"
            containerClassName="relative w-full h-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80';
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
              <span className="text-white font-medium">Contact</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium tracking-widest text-cyan-300 font-heading">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span style={applyFieldStyle(pageData?.badge_style)}>{badgeText}</span>
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

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-normal">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{locationBadge1}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{locationBadge2}</span>
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
                  {officeBadge}
                </span>
                <h3 className="text-base font-normal text-slate-900 font-heading">
                  {officeHeadline}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-normal">
                  {officeAddress} · <span className="font-normal text-slate-800">{officeNote}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenBooking('In-Person HQ Consultation')}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
            >
              {officeCtaText}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">{phoneTitle}</h3>
              <a href={`tel:${phone}`} className="text-xs text-blue-600 font-medium hover:underline block">
                {phone}
              </a>
              <p className="text-[11px] text-slate-500">{phoneNote}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-medium">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">{whatsappTitle}</h3>
              <a
                href={`https://wa.me/${(phone || '917558631355').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 font-medium hover:underline block"
              >
                {whatsappText}
              </a>
              <p className="text-[11px] text-slate-500">{whatsappNote}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-medium">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">{emailTitle}</h3>
              <a href={`mailto:${contactEmail}`} className="text-xs text-cyan-700 font-medium hover:underline block">
                {contactEmail}
              </a>
              <p className="text-[11px] text-slate-500">{emailNote}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-medium">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-900 text-sm font-heading">{hoursTitle}</h3>
              <p className="text-xs text-slate-800 font-normal">{hoursText}</p>
              <p className="text-[11px] text-slate-500">{hoursNote}</p>
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
