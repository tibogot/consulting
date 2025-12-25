"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, Flip, useGSAP } from "@/lib/gsapConfig";

interface HorizontalScrollSectionProps {
  images?: string[];
  pinnedImageIndex?: number;
  slides?: {
    text: string;
    image: string;
  }[];
}

export default function HorizontalScrollSection({
  images = Array.from({ length: 13 }, (_, i) => `/img-${i + 1}.jpg`),
  pinnedImageIndex = 6,
  slides = [
    {
      text: "A landscape in constant transition, where every shape, sound, and shadow refuses to stay still. What seems stable begins to dissolve, and what fades returns again in a new form.",
      image: "/slide-1.jpg",
    },
    {
      text: "The rhythm of motion carries us forward into spaces that feel familiar yet remain undefined. Each shift is subtle, yet together they remind us that nothing we see is ever permanent.",
      image: "/slide-2.jpg",
    },
  ],
}: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedMarqueeImgCloneRef = useRef<HTMLImageElement | null>(null);
  const isImgCloneActiveRef = useRef(false);
  const flipAnimationRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const lightColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--light")
      .trim() || "#edf1e8";
    const darkColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--dark")
      .trim() || "#101010";

    function interpolateColor(color1: string, color2: string, factor: number) {
      return gsap.utils.interpolate(color1, color2, factor);
    }

    gsap.to(".marquee-images", {
      scrollTrigger: {
        trigger: ".marquee",
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const xPosition = -75 + progress * 25;
          gsap.set(".marquee-images", {
            x: `${xPosition}%`,
          });
        },
      },
    });

    function createPinnedMarqueeImgClone() {
      if (isImgCloneActiveRef.current) return;

      const originalMarqueeImg = document.querySelector(
        ".marquee-img.pin img"
      ) as HTMLImageElement;
      if (!originalMarqueeImg) return;

      const rect = originalMarqueeImg.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      pinnedMarqueeImgCloneRef.current = originalMarqueeImg.cloneNode(
        true
      ) as HTMLImageElement;

      gsap.set(pinnedMarqueeImgCloneRef.current, {
        position: "fixed",
        left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
        top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
        width: originalMarqueeImg.offsetWidth + "px",
        height: originalMarqueeImg.offsetHeight + "px",
        transform: "rotate(-5deg)",
        transformOrigin: "center center",
        pointerEvents: "none",
        willChange: "transform",
        zIndex: 40,
      });

      document.body.appendChild(pinnedMarqueeImgCloneRef.current);
      gsap.set(originalMarqueeImg, { opacity: 0 });
      isImgCloneActiveRef.current = true;
    }

    function removePinnedMarqueeImgClone() {
      if (!isImgCloneActiveRef.current) return;
      if (pinnedMarqueeImgCloneRef.current) {
        pinnedMarqueeImgCloneRef.current.remove();
        pinnedMarqueeImgCloneRef.current = null;
      }
      const originalMarqueeImg = document.querySelector(
        ".marquee-img.pin img"
      ) as HTMLImageElement;
      if (originalMarqueeImg) {
        gsap.set(originalMarqueeImg, { opacity: 1 });
      }
      isImgCloneActiveRef.current = false;
    }

    ScrollTrigger.create({
      trigger: ".horizontal-scroll",
      start: "top top",
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
    });

    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top top",
      onEnter: createPinnedMarqueeImgClone,
      onEnterBack: createPinnedMarqueeImgClone,
      onLeaveBack: removePinnedMarqueeImgClone,
    });

    ScrollTrigger.create({
      trigger: ".horizontal-scroll",
      start: "top 50%",
      end: () => `+=${window.innerHeight * 5.5}`,
      onEnter: () => {
        if (
          pinnedMarqueeImgCloneRef.current &&
          isImgCloneActiveRef.current &&
          !flipAnimationRef.current
        ) {
          const state = Flip.getState(pinnedMarqueeImgCloneRef.current);

          gsap.set(pinnedMarqueeImgCloneRef.current, {
            position: "fixed",
            left: "0px",
            top: "0px",
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            transform: "rotate(0deg)",
            transformOrigin: "center center",
          });

          flipAnimationRef.current = Flip.from(state, {
            duration: 1,
            ease: "none",
            paused: true,
          });
        }
      },
      onLeaveBack: () => {
        if (flipAnimationRef.current) {
          flipAnimationRef.current.kill();
          flipAnimationRef.current = null;
        }
        if (containerRef.current) {
          gsap.set(containerRef.current, {
            backgroundColor: lightColor,
          });
        }
        gsap.set(".horizontal-scroll-wrapper", {
          x: "0%",
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".horizontal-scroll",
      start: "top 50%",
      end: () => `+=${window.innerHeight * 5.5}`,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.05) {
          const bgColorProgress = Math.min(progress / 0.05, 1);
          const newBgColor = interpolateColor(
            lightColor,
            darkColor,
            bgColorProgress
          );
          if (containerRef.current) {
            gsap.set(containerRef.current, {
              backgroundColor: newBgColor,
            });
          }
        } else if (progress > 0.05) {
          if (containerRef.current) {
            gsap.set(containerRef.current, {
              backgroundColor: darkColor,
            });
          }
        }

        if (progress <= 0.2) {
          const scaleProgress = progress / 0.2;
          if (flipAnimationRef.current) {
            flipAnimationRef.current.progress(scaleProgress);
          }
        }

        if (progress > 0.2 && progress <= 0.95) {
          if (flipAnimationRef.current) {
            flipAnimationRef.current.progress(1);
          }

          const horizontalProgress = (progress - 0.2) / 0.75;

          const wrapperTranslateX = -66.67 * horizontalProgress;
          gsap.set(".horizontal-scroll-wrapper", {
            x: `${wrapperTranslateX}%`,
          });

          const slideMovement = (66.67 / 100) * 3 * horizontalProgress;
          const imageTranslateX = -slideMovement * 100;
          if (pinnedMarqueeImgCloneRef.current) {
            gsap.set(pinnedMarqueeImgCloneRef.current, {
              x: `${imageTranslateX}%`,
            });
          }
        } else if (progress > 0.95) {
          if (flipAnimationRef.current) {
            flipAnimationRef.current.progress(1);
          }
          if (pinnedMarqueeImgCloneRef.current) {
            gsap.set(pinnedMarqueeImgCloneRef.current, {
              x: "-200%",
            });
          }
          gsap.set(".horizontal-scroll-wrapper", {
            x: "-66.67%",
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (pinnedMarqueeImgCloneRef.current) {
        pinnedMarqueeImgCloneRef.current.remove();
      }
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-[#edf1e8]">
      <section className="hero relative w-full h-svh p-8 flex items-center justify-center text-center">
        <h1 className="w-full lg:w-3/4 mx-auto text-4xl lg:text-[4rem] font-medium tracking-tight leading-tight">
          Fragments of thought arranged in sequence become patterns. They unfold
          step by step, shaping meaning as they move forward.
        </h1>
      </section>

      <section className="marquee relative w-full h-[70svh] overflow-hidden py-[10svh]">
        <div className="marquee-wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[5deg] w-[150%] lg:w-[300%] h-[50svh]">
          <div className="marquee-images absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-1/2 w-[200%] h-full flex justify-between items-center gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className={`marquee-img flex-1 w-full aspect-[5/3] ${
                  index === pinnedImageIndex ? "pin" : ""
                }`}
              >
                <img
                  src={img}
                  alt={`Marquee image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="horizontal-scroll relative w-full h-svh overflow-hidden">
        <div className="horizontal-scroll-wrapper absolute top-0 left-0 h-svh flex will-change-transform translate-x-0">
          <div className="horizontal-slide horizontal-spacer min-w-screen w-screen h-full bg-transparent"></div>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="horizontal-slide min-w-screen w-screen h-full flex flex-col-reverse lg:flex-row gap-8 p-16 lg:p-8 bg-[#101010] text-[#edf1e8]"
            >
              <div className="col flex-[3] flex justify-center lg:items-start items-center">
                <h3 className="w-full lg:w-3/4 text-2xl lg:text-[2.25rem] font-medium tracking-tight leading-tight">
                  {slide.text}
                </h3>
              </div>
              <div className="col flex-[2] flex justify-center items-center">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full lg:w-3/4 h-full lg:h-3/4 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="outro relative w-full h-svh p-8 flex items-center justify-center text-center bg-[#101010] text-[#edf1e8]">
        <h1 className="w-full lg:w-3/4 mx-auto text-4xl lg:text-[4rem] font-medium tracking-tight leading-tight">
          Shadows fold into light. Shapes shift across the frame, reminding us
          that stillness is only temporary.
        </h1>
      </section>
    </div>
  );
}
