import React from 'react';
import { PageRoute, SiteSettings, BookingData } from '../types.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { ClientLogoScroller } from '../components/ClientLogoScroller.tsx';
import { CountUpNumber } from '../components/CountUpNumber.tsx';
import { DEFAULT_CLIENT_LOGOS } from '../data/generalData.ts';
import { ArrowRight, Shield, Cpu, Award, Users, CheckCircle, MapPin } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

interface HomePageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  const pageData = siteSettings?.pageContent?.home;

  const heroImage =
    pageData?.bgImage ||
    siteSettings?.heroBgImage ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';

  const headline =
    pageData?.headline ||
    siteSettings?.heroHeadline ||
    'Transform Your Business & Protect Your Innovation with AI';

  const subhead =
    pageData?.subheadline ||
    siteSettings?.heroSubhead ||
    'Custom AI software, business automation, enterprise CRM, AI training, government AI capacity building, patents, trademarks, copyrights, and intellectual property services under one trusted platform.';

  const heroBadge =
    pageData?.badge || "India's 360° AI & IP Transformation Company · HQ Pune";

  const heroCta1Text = pageData?.ctaPrimaryText || pageData?.heroCta1Text || 'Book Free Consultation';
  const heroCta2Text = pageData?.ctaSecondaryText || pageData?.heroCta2Text || 'Explore AI & IP Solutions';

  const heroTrustPoint1 = pageData?.trustPoint1 || pageData?.heroTrustPoint1 || 'Real-Time Live Slot Scheduling';
  const heroTrustPoint2 = pageData?.trustPoint2 || pageData?.heroTrustPoint2 || 'Instant Email Confirmation';
  const heroTrustPoint3 = pageData?.trustPoint3 || pageData?.heroTrustPoint3 || 'Pune Headquarters';

  // Stats bar - updated to user requirements: 100+, 500+, 100+, 1,200+, 90%+
  const stats = {
    aiProjects: pageData?.stat1Value || siteSettings?.stats?.aiProjects || '100+',
    ipRegistrations: pageData?.stat2Value || siteSettings?.stats?.ipRegistrations || '500+',
    enterpriseClients: pageData?.stat3Value || siteSettings?.stats?.enterpriseClients || '100+',
    trainedCount: pageData?.stat4Value || siteSettings?.stats?.trainedCount || '1,200+',
    successRate: pageData?.stat5Value || siteSettings?.stats?.successRate || '90%+',
  };
  const stat1Label = pageData?.stat1Label || 'AI Projects Delivered';
  const stat2Label = pageData?.stat2Label || 'IP Registrations';
  const stat3Label = pageData?.stat3Label || 'Enterprise Clients';
  const stat4Label = pageData?.stat4Label || 'Professionals Trained';
  const stat5Label = pageData?.stat5Label || 'Success Rate';

  // Divisions section
  const divisionsTitle = pageData?.divisionsTitle || 'Two Flagship Divisions. One Transformation Partner.';
  const divisionsSubtitle =
    pageData?.divisionsSubtitle ||
    'AI Hub and IP Hub operate as equal, dedicated divisions — each with its own specialists, delivery process, and track record.';

  const aiCardTitle =
    pageData?.aiCardTitle || pageData?.extraHeading1 || 'Transforming Organizations with Artificial Intelligence';
  const aiCardDesc =
    pageData?.aiCardDesc ||
    pageData?.extraText1 ||
    '360° AI solutions — from custom software, computer vision, and agentic CRM to enterprise business automation and government-scale training programs.';

  const ipCardTitle =
    pageData?.ipCardTitle || pageData?.extraHeading2 || 'Protecting Innovation from Idea to Intellectual Property';
  const ipCardDesc =
    pageData?.ipCardDesc ||
    pageData?.extraText2 ||
    "End-to-end IP services — securing what you've built with the same precision and technological rigor you used to build it.";

  const aiCardBg = pageData?.aiCardBg || siteSettings?.aiHubBgImage || heroImage;
  const ipCardBg = pageData?.ipCardBg || siteSettings?.ipHubBgImage || heroImage;

  const defaultAiBullets = [
    'Custom AI Software',
    'Business Automation',
    'Agentic CRM',
    'WhatsApp Automation',
    'Corporate AI Training',
    'Government AI Programs',
  ];
  const aiCardBullets: string[] = Array.isArray(pageData?.aiCardBullets) && pageData.aiCardBullets.length > 0
    ? pageData.aiCardBullets
    : defaultAiBullets;

  const defaultIpBullets = [
    'Patent Search & Filing',
    'Trademark Protection',
    'Copyright Registration',
    'Industrial Design',
    'IP Strategy Audits',
    'IP Valuation & Licensing',
  ];
  const ipCardBullets: string[] = Array.isArray(pageData?.ipCardBullets) && pageData.ipCardBullets.length > 0
    ? pageData.ipCardBullets
    : defaultIpBullets;

  const aiCardBtn1Text = pageData?.aiCardBtn1Text || 'Explore AI Hub';
  const aiCardBtn2Text = pageData?.aiCardBtn2Text || 'Book AI Specialist';
  const ipCardBtn1Text = pageData?.ipCardBtn1Text || 'Explore IP Hub';
  const ipCardBtn2Text = pageData?.ipCardBtn2Text || 'Book IP Specialist';

  // Why section
  const whyBadge = pageData?.whyBadge || 'WHY LOCKYOURIDEA Pvt. Ltd.';
  const whyTitle = pageData?.whyTitle || 'Built for Organizations That Need Both Innovation and Protection';
  const whyCard1Title = pageData?.whyCard1Title || '360° Coverage';
  const whyCard1Desc = pageData?.whyCard1Desc || 'AI transformation and intellectual property defense managed under a single accountable partner.';
  const whyCard2Title = pageData?.whyCard2Title || 'Enterprise & Government';
  const whyCard2Desc = pageData?.whyCard2Desc || 'Trusted by corporates, MSMEs, educational institutions, and public-sector state departments.';
  const whyCard3Title = pageData?.whyCard3Title || 'End-to-End Delivery';
  const whyCard3Desc = pageData?.whyCard3Desc || 'From strategy, model training, and integration to claim drafting, objection defense, and final grant.';
  const whyCard4Title = pageData?.whyCard4Title || 'Proven Track Record';
  const whyCard4Desc = pageData?.whyCard4Desc || '150+ operational AI projects delivered and 500+ intellectual property registrations successfully prosecuted.';

  // Testimonials section
  const testimonialsBadge = pageData?.testimonialsBadge || 'CLIENTS SAY';
  const testimonialsTitle = pageData?.testimonialsTitle || 'Trusted Across Enterprises, Startups and Government';
  const testimonial1Quote = pageData?.testimonial1Quote || '"LockYourIdea automated our entire lead pipeline with their Agentic CRM — our sales team finally spends their time closing deals rather than updating spreadsheets."';
  const testimonial1Author = pageData?.testimonial1Author || 'VP Sales';
  const testimonial1Company = pageData?.testimonial1Company || 'Manufacturing Enterprise, Pune';
  const testimonial1Initials = pageData?.testimonial1Initials || 'VP';

  const testimonial2Quote = pageData?.testimonial2Quote || '"Our deep-tech patent was drafted and filed with extraordinary technical precision. They understood our optical sensors better than outside legal counsels we interviewed."';
  const testimonial2Author = pageData?.testimonial2Author || 'Founder & CTO';
  const testimonial2Company = pageData?.testimonial2Company || 'Robotics Startup, Bengaluru';
  const testimonial2Initials = pageData?.testimonial2Initials || 'FD';

  const testimonial3Quote = pageData?.testimonial3Quote || '"The government AI capacity building program was rigorously structured and highly practical. Our municipal teams utilize the automated document tools daily."';
  const testimonial3Author = pageData?.testimonial3Author || 'Department Head';
  const testimonial3Company = pageData?.testimonial3Company || 'State Government Administration';
  const testimonial3Initials = pageData?.testimonial3Initials || 'DH';

  const theme = siteSettings?.theme;
  const primaryButtonColor = theme?.primaryButtonColor || '#7c3aed';
  const primaryButtonTextColor = theme?.primaryButtonTextColor || '#ffffff';
  const headlineWeight =
    theme?.headlineFontWeight === 'bold'
      ? 'font-bold'
      : theme?.headlineFontWeight === 'extrabold'
      ? 'font-extrabold'
      : theme?.headlineFontWeight === 'semibold'
      ? 'font-semibold'
      : theme?.headlineFontWeight === 'medium'
      ? 'font-medium'
      : 'font-normal';
  const headlineItalic = theme?.headlineItalic ? 'italic' : '';
  const headlineUnderline = theme?.headlineUnderline ? 'underline underline-offset-8 decoration-purple-400' : '';
  const buttonWeight =
    theme?.buttonFontWeight === 'bold'
      ? 'font-bold'
      : theme?.buttonFontWeight === 'semibold'
      ? 'font-semibold'
      : theme?.buttonFontWeight === 'medium'
      ? 'font-medium'
      : 'font-normal';
  const buttonItalic = theme?.buttonItalic ? 'italic' : '';
  const buttonUnderline = theme?.buttonUnderline ? 'underline underline-offset-4' : '';

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH BACKGROUND IMAGE STARTING AT TOP EDGE UNDER HEADER */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 border-b border-slate-800 text-white min-h-[85vh] sm:min-h-screen flex items-center justify-center">
        {/* Background Image Layer with Slow-Motion Cinematic Movement */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            key={heroImage}
            src={heroImage}
            alt="LockYourIdea Tech Innovation Canvas"
            className="w-full h-full object-cover object-center animate-slow-motion pointer-events-none select-none"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';
            }}
          />
          {/* Dual Overlay: Top Vignette for Header Contrast + Horizontal Depth for Hero Text */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/85 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-6">
            <div
              style={applyFieldStyle(pageData?.badge_style)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-medium text-slate-200 shadow-md backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>{heroBadge}</span>
            </div>

            <h1
              style={applyFieldStyle(pageData?.headline_style, { color: 'var(--color-text-on-dark, #ffffff)' })}
              className={`text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12] font-heading drop-shadow-sm font-normal ${headlineItalic} ${headlineUnderline}`}
            >
              {headline}
            </h1>

            <p
              style={applyFieldStyle(pageData?.subheadline_style)}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal"
            >
              {subhead}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-book-consultation-btn"
                onClick={() => onOpenBooking()}
                style={applyFieldStyle(pageData?.ctaPrimaryText_style, {
                  backgroundColor: primaryButtonColor,
                  color: primaryButtonTextColor,
                })}
                className={`px-7 py-3.5 rounded-full shadow-xl shadow-purple-600/35 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-sm ${buttonWeight} ${buttonItalic} ${buttonUnderline}`}
              >
                <span>{heroCta1Text}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('divisions');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={applyFieldStyle(pageData?.ctaSecondaryText_style, {
                  backgroundColor: theme?.secondaryButtonColor || undefined,
                  color: theme?.secondaryButtonTextColor || undefined,
                })}
                className={`px-6 py-3.5 rounded-full border border-purple-400/40 hover:border-purple-300 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 hover:text-white text-sm backdrop-blur-md transition-all cursor-pointer ${buttonWeight} ${buttonItalic} ${buttonUnderline}`}
              >
                {heroCta2Text}
              </button>
            </div>

            {/* Quick trust bullet points */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-normal">
              <span style={applyFieldStyle(pageData?.trustPoint1_style)} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {heroTrustPoint1}
              </span>
              <span style={applyFieldStyle(pageData?.trustPoint2_style)} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-cyan-400" /> {heroTrustPoint2}
              </span>
              <span style={applyFieldStyle(pageData?.trustPoint3_style)} className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" /> {heroTrustPoint3}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR METRICS WITH ANIMATED COUNT-UP COUNTDOWN */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            <div className="p-3">
              <div style={applyFieldStyle(pageData?.stat1Value_style)} className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight font-heading">
                <CountUpNumber value={stats.aiProjects} />
              </div>
              <div style={applyFieldStyle(pageData?.stat1Label_style)} className="text-xs font-normal text-slate-500 mt-1">{stat1Label}</div>
            </div>
            <div className="p-3">
              <div style={applyFieldStyle(pageData?.stat2Value_style)} className="text-3xl sm:text-4xl font-normal text-purple-600 tracking-tight font-heading">
                <CountUpNumber value={stats.ipRegistrations} />
              </div>
              <div style={applyFieldStyle(pageData?.stat2Label_style)} className="text-xs font-normal text-slate-500 mt-1">{stat2Label}</div>
            </div>
            <div className="p-3">
              <div style={applyFieldStyle(pageData?.stat3Value_style)} className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight font-heading">
                <CountUpNumber value={stats.enterpriseClients} />
              </div>
              <div style={applyFieldStyle(pageData?.stat3Label_style)} className="text-xs font-normal text-slate-500 mt-1">{stat3Label}</div>
            </div>
            <div className="p-3">
              <div style={applyFieldStyle(pageData?.stat4Value_style)} className="text-3xl sm:text-4xl font-normal text-cyan-600 tracking-tight font-heading">
                <CountUpNumber value={stats.trainedCount} />
              </div>
              <div style={applyFieldStyle(pageData?.stat4Label_style)} className="text-xs font-normal text-slate-500 mt-1">{stat4Label}</div>
            </div>
            <div className="p-3 col-span-2 sm:col-span-1">
              <div style={applyFieldStyle(pageData?.stat5Value_style)} className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight font-heading">
                <CountUpNumber value={stats.successRate} />
              </div>
              <div style={applyFieldStyle(pageData?.stat5Label_style)} className="text-xs font-normal text-slate-500 mt-1">{stat5Label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE CLIENT LOGO SCROLLER (COLORFUL CLIENT LOGOS) */}
      <ClientLogoScroller
        logos={siteSettings?.clientLogos || DEFAULT_CLIENT_LOGOS}
        badge={pageData?.clientsBadge || siteSettings?.clientsBadge || 'CLIENT SUCCESS NETWORK'}
        badgeStyle={pageData?.clientsBadge_style || siteSettings?.clientsBadge_style}
        title={pageData?.clientsTitle || siteSettings?.clientsTitle || 'TRUSTED BY ENTERPRISES, HIGH-GROWTH STARTUPS & INSTITUTIONS'}
        titleStyle={pageData?.clientsTitle_style || siteSettings?.clientsTitle_style}
      />

      {/* BUSINESS DIVISIONS: AI HUB VS IP HUB */}
      <section className="py-20 bg-slate-50" id="divisions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2 block">
              OUR BUSINESS DIVISIONS
            </span>
            <h2 style={applyFieldStyle(pageData?.divisionsTitle_style)} className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">
              {divisionsTitle}
            </h2>
            <p style={applyFieldStyle(pageData?.divisionsSubtitle_style)} className="text-slate-600 text-sm sm:text-base mt-3 font-normal">
              {divisionsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI HUB CARD */}
            <div className="rounded-3xl relative overflow-hidden text-white p-8 sm:p-10 border border-blue-500/40 shadow-2xl flex flex-col justify-between group">
              {/* Homepage Theme Background Image Layer */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                  src={aiCardBg}
                  alt="AI Hub"
                  className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-700 filter saturate-150"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-[#0e2246]/85 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
              </div>

              {/* Glowing corner orb */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/25 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 font-medium text-xs tracking-wider">
                  AI HUB
                </span>
                <h3 style={applyFieldStyle(pageData?.aiCardTitle_style)} className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  {aiCardTitle}
                </h3>
                <p style={applyFieldStyle(pageData?.aiCardDesc_style)} className="text-slate-300 text-sm leading-relaxed font-normal">
                  {aiCardDesc}
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-slate-200">
                  {aiCardBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('ai-hub')}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {aiCardBtn1Text}
                </button>
                <button
                  onClick={() => onOpenBooking('Custom AI Solutions')}
                  className="px-5 py-3 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium text-xs cursor-pointer"
                >
                  {aiCardBtn2Text}
                </button>
              </div>
            </div>

            {/* IP HUB CARD */}
            <div className="rounded-3xl relative overflow-hidden text-white p-8 sm:p-10 border border-cyan-500/40 shadow-2xl flex flex-col justify-between group">
              {/* Homepage Theme Background Image Layer */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                  src={ipCardBg}
                  alt="IP Hub"
                  className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-700 filter saturate-150"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-[#082a3d]/85 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
              </div>

              {/* Glowing corner orb */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/25 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-medium text-xs tracking-wider">
                  IP HUB
                </span>
                <h3 style={applyFieldStyle(pageData?.ipCardTitle_style)} className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  {ipCardTitle}
                </h3>
                <p style={applyFieldStyle(pageData?.ipCardDesc_style)} className="text-slate-300 text-sm leading-relaxed font-normal">
                  {ipCardDesc}
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-slate-200">
                  {ipCardBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('ip-hub')}
                  className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  {ipCardBtn1Text}
                </button>
                <button
                  onClick={() => onOpenBooking('Patent Filing & Prosecution')}
                  className="px-5 py-3 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium text-xs cursor-pointer"
                >
                  {ipCardBtn2Text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY LOCKYOURIDEA SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span style={applyFieldStyle(pageData?.whyBadge_style)} className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2 block">
              {whyBadge}
            </span>
            <h2 style={applyFieldStyle(pageData?.whyTitle_style)} className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">
              {whyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 style={applyFieldStyle(pageData?.whyCard1Title_style)} className="text-base font-medium text-slate-900">{whyCard1Title}</h3>
              <p style={applyFieldStyle(pageData?.whyCard1Desc_style)} className="text-xs text-slate-600 leading-relaxed font-normal">
                {whyCard1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 style={applyFieldStyle(pageData?.whyCard2Title_style)} className="text-base font-medium text-slate-900">{whyCard2Title}</h3>
              <p style={applyFieldStyle(pageData?.whyCard2Desc_style)} className="text-xs text-slate-600 leading-relaxed font-normal">
                {whyCard2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 style={applyFieldStyle(pageData?.whyCard3Title_style)} className="text-base font-medium text-slate-900">{whyCard3Title}</h3>
              <p style={applyFieldStyle(pageData?.whyCard3Desc_style)} className="text-xs text-slate-600 leading-relaxed font-normal">
                {whyCard3Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 style={applyFieldStyle(pageData?.whyCard4Title_style)} className="text-base font-medium text-slate-900">{whyCard4Title}</h3>
              <p style={applyFieldStyle(pageData?.whyCard4Desc_style)} className="text-xs text-slate-600 leading-relaxed font-normal">
                {whyCard4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span style={applyFieldStyle(pageData?.testiBadge_style || pageData?.testimonialsBadge_style)} className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2 block">
              {testimonialsBadge}
            </span>
            <h2 style={applyFieldStyle(pageData?.testiTitle_style || pageData?.testimonialsTitle_style)} className="text-3xl font-normal text-slate-900 tracking-tight">
              {testimonialsTitle}
            </h2>
          </div>

          {(() => {
            const list = siteSettings?.testimonials && siteSettings.testimonials.length > 0
              ? siteSettings.testimonials
              : [
                  {
                    id: '1',
                    quote: testimonial1Quote,
                    author: testimonial1Author,
                    role: 'VP Operations',
                    company: testimonial1Company,
                    initials: testimonial1Initials,
                    rating: 5,
                    quote_style: pageData?.testi1Quote_style,
                    author_style: pageData?.testi1Author_style,
                    company_style: pageData?.testi1Company_style,
                  },
                  {
                    id: '2',
                    quote: testimonial2Quote,
                    author: testimonial2Author,
                    role: 'Founder & CEO',
                    company: testimonial2Company,
                    initials: testimonial2Initials,
                    rating: 5,
                    quote_style: pageData?.testi2Quote_style,
                    author_style: pageData?.testi2Author_style,
                    company_style: pageData?.testi2Company_style,
                  },
                  {
                    id: '3',
                    quote: testimonial3Quote,
                    author: testimonial3Author,
                    role: 'Managing Director',
                    company: testimonial3Company,
                    initials: testimonial3Initials,
                    rating: 5,
                    quote_style: pageData?.testi3Quote_style,
                    author_style: pageData?.testi3Author_style,
                    company_style: pageData?.testi3Company_style,
                  },
                ];

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-3 text-xs">
                        {'★'.repeat(item.rating || 5)}
                      </div>
                      <p style={applyFieldStyle(item.quote_style || (pageData as any)?.[`testi${idx+1}Quote_style`])} className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-normal">
                        {item.quote}
                      </p>
                    </div>
                    <div className="pt-6 flex items-center gap-3 border-t border-slate-100 mt-4">
                      <div
                        className={`w-10 h-10 rounded-full text-white font-medium flex items-center justify-center text-xs shrink-0 ${
                          idx % 3 === 0
                            ? 'bg-blue-600'
                            : idx % 3 === 1
                            ? 'bg-cyan-600'
                            : 'bg-slate-900'
                        }`}
                      >
                        {item.initials || (item.author ? item.author.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() : 'CL')}
                      </div>
                      <div>
                        <div style={applyFieldStyle(item.author_style || (pageData as any)?.[`testi${idx+1}Author_style`])} className="font-medium text-slate-900 text-xs">{item.author}</div>
                        <div style={applyFieldStyle(item.company_style || (pageData as any)?.[`testi${idx+1}Company_style`])} className="text-[11px] text-slate-500 font-normal">
                          {item.role ? `${item.role} · ` : ''}{item.company}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* REAL-TIME CONSULTATION SCHEDULER SECTION */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden" id="booking-section">
        <EnquiryBookingSection
          onBookingSuccess={onBookingSuccess}
          onViewEmailPreview={onViewEmailPreview}
          siteSettings={siteSettings}
        />
      </section>
    </div>
  );
};
