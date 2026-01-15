import { getTranslations } from "next-intl/server";
import AnimatedText from "../../../components/AnimatedText3";
import GradientTextReveal from "../../../components/GradientTextReveal";
import PartnersTicker from "../../../components/PartnersTicker";

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
              className="text-base  text-white font-pp-neue-montreal text-left max-w-xl"
            >
              <p>{t("description")}</p>
            </AnimatedText>
          </div>

          {/* Right side - CTA Button */}
          <div className="flex items-end">
            <button className="px-8 py-2 bg-[#8202FF] cursor-pointer text-white font-pp-neue-montreal rounded-sm hover:bg-[#6a02cc] transition-colors">
              {t("cta")}
            </button>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="relative w-full min-h-screen bg-black py-20 px-4 md:px-8">
        <GradientTextReveal
          startColor="rgb(255, 255, 255, 0.3)"
          endColor="rgb(255, 255, 255)"
          className="text-5xl md:text-6xl lg:text-7xl font-medium text-left font-pp-neue-montreal indent-8 md:indent-12 lg:indent-16"
        >
          <h2>Transforming businesses through exceptional talent</h2>
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
    </div>
  );
}
