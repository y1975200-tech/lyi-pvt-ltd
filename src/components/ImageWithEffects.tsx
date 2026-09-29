import React from 'react';

export interface ImageWithEffectsProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  isStandalone?: boolean;
  className?: string;
  containerClassName?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const ImageWithEffects: React.FC<ImageWithEffectsProps> = ({
  src,
  alt,
  isStandalone = false,
  className = 'w-full h-full object-cover object-center',
  containerClassName = 'relative w-full h-full overflow-hidden',
  onError,
  style,
  ...props
}) => {
  if (isStandalone) {
    return (
      <div className={containerClassName}>
        <img
          src={src}
          alt={alt}
          className={`${className} transition-all duration-700 ease-out brightness-[0.92] contrast-[1.04]`}
          style={style}
          onError={onError}
          {...props}
        />
        {/* Subtle, clean depth gradient for standalone images ensuring high contrast and professional finish */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/65" />
      </div>
    );
  }

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
};
