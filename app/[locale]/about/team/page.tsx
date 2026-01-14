import { getTranslations } from "next-intl/server";
import ShaderBackground from "../../../components/ShaderBackground5";

export default async function TeamPage() {
  const t = await getTranslations("about.team");

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative h-svh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Shader Background */}
        <div className="absolute inset-0 -z-10">
          <ShaderBackground />
        </div>
        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-light leading-tight text-white mb-4 md:mb-6 font-pp-neue-montreal">
            {t("title")}
          </h1>
          <p className="text-lg max-w-xl mx-auto md:text-lg text-white font-pp-neue-montreal">
            {t("description")}
          </p>
        </div>
      </section>
    </div>
  );
}
