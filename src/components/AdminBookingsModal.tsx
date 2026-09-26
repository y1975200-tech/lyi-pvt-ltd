import React, { useState, useEffect } from 'react';
import { BookingData, DispatchedEmail } from '../types.ts';
import {
  Calendar,
  Mail,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  X,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface AdminBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  selectedEmailId?: string | null;
}

export const AdminBookingsModal: React.FC<AdminBookingsModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  selectedEmailId,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'emails'>('bookings');
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [emails, setEmails] = useState<DispatchedEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'All' | 'AI Hub' | 'IP Hub'>('All');

  // Reschedule state
  const [reschedulingBooking, setReschedulingBooking] = useState<BookingData | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('11:30 AM IST');
  const [actionMessage, setActionMessage] = useState('');

  // Email detail view
  const [viewingEmail, setViewingEmail] = useState<DispatchedEmail | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, eRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/emails'),
      ]);

      if (bRes.ok) {
        const bData = await bRes.json();
        setBookings(bData);
      }
      if (eRes.ok) {
        const eData = await eRes.json();
        setEmails(eData);

        if (selectedEmailId) {
          const matched = eData.find((item: DispatchedEmail) => item.id === selectedEmailId);
          if (matched) {
            setViewingEmail(matched);
            setActiveTab('emails');
          }
        }
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, selectedEmailId]);

  if (!isOpen) return null;

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking || !newDate || !newSlot) return;

    try {
      const res = await fetch(`/api/bookings/${reschedulingBooking.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, timeSlot: newSlot }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reschedule');

      setActionMessage(data.message);
      setReschedulingBooking(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Reschedule failed');
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this consultation? A cancellation email will be sent to the user.')) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMessage(data.message);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Cancel failed');
    }
  };

  const handleResendEmail = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/resend-email`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMessage(data.message);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to resend');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase());

    const matchesDivision = divisionFilter === 'All' || b.division === divisionFilter;
    return matchesSearch && matchesDivision;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight m-0">
                Live Consultations &amp; Email Dispatch Hub
              </h3>
              <p className="text-xs text-slate-400 m-0">
                Real-time backend appointment management &amp; email delivery logs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              title="Refresh"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('bookings');
                setViewingEmail(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Booked Consultations ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'emails'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Dispatched Emails ({emails.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold text-xs shadow-sm"
          >
            + New Consultation
          </button>
        </div>

        {/* Action alert banner */}
        {actionMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 font-medium flex items-center justify-between shrink-0">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage('')} className="text-emerald-600 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'bookings' ? (
            <div className="space-y-4">
              {/* Search & Division Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, ref, service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {(['All', 'AI Hub', 'IP Hub'] as const).map((div) => (
                    <button
                      key={div}
                      onClick={() => setDivisionFilter(div)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        divisionFilter === div
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  No consultations found matching criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => {
                    const isAi = b.division === 'AI Hub';
                    const isCancelled = b.status === 'cancelled';

                    return (
                      <div
                        key={b.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCancelled
                            ? 'bg-slate-50/70 border-slate-200 opacity-60'
                            : 'bg-white border-slate-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {b.reference}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isAi ? 'bg-blue-100 text-blue-700' : 'bg-cyan-100 text-cyan-800'
                              }`}
                            >
                              {b.division}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : b.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {b.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 font-medium">
                            Booked on {new Date(b.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Client</span>
                            <div className="font-bold text-slate-900 text-sm">{b.fullName}</div>
                            <div className="text-slate-600 text-xs">{b.email}</div>
                            <div className="text-slate-500 text-xs">{b.mobile}</div>
                            {b.organization && (
                              <div className="text-slate-700 text-xs mt-0.5 font-medium">
                                {b.organization} {b.designation ? `(${b.designation})` : ''} · <span className="text-slate-500">{b.orgType}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Requirement</span>
                            <div className="font-bold text-slate-900">{b.service}</div>
                            <div className="text-slate-500">Budget: {b.budget}</div>
                            {b.message && (
                              <div className="text-slate-600 text-[11px] italic line-clamp-2 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                "{b.message}"
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Appointment</span>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              <span>{b.date} · {b.timeSlot}</span>
                            </div>
                            <div className="text-slate-600 mt-1 flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 text-slate-400" />
                              <span>{b.mode}</span>
                            </div>
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              Lead: {b.assignedConsultant.name}
                            </div>
                          </div>
                        </div>

                        {/* Booking Controls */}
                        {!isCancelled && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <a
                                href={b.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold flex items-center gap-1 text-[11px]"
                              >
                                <span>Join Call</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => handleResendEmail(b.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>Resend Confirmation Email</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setReschedulingBooking(b);
                                  setNewDate(b.date);
                                  setNewSlot(b.timeSlot);
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px]"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* EMAILS TAB */
            <div className="space-y-4">
              {viewingEmail ? (
                /* Single email detailed inspector */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <button
                      onClick={() => setViewingEmail(null)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      ← Back to All Sent Emails
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        Delivered
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(viewingEmail.sentAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div><strong>To:</strong> {viewingEmail.recipient}</div>
                    <div><strong>Subject:</strong> {viewingEmail.subject}</div>
                    <div><strong>Type:</strong> {viewingEmail.type}</div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-100 p-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div
                        className="p-4"
                        dangerouslySetInnerHTML={{ __html: viewingEmail.htmlContent }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Emails list */
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-medium pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Audit trail of automated confirmation &amp; advisory emails</span>
                    <span className="text-emerald-600 font-bold">● 100% Delivery Success</span>
                  </div>

                  {emails.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                      No emails dispatched yet. Book a consultation to see the instant live email trigger!
                    </div>
                  ) : (
                    emails.map((em) => (
                      <div
                        key={em.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all flex items-center justify-between gap-4 cursor-pointer"
                        onClick={() => setViewingEmail(em)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{em.subject}</div>
                            <div className="text-[11px] text-slate-500">
                              Recipient: <span className="font-semibold text-slate-700">{em.recipient}</span> · {new Date(em.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            Delivered
                          </span>
                          <span className="text-xs text-blue-600 font-bold flex items-center gap-0.5">
                            <span>Preview</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reschedule Drawer Modal */}
        {reschedulingBooking && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm m-0">
                  Reschedule: {reschedulingBooking.fullName}
                </h4>
                <button onClick={() => setReschedulingBooking(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={handleReschedule} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Time Slot</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {['10:00 AM IST', '11:30 AM IST', '02:00 PM IST', '03:30 PM IST', '05:00 PM IST', '06:30 PM IST'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReschedulingBooking(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                  >
                    Confirm &amp; Send Reschedule Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
