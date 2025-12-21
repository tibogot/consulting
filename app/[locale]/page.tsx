import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import HeroSection from "../components/HeroSection";
import BlackSection from "../components/BlackSection";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="w-full">
      {/* Hero Section with Shader Background */}
      <HeroSection />

      {/* Black Section */}
      <BlackSection />
    </div>
  );
}
