"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsapConfig";

const LOGO_ROWS = 16;
const LOGOS_PER_ROW = 2;

/** Pattern: 1,4,5,8 = year slots (0-based: 0,3,4,7). 2,3,6,7 = evolution slots (1,2,5,6). */
const YEAR_SLOT_OFFSETS = new Set([0, 3, 4, 7]);

const DEFAULT_EVOLUTION = [
  "We launched our first product and entered new markets.",
  "Expanded the team and opened offices across Europe.",
  "Pivoted to platform strategy; reached 10,000 customers.",
  "Acquired complementary businesses and integrated offerings.",
  "Achieved profitability and doubled down on R&D.",
  "Introduced sustainability initiatives across operations.",
  "Scaled internationally with local partnerships.",
  "Reinvented the core product based on user feedback.",
];

interface BennettCliveScrollProps {
  rowCount?: number;
  startYear?: number;
  evolutionSteps?: string[];
}

const cellBase =
  "flex items-center justify-center text-center";
const cellEvolution = "flex justify-start items-center text-left";
const yearBase =
  " leading-none uppercase text-white text-[clamp(3rem,8vw,7rem)] max-[900px]:text-[clamp(2rem,6vw,4rem)]";
const evolutionBase =
  " leading-snug text-white text-left m-0 text-[clamp(0.8rem,1.1vw,1rem)] max-w-[28ch] max-[900px]:text-[0.75rem] max-[900px]:max-w-[22ch]";

export default function BennettCliveScroll({
  rowCount = LOGO_ROWS,
  startYear = 2019,
  evolutionSteps = DEFAULT_EVOLUTION,
}: BennettCliveScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const cells = useMemo(() => {
    const n = rowCount * LOGOS_PER_ROW;
    const out: ({ type: "year"; value: number } | { type: "evolution"; value: string })[] = [];
    let yearCount = 0;
    let evolutionCount = 0;
    for (let idx = 0; idx < n; idx++) {
      const inCycle = idx % 8;
      if (YEAR_SLOT_OFFSETS.has(inCycle)) {
        out.push({ type: "year", value: startYear + yearCount });
        yearCount++;
      } else {
        out.push({
          type: "evolution",
          value: evolutionSteps[evolutionCount % evolutionSteps.length],
        });
        evolutionCount++;
      }
    }
    return out;
  }, [rowCount, startYear, evolutionSteps]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const rows = container.querySelectorAll<HTMLElement>(".row");
      if (rows.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      function getViewportCenter() {
        return typeof window !== "undefined"
          ? window.scrollY + window.innerHeight / 2
          : 0;
      }

      rows.forEach((row) => {
        const t1 = ScrollTrigger.create({
          trigger: row,
          start: () => `top+=${getViewportCenter() - 550} center`,
          end: () => `top+=${getViewportCenter() - 450} center`,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const maxGap = window.innerWidth < 900 ? 10 : 15;
            const minGap = window.innerWidth < 900 ? 0.5 : 1;
            const currentGap = minGap + (maxGap - minGap) * progress;
            row.style.gap = `${currentGap}em`;
          },
        });
        triggers.push(t1);
      });

      rows.forEach((row) => {
        const t2 = ScrollTrigger.create({
          trigger: row,
          start: () => `top+=${getViewportCenter() - 400} center`,
          end: () => `top+=${getViewportCenter() - 300} center`,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const maxGap = window.innerWidth < 900 ? 0.5 : 1;
            const minGap = window.innerWidth < 900 ? 10 : 15;
            const currentGap = minGap + (maxGap - minGap) * progress;
            row.style.gap = `${currentGap}em`;
          },
        });
        triggers.push(t2);
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div
      ref={containerRef}
      className="font-pp-neue-montreal"
    >
      <section className="w-full bg-black py-[10em] px-4">
        {Array.from({ length: rowCount }).map((_, i) => {
          const left = cells[i * LOGOS_PER_ROW];
          const right = cells[i * LOGOS_PER_ROW + 1];
          return (
            <div
              key={i}
              className="row w-full flex justify-center"
              style={{ gap: "3em" }}
            >
              <div
                className={
                  left?.type === "evolution" ? cellEvolution : cellBase
                }
              >
                {left?.type === "year" ? (
                  <span className={yearBase}>{left.value}</span>
                ) : (
                  <p className={evolutionBase}>{left?.value}</p>
                )}
              </div>
              <div
                className={
                  right?.type === "evolution" ? cellEvolution : cellBase
                }
              >
                {right?.type === "year" ? (
                  <span className={yearBase}>{right.value}</span>
                ) : (
                  <p className={evolutionBase}>{right?.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
