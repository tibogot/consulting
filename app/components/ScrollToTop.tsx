"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Scroll to top on route change using Lenis smooth scroll
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback to window scroll if Lenis isn't ready yet
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}
