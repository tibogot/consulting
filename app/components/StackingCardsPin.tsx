"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import AnimatedCopy from "../components/AnimatedCopy";

type StackingCard = {
  kicker: string;
  title: string;
  body: string;
  imageSrc: string;
};

export default function StackingCardsPin({
  className = "",
}: {
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const cards = useMemo<StackingCard[]>(
    () => [
      {
        kicker: "Strategy",
        title: "Align the narrative",
        body: "A pinned moment that turns scrolling into structure. Cards stack with precise spacing, then release back to the page.",
        imageSrc: "/images/cards/charlesdeluvio.jpg",
      },
      {
        kicker: "Execution",
        title: "Build the system",
        body: "Each card translates upward into a clean stack. Smooth, predictable pin behavior (Lenis + ScrollTrigger compatible).",
        imageSrc: "/images/cards/clay.jpg",
      },
      {
        kicker: "Outcome",
        title: "Ship with clarity",
        body: "At the end of the pinned range, the stack is complete and the section unpins so you can continue scrolling naturally.",
        imageSrc: "/images/cards/malte.jpg",
      },
    ],
    []
  );

  useGSAP(
    () => {
      const container = cardsContainerRef.current;
      if (!container) return;

      const cardEls = gsap.utils.toArray<HTMLElement>("[data-stacking-card]");
      if (cardEls.length === 0) return;

      const lastCard = cardEls[cardEls.length - 1] as HTMLElement;

      // Store ScrollTrigger instances for explicit cleanup
      const scrollTriggers: ScrollTrigger[] = [];

      cardEls.forEach((card) => {
        // Pin each card at the exact same position (top: 80px)
        const st = ScrollTrigger.create({
          trigger: card,
          start: "top top+=100",
          pin: true,
          pinSpacing: false,
          endTrigger: lastCard, // All cards wait for the last card
          end: "top top+=100", // Unpin when last card reaches the pin position
          invalidateOnRefresh: true,
          // markers: true,
        });

        scrollTriggers.push(st);
      });

      // Cleanup function - explicitly kill all ScrollTrigger instances
      return () => {
        scrollTriggers.forEach((st) => st.kill());
      };
    },
    { scope: sectionRef, dependencies: [cards.length] }
  );

  return (
    <section
      ref={sectionRef}
      className={`relative w-full bg-black ${className}`}
    >
      <div className="relative w-full py-24">
        <div className="px-4 md:px-8">
          <div className="mb-14 max-w-3xl font-pp-neue-montreal">
            <AnimatedCopy
              colorInitial="#666666"
              colorAccent="#8202FF"
              colorFinal="#ffffff"
            >
              <p className="text-xs tracking-wide text-white/60 uppercase md:text-sm">
                GSAP Pin / Stacking Cards
              </p>
              <h2 className="mt-3 text-4xl leading-tight font-normal text-white md:text-6xl">
                Stacking cards (pinned)
              </h2>
              <p className="mt-4 text-base text-white/70 md:text-lg">
                Section pins, cards stack, then unpins to next section.
              </p>
            </AnimatedCopy>
          </div>

          {/* Cards container */}
          <div ref={cardsContainerRef} className="flex justify-center pt-16">
            <div className="w-[92%] md:w-[70%]">
              {cards.map((card, index) => (
                <article
                  key={card.title}
                  data-stacking-card
                  className="mb-12 w-full overflow-hidden rounded-sm border border-white/10 bg-white/5"
                  style={{
                    height: "600px",
                    // top: `${40 + index * 5}px`, // Small offset like the example (40px, 45px, 50px)
                  }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={card.imageSrc}
                      alt={card.title}
                      fill
                      // priority={index === 0 || card.imageSrc === "/img-11.jpg"}
                      loading={
                        card.imageSrc === "/img-11.jpg" ? "eager" : undefined
                      }
                      className="object-cover"
                      sizes="(max-width: 768px) 92vw, 70vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                      <div className="flex items-start justify-between gap-6">
                        <div className="font-pp-neue-montreal text-xs text-white/70 uppercase md:text-sm">
                          {String(index + 1).padStart(2, "0")} / 03
                        </div>
                        <div className="font-pp-neue-montreal text-xs text-white/50 uppercase md:text-sm">
                          {card.kicker}
                        </div>
                      </div>

                      <div className="max-w-2xl">
                        <h3 className="font-pp-neue-montreal text-3xl leading-tight font-normal text-white md:text-5xl">
                          {card.title}
                        </h3>
                        <p className="mt-3 font-pp-neue-montreal text-sm text-white/75 md:text-lg">
                          {card.body}
                        </p>
                        <div className="mt-6 h-px w-full bg-white/20" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
