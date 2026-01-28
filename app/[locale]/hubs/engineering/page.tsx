import AnimatedText from "@/app/components/AnimatedText3";
import AnimatedClipPathImage from "@/app/components/AnimatedClipPathImage";

export default function EngineeringHubPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black">
      <section className="w-full overflow-x-hidden pt-64 pb-20">
        <div className="px-4 md:px-8">
          <AnimatedText isHero className="overflow-visible">
            <h1 className="max-w-3xl text-left font-pp-neue-montreal text-5xl font-normal tracking-[-0.02em] text-white md:text-7xl">
              From prototype to production.
            </h1>
          </AnimatedText>
        </div>

        <div className="relative mt-20 h-[80vh] w-full overflow-hidden">
          <AnimatedClipPathImage
            src="/thisisengineering.jpg"
            alt="Engineering"
            className="h-full"
            sizes="(min-width: 768px) 1024px, 100vw"
          />
        </div>
      </section>
    </div>
  );
}
