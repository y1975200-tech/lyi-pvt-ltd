import { ThemeCustomization } from '../types.ts';

export interface ExtractedColorAnalysis {
  dominantHue: string;
  palette: string[];
  primary: string;
  secondary: string;
  accent: string;
  darkNeutral: string;
  lightNeutral: string;
  surfaceDark: string;
  surfaceLight: string;
  averageLuminance: number;
}

export interface ContrastAuditResult {
  element: string;
  fgColor: string;
  bgColor: string;
  ratio: number;
  isReadable: boolean;
  wcagLevel: 'AAA' | 'AA' | 'Fail';
}

/**
 * The Master Original LYI Theme (Official Baseline as shown in screenshot)
 * Preserves the deliberate combination of:
 * LIGHT HEADER + DARK HERO + WHITE STATS + LIGHT LOGOS + LIGHT DIVISIONS WITH DARK CARDS + DARK CONSULTATION + DARK FOOTER
 */
export const DEFAULT_ORIGINAL_THEME: ThemeCustomization = {
  mode: 'light',
  locked: true,
  templateName: 'LYI Royal Purple (Official Master)',
  primaryColor: '#7c3aed',
  primaryButtonColor: '#7c3aed',
  primaryButtonTextColor: '#ffffff',
  secondaryColor: '#4c1d95',
  secondaryButtonColor: '#4c1d95',
  secondaryButtonTextColor: '#ffffff',
  accentColor: '#06b6d4',
  textColor: '#334155',
  headingColor: '#0f172a',
  textMutedColor: '#64748b',
  bodyBgColor: '#ffffff',
  cardBgColor: '#ffffff',
  cardBorderColor: '#e2e8f0',
  cardTextColor: '#334155',
  borderColor: '#e2e8f0',
  inputBgColor: '#ffffff',
  inputBorderColor: '#cbd5e1',
  inputTextColor: '#0f172a',
  navBgColor: '#ffffff',
  navTextColor: '#0f172a',
  footerBgColor: '#030712',
  footerTextColor: '#94a3b8',
  badgeBgColor: '#ede9fe',
  badgeTextColor: '#6d28d9',
  gradientStart: '#7c3aed',
  gradientEnd: '#06b6d4',
  headlineFontWeight: 'normal',
  headlineItalic: false,
  headlineUnderline: false,
  buttonFontWeight: 'medium',
  buttonItalic: false,
  buttonUnderline: false,
  animationSpeed: 'fast',
  themeBgImage: '',
  themeBgOverlayOpacity: 75,
  themeBgBlur: 0,
  contrastScore: 16.5,
};

export const DEFAULT_PURPLE_THEME = DEFAULT_ORIGINAL_THEME;

// ==========================================
// COLOR UTILITIES & WCAG CONTRAST ENGINE
// ==========================================

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length === 8) {
    c = c.substring(0, 6);
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 124, g: 58, b: 237 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB color.
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const transform = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

/**
 * Computes contrast ratio between two colors according to WCAG 2.1:
 * (L1 + 0.05) / (L2 + 0.05)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Adjusts color brightness/lightness by a delta (-100 to +100).
 */
export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;
  const newR = percent > 0 ? r + (255 - r) * factor : r + r * factor;
  const newG = percent > 0 ? g + (255 - g) * factor : g + g * factor;
  const newB = percent > 0 ? b + (255 - b) * factor : b + b * factor;
  return rgbToHex(newR, newG, newB);
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Converts HSL to Hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

// ==========================================
// INTELLIGENT READABILITY & CONTRAST GUARDS
// ==========================================

/**
 * Guarantees a readable text color against any background color.
 * Minimum target contrast: 4.5:1 (WCAG AA). Ideal: 7.0+:1 (WCAG AAA).
 */
export function ensureReadableTextColor(
  bgHex: string,
  preferredColor?: string,
  minContrast = 4.5
): string {
  const bgLuminance = getRelativeLuminance(bgHex);
  const isDarkBg = bgLuminance < 0.4;

  if (preferredColor) {
    const ratio = getContrastRatio(preferredColor, bgHex);
    if (ratio >= minContrast) {
      return preferredColor;
    }
  }

  const lightCandidates = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0'];
  const darkCandidates = ['#090d16', '#0f172a', '#1e293b', '#020617', '#000000'];

  const pool = isDarkBg ? lightCandidates : darkCandidates;
  let bestColor = pool[0];
  let bestRatio = 0;

  for (const candidate of pool) {
    const ratio = getContrastRatio(candidate, bgHex);
    if (ratio >= 7.0) {
      return candidate; // AAA passed
    }
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestColor = candidate;
    }
  }

  if (bestRatio >= minContrast) {
    return bestColor;
  }

  const whiteRatio = getContrastRatio('#ffffff', bgHex);
  const blackRatio = getContrastRatio('#000000', bgHex);
  return whiteRatio >= blackRatio ? '#ffffff' : '#000000';
}

