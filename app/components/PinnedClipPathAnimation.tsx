"use client";

import { useGSAP, gsap } from "@/lib/gsapConfig";
import Image from "next/image";
import { ReactNode, useRef } from "react";

interface PinnedClipPathAnimationProps {
  image1?: string;
  image2?: string;
  image3?: string;
  alt1?: string;
  alt2?: string;
  alt3?: string;
  content1?: ReactNode;
  content2?: ReactNode;
  content3?: ReactNode;
  className?: string;
  scrollEnd?: string;
}

const PinnedClipPathAnimation = ({
  image1,
  image2,
  image3,
  alt1 = "Image 1",
  alt2 = "Image 2",
  alt3 = "Image 3",
  content1,
  content2,
  content3,
  className = "",
  scrollEnd = "+=2000",
}: PinnedClipPathAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const wrapper = containerRef.current.querySelector(".bigimg-wrapper");
      if (!wrapper) return;

      // Timeline for clip-path animations
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: scrollEnd,
          scrub: 1,
          pin: true,
          // anticipatePin: 1,
          invalidateOnRefresh: true, // Better responsive behavior
          // markers: false, // Enable for debugging
        },
      });

      // Images Clip-Path animations
      const section2 = containerRef.current.querySelector(".section2");
      const section3 = containerRef.current.querySelector(".section3");

      if (section2) {
        tl2.to(section2, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power1.out",
        });
      }

      if (section3) {
        tl2.to(section3, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power1.out",
        });
      }

      // useGSAP automatically handles cleanup via gsap.context()
      // No manual cleanup needed unless you have custom event listeners
    },
    {
      scope: containerRef, // Scopes selectors to this container for better performance
      dependencies: [scrollEnd], // Recreate animation when scrollEnd changes
    }
  );

  return (
    <div ref={containerRef} className={`p-0 ${className}`}>
      <section className="bigimg-wrapper relative h-screen w-full overflow-hidden flex flex-col justify-between">
        <div className="section1 absolute inset-0 z-30 origin-center">
          {/* scale-75 */}
          {image1 && (
            <Image
              src={image1}
              alt={alt1}
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Content Container - Flex Layout */}
          <div className="absolute inset-0 z-40 flex flex-col justify-between px-4 pb-16 md:px-8 md:pb-24 pt-12 md:pt-30">
            {/* Pagination - Top Left */}
            <div className="flex items-start gap-1">
              <span className="text-[120px] sm:text-[150px] md:text-[180px] font-normal text-white font-pp-neue-montreal leading-none">01</span>
              <span className="text-base sm:text-lg md:text-xl font-normal text-white font-pp-neue-montreal pt-6">/3</span>
            </div>
            
            {/* Content - Bottom Right */}
            {content1 && (
              <div className="flex justify-end items-end">
                <div className="text-right max-w-lg w-full sm:max-w-xl md:max-w-lg text-white font-pp-neue-montreal">
                  <div className="w-full h-px bg-white mb-2 md:mb-3"></div>
                  {content1}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 (middle) */}
        <div
          className="section2 absolute inset-0 z-40"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          {image2 && (
            <Image
              src={image2}
              alt={alt2}
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Content Container - Flex Layout */}
          <div className="absolute inset-0 z-40 flex flex-col justify-between px-4 pb-16 md:px-8 md:pb-24 pt-12 md:pt-30">
            {/* Pagination - Top Left */}
            <div className="flex items-start gap-1">
              <span className="text-[120px] sm:text-[150px] md:text-[180px] font-normal text-white font-pp-neue-montreal leading-none">02</span>
              <span className="text-base sm:text-lg md:text-xl font-normal text-white font-pp-neue-montreal pt-6">/3</span>
            </div>
            
            {/* Content - Bottom Right */}
            {content2 && (
              <div className="flex justify-end items-end">
                <div className="text-right max-w-lg w-full sm:max-w-xl md:max-w-lg text-white font-pp-neue-montreal">
                  <div className="w-full h-px bg-white mb-2 md:mb-3"></div>
                  {content2}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="section3 absolute inset-0 z-50"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          {image3 && (
            <Image
              src={image3}
              alt={alt3}
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Content Container - Flex Layout */}
          <div className="absolute inset-0 z-40 flex flex-col justify-between px-4 pb-16 md:px-8 md:pb-24 pt-12 md:pt-30">
            {/* Pagination - Top Left */}
            <div className="flex items-start gap-1">
              <span className="text-[120px] sm:text-[150px] md:text-[180px] font-normal text-white font-pp-neue-montreal leading-none">03</span>
              <span className="text-base sm:text-lg md:text-xl font-normal text-white font-pp-neue-montreal pt-6">/3</span>
            </div>
            
            {/* Content - Bottom Right */}
            {content3 && (
              <div className="flex justify-end items-end">
                <div className="text-right max-w-lg w-full sm:max-w-xl md:max-w-lg text-white font-pp-neue-montreal">
                  <div className="w-full h-px bg-white mb-2 md:mb-3"></div>
                  {content3}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PinnedClipPathAnimation;
