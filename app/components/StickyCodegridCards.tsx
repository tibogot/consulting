"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

const cardsData = [
  {
    id: "1",
    phase: "01",
    date: "May 15th",
    title: "Beta",
    span: "Launch",
  },
  {
    id: "2",
    phase: "02",
    date: "July 1st",
    title: "Public",
    span: "Release",
  },
  {
    id: "3",
    phase: "03",
    date: "August 20th",
    title: "API",
    span: "Integration",
  },
  {
    id: "4",
    phase: "04",
    date: "October 5th",
    title: "Pro",
    span: "Features",
  },
] as const;

const indicesData = [
  {
    id: "index-1",
    date: "May 15th",
    description: "Beta Launch",
    color: "#ecb74c",
  },
  {
    id: "index-2",
    date: "July 1st",
    description: "Public Release",
    color: "#7dd8cd",
  },
  {
    id: "index-3",
    date: "August 20th",
    description: "API Integration",
    color: "#e0ff57",
  },
  {
    id: "index-4",
    date: "October 5th",
    description: "Pro Features",
    color: "#7dd8cd",
  },
] as const;

type CardProps = {
  id: string;
  phase: string;
  date: string;
  title: string;
  span: string;
};

function getCardTheme(id: CardProps["id"]) {
  // Matches the original demo colors
  switch (id) {
    case "1":
      return {
        border: "rgba(236, 183, 76, 0.35)",
        text: "#ecb74c",
        phaseBg: "#ecb74c",
        bgImage: "/img-7.jpg",
      };
    case "2":
      return {
        border: "rgba(125, 216, 205, 0.35)",
        text: "#7dd8cd",
        phaseBg: "#7dd8cd",
        bgImage: "/img-11.jpg",
      };
    case "3":
      return {
        border: "rgba(224, 255, 87, 0.35)",
        text: "#e0ff57",
        phaseBg: "#e0ff57",
        bgImage: "/img-3.jpg",
      };
    case "4":
    default:
      return {
        border: "rgba(125, 216, 205, 0.35)",
        text: "#7dd8cd",
        phaseBg: "#7dd8cd",
        bgImage: "/img-10.jpg",
      };
  }
}

const ProgressBar = React.forwardRef<HTMLDivElement, { progressRef: React.RefObject<HTMLDivElement | null> }>(
  ({ progressRef }, ref) => (
    <div className="progress-bar absolute top-0 right-0 h-full w-[8px] bg-white opacity-0" ref={ref}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%)",
        }}
      />
      <div className="progress h-0 w-full bg-[#353531]" ref={progressRef} />
    </div>
  )
);
ProgressBar.displayName = "ProgressBar";

const Indices = React.forwardRef<
  HTMLDivElement,
  { setIndicesRef: (el: HTMLDivElement | null, index: number) => void }
>(({ setIndicesRef }, ref) => (
  <div
    className="indices absolute top-0 right-6 flex h-full flex-col justify-center gap-16 opacity-0"
    ref={ref}
  >
    {indicesData.map((indexItem, i) => (
      <div
        key={indexItem.id}
        className="index text-right opacity-25"
        id={indexItem.id}
        ref={(el) => setIndicesRef(el, i)}
        style={{ color: indexItem.color }}
      >
        <p className="text-[0.95rem] uppercase line-through">{indexItem.date}</p>
        <p className="text-[1.125rem] uppercase line-through">{indexItem.description}</p>
      </div>
    ))}
  </div>
));
Indices.displayName = "Indices";

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ id, phase, date, title, span }, ref) => {
  const theme = getCardTheme(id);

  return (
    <div
      className="card absolute left-1/2 top-[150%] flex h-1/2 w-[40%] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[1em] bg-black will-change-transform"
      id={`card-${id}`}
      ref={ref}
      style={{
        backgroundImage: `url(${theme.bgImage})`,
        backgroundPosition: "50% 50%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        border: `2px solid ${theme.border}`,
      }}
    >
      <div
        className="card-phase absolute top-4 left-1/2 -translate-x-1/2 rounded bg-black/0 px-1 py-0.5 text-black"
        style={{ backgroundColor: theme.phaseBg }}
      >
        <p className="text-[18px] lg:text-[24px]">Phase #{phase}</p>
      </div>

      <div className="card-title text-center" style={{ color: theme.text }}>
        <p className="text-[24px] lg:text-[36px]">From {date}</p>
        <h1 className="text-[40px] leading-[90%] font-light lg:text-[80px]">
          {title}{" "}
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: "1.25px #fff",
            }}
          >
            {span}
          </span>
        </h1>
      </div>
    </div>
  );
});
Card.displayName = "Card";

