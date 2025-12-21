'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {t('description')}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            {t('tryAgain')}
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-black dark:text-white font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

