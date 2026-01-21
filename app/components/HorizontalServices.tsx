"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

type ServicePanel = {
  title: string;
  body: string;
  tags: string[];
  isAltBg?: boolean;
};

const PANELS: ServicePanel[] = [
  {
    title: "Infrastructure Management",
    body: "Cloud architecture, server management, database optimization, and network security. We handle provisioning, scaling, backups, and disaster recovery—so your infrastructure is always available, performant, and cost-effective.",
    tags: ["AWS / Azure / GCP", "Kubernetes", "Terraform"],
  },
  {
    title: "Application Support",
    body: "Continuous monitoring, performance tuning, security patching, and incident response. We proactively identify issues before they impact users, and resolve them fast when they do.",
    tags: ["24/7 Monitoring", "SLA Guarantees", "Incident Response"],
    isAltBg: true,
  },
  {
    title: "DevOps & Automation",
    body: "CI/CD pipelines, automated testing, deployment orchestration, and infrastructure as code. We streamline your delivery process and eliminate manual bottlenecks.",
    tags: ["GitHub Actions", "Jenkins", "ArgoCD"],
  },
  {
    title: "Security & Compliance",
    body: "Threat monitoring, vulnerability management, access controls, and compliance audits. We ensure your systems meet industry standards and protect against emerging threats.",
    tags: ["SOC 2", "ISO 27001", "GDPR"],
    isAltBg: true,
  },
];

export default function HorizontalServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const getScrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const st = tween.scrollTrigger as ScrollTrigger | undefined;

      // Cleanup function - explicitly kill tween + ScrollTrigger
      return () => {
        st?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={trackRef} className="flex h-full">
        {PANELS.map((panel) => (
          <div
            key={panel.title}
            className={`shrink-0 w-screen h-full flex items-center justify-center px-8 md:px-16 ${
              panel.isAltBg ? "bg-zinc-950" : ""
            }`}
          >
            <div className="max-w-2xl">
              <div className="h-px w-20 bg-white/40 mb-6" />
              <h3 className="text-4xl md:text-5xl font-normal text-white font-pp-neue-montreal leading-tight">
                {panel.title}
              </h3>
              <p className="mt-6 text-white/75 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                {panel.body}
              </p>
              <div className="mt-8 flex gap-4 flex-wrap">
                {panel.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-sm font-pp-neue-montreal"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

