import React from 'react';
import { StudioConsultationForm } from './StudioConsultationForm.tsx';
import { BookingData, SiteSettings } from '../types.ts';

interface EnquiryBookingSectionProps {
  defaultService?: string;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const EnquiryBookingSection: React.FC<EnquiryBookingSectionProps> = ({
  defaultService,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-[#F4F3F7] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] border-t border-[#D9D5E4] dark:border-[#332E4A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-left mb-8 space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1533] dark:text-[#F4F3F7]">
            Book a free consultation
          </h2>
          <p className="text-sm sm:text-base text-[#5F5A73] dark:text-[#A8A3BA] max-w-2xl">
            Tell us what you're working on and pick a time. You'll get a calendar invite with the video link by email.
          </p>
        </div>

        <div className="max-w-2xl">
          <StudioConsultationForm
            defaultTopic={defaultService}
            onBookingSuccess={onBookingSuccess}
            onViewEmailPreview={onViewEmailPreview}
            siteSettings={siteSettings}
          />
        </div>
      </div>
    </section>
  );
};
