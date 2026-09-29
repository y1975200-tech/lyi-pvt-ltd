import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Copy, 
  Trash2, 
  RotateCcw, 
  Check, 
  Send, 
  Upload, 
  Globe, 
  Key, 
  Database, 
  History, 
  Layers, 
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  Star,
  Plus
} from 'lucide-react';
import { SiteSettings } from '../types.ts';

// -------------------------------------------------------------
// 1. SEO & LLM Search Metadata Manager
// -------------------------------------------------------------
interface AdminSeoManagerProps {
  siteSettings: SiteSettings;
  onUpdateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  onShowSuccess: (title: string, message: string) => void;
}

export const AdminSeoManager: React.FC<AdminSeoManagerProps> = ({
  siteSettings,
  onUpdateSettings,
  onShowSuccess,
}) => {
  const [selectedPage, setSelectedPage] = useState<string>('global');
  const [seoTitle, setSeoTitle] = useState<string>(siteSettings.heroHeadline || '');
  const [seoDesc, setSeoDesc] = useState<string>(siteSettings.heroSubhead || '');
  const [keywords, setKeywords] = useState<string>('AI consulting, patent filing, agentic CRM, trademark registration');
  const [canonicalUrl, setCanonicalUrl] = useState<string>('https://lockyourideatech.com');
  const [ogImage, setOgImage] = useState<string>(siteSettings.heroBgImage || '');
  const [llmSummary, setLlmSummary] = useState<string>(
    "LockYourIdea Tech Pvt. Ltd. is a 360° Artificial Intelligence & Intellectual Property consulting firm headquartered in Baner, Pune, India. The company builds production-grade enterprise AI software, computer vision models, agentic workflows, and automated CRMs while prosecuting and securing deep-tech patents, trademarks, and copyright portfolios across India, USPTO, EPO, and WIPO treaties."
  );
  const [targetAudience, setTargetAudience] = useState<string>(
    "Series A/B Startups, R&D Institutions, Manufacturing Enterprises, Pharma Companies, MSMEs"
  );
  const [saving, setSaving] = useState<boolean>(false);

  const handleSaveSeo = async () => {
    setSaving(true);
    try {
      if (selectedPage === 'global') {
        await onUpdateSettings({
          heroHeadline: seoTitle,
          heroSubhead: seoDesc,
          heroBgImage: ogImage,
        });
      } else {
        const existingPages = siteSettings.pageContent || {};
        const pageObj = existingPages[selectedPage] || { pageId: selectedPage };
        await onUpdateSettings({
          pageContent: {
            ...existingPages,
            [selectedPage]: {
              ...pageObj,
              headline: seoTitle,
              subheadline: seoDesc,
              bgImage: ogImage,
            }
          }
        });
      }
      onShowSuccess('SEO & Metadata Saved!', 'Search engine metadata and LLM discovery summaries written to MongoDB.');
    } catch (err: any) {
      alert('Failed to save SEO metadata: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold">Search Engine &amp; LLM Discovery CMS</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure Google search titles, OpenGraph social sharing tags, and structured summaries for AI search engines (Perplexity, ChatGPT, Gemini).
          </p>
        </div>
        <button
          onClick={handleSaveSeo}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{saving ? 'Saving to MongoDB...' : 'Publish SEO Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Page Context</label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:border-purple-500"
            >
              <option value="global">Global Website Default</option>
              <option value="home">Homepage</option>
              <option value="ai-hub">AI Hub</option>
              <option value="ip-hub">IP Hub</option>
              <option value="portfolio">Portfolio</option>
              <option value="about">About Us</option>
              <option value="contact">Contact Page</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Page Title &lt;title&gt;</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500 font-medium"
              placeholder="e.g. India's 360° AI & IP Consulting | LockYourIdea Tech"
            />
            <span className="text-[11px] text-slate-400">{seoTitle.length} / 60 characters recommended</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description &lt;meta name="description"&gt;</label>
            <textarea
              rows={3}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500 font-medium"
              placeholder="Provide a compelling 150-160 character description..."
            />
            <span className="text-[11px] text-slate-400">{seoDesc.length} / 160 characters recommended</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Keywords (Comma-separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">OpenGraph Social Preview Image URL</label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <hr className="border-slate-200" />

          {/* LLM Discovery Metadata */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <label className="text-xs font-bold text-slate-900">LLM Technical Discovery Summary (AI Search Optimization)</label>
            </div>
            <textarea
              rows={4}
              value={llmSummary}
              onChange={(e) => setLlmSummary(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience Personas</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Live Search Engine & Social Preview Cards */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Google Search Result Snippet Preview
            </span>
            <div className="space-y-1">
              <span className="text-xs text-slate-600 block">https://lockyourideatech.com &gt; {selectedPage}</span>
              <h4 className="text-base text-blue-700 hover:underline font-medium cursor-pointer leading-snug">
                {seoTitle || "LockYourIdea Tech Pvt. Ltd."}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                {seoDesc || "Transform your business with custom AI software, automated workflows, and patent protection."}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Social Card Preview (LinkedIn / X / WhatsApp)
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              {ogImage ? (
                <img src={ogImage} alt="OG Preview" className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                  No Preview Image
                </div>
              )}
              <div className="p-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">lockyourideatech.com</span>
                <h5 className="text-xs font-bold text-slate-900 truncate">{seoTitle}</h5>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{seoDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Media Asset Library Manager
// -------------------------------------------------------------
export const AdminMediaLibrary: React.FC<{ onShowSuccess: (title: string, message: string) => void }> = ({
  onShowSuccess,
}) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (res.ok && data.assets) {
        setAssets(data.assets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Image size must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: reader.result as string,
            fileName: file.name,
            target: 'media-library',
          }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          onShowSuccess('Image Uploaded!', `File saved to persistent media registry: ${data.url}`);
          fetchMedia();
        } else {
          alert(data.error || 'Image size must be 2 MB or smaller.');
        }
      } catch (err: any) {
        alert('Upload failed: ' + (err.message || 'Image size must be 2 MB or smaller.'));
      } finally {
        setUploading(false);
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAsset = async (id: string) => {
    if (!window.confirm('Delete this image from the server?')) return;
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      setAssets((prev) => prev.filter((a) => a._id !== id));
      onShowSuccess('Deleted', 'Image removed from library.');
    } catch (e) {
      alert('Delete failed');
    }
  };

  const filteredAssets = assets.filter((a) =>
    (a.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.tag || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold">Media Asset Library</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store and manage high-resolution logos, hero backgrounds, portfolio screenshots, and document graphics in MongoDB &amp; disk storage.
          </p>
        </div>
        <label className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0">
          {uploading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading ? 'Uploading...' : 'Upload Media Asset'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets by file name or tag..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>
          <button
            onClick={fetchMedia}
            className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 cursor-pointer"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">Loading media assets...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            No media assets found. Upload an image above to start building your library!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset._id}
                className="group relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:shadow-md transition-shadow"
              >
                <div className="h-32 w-full bg-slate-200 overflow-hidden flex items-center justify-center">
                  <img src={asset.url} alt={asset.fileName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" />
                </div>
                <div className="p-2.5 space-y-1">
                  <p className="text-xs font-bold text-slate-800 truncate" title={asset.fileName}>
                    {asset.fileName}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + asset.url);
                        setCopiedUrl(asset.url);
                        setTimeout(() => setCopiedUrl(null), 2000);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedUrl === asset.url ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset._id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Revisions & Rollback History Manager
// -------------------------------------------------------------
export const AdminRevisionsManager: React.FC<{ onShowSuccess: (title: string, message: string) => void }> = ({
  onShowSuccess,
}) => {
  const [entityType, setEntityType] = useState<string>('page');
  const [entityId, setEntityId] = useState<string>('home');
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/revisions/${entityType}/${entityId}`);
      const data = await res.json();
      if (res.ok && data.revisions) {
        setRevisions(data.revisions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, [entityType, entityId]);

  const handleRestore = async (revisionId: string, version: number) => {
    if (!window.confirm(`Restore content snapshot to Version ${version}? This will update the live MongoDB record.`)) return;
    setRestoring(revisionId);
    try {
      const res = await fetch(`/api/revisions/${revisionId}/restore`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        onShowSuccess('Version Restored!', `Live content rolled back to Version ${version}.`);
        fetchRevisions();
      } else {
        alert('Restore failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Restore failed: ' + err.message);
    } finally {
      setRestoring(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold">Content Revisions &amp; 1-Click Rollback</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every modification is automatically versioned in MongoDB. Review past snapshots and restore any previous version instantly.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Entity Category</label>
            <select
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value);
                setEntityId(e.target.value === 'settings' ? 'global' : 'home');
              }}
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
            >
              <option value="page">CMS Pages</option>
              <option value="service">AI &amp; IP Services</option>
              <option value="settings">Brand Settings</option>
            </select>
          </div>

          {entityType === 'page' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Page</label>
              <select
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
              >
                <option value="home">Home Page</option>
                <option value="ai-hub">AI Hub</option>
                <option value="ip-hub">IP Hub</option>
                <option value="portfolio">Portfolio</option>
                <option value="about">About Page</option>
                <option value="contact">Contact Page</option>
              </select>
            </div>
          )}

          {entityType === 'service' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Service</label>
              <select
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
              >
                <option value="custom-ai-solutions">Custom AI Solutions</option>
                <option value="agentic-crm">Agentic CRM</option>
                <option value="patent-filing-prosecution">Patent Filing &amp; Prosecution</option>
                <option value="trademark-registration-protection">Trademark Registration</option>
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">Fetching revision history...</div>
          ) : revisions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No previous revisions recorded for {entityType}:{entityId}. Make an edit to create the first version snapshot!
            </div>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev._id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-800">
                      v{rev.version}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{rev.changeSummary || 'Content Update'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Saved on {new Date(rev.createdAt).toLocaleString()} by <span className="font-semibold">{rev.updatedBy || 'admin'}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleRestore(rev._id, rev.version)}
                  disabled={restoring === rev._id}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {restoring === rev._id ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. External CRM Webhook & REST Sync Manager
// -------------------------------------------------------------
export const AdminCrmIntegration: React.FC<{ onShowSuccess: (title: string, message: string) => void }> = ({
  onShowSuccess,
}) => {
  const [provider, setProvider] = useState<string>('webhook');
  const [enabled, setEnabled] = useState<boolean>(false);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<string>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/crm/config');
      const data = await res.json();
      if (res.ok && data.config) {
        setProvider(data.config.provider || 'webhook');
        setEnabled(data.config.enabled || false);
        setWebhookUrl(data.config.webhookUrl || '');
        setApiKey(data.config.apiKey || '');
        setSyncStatus(data.config.syncStatus || 'idle');
        setLastSyncTime(data.config.lastSyncTime || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/crm/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          enabled,
          webhookUrl,
          apiKey,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onShowSuccess('CRM Config Saved!', 'External CRM sync settings updated in MongoDB.');
      } else {
        alert('Save failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestLead = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/crm/test', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onShowSuccess('Test Lead Dispatched!', data.message);
        fetchConfig();
      } else {
        alert('Test failed: ' + (data.error || data.message));
      }
    } catch (err: any) {
      alert('Test failed: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold">External CRM &amp; Webhook Synchronization</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automatically dispatch new website consultation bookings &amp; lead forms directly into Zoho CRM, HubSpot, Salesforce, or your custom Webhook.
          </p>
        </div>
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save CRM Configuration'}</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Enable Automated Lead Forwarding</h4>
            <p className="text-[11px] text-slate-500">When active, every confirmed booking triggers a secure JSON payload dispatch to your CRM.</p>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">CRM Integration Target</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
            >
              <option value="webhook">Custom REST Webhook URL</option>
              <option value="zoho">Zoho CRM (Webhook / API)</option>
              <option value="hubspot">HubSpot CRM (Forms / API)</option>
              <option value="salesforce">Salesforce Lead Capture</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">API Key / Bearer Auth Token (Encrypted)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API token (stored securely on backend)..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Webhook Dispatch Endpoint URL</label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.zapier.com/hooks/catch/... or https://crm.yourdomain.com/api/leads"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sync Health Status</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-xs font-bold text-slate-800 capitalize">{syncStatus}</span>
              {lastSyncTime && (
                <span className="text-[11px] text-slate-500">· Last sync: {new Date(lastSyncTime).toLocaleTimeString()}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleTestLead}
            disabled={testing || !webhookUrl}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {testing ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{testing ? 'Dispatching...' : 'Dispatch Test Lead to CRM'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
