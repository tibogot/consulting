'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function LottieLoader() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Fetch the Lottie animation JSON from public folder
    fetch('/images/spar.json')
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
      })
      .catch((error) => {
        console.error('Error loading Lottie animation:', error);
      });
  }, []);

  const handleComplete = () => {
    // Mark page loader as complete
    document.documentElement.classList.add('page-loader-complete');
    
    // Dispatch custom event for other components listening
    window.dispatchEvent(new CustomEvent('pageLoaderComplete'));
  };

  // Show blank screen while fetching animation data (Lottie will appear shortly)
  if (!animationData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black" />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-4xl px-4">
        <Lottie
          animationData={animationData}
          loop={false}
          autoplay={true}
          onComplete={handleComplete}
          className="w-full h-auto"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    </div>
  );
}
