"use client";

import AnimatedCopy from "./AnimatedCopy";

export default function WhiteSection() {
  return (
    <section className="relative w-full h-screen bg-white text-black px-4 md:px-8 lg:px-12 flex items-center">
      <div className="max-w-6xl">
        <div className="space-y-8 md:space-y-12">
          <div>
            <AnimatedCopy colorInitial="#B8B8B8" colorAccent="#1a1a1a" colorFinal="#8202FF">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal font-pp-neue-montreal mb-6 leading-tight">
                Strategic Excellence, Delivered
              </h2>
            </AnimatedCopy>
            <div className="w-20 h-px bg-black mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <AnimatedCopy colorInitial="#B8B8B8" colorAccent="#8202FF" colorFinal="#1a1a1a">
                <h3 className="text-xl md:text-2xl font-normal font-pp-neue-montreal mb-4">
                  Data-Driven Insights
                </h3>
              </AnimatedCopy>
              <AnimatedCopy colorInitial="#CCCCCC" colorAccent="#6a02cc" colorFinal="#333333">
                <p className="text-base md:text-lg text-black/80 font-pp-neue-montreal leading-relaxed">
                  We leverage advanced analytics and deep market intelligence to uncover hidden opportunities
                  and deliver actionable strategies that drive measurable business outcomes.
                </p>
              </AnimatedCopy>
            </div>

            <div>
              <AnimatedCopy colorInitial="#B8B8B8" colorAccent="#0066CC" colorFinal="#1a1a1a">
                <h3 className="text-xl md:text-2xl font-normal font-pp-neue-montreal mb-4">
                  Collaborative Approach
                </h3>
              </AnimatedCopy>
              <AnimatedCopy colorInitial="#CCCCCC" colorAccent="#004499" colorFinal="#333333">
                <p className="text-base md:text-lg text-black/80 font-pp-neue-montreal leading-relaxed">
                  Your success is our partnership. We work closely with your team, embedding our expertise
                  to build capabilities and ensure sustainable growth long after our engagement.
                </p>
              </AnimatedCopy>
            </div>
          </div>

          <div className="pt-8">
            <AnimatedCopy colorInitial="#D4D4D4" colorAccent="#8B5FFB" colorFinal="#2a2a2a">
              <p className="text-lg md:text-xl text-black/70 font-pp-neue-montreal max-w-3xl">
                Whether you&apos;re navigating digital transformation, optimizing operations,
                or entering new markets, we provide the clarity and confidence to move forward decisively.
              </p>
            </AnimatedCopy>
          </div>
        </div>
      </div>
    </section>
  );
}
