"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsapConfig";

interface AnimatedCopyProps {
  children: React.ReactNode;
  colorInitial?: string;
  colorAccent?: string;
  colorFinal?: string;
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
}: AnimatedCopyProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const splitRefs = useRef<SplitTextRef[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRefs.current = [];

      // Determine which elements to split
      let elements: Element[] = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      // Split text into words, then characters for each element
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

      // Get all characters from all splits
      const allChars = splitRefs.current.flatMap(
        ({ charSplit }) => charSplit.chars
      );

      // Set initial color
      gsap.set(allChars, { color: colorInitial });

      // Create a timeline for the color animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "top 10%",
          scrub: 1,
        },
      });

      // Animate to accent color with stagger, then to final color
      tl.to(allChars, {
        color: colorAccent,
        duration: 0.5,
        stagger: {
          each: 0.02,
          from: "start",
        },
        ease: "none",
      }).to(
        allChars,
        {
          color: colorFinal,
          duration: 0.3,
          stagger: {
            each: 0.02,
            from: "start",
          },
          ease: "none",
        },
        0.1 // small overlap so accent flashes briefly before final
      );

      // Cleanup function
      return () => {
        splitRefs.current.forEach(({ wordSplit, charSplit }) => {
          if (charSplit) charSplit.revert();
          if (wordSplit) wordSplit.revert();
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [colorInitial, colorAccent, colorFinal],
    }
  );

  // Handle single child - clone with ref
  // Filter out text nodes and fragments to get only valid React elements
  const validChildren = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child)
  );

  if (validChildren.length === 1) {
    const child = validChildren[0] as React.ReactElement;
    // Create ref callback that merges with existing ref
    const mergedRefCallback = (node: HTMLElement | null) => {
      containerRef.current = node;
      // Forward ref if child already has one
      const originalRef = (child as any).ref;
      if (originalRef) {
        if (typeof originalRef === "function") {
          originalRef(node);
        } else if (originalRef && "current" in originalRef) {
          originalRef.current = node;
        }
      }
    };

    // Clone element with merged ref - TypeScript requires casting for ref prop
    return React.cloneElement(
      child,
      {
        ...(child.props as Record<string, unknown>),
        ref: mergedRefCallback,
      } as React.Attributes & { ref: (node: HTMLElement | null) => void }
    );
  }

  // Handle multiple children - wrap in container
  return (
    <div ref={containerRef as React.Ref<HTMLDivElement>} data-copy-wrapper="true">
      {children}
    </div>
  );
}
