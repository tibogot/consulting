import { getTranslations } from "next-intl/server";
import BlackSection from "../../../components/BlackSection";
import GradientTextReveal from "../../../components/GradientTextReveal";
import StickyCards3D from "../../../components/StickyCards3D";
import PartnersTicker from "../../../components/PartnersTicker";
import AnimatedText from "../../../components/AnimatedText3";
import ShaderBackground from "../../../components/ShaderBackground4";

export default async function WorkAtSparagusPage() {
  const t = await getTranslations("home");

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative h-svh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Shader Background */}
        <div className="absolute inset-0 -z-10">
          <ShaderBackground />
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <AnimatedText
            isHero
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white"
          >
            <h1>{t("hero.title")}</h1>
          </AnimatedText>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg mx-auto text-center px-4">
          <AnimatedText
            isHero
            delay={0.5}
            className="text-white/80 text-sm md:text-base"
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
      <section className="relative w-full bg-black py-24 px-4 md:px-8">
        <GradientTextReveal
          startColor="rgb(255, 255, 255, 0.3)"
          endColor="rgb(255, 255, 255)"
          className="text-5xl md:text-6xl lg:text-7xl font-medium text-left font-pp-neue-montreal"
        >
          <h2>{t("blackSection.title")}</h2>
        </GradientTextReveal>
        <GradientTextReveal
          startColor="rgb(255, 255, 255, 0.3)"
          endColor="rgb(255, 255, 255)"
          className="text-5xl md:text-6xl lg:text-7xl font-[400] text-left font-switzer tracking-[-0.01em] mt-8"
        >
          <h2>{t("blackSection.title")}</h2>
        </GradientTextReveal>
      </section>

      {/* Black Section */}
      <BlackSection />

      {/* Sticky Cards 3D Section */}
      <StickyCards3D />
    </div>
  );
}
