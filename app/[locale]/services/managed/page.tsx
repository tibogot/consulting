"use client";

import Link from "next/link";
import HorizontalServices from "@/app/components/HorizontalServices";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";
import PinnedClipPathAnimation from "@/app/components/PinnedClipPathAnimation";
import StackingCardsPin from "@/app/components/StackingCardsPin";

export default function ManagedServicesPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <ManagedServicesHero
        title="Managed Services"
        description="End-to-end operations management. From infrastructure to delivery, we handle the complexity so your team can focus on what matters."
      />

      {/* Overview Section */}
      <section id="overview" className="relative w-full bg-black py-24 px-4 md:px-8">
        <div className="">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <p className="text-white/60 uppercase tracking-wide text-xs md:text-sm font-pp-neue-montreal">
                What we do
              </p>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-normal text-white font-pp-neue-montreal leading-tight">
                Reliable operations, predictable outcomes
              </h2>
            </div>
            <div className="md:w-1/2 space-y-6">
              <p className="text-white/80 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                We take ownership of your critical systems and processes—monitoring,
                maintaining, and optimizing around the clock. Whether it&apos;s
                infrastructure, applications, or entire platforms, we ensure
                everything runs smoothly, securely, and at scale.
              </p>
              <p className="text-white/80 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                Our managed services combine deep technical expertise with proactive
                monitoring, automated workflows, and 24/7 support. You get peace of
                mind, predictable costs, and the freedom to focus on growth instead
                of operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <HorizontalServices />

      {/* Stats Section */}
      <section className="relative w-full bg-black py-24 px-4 md:px-8">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="h-px w-full bg-white/20 mb-6" />
              <div className="text-6xl md:text-7xl font-normal text-white font-pp-neue-montreal">
                99.9%
              </div>
              <p className="mt-4 text-white/70 text-base md:text-lg font-pp-neue-montreal">
                Uptime guarantee across all managed services
              </p>
            </div>
            <div>
              <div className="h-px w-full bg-white/20 mb-6" />
              <div className="text-6xl md:text-7xl font-normal text-white font-pp-neue-montreal">
                &lt;15min
              </div>
              <p className="mt-4 text-white/70 text-base md:text-lg font-pp-neue-montreal">
                Average incident response time, 24/7/365
              </p>
            </div>
            <div>
              <div className="h-px w-full bg-white/20 mb-6" />
              <div className="text-6xl md:text-7xl font-normal text-white font-pp-neue-montreal">
                40%
              </div>
              <p className="mt-4 text-white/70 text-base md:text-lg font-pp-neue-montreal">
                Reduction in operational costs on average
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Clip Path Animation */}
      <PinnedClipPathAnimation />

      {/* How We Work Section */}
      <section className="relative w-full bg-black py-24 px-4 md:px-8">
        <div className="">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white font-pp-neue-montreal leading-tight mb-16">
            How we work
          </h2>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4">
                <div className="text-white/40 text-sm font-pp-neue-montreal">01</div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl md:text-3xl font-normal text-white font-pp-neue-montreal mb-4">
                  Discovery & Assessment
                </h3>
                <p className="text-white/75 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                  We start by understanding your current infrastructure, applications,
                  and operational challenges. We identify gaps, risks, and
                  opportunities for optimization.
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4">
                <div className="text-white/40 text-sm font-pp-neue-montreal">02</div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl md:text-3xl font-normal text-white font-pp-neue-montreal mb-4">
                  Onboarding & Migration
                </h3>
                <p className="text-white/75 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                  We transition your systems to our management with zero downtime.
                  Documentation, monitoring setup, access controls, and runbooks are
                  established for seamless handover.
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4">
                <div className="text-white/40 text-sm font-pp-neue-montreal">03</div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl md:text-3xl font-normal text-white font-pp-neue-montreal mb-4">
                  Ongoing Operations
                </h3>
                <p className="text-white/75 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                  24/7 monitoring, proactive maintenance, regular optimization, and
                  continuous improvement. We handle incidents, deploy updates, and
                  keep you informed with transparent reporting.
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4">
                <div className="text-white/40 text-sm font-pp-neue-montreal">04</div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl md:text-3xl font-normal text-white font-pp-neue-montreal mb-4">
                  Strategic Growth
                </h3>
                <p className="text-white/75 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                  As your business evolves, we scale with you. Architecture reviews,
                  capacity planning, and technology recommendations ensure your
                  infrastructure supports your long-term goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stacking Cards Pin */}
      <StackingCardsPin />

      {/* CTA Section */}
      <section
        id="contact"
        className="relative w-full bg-black py-32 px-4 md:px-8 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white font-pp-neue-montreal leading-tight">
            Ready to simplify your operations?
          </h2>
          <p className="mt-8 text-white/75 text-lg md:text-xl font-pp-neue-montreal max-w-2xl mx-auto">
            Let&apos;s discuss how managed services can help you focus on growth while
            we handle the complexity.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-black font-pp-neue-montreal text-base md:text-lg hover:bg-white/90 transition-colors"
            >
              Schedule a consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-10 py-5 border border-white text-white font-pp-neue-montreal text-base md:text-lg hover:bg-white/10 transition-colors"
            >
              View all services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
