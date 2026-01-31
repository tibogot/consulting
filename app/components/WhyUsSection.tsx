"use client";

import Link from "next/link";

export default function WhyUsSection() {
  return (
    <section className="relative w-full bg-black px-4 py-8 md:px-8">
      <div className="w-full">
        <div className="h-px w-full bg-white/20" />
        <p className="pt-6 font-pp-neue-montreal text-sm text-white md:text-base">
          Why us ?
        </p>

        {/* Two column layout - items-stretch so left column is tall; sticky needs a tall containing block */}
        <div className="mt-20 flex flex-col md:mt-24 md:flex-row md:items-stretch md:gap-16 lg:gap-24">
          {/* Left: CSS sticky title */}
          <div className="shrink-0 pb-12 md:w-1/2 md:pb-0 lg:w-2/5">
            <div className="md:sticky md:top-30">
              <h2 className="max-w-xl text-left font-pp-neue-montreal text-4xl leading-tight font-normal text-white md:text-5xl lg:text-6xl">
                Company, offering integrated solution.
              </h2>
            </div>
          </div>

          {/* Right: 4 cards + Explore services - horizontal scroll on mobile, stacked on desktop */}
          <div className="md:w-1/2 lg:w-3/5">
            <div className="-mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] md:mx-0 md:snap-none md:flex-col md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
              <div className="w-[260px] min-w-[260px] shrink-0 snap-center rounded-xl border border-white/15 bg-white/4 p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10 lg:p-12">
                <h3 className="mb-8 font-pp-neue-montreal text-xl leading-tight text-white md:mb-10 md:text-2xl">
                  (01)
                </h3>
                <p className="max-w-lg font-pp-neue-montreal text-base leading-relaxed text-white/80 md:text-lg">
                  From our roots as a Belgian recruitment agency to a trusted
                  consulting partner across 11 countries, Sparagus has evolved
                  to meet the real expertise needs of modern business. We help
                  companies fill critical roles, lead complex projects, and
                  manage full-service delivery — without losing the human touch.
                </p>
              </div>

              <div className="w-[260px] min-w-[260px] shrink-0 snap-center rounded-xl border border-white/15 bg-white/4 p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10 lg:p-12">
                <h3 className="mb-8 font-pp-neue-montreal text-xl leading-tight text-white md:mb-10 md:text-2xl">
                  (02)
                </h3>
                <p className="max-w-lg font-pp-neue-montreal text-base leading-relaxed text-white/80 md:text-lg">
                  With over a decade of experience and 100+ active consultants,
                  our teams combine deep domain knowledge, operational agility,
                  and a commitment to long-term partnerships. At Sparagus,
                  success isn&apos;t about transactions — it&apos;s about
                  impact.
                </p>
              </div>

              <div className="w-[260px] min-w-[260px] shrink-0 snap-center rounded-xl border border-white/15 bg-white/4 p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10 lg:p-12">
                <h3 className="mb-8 font-pp-neue-montreal text-xl leading-tight text-white md:mb-10 md:text-2xl">
                  (03)
                </h3>
                <p className="max-w-lg font-pp-neue-montreal text-base leading-relaxed text-white/80 md:text-lg">
                  We bridge the gap between talent and transformation, helping
                  organizations execute complex initiatives and scale
                  operations—all while preserving the personal touch that makes
                  partnerships meaningful.
                </p>
              </div>

              <div className="w-[260px] min-w-[260px] shrink-0 snap-center rounded-xl border border-white/15 bg-white/4 p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10 lg:p-12">
                <h3 className="mb-8 font-pp-neue-montreal text-xl leading-tight text-white md:mb-10 md:text-2xl">
                  (04)
                </h3>
                <p className="max-w-lg font-pp-neue-montreal text-base leading-relaxed text-white/80 md:text-lg">
                  Our approach goes beyond placements and projects—we build
                  relationships that drive measurable impact and create lasting
                  value for your business.
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
