"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ReactNode } from "react";

interface NeoCultureMouseMoveProps {
  images?: string[];
  altTexts?: string[];
  children?: ReactNode;
  blockSize?: number;
  className?: string;
  gradientColors?: {
    initial: string;
    accent: string;
    final: string;
  };
}

const NeoCultureMouseMove = ({
  images = [
    "/img-1.jpg",
    "/img-2.jpg",
    "/img-3.jpg",
    "/img-4.jpg",
    "/img-5.jpg",
    "/img-6.jpg",
  ],
  altTexts = ["Image 1", "Image 2", "Image 3", "Image 4", "Image 5", "Image 6"],
  children,
  blockSize = 50,
  className = "",
  gradientColors = {
    initial: "#8202FF",
    accent: "#FF02FF",
    final: "#FF02FF",
  },
}: NeoCultureMouseMoveProps) => {
  const blocksContainerRef = useRef<HTMLDivElement>(null);
  const [numCols, setNumCols] = useState(0);
  const [numBlocks, setNumBlocks] = useState(0);
  const activeTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Calculate grid dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cols = Math.ceil(width / blockSize);
      const rows = Math.ceil(height / blockSize);
      const blocks = cols * rows;

      setNumCols(cols);
      setNumBlocks(blocks);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      // Cleanup timeouts
      const timeouts = activeTimeoutsRef.current;
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [blockSize]);

  // Shuffle array helper
  const shuffleArray = useCallback((array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Generate gradient color based on intensity (0 to 1) - purple to pink
  const getGradientColor = useCallback(
    (intensity: number): string => {
      // Clamp intensity between 0 and 1
      intensity = Math.max(0, Math.min(1, intensity));

      // Simple gradient: purple -> pink
      const purple = gradientColors.initial
        .match(/\w\w/g)
        ?.map((x) => parseInt(x, 16)) || [130, 2, 255];
      const pink = gradientColors.accent
        .match(/\w\w/g)
        ?.map((x) => parseInt(x, 16)) || [255, 2, 255];

      const r = Math.round(purple[0] + (pink[0] - purple[0]) * intensity);
      const g = Math.round(purple[1] + (pink[1] - purple[1]) * intensity);
      const b = Math.round(purple[2] + (pink[2] - purple[2]) * intensity);

      // Return with lower opacity for subtle effect
      return `rgba(${r}, ${g}, ${b}, 0.5)`;
    },
    [gradientColors]
  );

  // Handle block highlight - using direct DOM manipulation to avoid re-renders
  const handleBlockHighlight = useCallback(
    (index: number) => {
      if (!numCols || !numBlocks || !blocksContainerRef.current) return;

      const blockElement = blocksContainerRef.current.children[
        index
      ] as HTMLElement;
      if (!blockElement) return;

      // Calculate neighbors
      const neighbors = [
        index - 1,
        index + 1,
        index - numCols,
        index + numCols,
        index - numCols - 1,
        index - numCols + 1,
        index + numCols - 1,
        index + numCols + 1,
      ].filter(
        (i) =>
          i >= 0 &&
          i < numBlocks &&
          Math.abs((i % numCols) - (index % numCols)) <= 1
      );

      // Clear existing timeout for this block if any
      const existingTimeout = activeTimeoutsRef.current.get(index);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Highlight current block with gradient color (full intensity) using box-shadow
      const gradientColor = getGradientColor(1);
      blockElement.style.boxShadow = `inset 0 0 0 1px ${gradientColor}`;

      // Remove highlight after 500ms
      const timeout1 = setTimeout(() => {
        blockElement.style.boxShadow =
          "inset 0 0 0 1px rgba(255, 255, 255, 0.075)";
        activeTimeoutsRef.current.delete(index);
      }, 500);
      activeTimeoutsRef.current.set(index, timeout1);

      // Highlight one random neighbor
      const shuffledNeighbors = shuffleArray(neighbors);
      const randomNeighbor = shuffledNeighbors[0];

      if (randomNeighbor !== undefined) {
        const neighborElement = blocksContainerRef.current.children[
          randomNeighbor
        ] as HTMLElement;
        if (neighborElement) {
          // Clear existing timeout for neighbor if any
          const existingNeighborTimeout =
            activeTimeoutsRef.current.get(randomNeighbor);
          if (existingNeighborTimeout) {
            clearTimeout(existingNeighborTimeout);
          }

          // Highlight neighbor with gradient color (medium intensity) using box-shadow
          const neighborGradientColor = getGradientColor(0.6);
          neighborElement.style.boxShadow = `inset 0 0 0 1px ${neighborGradientColor}`;

          const timeout2 = setTimeout(() => {
            neighborElement.style.boxShadow =
              "inset 0 0 0 1px rgba(255, 255, 255, 0.075)";
            activeTimeoutsRef.current.delete(randomNeighbor);
          }, 500);
          activeTimeoutsRef.current.set(randomNeighbor, timeout2);
        }
      }
    },
    [numCols, numBlocks, shuffleArray, getGradientColor]
  );

  // Throttle function to limit mousemove events - using ref to avoid render issues
  const throttledHandleHighlightRef = useRef<((index: number) => void) | null>(
    null
  );

  useEffect(() => {
    let lastCall = 0;
    const throttled = (index: number) => {
      const now = Date.now();
      if (now - lastCall >= 50) {
        lastCall = now;
        handleBlockHighlight(index);
      }
    };
    throttledHandleHighlightRef.current = throttled;
  }, [handleBlockHighlight]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Blocks Grid Overlay */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[10000]">
        <div
          ref={blocksContainerRef}
          className="bg-black w-[105%] h-full overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, ${blockSize}px)`,
            gridAutoRows: `${blockSize}px`,
          }}
        >
          {Array.from({ length: numBlocks }).map((_, index) => (
            <div
              key={index}
              className="cursor-pointer"
              style={{
                width: `${blockSize}px`,
                height: `${blockSize}px`,
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.075)",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseMove={() => throttledHandleHighlightRef.current?.(index)}
            />
          ))}
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative w-full h-full p-[2em] z-[2] pointer-events-none">
        {children ? (
          <div className="pointer-events-auto">{children}</div>
        ) : (
          <div className="w-[60%] mx-auto mt-[10em] flex gap-[10em] pointer-events-auto">
            {/* First Column */}
            <div className="flex-1">
              {images.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className="w-full h-[300px] border border-[#8b807b] bg-white/10 backdrop-blur-[5px] p-[10px] mb-[10em]"
                >
                  <Image
                    src={img}
                    alt={altTexts[idx] || `Image ${idx + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Second Column */}
            <div className="flex-1 mt-[15em]">
              {images.slice(3, 6).map((img, idx) => (
                <div
                  key={idx + 3}
                  className="w-full h-[300px] border border-[#8b807b] bg-white/10 backdrop-blur-[5px] p-[10px] mb-[10em]"
                >
                  <Image
                    src={img}
                    alt={altTexts[idx + 3] || `Image ${idx + 4}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeoCultureMouseMove;
