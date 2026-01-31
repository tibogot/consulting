import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("notFound");
  return {
    title: t("title"),
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-4 md:px-8">
      <div className="w-full max-w-2xl text-center">
        <p className="font-pp-neue-montreal text-sm text-white/60 md:text-base">
          {t("label")}
        </p>
        <div className="mt-4 h-px w-full bg-white/20" />
        <h1 className="mt-8 font-pp-neue-montreal text-7xl font-normal leading-[1.1] text-white md:text-8xl">
          404
        </h1>
        <h2 className="mt-6 font-pp-neue-montreal text-3xl font-normal leading-tight text-white md:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-6 max-w-md mx-auto font-pp-neue-montreal text-lg leading-relaxed text-white/80">
          {t("description")}
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-block bg-[#8202FF] px-8 py-3 font-pp-neue-montreal text-base text-white transition-colors hover:bg-[#6a02cc]"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
