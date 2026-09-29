import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Check,
  RotateCcw,
  Trash2,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { SiteSettings } from '../types.ts';

interface AdminHeaderLogoManagerProps {
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

export const AdminHeaderLogoManager: React.FC<AdminHeaderLogoManagerProps> = ({
  siteSettings,
  onUpdateSettings,
}) => {
  const currentLogoUrl = siteSettings.logoUrl || '/assets/logo.svg';
  const isDefaultLogo = !siteSettings.logoUrl || siteSettings.logoUrl === '/assets/logo.svg';

  const [logoInputUrl, setLogoInputUrl] = useState<string>('');
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string>(currentLogoUrl);
  const [logoHeight, setLogoHeight] = useState<number>(siteSettings.logoHeight || 40);
  const [logoWidth, setLogoWidth] = useState<number>(siteSettings.logoWidth || 40);
  const [savingLogo, setSavingLogo] = useState<boolean>(false);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Image size must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    setUploadingFile(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;

        // Upload to server disk storage for a permanent clean URL
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64,
            fileName: file.name,
            target: 'header-logo',
          }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setPreviewLogoUrl(data.url);
          setLogoInputUrl(data.url);
        } else {
          alert(data.error || 'Image size must be 2 MB or smaller.');
        }
      } catch (err: any) {
        alert('Image upload failed: ' + (err.message || 'Image size must be 2 MB or smaller.'));
      } finally {
        setUploadingFile(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUrlChange = (url: string) => {
    setLogoInputUrl(url);
    if (url.trim()) {
      setPreviewLogoUrl(url.trim());
    }
  };

  const handleApplyLogo = async () => {
    if (!previewLogoUrl) return;
    setSavingLogo(true);
    try {
      // 1. Direct write to MongoDB via Express API
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl: previewLogoUrl,
          logoHeight,
          logoWidth,
        }),
      });
      const data = await res.json();

      // 2. Update React parent state
      await onUpdateSettings({
        logoUrl: previewLogoUrl,
        logoHeight,
        logoWidth,
      });

      setSuccessMsg('Header logo & dimensions applied successfully and saved to database!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error saving header logo:', err);
      alert('Error saving header logo: ' + (err.message || err));
    } finally {
      setSavingLogo(false);
    }
  };

  const handleRemoveCustomLogo = async () => {
    setSavingLogo(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: '/assets/logo.svg' }),
      });
      await onUpdateSettings({ logoUrl: '/assets/logo.svg' });
      setPreviewLogoUrl('/assets/logo.svg');
      setLogoInputUrl('');
      setSuccessMsg('Custom logo removed. Original default brand badge restored.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.warn('Error removing header logo:', err);
    } finally {
      setSavingLogo(false);
    }
  };

  const handleResetToDefault = async () => {
    setSavingLogo(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl: '/assets/logo.svg',
          logoHeight: 40,
          logoWidth: 40,
        }),
      });
      await onUpdateSettings({
        logoUrl: '/assets/logo.svg',
        logoHeight: 40,
        logoWidth: 40,
      });
      setPreviewLogoUrl('/assets/logo.svg');
      setLogoHeight(40);
      setLogoWidth(40);
      setLogoInputUrl('');
      setSuccessMsg('Restored original website header logo & default dimensions (40px) successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.warn('Error resetting header logo:', err);
    } finally {
      setSavingLogo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Header Branding &amp; Identity</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              Website Header Logo Management
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
              Upload your company logo or provide an image link. The logo sits directly inside the light website header across all pages without boxes or cards.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={savingLogo}
            className="px-4 py-2.5 rounded-xl border border-purple-400/30 text-purple-200 hover:text-white hover:bg-purple-900/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Logo</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-100 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* LIVE HEADER PREVIEW (As it appears on the live website) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900 font-heading">
              Live Header Preview (Exact Navbar Appearance)
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Previewing across all pages
          </span>
        </div>

        {/* Miniature simulated website header */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-md p-3 sm:p-4 overflow-x-auto min-h-[5rem] flex items-center">
          <div className="min-w-[640px] w-full flex items-center justify-between gap-4">
            {/* Logo + Company text */}
            <div className="flex items-center gap-3">
              {previewLogoUrl && previewLogoUrl !== '/assets/logo.svg' ? (
                <img
                  src={previewLogoUrl}
                  alt="Company Logo Preview"
                  style={{
                    height: `${logoHeight}px`,
                    maxHeight: `${logoHeight}px`,
                    width: logoWidth ? `${logoWidth}px` : 'auto',
                    maxWidth: logoWidth ? `${logoWidth}px` : '400px',
                  }}
                  className="w-auto h-auto object-contain transition-all shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/logo.svg';
                  }}
                />
              ) : (
                <div
                  style={{
                    height: `${logoHeight}px`,
                    width: `${logoWidth || logoHeight}px`,
                  }}
                  className="rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20 shrink-0"
                >
                  LYI
                </div>
              )}
              <div>
                <span className="block font-medium text-slate-900 tracking-tight text-sm font-heading leading-tight">
                  {siteSettings.companyName || 'LYI Tech Pvt. Ltd.'}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {siteSettings.tagline || "India's 360° AI & IP Consulting"}
                </span>
              </div>
            </div>

            {/* Nav items */}
            <div className="flex items-center gap-3 text-xs font-normal text-slate-700">
              <span className="text-purple-600 font-medium">AI Hub</span>
              <span>IP Hub</span>
              <span>Portfolio</span>
              <span>Industries</span>
              <span>About</span>
              <span>Contact</span>
            </div>

            {/* CTA button */}
            <div className="px-4 py-2 rounded-full bg-purple-600 text-white font-medium text-xs shadow-sm">
              Book Free Consultation
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Current Logo Size: <strong>{logoHeight}px height</strong> × <strong>{logoWidth}px width</strong>. Clean integration without cards or distortion.</span>
        </div>
      </div>

      {/* LOGO SIZE CONTROLLER */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Logo Dimensions &amp; Size Controller
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Increase or decrease the logo size on the website header in real-time.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Presets:</span>
            {[
              { label: 'Tiny', h: 24, w: 24 },
              { label: 'Small', h: 32, w: 32 },
              { label: 'Default', h: 40, w: 40 },
              { label: 'Medium', h: 54, w: 54 },
              { label: 'Large', h: 72, w: 72 },
              { label: 'Extra Large', h: 96, w: 96 },
              { label: 'Banner 180w', h: 48, w: 180 },
              { label: 'Banner 260w', h: 64, w: 260 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setLogoHeight(preset.h);
                  setLogoWidth(preset.w);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  logoHeight === preset.h && logoWidth === preset.w
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {preset.label} ({preset.h}px)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Logo Height Controller */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Logo Height: <span className="text-purple-600 font-mono text-sm">{logoHeight}px</span></span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={16}
                  max={220}
                  value={logoHeight}
                  onChange={(e) => setLogoHeight(Math.max(16, Math.min(220, Number(e.target.value) || 16)))}
                  className="w-16 px-2 py-0.5 text-right rounded-lg border border-slate-200 text-xs font-mono font-bold text-purple-700 bg-white"
                />
                <span className="text-[10px] text-slate-400 font-mono">px</span>
              </div>
            </div>
            <input
              type="range"
              min={16}
              max={220}
              step={2}
              value={logoHeight}
              onChange={(e) => setLogoHeight(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>16px (Tiny)</span>
              <span>40px (Default)</span>
              <span>80px (Big)</span>
              <span>150px (Huge)</span>
              <span>220px (Max)</span>
            </div>
          </div>

          {/* Logo Width Controller */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Logo Width: <span className="text-purple-600 font-mono text-sm">{logoWidth}px</span></span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={16}
                  max={450}
                  value={logoWidth}
                  onChange={(e) => setLogoWidth(Math.max(16, Math.min(450, Number(e.target.value) || 16)))}
                  className="w-16 px-2 py-0.5 text-right rounded-lg border border-slate-200 text-xs font-mono font-bold text-purple-700 bg-white"
                />
                <span className="text-[10px] text-slate-400 font-mono">px</span>
              </div>
            </div>
            <input
              type="range"
              min={16}
              max={450}
              step={2}
              value={logoWidth}
              onChange={(e) => setLogoWidth(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>16px (Mini)</span>
              <span>40px (Default)</span>
              <span>180px (Banner)</span>
              <span>320px (Wide)</span>
              <span>450px (Max)</span>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT CONTROLS: 1. UPLOAD FILE & 2. ENTER URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Upload Local File */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 font-heading mb-1">
              <Upload className="w-4 h-4 text-purple-600" />
              <span>1. Upload Logo from Local Computer</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your company logo file (PNG, JPG, WebP, SVG). Transparent PNGs are fully supported and sit directly on the light header.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span>Browse Local Logo File</span>
          </button>
        </div>

        {/* 2. Paste Logo URL */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 font-heading mb-1">
              <LinkIcon className="w-4 h-4 text-cyan-600" />
              <span>2. Enter Logo Web URL / Link</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste any public web URL pointing to your hosted brand logo.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="url"
              value={logoInputUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {/* ACTION BAR: APPLY LOGO / REMOVE LOGO / RESET */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            {previewLogoUrl !== currentLogoUrl
              ? 'Unsaved changes to header logo'
              : 'Header logo is up to date'}
          </h4>
          <p className="text-[11px] text-slate-500">
            Clicking apply persists this logo to database and updates every page immediately.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isDefaultLogo && (
            <button
              type="button"
              onClick={handleRemoveCustomLogo}
              disabled={savingLogo}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Remove Logo</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleApplyLogo}
            disabled={savingLogo || previewLogoUrl === currentLogoUrl}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {savingLogo ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Apply Logo to Header</span>
          </button>
        </div>
      </div>
    </div>
  );
};
