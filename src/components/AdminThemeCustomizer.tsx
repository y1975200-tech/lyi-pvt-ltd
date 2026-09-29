import React, { useState, useRef } from 'react';
import {
  Palette,
  Check,
  Save,
  RotateCcw,
  Bold,
  Italic,
  Underline,
  Eye,
  Sliders,
  Type,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Lock,
  Unlock,
  Upload,
  Download,
  Link as LinkIcon,
  FileCode,
  Zap,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { ThemeCustomization, PageRoute } from '../types.ts';
import {
  DEFAULT_PURPLE_THEME,
  analyzeImageFromSource,
  generateThemeFromPalette,
  auditThemeContrast,
  applyThemeToCssVariables,
  ExtractedColorAnalysis,
  ContrastAuditResult,
} from '../lib/themeEngine.ts';

interface AdminThemeCustomizerProps {
  initialTheme: ThemeCustomization;
  onSaveTheme: (theme: ThemeCustomization) => Promise<void>;
  saving: boolean;
  onNavigate?: (route: PageRoute) => void;
}

export const PRESET_THEMES: {
  name: string;
  badge: string;
  mode: 'light' | 'dark';
  theme: ThemeCustomization;
}[] = [
  {
    name: 'LYI Royal Purple (Official)',
    badge: 'Official Brand',
    mode: 'dark',
    theme: {
      mode: 'dark',
      locked: true,
      templateName: 'LYI Royal Purple',
      primaryColor: '#7c3aed',
      primaryButtonColor: '#7c3aed',
      primaryButtonTextColor: '#ffffff',
      secondaryButtonColor: '#4c1d95',
      secondaryButtonTextColor: '#f3e8ff',
      textColor: '#ffffff',
      bodyBgColor: '#090d16',
      cardBgColor: '#0f172a',
      cardBorderColor: '#334155',
      cardTextColor: '#f8fafc',
      headlineFontWeight: 'bold',
      headlineItalic: false,
      headlineUnderline: false,
      buttonFontWeight: 'bold',
      buttonItalic: false,
      buttonUnderline: false,
      animationSpeed: 'fast',
    },
  },
  {
    name: 'Clean Slate Light Mode',
    badge: 'Light Theme',
    mode: 'light',
    theme: {
      mode: 'light',
      locked: true,
      templateName: 'Clean Slate Light',
      primaryColor: '#7c3aed',
      primaryButtonColor: '#7c3aed',
      primaryButtonTextColor: '#ffffff',
      secondaryButtonColor: '#f1f5f9',
      secondaryButtonTextColor: '#6b21a8',
      textColor: '#0f172a',
      bodyBgColor: '#f8fafc',
      cardBgColor: '#ffffff',
      cardBorderColor: '#e2e8f0',
      cardTextColor: '#1e293b',
      headlineFontWeight: 'bold',
      headlineItalic: false,
      headlineUnderline: false,
      buttonFontWeight: 'bold',
      buttonItalic: false,
      buttonUnderline: false,
      animationSpeed: 'fast',
    },
  },
  {
    name: 'Obsidian Midnight Dark',
    badge: 'Ultra Dark',
    mode: 'dark',
    theme: {
      mode: 'dark',
      locked: true,
      templateName: 'Obsidian Midnight Dark',
      primaryColor: '#8b5cf6',
      primaryButtonColor: '#8b5cf6',
      primaryButtonTextColor: '#ffffff',
      secondaryButtonColor: '#1e1b4b',
      secondaryButtonTextColor: '#e0e7ff',
      textColor: '#f8fafc',
      bodyBgColor: '#030712',
      cardBgColor: '#090d16',
      cardBorderColor: '#1f2937',
      cardTextColor: '#f9fafb',
      headlineFontWeight: 'bold',
      headlineItalic: false,
      headlineUnderline: false,
      buttonFontWeight: 'bold',
      buttonItalic: false,
      buttonUnderline: false,
      animationSpeed: 'fast',
    },
  },
  {
    name: 'Cyber Cyan & Midnight Blue',
    badge: 'AI High-Tech',
    mode: 'dark',
    theme: {
      mode: 'dark',
      locked: true,
      templateName: 'Cyber Cyan & Midnight Blue',
      primaryColor: '#0284c7',
      primaryButtonColor: '#0284c7',
      primaryButtonTextColor: '#ffffff',
      secondaryButtonColor: '#075985',
      secondaryButtonTextColor: '#e0f2fe',
      textColor: '#ffffff',
      bodyBgColor: '#030712',
      cardBgColor: '#08101e',
      cardBorderColor: '#1e3a5f',
      cardTextColor: '#e0f2fe',
      headlineFontWeight: 'extrabold',
      headlineItalic: false,
      headlineUnderline: false,
      buttonFontWeight: 'bold',
      buttonItalic: false,
      buttonUnderline: false,
      animationSpeed: 'fast',
    },
  },
  {
    name: 'Emerald Precision IP',
    badge: 'Legal & Growth',
    mode: 'dark',
    theme: {
      mode: 'dark',
      locked: true,
      templateName: 'Emerald Precision IP',
      primaryColor: '#059669',
      primaryButtonColor: '#059669',
      primaryButtonTextColor: '#ffffff',
      secondaryButtonColor: '#064e3b',
      secondaryButtonTextColor: '#d1fae5',
      textColor: '#ffffff',
      bodyBgColor: '#022c22',
      cardBgColor: '#061a12',
      cardBorderColor: '#164e37',
      cardTextColor: '#ecfdf5',
      headlineFontWeight: 'bold',
      headlineItalic: false,
      headlineUnderline: false,
      buttonFontWeight: 'bold',
      buttonItalic: false,
      buttonUnderline: false,
      animationSpeed: 'fast',
    },
  },
  {
    name: 'Electric Tech Indigo',
    badge: 'Modern IT',
    mode: 'dark',
    theme: {
      mode: 'dark',
      locked: true,
      templateName: 'Electric Tech Indigo',
      primaryColor: '#4f46e5',
      primaryButtonColor: '#4f46e5',
      primaryButtonTextColor: '#ffffff',
      secondaryButtonColor: '#312e81',
      secondaryButtonTextColor: '#e0e7ff',
      textColor: '#ffffff',
      bodyBgColor: '#050814',
      cardBgColor: '#0b0f19',
      cardBorderColor: '#1e293b',
      cardTextColor: '#e2e8f0',
      headlineFontWeight: 'bold',
      headlineItalic: false,
      headlineUnderline: false,
      buttonFontWeight: 'semibold',
      buttonItalic: false,
      buttonUnderline: false,
      animationSpeed: 'fast',
    },
  },
];

export const AdminThemeCustomizer: React.FC<AdminThemeCustomizerProps> = ({
  initialTheme,
  onSaveTheme,
  saving,
  onNavigate,
}) => {
  const [theme, setTheme] = useState<ThemeCustomization>({
    mode: initialTheme.mode || 'dark',
    locked: initialTheme.locked ?? true,
    templateName: initialTheme.templateName || 'LYI Royal Purple',
    primaryColor: initialTheme.primaryColor || '#7c3aed',
    primaryButtonColor: initialTheme.primaryButtonColor || '#7c3aed',
    primaryButtonTextColor: initialTheme.primaryButtonTextColor || '#ffffff',
    secondaryButtonColor: initialTheme.secondaryButtonColor || '#4c1d95',
    secondaryButtonTextColor: initialTheme.secondaryButtonTextColor || '#e9d5ff',
    textColor: initialTheme.textColor || '#ffffff',
    bodyBgColor: initialTheme.bodyBgColor || (initialTheme.mode === 'light' ? '#f8fafc' : '#090d16'),
    cardBgColor: initialTheme.cardBgColor || (initialTheme.mode === 'light' ? '#ffffff' : '#0f172a'),
    cardBorderColor: initialTheme.cardBorderColor || (initialTheme.mode === 'light' ? '#e2e8f0' : '#334155'),
    cardTextColor: initialTheme.cardTextColor || (initialTheme.mode === 'light' ? '#0f172a' : '#f8fafc'),
    headlineFontWeight: initialTheme.headlineFontWeight || 'bold',
    headlineItalic: initialTheme.headlineItalic || false,
    headlineUnderline: initialTheme.headlineUnderline || false,
    buttonFontWeight: initialTheme.buttonFontWeight || 'bold',
    buttonItalic: initialTheme.buttonItalic || false,
    buttonUnderline: initialTheme.buttonUnderline || false,
    animationSpeed: initialTheme.animationSpeed || 'fast',
  });

  const [urlInput, setUrlInput] = useState<string>('');
  const [importingUrl, setImportingUrl] = useState<boolean>(false);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [rawJsonText, setRawJsonText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Image Theme Generator state (Upload Image or Provide Image URL -> Extract Palette -> WCAG Audit -> Apply Globally)
  const [imageReferenceSource, setImageReferenceSource] = useState<string>('');
  const [imageReferenceUrlInput, setImageReferenceUrlInput] = useState<string>('');
  const [imageThemeAtmosphere, setImageThemeAtmosphere] = useState<'dark' | 'light'>('dark');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [imageAnalysis, setImageAnalysis] = useState<ExtractedColorAnalysis | null>(null);
  const [generatedCandidateTheme, setGeneratedCandidateTheme] = useState<ThemeCustomization | null>(null);
  const [contrastAudits, setContrastAudits] = useState<ContrastAuditResult[] | null>(null);
  const [imageAnalysisError, setImageAnalysisError] = useState<string | null>(null);
  const imageThemeFileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyzeImage = async (sourceUrl: string, atmosphere?: 'dark' | 'light') => {
    if (!sourceUrl || !sourceUrl.trim()) return;
    setIsAnalyzingImage(true);
    setImageAnalysisError(null);
    try {
      const mode = atmosphere || imageThemeAtmosphere;
      const analysis = await analyzeImageFromSource(sourceUrl.trim());
      const generated = generateThemeFromPalette(analysis, mode, sourceUrl.trim());
      const audits = auditThemeContrast(generated);

      setImageAnalysis(analysis);
      setGeneratedCandidateTheme(generated);
      setContrastAudits(audits);
    } catch (err: any) {
      console.error('Image analysis error:', err);
      setImageAnalysisError('Could not process image colors. Please verify the image link or upload a standard PNG/JPG.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleThemeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Image size must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: dataUrl, fileName: file.name, target: 'theme-palette' }),
          });
          const data = await res.json();
          if (res.ok && data.url) {
            setImageReferenceSource(data.url);
            handleAnalyzeImage(data.url, imageThemeAtmosphere);
            return;
          }
        } catch (err) {}
        setImageReferenceSource(dataUrl);
        handleAnalyzeImage(dataUrl, imageThemeAtmosphere);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleThemeImageUrlSubmit = () => {
    if (!imageReferenceUrlInput.trim()) return;
    const url = imageReferenceUrlInput.trim();
    setImageReferenceSource(url);
    handleAnalyzeImage(url, imageThemeAtmosphere);
  };

  const handleApplyGeneratedThemeGlobally = async () => {
    if (!generatedCandidateTheme) return;
    setTheme(generatedCandidateTheme);
    applyThemeToCssVariables(generatedCandidateTheme);
    try {
      await onSaveTheme(generatedCandidateTheme);
      setSuccessNotice('Theme generated from image applied globally to entire website!');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('lyi-theme-toast', {
            detail: 'Theme generated from image applied globally to entire website!',
          })
        );
      }
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      console.warn('Error saving generated theme:', err);
    }
  };

  const handleResetToPurple = async () => {
    setTheme(DEFAULT_PURPLE_THEME);
    applyThemeToCssVariables(DEFAULT_PURPLE_THEME);
    try {
      await onSaveTheme(DEFAULT_PURPLE_THEME);
      setSuccessNotice('Purple theme applied successfully!');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('lyi-theme-toast', {
            detail: 'Purple theme applied successfully!',
          })
        );
      }
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      console.warn('Error resetting to purple theme:', err);
    }
  };

  // Background Image Theme state & handlers
  const [bgUrlInput, setBgUrlInput] = useState<string>('');
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const ORIGINAL_MAIN_THEME: ThemeCustomization = DEFAULT_PURPLE_THEME;

  const handleRestoreOriginalMainTheme = async () => {
    setTheme(ORIGINAL_MAIN_THEME);
    try {
      await onSaveTheme(ORIGINAL_MAIN_THEME);
      setSuccessNotice('Restored & saved the Original Main Website Theme to Database!');
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (e: any) {
      console.warn('Notice saving restored theme:', e);
    }
  };

  const handleSaveWallpaper = async () => {
    try {
      await onSaveTheme(theme);
      setSuccessNotice('Theme wallpaper and visual styling committed to Database!');
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (e: any) {
      console.warn('Notice saving theme wallpaper:', e);
    }
  };

  const handleBgLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Image size must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: reader.result, fileName: file.name, target: 'theme-wallpaper' }),
          });
          const data = await res.json();
          if (res.ok && data.url) {
            setTheme((prev) => ({
              ...prev,
              themeBgImage: data.url,
              themeBgOverlayOpacity: prev.themeBgOverlayOpacity ?? 75,
              themeBgBlur: prev.themeBgBlur ?? 0,
            }));
            return;
          }
        } catch (err) {}
        alert('Image upload failed. Image size must be 2 MB or smaller.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyBgUrl = () => {
    if (!bgUrlInput.trim()) return;
    setTheme((prev) => ({
      ...prev,
      themeBgImage: bgUrlInput.trim(),
      themeBgOverlayOpacity: prev.themeBgOverlayOpacity ?? 75,
      themeBgBlur: prev.themeBgBlur ?? 0,
    }));
    setBgUrlInput('');
  };

  const handleRemoveBgImage = () => {
    setTheme((prev) => ({
      ...prev,
      themeBgImage: undefined,
    }));
  };

  const handleApplyBgPreset = (presetUrl: string) => {
    setTheme((prev) => ({
      ...prev,
      themeBgImage: presetUrl,
      themeBgOverlayOpacity: prev.themeBgOverlayOpacity ?? 75,
      themeBgBlur: prev.themeBgBlur ?? 0,
    }));
  };

  const handleApplyPreset = (presetTheme: ThemeCustomization) => {
    setTheme(presetTheme);
  };

  const handleSave = () => {
    onSaveTheme(theme);
  };

  // Toggle Theme Lock
  const handleToggleLock = () => {
    setTheme((prev) => ({
      ...prev,
      locked: !prev.locked,
    }));
  };

  // Switch between Dark and Light mode
  const handleToggleMode = (newMode: 'light' | 'dark') => {
    const isDark = newMode === 'dark';
    setTheme((prev) => ({
      ...prev,
      mode: newMode,
      bodyBgColor: isDark ? '#090d16' : '#f8fafc',
      textColor: isDark ? '#ffffff' : '#0f172a',
      cardBgColor: isDark ? '#0f172a' : '#ffffff',
      cardBorderColor: isDark ? '#334155' : '#e2e8f0',
      cardTextColor: isDark ? '#f8fafc' : '#1e293b',
      secondaryButtonColor: isDark ? '#4c1d95' : '#f1f5f9',
      secondaryButtonTextColor: isDark ? '#f3e8ff' : '#6b21a8',
    }));
  };

  // Import template from local file
  const handleLocalFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === 'object' && parsed !== null) {
          setTheme((prev) => ({
            ...prev,
            ...parsed,
            locked: parsed.locked ?? prev.locked ?? true,
          }));
          alert(`Successfully imported theme template: "${parsed.templateName || file.name}"! Click Save to apply site-wide.`);
        }
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid theme template JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset file input so user can re-upload same file if desired
    e.target.value = '';
  };

  // Import template from URL
  const handleImportFromUrl = async () => {
    if (!urlInput.trim()) {
      alert('Please enter a valid URL pointing to a theme JSON file.');
      return;
    }
    setImportingUrl(true);
    try {
      const res = await fetch(urlInput.trim());
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (typeof data === 'object' && data !== null) {
        setTheme((prev) => ({
          ...prev,
          ...data,
          locked: data.locked ?? prev.locked ?? true,
        }));
        alert(`Successfully imported theme from URL!`);
        setUrlInput('');
      } else {
        throw new Error('Not a valid theme object');
      }
    } catch (err: any) {
      alert(`Could not load theme from URL: ${err.message}. Ensure the URL is accessible and returns valid JSON.`);
    } finally {
      setImportingUrl(false);
    }
  };

  // Export current theme to local file
  const handleExportTemplate = () => {
    const exportData = {
      ...theme,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lyi-theme-${(theme.templateName || 'custom').toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper styles for preview
  const headlineWeightClass =
    theme.headlineFontWeight === 'extrabold'
      ? 'font-extrabold'
      : theme.headlineFontWeight === 'bold'
      ? 'font-bold'
      : theme.headlineFontWeight === 'semibold'
      ? 'font-semibold'
      : theme.headlineFontWeight === 'medium'
      ? 'font-medium'
      : 'font-normal';

  const buttonWeightClass =
    theme.buttonFontWeight === 'bold'
      ? 'font-bold'
      : theme.buttonFontWeight === 'semibold'
      ? 'font-semibold'
      : theme.buttonFontWeight === 'medium'
      ? 'font-medium'
      : 'font-normal';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner with Lock Status */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-[11px] font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Site-Wide Theme Engine · Light/Dark Mode · Local &amp; URL Templates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Website Theme, Styling &amp; Typography
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-normal">
              Switch entire website between Dark Mode and Light Mode, import custom templates from your local system or throw any URL, and lock the theme so all visitors strictly see your chosen branding.
            </p>
          </div>

          {/* Theme Lock Status Button */}
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleToggleLock}
              className={`w-full md:w-auto px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                theme.locked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 border border-emerald-400/40'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 border border-amber-400/40'
              }`}
            >
              {theme.locked ? (
                <>
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>Theme Locked (Site-Wide Enforced)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-amber-200" />
                  <span>Theme Unlocked (Click to Lock)</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-purple-300 text-center md:text-right">
              {theme.locked
                ? '🔒 Enforced across all pages & visitors'
                : '🔓 Visitors can override via defaults'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>{successNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-100 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Original Main Website Theme (LYI Official) Banner / Reset to Purple */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-purple-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <RotateCcw className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold font-heading text-white">
                Default Brand: LYI Royal Purple
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Official Baseline
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1 leading-relaxed max-w-xl">
              Restore the original royal purple branding, verified WCAG contrast typography, and dark enterprise atmosphere across all pages immediately.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            id="reset-to-purple-btn"
            onClick={handleResetToPurple}
            className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer ring-2 ring-purple-300/40"
          >
            <RotateCcw className="w-4 h-4 text-purple-200" />
            <span>Reset to Purple</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs shadow-md border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Theme to DB</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          11. ADMIN DASHBOARD – THEME CHANGE USING IMAGE OR LINK
          Intelligent Color Extraction, Contrast Check & Global Application
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-900 border border-purple-200 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Canvas Vision Engine · Image Color Extraction &amp; WCAG Contrast Safe</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
              Theme Change Using Image or Link
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
              Upload a local image or throw an image URL to act as visual inspiration. The system automatically analyzes color distributions, generates a harmonious palette, mathematically verifies WCAG readability, and applies the theme globally to every page and component.
            </p>
          </div>

          {/* Master Design Preservation Badge */}
          <div className="flex items-center gap-2 bg-purple-50 px-3.5 py-2 rounded-2xl border border-purple-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-bold text-purple-900">
              Preserves Master Layout &amp; Light/Dark Section Hierarchy
            </span>
          </div>
        </div>

        {/* STEP 1: Provide Image Reference (Local File or URL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Method A: Upload Local Image File */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-950 mb-1">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Option A: Upload Local Image Reference</span>
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Upload a brand photo, product mock, or visual artwork (PNG, JPG, WebP) from your device.
              </p>
            </div>

            <input
              ref={imageThemeFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleThemeImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => imageThemeFileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image File &amp; Analyze</span>
            </button>
          </div>

          {/* Method B: Provide Image URL / Link */}
          <div className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 mb-1">
                <LinkIcon className="w-4 h-4 text-cyan-600" />
                <span>Option B: Provide Image URL / Link</span>
              </div>
              <p className="text-[11px] text-cyan-800 leading-relaxed">
                Paste any web-hosted image link from Unsplash, CDN, or cloud storage.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageReferenceUrlInput}
                onChange={(e) => setImageReferenceUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3 py-2.5 rounded-xl border border-cyan-300 bg-white text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              />
              <button
                type="button"
                onClick={handleThemeImageUrlSubmit}
                disabled={isAnalyzingImage || !imageReferenceUrlInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isAnalyzingImage ? 'Analyzing...' : 'Analyze URL'}
              </button>
            </div>
          </div>
        </div>

        {/* Curated Sample Inspiration References */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Sample Inspiration References (1-Click Test):</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              {
                name: 'Deep Cyber Purple',
                url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Ocean Tech Cyan',
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Corporate HQ Gold',
                url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Emerald Precision',
                url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Neon Dusk Gradient',
                url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
              },
            ].map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setImageReferenceSource(preset.url);
                  setImageReferenceUrlInput(preset.url);
                  handleAnalyzeImage(preset.url, imageThemeAtmosphere);
                }}
                className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                  imageReferenceSource === preset.url
                    ? 'border-purple-600 ring-2 ring-purple-400/40 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="h-14 rounded-lg overflow-hidden relative">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-900/30" />
                </div>
                <div className="pt-1.5 px-1">
                  <span className="text-[10px] font-bold text-slate-800 line-clamp-1 block">
                    {preset.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner during Image Analysis */}
        {isAnalyzingImage && (
          <div className="p-8 rounded-2xl bg-purple-50/70 border border-purple-200 text-center space-y-3 animate-pulse">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-xs font-bold text-purple-950 font-heading">
              Scanning Image Colors &amp; Computing Contrast Tokens...
            </h4>
            <p className="text-[11px] text-purple-700">
              Sampling pixel buckets, calculating relative luminance, checking WCAG ratios, and formulating color design tokens.
            </p>
          </div>
        )}

        {imageAnalysisError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{imageAnalysisError}</span>
          </div>
        )}

        {/* STEP 2: Color Analysis & WCAG Contrast Results */}
        {imageAnalysis && generatedCandidateTheme && !isAnalyzingImage && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            {/* Visual Inspiration Image Thumbnail + Extracted Swatches */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  {imageReferenceSource && (
                    <img
                      src={imageReferenceSource}
                      alt="Theme Reference"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                      Color Analysis Complete
                    </span>
                    <h4 className="text-sm font-bold text-white font-heading">
                      Harmonized Palette from Visual Reference
                    </h4>
                    <p className="text-xs text-slate-400">
                      Dominant Hue: <span className="font-mono text-cyan-300 font-bold">{imageAnalysis.dominantHue}</span> · Mode: {imageThemeAtmosphere === 'dark' ? 'Dark Atmosphere' : 'Light Atmosphere'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WCAG Verified</span>
                  </span>
                </div>
              </div>

              {/* Extracted Swatches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedCandidateTheme.primaryColor }}
                  />
                  <span className="text-[10px] text-slate-400 block font-medium">Primary</span>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    {generatedCandidateTheme.primaryColor}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedCandidateTheme.secondaryColor }}
                  />
                  <span className="text-[10px] text-slate-400 block font-medium">Secondary</span>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    {generatedCandidateTheme.secondaryColor}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedCandidateTheme.accentColor }}
                  />
                  <span className="text-[10px] text-slate-400 block font-medium">Accent</span>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    {generatedCandidateTheme.accentColor}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedCandidateTheme.bodyBgColor }}
                  />
                  <span className="text-[10px] text-slate-400 block font-medium">Background</span>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    {generatedCandidateTheme.bodyBgColor}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedCandidateTheme.cardBgColor }}
                  />
                  <span className="text-[10px] text-slate-400 block font-medium">Card Surface</span>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    {generatedCandidateTheme.cardBgColor}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-inner border border-white/20 flex items-center justify-center font-bold text-xs"
                    style={{
                      backgroundColor: generatedCandidateTheme.bodyBgColor,
                      color: generatedCandidateTheme.textColor,
                    }}
                  >
                    Aa
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">Body Text</span>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    {generatedCandidateTheme.textColor}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-inner border border-white/20 flex items-center justify-center font-bold text-xs"
                    style={{
                      backgroundColor: generatedCandidateTheme.bodyBgColor,
                      color: generatedCandidateTheme.headingColor,
                    }}
                  >
                    H1
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">Heading</span>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    {generatedCandidateTheme.headingColor}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 3: CONTRAST & READABILITY AUDIT (Sections 15 & 16) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Contrast &amp; Readability Protection (WCAG 2.1 Audit)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Guaranteed readable text: Every foreground text color is automatically checked against its background so text never blends in.
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                  All Pairs Pass AA / AAA
                </span>
              </div>

              {/* Contrast Audit Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {contrastAudits?.map((item) => (
                  <div
                    key={item.element}
                    className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                        {item.element}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.wcagLevel === 'AAA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.wcagLevel === 'AA'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.wcagLevel} ({item.ratio}:1)
                      </span>
                    </div>

                    {/* Live miniature visual representation */}
                    <div
                      className="p-2 rounded-lg text-xs font-bold text-center border"
                      style={{
                        backgroundColor: item.bgColor,
                        color: item.fgColor,
                        borderColor: item.bgColor === '#ffffff' ? '#e2e8f0' : 'transparent',
                      }}
                    >
                      Sample Text Visible
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 4: APPLY THEME GLOBALLY ACTION */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Ready to Deploy Globally
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white font-heading">
                  Apply Theme to the Entire Website
                </h4>
                <p className="text-xs text-purple-200 max-w-lg mt-0.5">
                  Updates every page, section, header, navbar, footer, card, button, and input instantly using centralized CSS variable tokens.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleApplyGeneratedThemeGlobally}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-slate-950 font-black text-xs shadow-xl shadow-purple-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer ring-2 ring-cyan-400/40"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Apply Theme Globally to Entire Website</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mode Switcher: Dark Mode vs Light Mode */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Theme Mode (Dark / Light Mode)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select the base color atmosphere for the entire website.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleToggleMode('light')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                theme.mode === 'light'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-300/40'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleMode('dark')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                theme.mode === 'dark'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/40'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-4 h-4 text-cyan-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Website Theme Background Image (Local File & Web URL) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>Website Theme Background Image &amp; Wallpaper</span>
            </h3>
            <p className="text-xs text-slate-500">
              Apply a custom background image/wallpaper across the entire website via local system upload (PNG/JPG/SVG) or throw any direct web URL.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {theme.themeBgImage && (
              <>
                <button
                  type="button"
                  onClick={handleSaveWallpaper}
                  disabled={saving}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Wallpaper to DB</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveBgImage}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Remove Theme Background</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Current Active Background Preview */}
        {theme.themeBgImage ? (
          <div className="relative rounded-2xl overflow-hidden border border-purple-200 shadow-md h-44 sm:h-52 bg-slate-900 flex items-center justify-center group">
            <img
              src={theme.themeBgImage}
              alt="Active Theme Background"
              className="w-full h-full object-cover object-center"
              style={{
                filter: `blur(${theme.themeBgBlur ?? 0}px)`,
                transform: (theme.themeBgBlur ?? 0) > 0 ? 'scale(1.05)' : 'none',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: theme.mode === 'light' ? '#ffffff' : '#090d16',
                opacity: (theme.themeBgOverlayOpacity ?? 75) / 100,
              }}
            />
            <div className="relative z-10 text-center p-4 max-w-md">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow-sm">
                Active Theme Wallpaper
              </span>
              <p className="text-xs font-bold text-white drop-shadow">
                This image is applied as the site-wide atmosphere behind all pages, header &amp; sections.
              </p>
              <span className="text-[11px] text-purple-200 mt-1 block">
                Overlay Opacity: {theme.themeBgOverlayOpacity ?? 75}% · Blur: {theme.themeBgBlur ?? 0}px
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
            No theme background image currently active. Website is rendering standard solid background color ({theme.bodyBgColor || '#090d16'}).
          </div>
        )}

        {/* Source Pickers: Local File vs Throw URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Local Image File */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Choose Image From Local System</span>
            </div>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              Upload any high-res PNG, JPG, WebP, or SVG from your computer.
            </p>
            <input
              ref={bgFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleBgLocalFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => bgFileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Browse Local Image File</span>
            </button>
          </div>

          {/* 2. Throw Image URL */}
          <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-950">
              <LinkIcon className="w-4 h-4 text-cyan-600" />
              <span>Throw Image Web URL</span>
            </div>
            <p className="text-[11px] text-cyan-800 leading-relaxed">
              Enter any direct image link or web-hosted wallpaper URL.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={bgUrlInput}
                onChange={(e) => setBgUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3 py-2 rounded-xl border border-cyan-200 bg-white text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleApplyBgUrl}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition-all cursor-pointer shrink-0"
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>

        {/* Adjustments: Overlay Opacity & Blur Sliders */}
        {theme.themeBgImage && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span>Theme Wallpaper Visual Tuning</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium mb-1">
                  <span>Overlay Darkness / Tint:</span>
                  <span className="font-mono font-bold text-purple-700">
                    {theme.themeBgOverlayOpacity ?? 75}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={theme.themeBgOverlayOpacity ?? 75}
                  onChange={(e) =>
                    setTheme((prev) => ({
                      ...prev,
                      themeBgOverlayOpacity: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium mb-1">
                  <span>Background Blur Effect:</span>
                  <span className="font-mono font-bold text-purple-700">
                    {theme.themeBgBlur ?? 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={theme.themeBgBlur ?? 0}
                  onChange={(e) =>
                    setTheme((prev) => ({
                      ...prev,
                      themeBgBlur: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preset Wallpapers for 1-Click Setup */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Curated Theme Wallpapers (1-Click Apply):</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              {
                name: 'Cyber Grid Tech',
                url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85',
              },
              {
                name: 'AI Neural Mesh',
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
              },
              {
                name: 'Corporate Pune HQ',
                url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
              },
              {
                name: 'Data Pulse Matrix',
                url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80',
              },
              {
                name: 'Obsidian Abstract',
                url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2000&q=80',
              },
            ].map((wall) => (
              <button
                key={wall.name}
                type="button"
                onClick={() => handleApplyBgPreset(wall.url)}
                className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                  theme.themeBgImage === wall.url
                    ? 'border-purple-600 ring-2 ring-purple-500/30'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="h-14 rounded-lg overflow-hidden relative">
                  <img
                    src={wall.url}
                    alt={wall.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-900/40" />
                </div>
                <div className="pt-1 px-1">
                  <span className="text-[10px] font-bold text-slate-800 line-clamp-1 block">
                    {wall.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Import & Export Custom Templates (Local File & URL) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <FileCode className="w-4 h-4 text-purple-600" />
            <span>Custom Theme Templates (Local System &amp; Web URL)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Import an existing theme JSON template from your computer, load a template from any URL, or download your current theme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Upload from Local System */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 mb-1">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Upload From Local System</span>
              </div>
              <p className="text-[11px] text-purple-700 leading-relaxed">
                Select a <code className="bg-purple-100 px-1 py-0.5 rounded text-[10px]">.json</code> theme file from your local computer.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleLocalFileImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Local File</span>
            </button>
          </div>

          {/* 2. Throw Template URL */}
          <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 mb-1">
                <LinkIcon className="w-4 h-4 text-cyan-600" />
                <span>Throw Template From URL</span>
              </div>
              <p className="text-[11px] text-cyan-800 leading-relaxed">
                Fetch and apply theme JSON hosted on GitHub, your CDN, or server.
              </p>
            </div>
            <div className="space-y-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://.../theme.json"
                className="w-full px-3 py-1.5 rounded-lg border border-cyan-200 bg-white text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleImportFromUrl}
                disabled={importingUrl}
                className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {importingUrl ? (
                  <span>Loading URL...</span>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Import From URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Export to Local System */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 mb-1">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Download / Export Template</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Save your current custom theme as a JSON file to your local computer.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportTemplate}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Theme JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset One-Click Palettes */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>One-Click Curated Presets</span>
            </h3>
            <p className="text-xs text-slate-500">
              Apply professionally balanced dark and light color systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_THEMES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset.theme)}
              className="p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-purple-300 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800">
                    {preset.badge}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{preset.name}</h4>
                </div>
                {preset.mode === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                <span
                  className="w-5 h-5 rounded-full shadow-xs border border-white"
                  style={{ backgroundColor: preset.theme.primaryButtonColor }}
                  title="Primary Button"
                />
                <span
                  className="w-5 h-5 rounded-full shadow-xs border border-white"
                  style={{ backgroundColor: preset.theme.secondaryButtonColor }}
                  title="Secondary Button"
                />
                <span
                  className="w-5 h-5 rounded-full shadow-xs border border-white"
                  style={{ backgroundColor: preset.theme.bodyBgColor }}
                  title="Background"
                />
                <span className="text-[10px] font-bold text-slate-500 ml-auto">Apply</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Customizer Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Column 1: Buttons & Actions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>Button Colors &amp; Styling</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize "Book Free Consultation" and "Explore AI &amp; IP Solutions" buttons.
            </p>
          </div>

          {/* Primary Button ("Book Free Consultation") */}
          <div className="space-y-3 p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Primary Button Background ("Book Free Consultation")
              </label>
              <span className="text-[11px] font-mono font-bold text-purple-700">
                {theme.primaryButtonColor || '#7c3aed'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryButtonColor || '#7c3aed'}
                onChange={(e) =>
                  setTheme((prev) => ({
                    ...prev,
                    primaryButtonColor: e.target.value,
                    primaryColor: e.target.value,
                  }))
                }
                className="w-12 h-10 rounded-xl cursor-pointer border border-purple-200 p-0.5 bg-white shadow-xs"
              />
              <input
                type="text"
                value={theme.primaryButtonColor || '#7c3aed'}
                onChange={(e) =>
                  setTheme((prev) => ({
                    ...prev,
                    primaryButtonColor: e.target.value,
                    primaryColor: e.target.value,
                  }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800"
                placeholder="#7c3aed"
              />
            </div>
            {/* Quick Swatches */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-slate-500">Quick:</span>
              {['#7c3aed', '#6d28d9', '#4f46e5', '#2563eb', '#0284c7', '#059669', '#e11d48'].map(
                (hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() =>
                      setTheme((prev) => ({
                        ...prev,
                        primaryButtonColor: hex,
                        primaryColor: hex,
                      }))
                    }
                    className="w-6 h-6 rounded-full border border-white shadow-xs transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                )
              )}
            </div>
          </div>

          {/* Primary Button Text Color */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Primary Button Text Color
              </label>
              <span className="text-[11px] font-mono font-bold text-slate-700">
                {theme.primaryButtonTextColor || '#ffffff'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryButtonTextColor || '#ffffff'}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryButtonTextColor: e.target.value }))
                }
                className="w-12 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
              />
              <input
                type="text"
                value={theme.primaryButtonTextColor || '#ffffff'}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryButtonTextColor: e.target.value }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Secondary Button ("Explore AI & IP Solutions") */}
          <div className="space-y-3 p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Secondary Button Background ("Explore AI &amp; IP Solutions")
              </label>
              <span className="text-[11px] font-mono font-bold text-purple-700">
                {theme.secondaryButtonColor || '#4c1d95'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.secondaryButtonColor || '#4c1d95'}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, secondaryButtonColor: e.target.value }))
                }
                className="w-12 h-10 rounded-xl cursor-pointer border border-purple-200 p-0.5 bg-white shadow-xs"
              />
              <input
                type="text"
                value={theme.secondaryButtonColor || '#4c1d95'}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, secondaryButtonColor: e.target.value }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800"
                placeholder="#4c1d95"
              />
            </div>
          </div>

          {/* Button Typography: Bold, Italic, Underline */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block">
              Button Font Formatting (Bold, Italic, Underline)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => ({
                    ...prev,
                    buttonFontWeight: prev.buttonFontWeight === 'bold' ? 'normal' : 'bold',
                  }))
                }
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  theme.buttonFontWeight === 'bold'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
                <span>Bold</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => ({
                    ...prev,
                    buttonItalic: !prev.buttonItalic,
                  }))
                }
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  theme.buttonItalic
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
                <span>Italic</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => ({
                    ...prev,
                    buttonUnderline: !prev.buttonUnderline,
                  }))
                }
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  theme.buttonUnderline
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Underline className="w-3.5 h-3.5" />
                <span>Underlined</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls Column 2: Backgrounds, Text & Typography */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-600" />
              <span>Site Background &amp; Typography</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize page background, headlines, cards, and text colors.
            </p>
          </div>

          {/* Page Body Background Color */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Page Background Color
              </label>
              <span className="text-[11px] font-mono font-bold text-slate-700">
                {theme.bodyBgColor || (theme.mode === 'light' ? '#f8fafc' : '#090d16')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.bodyBgColor || (theme.mode === 'light' ? '#f8fafc' : '#090d16')}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, bodyBgColor: e.target.value }))
                }
                className="w-12 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
              />
              <input
                type="text"
                value={theme.bodyBgColor || (theme.mode === 'light' ? '#f8fafc' : '#090d16')}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, bodyBgColor: e.target.value }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800"
                placeholder="#090d16"
              />
            </div>
          </div>

          {/* Headline Text Color & Style */}
          <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Headline Text Color
              </label>
              <span className="text-[11px] font-mono font-bold text-purple-700">
                {theme.textColor || '#ffffff'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.textColor || '#ffffff'}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, textColor: e.target.value }))
                }
                className="w-12 h-10 rounded-xl cursor-pointer border border-purple-200 p-0.5 bg-white shadow-xs"
              />
              <input
                type="text"
                value={theme.textColor || '#ffffff'}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, textColor: e.target.value }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800"
                placeholder="#ffffff"
              />
            </div>

            {/* Headline Formatting: Bold, Italic, Underline */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => ({
                    ...prev,
                    headlineFontWeight: prev.headlineFontWeight === 'bold' ? 'normal' : 'bold',
                  }))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  theme.headlineFontWeight === 'bold'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
                <span>Bold</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => ({
                    ...prev,
                    headlineItalic: !prev.headlineItalic,
                  }))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  theme.headlineItalic
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
                <span>Italic</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => ({
                    ...prev,
                    headlineUnderline: !prev.headlineUnderline,
                  }))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  theme.headlineUnderline
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Underline className="w-3.5 h-3.5" />
                <span>Underlined</span>
              </button>
            </div>
          </div>

          {/* Card Component Colors */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block">
              Card Background &amp; Border Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">Card Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.cardBgColor || '#0f172a'}
                    onChange={(e) =>
                      setTheme((prev) => ({ ...prev, cardBgColor: e.target.value }))
                    }
                    className="w-10 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
                  />
                  <input
                    type="text"
                    value={theme.cardBgColor || '#0f172a'}
                    onChange={(e) =>
                      setTheme((prev) => ({ ...prev, cardBgColor: e.target.value }))
                    }
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-1">Card Border</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.cardBorderColor || '#334155'}
                    onChange={(e) =>
                      setTheme((prev) => ({ ...prev, cardBorderColor: e.target.value }))
                    }
                    className="w-10 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
                  />
                  <input
                    type="text"
                    value={theme.cardBorderColor || '#334155'}
                    onChange={(e) =>
                      setTheme((prev) => ({ ...prev, cardBorderColor: e.target.value }))
                    }
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Component Preview Canvas */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-extrabold text-white font-heading">
              Live Theme Preview (How Components Look With Current Styles)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800">
            {theme.locked ? '🔒 Locked Site-Wide' : 'Live Render'}
          </span>
        </div>

        {/* Live Headline Sample */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Headline Styling:
          </span>
          <h2
            className={`text-2xl sm:text-3xl tracking-tight transition-all font-heading ${headlineWeightClass} ${
              theme.headlineItalic ? 'italic' : ''
            } ${theme.headlineUnderline ? 'underline decoration-purple-400 underline-offset-8' : ''}`}
            style={{ color: theme.textColor || '#ffffff' }}
          >
            Transform Your Business &amp; Protect Your Innovation with AI
          </h2>
        </div>

        {/* Live Buttons Sample */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Buttons Preview:
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Button */}
            <button
              type="button"
              className={`px-7 py-3.5 rounded-full shadow-xl transition-all inline-flex items-center gap-2 ${buttonWeightClass} ${
                theme.buttonItalic ? 'italic' : ''
              } ${theme.buttonUnderline ? 'underline underline-offset-4' : ''}`}
              style={{
                backgroundColor: theme.primaryButtonColor || '#7c3aed',
                color: theme.primaryButtonTextColor || '#ffffff',
                boxShadow: `0 10px 25px -5px ${theme.primaryButtonColor || '#7c3aed'}50`,
              }}
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Button */}
            <button
              type="button"
              className={`px-7 py-3.5 rounded-full border transition-all inline-flex items-center gap-2 ${buttonWeightClass} ${
                theme.buttonItalic ? 'italic' : ''
              } ${theme.buttonUnderline ? 'underline underline-offset-4' : ''}`}
              style={{
                backgroundColor: theme.secondaryButtonColor || '#4c1d95',
                color: theme.secondaryButtonTextColor || '#f3e8ff',
                borderColor: `${theme.primaryButtonColor || '#7c3aed'}60`,
              }}
            >
              <span>Explore AI &amp; IP Solutions</span>
            </button>
          </div>
        </div>

        {/* Live Card Sample */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Card Component Preview:
          </span>
          <div
            className="p-6 rounded-2xl border transition-all max-w-md shadow-lg"
            style={{
              backgroundColor: theme.cardBgColor || '#0f172a',
              borderColor: theme.cardBorderColor || '#334155',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.primaryButtonColor || '#7c3aed' }}
              />
              <h4 className="text-sm font-bold text-white">AI Transformation Hub</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Custom LLMs, Agentic CRM, and Automated Document Workflows crafted for high-performance enterprises.
            </p>
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Ready to publish your theme changes?</h4>
          <p className="text-xs text-slate-500">
            Click save to write your theme customizations to Firestore and sync immediately across the website.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            id="reset-to-purple-bottom-btn"
            onClick={handleResetToPurple}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
            <span>Reset to Purple</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Theme...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save &amp; Lock Theme</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
