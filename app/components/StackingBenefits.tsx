"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

const benefits = [
  {
    title: "Access to passive candidates",
    description:
      "Reach exceptional talent who aren't actively searching but are open to the right opportunity.",
    stat: "85%",
    statLabel: "of our placements are passive candidates",
  },
  {
    title: "Reduced time to hire",
    description:
      "Streamlined process with pre-vetted candidates accelerates your hiring timeline significantly.",
    stat: "40%",
    statLabel: "faster than traditional recruitment",
  },
  {
    title: "Higher retention rates",
    description:
      "Rigorous cultural fit assessment ensures long-term success and organizational alignment.",
    stat: "92%",
    statLabel: "retention rate after 2 years",
  },
];

export default function StackingBenefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = cardsContainerRef.current;
      if (!container) return;

      const cardEls = gsap.utils.toArray<HTMLElement>("[data-benefit-card]");
      if (cardEls.length === 0) return;

      const lastCard = cardEls[cardEls.length - 1] as HTMLElement;

      cardEls.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top top+=100",
          pin: true,
          pinSpacing: false,
          endTrigger: lastCard,
          end: "top top+=100",
          invalidateOnRefresh: true,
        });
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-normal font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] max-w-4xl">
            Why partner with us
          </h2>
        </div>

        <div ref={cardsContainerRef} className="flex justify-center">
          <div className="w-full md:w-[85%]">
            {benefits.map((benefit, index) => (
              <article
                key={benefit.title}
                data-benefit-card
                className="w-full bg-white/5 border border-white/10 rounded-sm p-8 md:p-12 mb-16"
                style={{
                  top: `${100 + index * 10}px`,
                  height: "auto",
                  minHeight: "400px",
                }}
              >
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-5xl font-normal font-pp-neue-montreal text-white mb-6 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-lg md:text-xl text-white/70 font-pp-neue-montreal leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 md:w-64 flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                    <div className="text-6xl md:text-7xl font-normal font-pp-neue-montreal text-white mb-4">
                      {benefit.stat}
                    </div>
                    <div className="text-sm md:text-base text-white/60 font-pp-neue-montreal">
                      {benefit.statLabel}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
