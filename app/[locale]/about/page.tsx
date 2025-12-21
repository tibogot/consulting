import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');
  
  return (
    <div className="min-h-screen py-16 px-8">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('us.title')}</h2>
          <p>{t('us.description')}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('mission.title')}</h2>
          <p>{t('mission.description')}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('team.title')}</h2>
          <p>{t('team.description')}</p>
        </section>
      </div>
    </div>
  );
}

