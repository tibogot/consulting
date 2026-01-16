"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isInitialMount = useRef(true);
  const hasScrolledToTop = useRef(false);

  // Disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top on route change and initial mount
  useEffect(() => {
    const scrollToTop = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        // Fallback to window scroll if Lenis isn't ready yet
        window.scrollTo(0, 0);
      }
    };

    // On initial mount (page refresh), scroll to top after a short delay
    // to ensure browser restoration has happened
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Use a small delay to override browser scroll restoration
      const timeoutId = setTimeout(() => {
        scrollToTop();
        hasScrolledToTop.current = true;
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      // On route change, scroll immediately
      scrollToTop();
    }
  }, [pathname, lenis]);

  return null;
}
