"use client";

import ParticleGlobeWebGPU from "@/app/components/ParticleGlobeWebGPU";

export default function ParticleGlobeWebGPUDemoPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#0a0a12]">
      <section className="relative w-full h-svh">
        <ParticleGlobeWebGPU
          className="w-full h-full"
          targetParticles={60000}
        />
      </section>
      <div className="absolute bottom-4 right-4 z-20 text-[10px] text-white/35 bg-black/40 px-2 py-1.5 rounded">
        60k particles · WebGPU + TSL · world map
      </div>
    </main>
  );
}
