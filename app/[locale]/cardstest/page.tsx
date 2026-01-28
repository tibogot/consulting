import PinnedClipPathAnimation from "@/app/components/PinnedClipPathAnimation";
import ServicesHero from "@/app/components/ServicesHero";
import StackingCardsPin from "@/app/components/StackingCardsPin";
import StackingCardsPin3D from "@/app/components/StackingCardsPin3D";
import StickyStackScroll4 from "@/app/components/StickyStackScroll4";
import StickyStackScroll5 from "@/app/components/StickyStackScroll5";
import StickyCards3D from "@/app/components/StickyCards3D";

export default function CardstestPage() {
  return (
    <div className="min-h-screen bg-blue-600 text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Cards test
        </h1>
      </section>
      
      {/* PinnedClipPathAnimation */}
      <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          PinnedClipPathAnimation
        </h2>
      </section>
      <PinnedClipPathAnimation />
      
      {/* ServicesHero */}
      <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          ServicesHero
        </h2>
      </section>
      <ServicesHero />
      
      {/* StackingCardsPin */}
      <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          StackingCardsPin
        </h2>
      </section>
      <StackingCardsPin />
      
      {/* StackingCardsPin3D */}
      <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          StackingCardsPin3D
        </h2>
      </section>
      <StackingCardsPin3D />
      
      {/* StickyStackScroll4 */}
      <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          StickyStackScroll4
        </h2>
      </section>
      <StickyStackScroll4 />
      
      {/* StickyStackScroll5 */}
      <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          StickyStackScroll5
        </h2>
      </section>
      <StickyStackScroll5 />
      
      {/* PinnedImageReveal */}
      {/* <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          PinnedImageReveal
        </h2>
      </section>
      <PinnedImageReveal imageSrc="/alev-takil.jpg" imageAlt="Pinned image reveal" /> */}
      
      {/* StickyCards3D */}
      <section className="bg-black py-16 px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-white mb-8">
          StickyCards3D
        </h2>
      </section>
      <StickyCards3D />
    </div>
  );
}
