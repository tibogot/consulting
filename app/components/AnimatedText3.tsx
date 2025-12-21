"use client";
import { useRef, ReactNode, useState, useEffect } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

// Function to fix SplitText clipping issues with descenders
function fixMask(
  { elements, masks }: { elements: HTMLElement[]; masks: Element[] },
  baseLineHeight = 1.2
) {
  const [firstElement] = elements;
  const lineHeightValue = gsap.getProperty(firstElement, "line-height", "em");
  const lineHeight = parseFloat(String(lineHeightValue));
  const lineHeightDifference = lineHeight - baseLineHeight;

  masks.forEach((mask, i) => {
    const isFirstMask = i === 0;
    const isLastMask = i === masks.length - 1;

    const marginTop = isFirstMask ? `${0.5 * lineHeightDifference}em` : "0";
    const marginBottom = isLastMask
      ? `${0.5 * lineHeightDifference}em`
      : `${lineHeightDifference}em`;

    gsap.set(mask as HTMLElement, {
      lineHeight: baseLineHeight,
      marginTop,
      marginBottom,
    });
  });
}

interface AnimatedTextProps {
  children: ReactNode;
  trigger?: string | HTMLElement;
  start?: string;
  toggleActions?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  className?: string;
  isHero?: boolean; // New prop for hero text
}

function AnimatedText({
  children,
  trigger,
  start = "top 75%",
  toggleActions = "play reverse play reverse",
  stagger = 0.15,
  duration = 0.8,
  delay = 0,
  ease = "power2.out",
  className = "",
  isHero = false,
}: AnimatedTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<SplitText[]>([]); // Store all SplitText instances for cleanup
  const scrollTriggerRefs = useRef<ScrollTriggerType[]>([]); // Store ScrollTrigger instances for refresh
  const [fontsReady, setFontsReady] = useState(false);

  // Simplified font loading detection using document.fonts.ready
  useEffect(() => {
    const checkFontsLoaded = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
          setFontsReady(true);
        } else {
          // Fallback for browsers that don't support document.fonts
          setFontsReady(true);
        }
      } catch (error) {
        // Fallback: proceed if font detection fails
        setFontsReady(true);
      }
    };

    checkFontsLoaded();
  }, []);

  // Add CSS to prevent FOUC - ensure text is hidden until GSAP takes control
  useEffect(() => {
    const styleId = "animated-text-fouc-prevention";

    // Check if style already exists
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
        .animated-text-wrapper {
          overflow: hidden;
        }

        /* Fix for SplitText clipping with tight line heights */
        .animated-text-wrapper.overflow-visible {
          overflow: visible !important;
        }

        /* Hide text until animation is ready */
        .animated-text-wrapper.fouc-prevent {
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  useGSAP(
    () => {
      if (!wrapperRef.current || !fontsReady) return;

      // Add FOUC prevention class initially
      wrapperRef.current.classList.add("fouc-prevent");

      const createSplitTextInstances = () => {
        // Clean up existing instances
        splitRefs.current.forEach((split) => {
          if (split) split.revert();
        });
        splitRefs.current = [];

        const children = Array.from(
          wrapperRef.current!.children
        ) as HTMLElement[];

        if (children.length === 0) return;

        children.forEach((child, index) => {
          try {
            // Hide the original text element to prevent FOUC
            gsap.set(child, {
              visibility: "hidden",
              opacity: 0,
            });

            // Force a reflow to ensure the element is fully rendered
            child.offsetHeight;

            const split = SplitText.create(child, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              aria: "none", // Disable automatic aria-label addition
            });

            // Apply the fixMask function to prevent clipping of descenders
            if (split.lines && split.lines.length > 0) {
              fixMask({ elements: [child], masks: split.lines });
            }

            // Verify the split was successful
            if (split && split.lines && split.lines.length > 0) {
              splitRefs.current.push(split);

              // Set initial state to prevent FOUC
              gsap.set(split.lines, {
                yPercent: 100,
                autoAlpha: 0, // This prevents FOUC by setting visibility: hidden initially
              });

              // For hero text, use immediate animation without ScrollTrigger
              if (isHero) {
                // Remove FOUC prevention class and make element visible for hero text
                if (wrapperRef.current) {
                  wrapperRef.current.classList.remove("fouc-prevent");
                }
                gsap.set(child, { visibility: "visible", opacity: 1 });

                gsap.to(split.lines, {
                  yPercent: 0,
                  autoAlpha: 1, // Reveal with autoAlpha for smooth transition
                  stagger,
                  duration,
                  ease,
                  delay: delay + index * 0.1, // Add slight delay between multiple children
                });
              } else {
                // Regular scroll-triggered animation - use a more reliable trigger strategy
                const scrollTriggerConfig = {
                  trigger: trigger || wrapperRef.current || child,
                  start: start, // Use the start prop
                  toggleActions: toggleActions,
                  refreshPriority: -1, // Lower priority for better performance
                  onEnter: () => {
                    // Remove FOUC prevention class and make element visible
                    if (wrapperRef.current) {
                      wrapperRef.current.classList.remove("fouc-prevent");
                    }
                    gsap.set(child, { visibility: "visible", opacity: 1 });
                  },
                };

                const animation = gsap.to(split.lines, {
                  yPercent: 0,
                  autoAlpha: 1, // Reveal with autoAlpha for smooth transition
                  stagger,
                  duration,
                  ease,
                  delay,
                  scrollTrigger: scrollTriggerConfig,
                });

                // Store ScrollTrigger instance for potential refresh
                if (animation.scrollTrigger) {
                  scrollTriggerRefs.current.push(animation.scrollTrigger);
                }
              }
            }
          } catch (error) {
            console.error("AnimatedText3: Error creating SplitText instance", error);
          }
        });
      };

      // Use requestAnimationFrame and additional timeout for better timing
      requestAnimationFrame(() => {
        const additionalDelay = isHero ? 100 : 50;
        setTimeout(createSplitTextInstances, additionalDelay);
      });

      return () => {
        // Clean up ScrollTrigger instances
        scrollTriggerRefs.current.forEach((st) => {
          if (st && st.kill) st.kill();
        });
        scrollTriggerRefs.current = [];

        // Clean up SplitText instances
        splitRefs.current.forEach((split) => {
          if (split) split.revert();
        });
        splitRefs.current = [];
      };
    },
    {
      dependencies: [
        trigger,
        start,
        toggleActions,
        stagger,
        duration,
        delay,
        ease,
        fontsReady,
        isHero,
      ],
    }
  );

  return (
    <div
      ref={wrapperRef}
      className={`animated-text-wrapper fouc-prevent ${className}`}
    >
      {children}
    </div>
  );
}

export default AnimatedText;
