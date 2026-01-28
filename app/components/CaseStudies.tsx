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
    <section className="relative w-full bg-black py-12 md:py-16 px-4 md:px-8">
      <div className="mb-16 md:mb-24">
        <div className="w-full h-px bg-white"></div>
        <h3 className="mt-2 text-sm md:text-base text-white font-pp-neue-montreal">{subtitle || "Case Studies"}</h3>
      </div>
      <div className="">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-normal text-white font-pp-neue-montreal max-w-sm">
            {title}
          </h2>
          <Link
            href={(viewAllHref || defaultViewAllHref) as "/case-studies"}
            className="text-white/80 hover:text-white font-pp-neue-montreal text-sm md:text-base transition-colors inline-flex items-center gap-2"
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
              className="group flex flex-col md:flex-row items-center gap-4 md:gap-8 py-4 md:py-8"
            >
              {/* Column 1: Image */}
              <div className="shrink-0 w-full md:max-w-96">
                <div className="relative w-full aspect-video overflow-hidden rounded-sm">
                  <Image
                    src={caseStudy.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 384px, 100vw"
                  />
                  {/* Date Overlay */}
                  <div className="absolute top-3 left-3 bg-[#8202FF] px-3 py-1.5 rounded-[3px]">
                    <time
                      dateTime={caseStudy.date}
                      className="text-white font-pp-neue-montreal text-xs md:text-sm font-medium"
                    >
                      {caseStudy.date}
                    </time>
                  </div>
                </div>
              </div>

              {/* Column 2: Title and Description */}
              <div className="flex-1 flex flex-col justify-center md:ml-8">
                <h3 className="text-xl md:text-2xl font-normal text-white font-pp-neue-montreal leading-tight mb-2 md:mb-3 max-w-sm">
                  {caseStudy.title}
                </h3>
                <p className="text-white/70 font-pp-neue-montreal text-sm md:text-base leading-relaxed max-w-sm">
                  {caseStudy.description}
                </p>
              </div>

              {/* Column 3: Read More CTA */}
              <div className="shrink-0 self-end">
                <span className="inline-flex items-center gap-1 text-white/80 text-sm font-pp-neue-montreal opacity-100 md:opacity-0 translate-y-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                  Read more <span aria-hidden>→</span>
                </span>
              </div>
            </Link>

            {/* Divider between items (except last) */}
            {index < caseStudies.length - 1 && (
              <div className="w-full h-px bg-white/20"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
