import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Globe,
  RotateCcw,
  Check,
  Building,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Maximize2,
  Undo2,
  Sliders,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { ClientLogoItem } from '../types.ts';
import { DEFAULT_CLIENT_LOGOS } from '../data/generalData.ts';
import { ClientLogoScroller } from './ClientLogoScroller.tsx';

interface AdminClientLogosManagerProps {
  initialLogos: ClientLogoItem[];
  onSaveLogos: (logos: ClientLogoItem[]) => Promise<void>;
  saving: boolean;
}

// Standard default dimensions for clean corporate logo display
const DEFAULT_LOGO_WIDTH = 140;
const DEFAULT_LOGO_HEIGHT = 48;

// Preset gallery of colorful corporate logos for quick 1-click addition
const PRESET_SAMPLE_LOGOS: {
  name: string;
  tag: string;
  accentColor: string;
  logoUrl: string;
  websiteUrl: string;
  width: number;
  height: number;
}[] = [
  {
    name: 'Google Cloud Partner',
    tag: 'AI & Cloud Infrastructure',
    accentColor: '#4285F4',
    websiteUrl: 'https://cloud.google.com',
    width: 140,
    height: 48,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><text x="12" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%234285F4">G</text><text x="32" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%23EA4335">o</text><text x="46" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%23FBBC05">o</text><text x="60" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%234285F4">g</text><text x="74" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%2334A853">l</text><text x="80" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%23EA4335">e</text><text x="96" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="%235F6368">Cloud</text></svg>',
  },
  {
    name: 'Microsoft Azure',
    tag: 'Cloud & AI Platform',
    accentColor: '#00a4ef',
    websiteUrl: 'https://azure.microsoft.com',
    width: 140,
    height: 48,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><rect x="12" y="14" width="10" height="10" fill="%23f25022"/><rect x="24" y="14" width="10" height="10" fill="%237fba00"/><rect x="12" y="26" width="10" height="10" fill="%2300a4ef"/><rect x="24" y="26" width="10" height="10" fill="%23ffb900"/><text x="42" y="33" font-family="Arial,sans-serif" font-weight="600" font-size="18" fill="%23505050">Microsoft</text></svg>',
  },
  {
    name: 'Wipro Technologies',
    tag: 'Enterprise IT & Cloud',
    accentColor: '#5846f6',
    websiteUrl: 'https://wipro.com',
    width: 140,
    height: 48,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><text x="15" y="33" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="%235846f6">wipro</text><circle cx="95" cy="20" r="4.5" fill="%23f97316"/><circle cx="107" cy="24" r="5" fill="%2310b981"/><circle cx="120" cy="30" r="5.5" fill="%2306b6d4"/></svg>',
  },
  {
    name: 'Razorpay',
    tag: 'FinTech & Payments',
    accentColor: '#0c83fe',
    websiteUrl: 'https://razorpay.com',
    width: 140,
    height: 48,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><path d="M15,10 L35,10 L25,35 L45,35 L30,48 L35,28 L20,28 Z" fill="%230c83fe"/><text x="48" y="33" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="%230c2340">Razorpay</text></svg>',
  },
  {
    name: 'Tech Mahindra',
    tag: 'Next-Gen IT & Telecom',
    accentColor: '#e11d48',
    websiteUrl: 'https://techmahindra.com',
    width: 140,
    height: 48,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><rect x="10" y="14" width="22" height="22" rx="4" fill="%23e11d48"/><text x="17" y="31" font-family="Arial,sans-serif" font-weight="bold" font-size="16" fill="white">M</text><text x="38" y="24" font-family="Arial,sans-serif" font-weight="900" font-size="14" fill="%230f172a">Tech</text><text x="38" y="38" font-family="Arial,sans-serif" font-weight="900" font-size="14" fill="%23e11d48">Mahindra</text></svg>',
  },
  {
    name: 'Zomato Enterprise',
    tag: 'FoodTech & Logistics',
    accentColor: '#cb202d',
    websiteUrl: 'https://zomato.com',
    width: 140,
    height: 48,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><rect x="10" y="10" width="130" height="30" rx="8" fill="%23cb202d"/><text x="75" y="31" font-family="Arial,sans-serif" font-weight="900" font-style="italic" font-size="20" fill="white" text-anchor="middle">zomato</text></svg>',
  },
];

