import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function FindJobPage() {
  const t = await getTranslations("careers.findJob");

  return (
    <div className="w-full min-h-screen bg-black">
      <section className="mx-auto w-full max-w-6xl px-4 md:px-8 py-20">
        <h1 className="text-white font-pp-neue-montreal font-normal text-4xl md:text-6xl leading-tight tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="mt-6 text-white/80 font-pp-neue-montreal text-base md:text-lg leading-relaxed max-w-3xl">
          {t("description")}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={"/contact" as const}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-pp-neue-montreal hover:opacity-90 transition-opacity"
          >
            Get in touch
          </Link>
          <Link
            href={"/gradients" as const}
            className="inline-flex items-center justify-center px-6 py-3 border border-white/25 text-white font-pp-neue-montreal hover:border-white/50 transition-colors"
          >
            View gradient demos
          </Link>
        </div>
      </section>
    </div>
  );
}
