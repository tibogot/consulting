"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "@/lib/gsapConfig";
import blurPlaceholders from "@/lib/blur-placeholders.json";

const HOLD_MS = 12000;
const FADE_DURATION = 0.55;
const TEXT_IN_DURATION = 0.75;
const TEXT_IN_STAGGER = 0.1;
const TEXT_OUT_DURATION = 0.5;
const TEXT_OUT_STAGGER = 0.06;

function fixMask(
  { elements, masks }: { elements: HTMLElement[]; masks: Element[] },
  baseLineHeight = 1.2
) {
  const [firstElement] = elements;
  const lineHeightValue = gsap.getProperty(firstElement, "line-height", "em");
  const lineHeight = parseFloat(String(lineHeightValue));
  const lineHeightDifference = lineHeight - baseLineHeight;

  masks.forEach((mask, i) => {
    const isFirstMask = i === 0;
    const isLastMask = i === masks.length - 1;
    const marginTop = isFirstMask ? `${0.5 * lineHeightDifference}em` : "0";
    const marginBottom = isLastMask
      ? `${0.5 * lineHeightDifference}em`
      : `${lineHeightDifference}em`;
    gsap.set(mask as HTMLElement, {
      lineHeight: baseLineHeight,
      marginTop,
      marginBottom,
    });
  });
}

const sections = [
  {
    id: 1,
    img: "/alev-takil.jpg",
    imgAlt: "First section",
    blurKey: "alev-takil" as keyof typeof blurPlaceholders,
    title: "Number of vehicles",
    body: "New capabilities such as camera, lidar, radar and ultrasonic-based technologies are exponentially increasing the complexity of repairing today's vehicles.",
  },
  {
    id: 2,
    img: "/channel-82.jpg",
    imgAlt: "Second section",
    blurKey: "channel-82" as keyof typeof blurPlaceholders,
    title: "Technology integration",
    body: "Our enterprise-grade systems ensure reliable performance and seamless integration of cutting-edge technologies across all operational environments.",
  },
  {
    id: 3,
    img: "/campaign-creators.jpg",
    imgAlt: "Third section",
    blurKey: "campaign-creators" as keyof typeof blurPlaceholders,
    title: "Intelligent systems",
    body: "We're revolutionizing the way vehicles are maintained and repaired, creating sustainable solutions that drive the industry forward.",
  },
];

type SectionSplit = {
  splits: SplitText[];
  lines: HTMLElement[];
};

