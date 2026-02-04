"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";

const DEFAULT_VIDEO_DESKTOP_CDN =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/videoherodark.mp4";
const DEFAULT_VIDEO_MOBILE_CDN =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/videoherodark-mobile.mp4";
const DEFAULT_HERO_DESCRIPTION =
  "Join our team of innovators, designers, and engineers building exceptional digital experiences.";

interface WorkAtSparagusHero4Props {
  title: string;
  /** Hero description paragraph. When not provided, uses default text. */
  description?: string;
  /** Desktop hero video URL. When not provided, uses default CDN. */
  videoSrcDesktop?: string;
  /** Mobile hero video URL. When not provided, uses default CDN. */
  videoSrcMobile?: string;
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

export default function WorkAtSparagusHero4({
  title,
  description = DEFAULT_HERO_DESCRIPTION,
  videoSrcDesktop = DEFAULT_VIDEO_DESKTOP_CDN,
  videoSrcMobile = DEFAULT_VIDEO_MOBILE_CDN,
}: WorkAtSparagusHero4Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const { shouldLoadVideo, isMobile } = useClientMediaState();

  // Set initial clip-path immediately on mount (matches ManagedServicesHero approach)
  useEffect(() => {
    if (!sectionRef.current || !videoContainerRef.current) return;

    const section = sectionRef.current;
    const videoContainer = videoContainerRef.current;

    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;
    const initialSize = Math.min(sectionWidth, sectionHeight) * 0.3;
    const initialInsetTop = (sectionHeight - initialSize) / 2;
    const initialInsetLeft = (sectionWidth - initialSize) / 2;
    const initialBorderRadius = initialSize / 2;

    videoContainer.style.clipPath = `inset(${initialInsetTop}px ${initialInsetLeft}px ${initialInsetTop}px ${initialInsetLeft}px)`;
    videoContainer.style.borderRadius = `${initialBorderRadius}px`;
    videoContainer.style.transform = "rotate(-10deg) scale(1)";
    videoContainer.style.transformOrigin = "center center";
    videoContainer.style.visibility = "visible";
  }, []);

  // Listen for the right event to start animation
  // - Initial load: wait for PageLoader (clip-path animates while loader slides up)
  // - Navigation: start immediately (page transition is commented out in layout)
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
      // Navigation: page transition is commented out in layout – start animation immediately
      startAnimation();
      return;
    }

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
  }, []);

  // Ensure video loops properly
  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return;

    const video = videoRef.current;
    video.loop = true;

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
        !animationReady
      )
        return;

      const section = sectionRef.current;
      const videoContainer = videoContainerRef.current;
      const titleElement = titleRef.current;
      const descriptionElement = descriptionRef.current;

      gsap.set(section, {
        backgroundColor: "#000000",
      });

      const sectionWidth = section.offsetWidth;
      const sectionHeight = section.offsetHeight;
      const initialSize = Math.min(sectionWidth, sectionHeight) * 0.3;
      const initialWidth = initialSize;
      const initialHeight = initialSize;
      const initialInsetTop = (sectionHeight - initialHeight) / 2;
      const initialInsetLeft = (sectionWidth - initialWidth) / 2;
      const initialInsetRight = (sectionWidth - initialWidth) / 2;
      const initialInsetBottom = (sectionHeight - initialHeight) / 2;
      const initialBorderRadius = Math.min(initialWidth, initialHeight) / 2;
      const finalBorderRadius = 0;
      const initialRotation = -10;
      const finalRotation = 0;
      const initialScale = 1.0;
      const finalScale = 1.05;

      const animationData = {
        insetTop: initialInsetTop,
        insetRight: initialInsetRight,
        insetBottom: initialInsetBottom,
        insetLeft: initialInsetLeft,
        borderRadius: initialBorderRadius,
        rotation: initialRotation,
        scale: initialScale,
      };

      gsap.set(videoContainer, {
        clipPath: `inset(${initialInsetTop}px ${initialInsetRight}px ${initialInsetBottom}px ${initialInsetLeft}px)`,
        borderRadius: `${initialBorderRadius}px`,
        rotation: initialRotation,
        scale: initialScale,
        transformOrigin: "center center",
      });

      gsap.set(titleElement, { opacity: 1 });

      const titleSplit = SplitText.create(titleElement, {
        type: "lines",
        mask: "lines",
      });
      gsap.set(titleSplit.lines, {
        paddingBottom: "0.1em",
        yPercent: 100,
      });
      gsap.set(titleSplit.masks, {
        marginBottom: "-0.1em",
      });

      gsap.set(descriptionElement, { opacity: 1 });
      const descriptionSplit = SplitText.create(descriptionElement, {
        type: "lines",
        mask: "lines",
      });
      gsap.set(descriptionSplit.lines, {
        paddingBottom: "0.1em",
        yPercent: 100,
      });
      gsap.set(descriptionSplit.masks, {
        marginBottom: "-0.1em",
      });

      const timeline = gsap.timeline();

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

      return () => {
        titleSplit.revert();
        descriptionSplit.revert();
      };
    },
    { scope: sectionRef, dependencies: [animationReady] }
  );

  const videoSrc = isMobile ? videoSrcMobile : videoSrcDesktop;

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh flex-col overflow-hidden bg-black px-4 sm:px-6 lg:px-8"
    >
      <div
        ref={videoContainerRef}
        className="invisible absolute inset-0 z-0 origin-center"
      >
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            // crossOrigin="anonymous"
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

        <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5)]" />
      </div>

      <div className="relative z-20 mt-auto flex w-full flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between md:pb-12 lg:pb-16">
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
      </div>
    </section>
  );
}
