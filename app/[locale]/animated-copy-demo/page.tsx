import AnimatedCopy from "../../components/AnimatedCopy";

export default function AnimatedCopyDemo() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-svh flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/videohero-poster.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 z-0" />
        </div>

        {/* Content Overlay - Bottom positioned */}
        <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 md:pb-12 lg:pb-16 mt-auto">
          {/* Left side - Title */}
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-normal text-white mb-4 md:mb-6 font-pp-neue-montreal text-left">
              AnimatedCopy Component
            </h1>
            <p className="text-base md:text-lg text-white/80 font-pp-neue-montreal max-w-lg">
              Scroll-triggered character reveal animation. Each character transitions through three color stages as you scroll, creating a terminal-style text reveal effect.
            </p>
          </div>

          {/* Right side - CTA Button */}
          <div className="flex items-end">
            <div className="w-12 h-12 bg-[#8202FF] rounded-sm flex items-center justify-center">
              <svg
                className="text-white w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* AnimatedCopy Demo Section */}
      <section className="relative w-full min-h-screen bg-black py-20 px-4 md:px-8 space-y-32">
        {/* Section Title */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-16 font-pp-neue-montreal">
            AnimatedCopy Component Demo
          </h2>
          <p className="text-lg text-white/70 font-pp-neue-montreal mb-16 max-w-3xl">
            Scroll through the page to see each example animate as it enters the viewport. 
            Each character transitions through three color stages: initial → accent → final.
          </p>
        </div>

        {/* Example 1: Default Props */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-white/60 font-mono mb-4">
            {/* Default: colorInitial="#dddddd" colorAccent="#abff02" colorFinal="#000000" */}
            <code className="text-[#abff02]">
              &lt;AnimatedCopy&gt; {/* Default colors */}
            </code>
          </div>
          <AnimatedCopy>
            <p className="text-2xl md:text-3xl font-medium text-white font-pp-neue-montreal leading-relaxed">
              This is the default AnimatedCopy with the original terminal-style
              colors. As you scroll, each character transitions from light gray
              to bright green accent, then to black. Perfect for that retro
              terminal aesthetic.
            </p>
          </AnimatedCopy>
        </div>

        {/* Example 2: Custom Purple Theme */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-white/60 font-mono mb-4">
            <code className="text-[#8202FF]">
              {`<AnimatedCopy colorInitial="#666666" colorAccent="#8202FF" colorFinal="#ffffff">`}
            </code>
          </div>
          <AnimatedCopy
            colorInitial="#666666"
            colorAccent="#8202FF"
            colorFinal="#ffffff"
          >
            <p className="text-2xl md:text-3xl font-medium text-white font-pp-neue-montreal leading-relaxed">
              Custom purple theme for a more modern look. The characters reveal
              with your brand color, creating a sleek and professional animation
              that matches your design system perfectly.
            </p>
          </AnimatedCopy>
        </div>

        {/* Example 3: Blue Gradient Theme */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-white/60 font-mono mb-4">
            <code className="text-[#00D4FF]">
              {`<AnimatedCopy colorInitial="#444444" colorAccent="#00D4FF" colorFinal="#ffffff">`}
            </code>
          </div>
          <AnimatedCopy
            colorInitial="#444444"
            colorAccent="#00D4FF"
            colorFinal="#ffffff"
          >
            <p className="text-2xl md:text-3xl font-medium text-white font-pp-neue-montreal leading-relaxed">
              A vibrant cyan accent creates an energetic and tech-forward feel.
              Great for highlighting innovative ideas or cutting-edge technology
              content that needs to stand out.
            </p>
          </AnimatedCopy>
        </div>

        {/* Example 4: Multiple Children */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-white/60 font-mono mb-4">
            <code className="text-[#FF6B6B]">
              &lt;AnimatedCopy&gt; {/* Multiple children */}
            </code>
          </div>
          <AnimatedCopy
            colorInitial="#555555"
            colorAccent="#FF6B6B"
            colorFinal="#ffffff"
          >
            <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 font-pp-neue-montreal">
              Multiple Children Support
            </h3>
            <p className="text-xl md:text-2xl font-medium text-white/90 font-pp-neue-montreal leading-relaxed mb-4">
              You can wrap multiple elements. Each paragraph and heading will
              animate independently, creating a layered text reveal effect.
            </p>
            <p className="text-xl md:text-2xl font-medium text-white/90 font-pp-neue-montreal leading-relaxed">
              Perfect for complex layouts where you want consistent animation
              behavior across different text elements in the same section.
            </p>
          </AnimatedCopy>
        </div>

        {/* Example 5: Heading with Custom Red Theme */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-white/60 font-mono mb-4">
            <code className="text-[#FF3B3B]">
              {`<AnimatedCopy colorInitial="#888888" colorAccent="#FF3B3B" colorFinal="#ffffff">`}
            </code>
          </div>
          <AnimatedCopy
            colorInitial="#888888"
            colorAccent="#FF3B3B"
            colorFinal="#ffffff"
          >
            <h2 className="text-4xl md:text-5xl font-medium text-white font-pp-neue-montreal leading-tight">
              Works beautifully with headings of any size. The scroll-triggered
              character reveal adds depth and engagement to your hero sections.
            </h2>
          </AnimatedCopy>
        </div>

        {/* Example 6: Orange Theme */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-white/60 font-mono mb-4">
            <code className="text-[#FF8C42]">
              {`<AnimatedCopy colorInitial="#555555" colorAccent="#FF8C42" colorFinal="#ffffff">`}
            </code>
          </div>
          <AnimatedCopy
            colorInitial="#555555"
            colorAccent="#FF8C42"
            colorFinal="#ffffff"
          >
            <p className="text-2xl md:text-3xl font-medium text-white font-pp-neue-montreal leading-relaxed">
              An orange accent brings warmth and creativity to your content. 
              Ideal for showcasing innovative projects or creative portfolios 
              that need a vibrant, energetic feel.
            </p>
          </AnimatedCopy>
        </div>

        {/* Example 7: Minimal White on Dark */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-white/60 font-mono mb-4">
            <code className="text-[#ffffff]">
              {`<AnimatedCopy colorInitial="#444444" colorAccent="#ffffff" colorFinal="#ffffff">`}
            </code>
          </div>
          <AnimatedCopy
            colorInitial="#444444"
            colorAccent="#ffffff"
            colorFinal="#ffffff"
          >
            <p className="text-2xl md:text-3xl font-medium text-white font-pp-neue-montreal leading-relaxed">
              A clean, minimal approach with white on dark. The subtle reveal 
              adds sophistication without being distracting, perfect for 
              professional and elegant designs.
            </p>
          </AnimatedCopy>
        </div>

        {/* Component Props Documentation */}
        <div className="max-w-4xl mx-auto space-y-6 pt-16 border-t border-white/10">
          <h3 className="text-3xl md:text-4xl font-medium text-white mb-8 font-pp-neue-montreal">
            Available Props
          </h3>
          <div className="space-y-4 text-white/80 font-pp-neue-montreal">
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <code className="text-[#abff02] text-sm block mb-2">colorInitial?: string</code>
              <p className="text-base">The initial color of characters before scrolling. Default: "#dddddd"</p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <code className="text-[#abff02] text-sm block mb-2">colorAccent?: string</code>
              <p className="text-base">The accent color shown when a character is revealed. Default: "#abff02"</p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <code className="text-[#abff02] text-sm block mb-2">colorFinal?: string</code>
              <p className="text-base">The final color after the reveal animation completes. Default: "#000000"</p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <code className="text-[#abff02] text-sm block mb-2">children: React.ReactNode</code>
              <p className="text-base">Text content to animate. Can be a single element or multiple elements.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
