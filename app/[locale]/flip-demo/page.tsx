import { getTranslations } from "next-intl/server";
import HorizontalScrollSection from "../../components/HorizontalScrollSection";

export default async function FlipDemoPage() {
  const t = await getTranslations("flipDemo");

  const slides = [
    {
      text: t("slides.slide1"),
      image: "/slide-1.jpg",
    },
    {
      text: t("slides.slide2"),
      image: "/slide-2.jpg",
    },
  ];

  return (
    <HorizontalScrollSection
      heroText={t("hero")}
      outroText={t("outro")}
      slides={slides}
    />
  );
}
