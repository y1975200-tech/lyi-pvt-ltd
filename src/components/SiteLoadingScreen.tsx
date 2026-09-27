import React from 'react';

interface SiteLoadingScreenProps {
  companyName?: string;
  logoUrl?: string;
}

export const SiteLoadingScreen: React.FC<SiteLoadingScreenProps> = ({
  companyName = 'LockYourIdea Tech',
  logoUrl,
}) => {
  return (
    <div
      id="site-global-loader"
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Subtle Background Radial Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-5 max-w-sm mx-auto">
        {/* Animated Brand Logo Icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-blue-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
              {logoUrl && logoUrl !== '/assets/logo.svg' ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="max-h-10 max-w-[120px] object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 text-xl font-heading tracking-wider">
                  LYI
                </span>
              )}
            </div>
          </div>
          {/* Pulsing Ring Accent */}
          <span className="absolute -inset-2 rounded-3xl border border-blue-400/30 animate-ping pointer-events-none opacity-40" />
        </div>

        {/* Company Title & Badge */}
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
            {companyName}
          </h2>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold text-blue-700 tracking-wide font-mono">
            India's 360° AI &amp; IP Platform · HQ Baner, Pune
          </span>
        </div>

        {/* Spinner & Loading Message */}
        <div className="pt-2 flex items-center justify-center gap-2.5 text-slate-500 font-medium text-xs">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Synchronizing live CMS data...</span>
        </div>
      </div>
    </div>
  );
};
