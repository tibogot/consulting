import { getTranslations } from 'next-intl/server';

export default async function ServicesPage() {
  const t = await getTranslations('services');
  
  return (
    <div className="min-h-screen py-16 px-8">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('searchSelection.title')}</h2>
          <p>{t('searchSelection.description')}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('consulting.title')}</h2>
          <p>{t('consulting.description')}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('managed.title')}</h2>
          <p>{t('managed.description')}</p>
        </section>
      </div>
    </div>
  );
}

