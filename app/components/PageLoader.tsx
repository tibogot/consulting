"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useGSAP(() => {
    if (!loaderRef.current) return;

    // Wait for fonts and initial render
    const initLoader = async () => {
      try {
        // Wait for fonts to load
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        // Small delay to ensure everything is rendered
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Animate the loader out
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setIsComplete(true);
            // Add class to HTML element for other components to detect
            document.documentElement.classList.add("page-loader-complete");
            // Dispatch event for AnimatedText components
            window.dispatchEvent(new Event("pageLoaderComplete"));
          },
        });
      } catch (error) {
        // Fallback: hide loader immediately if something fails
        setIsComplete(true);
        document.documentElement.classList.add("page-loader-complete");
        window.dispatchEvent(new Event("pageLoaderComplete"));
      }
    };

    initLoader();
  }, []);

  // Remove from DOM after animation completes
  if (isComplete) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ willChange: "transform" }}
    >
      <div className="text-center">
        {/* Simple animated logo or spinner */}
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
