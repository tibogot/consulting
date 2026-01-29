"use client";

import { useRef } from "react";
import Link from "next/link";
import { ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinTitleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trigger = triggerRef.current;
      const title = pinTitleRef.current;
      const content = contentRef.current;
      if (!trigger || !title || !content) return;

      ScrollTrigger.create({
        trigger: trigger,
        start: "top 50%",
        end: () => `+=${content.offsetHeight - title.offsetHeight}`,
        pin: title,
        pinSpacing: false,
        // markers: true,
        invalidateOnRefresh: true,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black px-4 py-20 md:px-8"
    >
      <div className="w-full">
        <div className="h-px w-full bg-white/20" />
        <p className="pt-6 font-pp-neue-montreal text-sm text-white md:text-base">
          Why us ?
        </p>

        {/* This is the trigger container */}
        <div
          ref={triggerRef}
          className="mt-20 flex flex-col md:mt-24 md:flex-row md:items-start md:gap-16 lg:gap-24"
        >
          {/* Left: GSAP-pinned title */}
          <div className="shrink-0 pb-12 md:w-1/2 md:pb-0 lg:w-2/5">
            <div ref={pinTitleRef}>
              <h2 className="max-w-xl text-left font-pp-neue-montreal text-4xl leading-tight font-normal text-white md:text-5xl lg:text-6xl">
                Company, offering integrated solution.
              </h2>
            </div>
          </div>

          {/* Right: 5 blocks + Explore services */}
          <div
            ref={contentRef}
            className="flex flex-col gap-16 md:w-1/2 md:gap-20 lg:w-3/5"
          >
            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex flex-row gap-6 pt-6 md:gap-8">
                <p className="shrink-0 font-pp-neue-montreal text-base text-white md:text-lg">
                  (01)
                </p>
                <p className="font-pp-neue-montreal text-sm leading-relaxed text-white/80 md:text-base">
                  From our roots as a Belgian recruitment agency to a trusted
                  consulting partner across 11 countries, Sparagus has evolved
                  to meet the real expertise needs of modern business. We help
                  companies fill critical roles, lead complex projects, and
                  manage full-service delivery — without losing the human touch.
                </p>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex flex-row gap-6 pt-6 md:gap-8">
                <p className="shrink-0 font-pp-neue-montreal text-base text-white md:text-lg">
                  (02)
                </p>
                <p className="font-pp-neue-montreal text-sm leading-relaxed text-white/80 md:text-base">
                  With over a decade of experience and 100+ active consultants,
                  our teams combine deep domain knowledge, operational agility,
                  and a commitment to long-term partnerships. At Sparagus,
                  success isn&apos;t about transactions — it&apos;s about
                  impact.
                </p>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex flex-row gap-6 pt-6 md:gap-8">
                <p className="shrink-0 font-pp-neue-montreal text-base text-white md:text-lg">
                  (03)
                </p>
                <p className="font-pp-neue-montreal text-sm leading-relaxed text-white/80 md:text-base">
                  We bridge the gap between talent and transformation, helping
                  organizations execute complex initiatives and scale
                  operations—all while preserving the personal touch that makes
                  partnerships meaningful.
                </p>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex flex-row gap-6 pt-6 md:gap-8">
                <p className="shrink-0 font-pp-neue-montreal text-base text-white md:text-lg">
                  (04)
                </p>
                <p className="font-pp-neue-montreal text-sm leading-relaxed text-white/80 md:text-base">
                  Our approach goes beyond placements and projects—we build
                  relationships that drive measurable impact and create lasting
                  value for your business.
                </p>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex flex-row gap-6 pt-6 md:gap-8">
                <p className="shrink-0 font-pp-neue-montreal text-base text-white md:text-lg">
                  (05)
                </p>
                <p className="font-pp-neue-montreal text-sm leading-relaxed text-white/80 md:text-base">
                  Sharp research, practical strategy, and decision-ready
                  artifacts—so your team stops debating and starts building.
                  Clean execution, predictable cadence, and measurable progress.
                </p>
              </div>
            </div>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 font-pp-neue-montreal text-sm text-white transition-opacity hover:opacity-80 md:text-base"
            >
              Explore services <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
