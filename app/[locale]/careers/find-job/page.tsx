import { getTranslations } from "next-intl/server";
import WorkAtSparagusHero4 from "../../../components/WorkAtSparagusHero4";
import AnimatedText from "../../../components/AnimatedText3";

export default async function FindJobPage() {
  const t = await getTranslations("careers.findJob");

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section */}
      <div className="">
        <WorkAtSparagusHero4
          title={t("title")}
          description={t("description")}
        />
      </div>

      {/* Second section - AnimatedText like home page */}
      <section className="relative w-full bg-black px-4 pb-20 md:px-8">
        <div className="w-full">
          <div className="mt-12 h-px w-full bg-white/20" />

          <p className="pt-6 font-pp-neue-montreal text-sm text-white md:text-base">
            What We Deliver
          </p>

          <div className="mt-20">
            <AnimatedText>
              <h2 className="max-w-4xl text-left font-pp-neue-montreal text-5xl font-normal text-white md:text-6xl">
                Expertise That Transforms. Partnerships That Last.
              </h2>
            </AnimatedText>
          </div>

          <div className="mt-14 flex flex-col gap-10 md:mt-32 md:flex-row">
            <div className="hidden md:block md:w-1/2" />
            <div className="md:w-1/2">
              <AnimatedText>
                <p className="max-w-lg font-pp-neue-montreal text-lg leading-relaxed text-white/80">
                  What started as a Belgian recruitment agency has grown into a
                  trusted consulting partner spanning 11 countries. Today,
                  Sparagus bridges the gap between talent and transformation,
                  helping organizations fill mission-critical roles, execute
                  complex initiatives, and scale operations—all while preserving
                  the personal touch that makes partnerships meaningful.
                </p>
              </AnimatedText>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
