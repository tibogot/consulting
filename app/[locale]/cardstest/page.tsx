import PinnedClipPathAnimation from "@/app/components/PinnedClipPathAnimation";
import LoopingFadeSections from "@/app/components/LoopingFadeSections";
import ServicesHero from "@/app/components/ServicesHero";
import StackingCardsPin from "@/app/components/StackingCardsPin";
import StackingCardsPin3D from "@/app/components/StackingCardsPin3D";
import StickyStackScroll4 from "@/app/components/StickyStackScroll4";
import StickyStackScroll5 from "@/app/components/StickyStackScroll5";
import StickyCards3D from "@/app/components/StickyCards3D";
import HorizontalScrollGallery from "@/app/components/HorizontalScrollGallery";

export default function CardstestPage() {
  return (
    <div className="min-h-screen bg-blue-600 text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Cards test
        </h1>
      </section>

      {/* PinnedClipPathAnimation */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          PinnedClipPathAnimation
        </h2>
      </section>
      <PinnedClipPathAnimation />

      {/* LoopingFadeSections */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          LoopingFadeSections
        </h2>
      </section>
      <section className="bg-black px-6 py-16">
        <LoopingFadeSections />
      </section>

      {/* ServicesHero */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          ServicesHero
        </h2>
      </section>
      <ServicesHero />

      {/* StackingCardsPin */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          StackingCardsPin
        </h2>
      </section>
      <StackingCardsPin />

      {/* StackingCardsPin3D */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          StackingCardsPin3D
        </h2>
      </section>
      <StackingCardsPin3D />

      {/* StickyStackScroll4 */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          StickyStackScroll4
        </h2>
      </section>
      <StickyStackScroll4 />

      {/* StickyStackScroll5 */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
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
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          StickyCards3D
        </h2>
      </section>
      <StickyCards3D />

      {/* HorizontalScrollGallery */}
      <section className="bg-black px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          HorizontalScrollGallery
        </h2>
      </section>
      <HorizontalScrollGallery
        images={[
          "/img-1.jpg",
          "/img-2.jpg",
          "/img-3.jpg",
          "/img-4.jpg",
          "/img-5.jpg",
        ]}
        title="Gallery Showcase"
        subtitle="/ Image Collection"
      />
    </div>
  );
}
