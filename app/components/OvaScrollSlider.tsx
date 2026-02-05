"use client";

/**
 * OvaScrollSlider – scroll-pinned image slider with line-by-line title animation.
 * Adapted from codegrid-ova-scroll-slider-nextjs; uses Tailwind and @/lib/gsapConfig.
 * Pass `slides` (array of { title, image }) or use default slides (your project images).
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsapConfig";

export interface SlideItem {
  title: string;
  image: string;
}

const defaultSlides: SlideItem[] = [
  {
    title:
      "Under the soft hum of streetlights she watches the world ripple through glass, her calm expression mirrored in the fragments of drifting light.",
    image: "/images/sticky-cards/stickycard-1.webp",
  },
  {
    title:
      "A car slices through the desert, shadow chasing the wind as clouds of dust rise behind, blurring the horizon into gold and thunder.",
    image: "/images/sticky-cards/stickycard-2.webp",
  },
  {
    title:
      "Reflections ripple across mirrored faces, each one a fragment of identity, caught between defiance, doubt, and the silence of thought.",
    image: "/images/sticky-cards/stickycard-3.webp",
  },
  {
    title:
      "Soft light spills through the café windows as morning settles into wood and metal, capturing the rhythm of quiet human routine.",
    image: "/images/sticky-cards/stickycard-4.webp",
  },
  {
    title:
      "Every serve becomes a battle between focus and instinct, movement flowing like rhythm as the court blurs beneath the sunlight.",
    image: "/images/cards/charlesdeluvio.jpg",
  },
  {
    title:
      "Amber light spills over the stage as guitars cry into smoke and shadow, where music and motion merge into pure energy.",
    image: "/img-1.jpg",
  },
  {
    title:
      "Dust erupts beneath his stride as sweat glints under floodlights, every step pushing closer to victory, grit, and pure determination.",
    image: "/img-2.jpg",
  },
];

interface OvaScrollSliderProps {
  slides?: SlideItem[];
}

export default function OvaScrollSlider({
  slides = defaultSlides,
}: OvaScrollSliderProps) {
  const sliderRef = useRef<HTMLElement>(null);
  const sliderImagesRef = useRef<HTMLDivElement>(null);
  const sliderTitleRef = useRef<HTMLDivElement>(null);
  const sliderIndicesRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let activeSlide = 0;
      let currentSplit: ReturnType<typeof SplitText.create> | null = null;

      const pinDistance = window.innerHeight * slides.length;

      function createIndices() {
        if (!sliderIndicesRef.current) return;
        sliderIndicesRef.current.innerHTML = "";

        slides.forEach((_, index) => {
          const indexNum = (index + 1).toString().padStart(2, "0");
          const indicatorElement = document.createElement("p");
          indicatorElement.dataset.index = String(index);
          indicatorElement.className =
            "flex items-center gap-4 text-white font-mono text-sm";
          indicatorElement.innerHTML = `<span class="ova-slider-marker relative w-3 h-px bg-white origin-right will-change-transform scale-x-0"></span><span class="ova-slider-index relative w-5 flex justify-end will-change-opacity">${indexNum}</span>`;
          sliderIndicesRef.current!.appendChild(indicatorElement);

          const indexEl = indicatorElement.querySelector(".ova-slider-index");
          const markerEl = indicatorElement.querySelector(".ova-slider-marker");
          if (index === 0) {
            gsap.set(indexEl, { opacity: 1 });
            gsap.set(markerEl, { scaleX: 1 });
          } else {
            gsap.set(indexEl, { opacity: 0.35 });
            gsap.set(markerEl, { scaleX: 0 });
          }
        });
      }

      function animateNewSlide(index: number) {
        if (!sliderImagesRef.current || !sliderTitleRef.current) return;

        const newSliderImage = document.createElement("img");
        newSliderImage.src = slides[index].image;
        newSliderImage.alt = `Slide ${index + 1}`;
        newSliderImage.className =
          "absolute w-full h-full object-cover transform-origin-center will-change-[transform,opacity]";

        gsap.set(newSliderImage, { opacity: 0, scale: 1.1 });
        sliderImagesRef.current.appendChild(newSliderImage);

        gsap.to(newSliderImage, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(newSliderImage, {
          scale: 1,
          duration: 1,
          ease: "power2.out",
        });

        const allImages = sliderImagesRef.current.querySelectorAll("img");
        if (allImages.length > 3) {
          const removeCount = allImages.length - 3;
          for (let i = 0; i < removeCount; i++) {
            sliderImagesRef.current.removeChild(allImages[i]);
          }
        }

        animateNewTitle(index);
        animateIndicators(index);
      }

      function animateIndicators(index: number) {
        if (!sliderIndicesRef.current) return;
        const indicators = sliderIndicesRef.current.querySelectorAll("p");

        indicators.forEach((indicator, i) => {
          const markerElement = indicator.querySelector(".ova-slider-marker");
          const indexElement = indicator.querySelector(".ova-slider-index");

          if (i === index) {
            gsap.to(indexElement, {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(markerElement, {
              scaleX: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            gsap.to(indexElement, {
              opacity: 0.5,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(markerElement, {
              scaleX: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
      }

      function animateNewTitle(index: number) {
        if (!sliderTitleRef.current) return;

        if (currentSplit) {
          currentSplit.revert();
        }

        sliderTitleRef.current.innerHTML = `<h1 class="font-pp-neue-montreal text-3xl font-normal tracking-tight leading-tight md:text-4xl lg:text-5xl">${slides[index].title}</h1>`;

        const h1 = sliderTitleRef.current.querySelector("h1");
        if (!h1) return;

        currentSplit = SplitText.create(h1, {
          type: "lines",
          linesClass: "ova-slider-line",
          mask: "lines",
        });

        gsap.set(currentSplit.lines, { yPercent: 100, opacity: 0 });
        gsap.to(currentSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
        });
      }

      createIndices();

      ScrollTrigger.create({
        trigger: sliderRef.current,
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleY: self.progress });
          }

          const currentSlide = Math.floor(self.progress * slides.length);
          if (activeSlide !== currentSlide && currentSlide < slides.length) {
            activeSlide = currentSlide;
            animateNewSlide(activeSlide);
          }
        },
      });

      return () => {
        if (currentSplit) currentSplit.revert();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: sliderRef, dependencies: [slides.length] }
  );

  return (
    <section ref={sliderRef} className="relative h-svh w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full">
        <div ref={sliderImagesRef} className="absolute inset-0 h-full w-full">
          <img
            src={slides[0]?.image ?? ""}
            alt="Slide 1"
            className="transform-origin-center absolute h-full w-full object-cover will-change-[transform,opacity]"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        />
      </div>

      <div
        ref={sliderTitleRef}
        className="absolute top-1/2 left-8 w-1/2 max-w-2xl -translate-y-1/2 font-pp-neue-montreal text-white max-md:top-20 max-md:left-0 max-md:w-full max-md:max-w-none max-md:translate-y-0 max-md:p-8 md:left-8 lg:left-8"
      >
        <h1 className="text-3xl font-normal max-md:text-2xl md:text-4xl lg:text-5xl">
          {slides[0]?.title ?? ""}
        </h1>
      </div>

      <div className="absolute top-1/2 right-8 -translate-y-1/2 max-md:top-auto max-md:bottom-8 max-md:translate-y-0">
        <div ref={sliderIndicesRef} className="flex flex-col gap-4 px-5 py-4" />
        <div className="absolute top-0 right-0 h-full w-px bg-white/35">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-1/2 h-full w-[3px] origin-top -translate-x-1/2 scale-y-0 bg-white will-change-transform"
          />
        </div>
      </div>
    </section>
  );
}
