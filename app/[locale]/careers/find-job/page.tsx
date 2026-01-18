import { getTranslations } from "next-intl/server";
import CssGradient from "@/app/components/CssGradient";
import LightGradient from "@/app/components/LightGradient";
import CssGradientTailwind from "@/app/components/CssGradientTailwind";
import AnimatedText from "@/app/components/AnimatedText3";

export default async function FindJobPage() {
  const t = await getTranslations("careers.findJob");

  return (
    <div className="min-h-screen relative">
      {/* Hero Section with CssGradient */}
      <section className="relative h-svh flex flex-col px-4 md:px-8 overflow-hidden">
        {/* Base blue gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #4a5a9a 0%, #3d4d8a 50%, #2d3d7a 100%)",
          }}
        />

        {/* CssGradient Background */}
        <div className="absolute inset-0 -z-10">
          <CssGradient />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl pt-32 md:pt-40 ">
          <AnimatedText
            isHero
            className="text-4xl md:text-7xl  font-light overflow-visible  text-white text-left"
          >
            <h1>Engineering the future of aging medicine.</h1>
          </AnimatedText>
        </div>
        <div className="absolute bottom-8 left-4 md:left-8 w-full max-w-xl">
          <AnimatedText
            isHero
            delay={0.5}
            className="text-white/80 text-sm md:text-lg text-left"
          >
            <p>
              We connect top talent with high-impact opportunities across
              technology, engineering, and business operations.
            </p>
          </AnimatedText>
        </div>
      </section>

      {/* Second Section with Light Gradient */}
      <section
        className="relative min-h-screen flex items-center px-8 sm:px-16 lg:px-32 py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #e8eef5 0%, #dfe8f2 50%, #d8e2ee 100%)",
        }}
      >
        {/* LightGradient Background */}
        <div className="absolute inset-0">
          <LightGradient />
        </div>

        {/* Decorative bracket */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:block h-[300px] w-5 border border-[#3a4a7a]/20 border-r-0 rounded-l-[10px]" />

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Left Column */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wider leading-tight mb-2 text-[#3a4a7a] uppercase">
              Your Story Shapes
              <span className="block text-[#7a9ad0]">The Strategy</span>
            </h1>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-base sm:text-lg font-medium text-[#3a4a7a] leading-relaxed max-w-[480px]">
              <p className="mb-6">
                We take the time to understand more than just your balance
                sheet. We get to know your schedule, your stressors, your values
                and your real life.
              </p>
              <p className="mb-6">
                The result is a plan that reflects who you are, adapts with you,
                and stays aligned as your life evolves.
              </p>
              <p>
                You won&apos;t be handed a strategy and sent on your way.
                You&apos;ll be guided, advised, and supported through every
                phase of your professional journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section with CssGradientTailwind */}
      <section className="relative h-svh flex flex-col px-4 md:px-8 overflow-hidden">
        {/* Base black background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "#000000",
          }}
        />

        {/* CssGradientTailwind Background */}
        <div className="absolute inset-0 -z-10">
          <CssGradientTailwind />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl pt-32 md:pt-40 ">
          <AnimatedText
            isHero
            className="text-4xl md:text-7xl  font-light overflow-visible  text-black text-left"
          >
            <h1>Discover your next career opportunity.</h1>
          </AnimatedText>
        </div>
        <div className="absolute bottom-8 left-4 md:left-8 w-full max-w-xl">
          <AnimatedText
            isHero
            delay={0.5}
            className="text-black/80 text-sm md:text-lg text-left"
          >
            <p>
              Explore exciting roles and join a team that values innovation,
              creativity, and professional growth.
            </p>
          </AnimatedText>
        </div>
      </section>
    </div>
  );
}
