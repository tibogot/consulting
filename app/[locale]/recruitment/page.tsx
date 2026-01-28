import { getTranslations } from "next-intl/server";
import GradientTextReveal from "../../components/GradientTextReveal";
import PartnersTicker from "../../components/PartnersTicker";
import AnimatedText from "../../components/AnimatedText3";
import ShaderBackground from "../../components/ShaderBackground4";
import DotMatrix from "../../components/DotMatrix";

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

      {/* DotMatrix Section - 100vh */}
      <section className="relative h-screen w-full bg-black">
        <DotMatrix color="#c084fc" opacity={1} dotSize={3} spacing={8} />
      </section>
    </div>
  );
}
