import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";

export default async function SearchSelectionPage() {
  const t = await getTranslations("services.searchSelection");

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero (same concept as Managed Services / Consulting) */}
      <ManagedServicesHero
        title={t("title")}
        description={t("description")}
        imageSrc="/mike-kononov.jpg"
        imageAlt="Search & Selection Hero"
      />
    </div>
  );
}
