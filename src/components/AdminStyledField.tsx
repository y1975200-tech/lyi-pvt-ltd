import React, { useState } from 'react';
import { TextStyle } from '../types.ts';
import { Bold, Italic, Underline, Palette, Type, AlignLeft, AlignCenter, AlignRight, RotateCcw } from 'lucide-react';

interface AdminStyledFieldProps {
  label: string;
  helperText?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  styleValue?: TextStyle;
  onStyleChange?: (style: TextStyle) => void;
  isTextarea?: boolean;
  rows?: number;
  className?: string;
  headingLevel?: string;
  required?: boolean;
}

const COLOR_PRESETS = [
  { name: 'Default', hex: '' },
  { name: 'Slate 900', hex: '#0f172a' },
  { name: 'Slate 600', hex: '#475569' },
  { name: 'Blue 600', hex: '#2563eb' },
  { name: 'Cyan 600', hex: '#0891b2' },
  { name: 'Purple 600', hex: '#9333ea' },
  { name: 'Emerald 600', hex: '#059669' },
  { name: 'Amber 600', hex: '#d97706' },
  { name: 'Rose 600', hex: '#e11d48' },
  { name: 'Pure White', hex: '#ffffff' },
];

const SIZE_PRESETS = [
  { label: 'Size: Default', value: '' },
  { label: '11px (Tiny Badge)', value: '11px' },
  { label: '12px (Small Text)', value: '12px' },
  { label: '14px (Standard)', value: '14px' },
  { label: '16px (Body Large)', value: '16px' },
  { label: '18px (Lead / Subhead)', value: '18px' },
  { label: '22px (Section Title)', value: '22px' },
  { label: '28px (Page Heading)', value: '28px' },
  { label: '36px (Hero Headline)', value: '36px' },
  { label: '48px (Display Large)', value: '48px' },
  { label: '56px (Mega Headline)', value: '56px' },
];

export const AdminStyledField: React.FC<AdminStyledFieldProps> = ({
  label,
  helperText,
  placeholder,
  value,
  onChange,
  styleValue = {},
  onStyleChange = () => {},
  isTextarea = false,
  rows = 3,
  className = '',
}) => {
  const [showToolbar, setShowToolbar] = useState<boolean>(false);

  const updateStyle = (key: keyof TextStyle, val: any) => {
    onStyleChange({
      ...styleValue,
      [key]: val,
    });
  };

  const hasCustomStyle = Boolean(
    styleValue.color ||
    styleValue.fontSize ||
    styleValue.fontWeight ||
    styleValue.italic ||
    styleValue.underline ||
    styleValue.align
  );

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label and Formatting Toolbar Toggle */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowToolbar(!showToolbar)}
          className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            showToolbar || hasCustomStyle
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
          title="Customize text styling: color, size, bold, italic, underline, alignment"
        >
          <Palette className="w-3 h-3 text-blue-600" />
          <span>Style &amp; Typography</span>
          {hasCustomStyle && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </button>
      </div>

      {/* Expandable Formatting Bar */}
      {showToolbar && (
        <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-300 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Color Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-600">Color:</span>
              <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-slate-200">
                <input
                  type="color"
                  value={styleValue.color || '#0f172a'}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  className="w-5 h-5 rounded border-0 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={styleValue.color || ''}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  placeholder="Auto"
                  className="w-16 text-[11px] font-mono border-0 focus:outline-none p-0 text-slate-700"
                />
              </div>

              {/* Quick Color Swatches */}
              <div className="hidden sm:flex items-center gap-1">
                {COLOR_PRESETS.slice(1, 7).map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => updateStyle('color', p.hex)}
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-xs cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: p.hex }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={styleValue.fontSize || ''}
                onChange={(e) => updateStyle('fontSize', e.target.value)}
                className="text-[11px] font-medium p-1 rounded-lg border border-slate-200 bg-white"
              >
                {SIZE_PRESETS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Formatting Toggles: Bold, Italic, Underline, Align */}
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() =>
                  updateStyle(
                    'fontWeight',
                    styleValue.fontWeight === 'bold' ? 'normal' : 'bold'
                  )
                }
                className={`p-1 rounded transition-colors cursor-pointer ${
                  styleValue.fontWeight === 'bold' || styleValue.fontWeight === 'extrabold'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => updateStyle('italic', !styleValue.italic)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  styleValue.italic
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => updateStyle('underline', !styleValue.underline)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  styleValue.underline
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />

              <button
                type="button"
                onClick={() => updateStyle('align', 'left')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  styleValue.align === 'left' || !styleValue.align
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => updateStyle('align', 'center')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  styleValue.align === 'center'
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => updateStyle('align', 'right')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  styleValue.align === 'right'
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>

              {hasCustomStyle && (
                <button
                  type="button"
                  onClick={() => onStyleChange({})}
                  className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                  title="Reset Formatting to Default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input / Textarea with Live Styled Preview */}
      {isTextarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed"
          style={{
            color: styleValue.color || undefined,
            fontWeight: styleValue.fontWeight === 'bold' ? 700 : styleValue.fontWeight === 'semibold' ? 600 : undefined,
            fontStyle: styleValue.italic ? 'italic' : undefined,
            textDecoration: styleValue.underline ? 'underline' : undefined,
            textAlign: styleValue.align || undefined,
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
          style={{
            color: styleValue.color || undefined,
            fontWeight: styleValue.fontWeight === 'bold' ? 700 : styleValue.fontWeight === 'semibold' ? 600 : undefined,
            fontStyle: styleValue.italic ? 'italic' : undefined,
            textDecoration: styleValue.underline ? 'underline' : undefined,
            textAlign: styleValue.align || undefined,
          }}
        />
      )}

      {helperText && (
        <p className="text-[10px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
