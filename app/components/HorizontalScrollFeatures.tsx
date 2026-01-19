"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

const features = [
  {
    number: "01",
    title: "Deep Market Intelligence",
    description:
      "Comprehensive research and analysis to identify top talent across industries and geographies.",
  },
  {
    number: "02",
    title: "Rigorous Assessment",
    description:
      "Multi-stage evaluation process ensuring candidates align with your culture and strategic objectives.",
  },
  {
    number: "03",
    title: "Confidential Process",
    description:
      "Discreet search management protecting both client and candidate interests throughout the engagement.",
  },
  {
    number: "04",
    title: "Long-term Partnership",
    description:
      "Ongoing support beyond placement to ensure successful integration and sustained performance.",
  },
];

export default function HorizontalScrollFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;

      const cards = container.querySelectorAll(".feature-card");
      const scrollWidth = container.scrollWidth - window.innerWidth;

      // Pin section and scroll horizontally
      gsap.to(container, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollWidth + window.innerHeight}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate each card as it comes into view
      cards.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          scale: 0.9,
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${index * (scrollWidth / cards.length)} top`,
            end: () =>
              `top+=${(index + 1) * (scrollWidth / cards.length)} top`,
            scrub: 1,
            containerAnimation: gsap.getById("horizontal-scroll"),
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-black overflow-hidden">
      <div
        ref={containerRef}
        className="flex h-full items-center"
        style={{ width: `${features.length * 100}vw` }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card flex-shrink-0 w-screen h-full flex items-center justify-center px-4 md:px-16"
          >
            <div className="max-w-2xl">
              <div className="text-white/30 text-8xl md:text-9xl font-pp-neue-montreal mb-8">
                {feature.number}
              </div>
              <h3 className="text-4xl md:text-6xl font-normal font-pp-neue-montreal text-white mb-6 leading-tight">
                {feature.title}
              </h3>
              <p className="text-lg md:text-xl text-white/70 font-pp-neue-montreal leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
