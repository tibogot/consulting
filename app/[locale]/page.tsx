import { getTranslations } from "next-intl/server";
import Link from "next/link";
import AnimatedText from "../components/AnimatedText3";
import PartnersTicker from "../components/PartnersTicker";
import AnimatedButton from "../components/AnimatedButton";
import FractalGradient from "../components/FractalGradient2";
import WorkAtSparagusHero from "../components/WorkAtSparagusHero";
import AnimatedCopy from "../components/AnimatedCopy";
import PinnedClipPathAnimation from "../components/PinnedClipPathAnimation";
import NeoCultureMouseMove from "../components/NeoCultureMouseMove";

export default async function Home() {
  const t = await getTranslations("careers.workAtSparagus");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <WorkAtSparagusHero title={t("title")} />

      <PartnersTicker />

      {/* Combined Section - AnimatedCopy */}
      <section className="relative w-full min-h-screen bg-black py-20 px-4 md:px-8">
        <div className="text-3xl md:text-3xl leading-tight font-normal text-left font-pp-neue-montreal max-w-2xl">
          <AnimatedCopy
            colorInitial="#333333"
            colorAccent="#8202FF"
            colorFinal="#ffffff"
          >
            <h2>
              <span className="opacity-0 select-none pointer-events-none">
                Invisible text{" "}
              </span>
              From AI startups to global tech leaders, we help turn complexity
              into clarity, making revolutionary ideas feel inevitable.
            </h2>
            <p className="text-lg md:text-xl mt-6 opacity-80">
              Millions of visits or millions raised, our work is built for
              impact. We transform complex challenges into clear, actionable
              solutions that drive real results.
            </p>
          </AnimatedCopy>
          <div className="mt-8">
            <AnimatedButton delay={0.2}>
              <Link
                href="/contact"
                className="inline-block px-6 py-2 bg-[#8202FF] text-white text-sm font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors rounded cursor-pointer"
              >
                Get in Touch
              </Link>
            </AnimatedButton>
          </div>
        </div>
        <div className="text-7xl font-normal text-right font-pp-neue-montreal max-w-7xl leading-tight mt-20 ml-auto">
          <AnimatedCopy
            colorInitial="#333333"
            colorAccent="#8202FF"
            colorFinal="#ffffff"
          >
            <h2>
              <span className="opacity-0 select-none pointer-events-none">
                Invisible text{" "}
              </span>
              From AI startups to global tech leaders, we help turn complexity
              into clarity, making revolutionary ideas feel inevitable.
            </h2>
          </AnimatedCopy>
        </div>
      </section>

      {/* Pinned Clip Path Animation Section */}
      <PinnedClipPathAnimation
        image1="/img-1.jpg"
        image2="/img-2.jpg"
        image3="/img-3.jpg"
        alt1="First section image"
        alt2="Second section image"
        alt3="Third section image"
        content1={
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-medium mb-4">
              Innovation
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              Transforming ideas into reality
            </p>
          </div>
        }
        content2={
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-medium mb-4">
              Excellence
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              Delivering world-class solutions
            </p>
          </div>
        }
        content3={
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-medium mb-4">Impact</h2>
            <p className="text-xl md:text-2xl opacity-90">
              Building the future together
            </p>
          </div>
        }
      />

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

      {/* Newsletter Section */}
      <section className="relative w-full h-[80vh] bg-black overflow-hidden flex items-center justify-center">
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
      </section>

      {/* NeoCulture Mouse Move Section */}
      <section className="relative w-full h-svh bg-black">
        <NeoCultureMouseMove
          gradientColors={{
            initial: "#8202FF",
            accent: "#FF02FF",
            final: "#FF02FF",
          }}
        />
      </section>
    </div>
  );
}
