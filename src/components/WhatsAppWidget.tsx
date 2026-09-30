import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircle } from 'lucide-react';

interface WhatsAppWidgetProps {
  onOpenBooking: (service?: string) => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickOptions = [
    { label: '🤖 Custom AI Solutions', action: () => onOpenBooking('Custom AI Solutions') },
    { label: '⚙️ Business Automation', action: () => onOpenBooking('AI Business Automation') },
    { label: '🎓 Corporate AI Training', action: () => onOpenBooking('Corporate AI Training') },
    { label: '📑 Patent & Trademark', action: () => onOpenBooking('Patent Filing & Prosecution') },
    { label: '📅 Book Free Consultation', action: () => onOpenBooking() },
    {
      label: '💬 Chat on WhatsApp (+91 75586 31355)',
      isExternal: true,
      href: 'https://wa.me/917558631355?text=Hi%2C%20I%20would%20like%20to%20consult%20with%20LockYourIdea%20Tech%20regarding%20AI%20and%20IP.',
    },
  ];

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-3">
      {/* WhatsApp Panel */}
      {isOpen && (
        <div className="w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-4 text-xs animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-slate-900 text-xs font-extrabold">LockYourIdea Assistant</strong>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
            👋 Hi! Welcome to <strong>LockYourIdea Tech</strong>. I'm your AI &amp; IP Assistant. You can instantly book a real-time consultation or connect with us directly on WhatsApp.
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {quickOptions.map((opt, i) => (
              opt.isExternal ? (
                <a
                  key={i}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/60 transition-colors"
                >
                  {opt.label}
                </a>
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    opt.action?.();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 font-semibold border border-slate-100 transition-all text-[11px]"
                >
                  {opt.label}
                </button>
              )
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-500" />
            <span>Instant real-time booking available 24/7</span>
          </div>
        </div>
      )}

      {/* Floating trigger FAB */}
      <button
        id="whatsapp-floating-fab-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp / Book Consultation"
        className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
          1
        </span>
        <svg viewBox="0 0 32 32" fill="white" className="w-7 h-7">
          <path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1c1.9 1 4.1 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7C28.7 8.7 23 3 16 3zm0 23.2c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1.2 1.2-3.9-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.7 0-5.9 4.8-10.7 10.7-10.7s10.7 4.8 10.7 10.7S21.9 26.2 16 26.2zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.8-1-2.4-.3-.7-.5-.6-.7-.6h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.4 4.7.7.3 1.3.5 1.8.7.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4z" />
        </svg>
      </button>
    </div>
  );
};
