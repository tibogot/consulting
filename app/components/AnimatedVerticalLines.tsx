"use client";

import React, { useEffect } from 'react';
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
  primaryColor = '#8202FF',
  className = '',
}: AnimatedVerticalLinesProps) {
  const primaryColor80 = `${primaryColor}80`; // ~50% opacity
  const primaryColor20 = `${primaryColor}20`; // ~12% opacity

  // Create unique animation names based on lineHeight to avoid conflicts
  const animationId = `line-${lineHeight}`;
  const travelTopAnimation = `travelTop-${animationId}`;
  const travelBottomAnimation = `travelBottom-${animationId}`;

  // Gap from edges (in pixels)
  const edgeGap = 20;

  // Inject keyframes dynamically to ensure they work on refresh
  useEffect(() => {
    const styleId = `animated-vertical-lines-${animationId}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Calculate the animation range with gaps from edges
    const startY = edgeGap;
    const endY = lineHeight - edgeGap;

    styleElement.textContent = `
      @keyframes ${travelTopAnimation} {
        0% {
          transform: translateX(-50%) translateY(${startY}px);
          opacity: 0.7;
        }
        50% {
          transform: translateX(-50%) translateY(${endY}px);
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) translateY(${startY}px);
          opacity: 0.7;
        }
      }
      
      @keyframes ${travelBottomAnimation} {
        0% {
          transform: translateX(-50%) translateY(-${startY}px);
          opacity: 0.7;
        }
        50% {
          transform: translateX(-50%) translateY(-${endY}px);
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) translateY(-${startY}px);
          opacity: 0.7;
        }
      }
    `;

    return () => {
      // Cleanup on unmount
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [animationId, travelTopAnimation, travelBottomAnimation, lineHeight, edgeGap]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full bg-black ${className}`}
      style={{ 
        height: '100svh',
        '--line-height': `${lineHeight}px`,
        '--animation-duration': `${animationDuration}s`,
      } as React.CSSProperties}
    >
      {/* Top vertical line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '0.5px',
          height: `${lineHeight}px`,
          background: `linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3), transparent)`,
        }}
      >
        {/* Traveling beam on top line */}
        <div
          className={`absolute blur-[0.5px] pointer-events-none ${styles.beamTop}`}
          style={{
            width: '1px',
            height: '60px',
            background: `linear-gradient(to bottom, transparent, ${primaryColor}, ${primaryColor}, transparent)`,
            left: '50%',
            transform: 'translateX(-50%)',
            top: '-30px',
            zIndex: 1,
            animation: `${travelTopAnimation} ${animationDuration}s ease-in-out infinite`,
            boxShadow: `0 0 6px ${primaryColor}, 0 0 12px ${primaryColor80}`,
          }}
        />
      </div>

      {/* Bottom vertical line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '0.5px',
          height: `${lineHeight}px`,
          background: `linear-gradient(to top, transparent, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3), transparent)`,
        }}
      >
        {/* Traveling beam on bottom line */}
        <div
          className={`absolute blur-[0.5px] pointer-events-none ${styles.beamBottom}`}
          style={{
            width: '1px',
            height: '60px',
            background: `linear-gradient(to top, transparent, ${primaryColor}, ${primaryColor}, transparent)`,
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '-30px',
            zIndex: 1,
            animation: `${travelBottomAnimation} ${animationDuration}s ease-in-out infinite`,
            boxShadow: `0 0 6px ${primaryColor}, 0 0 12px ${primaryColor80}`,
          }}
        />
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
