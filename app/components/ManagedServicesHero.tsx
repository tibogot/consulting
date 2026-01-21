"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";

interface ManagedServicesHeroProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

// Animation timing config
const ANIMATION_CONFIG = {
  animationStartDelay: 0,
  clipPathDuration: 1.8,
  textOverlap: 0.7,
  ctaOverlap: 0.4,
};

export default function ManagedServicesHero({
  title,
  description,
  imageSrc = "/campaign-creators.jpg",
  imageAlt = "Managed Services Hero",
}: ManagedServicesHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [animationReady, setAnimationReady] = useState(false);

  // Set initial clip-path immediately on mount
  useEffect(() => {
    if (!sectionRef.current || !imageContainerRef.current) return;

    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;

    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;
    const initialSize = Math.min(sectionWidth, sectionHeight) * 0.3;
    const initialInsetTop = (sectionHeight - initialSize) / 2;
    const initialInsetLeft = (sectionWidth - initialSize) / 2;
    const initialBorderRadius = initialSize / 2;

    imageContainer.style.clipPath = `inset(${initialInsetTop}px ${initialInsetLeft}px ${initialInsetTop}px ${initialInsetLeft}px)`;
    imageContainer.style.borderRadius = `${initialBorderRadius}px`;
    imageContainer.style.transform = "rotate(-10deg) scale(1)";
    imageContainer.style.transformOrigin = "center center";
    imageContainer.style.visibility = "visible";
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
      if (
        !sectionRef.current ||
        !imageContainerRef.current ||
        !titleRef.current ||
        !descriptionRef.current ||
        !animationReady
      )
        return;

      const section = sectionRef.current;
      const imageContainer = imageContainerRef.current;
      const titleElement = titleRef.current;
      const descriptionElement = descriptionRef.current;

      gsap.set(section, {
        backgroundColor: "#000000",
      });

      const sectionWidth = section.offsetWidth;
      const sectionHeight = section.offsetHeight;

      const initialSize = Math.min(sectionWidth, sectionHeight) * 0.3;
      const initialWidth = initialSize;
      const initialHeight = initialSize;

      const initialInsetTop = (sectionHeight - initialHeight) / 2;
      const initialInsetLeft = (sectionWidth - initialWidth) / 2;
      const initialInsetRight = (sectionWidth - initialWidth) / 2;
      const initialInsetBottom = (sectionHeight - initialHeight) / 2;

      const initialBorderRadius = Math.min(initialWidth, initialHeight) / 2;
      const finalBorderRadius = 0;

      const initialRotation = -10;
      const finalRotation = 0;
      const initialScale = 1.0;
      const finalScale = 1.05;

      const animationData = {
        insetTop: initialInsetTop,
        insetRight: initialInsetRight,
        insetBottom: initialInsetBottom,
        insetLeft: initialInsetLeft,
        borderRadius: initialBorderRadius,
        rotation: initialRotation,
        scale: initialScale,
      };

      gsap.set(imageContainer, {
        clipPath: `inset(${initialInsetTop}px ${initialInsetRight}px ${initialInsetBottom}px ${initialInsetLeft}px)`,
        borderRadius: `${initialBorderRadius}px`,
        rotation: initialRotation,
        scale: initialScale,
        transformOrigin: "center center",
      });

      gsap.set(titleElement, { opacity: 1 });

      const titleSplit = SplitText.create(titleElement, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(titleSplit.lines, {
        paddingBottom: "0.1em",
        yPercent: 100,
      });
      gsap.set(titleSplit.masks, {
        marginBottom: "-0.1em",
      });

      gsap.set(descriptionElement, { opacity: 1 });
      const descriptionSplit = SplitText.create(descriptionElement, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(descriptionSplit.lines, {
        paddingBottom: "0.1em",
        yPercent: 100,
      });
      gsap.set(descriptionSplit.masks, {
        marginBottom: "-0.1em",
      });

      const timeline = gsap.timeline();

      timeline.to(animationData, {
        insetTop: 0,
        insetRight: 0,
        insetBottom: 0,
        insetLeft: 0,
        borderRadius: finalBorderRadius,
        rotation: finalRotation,
        scale: finalScale,
        duration: ANIMATION_CONFIG.clipPathDuration,
        ease: "power2.out",
        onUpdate: function () {
          imageContainer.style.clipPath = `inset(${animationData.insetTop}px ${animationData.insetRight}px ${animationData.insetBottom}px ${animationData.insetLeft}px)`;
          imageContainer.style.borderRadius = `${animationData.borderRadius}px`;
          imageContainer.style.transform = `rotate(${animationData.rotation}deg) scale(${animationData.scale})`;
        },
      });

      timeline.to(
        titleSplit.lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
        },
        `-=${ANIMATION_CONFIG.textOverlap}`
      );

      timeline.to(
        descriptionSplit.lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
        },
        `-=${ANIMATION_CONFIG.ctaOverlap}`
      );

      return () => {
        titleSplit.revert();
        descriptionSplit.revert();
      };
    },
    { scope: sectionRef, dependencies: [animationReady] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-svh flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden bg-black"
    >
      {/* Image Background Container with Clip Path */}
      {/* Initially invisible via CSS to prevent FOUC - JS sets visibility after clip-path is applied */}
      <div
        ref={imageContainerRef}
        className="absolute inset-0 z-0 origin-center will-change-transform backface-hidden invisible"
        style={{ willChange: "clip-path, transform" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-0" />
        {/* Edge smoothing overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.5)] rounded-[inherit]" />
      </div>

      {/* Content Overlay - Bottom positioned */}
      <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 md:pb-12 lg:pb-16 mt-auto">
        <div className="max-w-3xl">
          <h1
            ref={titleRef}
            className="text-4xl md:text-7xl font-normal text-white mb-4 md:mb-6 font-pp-neue-montreal text-left opacity-0 tracking-[-0.02em]"
          >
            {title}
          </h1>
          <p
            ref={descriptionRef}
            className="text-base md:text-lg text-white font-pp-neue-montreal max-w-lg opacity-0"
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
