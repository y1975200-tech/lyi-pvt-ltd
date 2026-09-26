import React from 'react';
import { PageRoute } from '../types.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { Download, FileText, ArrowRight } from 'lucide-react';

interface ResourcesPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onViewEmailPreview?: (emailId: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate, onOpenBooking, onViewEmailPreview }) => {
  const whitepapers = [
    { title: 'The 2026 Enterprise AI Readiness Checklist', desc: 'A 24-point audit framework for engineering leaders evaluating custom LLM pipelines, security boundaries, and GPU cost models.', tag: 'AI Hub Guide' },
    { title: 'Patenting AI & Software Innovations in India & US', desc: 'Step-by-step guidance on navigating Section 3(k) in India and Alice/Mayo 101 tests in the USPTO for software algorithms.', tag: 'IP Hub Playbook' },
    { title: 'Agentic CRM Implementation Blueprint', desc: 'How to replace manual SDR pipeline updating with autonomous agents, verified web scrapers, and WhatsApp API bots.', tag: 'Architecture Blueprint' },
    { title: 'Brand Defense Playbook: Trademark Classes 9, 35, 42', desc: 'The definitive classification strategy for SaaS, AI startups, and digital service providers in India.', tag: 'Legal Resource' },
  ];

  return (
    <div className="space-y-0">
      <section className="bg-slate-50 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <nav className="text-xs text-slate-500 flex items-center gap-2">
              <button onClick={() => onNavigate('home')} className="hover:text-blue-600">Home</button>
              <span>/</span>
              <span className="text-slate-900 font-bold">Resources</span>
            </nav>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block">KNOWLEDGE REPOSITORY</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Whitepapers, Guides &amp; Frameworks
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Download actionable blueprints and legal manuals prepared by LockYourIdea Tech's AI engineers and patent attorneys.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whitepapers.map((wp, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between hover:shadow-lg transition-all">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {wp.tag}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{wp.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{wp.desc}</p>
                </div>
                <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => onOpenBooking(`Download & Walkthrough: ${wp.title}`)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Request Copy &amp; Briefing</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnquiryBookingSection onViewEmailPreview={onViewEmailPreview} />
        </div>
      </section>
    </div>
  );
};
