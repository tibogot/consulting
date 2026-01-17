import React from 'react';
import styles from './LaserBorderCard.module.css';

export interface LaserBorderCardProps {
  title: string;
  description: string;
  statValue?: string;
  statLabel?: string;
  className?: string;
  animationDuration?: number;
  primaryColor?: string;
}

export default function LaserBorderCard({
  title,
  description,
  statValue,
  statLabel,
  className = '',
  animationDuration = 4,
  primaryColor = '#8202FF', // Default to theme primary color
}: LaserBorderCardProps) {
  // Calculate color variants with opacity
  const primaryColor80 = `${primaryColor}80`; // 80 hex = ~50% opacity
  const primaryColor20 = `${primaryColor}20`; // 20 hex = ~12% opacity
  const primaryColor10 = `${primaryColor}10`; // 10 hex = ~6% opacity

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#1a1a24] p-[2px] ${className}`}
    >
      {/* Traveling laser beam */}
      <div
        className="absolute w-[100px] h-[100px] blur-[2px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, ${primaryColor80} 30%, transparent 70%)`,
          animation: `travel ${animationDuration}s linear infinite`,
          top: '-50px',
          left: '-50px',
          zIndex: 0,
        }}
      />

      {/* Static border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${primaryColor20}, transparent, ${primaryColor10})`,
          padding: '1px',
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 0,
        }}
      />

      {/* Card content */}
      <div className="relative bg-gradient-to-br from-[#1a1a24] to-[#12121a] rounded-[14px] p-12 w-full z-10">
        {statValue && statLabel && (
          <div className="absolute right-0 top-5 text-left">
            <div className="mb-5">
              <div
                className="text-[42px] font-bold leading-none"
                style={{ color: primaryColor }}
              >
                {statValue}
              </div>
              <div className="text-sm text-[#888] mt-1">{statLabel}</div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-white text-2xl font-semibold mb-3">{title}</h2>
          <p className="text-[#888] text-[15px] leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
