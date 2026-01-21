"use client";

import { useTranslations } from "next-intl";
import AnimatedText from "@/app/components/AnimatedText3";
import ContactLeadForm from "@/app/components/ContactLeadForm";

export default function ContactPage() {
  const t = useTranslations("contact");
  const email = t("details.email");
  const phone = t("details.phone");
  const addressLine1 = t("details.addressLine1");
  const addressLine2 = t("details.addressLine2");
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="w-full">
      <section className="relative min-h-screen bg-black px-4 md:px-8 pt-64 pb-20">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            <div className="md:w-1/2 flex flex-col justify-between md:h-[calc(100vh-16rem-5rem)]">
              <div>
                <AnimatedText isHero>
                  <h1 className="font-pp-neue-montreal text-white text-5xl md:text-7xl font-normal leading-[1.02]">
                    {t("hero.title")}
                  </h1>
                </AnimatedText>
              </div>

              <div className="mt-16 md:mt-0 space-y-4">
                <a
                  href={`mailto:${email}`}
                  className="block font-pp-neue-montreal text-white/80 hover:text-white transition-colors text-sm md:text-base"
                >
                  {email}
                </a>
                <a
                  href={phoneHref}
                  className="block font-pp-neue-montreal text-white/80 hover:text-white transition-colors text-sm md:text-base"
                >
                  {phone}
                </a>
                <p className="font-pp-neue-montreal text-white/80 text-sm md:text-base leading-relaxed">
                  {addressLine1}
                  <br />
                  {addressLine2}
                </p>
              </div>
            </div>

            <div className="md:w-1/2 w-full">
              <div className="w-full max-w-md">
                <div className="mb-4 border-t border-white" />
                <AnimatedText isHero delay={0.0} stagger={0.3}>
                  <p className="font-pp-neue-montreal text-white text-sm md:text-base leading-relaxed max-w-md">
                    {t("hero.subtitle")}
                  </p>
                </AnimatedText>

                <div className="mt-14">
                  <ContactLeadForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
