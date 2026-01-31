"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import AnimatedText from "@/app/components/AnimatedText3";
import ContactLeadForm from "@/app/components/ContactLeadForm";
import FAQ, { FAQItem } from "@/app/components/FAQ";
import ParticleGlobe from "@/app/components/ParticleGlobe";
import ParallaxImage from "@/app/components/ParallaxImage";

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What services do you offer?",
    answer:
      "We provide comprehensive infrastructure management, application support, DevOps automation, and security compliance services. Our team handles everything from cloud architecture to 24/7 monitoring and incident response.",
  },
  {
    question: "How quickly can you respond to incidents?",
    answer:
      "We offer 24/7 monitoring with guaranteed SLA response times. Our team is always available to address critical issues and ensure minimal downtime for your systems.",
  },
  {
    question: "Do you work with specific cloud providers?",
    answer:
      "Yes, we have expertise across all major cloud platforms including AWS, Azure, and GCP. We can help you choose the right platform for your needs or manage multi-cloud environments.",
  },
  {
    question: "What is your approach to security and compliance?",
    answer:
      "We implement comprehensive security measures including threat monitoring, vulnerability management, and access controls. We ensure your systems meet industry standards like SOC 2, ISO 27001, and GDPR compliance.",
  },
  {
    question: "Can you help with existing infrastructure?",
    answer:
      "Absolutely. We can take over management of your existing infrastructure, optimize current setups, and help migrate to more efficient solutions. Our team works seamlessly with your current technology stack.",
  },
];

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const email = t("details.email");
  const phone = t("details.phone");
  const addressLine1 = t("details.addressLine1");
  const addressLine2 = t("details.addressLine2");
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="w-full">
      {/* Big Hero Title Section */}
      <section className="flex min-h-[60vh] items-center bg-black px-4 pt-32 md:min-h-[70vh] md:px-8">
        <div className="w-full">
          <AnimatedText isHero>
            <h1 className="text-left font-pp-neue-montreal text-5xl leading-[1.1] font-normal text-white md:text-7xl">
              {t("hero.bigTitleLine1")}
              <br />
              {t("hero.bigTitleLine2")}
            </h1>
          </AnimatedText>
        </div>
      </section>

      <section className="relative bg-black px-4 pb-20 md:px-8">
        <div className="w-full">
          <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-14">
            <div className="flex flex-col justify-between md:w-1/3">
              <div>
                <AnimatedText isHero>
                  <h2 className="font-pp-neue-montreal text-3xl leading-[1.02] font-normal text-white md:text-4xl">
                    {t("hero.title")}
                  </h2>
                </AnimatedText>
              </div>

              <div className="mt-16 space-y-4 md:mt-auto">
                <a
                  href={`mailto:${email}`}
                  className="block font-pp-neue-montreal text-sm text-white/80 transition-colors hover:text-white md:text-base"
                >
                  {email}
                </a>
                <a
                  href={phoneHref}
                  className="block font-pp-neue-montreal text-sm text-white/80 transition-colors hover:text-white md:text-base"
                >
                  {phone}
                </a>
                <p className="font-pp-neue-montreal text-sm leading-relaxed text-white/80 md:text-base">
                  {addressLine1}
                  <br />
                  {addressLine2}
                </p>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <div className="w-full">
                <div className="mt-0">
                  <ContactLeadForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Globe Intro Title – left on mobile, right on desktop */}
      <section className="flex min-h-[30vh] items-center bg-black px-4 py-16 md:min-h-[40vh] md:px-8">
        <div className="flex w-full flex-col md:flex-row">
          <div className="hidden md:block md:w-1/2" />
          <div className="w-full md:w-1/2">
            <AnimatedText isHero>
              <h2 className="text-left font-pp-neue-montreal text-4xl leading-[1.1] font-normal text-white md:text-6xl lg:text-7xl">
                {t("globeIntro.title")}
              </h2>
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Particle Globe Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full md:h-svh">
        <ParticleGlobe className="h-full w-full" />
      </section>

      {/* Get In Touch – big title + grid (no max width) */}
      <section className="w-full bg-black px-4 py-16 md:px-8 md:py-24">
        <h2 className="mb-12 text-left font-pp-neue-montreal text-4xl leading-[1.02] font-normal text-white md:mb-16 md:text-6xl lg:text-7xl">
          {t("getInTouch.title")}
        </h2>

        <div className="w-full">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-6 border-t border-white/15 py-5 md:grid-cols-3 md:gap-8 md:py-6">
            <div className="font-pp-neue-montreal text-base text-white md:text-lg">
              {t("getInTouch.row1.col1")}
            </div>
            <div className="space-y-0.5 font-pp-neue-montreal text-base text-white md:text-lg">
              <div>{t("getInTouch.row1.col2Label")}</div>
              <a
                href={`mailto:${email}`}
                className="block text-white/80 transition-colors hover:text-white"
              >
                {email}
              </a>
            </div>
            <div className="text-left font-pp-neue-montreal text-base text-white md:text-right md:text-lg">
              <Link
                href={`/${locale}/careers`}
                className="text-white/80 transition-colors hover:text-white"
              >
                {t("getInTouch.row1.col3")}
              </Link>
            </div>
          </div>

          {/* Rows 2 & 3 – locations */}
          {(() => {
            const raw = t.raw("getInTouch.locations");
            const locations = Array.isArray(raw) ? (raw as string[]) : [];
            return locations.map((location) => (
              <div
                key={location}
                className="grid grid-cols-1 gap-6 border-t border-white/15 py-5 md:grid-cols-3 md:gap-8 md:py-6"
              >
                <div className="font-pp-neue-montreal text-base text-white md:text-lg">
                  {location}
                </div>
                <div className="space-y-0.5 font-pp-neue-montreal text-base text-white md:text-lg">
                  <div>{t("getInTouch.newBusiness")}</div>
                  <a
                    href={`mailto:${email}`}
                    className="block text-white/80 transition-colors hover:text-white"
                  >
                    {email}
                  </a>
                </div>
                <div className="text-left font-pp-neue-montreal text-base text-white/80 md:text-right md:text-lg">
                  {t("getInTouch.col3Time")}
                </div>
              </div>
            ));
          })()}
        </div>
      </section>

      <FAQ items={FAQ_ITEMS} />

      <ParallaxImage className="h-screen w-full" speed={0.4}>
        <div
          className="h-[140%] w-full bg-cover bg-[center_80%] bg-no-repeat"
          style={{ backgroundImage: "url(/campaign-creators.jpg)" }}
        />
      </ParallaxImage>
    </div>
  );
}
