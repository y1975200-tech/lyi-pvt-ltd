import React, { useEffect, useState, useRef } from 'react';

interface CountUpNumberProps {
  value: string | number;
  duration?: number; // in ms
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  duration = 1600,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  // Parse raw value string (e.g. "1,200+", "90%+", "100+", "500+")
  const rawStr = String(value).trim();
  const numericMatch = rawStr.match(/[\d,.]+/);
  const cleanNumberStr = numericMatch ? numericMatch[0].replace(/,/g, '') : '0';
  const targetNumber = parseFloat(cleanNumberStr) || 0;
  const isFloat = cleanNumberStr.includes('.');
  const hasComma = rawStr.includes(',');

  // Extract prefix and suffix
  const prefixMatch = rawStr.match(/^[^\d]+/);
  const prefix = prefixMatch ? prefixMatch[0] : '';
  const suffixMatch = rawStr.match(/[^\d]+$/);
  const suffix = suffixMatch ? suffixMatch[0] : '';

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out expo curve for ultra smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = targetNumber * easeProgress;

      let formattedNumber: string;
      if (isFloat) {
        formattedNumber = currentVal.toFixed(1);
      } else {
        const rounded = Math.round(currentVal);
        formattedNumber = hasComma
          ? rounded.toLocaleString('en-US')
          : String(rounded);
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Use IntersectionObserver to start counting when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration, targetNumber, isFloat, hasComma, prefix, suffix]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
};
