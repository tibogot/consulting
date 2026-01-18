"use client";

import React from "react";
import styles from './AnimatedVerticalLines.module.css';

export interface AnimatedVerticalLinesProps {
  title: string;
  description: string;
  lineHeight?: number; // Height of the vertical lines in pixels
  animationDuration?: number;
  primaryColor?: string;
  className?: string;
}

export default function AnimatedVerticalLines({
  title,
  description,
  lineHeight = 250,
  animationDuration = 3,
  primaryColor = "#ff2dff",
  className = '',
}: AnimatedVerticalLinesProps) {
  const primaryColor80 = `${primaryColor}80`; // ~50% opacity
  const primaryColorB3 = `${primaryColor}b3`; // ~70% opacity

  // Gap from edges (in pixels)
  const edgeGap = 20;

  // Use CSS variables instead of dynamically injected keyframes.
  // This avoids race conditions where another instance unmounts and removes shared styles.
  const beamStart = `${edgeGap}px`;
  const beamEnd = `${Math.max(edgeGap, lineHeight - edgeGap)}px`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full bg-black ${className}`}
      style={{ 
        height: '100svh',
        '--animation-duration': `${animationDuration}s`,
        '--beam-start': beamStart,
        '--beam-end': beamEnd,
        '--beam-color': primaryColor,
        '--beam-color-80': primaryColor80,
      } as React.CSSProperties}
    >
      {/* Top vertical line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "0.5px",
          height: `${lineHeight}px`,
          background: `linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3), transparent)`,
        }}
      >
        {/* Traveling beam on top line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ top: "-30px", zIndex: 1 }}
        >
          <div
            className={`blur-[0.5px] ${styles.beamTop}`}
            style={{
              // Keep beam core exactly on the line so the line remains visible underneath
              width: "0.5px",
              height: "60px",
              background: `linear-gradient(to bottom, transparent, ${primaryColorB3}, ${primaryColorB3}, transparent)`,
              boxShadow: `0 0 6px ${primaryColor}, 0 0 12px ${primaryColor80}`,
            }}
          />
        </div>
      </div>

      {/* Bottom vertical line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "0.5px",
          height: `${lineHeight}px`,
          background: `linear-gradient(to top, transparent, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3), transparent)`,
        }}
      >
        {/* Traveling beam on bottom line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ bottom: "-30px", zIndex: 1 }}
        >
          <div
            className={`blur-[0.5px] ${styles.beamBottom}`}
            style={{
              // Keep beam core exactly on the line so the line remains visible underneath
              width: "0.5px",
              height: "60px",
              background: `linear-gradient(to top, transparent, ${primaryColorB3}, ${primaryColorB3}, transparent)`,
              boxShadow: `0 0 6px ${primaryColor}, 0 0 12px ${primaryColor80}`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-white text-4xl md:text-6xl font-normal mb-6 font-pp-neue-montreal">
          {title}
        </h1>
        <p className="text-gray-300 text-sm md:text-base font-pp-neue-montreal uppercase">
          {description}
        </p>
      </div>

    </div>
  );
}
