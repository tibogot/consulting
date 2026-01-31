"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";

const DEFAULT_HERO_VIDEO_CDN =
  "https://cdn.prod.website-files.com/66d3db0a03091f83e3260124%2F66de4dfa2d65d4c9631e442e_Hero%20Visual%20%281%29-transcode.mp4";

interface WorkAtSparagusHeroProps {
  title: string;
  /** Hero description paragraph. When not provided, uses default text. */
  description?: string;
  /** Override the hero video URL. When not provided, uses the default CDN video. */
  videoSrc?: string;
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

const DEFAULT_HERO_DESCRIPTION =
  "Join our team of innovators, designers, and engineers building exceptional digital experiences.";

export default function WorkAtSparagusHero({
  title,
  description = DEFAULT_HERO_DESCRIPTION,
  videoSrc = DEFAULT_HERO_VIDEO_CDN,
}: WorkAtSparagusHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  // const ctaRef = useRef<HTMLDivElement>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const { shouldLoadVideo } = useClientMediaState(); // isMobile only used when video is enabled

  // Set initial clip-path immediately on mount (matches ManagedServicesHero approach)
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

    // Apply initial clip-path using direct DOM (like ManagedServicesHero)
    videoContainer.style.clipPath = `inset(${initialInsetTop}px ${initialInsetLeft}px ${initialInsetTop}px ${initialInsetLeft}px)`;
    videoContainer.style.borderRadius = `${initialBorderRadius}px`;
    videoContainer.style.transform = "rotate(-10deg) scale(1)";
    videoContainer.style.transformOrigin = "center center";
    videoContainer.style.visibility = "visible";
  }, []);

  // Listen for the right event to start animation
  // - Initial load: wait for PageLoader (clip-path animates while loader slides up)
  // - Navigation: wait for PageTransition (clip-path animates after overlay slides away)
  useEffect(() => {
    let hasStarted = false;

    const startAnimation = () => {
      if (hasStarted) return; // Prevent double-triggering
      hasStarted = true;
      setTimeout(() => {
        setAnimationReady(true);
      }, ANIMATION_CONFIG.animationStartDelay * 1000);
    };

    // Check if this is a navigation (PageLoader already completed previously)
    const isNavigation = document.documentElement.classList.contains(
      "page-loader-complete"
    );

    if (isNavigation) {
      // Navigation: check if PageTransition already completed (race condition fix)
      if (
        document.documentElement.classList.contains("page-transition-complete")
      ) {
        // Already completed, start immediately
        startAnimation();
        return;
      }

      // Wait for PageTransition to complete
      const handlePageTransitionComplete = () => {
        startAnimation();
      };

      window.addEventListener(
        "pageTransitionComplete",
        handlePageTransitionComplete
      );
      return () => {
        window.removeEventListener(
          "pageTransitionComplete",
          handlePageTransitionComplete
        );
      };
    } else {
      // Initial load: wait for PageLoader to complete
      const handlePageLoaderComplete = () => {
        startAnimation();
      };

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
      // const ctaElement = ctaRef.current;

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

      // Set initial state with GSAP (syncs with GSAP's internal state before animating)
      // This matches ManagedServicesHero approach
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
      className="relative flex h-svh flex-col overflow-hidden bg-black px-4 sm:px-6 lg:px-8"
    >
      {/* Video Background Container with Clip Path */}
      {/* Initially invisible via CSS to prevent FOUC - JS sets visibility after clip-path is applied */}
      <div
        ref={videoContainerRef}
        className="invisible absolute inset-0 z-0 origin-center"
        // style={{ willChange: "clip-path, transform" }}
      >
        {/* Video from CDN only - no local image or video files */}
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover opacity-0"
            onCanPlay={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onError={(e) => {
              console.warn("Video failed to load from CDN", e);
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Edge smoothing overlay - helps anti-alias clip-path edges */}
        <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Content Overlay - Bottom positioned */}
      <div className="relative z-20 mt-auto flex w-full flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between md:pb-12 lg:pb-16">
        {/* Left side - Title */}
        <div className="max-w-3xl">
          <h1
            ref={titleRef}
            className="mb-4 text-left font-pp-neue-montreal text-4xl font-normal tracking-[-0.02em] text-white opacity-0 md:mb-6 md:text-7xl"
          >
            {title}
          </h1>
          <p
            ref={descriptionRef}
            className="max-w-lg font-pp-neue-montreal text-base text-white opacity-0 md:text-lg"
          >
            {description}
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
