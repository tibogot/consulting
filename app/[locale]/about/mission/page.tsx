import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";

export default async function MissionPage() {
  const t = await getTranslations("about.mission");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section (same concept as Managed Services) */}
      <ManagedServicesHero
        title={t("title")}
        description={t("description")}
        imageSrc="/mario-gogh.jpg"
        imageAlt="Mission Statement Hero"
      />
    </div>
  );
}

