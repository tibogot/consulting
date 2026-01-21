import { getTranslations } from "next-intl/server";
import Link from "next/link";
import PartnersTicker from "../components/PartnersTicker";
import WorkAtSparagusHero from "../components/WorkAtSparagusHero";
import PinnedClipPathAnimation from "../components/PinnedClipPathAnimation";
import Cards from "../components/Cards";
import AnimatedVerticalLines from "../components/AnimatedVerticalLines";
import ParticleGlobe from "../components/ParticleGlobe";
import StackingCardsPin from "../components/StackingCardsPin";
import AnimatedCopyLoop from "../components/AnimatedCopyLoop";
import AnimatedCopy from "../components/AnimatedCopy";
// import WhiteSection from "../components/WhiteSection";


import AnimatedText from "../components/AnimatedText3";
import AnimatedButton from "../components/AnimatedButton";
import FractalGradient from "../components/FractalGradient2";


export default async function Home() {
  const t = await getTranslations("careers.workAtSparagus");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <WorkAtSparagusHero title={t("title")} />

      <PartnersTicker />

      <section className="relative w-full bg-black pt-20 pb-40 px-4 md:px-8">
      <AnimatedCopy colorInitial="#666666" colorAccent="#8202FF" colorFinal="#ffffff">          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-left font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] max-w-4xl">
      Trusted by teams who move fast and build for impact.
        </h2>
        </AnimatedCopy>
      </section>



      {/* Combined Section - AnimatedCopy */}
      {/* <section className="relative w-full  bg-black py-10 px-4 md:px-8">
        <div className="w-full h-px bg-white mb-4"></div>
        <div className="text-3xl md:text-4xl leading-tight font-normal text-left font-pp-neue-montreal max-w-2xl">
          <AnimatedCopy colorInitial="#444444" colorAccent="#ffffff" colorFinal="#ffffff">
            <p className="text-lg md:text-lg mb-10 ">
              Strategic consulting expertise
            </p>
            <h2>
              <span className="opacity-0 select-none pointer-events-none">
                Invisible text
              </span>
              We partner with forward-thinking organizations to navigate
              complex business challenges and unlock transformative growth opportunities.
            </h2>
            <p className="text-lg md:text-lg mt-6 opacity-80 max-w-lg">
              Our data-driven approach combines deep industry expertise with innovative
              strategies to deliver measurable results that drive sustainable success.
            </p>
          </AnimatedCopy>
          
        </div>



        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-16">
          <div className="flex-1 md:flex-2">
            <div className="w-full h-px bg-white mb-4"></div>
            <h3 className="text-lg md:text-lg mb-4 font-pp-neue-montreal text-white">
              Industry expertise
            </h3>
            <p className="text-base md:text-lg text-white/80 font-pp-neue-montreal">
              With years of experience across diverse sectors, we bring deep
              industry knowledge and proven methodologies to every engagement. Our consultants
              understand the unique challenges you face and deliver tailored solutions
              that align with your strategic objectives and market dynamics.
            </p>
          </div>
          
          <div className="flex-1">
            <div className="w-full h-px bg-white mb-4"></div>
            <h3 className="text-lg md:text-lg mb-4 font-pp-neue-montreal text-white">
              Our methodology
            </h3>
            <p className="text-base md:text-lg text-white/80 font-pp-neue-montreal">
              We combine rigorous analysis with collaborative problem-solving to
              identify opportunities, mitigate risks, and create actionable roadmaps
              for sustainable growth.
            </p>
          </div>
        </div>
        <div className="md:text-7xl text-4xl font-normal text-right font-pp-neue-montreal max-w-7xl leading-tight mt-20 ml-auto">
          <AnimatedCopy
            colorInitial="#333333"
            colorAccent="#8B5FFB"
            colorFinal="#000000"
          >
            <h2>
              <span className="opacity-0 select-none pointer-events-none">
                Invisible text
              </span>
              From startups to global enterprises, we help turn complexity
              into clarity, making strategic transformation feel achievable.
            </h2>
          </AnimatedCopy>
        </div>
      </section> */}


      <Cards />

      <section className="relative w-full bg-black py-20 px-4 md:px-8">
        <div className="w-full">
        <AnimatedCopy colorInitial="#666666" colorAccent="#8202FF" colorFinal="#ffffff">          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-left font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] max-w-4xl">
            Strategy that ships. Systems that scale. Results you can measure.
          </h2>
          </AnimatedCopy>

          <div className="mt-12 h-px w-full bg-white/20" />

          <p className="pt-6 text-white text-sm md:text-base font-pp-neue-montreal">
            Built for modern teams
          </p>

          <div className="mt-14 md:mt-32 flex flex-col md:flex-row gap-10">
            <div className="hidden md:block md:w-1/2">
              <h3 className="text-white text-2xl font-normal font-pp-neue-montreal leading-tight max-w-md">
                How we work
              </h3>
            </div>

            <div className="md:w-1/2">
              <div>
                <p className="text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal max-w-lg pb-6 border-b border-white/20">
                  We partner with your team to define the real problem, agree on
                  success metrics, and shape an executable plan—scope,
                  constraints, owners, milestones, and trade-offs.
                </p>
                <p className="mt-6 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal max-w-lg pb-6 border-b border-white/20">
                  From discovery to delivery, we turn ambiguity into clear
                  priorities and momentum. We validate assumptions with users
                  and data, and design within your stack, timelines, and team.
                </p>
                <p className="mt-6 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal max-w-lg pb-6 border-b border-white/20">
                  You get practical artifacts your team can use: a measurable
                  roadmap, clear requirements, and a build plan that reduces
                  surprises and supports long-term ownership.
                </p>

                <Link
                  href="/services"
                  className="mt-8 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  Explore services <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="text-white text-sm md:text-base font-pp-neue-montreal">
                  Clarity, fast
                </h3>
                <p className="mt-4 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal">
                  Sharp research, practical strategy, and decision-ready
                  artifacts—so your team stops debating and starts building.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  See how we work <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="text-white text-sm md:text-base font-pp-neue-montreal">
                  Delivery you can trust
                </h3>
                <p className="mt-4 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal">
                  Clean execution, predictable cadence, and measurable progress—
                  built with maintainability and long-term ownership in mind.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  View case studies <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* White Section */}
      {/* <WhiteSection /> */}

      {/* Laser Border Cards Section */}
      {/* <section className="relative w-full bg-black py-20 px-4 md:px-8">
        <LaserBorderCardsRow
          cards={[
            {
              title: "Maximum, automated throughput",
              description: "Terminal delivers maximum data accuracy and optimal throughput to keep your operations humming and material moving.",
              statValue: "50%",
              statLabel: "data accuracy",
              animationDuration: 4,
            },
            {
              title: "Always Available",
              description: "Enterprise-grade reliability for mission-critical operations.",
              statValue: "99.9%",
              statLabel: "uptime guaranteed",
              animationDuration: 4,
            },
            {
              title: "Dual Processing",
              description: "Parallel pipelines for maximum efficiency.",
              statValue: "2x",
              statLabel: "faster processing",
              animationDuration: 4,
            },
          ]}
          className="py-10"
        />
      </section> */}

      {/* Pinned Clip Path Animation Section */}
      <PinnedClipPathAnimation />

      {/* Animated Vertical Lines Section */}
      {/* <AnimatedVerticalLines
        title="Transform Your Business with Strategic Innovation and Data-Driven Solutions"
        description="Forward-thinking organizations."
        lineHeight={300}
        animationDuration={3}
        primaryColor="#ff2dff"
      /> */}

      {/* Fourth Section - White Background with Grey to Purple Gradient */}
      {/* <section className="relative w-full min-h-screen bg-white py-20 px-4 md:px-8">
        <GradientTextReveal
          startColor="rgb(156, 163, 175)"
          endColor="rgb(130, 2, 255)"
          className="text-5xl md:text-6xl font-medium text-left font-pp-neue-montreal "
        >
          <h2>
            <span className="opacity-0 select-none pointer-events-none">
              Invisible text{" "}
            </span>
            From AI startups to global tech leaders, we help turn complexity
            into clarity, making revolutionary ideas feel inevitable. Millions
            of visits or millions raised, our work is built for impact.
          </h2>
        </GradientTextReveal>
      </section> */}

      {/* Partners Ticker Section */}
      {/* <section className="relative w-full bg-black py-4">
        <PartnersTicker
          speed={20}
          direction="left"
          pauseOnHover={false}
          gap={32}
          logoHeight={30}
        />
      </section> */}

      {/* StickyCards3D2 Section */}
      {/* <section className="relative w-full bg-black">
        <StickyCards3D2 />
      </section> */}


      {/* NeoCulture Mouse Move Section */}
      {/* <section className="relative w-full h-svh bg-black">
        <NeoCultureMouseMove
          gradientColors={{
            initial: "#8202FF",
            accent: "#FF02FF",
            final: "#FF02FF",
          }}
        />
      </section> */}

      {/* Particle Globe Section */}
      {/* <section className="relative w-full h-svh">
        <ParticleGlobe className="w-full h-full" />
      </section> */}

      {/* Holographic Globe Section */}
      {/* <section className="relative w-full h-[100svh]">
        <HolographicGlobe className="w-full h-full" />
      </section> */}

      {/* Stacking Cards Pin Section */}
      <StackingCardsPin />

      {/* Blue Section (same layout as About/Us) */}
      <section className="relative w-full h-svh bg-primary text-white">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 h-full flex items-center">
          <div className="font-pp-neue-montreal max-w-3xl">
            <p className="text-white/70 uppercase tracking-wide text-xs md:text-sm">
              Next
            </p>
            <h2 className="mt-3 text-4xl md:text-6xl font-normal leading-tight">
              A partner that ships
            </h2>
            <p className="mt-5 text-white/85 text-base md:text-lg leading-relaxed">
              From discovery to delivery, we work side-by-side with your team to turn
              ambiguity into clear priorities and real momentum.
            </p>
            <p className="mt-4 text-white/75 text-base md:text-lg leading-relaxed">
              The goal is simple: move faster with confidence—without sacrificing quality,
              maintainability, or long-term ownership.
            </p>
          </div>
        </div>
      </section>
            {/* Newsletter Section */}
      {/* <section className="relative w-full h-[80vh] bg-black overflow-hidden flex items-center justify-center">
        <FractalGradient zIndex={10} position="absolute" />
        <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-3xl px-4 ">
          <AnimatedText className="text-4xl md:text-6xl  font-normal text-white mb-6 md:mb-8 font-pp-neue-montreal">
            <h2>Stay Updated</h2>
          </AnimatedText>
          <AnimatedText
            delay={0.2}
            className="text-base md:text-lg text-white font-pp-neue-montreal mb-8 md:mb-10 max-w-2xl"
          >
            <p>
              Subscribe to our newsletter to stay informed about the latest
              insights, innovations, and opportunities in technology and
              business.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.4}>
            <form className="w-full max-w-md flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 font-pp-neue-montreal focus:outline-none focus:border-[#8202FF] transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-[#8202FF] cursor-pointer text-white font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </AnimatedButton>
        </div>
      </section> */}


      {/* Closing Loop Section */}
      {/* <section className="relative w-full h-[80vh] bg-black border-t border-white/10 flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto text-center">
        <AnimatedCopyLoop
          colorInitial="#777777"
          colorAccent="#8202FF"
          colorFinal="#ffffff"
          staggerEach={0.008}
          // durationToAccent={0.25}
          // durationToFinal={0.2}
          // durationToInitial={0.25}
          // repeatDelay={0.3}
>
            <h2 className="font-pp-neue-montreal font-normal text-[#777777] text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.02em]">
              Ready to build something that moves fast, scales clean, and feels
              inevitable?
            </h2>
          </AnimatedCopyLoop>
        </div>
      </section> */}
    </div>
  );
}
