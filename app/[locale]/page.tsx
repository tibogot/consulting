import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import BlackSection from "../components/BlackSection";
import GradientTextReveal from "../components/GradientTextReveal";
import StickyCards3D from "../components/StickyCards3D";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="w-full bg-blue-600 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <Link
            href="/services"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            {t("hero.cta")}
          </Link>
        </div>
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
