import { getTranslations } from "next-intl/server";
import AnimatedText from "../../../components/AnimatedText3";
import GradientTextReveal from "../../../components/GradientTextReveal";
import PartnersTicker from "../../../components/PartnersTicker";
import AnimatedButton from "../../../components/AnimatedButton";
import FractalGradient from "../../../components/FractalGradient2";

export default async function WorkAtSparagusPage() {
  const t = await getTranslations("careers.workAtSparagus");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-svh flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videohero.mp4" type="video/mp4" />
        </video>
        {/* Background Image (commented out) */}
        {/* <div className="absolute inset-0 bg-[url(/mike-kononov.jpg)] bg-cover bg-center bg-no-repeat z-0" /> */}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Content Overlay - Bottom positioned */}
        <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 md:pb-12 lg:pb-16 mt-auto">
          {/* Left side - Title and Description */}
          <div className="max-w-3xl">
            <AnimatedText
              isHero
              className="text-4xl md:text-7xl font-normal  text-white mb-4 md:mb-6 font-pp-neue-montreal text-left"
            >
              <h1>{t("title")}</h1>
            </AnimatedText>
            <AnimatedText
              isHero
              delay={0.3}
              className="text-base  text-white font-pp-neue-montreal text-left max-w-lg"
            >
              <p>{t("description")}</p>
            </AnimatedText>
          </div>

          {/* Right side - CTA Button */}
          {/* <div className="flex items-end">
            <AnimatedButton isHero delay={0.6}>
              <button className="px-8 py-4 bg-[#8202FF] cursor-pointer text-white font-pp-neue-montreal text-sm  hover:bg-[#6a02cc] transition-colors">
                {t("cta")}
              </button>
            </AnimatedButton>
          </div> */}
        </div>
      </section>

      {/* Second Section */}
      <section className="relative w-full min-h-screen bg-black py-20 px-4 md:px-8">
        <GradientTextReveal
          startColor="rgb(255, 255, 255, 0.3)"
          endColor="rgb(255, 255, 255)"
          className="text-5xl md:text-6xl lg:text-7xl font-medium text-left font-pp-neue-montreal "
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
      </section>

      {/* Third Section - White Background with Grey to Purple Gradient */}
      <section className="relative w-full min-h-screen bg-white py-20 px-4 md:px-8">
        <GradientTextReveal
          startColor="rgb(156, 163, 175)"
          endColor="rgb(130, 2, 255)"
          className="text-5xl md:text-6xl lg:text-7xl font-medium text-left font-pp-neue-montreal "
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

      {/* FractalGradient Section */}
      <section className="relative w-full h-[80vh] bg-black overflow-hidden flex items-center justify-center">
        <FractalGradient zIndex={10} position="absolute" />
        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-4xl md:text-6xl lg:text-7xl font-normal text-white mb-6 md:mb-8 font-pp-neue-montreal">
            <h2>Join Our Team</h2>
          </AnimatedText>
          <AnimatedText
            delay={0.2}
            className="text-base md:text-lg text-white font-pp-neue-montreal mb-8 md:mb-10 max-w-2xl"
          >
            <p>
              Be part of a dynamic team that&apos;s shaping the future of
              technology and business. We&apos;re always looking for talented
              individuals who share our passion for excellence and innovation.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.4}>
            <button className="px-8 py-3 bg-[#8202FF] cursor-pointer text-white font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors">
              {t("cta")}
            </button>
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
}
