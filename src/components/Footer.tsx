import React, { useState } from 'react';
import { PageRoute, SiteSettings } from '../types.ts';
import { AI_SERVICES, IP_SERVICES } from '../data/services.ts';
import { Send, CheckCircle2 } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

interface FooterProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: () => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking, siteSettings }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const companyName = siteSettings?.companyName || 'LockYourIdea Tech';
  const phone = siteSettings?.phone || '+91 75586 31355';
  const email = siteSettings?.email || 'support@lockyourideatech.com';

  const heroBg =
    siteSettings?.heroBgImage ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Homepage Theme Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover object-bottom opacity-25 filter saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {siteSettings?.logoUrl && siteSettings.logoUrl !== '/assets/logo.svg' ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={companyName}
                  className="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-slate-800 p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white font-medium text-sm shadow">
                  LYI
                </div>
              )}
              <span
                style={applyFieldStyle(siteSettings?.companyName_style)}
                className="font-medium text-white text-lg tracking-tight font-heading"
              >
                {companyName}
              </span>
            </div>
            <p
              style={applyFieldStyle(siteSettings?.tagline_style)}
              className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal"
            >
              {siteSettings?.tagline || "India's 360° AI & Intellectual Property Transformation Company empowering enterprises, startups, and governments to build scalable AI systems and defend high-value patents, trademarks & copyrights under one roof."}
            </p>

            {/* Newsletter */}
            <div className="pt-2 max-w-sm">
              <span className="block text-xs font-medium text-slate-200 mb-2 font-heading">Subscribe to AI &amp; IP Briefs</span>
              {subscribed ? (
                <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! Check your inbox for our latest playbooks.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Your work email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs shadow transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 font-normal">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pune, Maharashtra, India (Sole Office Location) · Serving Globally</span>
            </div>
          </div>

          {/* AI Hub links */}
          <div>
            <h4 className="text-white font-medium text-xs tracking-wider uppercase mb-3 text-blue-400 font-heading">
              AI Hub Solutions
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {AI_SERVICES.slice(0, 8).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      onNavigate('service-detail', s.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-cyan-300 text-left transition-colors cursor-pointer"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    onNavigate('ai-hub');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-cyan-400 font-medium hover:underline cursor-pointer"
                >
                  View All AI Services →
                </button>
              </li>
            </ul>
          </div>

          {/* IP Hub links */}
          <div>
            <h4 className="text-white font-medium text-xs tracking-wider uppercase mb-3 text-cyan-400 font-heading">
              IP Hub Services
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {IP_SERVICES.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      onNavigate('service-detail', s.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-cyan-300 text-left transition-colors cursor-pointer"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => {
                    onNavigate('ip-hub');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-cyan-400 font-medium hover:underline cursor-pointer"
                >
                  View All IP Services →
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h4 className="text-white font-medium text-xs tracking-wider uppercase mb-3 font-heading">
              Company
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white cursor-pointer">Portfolio</button>
              </li>
              <li>
                <button onClick={() => onNavigate('industries')} className="hover:text-white cursor-pointer">Industries</button>
              </li>
              <li>
                <button onClick={() => onNavigate('case-studies')} className="hover:text-white cursor-pointer">Case Studies</button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white cursor-pointer">Blog &amp; Insights</button>
              </li>
              <li>
                <button onClick={() => onNavigate('resources')} className="hover:text-white cursor-pointer">Resources</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">Contact Us</button>
              </li>
            </ul>

            <h4 className="text-white font-medium text-xs tracking-wider uppercase mt-5 mb-2 font-heading">
              Direct Helplines
            </h4>
            <div className="space-y-1 text-xs text-slate-400">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="block text-cyan-300 hover:underline font-medium"
              >
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="block text-slate-400 hover:text-white"
              >
                {email}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 LockYourIdea Tech Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300 cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 cursor-pointer">
              Get in Touch
            </button>
            <button onClick={onOpenBooking} className="text-cyan-400 font-medium hover:underline cursor-pointer">
              Book Real-Time Consultation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
