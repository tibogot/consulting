"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

const steps = [
  {
    phase: "Phase 01",
    title: "Discovery & Definition",
    description:
      "We start by understanding your organization, culture, and the specific requirements for the role. This includes stakeholder interviews, competency mapping, and defining success metrics.",
    duration: "1-2 weeks",
  },
  {
    phase: "Phase 02",
    title: "Market Research & Sourcing",
    description:
      "Leveraging our network and research capabilities, we identify and approach high-caliber candidates. This includes both active job seekers and passive talent.",
    duration: "2-4 weeks",
  },
  {
    phase: "Phase 03",
    title: "Assessment & Evaluation",
    description:
      "Candidates undergo comprehensive evaluation including competency-based interviews, psychometric assessments, and reference checks to ensure alignment.",
    duration: "3-4 weeks",
  },
  {
    phase: "Phase 04",
    title: "Presentation & Selection",
    description:
      "We present a shortlist of exceptional candidates with detailed profiles. Throughout the interview process, we coordinate logistics and provide ongoing support.",
    duration: "2-3 weeks",
  },
  {
    phase: "Phase 05",
    title: "Offer & Onboarding",
    description:
      "We facilitate offer negotiation and support the transition. Our partnership continues with integration coaching to ensure long-term success.",
    duration: "Ongoing",
  },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const line = lineRef.current;
      if (!line) return;

      // Animate the progress line
      gsap.from(line, {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });

      // Animate each step
      const stepElements = gsap.utils.toArray<HTMLElement>("[data-step]");
      stepElements.forEach((step) => {
        gsap.from(step, {
          opacity: 0,
          x: -50,
          scrollTrigger: {
            trigger: step,
            start: "top center+=100",
            end: "top center-=100",
            scrub: 1,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-32 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-24">
          <h2 className="text-5xl md:text-7xl font-normal font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] mb-6">
            Our Process
          </h2>
          <p className="text-xl md:text-2xl text-white/70 font-pp-neue-montreal max-w-3xl">
            A structured approach designed to find the right leader for your organization
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-0 md:left-12 top-0 bottom-0 w-px bg-white/20">
            <div
              ref={lineRef}
              className="absolute top-0 left-0 w-full h-full bg-white origin-top"
            />
          </div>

          <div className="space-y-24 pl-12 md:pl-32">
            {steps.map((step, index) => (
              <div key={index} data-step className="relative">
                {/* Circle marker */}
                <div className="absolute -left-12 md:-left-32 top-0 w-6 h-6 rounded-full border-2 border-white bg-black" />

                <div className="text-sm text-white/40 font-pp-neue-montreal mb-2">
                  {step.phase}
                </div>
                <h3 className="text-3xl md:text-4xl font-normal font-pp-neue-montreal text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-white/70 font-pp-neue-montreal leading-relaxed mb-4 max-w-2xl">
                  {step.description}
                </p>
                <div className="text-sm text-white/50 font-pp-neue-montreal">
                  Timeline: {step.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
