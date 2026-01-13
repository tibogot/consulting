"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import Image from "next/image";

interface PartnersTickerProps {
  speed?: number; // Animation speed in seconds (lower = faster)
  direction?: "left" | "right"; // Animation direction
  pauseOnHover?: boolean; // Pause animation on hover
  gap?: number; // Gap between logos in pixels
  logoHeight?: number; // Height of logos in pixels
}

// Partner logos array - update this if you add/remove logos
const partnerLogos = [
  "/images/PARTNERS LOGO/68835b0216e997c0698799e7_ffafe452ef6f38685abce3caf1145f32_image 1.avif",
  "/images/PARTNERS LOGO/68835b02276305f087357d1c_763cbfcd9f45b6d87d247f7c3c08096e_dela.nl logo.svg",
  "/images/PARTNERS LOGO/68835b024247e43c552f36a5_5d1f960a6e11656985d6d3c98d977c2b_pv.be logo.svg",
  "/images/PARTNERS LOGO/68835b02455ff3bf418cc719_8c756b5a80a4eab500e8176a225043e6_BNP logo.svg",
  "/images/PARTNERS LOGO/68835b027f4b97773eca4989_28b1a0811aad913573a7cca3f4b25c0e_KBC_logo logo.svg",
  "/images/PARTNERS LOGO/68835b0284b91e0360327891_ee048b263d4db32807b480d10e9f43a9_Ayvens_Logo_2024 logo.svg",
  "/images/PARTNERS LOGO/68835b029cb3a448c424bf39_2a4bbaebffcddabd1ce9ee37d0e050d2_Logo logo.svg",
  "/images/PARTNERS LOGO/68835b02bee4ee9f9686f8c0_81853c9c75209675f571d21cc27edbf3_Logo_of_Alcatel_Submarine_Networks logo.svg",
  "/images/PARTNERS LOGO/68835b02d3325a320b852b6d_223141aa4d97e6d113f0fc11dbf20e39_Thales logo.svg",
  "/images/PARTNERS LOGO/68835b02dd40a4f667bd8e18_46c1e319435a04898cdd2c743dc26cc0_CarrefourLogo logo.svg",
  "/images/PARTNERS LOGO/68835b02e06380955a8985f8_47cb4e528a5e9d1ddb4d60f4958cf927_AXA_Logo logo.svg",
  "/images/PARTNERS LOGO/68835b02f272eff6d5e9fd54_21f22195caf35ac4aa13f272c28adfe4_Baloise_Logo_2022 logo.svg",
  "/images/PARTNERS LOGO/68835b0c31b4abd0049357f8_644ad855312964cdaca6049b3981a4a8_logo-ores 1-p-500.png",
  "/images/PARTNERS LOGO/68835b0c8926f12bc95ff8e5_d345aef36f2a10d3720a4eb76a6295a1_ag-insurance-logo 1-p-500.png",
  "/images/PARTNERS LOGO/68835b0c9f14f9f82a846c55_4071af2b83ba2c54822abdb2c77ad5a7_Actiris-logo 1-p-500.avif",
  "/images/PARTNERS LOGO/68835b0ce8858eb64c511320_16d6e743901b5241f5bcc71bbc571249_Celsius_Energy_Drink_logo 1-p-500.png",
];

export default function PartnersTicker({
  speed = 20,
  direction = "left",
  pauseOnHover = true,
  gap = 64,
  logoHeight = 80,
}: PartnersTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Duplicate logos array to create seamless loop (need at least 2 copies)
  const duplicatedLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  useGSAP(
    () => {
      if (!tickerRef.current) return;

      const ticker = tickerRef.current;
      const logos = ticker.querySelectorAll(".partner-logo");

      if (logos.length === 0) return;

      // Calculate total width of one set of logos
      let totalWidth = 0;
      logos.forEach((logo, index) => {
        if (index < partnerLogos.length) {
          const element = logo as HTMLElement;
          totalWidth += element.offsetWidth + gap;
        }
      });

      // If no width calculated, wait for images to load
      if (totalWidth === 0) {
        // Wait for all images to load
        const images = Array.from(ticker.querySelectorAll("img"));
        const imagePromises = images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true); // Resolve even on error to not block
              }
            })
        );

        Promise.all(imagePromises).then(() => {
          // Recalculate after images load
          let recalculatedWidth = 0;
          logos.forEach((logo, index) => {
            if (index < partnerLogos.length) {
              const element = logo as HTMLElement;
              recalculatedWidth += element.offsetWidth + gap;
            }
          });

          if (recalculatedWidth > 0) {
            animateTicker(recalculatedWidth);
          }
        });
      } else {
        animateTicker(totalWidth);
      }

      function animateTicker(width: number) {
        // Kill existing animation if any
        if (animationRef.current) {
          animationRef.current.kill();
        }

        // Reset position
        gsap.set(ticker, { x: 0 });

        // Create seamless infinite animation
        // Animate exactly one set width - since content is duplicated, this creates seamless loop
        const moveAmount = direction === "left" ? -width : width;

        animationRef.current = gsap.to(ticker, {
          x: moveAmount,
          duration: speed,
          ease: "none",
          repeat: -1,
          // When repeat happens, GSAP resets x to 0, but since we have duplicated content,
          // the next set is already in view creating a seamless infinite loop
        });
      }
    },
    {
      scope: containerRef,
      dependencies: [speed, direction, gap],
    }
  );

  // Handle pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover && animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && animationRef.current) {
      animationRef.current.resume();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={tickerRef}
        className="flex items-center will-change-transform"
        style={{
          gap: `${gap}px`,
        }}
      >
        {duplicatedLogos.map((logo, index) => {
          const isSvg = logo.endsWith(".svg");
          const isAvif = logo.endsWith(".avif");

          return (
            <div
              key={`${logo}-${index}`}
              className="partner-logo flex-shrink-0 flex items-center justify-center"
              style={{
                height: `${logoHeight}px`,
                width: "auto",
              }}
            >
              {isSvg || isAvif ? (
                // Use img tag for SVG and AVIF (Next.js Image doesn't handle all formats well)
                <img
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    maxHeight: `${logoHeight}px`,
                    filter: "brightness(0) invert(1)", // Makes logos white, remove if you want original colors
                  }}
                />
              ) : (
                // Use Next.js Image for PNG/JPG
                <Image
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  width={200}
                  height={logoHeight}
                  className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    maxHeight: `${logoHeight}px`,
                    filter: "brightness(0) invert(1)", // Makes logos white, remove if you want original colors
                  }}
                  unoptimized // Remove if you want Next.js optimization
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
