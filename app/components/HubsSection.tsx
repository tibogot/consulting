"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Draggable, gsap } from "@/lib/gsapConfig";
import AnimatedText from "./AnimatedText3";

const HUB_CARDS = [
  {
    id: "1",
    src: "/campaign-creators.jpg",
    alt: "Modern and clean extraction",
    title: "Modern and clean extraction",
  },
  {
    id: "2",
    src: "/channel-82.jpg",
    alt: "Access to new and untapped sources",
    title: "Access to new and untapped sources",
  },
  {
    id: "3",
    src: "/alev-takil.jpg",
    alt: "Technology integration",
    title: "Technology integration",
  },
];

export default function HubsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  const setupDraggable = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    draggableRef.current?.kill();

    const containerWidth = container.clientWidth;
    const trackWidth = track.scrollWidth;
    const maxScroll = Math.max(0, trackWidth - containerWidth);

    if (maxScroll <= 0) return;

    draggableRef.current = Draggable.create(track, {
      type: "x",
      bounds: { minX: -maxScroll, maxX: 0 },
      inertia: { x: { min: -maxScroll, max: 0 } },
      cursor: "grab",
      activeCursor: "grabbing",
      edgeResistance: 0.85,
      dragResistance: 0,
      minimumMovement: 12,
      onDragStart: function () {
        container.classList.add("is-dragging");
      },
      onDragEnd: function () {
        container.classList.remove("is-dragging");
      },
    })[0];
  }, []);

  const go = useCallback((direction: 1 | -1) => {
    const container = containerRef.current;
    const track = trackRef.current;
    const draggable = draggableRef.current;
    if (!container || !track || !draggable) return;

    const containerWidth = container.clientWidth;
    const trackWidth = track.scrollWidth;
    const maxScroll = Math.max(0, trackWidth - containerWidth);
    if (maxScroll <= 0) return;

    const currentX = gsap.getProperty(track, "x") as number;
    const step = containerWidth * 0.8;
    let newX = direction === 1 ? currentX - step : currentX + step;
    newX = Math.max(-maxScroll, Math.min(0, newX));

    gsap.to(track, {
      x: newX,
      duration: 0.35,
      ease: "power2.out",
      onComplete: () => {
        draggable.update();
      },
    });
  }, []);

  useEffect(() => {
    setupDraggable();

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ro = new ResizeObserver(() => setupDraggable());
    ro.observe(container);

    return () => {
      ro.disconnect();
      draggableRef.current?.kill();
      draggableRef.current = null;
    };
  }, [setupDraggable]);

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
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Previous hub"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Next hub"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        {/* Draggable track: no right padding on this section so carousel bleeds to edge */}
        <div
          ref={containerRef}
          className="relative min-w-0 flex-1 cursor-grab overflow-hidden select-none lg:max-w-3xl xl:max-w-4xl [&.is-dragging]:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-0 will-change-transform"
          >
            {HUB_CARDS.map((card) => (
              <div
                key={card.id}
                className="relative aspect-3/4 w-[320px] shrink-0 overflow-hidden md:aspect-4/5 md:w-[400px] lg:aspect-[4/5] lg:w-[480px]"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
