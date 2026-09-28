import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Globe,
  Sparkles,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Code,
  List,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading,
  FileText,
  Eye,
  Check,
  Zap,
  Info,
  Layers,
  Tag,
  Share2
} from 'lucide-react';
import { SeoConfig, ImageSeoItem, FaqSeoItem, StructuredListItem, StructuredTableItem, InternalLinkItem, KeyFactItem, DefinitionItem } from '../types.ts';
import { DEFAULT_SEO_CONFIGS } from '../data/defaultSeoData.ts';
import { ImageSourceSelector } from './ImageSourceSelector.tsx';
import { AdminStyledField } from './AdminStyledField.tsx';

interface AdminSeoGeoManagerProps {
  seoConfigs: Record<string, SeoConfig>;
  onSaveSeoConfig: (page: string, config: SeoConfig) => Promise<void>;
  onResetSeoConfig: (page: string) => Promise<void>;
  availablePages?: { slug: string; title: string }[];
}

const DEFAULT_PAGE_OPTIONS = [
  { slug: 'home', label: 'Home Page' },
  { slug: 'ai-hub', label: 'AI Hub' },
  { slug: 'ip-hub', label: 'IP Hub' },
  { slug: 'portfolio', label: 'Portfolio' },
  { slug: 'industries', label: 'Industries' },
  { slug: 'case-studies', label: 'Case Studies' },
  { slug: 'about', label: 'About Us' },
  { slug: 'contact', label: 'Contact Us' },
];

