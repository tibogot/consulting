import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";

export default async function ConsultingPage() {
  const t = await getTranslations("services.consulting");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section (same concept as Managed Services) */}
      <ManagedServicesHero
        title={t("title")}
        description={t("description")}
        imageSrc="/behnam-norouzi.jpg"
        imageAlt="Consulting Services Hero"
      />
    </div>
  );
}

