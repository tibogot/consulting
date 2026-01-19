"use client";

import { useTranslations } from "next-intl";
import AnimatedText from "@/app/components/AnimatedText3";
import HomeLeadForm from "@/app/components/HomeLeadForm";

export default function ContactTestContent() {
  const t = useTranslations("contact");

  return (
    <div className="w-full">
      {/* First section: 50/50 title + form */}
      <section className="relative min-h-screen bg-black px-4 md:px-8 py-20 md:py-28 flex items-center">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            <div className="lg:w-1/2">
              <AnimatedText isHero>
                <h1 className="font-pp-neue-montreal text-white text-5xl md:text-7xl font-normal leading-[1.02]">
                  {t("hero.title")}
                </h1>
              </AnimatedText>
              <AnimatedText isHero delay={0.0} stagger={0.3}>
                <p className="mt-6 font-pp-neue-montreal text-white/75 text-base md:text-lg leading-relaxed max-w-xl">
                  {t("hero.subtitle")}
                </p>
              </AnimatedText>
            </div>

            <div className="lg:w-1/2 w-full">
              <HomeLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 - Same layout as old project intro section */}
      <section className="text-primary bg-secondary intro mx-auto px-4 py-20 text-center md:px-8 md:py-30">
        <AnimatedText delay={0.0} stagger={0.3}>
          <h1 className=" mx-auto mb-6 max-w-4xl text-6xl">
            {t("section1.title")}
          </h1>
          <p className=" mx-auto max-w-2xl text-lg">
            {t("section1.description")}
          </p>
        </AnimatedText>
      </section>

      {/* Section 2 - Same layout as old project */}
      <section className="text-primary flex w-full flex-col gap-6 px-4 py-10 md:flex-row md:gap-20 md:px-8 md:py-20">
        <div className="left md:w-1/2">
          <div>
            <AnimatedText delay={0.0} stagger={0.3}>
              <h2 className="mt-8 md:max-w-xl">{t("section2.leftTitle")}</h2>
              <p className=" mt-8 text-lg md:max-w-xl">
                {t("section2.leftDescription")}
              </p>
            </AnimatedText>
          </div>
        </div>
        <div className="right flex flex-col justify-between md:h-[400px] md:w-1/2">
          <div>
            <AnimatedText delay={0.0} stagger={0.3}>
              <h2 className=" text-4xl leading-none md:max-w-xl md:text-6xl">
                {t("section2.rightTitle")}
              </h2>
              <p className=" mt-8 max-w-xl text-lg">
                {t("section2.rightDescription")}
              </p>
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Section 3 - Same layout as old project */}
      <section className="text-primary border-primary mx-auto border-y px-4 py-20 text-center md:px-8 md:py-40">
        <AnimatedText>
          <p className=" mx-auto text-lg md:max-w-2xl">
            {t("section3.description")}
          </p>
        </AnimatedText>
      </section>
    </div>
  );
}
