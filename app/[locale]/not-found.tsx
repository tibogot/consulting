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
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {t("description")}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
