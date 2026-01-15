"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapConfig";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

// Helper to unlock scroll
const unlockScroll = () => {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
};

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [animationData, setAnimationData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const hasTriggeredExit = useRef(false);

  // Block scroll while loader is active
  useEffect(() => {
    // Apply scroll lock
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = "0";
    document.body.style.width = "100%";
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

    // Immediately dispatch the event so other components can start
    document.documentElement.classList.add("page-loader-complete");
    window.dispatchEvent(new Event("pageLoaderComplete"));

    // Unlock scroll immediately when animation starts exiting
    unlockScroll();

    // Start slide-out animation immediately
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
