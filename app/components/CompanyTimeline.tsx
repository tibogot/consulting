"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

type TimelineMilestone = {
  year: number;
  title: string;
  description: string;
};

const MILESTONES: TimelineMilestone[] = [
  {
    year: 2017,
    title: "Foundation",
    description: "Sparagus was founded with a vision to connect exceptional talent with transformative opportunities.",
  },
  {
    year: 2018,
    title: "First Expansion",
    description: "Expanded operations across Europe, establishing our presence in key markets.",
  },
  {
    year: 2019,
    title: "Technology Hub",
    description: "Launched our technology consulting division, bringing specialized IT expertise to clients.",
  },
  {
    year: 2020,
    title: "Digital Transformation",
    description: "Pivoted to remote-first operations, enabling global reach and enhanced service delivery.",
  },
  {
    year: 2021,
    title: "Engineering Excellence",
    description: "Established engineering hub, providing specialized solutions across all sectors.",
  },
  {
    year: 2022,
    title: "Managed Services",
    description: "Introduced comprehensive managed services, offering end-to-end operational support.",
  },
  {
    year: 2023,
    title: "Global Growth",
    description: "Expanded to multiple continents, strengthening our international presence.",
  },
  {
    year: 2024,
    title: "Innovation Leader",
    description: "Recognized as a leader in digital transformation and talent solutions.",
  },
  {
    year: 2025,
    title: "Future Forward",
    description: "Continuing to innovate and shape the future of consulting and managed services.",
  },
];