/**
 * Ensures button text is clearly readable (WCAG AA min 4.5:1)
 */
export function ensureReadableButtonColors(btnBg: string): { bg: string; text: string; hover: string } {
  const text = ensureReadableTextColor(btnBg, '#ffffff', 4.5);
  const lum = getRelativeLuminance(btnBg);
  const hover = lum > 0.4 ? adjustBrightness(btnBg, -15) : adjustBrightness(btnBg, 15);
  return { bg: btnBg, text, hover };
}

// ==========================================
// IMAGE COLOR ANALYSIS ENGINE
// ==========================================

/**
 * Analyzes an image (via Data URL or Image URL) using HTML Canvas
 * and extracts a rich, harmonized color palette.
 */
export async function analyzeImageFromSource(
  imageSrc: string
): Promise<ExtractedColorAnalysis> {
  return new Promise((resolve) => {
    const fallback: ExtractedColorAnalysis = {
      dominantHue: '#7c3aed',
      palette: ['#7c3aed', '#4c1d95', '#06b6d4', '#090d16', '#0f172a', '#f8fafc'],
      primary: '#7c3aed',
      secondary: '#4c1d95',
      accent: '#06b6d4',
      darkNeutral: '#090d16',
      lightNeutral: '#f8fafc',
      surfaceDark: '#0e2246',
      surfaceLight: '#ffffff',
      averageLuminance: 0.2,
    };

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(fallback);
          return;
        }

        const sampleSize = 100;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        const colorBuckets: { [bucketKey: string]: { r: number; g: number; b: number; count: number } } = {};
        let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;

        for (let i = 0; i < imgData.length; i += 8) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 128) continue;

          totalR += r;
          totalG += g;
          totalB += b;
          pixelCount++;

          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr},${qg},${qb}`;

          if (!colorBuckets[key]) {
            colorBuckets[key] = { r, g, b, count: 0 };
          }
          colorBuckets[key].count++;
        }

        if (pixelCount === 0) {
          resolve(fallback);
          return;
        }

        const sortedBuckets = Object.values(colorBuckets).sort((a, b) => b.count - a.count);
        const vibrantCandidates: { hex: string; sat: number; score: number }[] = [];

        for (const bucket of sortedBuckets.slice(0, 25)) {
          const hex = rgbToHex(bucket.r, bucket.g, bucket.b);
          const [, s, l] = rgbToHsl(bucket.r, bucket.g, bucket.b);
          const satFactor = s / 100;
          const lightFactor = 1 - Math.abs(l - 50) / 50;
          const score = satFactor * 1.5 + lightFactor * 0.8;

          if (s >= 18 && l >= 20 && l <= 85) {
            vibrantCandidates.push({ hex, sat: s, score });
          }
        }

        vibrantCandidates.sort((a, b) => b.score - a.score);

        let primaryHex = vibrantCandidates[0]?.hex;
        if (!primaryHex) {
          const first = sortedBuckets[0];
          primaryHex = first ? rgbToHex(first.r, first.g, first.b) : '#7c3aed';
        }

        const primaryRgb = hexToRgb(primaryHex);
        const [pH, pS, pL] = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);

        let secondaryHex = vibrantCandidates[1]?.hex;
        if (!secondaryHex || getContrastRatio(secondaryHex, primaryHex) < 1.1) {
          secondaryHex = hslToHex((pH + 35) % 360, Math.max(35, pS), Math.max(25, Math.min(75, pL)));
        }

        let accentHex = vibrantCandidates[2]?.hex;
        if (!accentHex || accentHex === primaryHex) {
          accentHex = hslToHex((pH + 170) % 360, Math.max(60, pS), Math.max(45, Math.min(65, pL)));
        }

        const surfaceDark = hslToHex(pH, Math.min(25, pS), 11);

        resolve({
          dominantHue: primaryHex,
          palette: [primaryHex, secondaryHex, accentHex, '#090d16', surfaceDark, '#ffffff'],
          primary: primaryHex,
          secondary: secondaryHex,
          accent: accentHex,
          darkNeutral: '#090d16',
          lightNeutral: '#f8fafc',
          surfaceDark,
          surfaceLight: '#ffffff',
          averageLuminance: getRelativeLuminance(primaryHex),
        });
      } catch (err) {
        console.warn('Image analysis fallback:', err);
        resolve(fallback);
      }
    };

    img.onerror = () => {
      resolve(fallback);
    };

    img.src = imageSrc;
  });
}

/**
 * Builds a complete semantic ThemeCustomization object from image analysis.
 * CRITICAL REQUIREMENT (Parts 1, 2, 4, 5):
 * The website's master design is LIGHT-PRIMARY (light header, white stats, light logos,
 * light division background, dark hero, dark consultation, dark footer).
 * An image style reference modifies colors WITHIN this existing structure.
 * It NEVER converts the entire website into a dark theme!
 */
export function generateThemeFromPalette(
  analysis: ExtractedColorAnalysis,
  _ignoredMode?: 'dark' | 'light',
  sourceUrl?: string
): ThemeCustomization {
  const primary = analysis.primary;
  const secondary = analysis.secondary;
  const accent = analysis.accent;

  // Buttons with guaranteed WCAG AA/AAA contrast
  const primaryBtn = ensureReadableButtonColors(primary);
  const secondaryBtn = ensureReadableButtonColors(secondary);

  return {
    mode: 'light',
    locked: true,
    templateName: `Image Palette (${primary.toUpperCase()})`,
    primaryColor: primary,
    primaryButtonColor: primaryBtn.bg,
    primaryButtonTextColor: primaryBtn.text,
    secondaryColor: secondary,
    secondaryButtonColor: secondaryBtn.bg,
    secondaryButtonTextColor: secondaryBtn.text,
    accentColor: accent,
    // Page & section backgrounds remain clean light as in master design
    bodyBgColor: '#ffffff',
    cardBgColor: '#ffffff',
    cardBorderColor: '#e2e8f0',
    cardTextColor: '#334155',
    textColor: '#334155',
    headingColor: '#0f172a',
    textMutedColor: '#64748b',
    borderColor: '#e2e8f0',
    inputBgColor: '#ffffff',
    inputBorderColor: '#cbd5e1',
    inputTextColor: '#0f172a',
    navBgColor: '#ffffff',
    navTextColor: '#0f172a',
    footerBgColor: '#030712',
    footerTextColor: '#94a3b8',
    badgeBgColor: `${primary}1a`,
    badgeTextColor: adjustBrightness(primary, -20),
    gradientStart: primary,
    gradientEnd: accent,
    headlineFontWeight: 'normal',
    headlineItalic: false,
    headlineUnderline: false,
    buttonFontWeight: 'medium',
    buttonItalic: false,
    buttonUnderline: false,
    animationSpeed: 'fast',
    themeBgImage: sourceUrl || undefined,
    contrastScore: getContrastRatio('#0f172a', '#ffffff'),
  };
}

/**
 * Runs a complete WCAG 2.1 contrast audit for all primary theme pairings.
 */
export function auditThemeContrast(theme: ThemeCustomization): ContrastAuditResult[] {
  const primaryBg = theme.primaryButtonColor || theme.primaryColor || '#7c3aed';
  const secondaryBg = theme.secondaryButtonColor || theme.secondaryColor || '#4c1d95';

  const checks = [
    {
      element: 'Primary Button Text vs Button Bg',
      fgColor: theme.primaryButtonTextColor || '#ffffff',
      bgColor: primaryBg,
      min: 4.5,
    },
    {
      element: 'Secondary Button Text vs Button Bg',
      fgColor: theme.secondaryButtonTextColor || '#ffffff',
      bgColor: secondaryBg,
      min: 4.5,
    },
    {
      element: 'Section Heading vs Light Background',
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      min: 4.5,
    },
    {
      element: 'Section Body Text vs Light Background',
      fgColor: '#334155',
      bgColor: '#ffffff',
      min: 4.5,
    },
    {
      element: 'Hero White Text vs Dark Hero Overlay',
      fgColor: '#ffffff',
      bgColor: '#090d16',
      min: 4.5,
    },
    {
      element: 'Division Dark Card Text vs Dark Card',
      fgColor: '#ffffff',
      bgColor: '#0e2246',
      min: 4.5,
    },
    {
      element: 'Navbar Text vs Header Background',
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      min: 4.5,
    },
    {
      element: 'Footer Text vs Footer Background',
      fgColor: '#94a3b8',
      bgColor: '#030712',
      min: 4.0,
    },
  ];

  return checks.map((chk) => {
    const ratio = getContrastRatio(chk.fgColor, chk.bgColor);
    const isReadable = ratio >= chk.min;
    const wcagLevel: 'AAA' | 'AA' | 'Fail' =
      ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';
    return {
      element: chk.element,
      fgColor: chk.fgColor,
      bgColor: chk.bgColor,
      ratio,
      isReadable,
      wcagLevel,
    };
  });
}

/**
 * Injects semantic design tokens into document.documentElement (:root).
 * NEVER inverts light sections into dark!
 */
export function applyThemeToCssVariables(theme: ThemeCustomization): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // IMPORTANT: Ensure 'dark' class is NOT placed on root document!
  // The master design uses light sections with intentional dark hero/consultation/footer.
  root.classList.remove('dark');

  const primary = theme.primaryColor || '#7c3aed';
  const primaryBtnBg = theme.primaryButtonColor || primary;
  const primaryBtnText = theme.primaryButtonTextColor || ensureReadableTextColor(primaryBtnBg, '#ffffff', 4.5);
  const secondary = theme.secondaryColor || '#4c1d95';
  const secondaryBtnBg = theme.secondaryButtonColor || secondary;
  const secondaryBtnText = theme.secondaryButtonTextColor || ensureReadableTextColor(secondaryBtnBg, '#ffffff', 4.5);
  const accent = theme.accentColor || '#06b6d4';
  const accentText = ensureReadableTextColor(accent, '#ffffff', 4.5);

  const variables: Record<string, string> = {
    // Semantic tokens requested in Part 3
    '--color-page-background': '#ffffff',
    '--color-section-background': '#ffffff',
    '--color-section-background-alt': '#f8fafc',
    '--color-surface': '#ffffff',
    '--color-surface-light': '#ffffff',
    '--color-surface-dark': '#090d16',
    '--color-card-background': '#ffffff',
    '--color-card-background-dark': '#0e2246',
    '--color-primary': primary,
    '--color-primary-hover': adjustBrightness(primary, -15),
    '--color-secondary': secondary,
    '--color-secondary-hover': adjustBrightness(secondary, -15),
    '--color-accent': accent,
    '--color-heading': '#0f172a',
    '--color-body-text': '#334155',
    '--color-muted-text': '#64748b',
    '--color-text-on-dark': '#f8fafc',
    '--color-text-on-light': '#0f172a',
    '--color-border': '#e2e8f0',
    '--color-input-background': '#ffffff',
    '--color-input-text': '#0f172a',
    '--color-input-placeholder': '#94a3b8',
    '--color-button-background': primaryBtnBg,
    '--color-button-text': primaryBtnText,
    '--color-link': primary,
    '--color-success': '#10b981',
    '--color-warning': '#f59e0b',
    '--color-error': '#ef4444',

    // Theme tokens
    '--theme-primary': primary,
    '--theme-primary-hover': adjustBrightness(primaryBtnBg, -15),
    '--theme-primary-text': primaryBtnText,
    '--theme-secondary': secondary,
    '--theme-secondary-hover': adjustBrightness(secondaryBtnBg, -15),
    '--theme-secondary-text': secondaryBtnText,
    '--theme-accent': accent,
    '--theme-accent-text': accentText,
    '--theme-gradient-start': theme.gradientStart || primary,
    '--theme-gradient-end': theme.gradientEnd || accent,
    '--theme-badge-bg': theme.badgeBgColor || `${primary}20`,
    '--theme-badge-text': theme.badgeTextColor || primary,
  };

  for (const [key, val] of Object.entries(variables)) {
    root.style.setProperty(key, val);
  }
}
