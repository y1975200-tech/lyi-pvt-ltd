import React from 'react';
import { ImageEffectsConfig, SiteSettings } from '../types.ts';

export function defaultImageEffects(): ImageEffectsConfig {
  return {
    blurEnabled: false,
    blurAmount: 0,
    brightnessEnabled: false,
    brightnessAmount: 100,
    contrastEnabled: false,
    contrastAmount: 100,
    saturationEnabled: false,
    saturationAmount: 100,
    grayscaleEnabled: false,
    grayscaleAmount: 0,
    opacityEnabled: false,
    opacityAmount: 100,
    overlayEnabled: false,
    overlayColor: '#000000',
    overlayOpacity: 50,
    tintEnabled: false,
    tintColor: '#38bdf8',
    tintOpacity: 30,
    shadowEnabled: false,
    shadowIntensity: 10,
    shadowColor: '#000000',
    zoomEnabled: false,
    zoomScale: 1.0,
    gradientEnabled: false,
    gradientColor1: '#000000',
    gradientColor2: '#00000000',
    gradientOpacity: 50,
    gradientDirection: 'to bottom',
  };
}

export function computeImageCSS(effects?: ImageEffectsConfig): {
  imgStyle: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
  tintStyle?: React.CSSProperties;
  gradientStyle?: React.CSSProperties;
} {
  if (!effects) {
    return { imgStyle: {} };
  }

  const filters: string[] = [];

  if (effects.blurEnabled && (effects.blurAmount ?? 0) > 0) {
    filters.push(`blur(${effects.blurAmount}px)`);
  }
  if (effects.brightnessEnabled && effects.brightnessAmount !== undefined && effects.brightnessAmount !== 100) {
    filters.push(`brightness(${effects.brightnessAmount}%)`);
  }
  if (effects.contrastEnabled && effects.contrastAmount !== undefined && effects.contrastAmount !== 100) {
    filters.push(`contrast(${effects.contrastAmount}%)`);
  }
  if (effects.saturationEnabled && effects.saturationAmount !== undefined && effects.saturationAmount !== 100) {
    filters.push(`saturate(${effects.saturationAmount}%)`);
  }
  if (effects.grayscaleEnabled && (effects.grayscaleAmount ?? 0) > 0) {
    filters.push(`grayscale(${effects.grayscaleAmount}%)`);
  }

  const imgStyle: React.CSSProperties = {};

  if (filters.length > 0) {
    imgStyle.filter = filters.join(' ');
  }

  if (effects.opacityEnabled && effects.opacityAmount !== undefined && effects.opacityAmount < 100) {
    imgStyle.opacity = effects.opacityAmount / 100;
  }

  if (effects.zoomEnabled && effects.zoomScale !== undefined && effects.zoomScale !== 1) {
    imgStyle.transform = `scale(${effects.zoomScale})`;
  }

  if (effects.shadowEnabled && (effects.shadowIntensity ?? 0) > 0) {
    const intensity = effects.shadowIntensity!;
    const color = effects.shadowColor || 'rgba(0,0,0,0.5)';
    imgStyle.boxShadow = `0 ${Math.round(intensity / 2)}px ${intensity}px ${color}`;
  }

  let overlayStyle: React.CSSProperties | undefined;
  if (effects.overlayEnabled && (effects.overlayOpacity ?? 0) > 0) {
    overlayStyle = {
      backgroundColor: effects.overlayColor || '#000000',
      opacity: (effects.overlayOpacity ?? 50) / 100,
    };
  }

  let tintStyle: React.CSSProperties | undefined;
  if (effects.tintEnabled && (effects.tintOpacity ?? 0) > 0) {
    tintStyle = {
      backgroundColor: effects.tintColor || '#38bdf8',
      mixBlendMode: 'color',
      opacity: (effects.tintOpacity ?? 30) / 100,
    };
  }

  let gradientStyle: React.CSSProperties | undefined;
  if (effects.gradientEnabled && (effects.gradientOpacity ?? 0) > 0) {
    const c1 = effects.gradientColor1 || '#000000';
    const c2 = effects.gradientColor2 || 'transparent';
    const dir = effects.gradientDirection || 'to bottom';
    gradientStyle = {
      background: `linear-gradient(${dir}, ${c1}, ${c2})`,
      opacity: (effects.gradientOpacity ?? 50) / 100,
    };
  }

  return { imgStyle, overlayStyle, tintStyle, gradientStyle };
}

export function getImageEffects(siteSettings?: SiteSettings, key?: string): ImageEffectsConfig {
  if (!key || !siteSettings?.imageEffects || !siteSettings.imageEffects[key]) {
    return defaultImageEffects();
  }
  return { ...defaultImageEffects(), ...siteSettings.imageEffects[key] };
}
