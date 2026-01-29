"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";

export type CaseStudy = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  slug: string;
};

const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "1",
    title: "Company, offering integrated.",
    description:
      "By combining technical expertise with a deep appreciation for design principles, we deliver solutions that preserve your creative intent.",
    date: "1.27.2026",
    image: "/images/cards/zac-wolff.jpg",
    slug: "/case-studies/company-integrated",
  },
  {
    id: "2",
    title: "Transforming digital experiences.",
    description:
      "We partner with forward-thinking organizations to navigate complex business challenges and unlock transformative growth opportunities.",
    date: "1.20.2026",
    image: "/images/cards/charlesdeluvio.jpg",
    slug: "/case-studies/digital-transformation",
  },
  {
    id: "3",
    title: "Strategic innovation at scale.",
    description:
      "Our data-driven approach combines deep industry expertise with innovative strategies to deliver measurable results that drive sustainable success.",
    date: "1.15.2026",
    image: "/images/cards/clay.jpg",
    slug: "/case-studies/strategic-innovation",
  },
  {
    id: "4",
    title: "Building future-ready solutions.",
    description:
      "We create scalable architectures and modern workflows that adapt to changing business needs while maintaining performance and reliability.",
    date: "1.10.2026",
    image: "/images/cards/malte.jpg",
    slug: "/case-studies/future-ready-solutions",
  },
];

interface CaseStudiesProps {
  caseStudies?: CaseStudy[];
  subtitle?: string;
  title?: string;
  viewAllHref?: string;
  viewAllText?: string;
}

export default function CaseStudies({
  caseStudies = MOCK_CASE_STUDIES,
  subtitle = "We’re building the future of digital experiences.",
  title = "Case Studies",
  viewAllHref = "/case-studies",
  viewAllText = "View all case studies",
}: CaseStudiesProps) {
  const caseStudiesRoute = "/case-studies" as const;
  const defaultViewAllHref = "/case-studies" as const;

  return (
    <section className="relative w-full bg-black px-4 py-12 md:px-8 md:py-16">
      <div className="mb-16 md:mb-24">
        <div className="h-px w-full bg-white"></div>
        <h3 className="mt-2 font-pp-neue-montreal text-sm text-white md:text-base">
          {subtitle || "Case Studies"}
        </h3>
      </div>
      <div className="">
        <div className="mb-10 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-sm font-pp-neue-montreal text-4xl font-normal text-white md:text-6xl">
            {title}
          </h2>
          <Link
            href={(viewAllHref || defaultViewAllHref) as "/case-studies"}
            className="inline-flex items-center gap-2 font-pp-neue-montreal text-sm text-white/80 transition-colors hover:text-white md:text-base"
          >
            {viewAllText} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Case Studies List */}
      <div className="space-y-0">
        {caseStudies.map((caseStudy, index) => (
          <div key={caseStudy.id}>
            {/* Case Study Item */}
            <Link
              href={caseStudiesRoute}
              className="group flex w-full flex-col items-center gap-12 py-4 md:flex-row md:items-center md:py-8"
            >
              {/* Column 1: Image - Left aligned */}
              <div className="w-full flex-1">
                <div className="relative aspect-video w-full max-w-96 overflow-hidden rounded-sm">
                  <Image
                    src={caseStudy.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                  {/* Date Overlay */}
                  <div className="absolute top-3 left-3 rounded-[3px] bg-[#8202FF] px-3 py-1.5">
                    <time
                      dateTime={caseStudy.date}
                      className="font-pp-neue-montreal text-xs font-medium text-white md:text-sm"
                    >
                      {caseStudy.date}
                    </time>
                  </div>
                </div>
              </div>

              {/* Column 2: Title and Description */}
              <div className="flex flex-1 flex-col justify-center">
                <h3 className="mb-2 max-w-sm font-pp-neue-montreal text-xl leading-tight font-normal text-white md:mb-3 md:text-2xl">
                  {caseStudy.title}
                </h3>
                <p className="max-w-sm font-pp-neue-montreal text-sm leading-relaxed text-white/70 md:text-base">
                  {caseStudy.description}
                </p>
              </div>

              {/* Column 3: Read More CTA - Right aligned */}
              <div className="flex flex-1 items-center justify-end">
                <span className="inline-flex translate-y-0 items-center gap-1 font-pp-neue-montreal text-sm text-white/80 opacity-100 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-2 md:opacity-0">
                  Read more <span aria-hidden>→</span>
                </span>
              </div>
            </Link>

            {/* Divider between items (except last) */}
            {index < caseStudies.length - 1 && (
              <div className="h-px w-full bg-white/20"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
