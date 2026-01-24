import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";

export default async function AboutUsPage() {
  const t = await getTranslations("about.us");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section (same concept as Managed Services) */}
      <ManagedServicesHero
        title={t("title")}
        description={t("description")}
        imageSrc="/alev-takil.jpg"
        imageAlt="About Us Hero"
      />
    </div>
  );
}

