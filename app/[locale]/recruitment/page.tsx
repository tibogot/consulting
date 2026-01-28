import { getTranslations } from "next-intl/server";
import GradientTextReveal from "../../components/GradientTextReveal";
import PartnersTicker from "../../components/PartnersTicker";
import AnimatedText from "../../components/AnimatedText3";
import ShaderBackground from "../../components/ShaderBackground4";
import DotMatrix from "../../components/DotMatrix";
import HorizontalScrollSection from "../../components/HorizontalScrollSection";
import StackingBenefits from "../../components/StackingBenefits";
import ProcessTimeline from "../../components/ProcessTimeline";
import HorizontalServices from "../../components/HorizontalServices";
import CompanyTimeline from "../../components/CompanyTimeline";

export default async function RecruitmentPage() {
  const t = await getTranslations("home");

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative flex h-svh flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Shader Background */}
        <div className="absolute inset-0 -z-10">
          <ShaderBackground />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <AnimatedText
            isHero
            className="text-4xl leading-tight font-light text-white md:text-5xl lg:text-6xl"
          >
            <h1>{t("hero.title")}</h1>
          </AnimatedText>
        </div>
        <div className="absolute bottom-8 left-1/2 mx-auto w-full max-w-lg -translate-x-1/2 transform px-4 text-center">
          <AnimatedText
            isHero
            delay={0.5}
            className="text-sm text-white/80 md:text-base"
          >
            <p>{t("hero.subtitle")}</p>
          </AnimatedText>
        </div>
      </section>

      {/* Partners Ticker Section */}
      <section className="relative w-full bg-black py-4">
        <PartnersTicker
          speed={20}
          direction="left"
          pauseOnHover={false}
          gap={32}
          logoHeight={30}
        />
      </section>

      {/* Second Section */}
      <section className="relative w-full bg-black px-4 py-24 md:px-8">
        <GradientTextReveal
          startColor="rgb(255, 255, 255, 0.3)"
          endColor="rgb(255, 255, 255)"
          className="text-left font-pp-neue-montreal text-5xl font-medium md:text-6xl lg:text-7xl"
        >
          <h2>{t("blackSection.title")}</h2>
        </GradientTextReveal>
        <GradientTextReveal
          startColor="rgb(255, 255, 255, 0.3)"
          endColor="rgb(255, 255, 255)"
          className="mt-8 text-left font-pp-neue-montreal text-5xl md:text-6xl lg:text-7xl"
        >
          <h2>{t("blackSection.title")}</h2>
        </GradientTextReveal>
      </section>

      {/* Horizontal Scroll Section */}
      <HorizontalScrollSection
        heroText="A search process built for clarity, speed, and confident decisions."
        slides={[
          {
            text: "Deep market intelligence and targeted sourcing to surface leaders who can deliver—not just interview well.",
            image: "/slide-1.jpg",
          },
          {
            text: "Rigorous assessment and stakeholder alignment so the shortlist is smaller, sharper, and truly comparable.",
            image: "/slide-2.jpg",
          },
          {
            text: "Confidential, end-to-end coordination—from outreach to offer—designed to protect your brand and candidate experience.",
            image: "/img-3.jpg",
          },
        ]}
        outroText="From first brief to signed offer, we keep momentum high and quality uncompromised."
      />

      {/* Stacking Benefits Cards */}
      <StackingBenefits />

      {/* Process Timeline */}
      <ProcessTimeline />

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

      {/* DotMatrix Section - 100vh */}
      <section className="relative h-screen w-full bg-black">
        <DotMatrix color="#c084fc" opacity={1} dotSize={3} spacing={8} />
      </section>
    </div>
  );
}
