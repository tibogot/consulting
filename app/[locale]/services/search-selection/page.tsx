import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";
import HorizontalScrollSection from "@/app/components/HorizontalScrollSection";
import StackingBenefits from "@/app/components/StackingBenefits";
import ProcessTimeline from "@/app/components/ProcessTimeline";

export default async function SearchSelectionPage() {
  const t = await getTranslations("services.searchSelection");

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero (same concept as Managed Services / Consulting) */}
      <ManagedServicesHero
        title={t("title")}
        description={t("description")}
        imageSrc="/mike-kononov.jpg"
        imageAlt="Search & Selection Hero"
      />

      {/* Horizontal Scroll Section */}
      <HorizontalScrollSection
        heroText="A search process built for clarity, speed, and confident decisions."
        slides={[
          {
            text: "Deep market intelligence and targeted sourcing to surface leaders who can deliver—not just interview well.",
            image: "/slide-1.jpg",
          },
          {
            text: "Rigorous assessment and stakeholder alignment so the shortlist is smaller, sharper, and truly comparable.",
            image: "/slide-2.jpg",
          },
          {
            text: "Confidential, end-to-end coordination—from outreach to offer—designed to protect your brand and candidate experience.",
            image: "/img-3.jpg",
          },
        ]}
        outroText="From first brief to signed offer, we keep momentum high and quality uncompromised."
      />

      {/* Stacking Benefits Cards */}
      <StackingBenefits />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* CTA Section */}
      <section className="relative w-full bg-black py-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-normal font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] mb-8">
            Ready to find your next leader?
          </h2>
          <p className="text-white/70 text-lg md:text-xl font-pp-neue-montreal mb-12">
            Let's start the conversation about your search needs.
          </p>
          <button className="px-10 py-4 bg-white text-black font-pp-neue-montreal text-sm md:text-base hover:bg-white/90 transition-colors">
            Schedule a consultation
          </button>
        </div>
      </section>
    </div>
  );
}
