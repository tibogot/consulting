import { getTranslations } from 'next-intl/server';

export default async function CareersPage() {
  const t = await getTranslations('careers');
  
  return (
    <div className="min-h-screen py-16 px-8">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('findJob.title')}</h2>
          <p>{t('findJob.description')}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('workAtSparagus.title')}</h2>
          <p>{t('workAtSparagus.description')}</p>
        </section>
      </div>
    </div>
  );
}

