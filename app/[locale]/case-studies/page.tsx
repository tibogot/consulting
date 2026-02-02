import { getTranslations } from "next-intl/server";
import Image from "next/image";
import AnimatedText from "../../components/AnimatedText3";
import AnimatedButton from "../../components/AnimatedButton";
import TalentFlowMorph from "../../components/TalentFlowMorph";

export default async function CaseStudiesPage() {
  const t = await getTranslations("caseStudies");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section with Image Background */}
      <section className="relative h-svh flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cards/charlesdeluvio.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Content Overlay - Bottom positioned */}
        <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 md:pb-12 lg:pb-16 mt-auto">
          {/* Left side - Title and Description */}
          <div className="max-w-3xl">
            <AnimatedText
              isHero
              className="text-4xl md:text-7xl font-normal text-white mb-4 md:mb-6 font-pp-neue-montreal text-left"
            >
              <h1>{t("title")}</h1>
            </AnimatedText>
            <AnimatedText
              isHero
              delay={0.3}
              className="text-base text-white font-pp-neue-montreal text-left max-w-xl"
            >
              <p>{t("description")}</p>
            </AnimatedText>
          </div>

          {/* Right side - CTA Button */}
          <div className="flex items-end">
            <AnimatedButton isHero delay={0.6}>
              <button className="px-8 py-2 bg-[#8202FF] cursor-pointer text-white font-pp-neue-montreal rounded-sm hover:bg-[#6a02cc] transition-colors">
                {t("cta")}
              </button>
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Talent Flow morph visualization */}
      <section className="relative min-h-svh w-full">
        <TalentFlowMorph className="w-full h-svh" />
      </section>
    </div>
  );
}
