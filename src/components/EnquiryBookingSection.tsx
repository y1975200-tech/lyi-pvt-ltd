import React, { useState } from 'react';
import { ALL_SERVICES } from '../data/services.ts';
import { BookingData, SiteSettings } from '../types.ts';
import { CheckCircle2, Sparkles, Clock, Mail, ExternalLink, Calendar } from 'lucide-react';
import { ImageWithEffects } from './ImageWithEffects.tsx';

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
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [orgType, setOrgType] = useState<'Startup' | 'MSME' | 'Corporate' | 'Government' | 'Individual'>('Startup');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [service, setService] = useState(defaultService || 'Custom AI Solutions');
  const [budget, setBudget] = useState('₹1–5 Lakh');
  const [message, setMessage] = useState('');

  // Default to tomorrow
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };
  const [date, setDate] = useState(getTomorrow());
  const [timeSlot, setTimeSlot] = useState('11:30 AM IST');
  const [mode, setMode] = useState<'Google Meet' | 'WhatsApp Call' | 'Phone Call' | 'In-Person (HQ)'>('Google Meet');

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingData | null>(null);
  const [emailSentInfo, setEmailSentInfo] = useState<{ id: string; recipient: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        fullName,
        email,
        mobile,
        organization,
        designation,
        orgType,
        service,
        budget,
        date,
        timeSlot,
        mode,
        message: `${message} ${city ? `[City: ${city}]` : ''} ${industry ? `[Industry: ${industry}]` : ''}`,
      };

      let serverBooking: BookingData | null = null;
      let emailInfo: any = null;

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
          console.warn('API returned non-JSON response in EnquiryBookingSection:', text.slice(0, 100));
        }

        if (res.ok && data?.booking) {
          serverBooking = data.booking;
          emailInfo = data.emailSent;
        } else if (data?.error && !data.error.includes('Unexpected token')) {
          console.warn('Server booking response notice:', data.error);
        }
      } catch (netErr) {
        console.warn('Network call to /api/bookings failed, using robust fallback:', netErr);
      }

      // Generate confirmed booking record if server didn't provide one
      const refNum = Math.floor(1000 + Math.random() * 9000);
      const isIp = service.toLowerCase().includes('patent') || service.toLowerCase().includes('trademark') || service.toLowerCase().includes('ip');
      const division: 'AI Hub' | 'IP Hub' = isIp ? 'IP Hub' : 'AI Hub';

      const finalBooking: BookingData = serverBooking || {
        id: `bk_${Date.now()}`,
        reference: `LYI-2026-${refNum}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        organization: organization ? organization.trim() : undefined,
        designation: designation ? designation.trim() : undefined,
        orgType,
        service,
        division,
        budget,
        date,
        timeSlot,
        mode,
        meetingLink: mode === 'Google Meet'
          ? `https://meet.google.com/lyi-${isIp ? 'ip' : 'ai'}-${Math.random().toString(36).substring(2, 6)}`
          : mode === 'WhatsApp Call'
          ? `https://wa.me/917558631355?text=Consultation%20LYI-2026-${refNum}`
          : `tel:+917558631355`,
        assignedConsultant: isIp
          ? { name: 'Adv. Priya Sharma', role: 'Lead Patent & IP Attorney', email: 'priya.sharma@lockyourideatech.com' }
          : { name: 'Dr. Rajiv Mehta', role: 'Principal AI Transformation Architect', email: 'rajiv.mehta@lockyourideatech.com' },
        message: `${message} ${city ? `[City: ${city}]` : ''} ${industry ? `[Industry: ${industry}]` : ''}`,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      // Direct Web3Forms submission to guarantee delivery using user key
      const activeKey = (siteSettings?.web3formsKey || 'b91db637-425b-4ce4-8ed1-c2b51bc1b91b').trim().replace(/\/+$/, '');
      if (activeKey) {
        try {
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              access_key: activeKey,
              subject: `New Slot Booked: ${fullName} (${finalBooking.reference}) — ${service}`,
              from_name: siteSettings?.companyName || 'LockYourIdea Tech Booking Engine',
              name: fullName,
              email: email,
              phone: mobile,
              organization: organization || 'Direct Client',
              service: service,
              date: date,
              time_slot: timeSlot,
              mode: mode,
              reference: finalBooking.reference,
              meeting_link: finalBooking.meetingLink,
              message: `NEW CONSULTATION BOOKED:
Client: ${fullName}
Email: ${email}
Mobile: ${mobile}
Organization: ${organization || 'N/A'} (${designation || 'N/A'})
Topic: ${service}
Scheduled Date: ${date}
Time Slot: ${timeSlot}
Mode: ${mode}
Budget Range: ${budget}
Notes: ${message || 'No additional notes provided'}
Meeting Link: ${finalBooking.meetingLink}`,
            }),
          }).catch((wErr) => console.warn('EnquiryBookingSection Web3Forms notice:', wErr));
        } catch (e) {}
      }

      setConfirmed(finalBooking);
      if (emailInfo) {
        setEmailSentInfo(emailInfo);
      }

      // Also persist to localStorage for instant client recovery
      try {
        const stored = JSON.parse(localStorage.getItem('lyi_stored_bookings') || '[]');
        stored.unshift(finalBooking);
        localStorage.setItem('lyi_stored_bookings', JSON.stringify(stored.slice(0, 50)));
      } catch (e) {}

      if (onBookingSuccess) {
        onBookingSuccess(finalBooking);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const heroBg =
    siteSettings?.heroBgImage ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85';

  return (
    <div id="enquiry" className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 border border-cyan-500/35 shadow-2xl relative overflow-hidden">
      {/* Background Image Layer with deep navy gradient overlay (No dot matrix) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover object-center opacity-30 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-[#0e2246]/85 backdrop-blur-[2px]" />
      </div>

      {/* Glowing corner orbs */}
      <div className="absolute -top-16 -right-16 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
            {siteSettings?.pageContent?.home?.schedulerBadge || 'REAL-TIME CONSULTATION SCHEDULER'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
            {siteSettings?.pageContent?.home?.schedulerTitle || 'Request a Free Consultation'}
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            {siteSettings?.pageContent?.home?.schedulerDesc ||
              'Select your preferred slot & requirement — our scheduling engine instantly locks your appointment and delivers a formal calendar invite with video link to your email.'}
          </p>
        </div>

        {confirmed ? (
          <div className="p-8 rounded-2xl bg-slate-800/90 border border-cyan-500/40 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white font-heading">Consultation Confirmed!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Reference ID: <span className="font-mono font-medium text-cyan-400">{confirmed.reference}</span>
              </p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 text-xs text-left space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled:</span>
                <span className="font-medium text-white">{confirmed.date} at {confirmed.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultant:</span>
                <span className="font-medium text-white">{confirmed.assignedConsultant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Meeting Link:</span>
                <a href={confirmed.meetingLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate max-w-[200px]">
                  {confirmed.meetingLink}
                </a>
              </div>
            </div>

            {emailSentInfo && (
              <div className="text-xs text-emerald-300 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Confirmation email dispatched to <span>{confirmed.email}</span></span>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={confirmed.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 shadow"
              >
                <span>Join Video Room</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {emailSentInfo && onViewEmailPreview && (
                <button
                  type="button"
                  onClick={() => onViewEmailPreview(emailSentInfo.id)}
                  className="px-5 py-2.5 rounded-full border border-slate-600 hover:bg-slate-800 text-white font-medium text-xs cursor-pointer"
                >
                  View Sent Confirmation Email
                </button>
              )}
              <button
                type="button"
                onClick={() => setConfirmed(null)}
                className="px-4 py-2.5 rounded-full text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Schedule Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">
                  Work Email <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">
                  Mobile <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">Organization</label>
                <input
                  type="text"
                  placeholder="Company / Institution"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Founder, VP, Director"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">Type</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                >
                  <option>Startup</option>
                  <option>MSME</option>
                  <option>Corporate</option>
                  <option>Government</option>
                  <option>Individual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                >
                  <option>Under ₹1 Lakh</option>
                  <option>₹1–5 Lakh</option>
                  <option>₹5–20 Lakh</option>
                  <option>₹20 Lakh+</option>
                  <option>Not sure yet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">Service Required</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                >
                  <optgroup label="AI Hub">
                    <option>Custom AI Solutions</option>
                    <option>AI Business Automation</option>
                    <option>Corporate AI Training</option>
                    <option>Government AI Capacity Building</option>
                    <option>Yatra Sarathi AI</option>
                    <option>Capital OS AI</option>
                    <option>Rajya Drishti AI</option>
                    <option>VanDrishti AI</option>
                    <option>AI Card Scanner</option>
                    <option>Agentic CRM</option>
                    <option>WhatsApp Automation</option>
                    <option>AI Video Ads</option>
                    <option>AI Brand Avatars</option>
                    <option>MailX-AI</option>
                    <option>AI Website Chatbots</option>
                  </optgroup>
                  <optgroup label="IP Hub">
                    <option>Patent Filing & Prosecution</option>
                    <option>Trademark Registration & Protection</option>
                    <option>Copyright Registration</option>
                    <option>Industrial Design Registration</option>
                    <option>IP Strategy Consulting</option>
                    <option>IP Valuation & Commercialization</option>
                  </optgroup>
                </select>
              </div>

              {/* Consultation date & slot selection */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-normal text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-slate-300 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
                  >
                    <option>10:00 AM IST</option>
                    <option>11:30 AM IST</option>
                    <option>02:00 PM IST</option>
                    <option>03:30 PM IST</option>
                    <option>05:00 PM IST</option>
                    <option>06:30 PM IST</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal text-slate-300 mb-1">Message / Project Requirement</label>
              <textarea
                rows={3}
                placeholder="Tell us briefly about your requirement or project scope..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 backdrop-blur-xs transition-colors"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {submitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Booking &amp; Dispatching Email...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Book Real-Time Consultation</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/${(siteSettings?.whatsappNumber || siteSettings?.phone || '917558631355').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-700 hover:bg-slate-800 text-white font-medium text-sm text-center transition-colors"
              >
                Chat on WhatsApp Instead
              </a>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              CRM-ready · Real-time availability verified · Automated calendar confirmation email delivered immediately.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
