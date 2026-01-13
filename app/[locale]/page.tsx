import { getTranslations } from "next-intl/server";
import BlackSection from "../components/BlackSection";
import GradientTextReveal from "../components/GradientTextReveal";
import StickyCards3D from "../components/StickyCards3D";
import PartnersTicker from "../components/PartnersTicker";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative h-svh bg-blue-600 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white">
            {t("hero.title")}
          </h1>
        </div>
        <p className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-sm md:text-base max-w-lg mx-auto text-center px-4">
          {t("hero.subtitle")}
        </p>
      </section>

      {/* Partners Ticker Section */}
      <section className="relative w-full bg-black py-8">
        <PartnersTicker
          speed={20}
          direction="left"
          pauseOnHover={true}
          gap={48}
          logoHeight={45}
        />
      </section>

      {/* Gradient Text Reveal Section */}
      <section className="relative min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
          <GradientTextReveal
            startColor="rgb(255, 255, 255, 0.3)"
            endColor="rgb(255, 255, 255)"
            className="text-6xl md:text-7xl lg:text-8xl font-bold"
          >
            <h2>This is a test to see if GradientTextReveal works perfectly</h2>
          </GradientTextReveal>
        </div>
      </section>

      {/* Black Section */}
      <BlackSection />

      {/* Sticky Cards 3D Section */}
      <StickyCards3D />
    </div>
  );
}
