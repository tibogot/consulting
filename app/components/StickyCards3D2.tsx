"use client";

import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

const StickyCards3D = () => {
  const stickyCardsData = [
    {
      index: "01",
      title: "Discovery",
      image: "/images/sticky-cards/stickycard-1.webp",
      description:
        "We begin by understanding your business challenges, objectives, and opportunities through comprehensive analysis and stakeholder engagement.",
    },
    {
      index: "02",
      title: "Strategy",
      image: "/images/sticky-cards/stickycard-2.webp",
      description:
        "Our experts develop tailored solutions and strategic roadmaps that align with your goals and drive meaningful business transformation.",
    },
    {
      index: "03",
      title: "Implementation",
      image: "/images/sticky-cards/stickycard-3.webp",
      description:
        "We execute with precision using agile methodologies, expert project management, and customized technological solutions for reliable delivery.",
    },
    {
      index: "04",
      title: "Optimization",
      image: "/images/sticky-cards/stickycard-4.webp",
      description:
        "We ensure long-term success through continuous monitoring, performance optimization, and ongoing support to maximize your investment value.",
    },
  ];

  const container = useRef(null);

  useGSAP(
    () => {
      const stickyCards = document.querySelectorAll(".sticky-card-3d");

      stickyCards.forEach((card, index) => {
        if (index < stickyCards.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: stickyCards[stickyCards.length - 1],
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
        }

        if (index < stickyCards.length - 1) {
          ScrollTrigger.create({
            trigger: stickyCards[index + 1],
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              const scale = 1 - progress * 0.25;
              const rotation = (index % 2 === 0 ? 5 : -5) * progress;
              const rotationX = 5 * progress; // 3D rotateX animation
              const afterOpacity = progress;

              gsap.set(card, {
                scale: scale,
                rotation: rotation,
                rotationX: rotationX,
                transformPerspective: 1000, // Enable 3D transforms via GSAP
                "--after-opacity": afterOpacity,
              });
            },
          });
        }
      });
    },
    { scope: container }
  );

  return (
    <div
      className="bg-black relative h-full pt-64 w-full overflow-hidden"
      style={{ isolation: "isolate" }}
      ref={container}
    >
      {stickyCardsData.map((cardData, index) => {
        const isLastCard = index === stickyCardsData.length - 1;
        return (
          <div
            className={`sticky-card-3d relative flex items-center justify-center overflow-hidden will-change-transform ${
              isLastCard
                ? "h-screen w-full"
                : "h-[70vh] w-[90%] max-w-5xl mx-auto rounded-sm"
            }`}
            style={
              {
                backgroundImage: `url(${cardData.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                "--after-opacity": 0,
                zIndex: index + 1,
              } as React.CSSProperties
            }
            key={index}
          >
            {/* Dark overlay that animates with GSAP */}
            <div
              className="pointer-events-none absolute inset-0 z-2 bg-black/50 transition-opacity duration-100 ease-linear"
              style={{
                opacity: "var(--after-opacity, 0)",
              }}
            />

            {/* Content */}
            <div className="relative z-3 flex h-full w-full flex-col justify-between p-8 md:p-12">
              {/* Top Row - Number and Title */}
              <div className="flex w-full items-start gap-8 md:gap-12">
                {/* Index - Top Left */}
                <div className="font-pp-neue-montreal-mono text-white">
                  <h1 className="text-xs md:text-sm">{cardData.index}</h1>
                </div>

                {/* Title - To the right of number, pushed down */}
                <div className="font-pp-neue-montreal mt-6 text-white md:mt-8">
                  <h2 className="text-4xl md:text-6xl">{cardData.title}</h2>
                </div>
              </div>

              {/* Description - Bottom */}
              <div className="font-pp-neue-montreal max-w-2xl text-white">
                <p className="text-base md:text-3xl">{cardData.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StickyCards3D;
