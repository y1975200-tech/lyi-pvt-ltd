import React, { useState, useRef } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Cpu,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { IndustryItem, SiteSettings } from '../types.ts';
import { INDUSTRIES_LIST } from '../data/generalData.ts';

interface AdminIndustriesManagerProps {
  siteSettings: SiteSettings;
  onSaveIndustries: (industries: IndustryItem[], pageContentUpdate?: any) => Promise<void>;
  saving: boolean;
}

export const AdminIndustriesManager: React.FC<AdminIndustriesManagerProps> = ({
  siteSettings,
  onSaveIndustries,
  saving,
}) => {
  const [industries, setIndustries] = useState<IndustryItem[]>(
    siteSettings.industries && siteSettings.industries.length > 0
      ? siteSettings.industries
      : INDUSTRIES_LIST
  );

  const initialPageData = siteSettings.pageContent?.industries || {};
  const [pageHeadline, setPageHeadline] = useState<string>(
    initialPageData.headline || 'Industries We Serve'
  );
  const [pageSubheadline, setPageSubheadline] = useState<string>(
    initialPageData.subheadline ||
      'Tailored AI transformation workflows and intellectual property legal strategies designed specifically for sector regulatory realities.'
  );
  const [pageBadge, setPageBadge] = useState<string>(
    initialPageData.badge || 'SECTOR EXPERTISE'
  );
  const [bgImage, setBgImage] = useState<string>(
    initialPageData.bgImage ||
      siteSettings.industriesBgImage ||
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80'
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<IndustryItem>({
    name: '',
    challenge: '',
    aiSolution: '',
    ipSolution: '',
    caseStudy: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({
      name: '',
      challenge: '',
      aiSolution: '',
      ipSolution: '',
      caseStudy: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(industries[index]);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    if (confirm(`Remove industry sector "${industries[index].name}"?`)) {
      setIndustries((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setIndustries((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= industries.length - 1) return;
    setIndustries((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter an Industry Sector name.');
      return;
    }

    if (editingIndex !== null) {
      setIndustries((prev) => {
        const copy = [...prev];
        copy[editingIndex] = formData;
        return copy;
      });
    } else {
      setIndustries((prev) => [...prev, formData]);
    }
    setIsModalOpen(false);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to original default industry sectors?')) {
      setIndustries(INDUSTRIES_LIST);
    }
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Selected image exceeds 3MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBgImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async () => {
    await onSaveIndustries(industries, {
      industries: {
        pageId: 'industries',
        headline: pageHeadline,
        subheadline: pageSubheadline,
        badge: pageBadge,
        bgImage: bgImage,
      },
      industriesBgImage: bgImage,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-bold text-cyan-300">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dedicated Industries CMS &amp; Sector Solutions Manager</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Industries Page &amp; Sector Manager
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
            Edit the Industries page hero banner, headings, background image, and customize all industry vertical cards. Add sector-specific AI transformation solutions and intellectual property prosecution strategies.
          </p>
        </div>
      </div>

      {/* Industries Page Hero Content Editor */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Industries Page Hero Content &amp; Background</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize the main header displayed on the live Industries page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={pageBadge}
              onChange={(e) => setPageBadge(e.target.value)}
              placeholder="e.g. SECTOR EXPERTISE"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Page Headline
            </label>
            <input
              type="text"
              value={pageHeadline}
              onChange={(e) => setPageHeadline(e.target.value)}
              placeholder="e.g. Industries We Serve"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Subheadline / Description
            </label>
            <textarea
              rows={2}
              value={pageSubheadline}
              onChange={(e) => setPageSubheadline(e.target.value)}
              placeholder="Enter sector overview description..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          {/* Hero Background Image */}
          <div className="md:col-span-2 space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block">
              Hero Background Image (Local File or URL)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={bgImage}
                onChange={(e) => setBgImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white w-full"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Local</span>
              </button>
            </div>
            {bgImage && (
              <div className="relative h-24 rounded-xl overflow-hidden border border-slate-200 mt-2">
                <img
                  src={bgImage}
                  alt="Industries Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center px-4">
                  <span className="text-xs font-bold text-white">Live Hero Background Preview</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar for Sector Cards */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 font-heading">
            Industry Sectors ({industries.length})
          </h3>
          <p className="text-xs text-slate-500">
            Manage the sector cards with challenges, AI solutions, and IP defense strategies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset 6 Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Industry Sector</span>
          </button>
        </div>
      </div>

      {/* Industries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industries.map((ind, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    {ind.name}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === industries.length - 1}
                    title="Move Down"
                    className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(index)}
                    title="Edit Sector"
                    className="p-1 rounded text-blue-600 hover:bg-blue-50 cursor-pointer ml-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    title="Delete Sector"
                    className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Challenge */}
              <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 text-[11px]">
                <strong className="text-red-700 block uppercase font-bold text-[10px] tracking-wider mb-0.5">
                  Core Challenge:
                </strong>
                <span className="text-slate-700">{ind.challenge}</span>
              </div>

              {/* AI Solution */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px]">
                <strong className="text-blue-700 block uppercase font-bold text-[10px] tracking-wider mb-0.5">
                  AI Transformation:
                </strong>
                <span className="text-slate-700">{ind.aiSolution}</span>
              </div>

              {/* IP Solution */}
              <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-100 text-[11px]">
                <strong className="text-cyan-800 block uppercase font-bold text-[10px] tracking-wider mb-0.5">
                  IP Protection:
                </strong>
                <span className="text-slate-700">{ind.ipSolution}</span>
              </div>
            </div>

            {ind.caseStudy && (
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Outcome Highlight: </span>
                <span>{ind.caseStudy}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Publish Industries Changes</h4>
          <p className="text-xs text-slate-500">
            Save changes to update the live Industries page across the entire website and database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Industries...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Publish Industries</span>
            </>
          )}
        </button>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-extrabold text-white font-heading">
                  {editingIndex !== null ? 'Edit Industry Sector' : 'Add New Industry Sector'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sector / Industry Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Healthcare & Biotech"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Core Challenge *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.challenge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, challenge: e.target.value }))}
                  placeholder="e.g. Regulatory compliance bottlenecks and manual patient diagnostic reporting..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  AI Transformation Solution *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.aiSolution}
                  onChange={(e) => setFormData((prev) => ({ ...prev, aiSolution: e.target.value }))}
                  placeholder="e.g. HIPAA-compliant diagnostic triage models and automated clinical note summarization..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  IP Protection Strategy *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.ipSolution}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ipSolution: e.target.value }))}
                  placeholder="e.g. Biomedical method claims, device patents, and software algorithm trade secrets..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Case Study / Outcome Highlight (Optional)
                </label>
                <input
                  type="text"
                  value={formData.caseStudy || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caseStudy: e.target.value }))}
                  placeholder="e.g. 45% faster medical record processing across 12 diagnostic labs."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {editingIndex !== null ? 'Update Industry' : 'Add Industry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
