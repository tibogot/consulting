"use client";

import { useGSAP, gsap } from "@/lib/gsapConfig";
import Image from "next/image";
import { useRef } from "react";

const PinnedClipPathAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollEnd = "+=2000";

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
          scrub: true,
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

      // Cleanup function - kills timeline and its associated ScrollTrigger (including pin spacer)
      return () => {
        tl2.kill();
      };
    },
    {
      scope: containerRef, // Scopes selectors to this container for better performance
      dependencies: [], // scrollEnd is a constant, no need to recreate animation
    }
  );

  return (
    <div ref={containerRef} className="p-0">
      <section className="bigimg-wrapper relative h-screen w-full overflow-hidden flex flex-col justify-between">
        <div className="section1 absolute inset-0 z-30 origin-center">
          <Image
            src="/alev-takil.jpg"
            alt="First section image"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Content Container - Flex Layout */}
          <div className="absolute inset-0 z-40 flex flex-col justify-between px-4 pb-16 md:px-8 md:pb-24 pt-30 md:pt-30">
            {/* Pagination - Top Left */}
            <div className="flex items-start gap-1">
              <span className="text-[120px] sm:text-[150px] md:text-[180px] font-normal text-white font-pp-neue-montreal leading-none">01</span>
              <span className="text-base sm:text-lg md:text-xl font-normal text-white font-pp-neue-montreal pt-6">/3</span>
            </div>
            
            {/* Content - Bottom Right */}
            <div className="flex justify-end items-end">
              <div className="text-right max-w-lg w-full sm:max-w-xl md:max-w-lg text-white font-pp-neue-montreal">
                <div className="w-full h-px bg-white mb-2 md:mb-3"></div>
                <div className="text-left">
                  <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-4">
                    Number of vehicles
                  </h2>
                  <p className="text-base text-white">
                    New capabilities such as camera, lidar, radar and ultrasonic-based technologies are exponentially increasing the complexity of repairing today&apos;s vehicles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 (middle) */}
        <div
          className="section2 absolute inset-0 z-40"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <Image
            src="/channel-82.jpg"
            alt="Second section image"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Content Container - Flex Layout */}
          <div className="absolute inset-0 z-40 flex flex-col justify-between px-4 pb-16 md:px-8 md:pb-24 pt-30 md:pt-30">
            {/* Pagination - Top Left */}
            <div className="flex items-start gap-1">
              <span className="text-[120px] sm:text-[150px] md:text-[180px] font-normal text-white font-pp-neue-montreal leading-none">02</span>
              <span className="text-base sm:text-lg md:text-xl font-normal text-white font-pp-neue-montreal pt-6">/3</span>
            </div>
            
            {/* Content - Bottom Right */}
            <div className="flex justify-end items-end">
              <div className="text-right max-w-lg w-full sm:max-w-xl md:max-w-lg text-white font-pp-neue-montreal">
                <div className="w-full h-px bg-white mb-2 md:mb-3"></div>
                <div className="text-left">
                  <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-4">
                    Technology integration
                  </h2>
                  <p className="text-base text-white">
                    Our enterprise-grade systems ensure reliable performance and seamless integration of cutting-edge technologies across all operational environments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="section3 absolute inset-0 z-50"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <Image
            src="/campaign-creators.jpg"
            alt="Third section image"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Content Container - Flex Layout */}
          <div className="absolute inset-0 z-40 flex flex-col justify-between px-4 pb-16 md:px-8 md:pb-24 pt-30 md:pt-30">
            {/* Pagination - Top Left */}
            <div className="flex items-start gap-1">
              <span className="text-[120px] sm:text-[150px] md:text-[180px] font-normal text-white font-pp-neue-montreal leading-none">03</span>
              <span className="text-base sm:text-lg md:text-xl font-normal text-white font-pp-neue-montreal pt-6">/3</span>
            </div>
            
            {/* Content - Bottom Right */}
            <div className="flex justify-end items-end">
              <div className="text-right max-w-lg w-full sm:max-w-xl md:max-w-lg text-white font-pp-neue-montreal">
                <div className="w-full h-px bg-white mb-2 md:mb-3"></div>
                <div className="text-left">
                  <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-4">
                    Intelligent systems
                  </h2>
                  <p className="text-base text-white">
                    We&apos;re revolutionizing the way vehicles are maintained and repaired, creating sustainable solutions that drive the industry forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PinnedClipPathAnimation;
