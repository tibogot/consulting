"use client";
import { useRef, ReactNode, useState, useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsapConfig";

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

interface AnimatedTextHorizontalProps {
  children: ReactNode;
  horizontalContainer?: string | HTMLElement | null; // The horizontal scroll container
  sectionIndex?: number; // Which section in the horizontal scroll (0, 1, 2, 3...)
  totalSections?: number; // Total number of sections in horizontal scroll
  stagger?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  className?: string;
  earlyTrigger?: boolean; // Trigger animation earlier (for elements bleeding into previous section)
}

function AnimatedTextHorizontal({
  children,
  horizontalContainer,
  sectionIndex = 0,
  totalSections = 4,
  stagger = 0.15,
  duration = 0.8,
  delay = 0,
  ease = "power2.out",
  className = "",
  earlyTrigger = false,
}: AnimatedTextHorizontalProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Store SplitText instances or custom objects with observer/textAnimation
  type SplitTextRef =
    | SplitText
    | { observer: IntersectionObserver; textAnimation: gsap.core.Tween };
  const splitRefs = useRef<Array<SplitTextRef>>([]);

  // Type guard to check if item is SplitText
  const isSplitText = (item: SplitTextRef): item is SplitText => {
    return item && typeof (item as SplitText).revert === "function";
  };

  // Type guard to check if item is observer object
  const isObserverObject = (
    item: SplitTextRef
  ): item is {
    observer: IntersectionObserver;
    textAnimation: gsap.core.Tween;
  } => {
    return item && "observer" in item && "textAnimation" in item;
  };
  const [fontsReady, setFontsReady] = useState(false);
  const [pageLoaderReady, setPageLoaderReady] = useState(false);
  const retryCountRef = useRef(0);
  // Store timeout references for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced font loading detection - same as AnimatedText3
  useEffect(() => {
    const checkFontsLoaded = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;

          // Additional check to ensure specific fonts are loaded
          if (document.fonts.check) {
            const fontChecks = [
              "1em ITCGaramondN",
              '1em "ITC Garamond Narrow"',
              "16px serif", // fallback check
            ];

            let fontFound = false;
            for (const fontCheck of fontChecks) {
              if (document.fonts.check(fontCheck)) {
                fontFound = true;
                break;
              }
            }

            if (fontFound) {
              setTimeout(() => setFontsReady(true), 150);
            } else {
              // Fallback - wait longer if font isn't detected
              setTimeout(() => setFontsReady(true), 400);
            }
          } else {
            // Fallback for browsers without font.check
            setTimeout(() => setFontsReady(true), 300);
          }
        } else {
          // Fallback for browsers that don't support document.fonts
          setTimeout(() => setFontsReady(true), 500);
        }
      } catch {
        // Fallback: proceed after delay if font detection fails
        setTimeout(() => setFontsReady(true), 500);
      }
    };

    checkFontsLoaded();
  }, []);

  // Wait for PageLoader to complete
  useEffect(() => {
    const handlePageLoaderComplete = () => {
      setPageLoaderReady(true);
      setTimeout(() => setFontsReady(true), 100);
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

  // Add CSS to prevent FOUC - same as AnimatedText3
  useEffect(() => {
    const styleId = "animated-text-horizontal-fouc-prevention";

    // Check if style already exists
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
        .animated-text-horizontal-wrapper {
          overflow: hidden;
        }
        
        /* Fix for SplitText clipping with tight line heights */
        .animated-text-horizontal-wrapper.overflow-visible {
          overflow: visible !important;
        }
        
        /* Hide text until animation is ready */
        .animated-text-horizontal-wrapper.fouc-prevent {
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  useGSAP(
    () => {
      if (!wrapperRef.current || !fontsReady || !pageLoaderReady) return;

      // Only run on desktop (same check as HorizScroll8)
      if (window.innerWidth < 768) return;

      // Add FOUC prevention class initially
      wrapperRef.current.classList.add("fouc-prevent");

      const createSplitTextInstances = () => {
        // Clean up existing instances
        splitRefs.current.forEach((split) => {
          if (isSplitText(split)) {
            split.revert();
          } else if (isObserverObject(split)) {
            split.observer.disconnect();
            if (split.textAnimation) {
              split.textAnimation.kill();
            }
          }
        });
        splitRefs.current = [];

        const children = Array.from(
          wrapperRef.current!.children
        ) as HTMLElement[];

        if (children.length === 0) return;

        // Ensure we have a valid horizontal container before proceeding
        const triggerElement =
          typeof horizontalContainer === "string"
            ? (document.querySelector(horizontalContainer) as HTMLElement)
            : horizontalContainer;

        if (!triggerElement) {
          retryCountRef.current += 1;
          if (retryCountRef.current < 10) {
            // Max 10 retries (1 second)
            // Clear any existing timeout before setting a new one
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(createSplitTextInstances, 100);
            return;
          } else {
            // Fall back to immediate animation
            children.forEach((child, index) => {
              try {
                const split = SplitText.create(child, {
                  type: "lines",
                  mask: "lines",
                  autoSplit: true,
                  aria: "none",
                });

                if (split && split.lines && split.lines.length > 0) {
                  splitRefs.current.push(split);
                  gsap.set(child, { opacity: 1 });
                  gsap.to(split.lines, {
                    yPercent: 0,
                    stagger,
                    duration,
                    ease,
                    delay: delay + index * 0.1,
                  });
                }
              } catch {
                // Fallback animation creation failed
              }
            });
            return;
          }
        }

        // Reset retry count since we found the container
        retryCountRef.current = 0;

        let allInstancesCreated = true;

        children.forEach((child, index) => {
          try {
            // Hide the original text element to prevent FOUC
            gsap.set(child, {
              opacity: 0,
            });

            // Force a reflow to ensure the element is fully rendered
            void child.offsetHeight;

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
              });

              // Use the triggerElement we already validated at the beginning
              if (triggerElement) {
                // Use a simpler approach: detect when the section element itself comes into view
                // during the horizontal scroll animation
                const sectionElement = wrapperRef.current?.closest(
                  ".scroll-section"
                ) as HTMLElement;

                if (sectionElement) {
                  // Create the text animation (paused initially)
                  const textAnimation = gsap.to(split.lines, {
                    yPercent: 0,
                    stagger,
                    duration,
                    ease,
                    paused: true,
                  });

                  // Use intersection observer to detect when this section is visible
                  // Use lower threshold for earlyTrigger (for elements bleeding into previous section)
                  const triggerThreshold = earlyTrigger ? 0.05 : 0.3;
                  const observer = new IntersectionObserver(
                    (entries) => {
                      entries.forEach((entry) => {
                        if (
                          entry.isIntersecting &&
                          entry.intersectionRatio > triggerThreshold
                        ) {
                          // Section is 30% visible, trigger animation forward
                          if (
                            !textAnimation.isActive() &&
                            textAnimation.progress() === 0
                          ) {
                            // Remove FOUC prevention and make visible
                            if (wrapperRef.current) {
                              wrapperRef.current.classList.remove(
                                "fouc-prevent"
                              );
                            }
                            gsap.set(child, {
                              opacity: 1,
                            });

                            // Play the text animation with delay
                            gsap.delayedCall(delay, () => {
                              textAnimation.play();
                            });
                          }
                        } else if (
                          !entry.isIntersecting &&
                          entry.intersectionRatio < 0.1
                        ) {
                          // Section is leaving view, reverse animation
                          if (textAnimation.progress() > 0) {
                            textAnimation.reverse();
                          }
                        }
                      });
                    },
                    {
                      root: null, // Use viewport as root
                      rootMargin: "0px",
                      threshold: [0.1, 0.3, 0.5, 0.7], // Multiple thresholds for better detection
                    }
                  );

                  // Start observing the section element
                  observer.observe(sectionElement);

                  // For the first section, also animate on ScrollTrigger enter
                  if (sectionIndex === 0) {
                    ScrollTrigger.create({
                      trigger: triggerElement,
                      start: "top center",
                      onEnter: () => {
                        if (
                          !textAnimation.isActive() &&
                          textAnimation.progress() === 0
                        ) {
                          if (wrapperRef.current) {
                            wrapperRef.current.classList.remove("fouc-prevent");
                          }
                          gsap.set(child, {
                            opacity: 1,
                          });

                          gsap.delayedCall(delay, () => {
                            textAnimation.play();
                          });
                        }
                      },
                    });
                  }

                  // Store observer for cleanup
                  splitRefs.current.push({ observer, textAnimation });
                } else {
                  // Section element not found
                }
              } else {
                // Fallback: immediate animation if no horizontal container found
                if (wrapperRef.current) {
                  wrapperRef.current.classList.remove("fouc-prevent");
                }
                gsap.set(child, { visibility: "visible", opacity: 1 });

                gsap.to(split.lines, {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger,
                  duration,
                  ease,
                  delay: delay + index * 0.1,
                });
              }
            } else {
              allInstancesCreated = false;
            }
          } catch {
            allInstancesCreated = false;
          }
        });

        if (allInstancesCreated) {
          // SplitText instances created successfully
        } else {
          // Retry after a short delay if some instances failed
          // Clear any existing timeout before setting a new one
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(createSplitTextInstances, 100);
        }
      };

      // Use requestAnimationFrame and additional timeout for better timing
      requestAnimationFrame(() => {
        // Clear any existing initial timeout before setting a new one
        if (initialTimeoutRef.current) {
          clearTimeout(initialTimeoutRef.current);
        }
        initialTimeoutRef.current = setTimeout(createSplitTextInstances, 200);
      });

      return () => {
        // Clear all timeouts on cleanup
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (initialTimeoutRef.current) {
          clearTimeout(initialTimeoutRef.current);
          initialTimeoutRef.current = null;
        }

        splitRefs.current.forEach((item) => {
          if (isSplitText(item)) {
            // It's a SplitText instance
            item.revert();
          } else if (isObserverObject(item)) {
            // It's our custom object with observer
            item.observer.disconnect();
            if (item.textAnimation) {
              item.textAnimation.kill();
            }
          }
        });
        splitRefs.current = [];
      };
    },
    {
      dependencies: [
        horizontalContainer,
        sectionIndex,
        totalSections,
        stagger,
        duration,
        delay,
        ease,
        fontsReady,
        pageLoaderReady,
        earlyTrigger,
      ],
    }
  );

  return (
    <div
      ref={wrapperRef}
      className={`animated-text-horizontal-wrapper fouc-prevent ${className}`}
    >
      {children}
    </div>
  );
}

export default AnimatedTextHorizontal;
