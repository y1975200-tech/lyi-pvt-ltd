import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { StudioConsultationForm } from './StudioConsultationForm.tsx';
import { BookingData, SiteSettings } from '../types.ts';

interface RealTimeBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
}

export const RealTimeBookingModal: React.FC<RealTimeBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
}) => {
  // Lock scroll on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1B1533]/60 dark:bg-[#14111F]/80 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="relative w-full max-w-[560px] bg-[#FFFFFF] dark:bg-[#1D1930] rounded-[12px] border border-[#D9D5E4] dark:border-[#332E4A] shadow-xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-[#D9D5E4]/50 dark:border-[#332E4A]/50">
          <div>
            <h2 id="modal-booking-title" className="font-display text-xl font-bold text-[#1B1533] dark:text-[#F4F3F7]">
              Book a free consultation
            </h2>
            <p className="text-xs text-[#5F5A73] dark:text-[#A8A3BA] mt-0.5">
              Select a date and time for your 30-minute session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-[6px] text-[#5F5A73] dark:text-[#A8A3BA] hover:text-[#1B1533] dark:hover:text-[#F4F3F7] hover:bg-[#F4F3F7] dark:hover:bg-[#2B2244] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <StudioConsultationForm
            defaultTopic={preselectedService}
            onBookingSuccess={(booking) => {
              if (onBookingSuccess) onBookingSuccess(booking);
            }}
            onViewEmailPreview={onViewEmailPreview}
            siteSettings={siteSettings}
          />
        </div>
      </div>
    </div>
  );
};