// Preset gallery of square (1:1 ratio) brand logos with colorful emblems
const PRESET_SQUARE_LOGOS: {
  name: string;
  tag: string;
  accentColor: string;
  logoUrl: string;
  websiteUrl: string;
  width: number;
  height: number;
}[] = [
  {
    name: 'Google',
    tag: 'Cloud & AI Infrastructure',
    accentColor: '#4285F4',
    websiteUrl: 'https://google.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23ffffff"/><path d="M48 32.5c0-1.2-.1-2.4-.3-3.5H32v7h9c-.4 2.1-1.6 3.9-3.4 5.1v4.2h5.5C46.3 42.3 48 37.8 48 32.5z" fill="%234285F4"/><path d="M32 49c4.6 0 8.4-1.5 11.2-4.1l-5.5-4.2c-1.5 1-3.5 1.7-5.7 1.7-4.4 0-8.1-3-9.5-7h-5.7v4.4C20.6 45.4 25.8 49 32 49z" fill="%2334A853"/><path d="M22.5 35.4c-.4-1-.6-2.1-.6-3.4s.2-2.4.6-3.4v-4.4h-5.7C15.6 26.6 15 29.2 15 32s.6 5.4 1.8 7.8l5.7-4.4z" fill="%23FBBC05"/><path d="M32 21.6c2.5 0 4.7.9 6.5 2.5l4.8-4.8C40.4 16.7 36.6 15 32 15c-6.2 0-11.4 3.6-15.2 9.2l5.7 4.4c1.4-4 5.1-7 9.5-7z" fill="%23EA4335"/></svg>',
  },
  {
    name: 'Microsoft',
    tag: 'Enterprise Software & Azure',
    accentColor: '#00a4ef',
    websiteUrl: 'https://microsoft.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23ffffff"/><rect x="16" y="16" width="14" height="14" rx="2" fill="%23f25022"/><rect x="34" y="16" width="14" height="14" rx="2" fill="%237fba00"/><rect x="16" y="34" width="14" height="14" rx="2" fill="%2300a4ef"/><rect x="34" y="34" width="14" height="14" rx="2" fill="%23ffb900"/></svg>',
  },
  {
    name: 'OpenAI',
    tag: 'Generative AI Platform',
    accentColor: '#10a37f',
    websiteUrl: 'https://openai.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%2310a37f"/><path d="M32 16a12 12 0 0 1 11.3 8 7 7 0 0 1 3.7 9.5 7 7 0 0 1-2 8.7 12 12 0 0 1-13 5.8 7 7 0 0 1-8.5-3.7 7 7 0 0 1-2.5-9.3A12 12 0 0 1 32 16z" fill="none" stroke="%23ffffff" stroke-width="3" stroke-linejoin="round"/></svg>',
  },
  {
    name: 'Apple',
    tag: 'Hardware & OS Ecosystem',
    accentColor: '#000000',
    websiteUrl: 'https://apple.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23000000"/><path d="M36.5 15c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.6 1.4-6.1 3.2-1.3 1.5-2.5 4-2.1 6.3 2.3.2 4.7-1.1 6.1-2.9zm6.6 13.9c-.1-.1-4-2.3-3.9-6.9.1-5.5 4.6-8.2 4.8-8.3-2.6-3.8-6.6-4.2-8-4.3-3.4-.3-6.6 2-8.3 2s-4.4-1.9-7.2-1.9c-3.7.1-7.1 2.2-9 5.5-3.9 6.7-1 16.7 2.8 22.1 1.8 2.7 4 5.6 6.9 5.5 2.8-.1 3.9-1.8 7.3-1.8s4.3 1.8 7.3 1.7c3-.1 4.9-2.7 6.7-5.4 2.1-3.1 3-6.1 3-6.3-.1 0-5.8-2.2-5.7-8.2z" fill="%23ffffff" transform="translate(6, 6) scale(0.8)"/></svg>',
  },
  {
    name: 'NVIDIA',
    tag: 'Accelerated AI & GPUs',
    accentColor: '#76b900',
    websiteUrl: 'https://nvidia.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%2376b900"/><path d="M22 24c4-3 10-3 14 0 3 2 4 6 4 9 0 6-5 11-11 11-4 0-8-2-10-6v7H15V19h4v5zm4 10c0 4 3 7 7 7s7-3 7-7-3-7-7-7-7 3-7 7z" fill="%23ffffff" transform="translate(4, 2)"/></svg>',
  },
  {
    name: 'Meta',
    tag: 'Open-Source AI & Llama',
    accentColor: '#0668E1',
    websiteUrl: 'https://meta.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%230668E1"/><path d="M22 25c-3.5 0-6.5 3-7.5 7.5-1 4.5.5 8 3.5 9.5 2.5 1 5.5.5 8-2.5l6-7 6 7c2.5 3 5.5 3.5 8 2.5 3-1.5 4.5-5 3.5-9.5-1-4.5-4-7.5-7.5-7.5-3.5 0-6.5 2.5-8 5l-2-2.5-2 2.5c-1.5-2.5-4.5-5-8-5z" fill="none" stroke="%23ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    name: 'Tata Consultancy',
    tag: 'Global Tech & Engineering',
    accentColor: '#004b93',
    websiteUrl: 'https://tcs.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23004b93"/><path d="M16 22h32v6H35v20h-6V28H16v-6z" fill="%23ffffff"/><circle cx="32" cy="18" r="3" fill="%23ffffff"/></svg>',
  },
  {
    name: 'Infosys',
    tag: 'Enterprise Digital Transformation',
    accentColor: '#007cc3',
    websiteUrl: 'https://infosys.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23007cc3"/><text x="32" y="42" font-family="Arial,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle">infy</text></svg>',
  },
  {
    name: 'Amazon Web Services',
    tag: 'Cloud & Deep Learning',
    accentColor: '#232f3e',
    websiteUrl: 'https://aws.amazon.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23232f3e"/><text x="32" y="36" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="%23ffffff" text-anchor="middle">a</text><path d="M20 42c6 4 16 4 24-1" stroke="%23ff9900" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M43 38l3 3-4 2" fill="%23ff9900"/></svg>',
  },
  {
    name: 'Reliance',
    tag: 'Telecom, Energy & Tech',
    accentColor: '#003366',
    websiteUrl: 'https://ril.com',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23003366"/><text x="32" y="40" font-family="Arial,sans-serif" font-weight="900" font-size="22" fill="%23ffffff" text-anchor="middle">RIL</text><circle cx="32" cy="18" r="3" fill="%23ff3333"/></svg>',
  },
  {
    name: 'ISRO',
    tag: 'Space Exploration & Tech',
    accentColor: '#ff6600',
    websiteUrl: 'https://isro.gov.in',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23ff6600"/><circle cx="32" cy="32" r="20" fill="%23ffffff"/><text x="32" y="38" font-family="Arial,sans-serif" font-weight="900" font-size="14" fill="%23003399" text-anchor="middle">ISRO</text></svg>',
  },
  {
    name: 'DRDO',
    tag: 'Defense Innovation & Patents',
    accentColor: '#1a365d',
    websiteUrl: 'https://drdo.gov.in',
    width: 64,
    height: 64,
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%231a365d"/><circle cx="32" cy="32" r="20" fill="%23b45309"/><text x="32" y="38" font-family="Arial,sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">DRDO</text></svg>',
  },
];

