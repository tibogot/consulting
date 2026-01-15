"use client";

import dynamic from "next/dynamic";

// Lazy load ShaderBackground5 to avoid blocking initial render
const ShaderBackground = dynamic(
  () => import("./ShaderBackground5"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-black" />
    ),
  }
);

export default function ShaderBackground5Lazy() {
  return <ShaderBackground />;
}