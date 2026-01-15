import { getTranslations } from "next-intl/server";
import ShaderBackground from "../../../components/ShaderBackground5Lazy";
import AnimatedText from "../../../components/AnimatedText3";

export default async function TeamPage() {
  const t = await getTranslations("about.team");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-svh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Shader Background */}
        <ShaderBackground />
        {/* Content Overlay */}
        <div className="relative z-20 w-full max-w-5xl mx-auto text-center">
          <AnimatedText
            isHero
            className="text-4xl md:text-7xl font-normal leading-tight text-white mb-4 md:mb-6 font-pp-neue-montreal"
          >
            <h1>{t("title")}</h1>
          </AnimatedText>
          <AnimatedText
            isHero
            delay={0.3}
            className="text-lg max-w-xl mx-auto md:text-lg text-white font-pp-neue-montreal mb-6 md:mb-8"
          >
            <p>{t("description")}</p>
          </AnimatedText>
          <button className="px-8 py-2 bg-[#8202FF] cursor-pointer text-white font-pp-neue-montreal rounded-sm hover:bg-[#6a02cc] transition-colors">
            {t("cta")}
          </button>
        </div>
      </section>
    </div>
  );
}
