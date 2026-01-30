import { getTranslations } from "next-intl/server";
import ManagedServicesHero from "@/app/components/ManagedServicesHero";
import AnimatedText from "@/app/components/AnimatedText3";
import { Link } from "@/i18n/routing";

export default async function AboutUsPage() {
  const t = await getTranslations("about.us");

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section (same concept as Managed Services) */}
      <ManagedServicesHero
        title={t("title")}
        description={t("description")}
        imageSrc="/alev-takil.jpg"
        imageAlt="About Us Hero"
      />
      <section className="relative w-full bg-black px-4 py-4 md:px-8">
        <div className="w-full">
          {/* <AnimatedCopy colorInitial="#666666" colorAccent="#8202FF" colorFinal="#ffffff">          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-left font-pp-neue-montreal text-white tracking-[-0.02em] leading-[1.05] max-w-4xl">
            Strategy that ships. Systems that scale. Results you can measure.
          </h2>
          </AnimatedCopy> */}

          <div className="mt-12 h-px w-full bg-white/20" />

          <p className="pt-6 font-pp-neue-montreal text-sm text-white md:text-base">
            Built for modern teams
          </p>

          <div className="mt-14 flex flex-col items-end gap-10 md:mt-32 md:flex-row">
            <div className="hidden md:block md:w-1/2">
              <AnimatedText>
                <h3 className="font-pp-neue-montreal text-5xl leading-tight font-normal text-white">
                  At the intersection of talent and transformation, Sparagus is
                  designed to be a leader.
                </h3>
              </AnimatedText>
            </div>

            <div className="md:w-1/2">
              <div>
                <AnimatedText>
                  <p className="max-w-lg font-pp-neue-montreal text-sm leading-relaxed text-white md:text-base">
                    We partner with your team to define the real problem, agree
                    on success metrics, and shape an executable plan—scope,
                    constraints, owners, milestones, and trade-offs.
                  </p>
                </AnimatedText>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 font-pp-neue-montreal text-sm text-white transition-opacity hover:opacity-80 md:text-base"
                >
                  Explore services <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="text-white text-sm md:text-base font-pp-neue-montreal">
                  Clarity, fast
                </h3>
                <p className="mt-4 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal">
                  Sharp research, practical strategy, and decision-ready
                  artifacts—so your team stops debating and starts building.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  See how we work <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-white/20" />
              <div className="pt-6">
                <h3 className="text-white text-sm md:text-base font-pp-neue-montreal">
                  Delivery you can trust
                </h3>
                <p className="mt-4 text-white text-sm md:text-base leading-relaxed font-pp-neue-montreal">
                  Clean execution, predictable cadence, and measurable progress—
                  built with maintainability and long-term ownership in mind.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity text-sm md:text-base font-pp-neue-montreal"
                >
                  View case studies <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* AnimatedText showcase – stress test: many blocks, varied sizes, long copy */}
      <section className="relative w-full bg-black px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 h-px w-full bg-white/20" />
          <p className="mb-16 font-pp-neue-montreal text-sm text-white/60 md:text-base">
            AnimatedText showcase — scroll through to check for jitter
          </p>

          <div className="space-y-20 md:space-y-28">
            <AnimatedText>
              <h2 className="font-pp-neue-montreal text-4xl font-normal leading-tight text-white md:text-5xl lg:text-6xl">
                Large headline to test line splitting and reveal on scroll.
              </h2>
            </AnimatedText>

            <AnimatedText delay={0.1}>
              <p className="max-w-2xl font-pp-neue-montreal text-base leading-relaxed text-white/90 md:text-lg">
                This is a medium-length paragraph. We use AnimatedText here to
                reveal it line by line as you scroll. If the issue comes from
                AnimatedText plus Lenis, you may notice stutter or jitter when
                this block enters the viewport or when several blocks are
                animating at once.
              </p>
            </AnimatedText>

            <AnimatedText>
              <h3 className="font-pp-neue-montreal text-2xl font-normal text-white md:text-3xl">
                Smaller subhead — still multiple lines on most viewports.
              </h3>
            </AnimatedText>

            <AnimatedText delay={0.15}>
              <p className="max-w-2xl font-pp-neue-montreal text-sm leading-relaxed text-white/80 md:text-base">
                A long paragraph to really stress the component: Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                We add more lines so that SplitText creates many masks and you
                can see how several AnimatedText blocks behave when they stack
                in one scroll range.
              </p>
            </AnimatedText>

            <AnimatedText>
              <h2 className="font-pp-neue-montreal text-3xl font-normal text-white md:text-4xl">
                Another big title to trigger another ScrollTrigger in the same
                section.
              </h2>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <p className="max-w-2xl font-pp-neue-montreal text-base leading-relaxed text-white/90">
                Final block: short intro then a long run. The goal is to have
                plenty of text in different sizes and lengths, all using
                AnimatedText, so we can see if scroll stays smooth or if we get
                jitter when many triggers are active. If the problem is
                elsewhere, this section should scroll fine. If it is AnimatedText
                plus Lenis, this area is where it will show up most clearly.
              </p>
            </AnimatedText>

            <AnimatedText>
              <p className="font-pp-neue-montreal text-xs uppercase tracking-wider text-white/50">
                End of AnimatedText showcase — small label, one or two lines.
              </p>
            </AnimatedText>
          </div>
        </div>
      </section>
    </div>
  );
}
