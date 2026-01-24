import { getTranslations } from "next-intl/server";

export default async function WorkAtSparagusPage() {
  const t = await getTranslations("careers.workAtSparagus");

  return (
    <div className="w-full min-h-screen py-16 px-8">
      <h1 className="text-4xl font-bold mb-4 text-white">{t("title")}</h1>
      <p className="text-lg text-white">{t("description")}</p>
    </div>
  );
}
