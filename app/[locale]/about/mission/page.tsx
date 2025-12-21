import { getTranslations } from 'next-intl/server';

export default async function MissionPage() {
  const t = await getTranslations('about.mission');
  
  return (
    <div className="min-h-screen py-16 px-8">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <p className="text-lg">{t('description')}</p>
    </div>
  );
}

