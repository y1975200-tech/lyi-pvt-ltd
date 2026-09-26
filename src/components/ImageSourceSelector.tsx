import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Check, Image as ImageIcon, X, AlertCircle, Loader2, Save } from 'lucide-react';

interface Preset {
  label: string;
  url: string;
}

interface ImageSourceSelectorProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  onInstantSave?: (urlToSave: string) => void;
  presets?: Preset[];
  helperText?: string;
  previewHeightClass?: string;
  placeholderText?: string;
}

// Compress and resize image to fit comfortably within Firestore database document limits (~100-250KB)
async function compressImageForDatabase(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result as string;
      if (!rawData) {
        reject(new Error('Failed to read image data'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawData);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Attempt webp compression first, fallback to jpeg
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp') && webpData.length < 850000) {
            resolve(webpData);
            return;
          }
        } catch (e) {}

        const jpegData = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegData);
      };
      img.onerror = () => resolve(rawData);
      img.src = rawData;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export const ImageSourceSelector: React.FC<ImageSourceSelectorProps> = ({
  label,
  value,
  onChange,
  onInstantSave,
  presets = [],
  helperText,
  previewHeightClass = 'h-36',
  placeholderText = 'No image selected',
}) => {
  const [mode, setMode] = useState<'link' | 'upload'>('link');
  const [dragOver, setDragOver] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [justApplied, setJustApplied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadFileName(file.name);

    try {
      // 1. Compress image to clean, database-ready data URL
      const databaseReadyDataUrl = await compressImageForDatabase(file);

      // 2. Direct apply & database persistence
      onChange(databaseReadyDataUrl);
      if (onInstantSave) {
        onInstantSave(databaseReadyDataUrl);
        setJustApplied(true);
        setTimeout(() => setJustApplied(false), 3500);
      }

      // 3. Also send to server upload endpoint as dual backup
      try {
        await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: databaseReadyDataUrl,
            fileName: file.name,
            target: label,
          }),
        });
      } catch (e) {
        console.warn('Server upload backup non-blocking notice:', e);
      }
    } catch (err: any) {
      console.error('Failed to process image for database:', err);
      setErrorMsg('Could not process image. Please try a different photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const isLocalDataUrl = value?.startsWith('data:') || value?.startsWith('/uploads/');

  const handleApplyClick = () => {
    if (onInstantSave && value) {
      onInstantSave(value);
      setJustApplied(true);
      setTimeout(() => setJustApplied(false), 3000);
    }
  };

  return (
    <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-800 font-heading">
          {label}
        </label>
        
        {/* Toggle between Link and Local Upload */}
        <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-[11px] font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'link'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Apply via Link</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload from System</span>
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500 leading-normal">{helperText}</p>
      )}

      {errorMsg && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mode 1: URL / Link Input */}
      {mode === 'link' && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => {
                setUploadFileName(null);
                onChange(e.target.value);
              }}
              onBlur={() => {
                if (value && value.trim() && onInstantSave) {
                  onInstantSave(value.trim());
                  setJustApplied(true);
                  setTimeout(() => setJustApplied(false), 3000);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyClick();
                }
              }}
              placeholder="https://example.com/images/hero.jpg"
              className="flex-1 p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-2 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 text-xs font-semibold cursor-pointer"
                title="Clear URL"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {onInstantSave && (
              <button
                type="button"
                onClick={handleApplyClick}
                disabled={!value || isUploading}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  justApplied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 active:scale-95'
                }`}
                title="Apply and save this image directly to the live website"
              >
                {justApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Link</span>
                  </>
                )}
              </button>
            )}
          </div>

          {presets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Recommended:
              </span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUploadFileName(null);
                    onChange(p.url);
                    if (onInstantSave) {
                      onInstantSave(p.url);
                      setJustApplied(true);
                      setTimeout(() => setJustApplied(false), 3500);
                    }
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer shadow-xs ${
                    value === p.url
                      ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                  title={`Click to instantly apply ${p.label} to the website`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Local System Upload (File Picker & Drag-and-Drop) */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileInput}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
                : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/50'
            } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
              </div>
              <div className="text-xs font-bold text-slate-800">
                {isUploading ? 'Uploading and processing photo...' : 'Click to browse files from your computer'}
              </div>
              <div className="text-[11px] text-slate-500">
                {isUploading ? 'Saving image to server storage...' : 'or drag and drop your photo here (PNG, JPG, WebP up to 20MB)'}
              </div>
            </div>
          </div>

          {isLocalDataUrl && (
            <div className="flex items-center justify-between text-[11px] bg-blue-50 text-blue-700 p-2 rounded-lg border border-blue-200">
              <div className="flex items-center gap-1.5 truncate">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold truncate">
                  Loaded: {uploadFileName || (value.startsWith('/uploads/') ? value.replace('/uploads/', '') : 'Custom local photo')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadFileName(null);
                  onChange('');
                }}
                className="text-slate-500 hover:text-rose-600 font-bold ml-2 cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Live Preview of Current Image */}
      {value ? (
        <div className="space-y-2">
          <div className={`mt-2 rounded-xl overflow-hidden border border-slate-200 relative ${previewHeightClass} bg-slate-900 group`}>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if broken url
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <span className="text-[11px] text-white font-bold bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-xs">
                Live Preview
              </span>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-300 font-bold bg-slate-900/80 px-2.5 py-1 rounded-md hover:bg-slate-900 transition-colors"
              >
                View Full Size
              </a>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-slate-300 font-mono backdrop-blur-xs">
              {value.startsWith('/uploads/') ? 'Server Upload' : isLocalDataUrl ? 'Local File' : 'External Link'}
            </div>
          </div>

          {onInstantSave && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-medium">
                {justApplied ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Published live to website!
                  </span>
                ) : (
                  'Click to apply this photo directly to website'
                )}
              </span>
              <button
                type="button"
                onClick={handleApplyClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>Save &amp; Apply Photo</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={`mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-100/60 ${previewHeightClass} flex items-center justify-center text-slate-400 text-xs`}>
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            <span>{placeholderText}</span>
          </div>
        </div>
      )}
    </div>
  );
};
