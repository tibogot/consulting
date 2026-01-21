"use client";
import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "@/i18n/routing";
import { gsap, useGSAP } from "@/lib/gsapConfig";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef<string>(pathname);
  const hasAnimated = useRef(false);

  // Track navigation (runs on pathname change)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // This is a navigation - set flag for next page
      sessionStorage.setItem("navigated", "true");
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useGSAP(
    () => {
      if (!overlayRef.current || !contentRef.current) return;
      if (hasAnimated.current) return; // Prevent re-running on same mount
      hasAnimated.current = true;

      // Check if this is a navigation (flag set by previous page before unmount)
      const isNavigation = sessionStorage.getItem("navigated") === "true";

      // Clear previous transition complete class (from previous page)
      document.documentElement.classList.remove("page-transition-complete");

      if (isNavigation) {
        // Clear the flag immediately so refreshes work correctly
        sessionStorage.removeItem("navigated");

        // Navigation: Overlay covers screen, content hidden
        // Set initial state with immediateRender to prevent flash
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
      } else {
        // Initial load: No animation, just show content immediately
        gsap.set(overlayRef.current, { yPercent: -100 });
        gsap.set(contentRef.current, { opacity: 1 });

        // Mark as complete and dispatch event
        document.documentElement.classList.add("page-transition-complete");
        window.dispatchEvent(new Event("pageTransitionComplete"));
      }
    },
    { dependencies: [] } // Empty deps - only run once on mount
  );

  return (
    <>
      {/* Transition overlay - DEBUG: using red to see it */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-red-500 pointer-events-none"
        style={{ willChange: "transform" }}
      />

      {/* Page content */}
      <div ref={contentRef} style={{ willChange: "opacity" }}>
        {children}
      </div>
    </>
  );
}
