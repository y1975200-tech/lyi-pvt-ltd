import React, { useState } from 'react';
import { PageRoute } from '../types.ts';
import { BLOG_POSTS } from '../data/generalData.ts';
import { EnquiryBookingSection } from '../components/EnquiryBookingSection.tsx';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenBooking: (service?: string) => void;
  onViewEmailPreview?: (emailId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onOpenBooking, onViewEmailPreview }) => {
  const [filter, setFilter] = useState<'All' | 'AI Hub' | 'IP Hub'>('All');

  const filtered = filter === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === filter);

  return (
    <div className="space-y-0">
      <section className="bg-slate-50 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <nav className="text-xs text-slate-500 flex items-center gap-2">
              <button onClick={() => onNavigate('home')} className="hover:text-blue-600">Home</button>
              <span>/</span>
              <span className="text-slate-900 font-bold">Blog</span>
            </nav>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block">INSIGHTS &amp; PLAYBOOKS</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              AI &amp; Intellectual Property Blog
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Practical breakdowns on prompt engineering, Agentic CRM architecture, patent novelty searches, and trademark dispute resolutions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-10">
            {(['All', 'AI Hub', 'IP Hub'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  filter === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => {
              const isAi = post.category === 'AI Hub';
              return (
                <div
                  key={post.id}
                  className="rounded-2xl border border-slate-200 p-6 bg-white hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          isAi ? 'bg-blue-50 text-blue-700' : 'bg-cyan-50 text-cyan-800'
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => onOpenBooking(`Consultation: Inquiry on article "${post.title}"`)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Consult with an Expert</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
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
