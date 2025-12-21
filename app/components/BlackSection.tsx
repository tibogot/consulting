"use client";

import AnimatedText from "./AnimatedText3";

export default function BlackSection() {
  return (
    <section className="relative text-white min-h-screen bg-black w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
          This is a test text to see if AnimatedText works
        </AnimatedText>
      </div>
    </section>
  );
}
