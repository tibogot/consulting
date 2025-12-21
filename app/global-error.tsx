'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              A critical error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

