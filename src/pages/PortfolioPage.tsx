import React, { useState } from 'react';
import { PageRoute, PortfolioItem, SiteSettings } from '../types.ts';
import { PORTFOLIO_ITEMS as DEFAULT_ITEMS } from '../data/generalData.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { ArrowRight, CheckCircle2, Building, Sparkles, Eye, ExternalLink, X, MapPin } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

interface PortfolioPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onViewEmailPreview?: (emailId: string) => void;
  portfolioItems?: PortfolioItem[];
  siteSettings?: SiteSettings;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onOpenBooking,
  onViewEmailPreview,
  portfolioItems = DEFAULT_ITEMS,
  siteSettings,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  const pageData = siteSettings?.pageContent?.portfolio;

  const portfolioBg =
    pageData?.bgImage ||
    siteSettings?.portfolioBgImage ||
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80';

  const badgeText = pageData?.badge || 'OUR DEPLOYED WORK & CLIENT SUCCESS';
  const headline = pageData?.headline || 'Selected Engagements & Deliveries';
  const subheadline =
    pageData?.subheadline ||
    'A comprehensive showcase of deployed enterprise AI software, computer vision architectures, agentic CRMs, and granted patent portfolios engineered from our Pune headquarters for clients across India and globally.';

  const categories = [
    'All',
    'AI Software',
    'AI Platforms',
    'Automation',
    'CRM',
    'AI Video Ads',
    'AI Avatars',
    'Government AI',
    'Patent Projects',
    'Trademark Success',
  ];

  const items = portfolioItems && portfolioItems.length > 0 ? portfolioItems : DEFAULT_ITEMS;

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-0">
      {/* Portfolio Header with Relevant Background Image */}
      <section className="relative overflow-hidden py-18 md:py-24 border-b border-slate-800 text-white min-h-[400px] flex items-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            key={portfolioBg}
            src={portfolioBg}
            alt="LockYourIdea Tech Deployed Work Portfolio"
            className="w-full h-full object-cover object-center transition-all duration-700"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/70 to-slate-900/50" />
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4">
            <nav className="text-xs text-slate-300 flex items-center gap-2">
              <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">
                Home
              </button>
              <span>/</span>
              <span className="text-cyan-300 font-medium">Portfolio</span>
            </nav>
            <div
              style={applyFieldStyle(pageData?.badge_style)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-medium text-cyan-300 shadow-md backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
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
              className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl drop-shadow-xs font-normal"
            >
              {subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid with Photos */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="aspect-16/10 relative overflow-hidden bg-slate-900">
                    <img
                      src={
                        item.imageUrl ||
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Tag badge */}
                    <span
                      style={applyFieldStyle(item.tag_style)}
                      className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 font-medium backdrop-blur-sm border border-white/10"
                    >
                      {item.tag || item.category}
                    </span>

                    {/* Quantified Result Badge */}
                    {item.result && (
                      <span
                        style={applyFieldStyle(item.result_style)}
                        className="absolute bottom-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{item.result}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600 block">
                        {item.category}
                      </span>
                      {item.client && (
                        <span style={applyFieldStyle(item.client_style)} className="text-[11px] text-slate-500 font-normal flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{item.client}</span>
                        </span>
                      )}
                    </div>

                    <h3
                      style={applyFieldStyle(item.title_style)}
                      className="text-base font-medium text-slate-900 leading-snug font-heading group-hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </h3>
                    <p
                      style={applyFieldStyle(item.description_style)}
                      className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal"
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProject(item)}
                      className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal transition-all flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer active:scale-95"
                      title="View Project Details & Scope"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() =>
                        onOpenBooking(
                          item.category.includes('Patent') || item.category.includes('Trademark')
                            ? 'Patent Filing & Prosecution'
                            : 'Custom AI Solutions'
                        )
                      }
                      className="text-xs font-normal text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer py-1"
                    >
                      <span>Request Similar Scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-normal">Pune HQ Delivery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Details Popup Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header Image */}
            <div className="relative h-60 sm:h-72 w-full bg-slate-900 overflow-hidden">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges on Image */}
              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-600 text-white backdrop-blur-sm">
                  {selectedProject.tag || selectedProject.category}
                </span>
                {selectedProject.result && (
                  <span className="text-xs font-normal px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedProject.result}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-600 font-normal uppercase tracking-wider mb-1.5">
                  <span>{selectedProject.category}</span>
                  {selectedProject.client && (
                    <>
                      <span>•</span>
                      <span className="text-slate-500 normal-case flex items-center gap-1 font-normal">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Client: {selectedProject.client}</span>
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-2xl font-normal text-slate-900 font-heading leading-snug">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Scope & Description */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                <h4 className="text-xs font-medium text-slate-900 uppercase tracking-wider">
                  Project Scope &amp; Delivery Summary
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {selectedProject.description}
                </p>
              </div>

              {/* Delivery Details & Website Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block font-normal">Engineering &amp; Execution</span>
                  <span className="font-normal text-slate-800 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-blue-600" /> Pune HQ Direct Delivery
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block font-normal">Quantified Business Impact</span>
                  <span className="font-normal text-emerald-600 text-sm mt-1 block">
                    {selectedProject.result || 'Production Verified Deployment'}
                  </span>
                </div>
              </div>

              {/* Website / Project Live Link if configured */}
              {selectedProject.projectUrl && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-medium text-blue-900 block">
                      Live Project / Website Link
                    </span>
                    <span className="text-xs text-blue-700 break-all font-mono font-normal">
                      {selectedProject.projectUrl}
                    </span>
                  </div>
                  <a
                    href={selectedProject.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Footer Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-normal transition-colors cursor-pointer"
                >
                  Close
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const service = selectedProject.category.includes('Patent') || selectedProject.category.includes('Trademark')
                        ? 'Patent Filing & Prosecution'
                        : 'Custom AI Solutions';
                      setSelectedProject(null);
                      onOpenBooking(service);
                    }}
                    className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Request Similar Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Integration */}
      <section className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnquiryBookingSection
            onViewEmailPreview={onViewEmailPreview}
            siteSettings={siteSettings}
          />
        </div>
      </section>
    </div>
  );
};
