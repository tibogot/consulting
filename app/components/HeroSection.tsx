'use client';

import ShaderBackground from './ShaderBackground4';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
      {/* Shader Background */}
      <div className="absolute inset-0 -z-10">
        <ShaderBackground />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/images/logosvg.svg"
            alt="Sparagus Logo"
            className="w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-auto"
          />
        </div>
      </div>
    </section>
  );
}

