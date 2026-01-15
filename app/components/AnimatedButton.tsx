"use client";

import { useRef, ReactNode, useState, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

interface AnimatedButtonProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  ease?: string;
  className?: string;
  isHero?: boolean;
}

export default function AnimatedButton({
  children,
  delay = 0,
  duration = 0.8,
  ease = "power2.out",
  className = "",
  isHero = false,
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [pageLoaderReady, setPageLoaderReady] = useState(false);

  // Wait for PageLoader to complete (for hero buttons)
  useEffect(() => {
    if (!isHero) {
      setPageLoaderReady(true);
      return;
    }

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
  }, [isHero]);

  // Add CSS to prevent FOUC
  useEffect(() => {
    const styleId = "animated-button-fouc-prevention";

    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
        .animated-button-wrapper.fouc-prevent {
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  useGSAP(
    () => {
      if (!buttonRef.current || !pageLoaderReady) return;

      const buttonElement = buttonRef.current.firstElementChild as HTMLElement;
      if (!buttonElement) return;

      // Set initial state
      gsap.set(buttonElement, {
        y: 20,
        autoAlpha: 0,
      });

      // Animate in
      requestAnimationFrame(() => {
        const additionalDelay = isHero ? 100 : 50;
        setTimeout(() => {
          // Remove FOUC prevention class before animating
          if (buttonRef.current) {
            buttonRef.current.classList.remove("fouc-prevent");
          }
          gsap.to(buttonElement, {
            y: 0,
            autoAlpha: 1,
            duration,
            ease,
            delay,
          });
        }, additionalDelay);
      });
    },
    {
      dependencies: [pageLoaderReady, delay, duration, ease, isHero],
    }
  );

  return (
    <div ref={buttonRef} className={`animated-button-wrapper fouc-prevent ${className}`}>
      {children}
    </div>
  );
}
