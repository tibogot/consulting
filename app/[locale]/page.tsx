import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
// import { ArrowRight } from "lucide-react";
import PartnersTicker from "../components/PartnersTicker";
import WorkAtSparagusHero from "../components/WorkAtSparagusHero3";
// import PinnedClipPathAnimation from "../components/PinnedClipPathAnimation";
import ServicesHero from "../components/ServicesHero";
// import Cards from "../components/Cards";
// import AnimatedVerticalLines from "../components/AnimatedVerticalLines";
// import ParticleGlobe from "../components/ParticleGlobe";
// import ParticleGlobeWebGPU from "../components/ParticleGlobeWebGPU";
// import StackingCardsPin from "../components/StackingCardsPin";
// import AnimatedCopyLoop from "../components/AnimatedCopyLoop";
// import AnimatedCopy from "../components/AnimatedCopy";
import TextAnim from "../components/TextAnim";
// import WhiteSection from "../components/WhiteSection";
// import LaserBorderCardsRow from "../components/LaserBorderCardsRow";

import AnimatedText from "../components/AnimatedText3";
import AnimatedButton from "../components/AnimatedButton";
// import FractalGradient from "../components/FractalGradient2";
// import PurpleGradient from "../components/PurpleGradient";
import BlogPreview from "../components/BlogPreview";
import CaseStudies from "../components/CaseStudies";
import WhyUsSection from "../components/WhyUsSection";
import HubsSection from "../components/HubsSection";
import LoopingFadeSections from "../components/LoopingFadeSections";

export default async function Home() {
  const t = await getTranslations("careers.workAtSparagus");

  return (
    <div className="min-h-screen w-full bg-black">
      <WorkAtSparagusHero title={t("title")} />

      <PartnersTicker />

      <section className="relative w-full bg-black px-4 pb-20 md:px-8">
        <div className="w-full">
          <div className="mt-12 h-px w-full bg-white/20" />

          <p className="pt-6 font-pp-neue-montreal text-sm text-white md:text-base">
            What We Deliver
          </p>

          <div className="mt-20">
            <AnimatedText>
              <h2 className="max-w-4xl text-left font-pp-neue-montreal text-5xl font-normal text-white md:text-6xl">
                Expertise That Transforms. Partnerships That Last.
              </h2>
            </AnimatedText>
          </div>

          <div className="mt-14 flex flex-col gap-10 md:mt-32 md:flex-row">
            <div className="hidden md:block md:w-1/2">
              {/* <h3 className="text-white text-2xl font-normal font-pp-neue-montreal leading-tight max-w-md">
                How we work
              </h3> */}
            </div>

            <div className="md:w-1/2">
              <div>
                <AnimatedText>
                  <p className="max-w-lg font-pp-neue-montreal text-lg leading-relaxed text-white/80">
                    What started as a Belgian recruitment agency has grown into
                    a trusted consulting partner spanning 11 countries. Today,
                    Sparagus bridges the gap between talent and transformation,
                    helping organizations fill mission-critical roles, execute
                    complex initiatives, and scale operations—all while
                    preserving the personal touch that makes partnerships
                    meaningful.
                  </p>
                </AnimatedText>
                {/* <AnimatedText delay={1.2}>
                  <p className="mt-4 max-w-lg pb-6 font-pp-neue-montreal text-lg leading-relaxed text-white/80">
                    With over a decade of experience and 100+ active
                    consultants, we bring together deep industry expertise,
                    agile execution, and a focus on sustainable outcomes. Our
                    approach goes beyond placements and projects—we build
                    relationships that drive measurable impact and create
                    lasting value for your business.
                  </p>
                </AnimatedText> */}
                <Link
                  href="/services"
                  className="mt-8 inline-flex items-center gap-2 font-pp-neue-montreal text-sm text-white transition-opacity hover:opacity-80 md:text-base"
                >
                  Discover our services <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="mt-32 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="font-pp-neue-montreal text-sm text-white md:text-base">
                  Clarity, fast
                </h3>
                <p className="mt-4 font-pp-neue-montreal text-sm leading-relaxed text-white md:text-base">
                  Sharp research, practical strategy, and decision-ready
                  artifacts—so your team stops debating and starts building.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 font-pp-neue-montreal text-sm text-white transition-opacity hover:opacity-80 md:text-base"
                >
                  See how we work <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="font-pp-neue-montreal text-sm text-white md:text-base">
                  Delivery you can trust
                </h3>
                <p className="mt-4 font-pp-neue-montreal text-sm leading-relaxed text-white md:text-base">
                  Clean execution, predictable cadence, and measurable progress—
                  built with maintainability and long-term ownership in mind.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 font-pp-neue-montreal text-sm text-white transition-opacity hover:opacity-80 md:text-base"
                >
                  View case studies <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <div className="px-4 md:px-8">
        <div className="mb-4 h-px w-full bg-white/20"></div>
        <h3 className="mb-8 font-pp-neue-montreal text-sm text-white md:text-base">
          Services
        </h3>
      </div>

      <ServicesHero />

      <WhyUsSection />

      <HubsSection />

      {/* Sticky trick: one wrapper with pinned 100vh section + rest of page as sibling. Rest scrolls over and covers the pinned section (z-10 + opaque backgrounds). */}
      <div className="relative w-full">
        <div className="sticky top-0 z-0 h-screen w-full">
          <LoopingFadeSections />
        </div>
        <div className="relative z-10 bg-black">
          <section className="relative flex h-screen w-full items-center justify-center border-t bg-white px-4 md:px-8">
            <div className="mx-auto w-full max-w-5xl text-center">
              <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
                <h2 className="font-pp-neue-montreal text-4xl leading-tight font-normal text-black md:text-7xl">
                  The Right Talent. The Right Time. The Right Results{" "}
                </h2>
              </TextAnim>
            </div>
          </section>

          <CaseStudies />

          <BlogPreview />

          {/* Newsletter Section */}
          <section className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden bg-black">
        {/* <FractalGradient zIndex={10} position="absolute" /> */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/maxim-hopman.jpg"
            alt="Background"
            fill
            className="object-cover opacity-80"
            sizes="100vw"
            priority
          />
        </div>

        <div className="relative z-20 flex max-w-3xl flex-col items-center justify-center px-4 text-center">
          <AnimatedText className="mb-6 font-pp-neue-montreal text-4xl font-normal text-white md:mb-8 md:text-6xl">
            <h2>Stay Updated</h2>
          </AnimatedText>
          <AnimatedText
            delay={0.2}
            className="mb-8 max-w-2xl font-pp-neue-montreal text-base text-white md:mb-10 md:text-lg"
          >
            <p>
              Subscribe to our newsletter to stay informed about the latest
              insights, innovations, and opportunities in technology and
              business.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.4}>
            <form className="flex w-full max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 border border-white/20 bg-white/10 px-6 py-3 font-pp-neue-montreal text-white backdrop-blur-sm transition-colors placeholder:text-white/60 focus:border-[#8202FF] focus:outline-none"
              />
              <button
                type="submit"
                className="cursor-pointer bg-[#8202FF] px-8 py-3 font-pp-neue-montreal whitespace-nowrap text-white transition-colors hover:bg-[#6a02cc]"
              >
                Subscribe
              </button>
            </form>
          </AnimatedButton>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}
