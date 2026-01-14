import GTAScrollRevealReverseGradientV3 from "@/app/components/GTAScrollRevealReverseGradientV3";

export default function GTAScrollReverseDemoV3Page() {
  return (
    <div className="">
      {/* Section Before Component */}
      <section className="relative w-full h-screen bg-gray-100 flex justify-center items-center text-center overflow-hidden z-0">
        <div className="max-w-4xl px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Welcome to the Experience
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Scroll down to discover something extraordinary. This animation will
            reveal the hidden beauty beneath the surface.
          </p>
        </div>
      </section>

      <GTAScrollRevealReverseGradientV3 />

      {/* Section After Component */}
      <section className="relative w-full h-screen bg-black flex justify-center items-center text-center overflow-hidden z-0">
        <div className="max-w-4xl px-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            The Journey Continues
          </h2>
          <p className="text-lg md:text-xl text-white leading-relaxed">
            You&apos;ve witnessed the reveal. Now explore what comes next. The
            story doesn&apos;t end here - it&apos;s just beginning.
          </p>
        </div>
      </section>
    </div>
  );
}
