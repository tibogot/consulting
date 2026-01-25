import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";
import AnimatedCopy from "@/app/components/AnimatedCopy";
import { Link } from "@/i18n/routing";

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
      <section className="relative w-full bg-black py-4 px-4 md:px-8">
        <div className="w-full">
        {/* <AnimatedCopy colorInitial="#666666" colorAccent="#8202FF" colorFinal="#ffffff">          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-left font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] max-w-4xl">
            Strategy that ships. Systems that scale. Results you can measure.
          </h2>
          </AnimatedCopy> */}

          <div className="mt-12 h-px w-full bg-white/20" />

          <p className="pt-6 text-white text-sm md:text-base font-pp-neue-montreal">
            Built for modern teams
          </p>

          <div className="mt-14 md:mt-32 flex flex-col md:flex-row gap-10  items-end">
            <div className="hidden md:block md:w-1/2">
              <h3 className="text-white text-5xl font-normal font-pp-neue-montreal leading-tight ">
              At the intersection of talent and transformation, Sparagus is
              designed to be a leader.
              </h3>
            </div>

            <div className="md:w-1/2 ">
              <div>
                <p className="text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal max-w-lg   ">
                  We partner with your team to define the real problem, agree on
                  success metrics, and shape an executable plan—scope,
                  constraints, owners, milestones, and trade-offs.
                </p>

                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  Explore services <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="text-white text-sm md:text-base font-pp-neue-montreal">
                  Clarity, fast
                </h3>
                <p className="mt-4 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal">
                  Sharp research, practical strategy, and decision-ready
                  artifacts—so your team stops debating and starts building.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  See how we work <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="text-white text-sm md:text-base font-pp-neue-montreal">
                  Delivery you can trust
                </h3>
                <p className="mt-4 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal">
                  Clean execution, predictable cadence, and measurable progress—
                  built with maintainability and long-term ownership in mind.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  View case studies <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
    
  );
}

