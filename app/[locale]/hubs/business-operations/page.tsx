import Image from "next/image";

export default function BusinessOperationsHubPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      <section className=" w-full px-4 md:px-8 pt-64 pb-20">
        <h1 className="text-left text-white font-pp-neue-montreal font-normal text-5xl md:text-7xl max-w-3xl tracking-[-0.02em]">
          Business operations, built to scale.
        </h1>

        <div className="mt-20 relative h-[80vh] w-full -mx-4 md:-mx-8 overflow-hidden">
          <Image
            src="/mario-gogh.jpg"
            alt="Business operations"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 1024px, 100vw"
          />
        </div>

        <p className="mt-8 text-white/80 font-pp-neue-montreal text-base md:text-lg leading-relaxed max-w-3xl">
          We streamline processes, automate reporting, and improve execution so teams can operate faster and with confidence.
        </p>
      </section>
    </div>
  );
}

