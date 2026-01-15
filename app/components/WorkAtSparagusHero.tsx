"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";
import { ArrowDown } from "lucide-react";

interface WorkAtSparagusHeroProps {
  title: string;
  description: string;
}

// ============================================
// ANIMATION TIMING CONFIG - Adjust these values
// ============================================
const ANIMATION_CONFIG = {
  // Delay before clip-path animation starts (relative to loader completion)
  // Positive = wait after loader, 0 = start immediately when loader finishes
  animationStartDelay: 0, // seconds - wait for Lottie loader to complete

  // Clip-path animation duration
  clipPathDuration: 1.8,

  // How much the text animation overlaps with clip-path (seconds before clip ends)
  textOverlap: 0.7,

  // How much the CTA overlaps with text animation
  ctaOverlap: 0.4,
};
// ============================================

export default function WorkAtSparagusHero({
  title,
  description,
}: WorkAtSparagusHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect device type, connection quality, and motion preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleReducedMotionChange);

    // Detect mobile device
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    // Check connection quality (if available)
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    const isGoodConnection =
      !connection ||
      connection.effectiveType === "4g" ||
      connection.effectiveType === "5g";

    // Decide whether to load video:
    // - Don't load on mobile (use poster image instead)
    // - Don't load if user prefers reduced motion
    // - Don't load if connection is slow (2g/3g)
    const shouldLoad = !isMobile && !mediaQuery.matches && isGoodConnection;

    setShouldLoadVideo(shouldLoad);

    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  // Set initial clip-path immediately on mount (before loader completes)
  // This ensures the rectangle is visible the moment the page is revealed
  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current) return;

    const section = sectionRef.current;
    const videoContainer = videoContainerRef.current;

    // Calculate initial dimensions
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;
    const initialSize = Math.min(sectionWidth, sectionHeight) * 0.3;
    const initialInsetTop = (sectionHeight - initialSize) / 2;
    const initialInsetLeft = (sectionWidth - initialSize) / 2;
    const initialBorderRadius = initialSize / 2;

    // Apply initial clip-path immediately
    videoContainer.style.clipPath = `inset(${initialInsetTop}px ${initialInsetLeft}px ${initialInsetTop}px ${initialInsetLeft}px)`;
    videoContainer.style.borderRadius = `${initialBorderRadius}px`;
    videoContainer.style.transform = "rotate(-10deg) scale(1)";
    videoContainer.style.transformOrigin = "center center";
    videoContainer.style.visibility = "visible";
  }, []);

  // Setup animation timeline (paused) and listen for loader
  useEffect(() => {
    const handlePageLoaderComplete = () => {
      // Wait for the specified delay after loader completes
      // This ensures the Lottie animation finishes before this animation starts
      setTimeout(() => {
        setAnimationReady(true);
      }, ANIMATION_CONFIG.animationStartDelay * 1000);
    };

    // Check if PageLoader is already complete
    if (document.documentElement.classList.contains("page-loader-complete")) {
      handlePageLoaderComplete();
    } else {
      // Listen for PageLoader completion (fires when Lottie animation finishes)
      window.addEventListener("pageLoaderComplete", handlePageLoaderComplete);

      return () => {
        window.removeEventListener(
          "pageLoaderComplete",
          handlePageLoaderComplete
        );
      };
    }
  }, []);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !videoContainerRef.current ||
        !titleRef.current ||
        !ctaRef.current ||
        !animationReady
      )
        return;

      const section = sectionRef.current;
      const videoContainer = videoContainerRef.current;
      const titleElement = titleRef.current;
      const ctaElement = ctaRef.current;

      // Ensure section has white background
      gsap.set(section, {
        backgroundColor: "#000000",
      });

      // Get section dimensions
      const sectionWidth = section.offsetWidth;
      const sectionHeight = section.offsetHeight;

      // Calculate initial size (30% of smaller dimension)
      const initialSize = Math.min(sectionWidth, sectionHeight) * 0.3;
      const initialWidth = initialSize;
      const initialHeight = initialSize;

      // Calculate initial inset to center the rectangle
      const initialInsetTop = (sectionHeight - initialHeight) / 2;
      const initialInsetLeft = (sectionWidth - initialWidth) / 2;
      const initialInsetRight = (sectionWidth - initialWidth) / 2;
      const initialInsetBottom = (sectionHeight - initialHeight) / 2;

      // Initial border-radius (large = circular, small = rectangular)
      const initialBorderRadius = Math.min(initialWidth, initialHeight) / 2;
      const finalBorderRadius = 0;

      // Initial rotation and scale
      const initialRotation = -10;
      const finalRotation = 0;
      const initialScale = 1.0;
      const finalScale = 1.05;

      // Animation data object for clip-path
      const animationData = {
        insetTop: initialInsetTop,
        insetRight: initialInsetRight,
        insetBottom: initialInsetBottom,
        insetLeft: initialInsetLeft,
        borderRadius: initialBorderRadius,
        rotation: initialRotation,
        scale: initialScale,
      };

      // Set initial state for video container
      gsap.set(videoContainer, {
        clipPath: `inset(${initialInsetTop}px ${initialInsetRight}px ${initialInsetBottom}px ${initialInsetLeft}px)`,
        borderRadius: `${initialBorderRadius}px`,
        rotation: initialRotation,
        scale: initialScale,
        transformOrigin: "center center",
      });

      // Make title visible (was hidden with opacity-0 to prevent FOUC)
      gsap.set(titleElement, { opacity: 1 });

      // Create SplitText for title
      const titleSplit = SplitText.create(titleElement, {
        type: "lines",
        mask: "lines",
      });

      // Set initial state for text (hidden, translated down)
      gsap.set(titleSplit.lines, {
        yPercent: 100,
      });

      // Set initial state for CTA button
      gsap.set(ctaElement, {
        opacity: 0,
        y: 20,
      });

      // Create unified timeline
      const timeline = gsap.timeline();
      timelineRef.current = timeline;

      // Clip-path animation
      timeline.to(animationData, {
        insetTop: 0,
        insetRight: 0,
        insetBottom: 0,
        insetLeft: 0,
        borderRadius: finalBorderRadius,
        rotation: finalRotation,
        scale: finalScale,
        duration: ANIMATION_CONFIG.clipPathDuration,
        ease: "power2.out",
        onUpdate: function () {
          videoContainer.style.clipPath = `inset(${animationData.insetTop}px ${animationData.insetRight}px ${animationData.insetBottom}px ${animationData.insetLeft}px)`;
          videoContainer.style.borderRadius = `${animationData.borderRadius}px`;
          videoContainer.style.transform = `rotate(${animationData.rotation}deg) scale(${animationData.scale})`;
        },
      });

      // Text animation - overlaps with clip-path
      timeline.to(
        titleSplit.lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
        },
        `-=${ANIMATION_CONFIG.textOverlap}`
      );

      // CTA button animation
      timeline.to(
        ctaElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        `-=${ANIMATION_CONFIG.ctaOverlap}`
      );

      // Cleanup
      return () => {
        titleSplit.revert();
      };
    },
    { scope: sectionRef, dependencies: [animationReady] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-svh flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden bg-black"
    >
      {/* Video Background Container with Clip Path */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 z-0"
        style={{
          transformOrigin: "center center",
          willChange: "clip-path, transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* Poster image - loads immediately, improves LCP */}
        <img
          src="/videohero-poster.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Video - conditionally loaded based on device/connection */}
        {shouldLoadVideo && !prefersReducedMotion && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
            poster="/videohero-poster.jpg"
            onCanPlay={() => {
              // Fade in video once it's ready to play
              if (videoRef.current) {
                videoRef.current.style.opacity = "1";
              }
            }}
            onError={(e) => {
              // Fallback to poster image if video fails to load
              console.warn("Video failed to load, using poster image", e);
            }}
          >
            {/* WebM format - better compression, load first (30-40% smaller) */}
            <source src="/videohero.webm" type="video/webm" />
            {/* MP4 fallback - for broader browser support */}
            <source src="/videohero.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />
        {/* Edge smoothing overlay - helps anti-alias clip-path edges */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5)",
            borderRadius: "inherit",
          }}
        />
      </div>

      {/* Content Overlay - Bottom positioned */}
      <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 md:pb-12 lg:pb-16 mt-auto">
        {/* Left side - Title */}
        <div className="max-w-3xl">
          <h1
            ref={titleRef}
            className="text-4xl md:text-7xl font-normal text-white mb-4 md:mb-6 font-pp-neue-montreal text-left opacity-0"
          >
            {title}
          </h1>
        </div>

        {/* Right side - CTA Button */}
        <div ref={ctaRef} className="flex items-end opacity-0">
          <div className="w-12 h-12 bg-[#8202FF] rounded-sm flex items-center justify-center">
            <ArrowDown className="text-white w-6 h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