export default function LoopingFadeSections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const splitRefs = useRef<SectionSplit[]>([]);
  const holdTimerRef = useRef<gsap.core.Tween | null>(null);
  const isTransitioningRef = useRef(false);
  const currentIndexRef = useRef(0);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      holdTimerRef.current.kill();
      holdTimerRef.current = null;
    }
  }, []);

  const runTransitionToRef = useRef<(toIndex: number) => void>(() => {});

  const scheduleNext = useCallback(
    (currentIndex: number) => {
      clearHoldTimer();
      const nextIndex = (currentIndex + 1) % sections.length;
      holdTimerRef.current = gsap.delayedCall(HOLD_MS / 1000, () => {
        holdTimerRef.current = null;
        runTransitionToRef.current(nextIndex);
      });
    },
    [clearHoldTimer]
  );

  const runTransitionTo = useCallback(
    (toIndex: number) => {
      const fromIndex = currentIndexRef.current;
      if (fromIndex === toIndex || isTransitioningRef.current) return;
      const fromSection = sectionRefs.current[fromIndex];
      const toSection = sectionRefs.current[toIndex];
      const fromSplit = splitRefs.current[fromIndex];
      const toSplit = splitRefs.current[toIndex];
      if (!fromSection || !toSection || !fromSplit || !toSplit) return;

      isTransitioningRef.current = true;
      clearHoldTimer();
      setActiveIndex(toIndex);

      gsap.set(toSection, { opacity: 0, zIndex: 10 });
      gsap.set(toSplit.lines, { yPercent: 100, autoAlpha: 0 });
      gsap.set(fromSection, { zIndex: 10 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(fromSection, { zIndex: 0 });
          gsap.set(toSection, { zIndex: 10 });
          currentIndexRef.current = toIndex;
          isTransitioningRef.current = false;
          scheduleNext(toIndex);
        },
      });

      tl.to(fromSplit.lines, {
        yPercent: 100,
        autoAlpha: 0,
        stagger: TEXT_OUT_STAGGER,
        duration: TEXT_OUT_DURATION,
        ease: "power2.in",
      })
        .to(
          fromSection,
          { opacity: 0, duration: FADE_DURATION, ease: "power2.in" },
          "-=0.2"
        )
        .set({}, {}, "+=0.05")
        .to(
          toSection,
          { opacity: 1, duration: FADE_DURATION, ease: "power2.out" },
          "<"
        )
        .to(
          toSplit.lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            stagger: TEXT_IN_STAGGER,
            duration: TEXT_IN_DURATION,
            ease: "power2.out",
          },
          `-=${FADE_DURATION * 0.5}`
        );
    },
    [clearHoldTimer, scheduleNext]
  );

  runTransitionToRef.current = runTransitionTo;

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const textWrappers = textBlockRefs.current;
      const numberWrappers = numberBlockRefs.current;

      for (let i = 0; i < sections.length; i++) {
        const allLines: HTMLElement[] = [];
        const splits: SplitText[] = [];

        const processElement = (el: HTMLElement) => {
          try {
            const split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              aria: "none",
            });
            if (split?.lines?.length) {
              fixMask({ elements: [el], masks: split.lines });
              splits.push(split);
              allLines.push(...(split.lines as HTMLElement[]));
            }
          } catch {
            /* skip */
          }
        };

        const numWrapper = numberWrappers[i];
        if (numWrapper) {
          const numChildren = Array.from(numWrapper.children) as HTMLElement[];
          numChildren.forEach(processElement);
        }

        const textWrapper = textWrappers[i];
        if (textWrapper) {
          const textChildren = Array.from(
            textWrapper.children
          ) as HTMLElement[];
          textChildren.forEach(processElement);
        }

        if (allLines.length) {
          splitRefs.current[i] = { splits, lines: allLines };
          gsap.set(allLines, { yPercent: 100, autoAlpha: 0 });
        }
      }

      const section0 = sectionRefs.current[0];
      const split0 = splitRefs.current[0];
      if (section0 && split0) {
        gsap.set(section0, { opacity: 1, zIndex: 10 });
        const tl = gsap.timeline({
          onComplete: () => scheduleNext(0),
        });
        tl.to(split0.lines, {
          yPercent: 0,
          autoAlpha: 1,
          stagger: TEXT_IN_STAGGER,
          duration: TEXT_IN_DURATION,
          ease: "power2.out",
        });
      }

      return () => {
        clearHoldTimer();
        splitRefs.current.forEach((s) => {
          s?.splits.forEach((sp) => sp.revert());
        });
        splitRefs.current = [];
      };
    },
    {
      scope: containerRef,
      dependencies: [scheduleNext, clearHoldTimer],
    }
  );

  useEffect(() => {
    return () => clearHoldTimer();
  }, [clearHoldTimer]);

  const handleSelectorClick = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioningRef.current) return;
      runTransitionTo(index);
    },
    [activeIndex, runTransitionTo]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {sections.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className="absolute inset-0"
          style={{
            opacity: i === 0 ? 1 : 0,
            zIndex: i === 0 ? 10 : 0,
            pointerEvents: activeIndex === i ? "auto" : "none",
          }}
        >
          <Image
            src={section.img}
            alt={section.imgAlt}
            fill
            className="object-cover"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurPlaceholders[section.blurKey]}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-between px-4 pt-30 pb-16 md:px-8 md:pt-30 md:pb-24">
            <div
              ref={(el) => {
                numberBlockRefs.current[i] = el;
              }}
              className="flex items-start gap-1 overflow-hidden"
            >
              <span className="font-pp-neue-montreal text-[120px] leading-none font-normal text-white sm:text-[150px] md:text-[180px]">
                {String(section.id).padStart(2, "0")}
              </span>
              <span className="pt-6 font-pp-neue-montreal text-base font-normal text-white sm:text-lg md:text-xl">
                /3
              </span>
            </div>
            <div className="flex items-end justify-end">
              <div className="w-full max-w-lg text-right font-pp-neue-montreal text-white sm:max-w-xl md:max-w-lg">
                <div className="mb-2 h-px w-full bg-white md:mb-3" />
                <div
                  ref={(el) => {
                    textBlockRefs.current[i] = el;
                  }}
                  className="overflow-hidden text-left"
                >
                  <h2 className="mb-4 text-3xl leading-tight font-normal md:text-4xl">
                    {section.title}
                  </h2>
                  <p className="text-base text-white">{section.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-3 md:bottom-8"
        aria-label="Section selector"
      >
        {sections.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectorClick(i)}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full font-pp-neue-montreal text-sm font-normal text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              activeIndex === i
                ? "bg-primary"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-pressed={activeIndex === i}
            aria-label={`Go to section ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
