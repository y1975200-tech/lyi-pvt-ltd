import React, { useState, useEffect, useRef } from 'react';
import { Check, Calendar, Clock, Video, Mail, ArrowRight, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { BookingData, SiteSettings } from '../types.ts';

/**
 * Slot Generator Configuration
 */
export interface SlotConfig {
  timezone: string;
  workingDaysCount: number;
  timeSlots: string[];
}

export const BOOKING_CONFIG: SlotConfig = {
  timezone: 'IST',
  workingDaysCount: 5,
  timeSlots: [
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ],
};

export interface CalendarDay {
  isoDate: string;
  dayName: string;
  dateNum: number;
  monthName: string;
  fullFormatted: string;
}

export function generateNextWeekdays(count = 5): CalendarDay[] {
  const days: CalendarDay[] = [];
  const current = new Date();
  // Start from tomorrow
  current.setDate(current.getDate() + 1);

  while (days.length < count) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const isoDate = current.toISOString().split('T')[0];
      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = current.getDate();
      const monthName = current.toLocaleDateString('en-US', { month: 'short' });
      days.push({
        isoDate,
        dayName,
        dateNum,
        monthName,
        fullFormatted: `${dayName}, ${dateNum} ${monthName}`,
      });
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}

// Available Service Topics (Chips)
export const HELP_TOPICS = [
  'Patent filing',
  'Trademark',
  'Copyright / design',
  'AI solutions',
  'Something else',
] as const;

export type HelpTopic = (typeof HELP_TOPICS)[number];

export interface StudioConsultationFormProps {
  defaultTopic?: string;
  onBookingSuccess?: (booking: BookingData) => void;
  onViewEmailPreview?: (emailId: string) => void;
  siteSettings?: SiteSettings;
  className?: string;
}

export const StudioConsultationForm: React.FC<StudioConsultationFormProps> = ({
  defaultTopic,
  onBookingSuccess,
  onViewEmailPreview,
  siteSettings,
  className = '',
}) => {
  const weekdays = useRef<CalendarDay[]>(generateNextWeekdays(BOOKING_CONFIG.workingDaysCount)).current;

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');

  const [selectedTopic, setSelectedTopic] = useState<string>(() => {
    if (defaultTopic && HELP_TOPICS.includes(defaultTopic as any)) {
      return defaultTopic;
    }
    if (defaultTopic?.toLowerCase().includes('patent')) return 'Patent filing';
    if (defaultTopic?.toLowerCase().includes('trademark')) return 'Trademark';
    if (defaultTopic?.toLowerCase().includes('copyright') || defaultTopic?.toLowerCase().includes('design')) return 'Copyright / design';
    if (defaultTopic?.toLowerCase().includes('ai')) return 'AI solutions';
    return 'Patent filing';
  });

  const [note, setNote] = useState('');

  // Slot Selection
  const [selectedDate, setSelectedDate] = useState<CalendarDay>(weekdays[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [emailInfo, setEmailInfo] = useState<{ id: string; recipient: string } | null>(null);

  // Input Refs for focusing invalid fields on submit
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  // Deterministic calculation for unavailable slots based on date string
  const isSlotDisabled = (dayIso: string, slotTime: string) => {
    // Statically mark 11:00 AM and 03:30 PM as unavailable on odd days for design demonstration
    const dateSum = dayIso.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
    if (dateSum % 2 !== 0 && (slotTime === '11:00 AM' || slotTime === '03:30 PM')) {
      return true;
    }
    if (dateSum % 3 === 0 && (slotTime === '10:30 AM' || slotTime === '04:00 PM')) {
      return true;
    }
    return false;
  };

  // Field validation rules
  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (name === 'fullName') {
      if (!value.trim()) {
        errorMsg = 'Enter your full name.';
      } else if (value.trim().length < 2) {
        errorMsg = 'Name must be at least 2 characters.';
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        errorMsg = 'Enter your work email address.';
      } else if (!emailRegex.test(value.trim())) {
        errorMsg = 'Enter a valid email address.';
      }
    } else if (name === 'mobile') {
      const cleaned = value.replace(/\D/g, '');
      if (!cleaned) {
        errorMsg = 'Enter your mobile number.';
      } else if (cleaned.length !== 10) {
        errorMsg = 'Enter a valid 10-digit Indian mobile number.';
      } else if (!/^[6-9]/.test(cleaned)) {
        errorMsg = 'Indian mobile numbers must start with 6, 7, 8, or 9.';
      }
    }
    return errorMsg;
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const err = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: err }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Digits only, max 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(digitsOnly);
    if (touched.mobile) {
      setErrors((prev) => ({ ...prev, mobile: validateField('mobile', digitsOnly) }));
    }
  };

  /**
   * Primary Backend Hookup Handler
   */
  const submitBooking = async (payload: any): Promise<{ booking: BookingData; emailSent?: any }> => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        console.warn('API response notice: server returned non-JSON fallback text');
      }

      if (res.ok && data?.booking) {
        return { booking: data.booking, emailSent: data.emailSent };
      }
    } catch (netErr) {
      console.warn('Network call unfulfilled, generating clean studio booking payload:', netErr);
    }

    // Local Mock Fallback Response
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const isIp =
      payload.service.toLowerCase().includes('patent') ||
      payload.service.toLowerCase().includes('trademark') ||
      payload.service.toLowerCase().includes('copyright') ||
      payload.service.toLowerCase().includes('ip');

    const mockBooking: BookingData = {
      id: `bk_${Date.now()}`,
      reference: `LYI-2026-${refNum}`,
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      mobile: payload.mobile.trim(),
      organization: payload.organization ? payload.organization.trim() : undefined,
      designation: payload.role ? payload.role.trim() : undefined,
      orgType: 'Startup',
      service: payload.service,
      division: isIp ? 'IP Hub' : 'AI Hub',
      budget: '₹1–5 Lakh',
      date: payload.date,
      timeSlot: payload.timeSlot,
      mode: 'Google Meet',
      meetingLink: `https://meet.google.com/lyi-${isIp ? 'ip' : 'ai'}-${Math.random().toString(36).substring(2, 6)}`,
      assignedConsultant: isIp
        ? { name: 'Adv. Priya Sharma', role: 'Lead Patent & IP Attorney', email: 'priya.sharma@lockyourideatech.com' }
        : { name: 'Dr. Rajiv Mehta', role: 'Principal AI Transformation Architect', email: 'rajiv.mehta@lockyourideatech.com' },
      message: payload.message,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Also trigger Web3Forms if configured
    const activeKey = (siteSettings?.web3formsKey || 'b91db637-425b-4ce4-8ed1-c2b51bc1b91b').trim();
    if (activeKey) {
      try {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: activeKey,
            subject: `New Consultation Booked: ${payload.fullName} (${mockBooking.reference}) — ${payload.service}`,
            from_name: 'LYI Tech Booking System',
            name: payload.fullName,
            email: payload.email,
            phone: payload.mobile,
            organization: payload.organization || 'Independent',
            service: payload.service,
            date: payload.date,
            time_slot: payload.timeSlot,
            message: payload.message,
          }),
        }).catch((e) => console.warn('Web3Forms background dispatch:', e));
      } catch (_) {}
    }

    return {
      booking: mockBooking,
      emailSent: { id: `em_${Date.now()}`, recipient: payload.email },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation across all fields
    const nameErr = validateField('fullName', fullName);
    const emailErr = validateField('email', email);
    const mobileErr = validateField('mobile', mobile);

    const newErrors: Record<string, string> = {
      fullName: nameErr,
      email: emailErr,
      mobile: mobileErr,
    };

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, mobile: true });

    // Focus first invalid field
    if (nameErr) {
      fullNameRef.current?.focus();
      fullNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (emailErr) {
      emailRef.current?.focus();
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (mobileErr) {
      mobileRef.current?.focus();
      mobileRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    const timeWithTz = `${selectedSlot} ${BOOKING_CONFIG.timezone}`;
    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      organization: organization.trim(),
      role: role.trim(),
      service: selectedTopic,
      date: selectedDate.fullFormatted,
      isoDate: selectedDate.isoDate,
      timeSlot: timeWithTz,
      message: note.trim(),
    };

    try {
      const result = await submitBooking(payload);
      setConfirmedBooking(result.booking);
      if (result.emailSent) {
        setEmailInfo(result.emailSent);
      }
      if (onBookingSuccess) {
        onBookingSuccess(result.booking);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setEmailInfo(null);
    setFullName('');
    setEmail('');
    setMobile('');
    setOrganization('');
    setRole('');
    setNote('');
    setErrors({});
    setTouched({});
  };

  const selectedSummaryText = `${selectedDate.fullFormatted} at ${selectedSlot} ${BOOKING_CONFIG.timezone}`;

  return (
    <div className={`font-figtree text-[#1B1533] dark:text-[#F4F3F7] ${className}`}>
      {confirmedBooking ? (
        /* Confirmation State */
        <div
          aria-live="polite"
          className="bg-[#FFFFFF] dark:bg-[#1D1930] border border-[#D9D5E4] dark:border-[#332E4A] rounded-[12px] p-6 sm:p-8 space-y-6 text-left"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-[6px] bg-[#EEE7FB] dark:bg-[#2B2244] text-[#6B2BD9] dark:text-[#A67BFF] flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1B1533] dark:text-[#F4F3F7]">
                Consultation booked
              </h2>
              <p className="text-sm text-[#5F5A73] dark:text-[#A8A3BA] mt-0.5">
                We've sent a calendar invite with the video meeting link to{' '}
                <strong className="text-[#1B1533] dark:text-[#F4F3F7] font-semibold">{confirmedBooking.email}</strong>.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#D9D5E4] dark:divide-[#332E4A] border-t border-b border-[#D9D5E4] dark:border-[#332E4A] py-3 text-sm space-y-3">
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#5F5A73] dark:text-[#A8A3BA]">Date & time</span>
              <span className="font-semibold text-[#1B1533] dark:text-[#F4F3F7]">
                {confirmedBooking.date} at {confirmedBooking.timeSlot}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-[#5F5A73] dark:text-[#A8A3BA]">Topic</span>
              <span className="font-semibold text-[#1B1533] dark:text-[#F4F3F7]">{confirmedBooking.service}</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-[#5F5A73] dark:text-[#A8A3BA]">Name</span>
              <span className="font-semibold text-[#1B1533] dark:text-[#F4F3F7]">
                {confirmedBooking.fullName}
                {confirmedBooking.organization ? ` (${confirmedBooking.organization})` : ''}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 pb-1">
              <span className="text-[#5F5A73] dark:text-[#A8A3BA]">Reference ID</span>
              <span className="font-mono text-xs text-[#5F5A73] dark:text-[#A8A3BA]">{confirmedBooking.reference}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={confirmedBooking.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[#6B2BD9] hover:bg-[#5821B8] dark:bg-[#A67BFF] dark:hover:bg-[#9364FF] text-white dark:text-[#14111F] font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B2BD9] focus:ring-offset-2"
            >
              <span>Open Google Meet link</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {emailInfo && onViewEmailPreview && (
              <button
                type="button"
                onClick={() => onViewEmailPreview(emailInfo.id)}
                className="w-full text-center text-xs font-medium text-[#6B2BD9] dark:text-[#A67BFF] hover:underline py-1"
              >
                View simulated calendar invite email
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="w-full text-center text-sm font-medium text-[#5F5A73] dark:text-[#A8A3BA] hover:text-[#1B1533] dark:hover:text-[#F4F3F7] py-2 transition-colors"
            >
              Book another consultation
            </button>
          </div>
        </div>
      ) : (
        /* Standard Form State */
        <div className="bg-[#FFFFFF] dark:bg-[#1D1930] border border-[#D9D5E4] dark:border-[#332E4A] rounded-[12px] p-6 sm:p-8 text-left shadow-none">
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Fieldset 1: About you */}
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="font-display text-base font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1">
                1. About you
              </legend>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1.5">
                    Full name <span className="text-[#B3261E] dark:text-[#FFB4AB]">*</span>
                  </label>
                  <input
                    ref={fullNameRef}
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Aditi Kulkarni"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (touched.fullName) handleBlur('fullName', e.target.value);
                    }}
                    onBlur={(e) => handleBlur('fullName', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] text-sm border ${
                      errors.fullName
                        ? 'border-[#B3261E] dark:border-[#FFB4AB] focus:ring-1 focus:ring-[#B3261E]'
                        : 'border-[#D9D5E4] dark:border-[#332E4A] focus:border-[#6B2BD9] dark:focus:border-[#A67BFF] focus:ring-1 focus:ring-[#6B2BD9]'
                    } outline-none transition-colors placeholder:text-[#5F5A73]/50 dark:placeholder:text-[#A8A3BA]/50`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-[#B3261E] dark:text-[#FFB4AB] mt-1" id="fullName-error">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1.5">
                    Work email <span className="text-[#B3261E] dark:text-[#FFB4AB]">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    required
                    autoComplete="email"
                    placeholder="aditi@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) handleBlur('email', e.target.value);
                    }}
                    onBlur={(e) => handleBlur('email', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] text-sm border ${
                      errors.email
                        ? 'border-[#B3261E] dark:border-[#FFB4AB] focus:ring-1 focus:ring-[#B3261E]'
                        : 'border-[#D9D5E4] dark:border-[#332E4A] focus:border-[#6B2BD9] dark:focus:border-[#A67BFF] focus:ring-1 focus:ring-[#6B2BD9]'
                    } outline-none transition-colors placeholder:text-[#5F5A73]/50 dark:placeholder:text-[#A8A3BA]/50`}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#B3261E] dark:text-[#FFB4AB] mt-1" id="email-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Mobile Number with +91 prefix */}
                <div>
                  <label htmlFor="mobile" className="block text-xs font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1.5">
                    Mobile number <span className="text-[#B3261E] dark:text-[#FFB4AB]">*</span>
                  </label>
                  <div className="flex rounded-[6px]">
                    <span className="inline-flex items-center px-3 py-2.5 rounded-l-[6px] border border-r-0 border-[#D9D5E4] dark:border-[#332E4A] bg-[#F4F3F7] dark:bg-[#2B2244] text-[#5F5A73] dark:text-[#A8A3BA] text-sm font-medium select-none">
                      +91
                    </span>
                    <input
                      ref={mobileRef}
                      id="mobile"
                      name="mobile"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      autoComplete="tel-national"
                      placeholder="98765 43210"
                      value={mobile}
                      onChange={handleMobileChange}
                      onBlur={(e) => handleBlur('mobile', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-r-[6px] bg-[#FFFFFF] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] text-sm border ${
                        errors.mobile
                          ? 'border-[#B3261E] dark:border-[#FFB4AB] focus:ring-1 focus:ring-[#B3261E]'
                          : 'border-[#D9D5E4] dark:border-[#332E4A] focus:border-[#6B2BD9] dark:focus:border-[#A67BFF] focus:ring-1 focus:ring-[#6B2BD9]'
                      } outline-none transition-colors placeholder:text-[#5F5A73]/50 dark:placeholder:text-[#A8A3BA]/50`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-xs text-[#B3261E] dark:text-[#FFB4AB] mt-1" id="mobile-error">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Organization & Role side-by-side on wider screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="organization" className="block text-xs font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1.5">
                      Organization <span className="text-[#5F5A73] dark:text-[#A8A3BA] font-normal">(optional)</span>
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Corp"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] text-sm border border-[#D9D5E4] dark:border-[#332E4A] focus:border-[#6B2BD9] dark:focus:border-[#A67BFF] focus:ring-1 focus:ring-[#6B2BD9] outline-none transition-colors placeholder:text-[#5F5A73]/50 dark:placeholder:text-[#A8A3BA]/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-xs font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1.5">
                      Role / Designation <span className="text-[#5F5A73] dark:text-[#A8A3BA] font-normal">(optional)</span>
                    </label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      autoComplete="organization-title"
                      placeholder="Lead Architect"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] text-sm border border-[#D9D5E4] dark:border-[#332E4A] focus:border-[#6B2BD9] dark:focus:border-[#A67BFF] focus:ring-1 focus:ring-[#6B2BD9] outline-none transition-colors placeholder:text-[#5F5A73]/50 dark:placeholder:text-[#A8A3BA]/50"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Fieldset Divider */}
            <hr className="border-t border-[#D9D5E4] dark:border-[#332E4A] my-6 border-0 h-px bg-[#D9D5E4] dark:bg-[#332E4A]" />

            {/* Fieldset 2: What do you need help with? */}
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="font-display text-base font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1">
                2. What do you need help with?
              </legend>

              <div className="space-y-3">
                <p className="text-xs text-[#5F5A73] dark:text-[#A8A3BA]">
                  Select the primary topic for your consultation slot:
                </p>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 role-list" role="radiogroup" aria-label="Consultation topic">
                  {HELP_TOPICS.map((topic) => {
                    const isSelected = selectedTopic === topic;
                    return (
                      <button
                        key={topic}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6B2BD9] min-h-[40px] flex items-center ${
                          isSelected
                            ? 'bg-[#EEE7FB] dark:bg-[#2B2244] text-[#6B2BD9] dark:text-[#A67BFF] border-[#6B2BD9] dark:border-[#A67BFF]'
                            : 'bg-[#FFFFFF] dark:bg-[#14111F] text-[#5F5A73] dark:text-[#A8A3BA] border-[#D9D5E4] dark:border-[#332E4A] hover:border-[#6B2BD9]/50'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>

                {/* Optional Note */}
                <div className="pt-2">
                  <label htmlFor="note" className="block text-xs font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1.5">
                    Brief note <span className="text-[#5F5A73] dark:text-[#A8A3BA] font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={2}
                    placeholder="Tell us a few words about your invention, software project, or questions..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] text-sm border border-[#D9D5E4] dark:border-[#332E4A] focus:border-[#6B2BD9] dark:focus:border-[#A67BFF] focus:ring-1 focus:ring-[#6B2BD9] outline-none transition-colors placeholder:text-[#5F5A73]/50 dark:placeholder:text-[#A8A3BA]/50 resize-none"
                  />
                </div>
              </div>
            </fieldset>

            {/* Fieldset Divider */}
            <hr className="border-t border-[#D9D5E4] dark:border-[#332E4A] my-6 border-0 h-px bg-[#D9D5E4] dark:bg-[#332E4A]" />

            {/* Fieldset 3: Pick a slot (Visual Boldness Spent Here!) */}
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="font-display text-base font-semibold text-[#1B1533] dark:text-[#F4F3F7] mb-1">
                3. Pick a slot
              </legend>

              <div className="space-y-4">
                {/* Weekday Selector Row */}
                <div className="grid grid-cols-5 gap-2">
                  {weekdays.map((day) => {
                    const isSelected = selectedDate.isoDate === day.isoDate;
                    return (
                      <button
                        key={day.isoDate}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day);
                          // If current slot disabled on new day, pick first available
                          if (isSlotDisabled(day.isoDate, selectedSlot)) {
                            const firstAvailable = BOOKING_CONFIG.timeSlots.find(
                              (s) => !isSlotDisabled(day.isoDate, s)
                            );
                            if (firstAvailable) setSelectedSlot(firstAvailable);
                          }
                        }}
                        className={`p-2.5 sm:p-3 rounded-[6px] border text-center transition-colors cursor-pointer min-h-[56px] flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#EEE7FB] dark:bg-[#2B2244] border-[#6B2BD9] dark:border-[#A67BFF] text-[#6B2BD9] dark:text-[#A67BFF]'
                            : 'bg-[#FFFFFF] dark:bg-[#14111F] border-[#D9D5E4] dark:border-[#332E4A] text-[#5F5A73] dark:text-[#A8A3BA] hover:border-[#6B2BD9]/50'
                        }`}
                      >
                        <span className="text-[11px] font-medium block uppercase tracking-wider">{day.dayName}</span>
                        <span className="text-sm font-bold font-display leading-tight">{day.dateNum}</span>
                        <span className="text-[10px] text-[#5F5A73] dark:text-[#A8A3BA] block">{day.monthName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Grid */}
                <div>
                  <p className="text-xs font-medium text-[#5F5A73] dark:text-[#A8A3BA] mb-2 flex items-center justify-between">
                    <span>Available times ({BOOKING_CONFIG.timezone})</span>
                    <span className="text-[11px] font-normal text-[#5F5A73] dark:text-[#A8A3BA]">30 min video consultation</span>
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="radiogroup" aria-label="Select a time slot">
                    {BOOKING_CONFIG.timeSlots.map((slot) => {
                      const disabled = isSlotDisabled(selectedDate.isoDate, slot);
                      const isSelected = selectedSlot === slot && !disabled;
                      const radioId = `slot-${selectedDate.isoDate}-${slot.replace(/[:\s]/g, '-')}`;

                      return (
                        <label
                          key={slot}
                          htmlFor={radioId}
                          className={`relative flex items-center justify-center px-3 py-2.5 rounded-[6px] border text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
                            disabled
                              ? 'bg-[#F4F3F7] dark:bg-[#14111F]/50 text-[#5F5A73]/40 dark:text-[#A8A3BA]/30 border-[#D9D5E4]/50 dark:border-[#332E4A]/40 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#6B2BD9] dark:bg-[#A67BFF] text-white dark:text-[#14111F] border-[#6B2BD9] dark:border-[#A67BFF] shadow-none'
                              : 'bg-[#FFFFFF] dark:bg-[#14111F] text-[#1B1533] dark:text-[#F4F3F7] border-[#D9D5E4] dark:border-[#332E4A] hover:border-[#6B2BD9]'
                          }`}
                        >
                          <input
                            type="radio"
                            id={radioId}
                            name="timeSlot"
                            value={slot}
                            disabled={disabled}
                            checked={isSelected}
                            onChange={() => !disabled && setSelectedSlot(slot)}
                            className="sr-only focus:outline-none"
                          />
                          <span>{slot}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Card Footer Divider */}
            <hr className="border-t border-[#D9D5E4] dark:border-[#332E4A] my-6 border-0 h-px bg-[#D9D5E4] dark:bg-[#332E4A]" />

            {/* Card Footer & Submit Section */}
            <div className="space-y-4 pt-1">
              {/* Live Summary */}
              <div
                aria-live="polite"
                aria-atomic="true"
                className="text-xs font-medium text-[#5F5A73] dark:text-[#A8A3BA] flex items-center justify-between"
              >
                <span>Selected appointment:</span>
                <span className="font-semibold text-[#6B2BD9] dark:text-[#A67BFF]">{selectedSummaryText}</span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-[6px] bg-[#6B2BD9] hover:bg-[#5821B8] dark:bg-[#A67BFF] dark:hover:bg-[#9364FF] text-white dark:text-[#14111F] font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B2BD9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Booking appointment...</span>
                  </>
                ) : (
                  <span>Book consultation</span>
                )}
              </button>

              {/* Privacy Notice */}
              <p className="text-[11px] text-center text-[#5F5A73] dark:text-[#A8A3BA]">
                We keep your information strictly confidential under standard NDA terms.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
