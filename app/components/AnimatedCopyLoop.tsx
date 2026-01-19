"use client";

import React, { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsapConfig";

interface AnimatedCopyLoopProps {
  children: React.ReactNode;
  colorInitial?: string;
  colorAccent?: string;
  colorFinal?: string;
  staggerEach?: number;
  durationToAccent?: number;
  durationToFinal?: number;
  durationToInitial?: number;
  repeatDelay?: number;
}

interface SplitTextRef {
  wordSplit: SplitText;
  charSplit: SplitText;
}

export default function AnimatedCopyLoop({
  children,
  colorInitial = "#dddddd",
  colorAccent = "#abff02",
  colorFinal = "#000000",
  staggerEach = 0.02,
  durationToAccent = 0.5,
  durationToFinal = 0.3,
  durationToInitial = 0.4,
  repeatDelay = 0.8,
}: AnimatedCopyLoopProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const splitRefs = useRef<SplitTextRef[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRefs.current = [];

      // Determine which elements to split (same spirit as AnimatedCopy, but with a
      // fallback for plain text nodes).
      let elements: Element[] = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        const childElements = Array.from(containerRef.current.children);
        elements = childElements.length ? childElements : [containerRef.current];
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

      gsap.set(allChars, { color: colorInitial });

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay,
        defaults: { ease: "none" },
      });

      tl.to(allChars, {
        color: colorAccent,
        duration: durationToAccent,
        stagger: { each: staggerEach, from: "start" },
      })
        .to(allChars, {
          color: colorFinal,
          duration: durationToFinal,
          stagger: { each: staggerEach, from: "start" },
        })
        .to(allChars, {
          color: colorInitial,
          duration: durationToInitial,
          stagger: { each: staggerEach, from: "start" },
        });

      return () => {
        tl.kill();
        splitRefs.current.forEach(({ wordSplit, charSplit }) => {
          if (charSplit) charSplit.revert();
          if (wordSplit) wordSplit.revert();
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [
        colorInitial,
        colorAccent,
        colorFinal,
        staggerEach,
        durationToAccent,
        durationToFinal,
        durationToInitial,
        repeatDelay,
      ],
    }
  );

  return (
    <div ref={containerRef as React.Ref<HTMLDivElement>} data-copy-wrapper="true">
      {children}
    </div>
  );
}

