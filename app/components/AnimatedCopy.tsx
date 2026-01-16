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
  const lastScrollProgress = useRef<number>(0);
  const colorTransitionTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const completedChars = useRef<Set<number>>(new Set());

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Reset state
      splitRefs.current = [];
      lastScrollProgress.current = 0;
      colorTransitionTimers.current.clear();
      completedChars.current.clear();

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

      // Set initial color for all characters
      gsap.set(allChars, { color: colorInitial });

      // Schedule final color transition with delay
      const scheduleFinalTransition = (char: Element, index: number) => {
        if (colorTransitionTimers.current.has(index)) {
          clearTimeout(colorTransitionTimers.current.get(index)!);
        }

        const timer = setTimeout(() => {
          if (!completedChars.current.has(index)) {
            gsap.to(char, {
              duration: 0.1,
              ease: "none",
              color: colorFinal,
              onComplete: () => {
                completedChars.current.add(index);
              },
            });
          }
          colorTransitionTimers.current.delete(index);
        }, 100);

        colorTransitionTimers.current.set(index, timer);
      };

      // Create scroll trigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 90%",
        end: "top 10%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalChars = allChars.length;
          const isScrollingDown = progress >= lastScrollProgress.current;
          const currentCharIndex = Math.floor(progress * totalChars);

          allChars.forEach((char, index) => {
            // Handle scroll up - reset characters
            if (!isScrollingDown && index >= currentCharIndex) {
              if (colorTransitionTimers.current.has(index)) {
                clearTimeout(colorTransitionTimers.current.get(index)!);
                colorTransitionTimers.current.delete(index);
              }
              completedChars.current.delete(index);
              gsap.set(char, { color: colorInitial });
              return;
            }

            // Skip if already completed
            if (completedChars.current.has(index)) {
              return;
            }

            // Apply accent color and schedule final transition
            if (index <= currentCharIndex) {
              gsap.set(char, { color: colorAccent });
              if (!colorTransitionTimers.current.has(index)) {
                scheduleFinalTransition(char, index);
              }
            } else {
              gsap.set(char, { color: colorInitial });
            }
          });

          lastScrollProgress.current = progress;
        },
      });

      // Cleanup function
      return () => {
        // Clear all timers
        colorTransitionTimers.current.forEach((timer) => clearTimeout(timer));
        colorTransitionTimers.current.clear();
        completedChars.current.clear();

        // Revert SplitText instances
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
