"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

interface HorizontalScrollGalleryProps {
  images?: string[];
  title?: string;
  subtitle?: string;
  topSymbols?: string[];
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

/**
 * HorizontalScrollGallery Component
 *
 * A React component that creates a horizontal scrolling gallery effect
 * where images scroll horizontally as the user scrolls vertically.
 */
export default function HorizontalScrollGallery({
  images = [],
  title = "Interface Study",
  subtitle = "/ Moodboard",
  topSymbols = [],
  bgColor = "bg-gray-900",
  textColor = "text-white",
  borderColor = "border-gray-700",
}: HorizontalScrollGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current || images.length === 0) {
      return;
    }

    const wrapper = wrapperRef.current;
    const snapshotsSection = sectionRef.current;

    const calculateDimensions = () => {
      const wrapperWidth = wrapper.offsetWidth;
      const viewportWidth = window.innerWidth;
      return -(wrapperWidth - viewportWidth);
    };

    let moveDistance = calculateDimensions();

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: snapshotsSection,
      start: "top top",
      end: () => `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: isSafari && isIOS ? 0.5 : 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        moveDistance = calculateDimensions();
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const currentTranslateX = progress * moveDistance;

        gsap.set(wrapper, {
          x: currentTranslateX,
          force3D: true,
          transformOrigin: "left center",
        });

        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, {
            width: `${progress * 100}%`,
          });
        }
      },
    });

    scrollTriggerRef.current = trigger;

    // Handle resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        moveDistance = calculateDimensions();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 500);
    });

    // iOS viewport height fix
    if (isIOS) {
      const setViewportHeight = () => {
        document.documentElement.style.setProperty(
          "--vh",
          `${window.innerHeight * 0.01}px`
        );
      };

      setViewportHeight();
      window.addEventListener("resize", setViewportHeight);
      window.addEventListener("orientationchange", () => {
        setTimeout(setViewportHeight, 500);
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === snapshotsSection) {
          trigger.kill();
        }
      });
    };
  }, [images]);

  return (
    <section
      ref={sectionRef}
      className={`relative h-screen w-full ${bgColor} ${textColor} overflow-hidden`}
    >
      {/* Top Bar with Symbols */}
      <div className="absolute top-0 left-0 w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between">
            {topSymbols.length > 0 ? (
              <>
                <div className="flex gap-4">
                  {topSymbols.slice(0, 2).map((symbol, index) => (
                    <div key={index} className="symbol">
                      <img src={symbol} alt={`Symbol ${index + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  {topSymbols.slice(2, 4).map((symbol, index) => (
                    <div key={index + 2} className="symbol">
                      <img src={symbol} alt={`Symbol ${index + 3}`} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <div className="symbol">
                    <div className="h-8 w-8 rounded bg-gray-700"></div>
                  </div>
                  <div className="symbol">
                    <div className="h-8 w-8 rounded bg-gray-700"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="symbol">
                    <div className="h-8 w-8 rounded bg-gray-700"></div>
                  </div>
                  <div className="symbol">
                    <div className="h-8 w-8 rounded bg-gray-700"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar with Title */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4">
            <p className="font-mono text-sm">
              <span>&#9654;</span> {title}
            </p>
            <p className="font-mono text-sm">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div
        ref={wrapperRef}
        className="relative flex h-screen w-[500vw] overflow-hidden"
        style={{ transform: "translateX(0%)" }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex flex-1 items-center justify-center">
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className={`aspect-video h-[65%] w-[65%] rounded-lg border border-dashed object-cover ${borderColor}`}
            />
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-16 left-1/2 flex h-4 w-[20%] min-w-[300px] -translate-x-1/2 items-center justify-between">
        {/* Progress Indicators */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {Array.from({ length: 30 }).map((_, index) => (
            <div key={index} className="h-1/2 w-px bg-gray-700" />
          ))}
        </div>
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 h-full origin-left border border-white bg-gray-900"
          style={{ width: "0%" }}
        />
      </div>
    </section>
  );
}
