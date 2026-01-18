"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

type StackingCard = {
  kicker: string;
  title: string;
  body: string;
  imageSrc: string;
};

export default function StackingCardsPin({ className = "" }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const cards = useMemo<StackingCard[]>(
    () => [
      {
        kicker: "Strategy",
        title: "Align the narrative",
        body: "A pinned moment that turns scrolling into structure. Cards stack with precise spacing, then release back to the page.",
        imageSrc: "/img-7.jpg",
      },
      {
        kicker: "Execution",
        title: "Build the system",
        body: "Each card translates upward into a clean stack. Smooth, predictable pin behavior (Lenis + ScrollTrigger compatible).",
        imageSrc: "/img-11.jpg",
      },
      {
        kicker: "Outcome",
        title: "Ship with clarity",
        body: "At the end of the pinned range, the stack is complete and the section unpins so you can continue scrolling naturally.",
        imageSrc: "/img-3.jpg",
      },
    ],
    []
  );

  useGSAP(
    () => {
      const cardsEl = cardsRef.current;
      if (!cardsEl) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      if (prefersReducedMotion) return;

      const cardEls = Array.from(
        cardsEl.querySelectorAll<HTMLElement>("[data-stacking-card]")
      );
      if (cardEls.length < 2) return;

      // Classic stacked pin behavior:
      // - cards scroll naturally
      // - when a card reaches the "pin point" it sticks
      // - next card arrives and stacks on top (pinSpacing: false)
      const pinStart = "center center";

      // Ensure overlap order feels natural (last card on top)
      cardEls.forEach((el, i) => {
        gsap.set(el, { zIndex: i + 1 });
      });

      gsap.set(cardEls, {
        transformOrigin: "50% 0%",
        willChange: "transform",
        force3D: true,
      });

      cardEls.forEach((card, index) => {
        const isLast = index === cardEls.length - 1;
        if (isLast) return;

        const nextCard = cardEls[index + 1];

        // Pin current card until the next card reaches the same pin point.
        ScrollTrigger.create({
          trigger: card,
          start: pinStart,
          endTrigger: nextCard,
          end: pinStart,
          pin: true,
          pinSpacing: false,
          // anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        });

        // Subtle depth as the next card approaches.
        ScrollTrigger.create({
          trigger: nextCard,
          start: "top bottom",
          end: pinStart,
          onUpdate: (self) => {
            const p = self.progress; // 0 -> 1 as next card approaches pin point
            gsap.set(card, {
              scale: 1 - p * 0.02,
              y: -p * 8,
            });
          },
        });
      });

      // Make sure pin measurements are correct (fonts/images/Lenis)
      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={`relative w-full bg-black ${className}`}>
      <div className="relative w-full py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="font-pp-neue-montreal max-w-3xl mb-14">
            <p className="text-white/60 uppercase tracking-wide text-xs md:text-sm">
              GSAP / ScrollTrigger / Pin
            </p>
            <h2 className="mt-3 text-white text-4xl md:text-6xl font-normal leading-tight">
              Stacking cards (pinned)
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg">
              Three cards in a column at 70% width. Scroll to pin, stack, then unpin.
            </p>
          </div>

          <div ref={cardsRef} className="relative flex flex-col items-center gap-10 pb-24">
            {cards.map((card, index) => (
              <article
                key={card.title}
                data-stacking-card
                className="relative w-[92%] md:w-[70%] overflow-hidden rounded-sm border border-white/10 bg-white/5"
              >
                <div className="relative h-[62vh] min-h-[420px]">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 92vw, 70vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />

                  <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                    <div className="flex items-start justify-between gap-6">
                      <div className="font-pp-neue-montreal text-white/70 text-xs md:text-sm uppercase">
                        {String(index + 1).padStart(2, "0")} / 03
                      </div>
                      <div className="font-pp-neue-montreal text-white/50 text-xs md:text-sm uppercase">
                        {card.kicker}
                      </div>
                    </div>

                    <div className="max-w-2xl">
                      <h3 className="font-pp-neue-montreal text-white text-3xl md:text-5xl font-normal leading-tight">
                        {card.title}
                      </h3>
                      <p className="mt-3 font-pp-neue-montreal text-white/75 text-sm md:text-lg">
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
    </section>
  );
}

