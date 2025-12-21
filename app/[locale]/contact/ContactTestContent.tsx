"use client";

import { useTranslations } from "next-intl";
import AnimatedText from "@/app/components/AnimatedText3";

export default function ContactTestContent() {
  const t = useTranslations("contact");

  return (
    <div className="w-full">
      {/* Hero Section - Using isHero prop like old project */}
      <section className="relative min-h-screen bg-gradient-to-b from-purple-900 via-black to-black flex items-center justify-center px-4 md:px-8">
        <div className="mx-auto text-center">
          <AnimatedText isHero>
            <h1 className="mx-auto mb-6 text-white max-w-4xl text-6xl">
              Contact Us
            </h1>
          </AnimatedText>
          <AnimatedText isHero delay={0.0} stagger={0.3}>
            <p className=" mx-auto max-w-2xl text-lg">
              Get in touch with our team
            </p>
          </AnimatedText>
        </div>
      </section>

      {/* Section 1 - Same layout as old project intro section */}
      <section className="text-primary bg-secondary intro mx-auto px-4 py-20 text-center md:px-8 md:py-30">
        <AnimatedText delay={0.0} stagger={0.3}>
          <h1 className=" mx-auto mb-6 max-w-4xl text-6xl">
            Default Scroll Animation
          </h1>
          <p className=" mx-auto max-w-2xl text-lg">
            This section uses the default scroll-triggered animation. The text
            will animate in as you scroll down.
          </p>
        </AnimatedText>
      </section>

      {/* Section 2 - Same layout as old project */}
      <section className="text-primary flex w-full flex-col gap-6 px-4 py-10 md:flex-row md:gap-20 md:px-8 md:py-20">
        <div className="left md:w-1/2">
          <div>
            <AnimatedText delay={0.0} stagger={0.3}>
              <h2 className="mt-8 md:max-w-xl">Custom Start & Stagger</h2>
              <p className=" mt-8 text-lg md:max-w-xl">
                This animation starts earlier and has a longer stagger between
                lines for a more dramatic effect.
              </p>
            </AnimatedText>
          </div>
        </div>
        <div className="right flex flex-col justify-between md:h-[400px] md:w-1/2">
          <div>
            <AnimatedText delay={0.0} stagger={0.3}>
              <h2 className=" text-4xl leading-none md:max-w-xl md:text-6xl">
                Multiple Text Blocks
              </h2>
              <p className=" mt-8 max-w-xl text-lg">
                This section demonstrates multiple AnimatedText components
                working together. Each text block animates independently as it
                enters the viewport.
              </p>
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Section 3 - Same layout as old project */}
      <section className="text-primary border-primary mx-auto border-y px-4 py-20 text-center md:px-8 md:py-40">
        <AnimatedText>
          <p className=" mx-auto text-lg md:max-w-2xl">
            This section tests how the AnimatedText component handles longer
            paragraphs with multiple lines. The component should split the text
            into lines and animate each line independently. This creates a
            smooth, professional text reveal effect that works great for
            storytelling and engaging user experiences.
          </p>
        </AnimatedText>
      </section>
    </div>
  );
}
