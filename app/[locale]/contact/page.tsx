"use client";

import { useTranslations } from "next-intl";
import AnimatedText from "@/app/components/AnimatedText3";
import ContactLeadForm from "@/app/components/ContactLeadForm";
import FAQ, { FAQItem } from "@/app/components/FAQ";

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
      
      <FAQ items={FAQ_ITEMS} />
    </div>
  );
}
