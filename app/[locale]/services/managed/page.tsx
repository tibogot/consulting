"use client";

import Link from "next/link";
import HorizontalServices from "@/app/components/HorizontalServices";
import CompanyTimeline from "@/app/components/CompanyTimeline";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";
import PinnedClipPathAnimation from "@/app/components/PinnedClipPathAnimation";
import StackingCardsPin from "@/app/components/StackingCardsPin";

export default function ManagedServicesPage() {
  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section */}
      <ManagedServicesHero
        title="Managed Services"
        description="End-to-end operations management. From infrastructure to delivery, we handle the complexity so your team can focus on what matters."
      />

      {/* Overview Section */}
      <section
        id="overview"
        className="relative w-full bg-black px-4 py-24 md:px-8"
      >
        <div className="">
          <div className="flex flex-col gap-12 md:flex-row">
            <div className="md:w-1/2">
              <p className="font-pp-neue-montreal text-xs tracking-wide text-white/60 uppercase md:text-sm">
                What we do
              </p>
              <h2 className="mt-4 font-pp-neue-montreal text-4xl leading-tight font-normal text-white md:text-5xl lg:text-6xl">
                Reliable operations, predictable outcomes
              </h2>
            </div>
            <div className="space-y-6 md:w-1/2">
              <p className="font-pp-neue-montreal text-base leading-relaxed text-white/80 md:text-lg">
                We take ownership of your critical systems and
                processes—monitoring, maintaining, and optimizing around the
                clock. Whether it&apos;s infrastructure, applications, or entire
                platforms, we ensure everything runs smoothly, securely, and at
                scale.
              </p>
              <p className="font-pp-neue-montreal text-base leading-relaxed text-white/80 md:text-lg">
                Our managed services combine deep technical expertise with
                proactive monitoring, automated workflows, and 24/7 support. You
                get peace of mind, predictable costs, and the freedom to focus
                on growth instead of operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <HorizontalServices />

      {/* Stats Section */}
      <section className="relative w-full bg-black px-4 py-24 md:px-8">
        <div className="">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <div className="mb-6 h-px w-full bg-white/20" />
              <div className="font-pp-neue-montreal text-6xl font-normal text-white md:text-7xl">
                99.9%
              </div>
              <p className="mt-4 font-pp-neue-montreal text-base text-white/70 md:text-lg">
                Uptime guarantee across all managed services
              </p>
            </div>
            <div>
              <div className="mb-6 h-px w-full bg-white/20" />
              <div className="font-pp-neue-montreal text-6xl font-normal text-white md:text-7xl">
                &lt;15min
              </div>
              <p className="mt-4 font-pp-neue-montreal text-base text-white/70 md:text-lg">
                Average incident response time, 24/7/365
              </p>
            </div>
            <div>
              <div className="mb-6 h-px w-full bg-white/20" />
              <div className="font-pp-neue-montreal text-6xl font-normal text-white md:text-7xl">
                40%
              </div>
              <p className="mt-4 font-pp-neue-montreal text-base text-white/70 md:text-lg">
                Reduction in operational costs on average
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="relative w-full bg-black px-4 py-24 md:px-8">
        <div className="">
          <h2 className="mb-16 font-pp-neue-montreal text-4xl leading-tight font-normal text-white md:text-5xl lg:text-6xl">
            How we work
          </h2>

          <div className="space-y-12">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="md:w-1/4">
                <div className="font-pp-neue-montreal text-sm text-white/40">
                  01
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="mb-4 font-pp-neue-montreal text-2xl font-normal text-white md:text-3xl">
                  Discovery & Assessment
                </h3>
                <p className="font-pp-neue-montreal text-base leading-relaxed text-white/75 md:text-lg">
                  We start by understanding your current infrastructure,
                  applications, and operational challenges. We identify gaps,
                  risks, and opportunities for optimization.
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="md:w-1/4">
                <div className="font-pp-neue-montreal text-sm text-white/40">
                  02
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="mb-4 font-pp-neue-montreal text-2xl font-normal text-white md:text-3xl">
                  Onboarding & Migration
                </h3>
                <p className="font-pp-neue-montreal text-base leading-relaxed text-white/75 md:text-lg">
                  We transition your systems to our management with zero
                  downtime. Documentation, monitoring setup, access controls,
                  and runbooks are established for seamless handover.
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="md:w-1/4">
                <div className="font-pp-neue-montreal text-sm text-white/40">
                  03
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="mb-4 font-pp-neue-montreal text-2xl font-normal text-white md:text-3xl">
                  Ongoing Operations
                </h3>
                <p className="font-pp-neue-montreal text-base leading-relaxed text-white/75 md:text-lg">
                  24/7 monitoring, proactive maintenance, regular optimization,
                  and continuous improvement. We handle incidents, deploy
                  updates, and keep you informed with transparent reporting.
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="md:w-1/4">
                <div className="font-pp-neue-montreal text-sm text-white/40">
                  04
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="mb-4 font-pp-neue-montreal text-2xl font-normal text-white md:text-3xl">
                  Strategic Growth
                </h3>
                <p className="font-pp-neue-montreal text-base leading-relaxed text-white/75 md:text-lg">
                  As your business evolves, we scale with you. Architecture
                  reviews, capacity planning, and technology recommendations
                  ensure your infrastructure supports your long-term goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline Section */}
      <CompanyTimeline />

      {/* CTA Section */}
      <section
        id="contact"
        className="relative w-full border-t border-white/10 bg-black px-4 py-32 md:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-pp-neue-montreal text-5xl leading-tight font-normal text-white md:text-6xl lg:text-7xl">
            Ready to simplify your operations?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-pp-neue-montreal text-lg text-white/75 md:text-xl">
            Let&apos;s discuss how managed services can help you focus on growth
            while we handle the complexity.
          </p>
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white px-10 py-5 font-pp-neue-montreal text-base text-black transition-colors hover:bg-white/90 md:text-lg"
            >
              Schedule a consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center border border-white px-10 py-5 font-pp-neue-montreal text-base text-white transition-colors hover:bg-white/10 md:text-lg"
            >
              View all services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
