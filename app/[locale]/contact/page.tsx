"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import AnimatedText from "@/app/components/AnimatedText3";
import ContactLeadForm from "@/app/components/ContactLeadForm";
import FAQ, { FAQItem } from "@/app/components/FAQ";
import ParticleGlobe from "@/app/components/ParticleGlobe";


const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What services do you offer?",
    answer: "We provide comprehensive infrastructure management, application support, DevOps automation, and security compliance services. Our team handles everything from cloud architecture to 24/7 monitoring and incident response.",
  },
  {
    question: "How quickly can you respond to incidents?",
    answer: "We offer 24/7 monitoring with guaranteed SLA response times. Our team is always available to address critical issues and ensure minimal downtime for your systems.",
  },
  {
    question: "Do you work with specific cloud providers?",
    answer: "Yes, we have expertise across all major cloud platforms including AWS, Azure, and GCP. We can help you choose the right platform for your needs or manage multi-cloud environments.",
  },
  {
    question: "What is your approach to security and compliance?",
    answer: "We implement comprehensive security measures including threat monitoring, vulnerability management, and access controls. We ensure your systems meet industry standards like SOC 2, ISO 27001, and GDPR compliance.",
  },
  {
    question: "Can you help with existing infrastructure?",
    answer: "Absolutely. We can take over management of your existing infrastructure, optimize current setups, and help migrate to more efficient solutions. Our team works seamlessly with your current technology stack.",
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
            {/* Particle Globe Section */}
      <section className="relative w-full h-svh">
        <ParticleGlobe className="w-full h-full" />
      </section>

      {/* Get In Touch – big title + grid (no max width) */}
      <section className="w-full bg-black px-4 md:px-8 py-16 md:py-24">
        <h2 className="font-pp-neue-montreal text-white text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.02] text-left mb-12 md:mb-16">
          {t("getInTouch.title")}
        </h2>

        <div className="w-full">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-5 md:py-6 border-t border-white/15">
            <div className="font-pp-neue-montreal text-white text-base md:text-lg">
              {t("getInTouch.row1.col1")}
            </div>
            <div className="font-pp-neue-montreal text-white text-base md:text-lg space-y-0.5">
              <div>{t("getInTouch.row1.col2Label")}</div>
              <a href={`mailto:${email}`} className="text-white/80 hover:text-white transition-colors block">
                {email}
              </a>
            </div>
            <div className="font-pp-neue-montreal text-white text-base md:text-lg text-left md:text-right">
              <Link href={`/${locale}/careers`} className="text-white/80 hover:text-white transition-colors">
                {t("getInTouch.row1.col3")}
              </Link>
            </div>
          </div>

          {/* Rows 2 & 3 – locations */}
          {(t.raw("getInTouch.locations") as string[]).map((location) => (
            <div
              key={location}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-5 md:py-6 border-t border-white/15"
            >
              <div className="font-pp-neue-montreal text-white text-base md:text-lg">
                {location}
              </div>
              <div className="font-pp-neue-montreal text-white text-base md:text-lg space-y-0.5">
                <div>{t("getInTouch.newBusiness")}</div>
                <a href={`mailto:${email}`} className="text-white/80 hover:text-white transition-colors block">
                  {email}
                </a>
              </div>
              <div className="font-pp-neue-montreal text-white/80 text-base md:text-lg text-left md:text-right">
                {t("getInTouch.col3Time")}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FAQ items={FAQ_ITEMS} />

      <div
        className="h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/campaign-creators.jpg)" }}
      />
    </div>
  );
}
