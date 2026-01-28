"use client";

import ManagedServicesHero from "@/app/components/ManagedServicesHero";

export default function ManagedServicesPage() {
  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section */}
      <ManagedServicesHero
        title="Managed Services"
        description="End-to-end operations management. From infrastructure to delivery, we handle the complexity so your team can focus on what matters."
      />
    </div>
  );
}
