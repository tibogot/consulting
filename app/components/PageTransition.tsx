"use client";
import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "@/i18n/routing";
import { gsap } from "@/lib/gsapConfig";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef<string>(pathname);
  const isInitialMount = useRef(true);

  // Handle initial mount
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (isInitialMount.current) {
      // Initial load: No animation, just show content immediately
      isInitialMount.current = false;
      gsap.set(overlayRef.current, { yPercent: -100 });
      gsap.set(contentRef.current, { opacity: 1 });

      // Mark as complete and dispatch event
      document.documentElement.classList.add("page-transition-complete");
      window.dispatchEvent(new Event("pageTransitionComplete"));
    }
  }, []);

  // Handle navigation (runs when pathname changes)
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;
    if (isInitialMount.current) return; // Skip on initial mount

    // Check if pathname actually changed (navigation occurred)
    if (prevPathname.current === pathname) return;

    // This is a navigation
    prevPathname.current = pathname;

    // Clear previous transition complete class
    document.documentElement.classList.remove("page-transition-complete");

    // Navigation: Overlay covers screen, content hidden
    // Set initial state to prevent flash
    gsap.set(overlayRef.current, { yPercent: 0 });
    gsap.set(contentRef.current, { opacity: 0 });

    // Animate overlay out and content in
    const tl = gsap.timeline({
      onComplete: () => {
        // Mark as complete and dispatch event
        document.documentElement.classList.add("page-transition-complete");
        window.dispatchEvent(new Event("pageTransitionComplete"));
      },
    });

    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: "power2.inOut",
    }).to(
      contentRef.current,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2"
    );
  }, [pathname]);

  return (
    <>
      {/* Transition overlay - DEBUG: using red to see it */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-9998 bg-red-500"
        style={{ willChange: "transform" }}
      />

      {/* Page content */}
      <div ref={contentRef} style={{ willChange: "opacity" }}>
        {children}
      </div>
    </>
  );
}
