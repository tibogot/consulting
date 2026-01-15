'use client';

import dynamic from 'next/dynamic';

// Dynamically import LottieLoader with SSR disabled to avoid hydration issues
const LottieLoader = dynamic(() => import('@/app/components/LottieLoader'), {
  ssr: false,
});

export default function Loading() {
  return <LottieLoader />;
}