export const AdminClientLogosManager: React.FC<AdminClientLogosManagerProps> = ({
  initialLogos,
  onSaveLogos,
  saving,
}) => {
  const [logos, setLogos] = useState<ClientLogoItem[]>(
    initialLogos && initialLogos.length > 0 ? initialLogos : DEFAULT_CLIENT_LOGOS
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Active logo input method: 'local' (file upload from local system) | 'url' (direct URL or SVG data URI)
  const [uploadSource, setUploadSource] = useState<'local' | 'url'>('local');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const [applyDimensionScope, setApplyDimensionScope] = useState<'single' | 'all'>('single');

  // Batch dimension toolbar state
  const [batchTargetId, setBatchTargetId] = useState<string>('all');
  const [batchWidth, setBatchWidth] = useState<number>(DEFAULT_LOGO_WIDTH);
  const [batchHeight, setBatchHeight] = useState<number>(DEFAULT_LOGO_HEIGHT);

  const [formData, setFormData] = useState<Partial<ClientLogoItem>>({
    name: '',
    logoUrl: '',
    tag: 'Enterprise Client',
    websiteUrl: '',
    accentColor: '#7c3aed',
    width: DEFAULT_LOGO_WIDTH,
    height: DEFAULT_LOGO_HEIGHT,
    fit: 'contain',
  });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setUploadSource('local');
    setApplyDimensionScope('single');
    setFormData({
      name: '',
      logoUrl: '',
      tag: 'Enterprise Client',
      websiteUrl: '',
      accentColor: '#7c3aed',
      width: DEFAULT_LOGO_WIDTH,
      height: DEFAULT_LOGO_HEIGHT,
      fit: 'contain',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setApplyDimensionScope('single');
    const item = logos[index];
    setFormData({
      ...item,
      width: item.width || DEFAULT_LOGO_WIDTH,
      height: item.height || DEFAULT_LOGO_HEIGHT,
      fit: item.fit || 'contain',
    });
    setUploadSource(item.logoUrl?.startsWith('data:') ? 'local' : 'url');
    setIsModalOpen(true);
  };

  // Apply batch dimensions from toolbar to One Logo or All Logos
  const handleApplyToolbarDimensions = (scope: 'selected' | 'all') => {
    if (scope === 'all' || batchTargetId === 'all') {
      setLogos((prev) =>
        prev.map((l) => ({
          ...l,
          width: batchWidth,
          height: batchHeight,
        }))
      );
      showNotification(`Applied dimensions (${batchWidth}×${batchHeight}px) to ALL ${logos.length} logos!`);
    } else {
      const targetLogo = logos.find((l) => l.id === batchTargetId);
      if (targetLogo) {
        setLogos((prev) =>
          prev.map((l) =>
            l.id === batchTargetId ? { ...l, width: batchWidth, height: batchHeight } : l
          )
        );
        showNotification(`Applied dimensions (${batchWidth}×${batchHeight}px) to "${targetLogo.name}"`);
      }
    }
  };

  // 1-Click Apply Quick Dimension & Square Presets to All Logos or Selected Logo
  const handleApplyQuickPresetDimensions = (w: number, h: number, fit: 'contain' | 'cover' | 'fill' = 'contain') => {
    setBatchWidth(w);
    setBatchHeight(h);
    if (batchTargetId === 'all') {
      setLogos((prev) =>
        prev.map((l) => ({
          ...l,
          width: w,
          height: h,
          fit,
        }))
      );
      showNotification(`⚡ Applied ${w}×${h}px square/dimension preset to ALL ${logos.length} logos!`);
    } else {
      const targetLogo = logos.find((l) => l.id === batchTargetId);
      setLogos((prev) =>
        prev.map((l) =>
          l.id === batchTargetId ? { ...l, width: w, height: h, fit } : l
        )
      );
      showNotification(`Applied ${w}×${h}px preset to "${targetLogo?.name || 'Selected Logo'}"`);
    }
  };

  // Handle local file selection and convert to Base64 Data URL
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Image size must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const cleanedName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData: reader.result,
              fileName: file.name,
              target: 'client-logo',
            }),
          });
          const data = await res.json();
          if (res.ok && data.url) {
            setFormData((prev) => ({
              ...prev,
              logoUrl: data.url,
              name: prev.name && prev.name.trim().length > 0 ? prev.name : cleanedName,
            }));
            showNotification(`Uploaded logo file: ${file.name}`);
            return;
          } else {
            alert(data.error || 'Image size must be 2 MB or smaller.');
          }
        } catch (err: any) {
          alert('Upload failed: ' + (err.message || 'Image size must be 2 MB or smaller.'));
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Undo / reset dimensions to default in modal
  const handleResetDimensions = () => {
    setFormData((prev) => ({
      ...prev,
      width: DEFAULT_LOGO_WIDTH,
      height: DEFAULT_LOGO_HEIGHT,
      fit: 'contain',
    }));
    showNotification('Logo dimensions undone back to default (140×48px)');
  };

  // Quick reset dimension directly from card in list
  const handleQuickResetCardDimension = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const logoName = logos[index].name;
    setLogos((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        width: DEFAULT_LOGO_WIDTH,
        height: DEFAULT_LOGO_HEIGHT,
        fit: 'contain',
      };
      return copy;
    });
    showNotification(`Undid dimension for "${logoName}" back to default 140×48px`);
  };

  // Undo all logos' dimensions back to default standard in bulk
  const handleResetAllDimensions = () => {
    if (confirm('Undo all custom dimensions and reset every logo to standard 140×48px?')) {
      setLogos((prev) =>
        prev.map((l) => ({
          ...l,
          width: DEFAULT_LOGO_WIDTH,
          height: DEFAULT_LOGO_HEIGHT,
          fit: 'contain',
        }))
      );
      showNotification('All logo dimensions successfully reset to default 140×48px');
    }
  };

  const handleToggleActive = (index: number) => {
    const item = logos[index];
    const willBeActive = item.active === false;
    setLogos((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        active: willBeActive,
      };
      return copy;
    });
    showNotification(`Logo "${item.name}" is now ${willBeActive ? 'ACTIVE (visible in scroller)' : 'HIDDEN from scroller'}`);
  };

  const handleDelete = (index: number) => {
    const item = logos[index];
    if (confirm(`Remove "${item.name}" from client logo scroller?`)) {
      setLogos((prev) => prev.filter((_, i) => i !== index));
      showNotification(`Removed "${item.name}"`);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setLogos((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= logos.length - 1) return;
    setLogos((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.logoUrl) {
      alert('Please provide both Company Name and a valid Logo (uploaded file or URL).');
      return;
    }

    const item: ClientLogoItem = {
      id: editingIndex !== null ? logos[editingIndex].id : `logo-${Date.now()}`,
      name: formData.name.trim(),
      logoUrl: formData.logoUrl.trim(),
      tag: formData.tag?.trim() || 'Enterprise Client',
      websiteUrl: formData.websiteUrl?.trim() || '',
      link: formData.websiteUrl?.trim() || '',
      altText: formData.altText?.trim() || formData.name.trim(),
      title: formData.title?.trim() || formData.name.trim(),
      accentColor: formData.accentColor || '#7c3aed',
      width: Number(formData.width) || DEFAULT_LOGO_WIDTH,
      height: Number(formData.height) || DEFAULT_LOGO_HEIGHT,
      fit: formData.fit || 'contain',
      active: formData.active !== undefined ? formData.active : true,
      order: editingIndex !== null ? (logos[editingIndex].order ?? editingIndex) : logos.length,
    };

    if (applyDimensionScope === 'all') {
      // Apply the chosen dimensions and fit to ALL logos in the carousel
      setLogos((prev) => {
        let updated = prev.map((l, i) => {
          if (editingIndex !== null && i === editingIndex) {
            return item;
          }
          return {
            ...l,
            width: item.width,
            height: item.height,
            fit: item.fit,
          };
        });
        if (editingIndex === null) {
          updated = [...updated, item];
        }
        return updated;
      });
      showNotification(`Saved "${item.name}" and applied dimensions (${item.width}×${item.height}px) to ALL logos!`);
    } else {
      // Apply dimensions only to this single logo
      if (editingIndex !== null) {
        setLogos((prev) => {
          const copy = [...prev];
          copy[editingIndex] = item;
          return copy;
        });
        showNotification(`Updated logo: "${item.name}" (dimensions applied to this logo only)`);
      } else {
        setLogos((prev) => [...prev, item]);
        showNotification(`Added new logo: "${item.name}" (dimensions isolated to this logo)`);
      }
    }

    setIsModalOpen(false);
  };

  const handleRestoreDefaults = () => {
    if (confirm('Reset client logos to original 12 colorful corporate logos?')) {
      setLogos(DEFAULT_CLIENT_LOGOS);
      showNotification('Restored 12 default corporate logos');
    }
  };

  const handleQuickAddPreset = (preset: (typeof PRESET_SAMPLE_LOGOS)[0] | (typeof PRESET_SQUARE_LOGOS)[0]) => {
    const newItem: ClientLogoItem = {
      id: `logo-preset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: preset.name,
      logoUrl: preset.logoUrl,
      tag: preset.tag,
      accentColor: preset.accentColor,
      websiteUrl: preset.websiteUrl,
      width: preset.width || DEFAULT_LOGO_WIDTH,
      height: preset.height || DEFAULT_LOGO_HEIGHT,
      fit: 'contain',
    };
    setLogos((prev) => [...prev, newItem]);
    showNotification(`Added preset logo: "${preset.name}" (${newItem.width}×${newItem.height}px)`);
  };

  // Add all presets from a category at once
  const handleAddAllPresets = (presetList: (typeof PRESET_SAMPLE_LOGOS) | (typeof PRESET_SQUARE_LOGOS), categoryName: string) => {
    const newItems: ClientLogoItem[] = presetList.map((preset, index) => ({
      id: `logo-bulk-${Date.now()}-${index}`,
      name: preset.name,
      logoUrl: preset.logoUrl,
      tag: preset.tag,
      accentColor: preset.accentColor,
      websiteUrl: preset.websiteUrl,
      width: preset.width || DEFAULT_LOGO_WIDTH,
      height: preset.height || DEFAULT_LOGO_HEIGHT,
      fit: 'contain',
    }));
    setLogos((prev) => [...prev, ...newItems]);
    showNotification(`⚡ Added all ${newItems.length} ${categoryName} logos to scroller!`);
  };

  // 1-Click Convert ALL Logos to Square (1:1)
  const handleConvertAllLogosToSquare = (size: number) => {
    setBatchWidth(size);
    setBatchHeight(size);
    setLogos((prev) =>
      prev.map((l) => ({
        ...l,
        width: size,
        height: size,
        fit: 'contain',
      }))
    );
    showNotification(`⚡ Applied ${size}×${size}px Square (1:1) to ALL ${logos.length} logos!`);
  };

  // Quick Preset tab state
  const [quickPresetTab, setQuickPresetTab] = useState<'square' | 'landscape'>('square');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-70 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-[11px] font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Image Logo Scroller · Isolated Dimension Control &amp; Click Redirects</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Color Image Logo Scroller Manager
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal">
            Display your client logos in full vibrant color (never black &amp; white). When users click any logo, they are redirected directly to that client's official website. Each logo has completely isolated dimensions: adding new logos or customizing width &amp; height will never disturb the other logos' size, and you can undo dimensions at any time.
          </p>
        </div>
      </div>

      {/* Live Carousel Preview in Color */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3 overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-extrabold text-white font-heading">
              Live Color Image Logo Scroller Preview (Click to test redirect)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800">
            {logos.length} Logos In Carousel
          </span>
        </div>
        <div className="py-2">
          <ClientLogoScroller logos={logos} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Hover to pause · Full color rendering · Click logo to open client site in new tab</span>
          <span className="font-mono text-purple-400">Isolated containers: 0 layout distortion</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 font-heading">
            Active Brand Logos ({logos.length})
          </h3>
          <p className="text-xs text-slate-500">
            Each logo has isolated dimensions. Adding new logos will not alter neighboring logo sizes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <button
            type="button"
            onClick={handleResetAllDimensions}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Reset all logos to standard 140×48px dimensions"
          >
            <Undo2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Undo All Dimensions</span>
          </button>

          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset 12 Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand Logo</span>
          </button>
        </div>
      </div>

      {/* Quick Preset Addition with Square and Landscape Options */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-heading">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Quick Preset Brand Logos &amp; Square Options:</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                1-Click Add &amp; Apply
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Choose between 1:1 Square Brand Icons (e.g., Google, Microsoft, OpenAI, Apple) or Landscape Corporate Logos. Add individually or apply to all logos.
            </p>
          </div>

          {/* Preset Category Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setQuickPresetTab('square')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                quickPresetTab === 'square'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🔲 Square (1:1) Logos ({PRESET_SQUARE_LOGOS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickPresetTab('landscape')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                quickPresetTab === 'landscape'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>▭ Landscape Logos ({PRESET_SAMPLE_LOGOS.length})</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleAddAllPresets(quickPresetTab === 'square' ? PRESET_SQUARE_LOGOS : PRESET_SAMPLE_LOGOS, quickPresetTab === 'square' ? 'Square' : 'Landscape')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-purple-700" />
              <span>⚡ Add ALL {quickPresetTab === 'square' ? '12 Square Logos' : '6 Landscape Logos'}</span>
            </button>

            <span className="text-[11px] text-slate-400">|</span>

            {/* 1-Click Convert ALL Logos to Square */}
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span>🔲 Convert ALL to Square:</span>
            </span>
            {[
              { label: '48px', size: 48 },
              { label: '64px (Ideal)', size: 64 },
              { label: '80px', size: 80 },
              { label: '100px', size: 100 },
              { label: '120px', size: 120 },
            ].map((sqOpt) => (
              <button
                key={sqOpt.size}
                type="button"
                onClick={() => handleConvertAllLogosToSquare(sqOpt.size)}
                className="px-2 py-1 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 text-[11px] font-bold text-purple-800 transition-all cursor-pointer shadow-2xs"
                title={`Convert all ${logos.length} logos to ${sqOpt.size}×${sqOpt.size}px square`}
              >
                {sqOpt.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {logos.length} logos in scroller
          </span>
        </div>

        {/* Preset Items List */}
        <div className="flex flex-wrap gap-2 pt-1">
          {quickPresetTab === 'square'
            ? PRESET_SQUARE_LOGOS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleQuickAddPreset(p)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 text-slate-800 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
                  title={`Add Square 64×64 ${p.name} logo to scroller`}
                >
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="w-5 h-5 object-contain rounded-md shadow-2xs shrink-0"
                  />
                  <span>+ {p.name}</span>
                  <span className="text-[9px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-mono font-bold">1:1</span>
                </button>
              ))
            : PRESET_SAMPLE_LOGOS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleQuickAddPreset(p)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 text-slate-800 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.accentColor }}
                  />
                  <span>+ {p.name}</span>
                </button>
              ))}
        </div>
      </div>

      {/* Dimension Controller: Apply to One Logo or All Logos (Height up to 200px) */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 p-5 rounded-3xl border border-purple-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider font-heading flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span>Dimension Controller · Apply to One Logo or All Logos</span>
            </h4>
            <p className="text-xs text-purple-700">
              Set exact width and height (up to 200px height range) and choose whether to apply to one specific logo or all logos across the website.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-purple-900">Target:</span>
            <select
              value={batchTargetId}
              onChange={(e) => setBatchTargetId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-purple-300 bg-white text-xs font-bold text-purple-900 focus:outline-none"
            >
              <option value="all">⚡ Apply to ALL Logos ({logos.length})</option>
              <optgroup label="Apply to Single Logo:">
                {logos.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.width || DEFAULT_LOGO_WIDTH}×{l.height || DEFAULT_LOGO_HEIGHT}px)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Quick Aspect Ratio & Square Presets Bar */}
        <div className="bg-purple-100/70 p-3.5 rounded-2xl border border-purple-200/80 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-bold text-purple-950 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Quick Square &amp; Aspect Ratio Presets ({batchTargetId === 'all' ? `⚡ Apply to ALL ${logos.length} Logos` : `🎯 Apply to ${logos.find(l => l.id === batchTargetId)?.name || 'Selected'}`}):</span>
            </span>
            <button
              type="button"
              onClick={() => handleApplyToolbarDimensions('all')}
              className="text-[10px] font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Enforce Current ({batchWidth}×{batchHeight}px) to ALL Logos</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-purple-800 bg-purple-200/70 px-2 py-0.5 rounded-md">
              Square (1:1):
            </span>
            {[
              { label: '40×40', w: 40, h: 40 },
              { label: '48×48', w: 48, h: 48 },
              { label: '64×64', w: 64, h: 64 },
              { label: '80×80', w: 80, h: 80 },
              { label: '100×100', w: 100, h: 100 },
              { label: '120×120', w: 120, h: 120 },
              { label: '140×140', w: 140, h: 140 },
              { label: '160×160', w: 160, h: 160 },
              { label: '200×200', w: 200, h: 200 },
            ].map((sq) => (
              <button
                key={sq.label}
                type="button"
                onClick={() => handleApplyQuickPresetDimensions(sq.w, sq.h, 'contain')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer ${
                  batchWidth === sq.w && batchHeight === sq.h
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 hover:border-purple-400'
                }`}
              >
                <span>🔲 {sq.label}</span>
              </button>
            ))}

            <span className="text-[10px] font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-md ml-1">
              Landscape:
            </span>
            {[
              { label: '140×48 Standard', w: 140, h: 48 },
              { label: '180×54 Wide', w: 180, h: 54 },
              { label: '110×36 Compact', w: 110, h: 36 },
              { label: '200×60 Hero', w: 200, h: 60 },
            ].map((ls) => (
              <button
                key={ls.label}
                type="button"
                onClick={() => handleApplyQuickPresetDimensions(ls.w, ls.h, 'contain')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer ${
                  batchWidth === ls.w && batchHeight === ls.h
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <span>▭ {ls.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end pt-1">
          {/* Width Controller */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-700 font-bold">
              <span>Width: {batchWidth}px</span>
              <input
                type="number"
                min={40}
                max={350}
                value={batchWidth}
                onChange={(e) => setBatchWidth(Number(e.target.value))}
                className="w-16 px-1.5 py-0.5 text-right rounded border border-purple-200 text-xs font-mono font-bold text-purple-700"
              />
            </div>
            <input
              type="range"
              min={40}
              max={350}
              step={2}
              value={batchWidth}
              onChange={(e) => setBatchWidth(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Height Controller (Up to 200px range) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-700 font-bold">
              <span>Height: {batchHeight}px (Max 200px)</span>
              <input
                type="number"
                min={20}
                max={200}
                value={batchHeight}
                onChange={(e) => setBatchHeight(Number(e.target.value))}
                className="w-16 px-1.5 py-0.5 text-right rounded border border-purple-200 text-xs font-mono font-bold text-purple-700"
              />
            </div>
            <input
              type="range"
              min={20}
              max={200}
              step={2}
              value={batchHeight}
              onChange={(e) => setBatchHeight(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Apply Button */}
          <div>
            <button
              type="button"
              onClick={() => handleApplyToolbarDimensions(batchTargetId === 'all' ? 'all' : 'selected')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {batchTargetId === 'all'
                  ? `Apply to All ${logos.length} Logos`
                  : `Apply to Selected Logo`}
              </span>
            </button>
          </div>

          {/* Undo / Reset Button */}
          <div>
            <button
              type="button"
              onClick={() => {
                setBatchWidth(DEFAULT_LOGO_WIDTH);
                setBatchHeight(DEFAULT_LOGO_HEIGHT);
                handleResetAllDimensions();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Undo / Reset Dimensions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Logos Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {logos.map((logo, index) => {
          const accent = logo.accentColor || '#7c3aed';
          const logoW = logo.width || DEFAULT_LOGO_WIDTH;
          const logoH = logo.height || DEFAULT_LOGO_HEIGHT;
          const isCustomDimension = logoW !== DEFAULT_LOGO_WIDTH || logoH !== DEFAULT_LOGO_HEIGHT;

          return (
            <div
              key={logo.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group relative"
            >
              <div className="space-y-3">
                {/* Header: Company Name & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{logo.name}</h4>
                    <span className="text-[10px] text-slate-500 block truncate">{logo.tag}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(index)}
                      title={logo.active !== false ? 'Active in Scroller (Click to Hide)' : 'Hidden from Scroller (Click to Show)'}
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        logo.active !== false
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {logo.active !== false ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Move Left in Scroller"
                      className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === logos.length - 1}
                      title="Move Right in Scroller"
                      className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(index)}
                      title="Edit Logo & Dimensions"
                      className="p-1 rounded text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Logo"
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Logo Image in its isolated container preview */}
                <div className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center min-h-[70px]">
                  <div
                    className="flex items-center justify-center p-1.5 rounded-lg border bg-white shadow-2xs overflow-hidden transition-all"
                    style={{
                      borderColor: `${accent}40`,
                      width: `${Math.min(logoW, 200)}px`,
                      height: `${Math.min(logoH, 60)}px`,
                    }}
                  >
                    {logo.logoUrl ? (
                      <img
                        src={logo.logoUrl}
                        alt={logo.name}
                        style={{
                          objectFit: logo.fit || 'contain',
                          width: '100%',
                          height: '100%',
                          filter: 'none', // Strictly full color
                        }}
                        className="rounded select-none"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{ color: accent }} className="font-bold text-xs">
                        {logo.name.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dimension Badge & Undo Dimension Button */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-700 font-semibold">
                      {logoW} × {logoH} px
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">({logo.fit || 'contain'})</span>
                  </div>

                  {isCustomDimension ? (
                    <button
                      type="button"
                      onClick={(e) => handleQuickResetCardDimension(index, e)}
                      title="Undo dimension to default 140×48px"
                      className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Undo2 className="w-2.5 h-2.5 text-purple-600" />
                      <span>Undo Dimension</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>Default size</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Target Link info */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[200px]">
                  <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                  {logo.websiteUrl ? (
                    <a
                      href={logo.websiteUrl.startsWith('http') ? logo.websiteUrl : `https://${logo.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline truncate font-medium"
                    >
                      {logo.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No external URL</span>
                  )}
                </div>

                {logo.websiteUrl && (
                  <a
                    href={logo.websiteUrl.startsWith('http') ? logo.websiteUrl : `https://${logo.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Test link to ${logo.websiteUrl}`}
                    className="p-1 rounded text-purple-600 hover:bg-purple-50 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Publish Client Logos to Website</h4>
          <p className="text-xs text-slate-500">
            Save changes to update the live home page scroller with all colorful logos, custom dimensions, and click redirect links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSaveLogos(logos)}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Logos...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Update Scroller</span>
            </>
          )}
        </button>
      </div>

      {/* Add / Edit Logo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-extrabold text-white font-heading">
                  {editingIndex !== null ? 'Edit Brand Logo & Dimensions' : 'Add Brand Logo (Local File or URL)'}
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
              {/* Company Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Tata Consultancy Services"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Source Selector: Local System vs Throw URL */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Logo Image Source *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setUploadSource('local')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      uploadSource === 'local'
                        ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload From Local System</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadSource('url')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      uploadSource === 'url'
                        ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Throw Logo URL</span>
                  </button>
                </div>

                {uploadSource === 'local' ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLocalFileSelect}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/70 text-center cursor-pointer transition-all"
                    >
                      <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1.5" />
                      <div className="text-xs font-bold text-purple-900">
                        Click to browse logo file from your local system
                      </div>
                      <div className="text-[11px] text-purple-600 mt-0.5">
                        Supports PNG, JPG, SVG, WebP with color preservation (max 2MB)
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={formData.logoUrl || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="https://example.com/logo.svg or data:image/svg+xml;..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500">
                      Throw any direct web image URL (SVG/PNG) or SVG data URI.
                    </p>
                  </div>
                )}
              </div>

              {/* Logo Dimensions Settings (with Undo button) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sliders className="w-3.5 h-3.5 text-purple-600" />
                    <span>Logo Dimensions (Isolated Sizing)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDimensions}
                    className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[11px] font-bold text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Undo dimensions back to default 140×48px"
                  >
                    <Undo2 className="w-3 h-3 text-purple-600" />
                    <span>Undo Dimensions</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>Width:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={40}
                          max={350}
                          value={formData.width || DEFAULT_LOGO_WIDTH}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, width: Number(e.target.value) }))
                          }
                          className="w-16 px-1.5 py-0.5 text-right rounded border border-slate-200 font-mono font-bold text-purple-700 text-xs focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={350}
                      step={2}
                      value={formData.width || DEFAULT_LOGO_WIDTH}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, width: Number(e.target.value) }))
                      }
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>Height (Range to 200):</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={20}
                          max={200}
                          value={formData.height || DEFAULT_LOGO_HEIGHT}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, height: Number(e.target.value) }))
                          }
                          className="w-16 px-1.5 py-0.5 text-right rounded border border-slate-200 font-mono font-bold text-purple-700 text-xs focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={2}
                      value={formData.height || DEFAULT_LOGO_HEIGHT}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, height: Number(e.target.value) }))
                      }
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Quick Presets for dimensions */}
                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Quick Square Options (1:1):</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { label: '48×48 Sq', w: 48, h: 48 },
                      { label: '64×64 Sq', w: 64, h: 64 },
                      { label: '80×80 Sq', w: 80, h: 80 },
                      { label: '100×100 Sq', w: 100, h: 100 },
                      { label: '120×120 Sq', w: 120, h: 120 },
                      { label: '140×140 Sq', w: 140, h: 140 },
                    ].map((sq) => (
                      <button
                        key={sq.label}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, width: sq.w, height: sq.h, fit: 'contain' }))
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          formData.width === sq.w && formData.height === sq.h
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-purple-50/50 border-purple-200 text-purple-800 hover:bg-purple-100'
                        }`}
                      >
                        🔲 {sq.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">Landscape Presets:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { label: 'Standard (140×48)', w: 140, h: 48 },
                        { label: 'Wide (180×54)', w: 180, h: 54 },
                        { label: 'Compact (100×32)', w: 100, h: 32 },
                        { label: 'Max (160×200)', w: 160, h: 200 },
                      ].map((pre) => (
                        <button
                          key={pre.label}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, width: pre.w, height: pre.h }))
                          }
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700 cursor-pointer"
                        >
                          {pre.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">Image Fit Mode:</span>
                  <div className="flex items-center gap-2">
                    {(['contain', 'cover', 'fill'] as const).map((fitMode) => (
                      <button
                        key={fitMode}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, fit: fitMode }))}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase cursor-pointer ${
                          (formData.fit || 'contain') === fitMode
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        {fitMode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply to One Logo or All Logos */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Apply Dimensions Scope:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setApplyDimensionScope('single')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        applyDimensionScope === 'single'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Apply to This Logo Only</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplyDimensionScope('all')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        applyDimensionScope === 'all'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Apply to ALL {logos.length} Logos</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {applyDimensionScope === 'all'
                      ? '⚡ Dimensions will be applied to all logos in the carousel simultaneously.'
                      : '✓ Only this individual logo will be resized. All other logos keep their current dimensions.'}
                  </p>
                </div>
              </div>

              {/* Live Dimension & Color Preview */}
              {formData.logoUrl && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Full Color Dimension Preview:
                  </span>
                  <div
                    className="rounded-xl flex items-center justify-center p-2 border transition-all bg-white shadow-2xs"
                    style={{
                      borderColor: `${formData.accentColor || '#7c3aed'}40`,
                      width: `${formData.width || DEFAULT_LOGO_WIDTH}px`,
                      height: `${formData.height || DEFAULT_LOGO_HEIGHT}px`,
                    }}
                  >
                    <img
                      src={formData.logoUrl}
                      alt="Preview"
                      style={{
                        objectFit: formData.fit || 'contain',
                        width: '100%',
                        height: '100%',
                        filter: 'none', // Color logo
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Isolated Size: {formData.width || DEFAULT_LOGO_WIDTH} × {formData.height || DEFAULT_LOGO_HEIGHT} px (will not disturb other logos)
                  </span>
                </div>
              )}

              {/* Website URL (Click to redirect) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Client Website URL (User redirects here on logo click) *
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={formData.websiteUrl || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
                    }
                    placeholder="https://client-company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  When visitors click this logo in the carousel, they will redirect to this URL in a new tab.
                </p>
              </div>

              {/* Industry Tag & Accent Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Industry Tag
                  </label>
                  <input
                    type="text"
                    value={formData.tag || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                    placeholder="e.g. Enterprise IT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Brand Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#7c3aed'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, accentColor: e.target.value }))
                      }
                      className="w-9 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#7c3aed'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, accentColor: e.target.value }))
                      }
                      className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                      placeholder="#7c3aed"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  {editingIndex !== null ? 'Update Logo' : 'Add to Scroller'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
