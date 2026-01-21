"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapConfig";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [animationData, setAnimationData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const hasTriggeredExit = useRef(false);
  const scrollPositionRef = useRef<number>(0);
  const isInitialLoad = useRef(true);

  // Helper to lock scroll while preserving scrollbar visibility
  const lockScroll = () => {
    // Only capture scroll position if this is NOT an initial page load/refresh
    // Check if we came from navigation (not a refresh)
    const navigatedFlag = sessionStorage.getItem("navigated");
    const isNavigation = navigatedFlag === "true";
    
    if (isNavigation) {
      // Capture current scroll position only on navigation
      scrollPositionRef.current = window.scrollY;
    } else {
      // On initial load/refresh, always start at top
      scrollPositionRef.current = 0;
      isInitialLoad.current = true;
    }
    
    // Lock scroll but keep scrollbar visible
    document.body.style.overflowY = "scroll";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };

  // Helper to unlock scroll and restore position
  const unlockScroll = () => {
    const scrollY = scrollPositionRef.current;
    
    // Remove scroll lock styles
    document.body.style.overflowY = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    
    // Only restore scroll position if this was a navigation (not initial load/refresh)
    if (!isInitialLoad.current) {
      window.scrollTo(0, scrollY);
    } else {
      // On initial load/refresh, ensure we're at top
      window.scrollTo(0, 0);
      isInitialLoad.current = false;
    }
  };

  // Block scroll while loader is active
  useEffect(() => {
    lockScroll();
  }, []);

  // Fetch Lottie animation data
  useEffect(() => {
    fetch("/images/spar.json")
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
      })
      .catch((error) => {
        console.error("Error loading Lottie animation:", error);
      });
  }, []);

  // Trigger slide-out animation when Lottie completes
  const handleComplete = () => {
    if (hasTriggeredExit.current || !loaderRef.current) return;
    hasTriggeredExit.current = true;

    // Unlock scroll when animation starts exiting
    unlockScroll();

    // Dispatch event IMMEDIATELY so clip-path animation starts
    // while the loader is sliding up (creates seamless transition)
    document.documentElement.classList.add("page-loader-complete");
    window.dispatchEvent(new Event("pageLoaderComplete"));

    // Start slide-out animation
    gsap.to(loaderRef.current, {
      yPercent: -100,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setIsComplete(true);
      },
    });
  };

  // Remove from DOM after animation completes
  if (isComplete) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ willChange: "transform" }}
    >
      <div className="w-full max-w-4xl px-4">
        {animationData && (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={false}
            autoplay={true}
            onComplete={handleComplete}
            className="w-full h-auto"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        )}
      </div>
    </div>
  );
}
