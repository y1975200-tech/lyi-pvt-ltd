import React from 'react';
import { PageRoute } from '../types.ts';
import { ShieldCheck } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600">Home</button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Privacy Policy</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Privacy &amp; Data Protection Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: January 1, 2026 · LockYourIdea Tech Pvt. Ltd.</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900">1. Commitment to Client Confidentiality &amp; IP Protection</h2>
          <p>
            At LockYourIdea Tech Pvt. Ltd., we hold client confidentiality and data integrity as sacred. Given our dual role as an AI engineering house and an Intellectual Property consultancy, all technical specifications, trade secrets, proprietary algorithms, and patent invention disclosures submitted through our platform or during consultations are handled under strict non-disclosure terms.
          </p>

          <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
          <p>
            When you schedule a consultation, submit an enquiry, or interact with our real-time scheduling engine, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact details: Name, work email address, telephone number, and company name.</li>
            <li>Project specifics: Desired AI services or IP filings, timeline estimates, and budget ranges.</li>
            <li>Consultation scheduling metadata: Chosen appointment times, selected meeting modes, and communication logs.</li>
          </ul>

          <h2 className="text-base font-bold text-slate-900">3. How Your Data Is Used</h2>
          <p>
            Your information is used exclusively to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Coordinate and confirm scheduled video/voice consultations in real time.</li>
            <li>Dispatch calendar invitations and advisory emails directly to your provided inbox.</li>
            <li>Prepare project proposals, prior art search reports, and engagement agreements.</li>
          </ul>

          <h2 className="text-base font-bold text-slate-900">4. No Data Selling or Third-Party Model Training</h2>
          <p>
            LockYourIdea Tech never sells, rents, or leases client personal or proprietary data to third parties. Furthermore, client codebases and patent disclosures are never used to train public foundation models without express written authorization.
          </p>

          <h2 className="text-base font-bold text-slate-900">5. Contact Our Data Protection Officer</h2>
          <p>
            For privacy-related inquiries or formal NDA execution prior to your consultation, please reach out to our legal team at <a href="mailto:hello@lockyourideatech.com" className="text-blue-600 font-bold hover:underline">hello@lockyourideatech.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
