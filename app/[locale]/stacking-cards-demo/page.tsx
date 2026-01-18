import StackingCardsPin from "@/app/components/StackingCardsPin";

export default function StackingCardsDemoPage() {
  return (
    <div className="w-full bg-black text-white">
      <section className="min-h-[80vh] flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pb-16">
          <p className="font-pp-neue-montreal text-white/60 uppercase tracking-wide text-xs md:text-sm">
            Demo
          </p>
          <h1 className="font-pp-neue-montreal text-4xl md:text-7xl font-normal leading-tight mt-3">
            Scroll down
          </h1>
          <p className="font-pp-neue-montreal text-white/70 text-base md:text-lg mt-4 max-w-2xl">
            The next section pins. The three cards stack on top of each other, then the
            page continues scrolling normally.
          </p>
        </div>
      </section>

      <StackingCardsPin />

      <section className="min-h-[120vh]">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pt-20 pb-28">
          <div className="max-w-3xl font-pp-neue-montreal">
            <h2 className="text-3xl md:text-5xl font-normal leading-tight">
              After the unpin
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg">
              This is regular content after the pinned stack. Keep scrolling to confirm
              there’s no jump or sticky pin left behind.
            </p>
            <div className="mt-10 h-px w-full bg-white/15" />
          </div>
        </div>
      </section>
    </div>
  );
}

