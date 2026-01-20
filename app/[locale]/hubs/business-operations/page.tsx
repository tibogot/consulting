import { getTranslations } from "next-intl/server";

export default async function BusinessOperationsHubPage() {
  const t = await getTranslations("hubs.businessOperations");

  return (
    <div className="w-full min-h-screen bg-black">
      <section className="mx-auto w-full max-w-6xl px-4 md:px-8 py-20">
        <h1 className="text-white font-pp-neue-montreal font-normal text-4xl md:text-6xl leading-tight tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="mt-6 text-white/80 font-pp-neue-montreal text-base md:text-lg leading-relaxed max-w-3xl">
          {t("description")}
        </p>
      </section>
    </div>
  );
}