export default function StackingCardsPin() {
  const pinnedSectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const indicesContainerRef = useRef<HTMLDivElement | null>(null);
  const indicesRef = useRef<Array<HTMLDivElement | null>>([]);
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const pinnedSection = pinnedSectionRef.current;
    const stickyHeader = stickyHeaderRef.current;
    const progressBarContainer = progressBarRef.current;
    const progressBar = progressRef.current;
    const indicesContainer = indicesContainerRef.current;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const indices = indicesRef.current.filter(Boolean) as HTMLDivElement[];

    if (!pinnedSection || !stickyHeader || !progressBarContainer || !progressBar || !indicesContainer) return;
    if (cards.length === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) return;

    const cardCount = cards.length;
    const pinnedHeight = window.innerHeight * (cardCount + 1);
    const startRotations = [0, 5, 0, -5];
    const endRotations = [-10, -5, 10, 5];
    const progressColors = ["#ecb74c", "#7dd8cd", "#e0ff57", "#7dd8cd"];

    cards.forEach((card, index) => {
      gsap.set(card, { rotation: startRotations[index] ?? 0 });
    });

    let isProgressBarVisible = false;
    let currentActiveIndex = -1;

    function animateIndexOpacity(newIndex: number) {
      if (newIndex !== currentActiveIndex) {
        indices.forEach((indexEl, i) => {
          gsap.to(indexEl, {
            opacity: i === newIndex ? 1 : 0.25,
            duration: 0.5,
            ease: "power2.out",
          });
        });
        currentActiveIndex = newIndex;
      }
    }

    function showProgressAndIndices() {
      gsap.to([progressBarContainer, indicesContainer], {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      isProgressBarVisible = true;
    }

    function hideProgressAndIndices() {
      gsap.to([progressBarContainer, indicesContainer], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      isProgressBarVisible = false;
      animateIndexOpacity(-1);
    }

    const trigger = ScrollTrigger.create({
      trigger: pinnedSection,
      start: "top top",
      end: `+=${pinnedHeight}`,
      pin: true,
      pinSpacing: true,
      onLeave: () => {
        hideProgressAndIndices();
      },
      onEnterBack: () => {
        showProgressAndIndices();
      },
      onUpdate: (self) => {
        const progress = self.progress * (cardCount + 1);
        const currentCard = Math.floor(progress);

        if (progress <= 1) {
          gsap.to(stickyHeader, {
            opacity: 1 - progress,
            duration: 0.1,
            ease: "none",
          });
        } else {
          gsap.set(stickyHeader, { opacity: 0 });
        }

        if (progress > 1 && !isProgressBarVisible) {
          showProgressAndIndices();
        } else if (progress <= 1 && isProgressBarVisible) {
          hideProgressAndIndices();
        }

        let progressHeight = 0;
        let colorIndex = -1;
        if (progress > 1) {
          progressHeight = ((progress - 1) / cardCount) * 100;
          colorIndex = Math.min(Math.floor(progress - 1), cardCount - 1);
        }

        gsap.to(progressBar, {
          height: `${progressHeight}%`,
          backgroundColor: progressColors[colorIndex],
          duration: 0.3,
          ease: "power1.out",
        });

        if (isProgressBarVisible) {
          animateIndexOpacity(colorIndex);
        }

        cards.forEach((card, index) => {
          if (index < currentCard) {
            gsap.set(card, {
              top: "50%",
              rotation: endRotations[index] ?? 0,
            });
          } else if (index === currentCard) {
            const cardProgress = progress - currentCard;
            const newTop = gsap.utils.interpolate(150, 50, cardProgress);
            const newRotation = gsap.utils.interpolate(
              startRotations[index] ?? 0,
              endRotations[index] ?? 0,
              cardProgress
            );
            gsap.set(card, {
              top: `${newTop}%`,
              rotation: newRotation,
            });
          } else {
            gsap.set(card, {
              top: "150%",
              rotation: startRotations[index] ?? 0,
            });
          }
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      data-codegrid-stacking-cards
      className="w-full text-white"
      style={{
        fontFamily:
          '"Absolut Headline Web 2021", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <ReactLenis root>
        <section
          className="hero h-screen w-full overflow-hidden bg-black bg-cover bg-center"
          style={{ backgroundImage: "url(/img-12.jpg)" }}
        />

        <section className="pinned relative h-screen w-full overflow-hidden bg-black" ref={pinnedSectionRef}>
          <div className="sticky-header absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100" ref={stickyHeaderRef}>
            <h1
              className="text-center text-[20vw] font-light text-transparent"
              style={{ WebkitTextStroke: "2px #fff" }}
            >
              Roadmap
            </h1>
          </div>

          <ProgressBar ref={progressBarRef} progressRef={progressRef} />
          <Indices
            ref={indicesContainerRef}
            setIndicesRef={(el, index) => (indicesRef.current[index] = el)}
          />

          {cardsData.map((card, index) => (
            <Card
              key={card.id}
              {...card}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
            />
          ))}
        </section>

        <section className="footer flex h-screen w-full items-center justify-center overflow-hidden bg-black">
          <h1 className="text-center text-[4vw] font-light text-white">
            Your next section goes here
          </h1>
        </section>
      </ReactLenis>

      <style>{`
        /* Keep the few non-Tailwind-friendly bits local to this component */
        @media (max-width: 900px) {
          [data-codegrid-stacking-cards] .card {
            width: 75%;
            height: 40%;
          }

          [data-codegrid-stacking-cards] .card-phase p {
            font-size: 18px;
          }

          [data-codegrid-stacking-cards] .card-title p {
            font-size: 24px;
          }

          [data-codegrid-stacking-cards] .card-title h1 {
            font-size: 40px;
          }

          [data-codegrid-stacking-cards] .card-title h1 span {
            -webkit-text-stroke: 0.75px #fff;
          }

          [data-codegrid-stacking-cards] .indices {
            right: 15px;
          }

          [data-codegrid-stacking-cards] .index p:nth-child(1),
          [data-codegrid-stacking-cards] .index p:nth-child(2) {
            display: none;
          }

          [data-codegrid-stacking-cards] .footer h1 {
            font-size: 8vw;
          }
        }
      `}</style>
    </div>
  );
}