"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useRouter, routing } from "@/i18n/routing";
import { gsap } from "@/lib/gsapConfig";
import { horizontalLoop, type ExtendedTimeline } from "@/lib/horizontalLoop";
import AnimatedText from "./AnimatedText3";

const TAP_THRESHOLD = 12;

const HUB_CARDS = [
  {
    id: "1",
    src: "/campaign-creators.jpg",
    alt: "Modern and clean extraction",
    title: "Modern and clean extraction",
    href: "/hubs/technology",
  },
  {
    id: "2",
    src: "/channel-82.jpg",
    alt: "Access to new and untapped sources",
    title: "Access to new and untapped sources",
    href: "/hubs/engineering",
  },
  {
    id: "3",
    src: "/alev-takil.jpg",
    alt: "Technology integration",
    title: "Technology integration",
    href: "/hubs/business-operations",
  },
];

export default function HubsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ExtendedTimeline | null>(null);
  const router = useRouter();

  const dragStateRef = useRef({
    isDragging: false,
    startPointerX: 0,
    startPointerY: 0,
    pointerMoved: false,
  });

  const go = useCallback((direction: 1 | -1) => {
    const loop = loopRef.current;
    if (!loop) return;
    const vars = { duration: 0.35, ease: "power2.out" as const };
    if (direction === 1) loop.next?.(vars);
    else loop.previous?.(vars);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = gsap.utils.toArray(
      container.querySelectorAll(".hub-card")
    ) as HTMLElement[];
    if (items.length === 0) return;

    const loop = horizontalLoop(items, {
      repeat: -1,
      paused: true,
      draggable: true,
      center: false,
      paddingRight: 24,
      minimumMovement: TAP_THRESHOLD,
      onPressInit() {
        dragStateRef.current.isDragging = false;
        dragStateRef.current.pointerMoved = false;
      },
      onPress(event?: MouseEvent | TouchEvent) {
        dragStateRef.current.pointerMoved = false;
        if (event) {
          if ("touches" in event && event.touches.length > 0) {
            dragStateRef.current.startPointerX = event.touches[0].clientX;
            dragStateRef.current.startPointerY = event.touches[0].clientY;
          } else if ("clientX" in event) {
            dragStateRef.current.startPointerX = event.clientX;
            dragStateRef.current.startPointerY = event.clientY;
          }
        }
      },
      onDragStart() {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.pointerMoved = true;
      },
      onDragEnd() {
        setTimeout(() => {
          dragStateRef.current.isDragging = false;
        }, 50);
      },
      onClick(e: MouseEvent | TouchEvent) {
        if (
          !dragStateRef.current.pointerMoved &&
          !dragStateRef.current.isDragging
        ) {
          const target = (e.target as HTMLElement).closest("a");
          if (target) {
            const href = target.getAttribute("href");
            if (href) {
              const pathname = href.replace(/^\//, "");
              const segments = pathname.split("/");
              const maybeLocale = segments[0];
              const pathnameWithoutLocale = (
                routing.locales as readonly string[]
              ).includes(maybeLocale)
                ? "/" + (segments.slice(1).join("/") || "")
                : href;
              router.push(pathnameWithoutLocale as "/hubs");
            }
          }
        }
      },
    });
    loopRef.current = loop;

    const handlePointerDown = (e: PointerEvent) => {
      dragStateRef.current.pointerMoved = false;
      dragStateRef.current.startPointerX = e.clientX;
      dragStateRef.current.startPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = Math.abs(e.clientX - dragStateRef.current.startPointerX);
      const deltaY = Math.abs(e.clientY - dragStateRef.current.startPointerY);
      if (deltaX > TAP_THRESHOLD || deltaY > TAP_THRESHOLD) {
        dragStateRef.current.pointerMoved = true;
      }
    };

    const handleLinkClick = (e: Event) => {
      if (
        dragStateRef.current.isDragging ||
        dragStateRef.current.pointerMoved
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    const links = container.querySelectorAll("a[href^='/hubs']");
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick, { capture: true });
    });

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick, { capture: true });
      });
      loop.kill();
      loopRef.current = null;
    };
  }, [router]);

  return (
    <section className="relative w-full bg-black py-16 md:py-24">
      {/* Header: has padding on both sides */}
      <div className="px-4 md:px-8">
        <div className="mb-4 h-px w-full bg-white/20" />
        <p className="font-pp-neue-montreal text-sm text-white md:text-base">
          Hubs
        </p>
        <div className="mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <AnimatedText>
            <h2 className="max-w-3xl font-pp-neue-montreal text-4xl leading-tight font-normal text-white md:text-5xl lg:text-6xl">
              Specialized Expertise Tailored To Your Industry
            </h2>
          </AnimatedText>
          <Link
            href="/hubs"
            className="shrink-0 font-pp-neue-montreal text-sm text-white underline transition-opacity hover:opacity-80 md:text-base"
          >
            View all hubs
          </Link>
        </div>
      </div>

      {/* Mid section: left padding only so carousel bleeds to right edge */}
      <div className="mt-12 flex flex-col gap-10 pl-4 md:pl-8 lg:mt-40 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex flex-col gap-8 lg:max-w-md">
          <p className="font-pp-neue-montreal text-base leading-relaxed text-white md:text-lg">
            Three centers of excellence combining deep industry knowledge with
            technical mastery.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center bg-white/10 text-white transition-opacity hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Previous hub"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center bg-white/10 text-white transition-opacity hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Next hub"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden lg:max-w-3xl xl:max-w-4xl">
          <div
            ref={containerRef}
            className="flex w-max cursor-grab gap-6 pl-0 select-none active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
          >
            {HUB_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.href as "/hubs"}
                className="hub-card relative block aspect-3/4 w-[320px] shrink-0 overflow-hidden md:aspect-4/5 md:w-[400px] lg:aspect-[4/5] lg:w-[480px]"
                draggable={false}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 400px, 320px"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 p-4 md:p-5">
                  <p className="max-w-2xs font-pp-neue-montreal text-base font-normal text-white md:text-2xl lg:text-2xl">
                    {card.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
