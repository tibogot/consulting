import { getTranslations } from 'next-intl/server';

export default async function LegalPage() {
  const t = await getTranslations('legal');
  
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light mb-8">{t('title')}</h1>
        <div className="space-y-8 text-gray-300">
          <p className="text-lg">
            {t('content')}
          </p>
        </div>
      </div>
    </div>
  );
}
