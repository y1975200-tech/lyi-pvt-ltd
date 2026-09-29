import React from 'react';

export interface ImageWithEffectsProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  variant?: 'blue' | 'cyan';
  disableEffect?: boolean;
}

export const ImageWithEffects: React.FC<ImageWithEffectsProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover object-center',
  containerClassName = 'relative w-full h-full overflow-hidden',
  onError,
  style,
  variant = 'blue',
  disableEffect = false,
  ...props
}) => {
  if (disableEffect) {
    return (
      <div className={containerClassName}>
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          onError={onError}
          {...props}
        />
      </div>
    );
  }

  const gradientClass =
    variant === 'cyan'
      ? 'from-slate-950/95 via-slate-900/90 to-[#082a3d]/85'
      : 'from-slate-950/95 via-slate-900/90 to-[#0e2246]/85';

  const orbColor = variant === 'cyan' ? 'bg-cyan-500/25' : 'bg-blue-500/25';

  return (
    <div className={`${containerClassName} bg-slate-950 relative overflow-hidden group`}>
      {/* Background Image Layer with subtle cinematic movement/saturation */}
      <img
        src={src}
        alt={alt}
        className={`${className} opacity-35 group-hover:scale-105 transition-transform duration-700 filter saturate-150`}
        style={style}
        onError={onError}
        {...props}
      />
      {/* Cinematic Dark Navy/Cyan Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} backdrop-blur-[1px] pointer-events-none`} />
      {/* High-Tech Dot Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      {/* Ambient Glowing Corner Orb */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 ${orbColor} rounded-full blur-2xl pointer-events-none`} />
    </div>
  );
};
