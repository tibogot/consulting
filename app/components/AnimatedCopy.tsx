"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsapConfig";

interface AnimatedCopyProps {
  children: React.ReactNode;
  colorInitial?: string;
  colorAccent?: string;
  colorFinal?: string;
  start?: string;
  end?: string;
  scrub?: number;
}

interface SplitTextRef {
  wordSplit: SplitText;
  charSplit: SplitText;
}

export default function AnimatedCopy({
  children,
  colorInitial = "#dddddd",
  colorAccent = "#abff02",
  colorFinal = "#000000",
  start = "top 90%",
  end = "top 10%",
  scrub = 0.5,
}: AnimatedCopyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const splitRefs = useRef<SplitTextRef[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRefs.current = [];

      let elements: Element[] = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        const wordSplit = SplitText.create(element, {
          type: "words",
          wordsClass: "word",
        });

        const charSplit = SplitText.create(wordSplit.words, {
          type: "chars",
          charsClass: "char",
        });

        splitRefs.current.push({ wordSplit, charSplit });
      });

      const allChars = splitRefs.current.flatMap(
        ({ charSplit }) => charSplit.chars
      );

      // Set initial color
      gsap.set(allChars, { color: colorInitial });

      // Create a timeline with all character animations
      // GSAP will handle scrubbing efficiently without per-frame callbacks
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub,
        },
      });

      // Stagger animation: initial -> accent -> final for each character
      // Each char takes a small portion of the timeline
      const staggerAmount = 0.02; // Time between each char starting
      const charDuration = 0.1; // Duration for each char's color change

      allChars.forEach((char, index) => {
        const startTime = index * staggerAmount;

        // Animate to accent color
        tl.to(
          char,
          {
            color: colorAccent,
            duration: charDuration * 0.3,
            ease: "none",
          },
          startTime
        );

        // Then animate to final color
        tl.to(
          char,
          {
            color: colorFinal,
            duration: charDuration * 0.7,
            ease: "none",
          },
          startTime + charDuration * 0.3
        );
      });

      return () => {
        splitRefs.current.forEach(({ wordSplit, charSplit }) => {
          if (charSplit) charSplit.revert();
          if (wordSplit) wordSplit.revert();
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [colorInitial, colorAccent, colorFinal, start, end, scrub],
    }
  );

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
