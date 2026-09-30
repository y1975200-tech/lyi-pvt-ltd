import React from 'react';
import { StudioConsultationForm } from '../components/StudioConsultationForm.tsx';
import { PageRoute, BookingData, SiteSettings } from '../types.ts';
import { ShieldCheck, Video, Calendar, Clock, CheckCircle } from 'lucide-react';

export interface BookConsultationPageProps {
  onNavigate?: (route: PageRoute) => void;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
  defaultTopic?: string;
}

export const BookConsultationPage: React.FC<BookConsultationPageProps> = ({
  onNavigate,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
  defaultTopic,
}) => {
  return (
    <div className="min-h-screen bg-[#F4F3F7] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] font-figtree transition-colors">
      {/* Simple Page Header */}
      <header className="border-b border-[#D9D5E4] dark:border-[#332E4A] bg-[#FFFFFF]/80 dark:bg-[#1D1930]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#6B2BD9] rounded-[4px] p-1 cursor-pointer"
          >
            {/* Simple LYI Logo Mark */}
            <div className="w-7 h-7 rounded-[6px] bg-[#6B2BD9] dark:bg-[#A67BFF] text-white dark:text-[#14111F] font-display font-bold text-sm flex items-center justify-center">
              L
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-[#1B1533] dark:text-[#F4F3F7]">
                LYI Tech
              </span>
              <span className="text-[10px] text-[#5F5A73] dark:text-[#A8A3BA] -mt-0.5">
                AI & IP Consulting
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="text-xs font-medium text-[#5F5A73] dark:text-[#A8A3BA] hover:text-[#1B1533] dark:hover:text-[#F4F3F7] transition-colors cursor-pointer"
          >
            Back to home
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading & Desktop "What to expect" Panel */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1533] dark:text-[#F4F3F7]">
                Book a free consultation
              </h1>
              <p className="text-base text-[#5F5A73] dark:text-[#A8A3BA] leading-relaxed">
                Tell us what you're working on and pick a time. You'll get a calendar invite with the video link by email.
              </p>
            </div>

            {/* Disciplined "What to Expect" Side Panel for Desktop */}
            <div className="hidden lg:block bg-[#FFFFFF] dark:bg-[#1D1930] border border-[#D9D5E4] dark:border-[#332E4A] rounded-[12px] p-6 space-y-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-[#5F5A73] dark:text-[#A8A3BA]">
                What to expect
              </h2>

              <ul className="space-y-4 text-sm text-[#1B1533] dark:text-[#F4F3F7]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-[4px] bg-[#EEE7FB] dark:bg-[#2B2244] text-[#6B2BD9] dark:text-[#A67BFF] flex items-center justify-center shrink-0 mt-0.5">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block font-semibold">30-minute Google Meet</strong>
                    <span className="text-xs text-[#5F5A73] dark:text-[#A8A3BA]">
                      Direct 1-on-1 session with our principal AI architect or lead IP attorney.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-[4px] bg-[#EEE7FB] dark:bg-[#2B2244] text-[#6B2BD9] dark:text-[#A67BFF] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block font-semibold">Strict confidentiality & NDA</strong>
                    <span className="text-xs text-[#5F5A73] dark:text-[#A8A3BA]">
                      Your code, invention ideas, and business model are protected under standard non-disclosure.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-[4px] bg-[#EEE7FB] dark:bg-[#2B2244] text-[#6B2BD9] dark:text-[#A67BFF] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block font-semibold">Instant confirmation</strong>
                    <span className="text-xs text-[#5F5A73] dark:text-[#A8A3BA]">
                      Receive your video link and calendar invite immediately upon selecting your slot.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Studio Form Container (max-w-[560px] on desktop) */}
          <div className="lg:col-span-7 w-full max-w-[560px] mx-auto lg:max-w-none">
            <StudioConsultationForm
              defaultTopic={defaultTopic}
              onBookingSuccess={onBookingSuccess}
              onViewEmailPreview={onViewEmailPreview}
              siteSettings={siteSettings}
            />
          </div>
        </div>
      </main>

      {/* Simple Studio Page Footer */}
      <footer className="border-t border-[#D9D5E4] dark:border-[#332E4A] py-8 text-center text-xs text-[#5F5A73] dark:text-[#A8A3BA] space-y-2">
        <p>© {new Date().getFullYear()} LYI Tech Pvt. Ltd. (LockYourIdea). Baner, Pune, MH, India.</p>
        <p>
          Need quick support?{' '}
          <a
            href="https://wa.me/917558631355?text=Hi%20LYI%20Team%2C%20I%20have%20a%20question%20about%20booking%20a%20consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B2BD9] dark:text-[#A67BFF] hover:underline font-medium"
          >
            Chat with us on WhatsApp
          </a>
        </p>
      </footer>
    </div>
  );
};
