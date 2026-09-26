import React from 'react';
import { ClientLogoItem, TextStyle } from '../types.ts';
import { Sparkles } from 'lucide-react';
import { applyFieldStyle } from '../lib/styleHelper.ts';

interface ClientLogoScrollerProps {
  logos?: ClientLogoItem[];
  title?: string;
  badge?: string;
  badgeStyle?: TextStyle;
  titleStyle?: TextStyle;
}

export const ClientLogoScroller: React.FC<ClientLogoScrollerProps> = ({
  logos = [],
  title = 'TRUSTED BY ENTERPRISES, HIGH-GROWTH STARTUPS & INSTITUTIONS',
  badge = 'CLIENT SUCCESS NETWORK',
  badgeStyle,
  titleStyle,
}) => {
  // Only display active logos
  const activeLogos = (logos || []).filter((l) => l.active !== false);
  if (activeLogos.length === 0) return null;

  // Ensure enough items so continuous seamless animation doesn't have any visual gaps
  let displayLogos = [...activeLogos];
  while (displayLogos.length < 12) {
    displayLogos = [...displayLogos, ...activeLogos];
  }
  // Double for loop
  displayLogos = [...displayLogos, ...displayLogos];

  return (
    <section className="relative py-10 sm:py-12 bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-[#090d16] dark:via-slate-900/50 dark:to-[#090d16] border-y border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-[11px] font-semibold tracking-wider uppercase mb-2">
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span style={applyFieldStyle(badgeStyle)}>{badge}</span>
        </div>

        <p
          style={applyFieldStyle(titleStyle)}
          className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase font-heading"
        >
          {title}
        </p>
      </div>

      {/* Logo Scroller */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#090d16] dark:via-[#090d16]/80 dark:to-transparent z-10" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[#090d16] dark:via-[#090d16]/80 dark:to-transparent z-10" />

        {/* Continuous Sliding Track */}
        <div className="animate-infinite-slider flex items-center gap-8 sm:gap-12 py-3 px-4">
          {displayLogos.map((item, idx) => {
            const logoW = item.width || 140;
            const logoH = item.height || 48;
            const logoFit = item.fit || 'contain';
            const accent = item.accentColor || '#7c3aed';
            const rawUrl = item.link || item.websiteUrl;
            const altLabel = item.altText || item.title || item.name;

            const targetUrl =
              rawUrl && rawUrl.trim().length > 0
                ? rawUrl.startsWith('http')
                  ? rawUrl.trim()
                  : `https://${rawUrl.trim()}`
                : undefined;

            const LogoImageElement = (
              <div
                className="relative flex items-center justify-center cursor-pointer group/logo overflow-hidden shrink-0 select-none transition-transform duration-200 hover:scale-105"
                style={{
                  width: `${logoW}px`,
                  height: `${logoH}px`,
                  minWidth: `${logoW}px`,
                  maxWidth: `${logoW}px`,
                  flexShrink: 0,
                }}
              >
                {item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt={altLabel}
                    title={item.title || item.name}
                    style={{
                      objectFit: logoFit,
                      width: '100%',
                      height: '100%',
                      filter: 'none',
                    }}
                    className="transition-transform duration-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const parent = (e.currentTarget as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <span
                            style="
                              color:${accent};
                              font-weight:800;
                              font-size:13px;
                              letter-spacing:-0.5px;
                            "
                          >
                            ${item.name.slice(0, 3).toUpperCase()}
                          </span>
                        `;
                      }
                    }}
                  />
                ) : (
                  <span style={{ color: accent }} className="font-bold text-xs">
                    {item.name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
            );

            return targetUrl ? (
              <a
                key={`${item.id}-${idx}`}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${item.name} (${targetUrl})`}
                className="shrink-0 no-underline focus:outline-none block"
                style={{
                  width: `${logoW}px`,
                  height: `${logoH}px`,
                  flexShrink: 0,
                }}
              >
                {LogoImageElement}
              </a>
            ) : (
              <div
                key={`${item.id}-${idx}`}
                className="shrink-0 block"
                title={item.title || item.name}
                style={{
                  width: `${logoW}px`,
                  height: `${logoH}px`,
                  flexShrink: 0,
                }}
              >
                {LogoImageElement}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
