"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

export default function SearchSelectionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const text = textRef.current;
      if (!section || !text) return;

      // Pin the section while text reveals
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        },
      });

      // Animate words appearing
      const words = text.querySelectorAll(".word");
      tl.from(words, {
        opacity: 0.2,
        yPercent: 50,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { scope: sectionRef }
  );

  const title = "Executive Search & Selection";
  const subtitle =
    "Finding exceptional talent who drive transformation and deliver results";

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black flex items-center justify-center px-4 md:px-8"
    >
      <div ref={textRef} className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          {title.split(" ").map((word, i) => (
            <span
              key={i}
              className="word inline-block text-6xl md:text-8xl lg:text-9xl font-normal font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] mr-6"
            >
              {word}
            </span>
          ))}
        </div>
        <div className="mt-12">
          {subtitle.split(" ").map((word, i) => (
            <span
              key={i}
              className="word inline-block text-xl md:text-2xl font-pp-neue-montreal text-white/70 mr-2"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-sm font-pp-neue-montreal">
        Scroll to explore
      </div>
    </section>
  );
}
