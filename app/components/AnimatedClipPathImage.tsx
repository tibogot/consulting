"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsapConfig";

interface AnimatedClipPathImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

// Animation timing config
const ANIMATION_CONFIG = {
  animationStartDelay: 0,
  clipPathDuration: 1.8,
};

export default function AnimatedClipPathImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 768px) 1024px, 100vw",
}: AnimatedClipPathImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationReady, setAnimationReady] = useState(false);

  // Set initial clip-path immediately on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const initialSize = Math.min(containerWidth, containerHeight) * 0.3;
    const initialInsetTop = (containerHeight - initialSize) / 2;
    const initialInsetLeft = (containerWidth - initialSize) / 2;
    const initialBorderRadius = initialSize / 2;

    container.style.clipPath = `inset(${initialInsetTop}px ${initialInsetLeft}px ${initialInsetTop}px ${initialInsetLeft}px)`;
    container.style.borderRadius = `${initialBorderRadius}px`;
    container.style.transform = "scale(1)";
    container.style.transformOrigin = "center center";
    container.style.visibility = "visible";
  }, []);

  // Setup animation timeline and listen for loader
  useEffect(() => {
    const handlePageLoaderComplete = () => {
      setTimeout(() => {
        setAnimationReady(true);
      }, ANIMATION_CONFIG.animationStartDelay * 1000);
    };

    if (document.documentElement.classList.contains("page-loader-complete")) {
      handlePageLoaderComplete();
    } else {
      window.addEventListener("pageLoaderComplete", handlePageLoaderComplete);
      return () => {
        window.removeEventListener("pageLoaderComplete", handlePageLoaderComplete);
      };
    }
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || !animationReady) return;

      const container = containerRef.current;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const initialSize = Math.min(containerWidth, containerHeight) * 0.3;
      const initialWidth = initialSize;
      const initialHeight = initialSize;

      const initialInsetTop = (containerHeight - initialHeight) / 2;
      const initialInsetLeft = (containerWidth - initialWidth) / 2;
      const initialInsetRight = (containerWidth - initialWidth) / 2;
      const initialInsetBottom = (containerHeight - initialHeight) / 2;

      const initialBorderRadius = Math.min(initialWidth, initialHeight) / 2;
      const finalBorderRadius = 0;

      const initialScale = 1.0;
      const finalScale = 1.05;

      const animationData = {
        insetTop: initialInsetTop,
        insetRight: initialInsetRight,
        insetBottom: initialInsetBottom,
        insetLeft: initialInsetLeft,
        borderRadius: initialBorderRadius,
        scale: initialScale,
      };

      gsap.set(container, {
        clipPath: `inset(${initialInsetTop}px ${initialInsetRight}px ${initialInsetBottom}px ${initialInsetLeft}px)`,
        borderRadius: `${initialBorderRadius}px`,
        scale: initialScale,
        transformOrigin: "center center",
      });

      gsap.to(animationData, {
        insetTop: 0,
        insetRight: 0,
        insetBottom: 0,
        insetLeft: 0,
        borderRadius: finalBorderRadius,
        scale: finalScale,
        duration: ANIMATION_CONFIG.clipPathDuration,
        ease: "power2.out",
        onUpdate: function () {
          container.style.clipPath = `inset(${animationData.insetTop}px ${animationData.insetRight}px ${animationData.insetBottom}px ${animationData.insetLeft}px)`;
          container.style.borderRadius = `${animationData.borderRadius}px`;
          container.style.transform = `scale(${animationData.scale})`;
        },
      });
    },
    { scope: containerRef, dependencies: [animationReady] }
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden invisible ${className}`}
      style={{ willChange: "clip-path, transform" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes={sizes}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-0" />
      {/* Edge smoothing overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5)] rounded-[inherit]" />
    </div>
  );
}
