import { getTranslations } from 'next-intl/server';
import TechnologyShowcase from '@/app/components/TechnologyShowcase';

export default async function TechnologyHubPage() {
  const t = await getTranslations('hubs.technology');
  
  return (
    <div className="w-full min-h-screen bg-black">
      <TechnologyShowcase 
        title={t('title')}
        description={t('description')}
      />
    </div>
  );
}

