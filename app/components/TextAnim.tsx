"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsapConfig";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

interface TextAnimProps {
  children: ReactNode;
  useScrollTrigger?: boolean;
  lightningColor?: string;
}

const TextAnim = ({
  children,
  useScrollTrigger = false,
  lightningColor = "#2b6bbb",
}: TextAnimProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const scrollTriggerRef = useRef<ScrollTriggerType | null>(null);
  const splitRef = useRef<SplitText | null>(null);
  const [pageLoaderReady, setPageLoaderReady] = useState(false);

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

  useEffect(() => {
    if (!textRef.current || !pageLoaderReady) return;

    // Store the element reference to ensure consistency
    const element = textRef.current;
    if (!element || !element.isConnected) return;

    // Create context with the element directly (not the ref) to avoid scope issues
    const ctx = gsap.context(() => {
      // Double-check element is still valid and connected to DOM
      if (!element || !element.isConnected) return;

      const currentElement = element;
      splitRef.current = new SplitText(currentElement, {
        type: "chars, words",
      });

      // Set the CSS variable on the element
      currentElement.style.setProperty("--lightning-color", lightningColor);

      const resetAnimation = () => {
        // Check if element and split are still valid
        if (
          !currentElement ||
          !currentElement.isConnected ||
          !splitRef.current ||
          !splitRef.current.chars
        )
          return;

        // Remove animation classes to reset
        splitRef.current.chars.forEach((char) => {
          if (char && char.classList) {
            char.classList.remove("text-fade-char");
            if (char instanceof HTMLElement && char.style) {
              char.style.animationDelay = "";
            }
          }
        });
        if (currentElement.classList) {
          currentElement.classList.remove("text-blink");
        }
      };

      const playAnimation = () => {
        // Check if element and split are still valid
        if (
          !currentElement ||
          !currentElement.isConnected ||
          !splitRef.current ||
          !splitRef.current.chars
        )
          return;

        // Reset first to allow replay
        resetAnimation();
        // Force a reflow to ensure reset is applied
        void currentElement.offsetHeight;
        // Add animation classes
        splitRef.current.chars.forEach((char, index) => {
          if (
            char &&
            char instanceof HTMLElement &&
            char.style &&
            char.classList
          ) {
            char.style.animationDelay = `${index * 0.04}s`;
            char.classList.add("text-fade-char");
          }
        });
        if (currentElement.classList) {
          currentElement.classList.add("text-blink");
        }
      };

      if (useScrollTrigger) {
        // Only create ScrollTrigger if element is still valid and connected
        if (currentElement && currentElement.isConnected) {
          scrollTriggerRef.current = ScrollTrigger.create({
            trigger: currentElement,
            start: "top 80%",
            onEnter: playAnimation,
            onEnterBack: playAnimation,
            onLeave: resetAnimation,
            onLeaveBack: resetAnimation,
          });
        }
      } else {
        playAnimation();
      }
    }, element);

    return () => {
      // Explicitly kill ScrollTrigger instance first
      if (scrollTriggerRef.current && scrollTriggerRef.current.kill) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // Revert SplitText instance
      if (splitRef.current && splitRef.current.revert) {
        splitRef.current.revert();
        splitRef.current = null;
      }

      // Clean up context (this will revert all GSAP animations created within)
      if (ctx) {
        ctx.revert();
      }

      // Refresh ScrollTrigger after cleanup to ensure GSAP's internal state is consistent
      // This prevents "Invalid scope" errors when other components create ScrollTriggers
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };
  }, [useScrollTrigger, lightningColor, pageLoaderReady]);
  return (
    <>
      <style jsx global>{`
        @keyframes text-fade-in {
          0% {
            color: inherit;
            opacity: 1;
          }
          1% {
            color: var(--lightning-color);
            opacity: 1;
          }
          15% {
            opacity: 0.2;
          }
          30% {
            opacity: 0.8;
          }
          40% {
            color: var(--lightning-color);
            opacity: 1;
          }
          55% {
            opacity: 1;
          }
          70% {
            color: inherit;
            opacity: 0.5;
          }
          85% {
            opacity: 1;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes blink {
          0% {
            opacity: 1;
          }
          20% {
            opacity: 0.3;
          }
          35% {
            opacity: 0.85;
          }
          55% {
            opacity: 0.2;
          }
          70% {
            opacity: 1;
          }
          to {
            opacity: 1;
          }
        }

        .text-fade-char {
          animation: text-fade-in 0.4s ease-out forwards;
        }

        .text-blink {
          animation: blink 0.6s ease-out;
        }
      `}</style>
      <span ref={textRef}>{children}</span>
    </>
  );
};

export default TextAnim;