// Generate a smooth curved SVG path
const generateCurvedPath = (width: number, height: number, padding: number = 0) => {
  // Account for padding - path should span the content area, not the padding
  const contentStartX = padding;
  const contentEndX = width - padding;
  const contentWidth = width - (padding * 2);
  
  const startX = contentStartX + contentWidth * 0.05;
  const startY = height * 0.4;
  const endX = contentStartX + contentWidth * 0.95;
  const endY = height * 0.6;
  
  // Create multiple curves for a wavy/flowing effect
  const cp1x = contentStartX + contentWidth * 0.25;
  const cp1y = height * 0.25;
  const cp2x = contentStartX + contentWidth * 0.45;
  const cp2y = height * 0.5;
  const cp3x = contentStartX + contentWidth * 0.65;
  const cp3y = height * 0.55;
  const cp4x = contentStartX + contentWidth * 0.85;
  const cp4y = height * 0.65;
  
  // Use smooth cubic bezier curves
  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cp3x} ${cp3y} S ${cp4x} ${cp4y}, ${endX} ${endY}`;
};

export default function CompanyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 800 });

  // Calculate total width based on number of milestones
  // Add padding on both sides so first and last cards are fully visible
  const panelWidth = 600;
  const viewportPadding = typeof window !== 'undefined' ? window.innerWidth / 2 : 800;
  const totalWidth = MILESTONES.length * panelWidth + (viewportPadding * 2);

  useEffect(() => {
    const updateDimensions = () => {
      const padding = window.innerWidth / 2;
      const calculatedWidth = MILESTONES.length * panelWidth + (padding * 2);
      setDimensions({ width: calculatedWidth, height: 800 });
    };
    if (typeof window !== 'undefined') {
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const path = pathRef.current;
      if (!section || !track || !path) return;

      // Cleanup previous tween
      if (tweenRef.current) {
        const st = tweenRef.current.scrollTrigger as ScrollTrigger | undefined;
        st?.kill();
        tweenRef.current.kill();
        tweenRef.current = null;
      }

      // Use setTimeout to ensure SVG is rendered
      const timeoutId = setTimeout(() => {
        const pathLength = path.getTotalLength();
        if (pathLength === 0) return;

        // Set up the path for animation (start with path fully hidden)
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        const getScrollDistance = () => {
          const padding = window.innerWidth / 2;
          return Math.max(0, track.scrollWidth - window.innerWidth);
        };

        // Animate the track horizontally
        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Animate the path drawing based on scroll progress
              const progress = self.progress;
              const drawLength = pathLength * progress;
              gsap.set(path, {
                strokeDashoffset: pathLength - drawLength,
              });
            },
          },
        });

        tweenRef.current = tween;
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (tweenRef.current) {
          const st = tweenRef.current.scrollTrigger as ScrollTrigger | undefined;
          st?.kill();
          tweenRef.current.kill();
          tweenRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [dimensions.width] }
  );

  // Calculate milestone positions
  const getMilestoneX = (index: number) => {
    if (dimensions.width === 0) return 0;
    const padding = typeof window !== 'undefined' ? window.innerWidth / 2 : 800;
    const contentWidth = MILESTONES.length * panelWidth;
    // Distribute milestones evenly across content width, with padding on sides
    return padding + (index / (MILESTONES.length - 1)) * contentWidth;
  };

  // Calculate Y position along the curved path for a given X
  const getYOnPath = (x: number) => {
    const padding = typeof window !== 'undefined' ? window.innerWidth / 2 : 800;
    const width = dimensions.width;
    const height = dimensions.height;
    const contentWidth = width - (padding * 2);
    const relativeX = x - padding;
    const progress = relativeX / contentWidth;
    
    // Approximate the curve - this matches our generateCurvedPath function
    const startY = height * 0.4;
    const endY = height * 0.6;
    const cp1y = height * 0.25;
    const cp2y = height * 0.5;
    const cp3y = height * 0.55;
    const cp4y = height * 0.65;
    
    // Cubic bezier approximation
    const t = Math.min(1, Math.max(0, progress));
    const mt = 1 - t;
    
    if (t < 0.5) {
      // First half of curve
      const t1 = t * 2;
      const mt1 = 1 - t1;
      const cp1x = width * 0.25;
      const cp2x = width * 0.45;
      const cp3x = width * 0.65;
      const y = mt1 * mt1 * mt1 * startY + 3 * mt1 * mt1 * t1 * cp1y + 3 * mt1 * t1 * t1 * cp2y + t1 * t1 * t1 * cp3y;
      return y;
    } else {
      // Second half of curve
      const t2 = (t - 0.5) * 2;
      const mt2 = 1 - t2;
      const cp3x = width * 0.65;
      const cp4x = width * 0.85;
      const endX = width * 0.95;
      const y = mt2 * mt2 * mt2 * cp3y + 3 * mt2 * mt2 * t2 * cp4y + 3 * mt2 * t2 * t2 * endY + t2 * t2 * t2 * endY;
      return y;
    }
  };

  // Calculate total width with padding
  const padding = typeof window !== 'undefined' ? window.innerWidth / 2 : 800;
  const calculatedTotalWidth = MILESTONES.length * panelWidth + (padding * 2);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-black overflow-hidden">
      <div 
        ref={trackRef} 
        className="flex h-full relative" 
        style={{ width: `${calculatedTotalWidth}px`, minWidth: `${calculatedTotalWidth}px` }}
      >
        {/* SVG Timeline Path */}
        {dimensions.width > 0 && (
          <svg
            className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none z-0"
            style={{ 
              width: `${dimensions.width}px`, 
              height: `${dimensions.height}px`,
            }}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#9333ea" stopOpacity="1" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Background path (subtle guide) */}
            <path
              d={generateCurvedPath(dimensions.width, dimensions.height, typeof window !== 'undefined' ? window.innerWidth / 2 : 800)}
              fill="none"
              stroke="rgba(168, 85, 247, 0.1)"
              strokeWidth="1"
            />
            
            {/* Animated drawing path */}
            <path
              ref={pathRef}
              d={generateCurvedPath(dimensions.width, dimensions.height, typeof window !== 'undefined' ? window.innerWidth / 2 : 800)}
              fill="none"
              stroke="url(#timelineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          </svg>
        )}

        {/* Milestone Panels */}
        {MILESTONES.map((milestone, index) => {
          const padding = typeof window !== 'undefined' ? window.innerWidth / 2 : 800;
          const x = getMilestoneX(index);
          const y = getYOnPath(x);
          const isEven = index % 2 === 0;

          return (
            <div
              key={milestone.year}
              className="absolute flex flex-col items-center z-10"
              style={{
                left: `${x}px`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Milestone dot on path */}
              <div
                className="absolute w-5 h-5 rounded-full bg-white border-2 border-black z-20 transition-all duration-300"
                style={{
                  top: `${y - dimensions.height / 2}px`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
                }}
              />
              
              {/* Connecting line from dot to content */}
              <div
                className="absolute w-px bg-purple-500/30 z-10"
                style={{
                  top: `${y - dimensions.height / 2}px`,
                  height: isEven ? "120px" : "120px",
                  transform: `translateX(-50%) ${isEven ? "translateY(0)" : "translateY(-120px) rotate(180deg)"}`,
                }}
              />
              
              {/* Content panel */}
              <div
                className={`absolute w-72 ${
                  isEven ? "top-32" : "bottom-32"
                } left-1/2 -translate-x-1/2`}
              >
                <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="text-white/50 text-xs font-pp-neue-montreal mb-2 uppercase tracking-wider">
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-normal text-white font-pp-neue-montreal mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-white/70 text-sm font-pp-neue-montreal leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
