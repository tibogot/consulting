import { getTranslations } from "next-intl/server";
import AnimatedText from "../../components/AnimatedText3";
import BlogArticlesGrid from "../../components/BlogArticlesGrid";
import TextAnim from "../../components/TextAnim";

export default async function BlogPage() {
  const t = await getTranslations("blog");

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section */}
      <section className="w-full overflow-x-hidden pt-64 pb-20">
        <div className="px-4 md:px-8">
          <AnimatedText isHero className="overflow-visible">
            <h1 className="max-w-3xl text-left font-pp-neue-montreal text-5xl leading-tight font-normal text-white md:text-7xl">
              {t("title")}
            </h1>
          </AnimatedText>
          <div className="mt-32">
            <AnimatedText isHero delay={0.3} className="overflow-visible">
              <h3 className="max-w-3xl text-left font-pp-neue-montreal text-xl font-normal text-white/80 md:text-3xl">
                {t("subtitle")}
              </h3>
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Articles Grid Section */}
      <section className="w-full pb-20 md:pb-32">
        <div className="px-4 md:px-8">
          <BlogArticlesGrid />
        </div>
      </section>
      <section className="relative flex h-screen w-full items-center justify-center border-t bg-white px-4 md:px-8">
        <div className="mx-auto w-full max-w-5xl text-center">
          <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
            <h2 className="font-pp-neue-montreal text-4xl leading-tight font-normal text-black md:text-7xl">
              The Right Talent. The Right Time. The Right Results{" "}
            </h2>
          </TextAnim>
        </div>
      </section>
    </div>
  );
}
