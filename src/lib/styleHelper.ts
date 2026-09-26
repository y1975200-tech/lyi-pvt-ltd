import React from 'react';
import { TextStyle } from '../types.ts';

/**
 * Transforms dynamic CMS field TextStyle metadata into inline CSS properties
 */
export function applyFieldStyle(
  styleObj?: TextStyle | any,
  defaultStyle?: React.CSSProperties
): React.CSSProperties {
  if (!styleObj || typeof styleObj !== 'object') {
    return defaultStyle || {};
  }

  const res: React.CSSProperties = { ...(defaultStyle || {}) };

  if (styleObj.color && styleObj.color.trim()) {
    res.color = styleObj.color;
  }

  if (styleObj.fontSize && styleObj.fontSize.trim()) {
    // If it's a px/rem/em value, use directly, otherwise if tailwind class or raw number
    if (/^\d+$/.test(styleObj.fontSize.trim())) {
      res.fontSize = `${styleObj.fontSize.trim()}px`;
    } else {
      res.fontSize = styleObj.fontSize;
    }
  }

  if (styleObj.fontWeight) {
    if (styleObj.fontWeight === 'bold') res.fontWeight = 700;
    else if (styleObj.fontWeight === 'extrabold') res.fontWeight = 800;
    else if (styleObj.fontWeight === 'semibold') res.fontWeight = 600;
    else if (styleObj.fontWeight === 'medium') res.fontWeight = 500;
    else if (styleObj.fontWeight === 'normal') res.fontWeight = 400;
  }

  if (styleObj.italic) {
    res.fontStyle = 'italic';
  }

  if (styleObj.underline) {
    res.textDecoration = 'underline';
  }

  if (styleObj.align) {
    res.textAlign = styleObj.align;
  }

  return res;
}

/**
 * Returns class names corresponding to text style
 */
export function getFieldClassName(styleObj?: TextStyle | any, defaultClass: string = ''): string {
  if (!styleObj) return defaultClass;
  const classes = [defaultClass];
  if (styleObj.italic) classes.push('italic');
  if (styleObj.underline) classes.push('underline underline-offset-4');
  if (styleObj.align === 'center') classes.push('text-center');
  if (styleObj.align === 'right') classes.push('text-right');
  if (styleObj.align === 'left') classes.push('text-left');
  return classes.filter(Boolean).join(' ');
}
