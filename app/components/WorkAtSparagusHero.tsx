"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";
import { ArrowDown } from "lucide-react";

interface WorkAtSparagusHeroProps {
  title: string;
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

// Hook to safely get client-side values after hydration
function useClientMediaState() {
  const [state, setState] = useState({
    isMobile: false,
    shouldLoadVideo: false,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string } }
    ).connection;
    const isSlowConnection = connection?.effectiveType === "2g";

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Required for hydration safety
    setState({
      isMobile:
        /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768,
      shouldLoadVideo: !mediaQuery.matches && !isSlowConnection,
    });

    const handleChange = (e: MediaQueryListEvent) => {
      const conn = (
        navigator as Navigator & { connection?: { effectiveType?: string } }
      ).connection;
      setState((prev) => ({
        ...prev,
        shouldLoadVideo: !e.matches && !(conn?.effectiveType === "2g"),
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return state;
}

export default function WorkAtSparagusHero({ title }: WorkAtSparagusHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const { isMobile, shouldLoadVideo } = useClientMediaState();

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

  // Ensure video loops properly
  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return;

    const video = videoRef.current;

    // Ensure loop attribute is set
    video.loop = true;

    // Handle ended event as fallback for browsers where loop doesn't work
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [shouldLoadVideo]);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !videoContainerRef.current ||
        !titleRef.current ||
        !descriptionRef.current ||
        // !ctaRef.current ||
        !animationReady
      )
        return;

      const section = sectionRef.current;
      const videoContainer = videoContainerRef.current;
      const titleElement = titleRef.current;
      const descriptionElement = descriptionRef.current;
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

      // Fix descender clipping (g, y, p letters) - add padding to lines, keep masks clipping
      gsap.set(titleSplit.lines, {
        paddingBottom: "0.1em",
        yPercent: 100,
      });
      gsap.set(titleSplit.masks, {
        marginBottom: "-0.1em",
      });

      // Make description visible and create SplitText
      gsap.set(descriptionElement, { opacity: 1 });
      const descriptionSplit = SplitText.create(descriptionElement, {
        type: "lines",
        mask: "lines",
      });

      // Fix descender clipping for description
      gsap.set(descriptionSplit.lines, {
        paddingBottom: "0.1em",
        yPercent: 100,
      });
      gsap.set(descriptionSplit.masks, {
        marginBottom: "-0.1em",
      });

      // Set initial state for CTA button
      // gsap.set(ctaElement, {
      //   opacity: 0,
      //   y: 20,
      // });

      // Create unified timeline
      const timeline = gsap.timeline();

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

      // Description animation - follows title
      timeline.to(
        descriptionSplit.lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
        },
        `-=${ANIMATION_CONFIG.ctaOverlap}`
      );

      // CTA button animation
      // timeline.to(
      //   ctaElement,
      //   {
      //     opacity: 1,
      //     y: 0,
      //     duration: 0.5,
      //     ease: "power2.out",
      //   },
      //   `-=${ANIMATION_CONFIG.ctaOverlap}`
      // );

      // Cleanup
      return () => {
        titleSplit.revert();
        descriptionSplit.revert();
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
        className="absolute inset-0 z-0 origin-center will-change-transform backface-hidden"
        style={{ willChange: "clip-path, transform" }}
      >
        {/* Poster image - loads immediately, improves LCP */}
        <Image
          src="/videohero-poster.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Video - conditionally loaded based on device/connection */}
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
            poster="/videohero-poster.jpg"
            onCanPlay={(e) => {
              // Fade in video once it's ready to play
              e.currentTarget.style.opacity = "1";
            }}
            onError={(e) => {
              // Fallback to poster image if video fails to load
              console.warn("Video failed to load, using poster image", e);
            }}
          >
            {/* Mobile: Use smaller 480p version */}
            {isMobile ? (
              <>
                <source src="/videohero-mobile.webm" type="video/webm" />
                <source src="/videohero-mobile.mp4" type="video/mp4" />
              </>
            ) : (
              <>
                {/* Desktop: Use 720p version - WebM first (smaller) */}
                <source src="/videohero.webm" type="video/webm" />
                {/* MP4 fallback - for broader browser support */}
                <source src="/videohero.mp4" type="video/mp4" />
              </>
            )}
          </video>
        )}

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10 z-0" />
        {/* Edge smoothing overlay - helps anti-alias clip-path edges */}
        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5)] rounded-[inherit]" />
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
          <p
            ref={descriptionRef}
            className="text-base md:text-lg text-white/80 font-pp-neue-montreal max-w-lg opacity-0"
          >
            Join our team of innovators, designers, and engineers building
            exceptional digital experiences.
          </p>
        </div>

        {/* Right side - CTA Button */}
        {/* <div ref={ctaRef} className="flex items-end opacity-0">
          <div className="w-12 h-12 bg-[var(--primary)] rounded-sm flex items-center justify-center">
            <ArrowDown className="text-white w-6 h-6" />
          </div>
        </div> */}
      </div>
    </section>
  );
}
