import React from 'react';
import { ImageEffectsConfig } from '../types.ts';
import { computeImageCSS } from '../utils/imageEffectsHelper.ts';

export interface ImageWithEffectsProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  effects?: ImageEffectsConfig;
  className?: string;
  containerClassName?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const ImageWithEffects: React.FC<ImageWithEffectsProps> = ({
  src,
  alt,
  effects,
  className = 'w-full h-full object-cover object-center',
  containerClassName = 'relative w-full h-full overflow-hidden',
  onError,
  style,
  ...props
}) => {
  const { imgStyle, overlayStyle, tintStyle, gradientStyle } = computeImageCSS(effects);

  const combinedImgStyle: React.CSSProperties = {
    ...imgStyle,
    ...style,
  };

  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        className={className}
        style={combinedImgStyle}
        onError={onError}
        {...props}
      />
      {/* Solid Overlay */}
      {overlayStyle && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-200"
          style={overlayStyle}
        />
      )}
      {/* Tint Layer */}
      {tintStyle && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-200"
          style={tintStyle}
        />
      )}
      {/* Gradient Overlay */}
      {gradientStyle && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-200"
          style={gradientStyle}
        />
      )}
    </div>
  );
};
