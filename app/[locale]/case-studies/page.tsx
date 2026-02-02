import { getTranslations } from "next-intl/server";
import Image from "next/image";
import AnimatedText from "../../components/AnimatedText3";
import AnimatedButton from "../../components/AnimatedButton";
import CircuitBoardAnimation from "../../components/CircuitBoardAnimation";
import LogoLightningAnim from "../../components/LogoLightningAnim";
import TalentFlowMorph from "../../components/TalentFlowMorph";

export default async function CaseStudiesPage() {
  const t = await getTranslations("caseStudies");

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section with Image Background */}
      <section className="relative flex h-svh flex-col overflow-hidden px-4 sm:px-6 lg:px-8">
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
        <div className="absolute inset-0 z-10 bg-black/60" />

        {/* Content Overlay - Bottom positioned */}
        <div className="relative z-20 mt-auto flex w-full flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between md:pb-12 lg:pb-16">
          {/* Left side - Title and Description */}
          <div className="max-w-3xl">
            <AnimatedText
              isHero
              className="mb-4 text-left font-pp-neue-montreal text-4xl font-normal text-white md:mb-6 md:text-7xl"
            >
              <h1>{t("title")}</h1>
            </AnimatedText>
            <AnimatedText
              isHero
              delay={0.3}
              className="max-w-xl text-left font-pp-neue-montreal text-base text-white"
            >
              <p>{t("description")}</p>
            </AnimatedText>
          </div>

          {/* Right side - CTA Button */}
          <div className="flex items-end">
            <AnimatedButton isHero delay={0.6}>
              <button className="cursor-pointer rounded-sm bg-[#8202FF] px-8 py-2 font-pp-neue-montreal text-white transition-colors hover:bg-[#6a02cc]">
                {t("cta")}
              </button>
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Circuit board animation */}
      <section className="relative h-svh w-full">
        <CircuitBoardAnimation className="h-full" />
      </section>

      {/* Logo lightning animation */}
      <section className="relative w-full">
        <LogoLightningAnim />
      </section>

      {/* Talent Flow morph visualization */}
      <section className="relative min-h-svh w-full">
        <TalentFlowMorph className="h-svh w-full" />
      </section>
    </div>
  );
}
