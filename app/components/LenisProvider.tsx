"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

// Syncs Lenis smooth scroll with GSAP ScrollTrigger (must be inside ReactLenis)
function LenisGSAPSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Configure ScrollTrigger to use Lenis scroll values
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: "fixed",
    });

    // Update ScrollTrigger whenever Lenis scrolls
    const handleScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleScroll);

    // Drive Lenis animation via GSAP ticker (since autoRaf is false)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis expects milliseconds
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing for better sync

    // Initial refresh to ensure ScrollTrigger calculates correctly
    ScrollTrigger.refresh();

    // Cleanup: remove event listeners and ticker callback
    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(tickerCallback);
      // Clear scrollerProxy on unmount
      ScrollTrigger.scrollerProxy(document.body, {});
    };
  }, [lenis]);

  return null;
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // Linear interpolation factor (lower = smoother/slower)
        smoothWheel: true, // Enable smooth scrolling for mouse wheel
        touchMultiplier: 2, // Touch scroll sensitivity multiplier
        // Note: duration is ignored when lerp is set
      }}
      autoRaf={false} // CRITICAL: Disable auto RAF since we're using GSAP ticker
    >
      <LenisGSAPSync />
      {children}
    </ReactLenis>
  );
}
