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
  const isFirstRender = useRef(true);

  useEffect(() => {
    // On first render, just mark as complete
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Check if we came from a navigation
      const navigatedFlag = sessionStorage.getItem("navigated");
      if (navigatedFlag !== "true") {
        // Initial load - no transition needed
        sessionStorage.removeItem("navigated");
      }
      return;
    }

    // Navigation detected
    if (pathname !== prevPathname.current) {
      sessionStorage.setItem("navigated", "true");
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useGSAP(
    () => {
      if (!overlayRef.current || !contentRef.current) return;

      // Check if this is a navigation (not initial load)
      const navigatedFlag = sessionStorage.getItem("navigated");

      if (navigatedFlag === "true" && !isFirstRender.current) {
        // Animate in the new page
        gsap.set(overlayRef.current, {
          yPercent: 0,
        });

        gsap.set(contentRef.current, {
          opacity: 0,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            // Dispatch event when transition completes
            window.dispatchEvent(new Event("pageTransitionComplete"));
          },
        });

        // Slide overlay out and fade in content
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
        // Initial load - no transition, just show content
        gsap.set(overlayRef.current, {
          yPercent: -100,
        });
        gsap.set(contentRef.current, {
          opacity: 1,
        });
        // Still dispatch the event for components waiting on it
        setTimeout(() => {
          window.dispatchEvent(new Event("pageTransitionComplete"));
        }, 100);
      }
    },
    { dependencies: [pathname] }
  );

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black pointer-events-none"
        style={{ willChange: "transform" }}
      />

      {/* Page content */}
      <div ref={contentRef} style={{ willChange: "opacity" }}>
        {children}
      </div>
    </>
  );
}
