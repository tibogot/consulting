import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";
import DotMatrix from "@/app/components/DotMatrix";

export default async function ConsultingPage() {
  const t = await getTranslations("services.consulting");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section (same concept as Managed Services) */}
      <ManagedServicesHero
        title={t("title")}
        description={t("description")}
        imageSrc="/paul-mocan.jpg"
        imageAlt="Consulting Services Hero"
      />
      
      {/* DotMatrix Section - 100vh */}
      <section className="relative w-full h-screen bg-black">
        <DotMatrix color="#c084fc" opacity={1} dotSize={3} spacing={8} />
      </section>
    </div>
  );
}

