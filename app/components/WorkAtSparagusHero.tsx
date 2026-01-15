"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";
import { ArrowDown } from "lucide-react";

interface WorkAtSparagusHeroProps {
  title: string;
  description: string;
}

export default function WorkAtSparagusHero({
  title,
  description,
}: WorkAtSparagusHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [pageLoaderReady, setPageLoaderReady] = useState(false);

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

  // Wait for PageLoader to complete
  useEffect(() => {
    const handlePageLoaderComplete = () => {
      setPageLoaderReady(true);
    };

    // Check if PageLoader is already complete
    if (document.documentElement.classList.contains("page-loader-complete")) {
      handlePageLoaderComplete();
    } else {
      // Listen for PageLoader completion
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
        !pageLoaderReady
      )
        return;

      const section = sectionRef.current;
      const videoContainer = videoContainerRef.current;
      const titleElement = titleRef.current;
      const ctaElement = ctaRef.current;

      // Ensure section has white background
      gsap.set(section, {
        backgroundColor: "#ffffff",
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

      // Create SplitText for title
      const titleSplit = SplitText.create(titleElement, {
        type: "lines",
        mask: "lines",
      });

      // Set initial state for text (hidden, translated down)
      gsap.set(titleSplit.lines, {
        yPercent: 100,
        opacity: 0,
      });

      // Set initial state for CTA button
      gsap.set(ctaElement, {
        opacity: 0,
        y: 20,
      });

      // Create unified timeline with a small delay so the initial shape is visible first
      const timeline = gsap.timeline({ delay: 0.3 });

      // Clip-path animation
      timeline.to(animationData, {
        insetTop: 0,
        insetRight: 0,
        insetBottom: 0,
        insetLeft: 0,
        borderRadius: finalBorderRadius,
        rotation: finalRotation,
        scale: finalScale,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: function () {
          videoContainer.style.clipPath = `inset(${animationData.insetTop}px ${animationData.insetRight}px ${animationData.insetBottom}px ${animationData.insetLeft}px)`;
          videoContainer.style.borderRadius = `${animationData.borderRadius}px`;
          videoContainer.style.transform = `rotate(${animationData.rotation}deg) scale(${animationData.scale})`;
        },
      });

      // Text animation - starts at 60% of clip-path animation (overlapping)
      timeline.to(
        titleSplit.lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.7" // Start 0.7s before clip-path ends (overlap)
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
        "-=0.4" // Overlap with text animation
      );

      // Cleanup
      return () => {
        titleSplit.revert();
      };
    },
    { scope: sectionRef, dependencies: [pageLoaderReady] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-svh flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
    >
      {/* Video Background Container with Clip Path */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 z-0"
        style={{
          transformOrigin: "center center",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videohero.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />
      </div>

      {/* Content Overlay - Bottom positioned */}
      <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 md:pb-12 lg:pb-16 mt-auto">
        {/* Left side - Title */}
        <div className="max-w-3xl">
          <h1
            ref={titleRef}
            className="text-4xl md:text-7xl font-normal text-white mb-4 md:mb-6 font-pp-neue-montreal text-left"
          >
            {title}
          </h1>
        </div>

        {/* Right side - CTA Button */}
        <div ref={ctaRef} className="flex items-end">
          <div className="w-12 h-12 bg-[#8202FF] rounded-sm flex items-center justify-center">
            <ArrowDown className="text-white w-6 h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
