'use client';

import { useTranslations } from 'next-intl';
import AnimatedText from '@/app/components/AnimatedText3';

export default function HubsContent() {
  const t = useTranslations('hubs');
  
  return (
    <div className="min-h-screen py-16 px-8">
      <AnimatedText className="text-4xl font-bold mb-8">
        <h1>{t('title')}</h1>
      </AnimatedText>
      <div className="space-y-8">
        <section>
          <AnimatedText className="text-2xl font-semibold mb-4">
            <h2>{t('technology.title')}</h2>
          </AnimatedText>
          <AnimatedText>
            <p>{t('technology.description')}</p>
          </AnimatedText>
        </section>
        <section>
          <AnimatedText className="text-2xl font-semibold mb-4">
            <h2>{t('engineering.title')}</h2>
          </AnimatedText>
          <AnimatedText>
            <p>{t('engineering.description')}</p>
          </AnimatedText>
        </section>
        <section>
          <AnimatedText className="text-2xl font-semibold mb-4">
            <h2>{t('businessOperations.title')}</h2>
          </AnimatedText>
          <AnimatedText>
            <p>{t('businessOperations.description')}</p>
          </AnimatedText>
        </section>
      </div>
    </div>
  );
}

