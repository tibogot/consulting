import TextAnim from "../../components/TextAnim";
import FractalGradient from "../../components/FractalGradient2";
import AnimatedText from "../../components/AnimatedText3";
import { getTranslations } from "next-intl/server";

export default async function TextAnimShowcase() {
  const t = await getTranslations("careers.workAtSparagus");
  return (
    <div className="min-h-screen w-full bg-black">
      <FractalGradient zIndex={10} position="fixed" />
      {/* Hero Section - 100vh */}
      <section className="relative flex h-svh flex-col overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 z-0 bg-black/40" />

        {/* Content Overlay - Centered */}
        <div className="relative z-20 flex w-full items-center justify-center">
          <AnimatedText
            isHero
            className="text-center font-pp-neue-montreal text-4xl font-normal text-white md:text-7xl"
          >
            <h1>Textanim Showcase</h1>
          </AnimatedText>
        </div>
      </section>

      {/* TextAnim Showcase Section */}
      <section className="relative z-30 bg-black px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-24">
          {/* Section Title */}
          <div className="text-center">
            <TextAnim useScrollTrigger={true}>
              <h2 className="font-pp-neue-montreal text-3xl font-normal text-white md:text-5xl lg:text-6xl">
                TextAnim Component Showcase
              </h2>
            </TextAnim>
          </div>

          {/* Large Heading - Immediate Animation */}
          <div className="space-y-4">
            <p className="mb-6 text-sm tracking-wider text-gray-400 uppercase">
              Large Heading - Immediate Animation (no scroll trigger)
            </p>
            <TextAnim useScrollTrigger={false}>
              <h3 className="font-pp-neue-montreal text-4xl leading-tight font-normal text-white md:text-6xl lg:text-7xl">
                Transform Your Digital Experience
              </h3>
            </TextAnim>
          </div>

          {/* Medium Heading - Scroll Trigger */}
          <div className="space-y-4">
            <p className="mb-6 text-sm tracking-wider text-gray-400 uppercase">
              Medium Heading - Scroll Trigger Animation (default blue)
            </p>
            <TextAnim useScrollTrigger={true}>
              <h4 className="font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl lg:text-5xl">
                Lightning-Fast Animations
              </h4>
            </TextAnim>
          </div>

          {/* Custom Color Examples */}
          <div className="space-y-6 border-t border-gray-800 pt-8">
            <p className="mb-6 text-sm tracking-wider text-gray-400 uppercase">
              Custom Color Examples
            </p>

            <div className="space-y-4">
              <p className="mb-2 text-xs text-gray-500">Purple (#8202FF)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
                <h4 className="font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl">
                  Purple Lightning Effect
                </h4>
              </TextAnim>
            </div>

            <div className="space-y-4">
              <p className="mb-2 text-xs text-gray-500">Cyan (#00D4FF)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#00D4FF">
                <h4 className="font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl">
                  Cyan Lightning Effect
                </h4>
              </TextAnim>
            </div>

            <div className="space-y-4">
              <p className="mb-2 text-xs text-gray-500">Green (#abff02)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#abff02">
                <h4 className="font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl">
                  Green Lightning Effect
                </h4>
              </TextAnim>
            </div>

            <div className="space-y-4">
              <p className="mb-2 text-xs text-gray-500">Red (#FF3B3B)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#FF3B3B">
                <h4 className="font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl">
                  Red Lightning Effect
                </h4>
              </TextAnim>
            </div>
          </div>

          {/* Smaller Heading - Scroll Trigger */}
          <div className="space-y-4">
            <p className="mb-6 text-sm tracking-wider text-gray-400 uppercase">
              Smaller Heading - Scroll Trigger
            </p>
            <TextAnim useScrollTrigger={true}>
              <h5 className="font-pp-neue-montreal text-2xl font-normal text-white md:text-3xl">
                Character-by-Character Reveal
              </h5>
            </TextAnim>
          </div>

          {/* Paragraph Text - Scroll Trigger */}
          <div className="max-w-4xl space-y-4">
            <p className="mb-6 text-sm tracking-wider text-gray-400 uppercase">
              Paragraph Text - Scroll Trigger
            </p>
            <TextAnim useScrollTrigger={true}>
              <p className="font-pp-neue-montreal text-lg leading-relaxed text-gray-300 md:text-xl">
                This component creates stunning lightning-style text animations
                that reveal character by character. Each letter flickers with a
                blue accent color before settling into its final state. Perfect
                for creating engaging, eye-catching text effects that draw
                attention to your content.
              </p>
            </TextAnim>
          </div>

          {/* Multiple Lines - Immediate */}
          <div className="space-y-4">
            <p className="mb-6 text-sm tracking-wider text-gray-400 uppercase">
              Multiple Lines - Immediate Animation
            </p>
            <div className="space-y-2">
              <TextAnim useScrollTrigger={false}>
                <p className="font-pp-neue-montreal text-xl text-white md:text-2xl">
                  First line animates immediately
                </p>
              </TextAnim>
              <TextAnim useScrollTrigger={false}>
                <p className="font-pp-neue-montreal text-xl text-white md:text-2xl">
                  Second line follows right after
                </p>
              </TextAnim>
              <TextAnim useScrollTrigger={false}>
                <p className="font-pp-neue-montreal text-xl text-white md:text-2xl">
                  Third line completes the sequence
                </p>
              </TextAnim>
            </div>
          </div>

          {/* Mixed Sizes - Scroll Trigger */}
          <div className="max-w-5xl space-y-6">
            <p className="mb-6 text-sm tracking-wider text-gray-400 uppercase">
              Mixed Text Sizes - All with Scroll Trigger
            </p>
            <TextAnim useScrollTrigger={true}>
              <h3 className="mb-4 font-pp-neue-montreal text-5xl font-normal text-white md:text-6xl">
                Large Title
              </h3>
            </TextAnim>
            <TextAnim useScrollTrigger={true}>
              <h4 className="mb-3 font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl">
                Medium Subtitle
              </h4>
            </TextAnim>
            <TextAnim useScrollTrigger={true}>
              <p className="font-pp-neue-montreal text-base text-gray-300 md:text-lg">
                Smaller body text that complements the larger headings above.
                The animation creates a cohesive visual flow as you scroll
                through the content.
              </p>
            </TextAnim>
          </div>

          {/* Call to Action - Scroll Trigger */}
          <div className="pt-8 text-center">
            <TextAnim useScrollTrigger={true}>
              <p className="font-pp-neue-montreal text-2xl font-normal text-white md:text-3xl">
                Ready to add this effect to your project?
              </p>
            </TextAnim>
          </div>
        </div>
      </section>

      {/* Work at Sparagus Content */}
      {/* Hero Section */}
      <section className="relative z-30 flex h-svh items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <TextAnim useScrollTrigger={false} lightningColor="#8202FF">
            <h1 className="font-pp-neue-montreal text-5xl leading-tight font-normal text-white md:text-7xl lg:text-8xl xl:text-9xl">
              {t("title")}
            </h1>
          </TextAnim>
        </div>
      </section>

      {/* Description Section */}
      <section className="relative z-30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center font-pp-neue-montreal text-lg text-white md:text-xl">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Content Section with TextAnim */}
      <section className="relative z-30 bg-black px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">
          {/* Section Title */}
          <div className="text-center">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h2 className="font-pp-neue-montreal text-4xl leading-tight font-normal text-white md:text-5xl lg:text-6xl">
                Why Work at Sparagus
              </h2>
            </TextAnim>
          </div>

          {/* Paragraph 1 */}
          <div className="mx-auto max-w-4xl">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-center font-pp-neue-montreal text-lg leading-relaxed text-white/90 md:text-xl">
                We&apos;re building a team of exceptional individuals who are
                passionate about connecting talent with opportunity. At
                Sparagus, you&apos;ll work alongside industry leaders who value
                innovation, collaboration, and meaningful impact.
              </p>
            </TextAnim>
          </div>

          {/* Subtitle */}
          <div className="mx-auto max-w-5xl pt-8">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h3 className="text-center font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl">
                Growth and Development
              </h3>
            </TextAnim>
          </div>

          {/* Paragraph 2 */}
          <div className="mx-auto max-w-4xl">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-center font-pp-neue-montreal text-lg leading-relaxed text-white/90 md:text-xl">
                Your career growth is our priority. We invest in continuous
                learning, provide mentorship opportunities, and create pathways
                for advancement. Whether you&apos;re starting your journey or
                looking to take the next step, we&apos;re here to support your
                professional development.
              </p>
            </TextAnim>
          </div>

          {/* Subtitle 2 */}
          <div className="mx-auto max-w-5xl pt-8">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h3 className="text-center font-pp-neue-montreal text-3xl leading-tight font-normal text-white md:text-4xl lg:text-5xl">
                Collaborative Culture
              </h3>
            </TextAnim>
          </div>

          {/* Paragraph 3 */}
          <div className="mx-auto max-w-4xl">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-center font-pp-neue-montreal text-lg leading-relaxed text-white/90 md:text-xl">
                We believe that the best results come from diverse perspectives
                working together. Our culture encourages open communication,
                creative problem-solving, and a shared commitment to excellence.
                Join a team where your voice matters and your contributions make
                a difference.
              </p>
            </TextAnim>
          </div>
        </div>
      </section>

      {/* White Background Section */}
      <section className="relative z-30 bg-white px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">
          {/* Section Title */}
          <div className="text-center">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h2 className="font-pp-neue-montreal text-4xl leading-tight font-normal text-black md:text-5xl lg:text-6xl">
                Join Our Team
              </h2>
            </TextAnim>
          </div>

          {/* Paragraph 1 */}
          <div className="mx-auto max-w-4xl">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-center font-pp-neue-montreal text-lg leading-relaxed text-black/80 md:text-xl">
                We&apos;re always looking for talented individuals who share our
                passion for excellence and innovation. If you&apos;re ready to
                make an impact and grow with a dynamic team, we&apos;d love to
                hear from you.
              </p>
            </TextAnim>
          </div>

          {/* Subtitle */}
          <div className="mx-auto max-w-5xl pt-8">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <h3 className="text-center font-pp-neue-montreal text-3xl font-normal text-black md:text-4xl">
                Open Positions
              </h3>
            </TextAnim>
          </div>

          {/* Paragraph 2 */}
          <div className="mx-auto max-w-4xl">
            <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
              <p className="text-center font-pp-neue-montreal text-lg leading-relaxed text-black/80 md:text-xl">
                Explore our current openings and find the perfect role that
                matches your skills and aspirations. We offer competitive
                packages, flexible working arrangements, and opportunities for
                professional growth.
              </p>
            </TextAnim>
          </div>
        </div>
      </section>
    </div>
  );
}
