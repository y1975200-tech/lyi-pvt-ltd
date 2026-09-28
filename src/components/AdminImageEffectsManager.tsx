import React, { useState } from 'react';
import { SiteSettings, ImageEffectsConfig, ImageEffectsMap } from '../types.ts';
import { defaultImageEffects } from '../utils/imageEffectsHelper.ts';
import { ImageWithEffects } from './ImageWithEffects.tsx';
import { Sliders, RotateCcw, Save, Image as ImageIcon, Eye, Check, Sparkles, Layers } from 'lucide-react';

interface AdminImageEffectsManagerProps {
  siteSettings: SiteSettings;
  onSave: (updatedSettings: SiteSettings) => Promise<void>;
}

interface ImageOption {
  key: string;
  name: string;
  category: 'Page Backgrounds' | 'Service Cards' | 'Portfolio Cards' | 'Industry Cards' | 'Client Logos' | 'Other Cards';
  imageUrl: string;
}

export const AdminImageEffectsManager: React.FC<AdminImageEffectsManagerProps> = ({
  siteSettings,
  onSave,
}) => {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Local state for all image effects map
  const [imageEffectsMap, setImageEffectsMap] = useState<ImageEffectsMap>(
    siteSettings?.imageEffects || {}
  );

  // Compile full list of image targets available in CMS
  const pageImageOptions: ImageOption[] = [
    {
      key: 'page_home_hero',
      name: 'Home Page Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.pageContent?.home?.bgImage || siteSettings?.heroBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'page_ai_hub_hero',
      name: 'AI Hub Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.aiHubBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'page_ip_hub_hero',
      name: 'IP Hub Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.ipHubBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'page_portfolio_hero',
      name: 'Portfolio Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.portfolioBgImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'page_industries_hero',
      name: 'Industries Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.industriesBgImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'page_case_studies_hero',
      name: 'Case Studies Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.caseStudiesBgImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'page_about_hero',
      name: 'About Us Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.aboutBgImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'page_contact_hero',
      name: 'Contact Hero Background',
      category: 'Page Backgrounds',
      imageUrl: siteSettings?.contactBgImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'section_enquiry_bg',
      name: 'Enquiry & Booking Section Background',
      category: 'Page Backgrounds',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'section_footer_bg',
      name: 'Footer Section Background',
      category: 'Page Backgrounds',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'ai_card_bg',
      name: 'AI Division Card (Homepage)',
      category: 'Other Cards',
      imageUrl: siteSettings?.aiHubBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      key: 'ip_card_bg',
      name: 'IP Division Card (Homepage)',
      category: 'Other Cards',
      imageUrl: siteSettings?.ipHubBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Services
  const serviceOptions: ImageOption[] = (siteSettings?.services || []).map((s) => ({
    key: `service_card_${s.id}`,
    name: `Service: ${s.title}`,
    category: 'Service Cards',
    imageUrl: s.imageUrl || s.bgImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  }));

  // Portfolio
  const portfolioOptions: ImageOption[] = (siteSettings?.portfolio || []).map((p) => ({
    key: `portfolio_card_${p.id}`,
    name: `Portfolio: ${p.title}`,
    category: 'Portfolio Cards',
    imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  }));

  // Industries
  const industryOptions: ImageOption[] = (siteSettings?.industries || []).map((ind, idx) => ({
    key: `industry_card_${ind.id || idx}`,
    name: `Industry: ${ind.name}`,
    category: 'Industry Cards',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  }));

  // Client Logos
  const logoOptions: ImageOption[] = (siteSettings?.clientLogos || []).map((l, idx) => ({
    key: `client_logo_${l.id || idx}`,
    name: `Client Logo: ${l.name}`,
    category: 'Client Logos',
    imageUrl: l.logoUrl || '/assets/logo.svg',
  }));

  const allOptions = [
    ...pageImageOptions,
    ...serviceOptions,
    ...portfolioOptions,
    ...industryOptions,
    ...logoOptions,
  ];

  const [selectedKey, setSelectedKey] = useState<string>(allOptions[0].key);

  const activeOption = allOptions.find((o) => o.key === selectedKey) || allOptions[0];

  // Get current active config or default
  const activeEffects: ImageEffectsConfig = {
    ...defaultImageEffects(),
    ...(imageEffectsMap[selectedKey] || {}),
  };

  const updateActiveEffects = (updater: (prev: ImageEffectsConfig) => ImageEffectsConfig) => {
    setImageEffectsMap((prevMap) => ({
      ...prevMap,
      [selectedKey]: updater({ ...defaultImageEffects(), ...(prevMap[selectedKey] || {}) }),
    }));
  };

  const handleResetEffects = () => {
    setImageEffectsMap((prevMap) => ({
      ...prevMap,
      [selectedKey]: defaultImageEffects(),
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const updated = {
        ...siteSettings,
        imageEffects: imageEffectsMap,
      };
      await onSave(updated);
      setSuccessMsg('Image appearance settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert('Error saving image effects: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30">
            <Sliders className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Image Effects & Appearance Manager</h1>
          <p className="text-xs text-slate-400">
            Remove automatic dark filters & customize manual per-image controls for background & card images.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetEffects}
            className="px-4 py-2.5 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset Selected Image</span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-3">
          <Check className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SELECTOR BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Select Target Image to Customize:
        </label>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {['Page Backgrounds', 'Service Cards', 'Portfolio Cards', 'Industry Cards', 'Client Logos', 'Other Cards'].map((category) => {
            const items = allOptions.filter((o) => o.category === category);
            if (items.length === 0) return null;
            return (
              <optgroup key={category} label={category}>
                {items.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: PREVIEW & CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: LIVE PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Live Interactive Preview</span>
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {activeOption.name}
              </span>
            </div>

            {/* PREVIEW IMAGE COMPARISON BOX */}
            <div className="space-y-4">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950">
                <ImageWithEffects
                  src={activeOption.imageUrl}
                  alt={activeOption.name}
                  effects={activeEffects}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* ORIGINAL COMPARISON BOX */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Original Image (Default / No Effects):
                </span>
                <div className="h-20 w-full rounded-xl overflow-hidden border border-slate-700 relative">
                  <img
                    src={activeOption.imageUrl}
                    alt="Original"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* STATUS SUMMARY */}
            <div className="pt-2 text-xs text-slate-400 space-y-1 font-mono border-t border-slate-800">
              <div className="flex justify-between">
                <span>Blur:</span>
                <span className={activeEffects.blurEnabled ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                  {activeEffects.blurEnabled ? `${activeEffects.blurAmount}px` : 'OFF'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Overlay:</span>
                <span className={activeEffects.overlayEnabled ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                  {activeEffects.overlayEnabled ? `${activeEffects.overlayOpacity}% (${activeEffects.overlayColor})` : 'OFF'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Brightness:</span>
                <span className={activeEffects.brightnessEnabled ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {activeEffects.brightnessEnabled ? `${activeEffects.brightnessAmount}%` : 'OFF (100%)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Contrast:</span>
                <span className={activeEffects.contrastEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {activeEffects.contrastEnabled ? `${activeEffects.contrastAmount}%` : 'OFF (100%)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Zoom Scale:</span>
                <span className={activeEffects.zoomEnabled ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                  {activeEffects.zoomEnabled ? `${activeEffects.zoomScale}x` : 'OFF'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INDIVIDUAL EFFECT CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Effect Controls for "{activeOption.name}"</span>
            </h2>

            {/* 1. OVERLAY CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Solid Color Overlay</h3>
                  <p className="text-xs text-slate-500">Apply a solid color layer over the image</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.overlayEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, overlayEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.overlayEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Overlay Color:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={activeEffects.overlayColor || '#000000'}
                        onChange={(e) =>
                          updateActiveEffects((prev) => ({ ...prev, overlayColor: e.target.value }))
                        }
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                      />
                      <span className="text-xs font-mono text-slate-600">{activeEffects.overlayColor || '#000000'}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Overlay Opacity: {activeEffects.overlayOpacity || 50}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeEffects.overlayOpacity ?? 50}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, overlayOpacity: parseInt(e.target.value, 10) }))
                      }
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. GRADIENT OVERLAY CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Gradient Overlay</h3>
                  <p className="text-xs text-slate-500">Apply linear gradient blend over the image</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.gradientEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, gradientEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.gradientEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Start Color:</label>
                    <input
                      type="color"
                      value={activeEffects.gradientColor1 || '#000000'}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, gradientColor1: e.target.value }))
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">End Color:</label>
                    <input
                      type="color"
                      value={activeEffects.gradientColor2 || '#000000'}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, gradientColor2: e.target.value }))
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Gradient Opacity: {activeEffects.gradientOpacity || 50}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeEffects.gradientOpacity ?? 50}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, gradientOpacity: parseInt(e.target.value, 10) }))
                      }
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Direction:</label>
                    <select
                      value={activeEffects.gradientDirection || 'to bottom'}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, gradientDirection: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="to bottom">Top to Bottom (to bottom)</option>
                      <option value="to top">Bottom to Top (to top)</option>
                      <option value="to right">Left to Right (to right)</option>
                      <option value="to left">Right to Left (to left)</option>
                      <option value="135deg">Diagonal (135deg)</option>
                      <option value="45deg">Diagonal (45deg)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 3. BLUR CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Blur Effect</h3>
                  <p className="text-xs text-slate-500">Apply Gaussian blur filter</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.blurEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, blurEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.blurEnabled && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Blur Amount: {activeEffects.blurAmount || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={activeEffects.blurAmount ?? 0}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, blurAmount: parseInt(e.target.value, 10) }))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 4. BRIGHTNESS CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Brightness Adjustment</h3>
                  <p className="text-xs text-slate-500">Modify brightness percentage (100% = normal)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.brightnessEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, brightnessEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.brightnessEnabled && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Brightness: {activeEffects.brightnessAmount ?? 100}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={activeEffects.brightnessAmount ?? 100}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, brightnessAmount: parseInt(e.target.value, 10) }))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 5. CONTRAST CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Contrast Adjustment</h3>
                  <p className="text-xs text-slate-500">Modify contrast percentage (100% = normal)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.contrastEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, contrastEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.contrastEnabled && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Contrast: {activeEffects.contrastAmount ?? 100}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={activeEffects.contrastAmount ?? 100}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, contrastAmount: parseInt(e.target.value, 10) }))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 6. SATURATION CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Saturation Adjustment</h3>
                  <p className="text-xs text-slate-500">Modify color saturation (100% = normal)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.saturationEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, saturationEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.saturationEnabled && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Saturation: {activeEffects.saturationAmount ?? 100}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={activeEffects.saturationAmount ?? 100}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, saturationAmount: parseInt(e.target.value, 10) }))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 7. GRAYSCALE CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Grayscale Filter</h3>
                  <p className="text-xs text-slate-500">Convert image to black & white / grayscale</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.grayscaleEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, grayscaleEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.grayscaleEnabled && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Grayscale: {activeEffects.grayscaleAmount ?? 0}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeEffects.grayscaleAmount ?? 0}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, grayscaleAmount: parseInt(e.target.value, 10) }))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 8. OPACITY CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Image Opacity</h3>
                  <p className="text-xs text-slate-500">Control transparency of the image</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.opacityEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, opacityEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.opacityEnabled && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Opacity: {activeEffects.opacityAmount ?? 100}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeEffects.opacityAmount ?? 100}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, opacityAmount: parseInt(e.target.value, 10) }))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 9. TINT CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Color Tint Layer</h3>
                  <p className="text-xs text-slate-500">Apply color blend mode over the image</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.tintEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, tintEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.tintEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Tint Color:</label>
                    <input
                      type="color"
                      value={activeEffects.tintColor || '#38bdf8'}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, tintColor: e.target.value }))
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Tint Opacity: {activeEffects.tintOpacity || 30}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeEffects.tintOpacity ?? 30}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, tintOpacity: parseInt(e.target.value, 10) }))
                      }
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 10. SHADOW CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Image Drop Shadow</h3>
                  <p className="text-xs text-slate-500">Add box shadow intensity around the image</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.shadowEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, shadowEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.shadowEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Shadow Intensity: {activeEffects.shadowIntensity || 10}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={activeEffects.shadowIntensity ?? 10}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, shadowIntensity: parseInt(e.target.value, 10) }))
                      }
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Shadow Color:</label>
                    <input
                      type="color"
                      value={activeEffects.shadowColor || '#000000'}
                      onChange={(e) =>
                        updateActiveEffects((prev) => ({ ...prev, shadowColor: e.target.value }))
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 11. ZOOM / SCALE CONTROL */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Zoom / Scale Effect</h3>
                  <p className="text-xs text-slate-500">Scale factor for the image (1.0x = normal)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeEffects.zoomEnabled || false}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, zoomEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {activeEffects.zoomEnabled && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Scale Factor: {(activeEffects.zoomScale ?? 1.0).toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.05"
                    value={activeEffects.zoomScale ?? 1.0}
                    onChange={(e) =>
                      updateActiveEffects((prev) => ({ ...prev, zoomScale: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
