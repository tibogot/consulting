import { getTranslations } from 'next-intl/server';
import StackingCardsPin from '@/app/components/StackingCardsPin';

export default async function AboutUsPage() {
  const t = await getTranslations('about.us');
  
  return (
    <div className="w-full bg-black text-white">
      {/* 100svh first section */}
      <section className="relative w-full h-svh flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pb-16">
          <p className="font-pp-neue-montreal text-white/60 uppercase tracking-wide text-xs md:text-sm">
            About
          </p>
          <h1 className="mt-3 font-pp-neue-montreal text-4xl md:text-7xl font-normal leading-tight">
            {t('title')}
          </h1>
          <p className="mt-4 font-pp-neue-montreal text-white/70 text-base md:text-lg max-w-3xl">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Second section */}
      <StackingCardsPin />

      {/* Third section */}
      <section className="relative w-full h-svh bg-blue-700 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 h-full flex items-center">
          <div className="font-pp-neue-montreal max-w-3xl">
            <p className="text-white/70 uppercase tracking-wide text-xs md:text-sm">
              Next
            </p>
            <h2 className="mt-3 text-4xl md:text-6xl font-normal leading-tight">
              A clear operating model
            </h2>
            <p className="mt-5 text-white/85 text-base md:text-lg leading-relaxed">
              We translate strategy into execution by designing the systems, rituals, and
              accountability that keep teams aligned—especially when priorities change fast.
            </p>
            <p className="mt-4 text-white/75 text-base md:text-lg leading-relaxed">
              The goal is simple: reduce friction, increase throughput, and make progress
              visible across product, engineering, and business.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

