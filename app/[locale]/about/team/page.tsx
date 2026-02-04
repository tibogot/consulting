import { getTranslations } from "next-intl/server";
import Link from "next/link";
import WorkAtSparagusHero4 from "../../../components/WorkAtSparagusHero4";
import AnimatedButton from "../../../components/AnimatedButton";

export default async function TeamPage() {
  const t = await getTranslations("about.team");

  return (
    <div className="min-h-screen w-full bg-black">
      <WorkAtSparagusHero4
        title={t("title")}
        description={t("description")}
        videoSrcDesktop="https://cdn.prod.website-files.com/66d3db0a03091f83e3260124%2F66de4dfa2d65d4c9631e442e_Hero%20Visual%20%281%29-transcode.mp4"
        // videoSrcMobile="https://your-cdn.com/team-hero-mobile.mp4"
      />

      {/* CTA Section */}
      <section className="relative px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="flex justify-end">
          <AnimatedButton isHero delay={0.3}>
            <Link
              href="/contact"
              className="inline-block cursor-pointer rounded-sm bg-[#8202FF] px-8 py-2 font-pp-neue-montreal text-white transition-colors hover:bg-[#6a02cc]"
            >
              {t("cta")}
            </Link>
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
}