export const AdminSeoGeoManager: React.FC<AdminSeoGeoManagerProps> = ({
  seoConfigs,
  onSaveSeoConfig,
  onResetSeoConfig,
  availablePages = [],
}) => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [activeSubTab, setActiveSubTab] = useState<
    'basic' | 'social' | 'content' | 'schema' | 'geo' | 'links' | 'keywords' | 'analysis' | 'preview' | 'matrix'
  >('basic');

  // Active page configuration form state
  const [formData, setFormData] = useState<SeoConfig>(() => {
    return seoConfigs['home'] || DEFAULT_SEO_CONFIGS['home'];
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [jsonSyntaxError, setJsonSyntaxError] = useState<string | null>(null);
  const [customPageInput, setCustomPageInput] = useState<string>('');
  const [isAddingCustomPage, setIsAddingCustomPage] = useState<boolean>(false);

  // Synchronize form when selectedPage or seoConfigs change
  useEffect(() => {
    const existing = seoConfigs[selectedPage] || DEFAULT_SEO_CONFIGS[selectedPage];
    if (existing) {
      setFormData(JSON.parse(JSON.stringify(existing)));
    } else {
      setFormData({
        page: selectedPage,
        metaTitle: `${selectedPage.toUpperCase()} | LockYourIdea Tech`,
        metaDescription: `SEO and GEO optimization settings for ${selectedPage} page at LockYourIdea Tech.`,
        slug: `/#/${selectedPage}`,
        canonicalUrl: `https://lockyourideatech.com/#/${selectedPage}`,
        robots: 'index, follow',
        ogTitle: `${selectedPage.toUpperCase()} | LockYourIdea Tech`,
        ogDescription: `Learn more about ${selectedPage} solutions at LockYourIdea Tech.`,
        ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85',
        ogUrl: `https://lockyourideatech.com/#/${selectedPage}`,
        twitterCard: 'summary_large_image',
        twitterTitle: `${selectedPage.toUpperCase()} | LockYourIdea Tech`,
        twitterDescription: `Learn more about ${selectedPage} solutions at LockYourIdea Tech.`,
        twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85',
        images: [],
        headings: { h1: '', h2s: [], h3s: [] },
        schemaType: 'WebPage',
        customJsonLd: '',
        faqs: [],
        structuredLists: [],
        structuredTables: [],
        internalLinks: [],
        entities: {
          primaryTopic: '',
          secondaryTopics: [],
          primaryEntity: '',
          relatedEntities: [],
          organizationName: 'LockYourIdea Tech Pvt. Ltd.',
          services: [],
          industries: [],
          locationsServed: [],
          expertiseAreas: [],
        },
        keywords: {
          primaryKeyword: '',
          secondaryKeywords: [],
          longTailQueries: [],
          relatedSearchTopics: [],
        },
        geo: {
          primaryAnswer: '',
          keyFacts: [],
          definitions: [],
          importantFacts: [],
          commonQuestions: [],
          relatedTopics: [],
        },
      });
    }
    setStatusMsg(null);
    setJsonSyntaxError(null);
  }, [selectedPage, seoConfigs]);

  // Combined page options list
  const pageOptions = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_PAGE_OPTIONS.forEach(opt => map.set(opt.slug, opt.label));
    availablePages.forEach(p => {
      if (!map.has(p.slug)) map.set(p.slug, p.title || p.slug);
    });
    Object.keys(seoConfigs).forEach(slug => {
      if (!map.has(slug)) map.set(slug, slug.toUpperCase());
    });
    return Array.from(map.entries()).map(([slug, label]) => ({ slug, label }));
  }, [availablePages, seoConfigs]);

  // Field change handler
  const handleFieldChange = (field: keyof SeoConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Nested object change handler
  const handleNestedChange = (parent: 'headings' | 'entities' | 'keywords' | 'geo', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value,
      },
    }));
  };

  // Validate JSON-LD syntax live
  const handleJsonLdChange = (val: string) => {
    handleFieldChange('customJsonLd', val);
    if (!val || val.trim() === '') {
      setJsonSyntaxError(null);
      return;
    }
    try {
      JSON.parse(val);
      setJsonSyntaxError(null);
    } catch (err: any) {
      setJsonSyntaxError(err.message);
    }
  };

  // Save SEO Configuration
  const handleSave = async () => {
    if (jsonSyntaxError) {
      setStatusMsg({ success: false, text: 'Please fix JSON-LD syntax errors before saving.' });
      return;
    }
    setSaving(true);
    setStatusMsg(null);
    try {
      await onSaveSeoConfig(selectedPage, formData);
      setStatusMsg({ success: true, text: `SEO & GEO configuration for "${selectedPage}" saved successfully!` });
    } catch (err: any) {
      setStatusMsg({ success: false, text: 'Failed to save configuration: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (!window.confirm(`Are you sure you want to reset SEO settings for "${selectedPage}" to system defaults?`)) return;
    try {
      await onResetSeoConfig(selectedPage);
      setStatusMsg({ success: true, text: `Reset SEO settings for "${selectedPage}" to system defaults.` });
    } catch (err: any) {
      setStatusMsg({ success: false, text: 'Failed to reset settings: ' + err.message });
    }
  };

  // Real-time Optimization Quality Checker calculation
  const analysisResults = useMemo(() => {
    const checks: { category: 'SEO' | 'GEO'; title: string; status: 'PASS' | 'WARNING' | 'NEEDS ATTENTION'; message: string }[] = [];

    // Meta Title Check
    const titleLen = formData.metaTitle?.length || 0;
    if (titleLen >= 40 && titleLen <= 65) {
      checks.push({ category: 'SEO', title: 'Meta Title Length', status: 'PASS', message: `Optimal length (${titleLen} chars)` });
    } else if (titleLen > 0) {
      checks.push({ category: 'SEO', title: 'Meta Title Length', status: 'WARNING', message: `Title is ${titleLen} chars (Recommended: 50-60 chars)` });
    } else {
      checks.push({ category: 'SEO', title: 'Meta Title Missing', status: 'NEEDS ATTENTION', message: 'Meta title is empty' });
    }

    // Meta Description Check
    const descLen = formData.metaDescription?.length || 0;
    if (descLen >= 130 && descLen <= 170) {
      checks.push({ category: 'SEO', title: 'Meta Description Length', status: 'PASS', message: `Optimal length (${descLen} chars)` });
    } else if (descLen > 0) {
      checks.push({ category: 'SEO', title: 'Meta Description Length', status: 'WARNING', message: `Description is ${descLen} chars (Recommended: 150-160 chars)` });
    } else {
      checks.push({ category: 'SEO', title: 'Meta Description Missing', status: 'NEEDS ATTENTION', message: 'Meta description is empty' });
    }

    // Canonical Check
    if (formData.canonicalUrl && formData.canonicalUrl.startsWith('http')) {
      checks.push({ category: 'SEO', title: 'Canonical Tag', status: 'PASS', message: 'Valid canonical URL defined' });
    } else {
      checks.push({ category: 'SEO', title: 'Canonical Tag', status: 'WARNING', message: 'Canonical URL is missing or incomplete' });
    }

    // Robots Check
    if (formData.robots) {
      checks.push({ category: 'SEO', title: 'Robots Directives', status: 'PASS', message: `Configured as "${formData.customRobots || formData.robots}"` });
    } else {
      checks.push({ category: 'SEO', title: 'Robots Directives', status: 'WARNING', message: 'Robots directive not set' });
    }

    // OpenGraph & Twitter Check
    if (formData.ogTitle && formData.ogImage) {
      checks.push({ category: 'SEO', title: 'Social Metadata (OG & Twitter)', status: 'PASS', message: 'Open Graph title & social image configured' });
    } else {
      checks.push({ category: 'SEO', title: 'Social Metadata', status: 'WARNING', message: 'OG title or social image missing' });
    }

    // Heading Structure Check
    if (formData.headings?.h1) {
      checks.push({ category: 'SEO', title: 'Primary Heading (H1)', status: 'PASS', message: 'Single clear H1 defined' });
    } else {
      checks.push({ category: 'SEO', title: 'Primary Heading (H1)', status: 'NEEDS ATTENTION', message: 'No H1 defined for page' });
    }

    // GEO Direct Answer Check
    if (formData.geo?.primaryAnswer && formData.geo.primaryAnswer.length >= 20) {
      checks.push({ category: 'GEO', title: 'Direct Answer Availability', status: 'PASS', message: 'Factual direct answer defined' });
    } else {
      checks.push({ category: 'GEO', title: 'Direct Answer Availability', status: 'NEEDS ATTENTION', message: 'No direct factual answer defined for LLMs' });
    }

    // GEO Key Facts Check
    if (formData.geo?.keyFacts && formData.geo.keyFacts.length >= 2) {
      checks.push({ category: 'GEO', title: 'Key Facts Data', status: 'PASS', message: `${formData.geo.keyFacts.length} structured facts configured` });
    } else {
      checks.push({ category: 'GEO', title: 'Key Facts Data', status: 'WARNING', message: 'Fewer than 2 key facts defined' });
    }

    // FAQ System Check
    if (formData.faqs && formData.faqs.length >= 1) {
      checks.push({ category: 'GEO', title: 'FAQ & Q&A Structure', status: 'PASS', message: `${formData.faqs.length} FAQ entries available` });
    } else {
      checks.push({ category: 'GEO', title: 'FAQ Structure', status: 'WARNING', message: 'No FAQs added for machine summarization' });
    }

    // Entity Clarity Check
    if (formData.entities?.primaryTopic && formData.entities?.primaryEntity) {
      checks.push({ category: 'GEO', title: 'Entity Clarity', status: 'PASS', message: `Primary entity "${formData.entities.primaryEntity}" specified` });
    } else {
      checks.push({ category: 'GEO', title: 'Entity Clarity', status: 'WARNING', message: 'Primary topic or entity missing' });
    }

    // Calculate Optimization Completeness Percentage
    const passCount = checks.filter(c => c.status === 'PASS').length;
    const completenessScore = Math.round((passCount / checks.length) * 100);

    return { checks, completenessScore };
  }, [formData]);

  return (
    <div className="space-y-6">
      {/* Top Header & Page Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-purple-400 uppercase mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>SEO, GEO & LLM Optimization CMS</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Page Optimization Control Center</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage meta tags, OpenGraph, dynamic JSON-LD schemas, direct answers, and machine-readable context per page.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

        {/* Status Message Notification Toast */}
        {statusMsg && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
              statusMsg.success
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Page Selector & Custom Page Toggle */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 whitespace-nowrap">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Select Target Website Page:</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isAddingCustomPage ? (
              <select
                value={selectedPage}
                onChange={e => setSelectedPage(e.target.value)}
                className="flex-1 sm:w-64 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-purple-500 transition-colors"
              >
                {pageOptions.map(opt => (
                  <option key={opt.slug} value={opt.slug}>
                    {opt.label} ({opt.slug})
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2 flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Enter page slug (e.g. privacy)"
                  value={customPageInput}
                  onChange={e => setCustomPageInput(e.target.value.toLowerCase().replace(/[^a-z0-9-/]+/g, ''))}
                  className="w-full bg-slate-800 border border-purple-500 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customPageInput.trim()) {
                      setSelectedPage(customPageInput.trim());
                      setIsAddingCustomPage(false);
                      setCustomPageInput('');
                    }
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500 cursor-pointer"
                >
                  Add
                </button>
              </div>
            )}

            <button
              onClick={() => setIsAddingCustomPage(!isAddingCustomPage)}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              title="Add custom page route"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 ml-auto">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Editing Page ID: <strong className="text-purple-300 font-mono">{selectedPage}</strong></span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 no-scrollbar">
        {[
          { id: 'basic', label: 'Basic SEO', icon: Globe },
          { id: 'social', label: 'Social (OG/Twitter)', icon: Share2 },
          { id: 'content', label: 'Headings & Alt Text', icon: Heading },
          { id: 'schema', label: 'Structured Data', icon: Code },
          { id: 'geo', label: 'GEO / LLM Optimization', icon: Bot },
          { id: 'links', label: 'Internal Links', icon: LinkIcon },
          { id: 'keywords', label: 'Search Topics', icon: Tag },
          { id: 'analysis', label: 'Quality Checker', icon: ShieldCheck },
          { id: 'preview', label: 'Search Preview', icon: Eye },
          { id: 'matrix', label: 'SEO vs LLM Matrix', icon: Info },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 1: BASIC SEO */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'basic' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Basic Search Engine Metadata</span>
          </h3>

          {/* Meta Title Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Meta Title (<span className="text-purple-300 font-mono">{formData.metaTitle?.length || 0}</span> characters)
              </label>
              <span className="text-[11px] text-slate-400">Target Range: 50–60 characters</span>
            </div>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={e => handleFieldChange('metaTitle', e.target.value)}
              placeholder="e.g. LockYourIdea Tech | 360° AI Software & Patent Prosecution"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            {formData.metaTitle?.length > 65 && (
              <p className="text-[11px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Title exceeds 65 characters and may be truncated by search engines in desktop snippets.
              </p>
            )}
          </div>

          {/* Meta Description Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Meta Description (<span className="text-purple-300 font-mono">{formData.metaDescription?.length || 0}</span> characters)
              </label>
              <span className="text-[11px] text-slate-400">Target Range: 150–160 characters</span>
            </div>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={e => handleFieldChange('metaDescription', e.target.value)}
              placeholder="e.g. Custom AI software engineering, business automation, agentic CRM, patent filing, trademark registration, and IP defense under one platform in Pune, India."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
            />
            {formData.metaDescription?.length > 170 && (
              <p className="text-[11px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Description exceeds 170 characters and may wrap into truncated text in SERPs.
              </p>
            )}
          </div>

          {/* Canonical URL & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Canonical URL / Route Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => handleFieldChange('slug', e.target.value)}
                placeholder="/#/ai-hub"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Canonical Tag Destination</label>
              <input
                type="text"
                value={formData.canonicalUrl}
                onChange={e => handleFieldChange('canonicalUrl', e.target.value)}
                placeholder="https://lockyourideatech.com/#/ai-hub"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Robots Directive Settings */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-200">Robots Meta Directive</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'index, follow',
                'index, nofollow',
                'noindex, follow',
                'noindex, nofollow',
              ].map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleFieldChange('robots', opt)}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    formData.robots === opt
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-medium text-slate-400">Advanced / Custom Robots String (Optional)</label>
              <input
                type="text"
                value={formData.customRobots || ''}
                onChange={e => handleFieldChange('customRobots', e.target.value)}
                placeholder="e.g. index, follow, max-snippet:-1, max-image-preview:large"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 2: SOCIAL SEO (OG / TWITTER) */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'social' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>OpenGraph & Social Media Metadata</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OpenGraph Settings */}
            <div className="space-y-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">OpenGraph (Facebook, LinkedIn, WhatsApp)</h4>
              
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">OG Title</label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={e => handleFieldChange('ogTitle', e.target.value)}
                  placeholder="Title for social previews"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">OG Description</label>
                <textarea
                  rows={2}
                  value={formData.ogDescription}
                  onChange={e => handleFieldChange('ogDescription', e.target.value)}
                  placeholder="Description for social cards"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <ImageSourceSelector
                label="OG Share Image"
                value={formData.ogImage}
                onChange={url => handleFieldChange('ogImage', url)}
                previewHeightClass="h-28"
                helperText="Recommended image dimensions: 1200 x 630 px"
              />

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">OG Target URL</label>
                <input
                  type="text"
                  value={formData.ogUrl}
                  onChange={e => handleFieldChange('ogUrl', e.target.value)}
                  placeholder="https://lockyourideatech.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Twitter Card Settings */}
            <div className="space-y-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Twitter / X Card Metadata</h4>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Twitter Card Type</label>
                <select
                  value={formData.twitterCard}
                  onChange={e => handleFieldChange('twitterCard', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                >
                  <option value="summary_large_image">summary_large_image (Large Hero Card)</option>
                  <option value="summary">summary (Small Thumbnail)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Twitter Title</label>
                <input
                  type="text"
                  value={formData.twitterTitle}
                  onChange={e => handleFieldChange('twitterTitle', e.target.value)}
                  placeholder="Title for Twitter share card"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Twitter Description</label>
                <textarea
                  rows={2}
                  value={formData.twitterDescription}
                  onChange={e => handleFieldChange('twitterDescription', e.target.value)}
                  placeholder="Description for Twitter share card"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <ImageSourceSelector
                label="Twitter Card Image"
                value={formData.twitterImage}
                onChange={url => handleFieldChange('twitterImage', url)}
                previewHeightClass="h-28"
                helperText="Twitter summary card preview image"
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 3: HEADINGS & ALT TEXT */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'content' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Heading className="w-4 h-4 text-purple-400" />
            <span>Semantic Headings Hierarchy & Alt Text Management</span>
          </h3>

          {/* Heading Structure Configuration */}
          <div className="space-y-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-bold text-slate-200">Page Heading Hierarchy Configuration</h4>
            
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Primary H1 Heading</label>
              <input
                type="text"
                value={formData.headings?.h1 || ''}
                onChange={e => handleNestedChange('headings', 'h1', e.target.value)}
                placeholder="e.g. Transform Your Business & Protect Your Innovation with AI"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            {!formData.headings?.h1 && (
              <p className="text-[11px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Warning: Page lacks a primary H1 heading declaration.
              </p>
            )}
          </div>

          {/* Image Alt Text Manager */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>Page Image Alt Text Registry</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Ensure all website images have descriptive, natural alt text. Avoid keyword stuffing or generic labels like "image1".</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newImg: ImageSeoItem = {
                    id: `img_${Date.now()}`,
                    url: '',
                    altText: '',
                    title: '',
                    description: '',
                  };
                  handleFieldChange('images', [...(formData.images || []), newImg]);
                }}
                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image Metadata</span>
              </button>
            </div>

            {(!formData.images || formData.images.length === 0) ? (
              <div className="p-4 bg-slate-950 text-slate-500 text-xs rounded-xl text-center border border-slate-800">
                No image alt text entries configured yet. Click "Add Image Metadata" above to define descriptive alt texts.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.images.map((imgItem, idx) => (
                  <div key={imgItem.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-300 font-mono">Image #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.images.filter((_, i) => i !== idx);
                          handleFieldChange('images', updated);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <ImageSourceSelector
                        label="Image URL"
                        value={imgItem.url}
                        onChange={url => {
                          const updated = [...formData.images];
                          updated[idx] = { ...updated[idx], url };
                          handleFieldChange('images', updated);
                        }}
                        previewHeightClass="h-24"
                      />

                      <div className="space-y-2">
                        <div>
                          <label className="text-[11px] text-slate-300">Descriptive Alt Text</label>
                          <input
                            type="text"
                            value={imgItem.altText}
                            onChange={e => {
                              const updated = [...formData.images];
                              updated[idx] = { ...updated[idx], altText: e.target.value };
                              handleFieldChange('images', updated);
                            }}
                            placeholder="Describe image context naturally..."
                            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-300">Optional Image Title</label>
                          <input
                            type="text"
                            value={imgItem.title || ''}
                            onChange={e => {
                              const updated = [...formData.images];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              handleFieldChange('images', updated);
                            }}
                            placeholder="Image tooltip / title"
                            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 4: STRUCTURED DATA (JSON-LD) */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'schema' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code className="w-4 h-4 text-purple-400" />
            <span>Structured Data & JSON-LD Schema</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Schema.org Target Type</label>
              <select
                value={formData.schemaType}
                onChange={e => handleFieldChange('schemaType', e.target.value)}
                className="w-full md:w-72 bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
              >
                <option value="Organization">Organization (Company Main)</option>
                <option value="WebSite">WebSite (Search Console Site)</option>
                <option value="WebPage">WebPage (General Content Page)</option>
                <option value="Service">Service (Service Line Description)</option>
                <option value="Article">Article / Insight</option>
                <option value="FAQPage">FAQPage (Question & Answer)</option>
                <option value="BreadcrumbList">BreadcrumbList</option>
                <option value="LocalBusiness">LocalBusiness (Pune Headquarters)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">Custom JSON-LD Code Editor</label>
                <span className="text-[11px] text-slate-400">Must be valid JSON formatting</span>
              </div>

              <textarea
                rows={12}
                value={formData.customJsonLd || ''}
                onChange={e => handleJsonLdChange(e.target.value)}
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "LockYourIdea Tech Pvt. Ltd.",\n  "url": "https://lockyourideatech.com"\n}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline-none leading-relaxed"
              />

              {jsonSyntaxError && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>JSON Syntax Error: {jsonSyntaxError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 5: GEO / LLM OPTIMIZATION */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'geo' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Generative Engine Optimization (GEO) & LLM Readability</span>
          </h3>

          {/* Primary Direct Answer */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200">
              Primary Direct Answer (Concise Factual Answer for AI System Extraction)
            </label>
            <textarea
              rows={3}
              value={formData.geo?.primaryAnswer || ''}
              onChange={e => handleNestedChange('geo', 'primaryAnswer', e.target.value)}
              placeholder="e.g. LockYourIdea Tech is India's 360° AI software development and Intellectual Property consulting company headquartered in Baner, Pune."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none leading-relaxed"
            />
          </div>

          {/* Structured Key Facts (Key / Value Pairs) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200">Structured Key Facts (Machine Parsable Fact/Value Pairs)</h4>
              <button
                type="button"
                onClick={() => {
                  const newFact: KeyFactItem = { fact: '', value: '' };
                  const currentFacts = formData.geo?.keyFacts || [];
                  handleNestedChange('geo', 'keyFacts', [...currentFacts, newFact]);
                }}
                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Fact Pair
              </button>
            </div>

            {(!formData.geo?.keyFacts || formData.geo.keyFacts.length === 0) ? (
              <div className="p-4 bg-slate-950 text-slate-500 text-xs rounded-xl text-center border border-slate-800">
                No key facts configured yet. Click "Add Fact Pair" above to provide structured facts.
              </div>
            ) : (
              <div className="space-y-2">
                {formData.geo.keyFacts.map((kf, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="Fact Name (e.g. HQ Location)"
                      value={kf.fact}
                      onChange={e => {
                        const updated = [...formData.geo.keyFacts];
                        updated[idx] = { ...updated[idx], fact: e.target.value };
                        handleNestedChange('geo', 'keyFacts', updated);
                      }}
                      className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Fact Value (e.g. Baner, Pune, India)"
                      value={kf.value}
                      onChange={e => {
                        const updated = [...formData.geo.keyFacts];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        handleNestedChange('geo', 'keyFacts', updated);
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.geo.keyFacts.filter((_, i) => i !== idx);
                        handleNestedChange('geo', 'keyFacts', updated);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Definitions Term/Value Pairs */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200">Glossary & Term Definitions</h4>
              <button
                type="button"
                onClick={() => {
                  const newDef: DefinitionItem = { term: '', definition: '' };
                  const currentDefs = formData.geo?.definitions || [];
                  handleNestedChange('geo', 'definitions', [...currentDefs, newDef]);
                }}
                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Definition
              </button>
            </div>

            {(!formData.geo?.definitions || formData.geo.definitions.length === 0) ? (
              <div className="p-4 bg-slate-950 text-slate-500 text-xs rounded-xl text-center border border-slate-800">
                No terms defined yet. Click "Add Definition" above.
              </div>
            ) : (
              <div className="space-y-2">
                {formData.geo.definitions.map((def, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="Term (e.g. Agentic CRM)"
                      value={def.term}
                      onChange={e => {
                        const updated = [...formData.geo.definitions];
                        updated[idx] = { ...updated[idx], term: e.target.value };
                        handleNestedChange('geo', 'definitions', updated);
                      }}
                      className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Definition text..."
                      value={def.definition}
                      onChange={e => {
                        const updated = [...formData.geo.definitions];
                        updated[idx] = { ...updated[idx], definition: e.target.value };
                        handleNestedChange('geo', 'definitions', updated);
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.geo.definitions.filter((_, i) => i !== idx);
                        handleNestedChange('geo', 'definitions', updated);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 6: INTERNAL LINKS */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'links' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-purple-400" />
              <span>Internal Link Relationship Management</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newLink: InternalLinkItem = { anchorText: '', destination: '', relationship: 'primary' };
                handleFieldChange('internalLinks', [...(formData.internalLinks || []), newLink]);
              }}
              className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Internal Link
            </button>
          </div>

          {(!formData.internalLinks || formData.internalLinks.length === 0) ? (
            <div className="p-6 bg-slate-950 text-slate-500 text-xs rounded-xl text-center border border-slate-800">
              No internal links configured for this page. Click "Add Internal Link" above to build topic relationships.
            </div>
          ) : (
            <div className="space-y-3">
              {formData.internalLinks.map((link, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] text-slate-400">Anchor Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Patent Filing & Prosecution"
                      value={link.anchorText}
                      onChange={e => {
                        const updated = [...formData.internalLinks];
                        updated[idx] = { ...updated[idx], anchorText: e.target.value };
                        handleFieldChange('internalLinks', updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] text-slate-400">Destination Route</label>
                    <input
                      type="text"
                      placeholder="e.g. #/service/patent-filing-prosecution"
                      value={link.destination}
                      onChange={e => {
                        const updated = [...formData.internalLinks];
                        updated[idx] = { ...updated[idx], destination: e.target.value };
                        handleFieldChange('internalLinks', updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.internalLinks.filter((_, i) => i !== idx);
                      handleFieldChange('internalLinks', updated);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-2 cursor-pointer mt-5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 7: SEARCH TOPICS & KEYWORDS */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'keywords' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Tag className="w-4 h-4 text-purple-400" />
            <span>Target Search Topics & Keywords</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Primary Keyword / Search Topic</label>
              <input
                type="text"
                value={formData.keywords?.primaryKeyword || ''}
                onChange={e => handleNestedChange('keywords', 'primaryKeyword', e.target.value)}
                placeholder="e.g. AI and IP Consulting Firm Pune"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Secondary Keywords (Comma-separated)</label>
              <input
                type="text"
                value={(formData.keywords?.secondaryKeywords || []).join(', ')}
                onChange={e => handleNestedChange('keywords', 'secondaryKeywords', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Custom AI Software, Patent Lawyers Pune, Agentic CRM"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Long-Tail Search Queries (Comma-separated)</label>
              <textarea
                rows={2}
                value={(formData.keywords?.longTailQueries || []).join(', ')}
                onChange={e => handleNestedChange('keywords', 'longTailQueries', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Best AI software development and patent filing company in Pune India"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 8: OPTIMIZATION QUALITY CHECKER */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'analysis' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>SEO & GEO Optimization Completeness Analysis</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time audit calculation for page metadata, structure, and machine readability.</p>
            </div>

            {/* Completeness Badge */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Implementation Status</div>
                <div className="text-base font-bold text-emerald-400">{analysisResults.completenessScore}%</div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/40 flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                {analysisResults.completenessScore}%
              </div>
            </div>
          </div>

          {/* Audit Checks List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysisResults.checks.map((chk, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-3">
                {chk.status === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {chk.status === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                {chk.status === 'NEEDS ATTENTION' && <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{chk.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        chk.status === 'PASS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : chk.status === 'WARNING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {chk.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{chk.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 9: SEARCH ENGINE PREVIEW */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'preview' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Search Engine SERP Preview Box</span>
          </h3>

          {/* Google Search Result Preview Card */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-200 max-w-2xl space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#202124]">
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold flex items-center gap-0.5 justify-center text-[9px]">LYI</span>
              <span className="text-xs text-[#202124] font-normal">lockyourideatech.com</span>
              <span className="text-xs text-[#5f6368]">› {selectedPage}</span>
            </div>

            <h4 className="text-lg text-[#1a0dab] font-normal hover:underline cursor-pointer leading-snug pt-0.5">
              {formData.metaTitle || `${selectedPage.toUpperCase()} | LockYourIdea Tech`}
            </h4>

            <p className="text-xs text-[#4d5156] leading-relaxed pt-1">
              {formData.metaDescription || 'No description entered. Google will extract page text content automatically.'}
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
            <p><strong>Note:</strong> Search engines dynamically determine exact title formatting and text snippets based on user query context.</p>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* SUB-TAB 10: SEO VS LLM PARAMETERS MATRIX */}
      {/* ----------------------------------------------------------------------------------- */}
      {activeSubTab === 'matrix' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Info className="w-4 h-4 text-purple-400" />
            <span>SEO vs. LLM Ranking Parameters Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-purple-300">
                  <th className="p-3 font-bold">Parameter</th>
                  <th className="p-3 font-bold">Traditional SEO Impact</th>
                  <th className="p-3 font-bold">LLM / GEO Relevance</th>
                  <th className="p-3 font-bold">Optimization Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Meta Title (&lt;title&gt;)</td>
                  <td className="p-3">Important for page relevance & search result title</td>
                  <td className="p-3">Helps identify page topic & identity</td>
                  <td className="p-3">Keep concise (50–60 chars), descriptive & include primary topic</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Meta Description</td>
                  <td className="p-3">Influences search result presentation & CTR</td>
                  <td className="p-3">Provides concise summary for extraction</td>
                  <td className="p-3">Target 150–160 characters with factual summary</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Image Alt Text</td>
                  <td className="p-3">Accessibility & image search ranking</td>
                  <td className="p-3">Helps vision models interpret image context</td>
                  <td className="p-3">Describe actual image naturally without keyword stuffing</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Heading Hierarchy (H1–H6)</td>
                  <td className="p-3">Communicates content layout structure</td>
                  <td className="p-3">Helps models understand section breakdown</td>
                  <td className="p-3">Use single H1 per page and logical level ordering</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Structured Data / JSON-LD</td>
                  <td className="p-3">Enables search rich snippets</td>
                  <td className="p-3">Provides machine-readable factual context</td>
                  <td className="p-3">Use valid JSON-LD schemas matching page schema type</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Direct Answers & FAQ</td>
                  <td className="p-3">Supports question search visibility</td>
                  <td className="p-3">Makes answers easy to parse & summarize</td>
                  <td className="p-3">Provide concise, factual Q&A pairs</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs text-purple-300">
            <strong>Informational Disclaimer:</strong> SEO and GEO/LLM optimization improve crawlability, content understanding, and machine-readable context, but no metadata or CMS setting can guarantee specific search rankings or AI citations.
          </div>
        </div>
      )}
    </div>
  );
};
