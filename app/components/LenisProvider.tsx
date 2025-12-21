"use client";

import { ReactLenis } from "lenis/react";

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
