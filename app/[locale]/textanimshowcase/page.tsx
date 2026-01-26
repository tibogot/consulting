import TextAnim from "../../components/TextAnim";
import FractalGradient from "../../components/FractalGradient2";
import AnimatedText from "../../components/AnimatedText3";

export default function TextAnimShowcase() {
  return (
    <div className="w-full min-h-screen bg-black">
      <FractalGradient zIndex={10} position="fixed" />
      {/* Hero Section - 100vh */}
      <section className="relative h-svh flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Content Overlay - Centered */}
        <div className="relative z-20 w-full flex items-center justify-center">
          <AnimatedText
            isHero
            className="text-4xl md:text-7xl font-normal text-white font-pp-neue-montreal text-center"
          >
            <h1>Textanim Showcase</h1>
          </AnimatedText>
        </div>
      </section>

      {/* TextAnim Showcase Section */}
      <section className="relative z-30 py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
          {/* Section Title */}
          <div className="text-center">
            <TextAnim useScrollTrigger={true}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-white font-pp-neue-montreal">
                TextAnim Component Showcase
              </h2>
            </TextAnim>
          </div>

          {/* Large Heading - Immediate Animation */}
          <div className="space-y-4">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              Large Heading - Immediate Animation (no scroll trigger)
            </p>
            <TextAnim useScrollTrigger={false}>
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-normal text-white font-pp-neue-montreal leading-tight">
                Transform Your Digital Experience
              </h3>
            </TextAnim>
          </div>

          {/* Medium Heading - Scroll Trigger */}
          <div className="space-y-4">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              Medium Heading - Scroll Trigger Animation (default blue)
            </p>
            <TextAnim useScrollTrigger={true}>
              <h4 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white font-pp-neue-montreal">
                Lightning-Fast Animations
              </h4>
            </TextAnim>
          </div>

          {/* Custom Color Examples */}
          <div className="space-y-6 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              Custom Color Examples
            </p>
            
            <div className="space-y-4">
              <p className="text-xs text-gray-500 mb-2">Purple (#8202FF)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#8202FF">
                <h4 className="text-3xl md:text-4xl font-normal text-white font-pp-neue-montreal">
                  Purple Lightning Effect
                </h4>
              </TextAnim>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-500 mb-2">Cyan (#00D4FF)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#00D4FF">
                <h4 className="text-3xl md:text-4xl font-normal text-white font-pp-neue-montreal">
                  Cyan Lightning Effect
                </h4>
              </TextAnim>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-500 mb-2">Green (#abff02)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#abff02">
                <h4 className="text-3xl md:text-4xl font-normal text-white font-pp-neue-montreal">
                  Green Lightning Effect
                </h4>
              </TextAnim>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-500 mb-2">Red (#FF3B3B)</p>
              <TextAnim useScrollTrigger={true} lightningColor="#FF3B3B">
                <h4 className="text-3xl md:text-4xl font-normal text-white font-pp-neue-montreal">
                  Red Lightning Effect
                </h4>
              </TextAnim>
            </div>
          </div>

          {/* Smaller Heading - Scroll Trigger */}
          <div className="space-y-4">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              Smaller Heading - Scroll Trigger
            </p>
            <TextAnim useScrollTrigger={true}>
              <h5 className="text-2xl md:text-3xl font-normal text-white font-pp-neue-montreal">
                Character-by-Character Reveal
              </h5>
            </TextAnim>
          </div>

          {/* Paragraph Text - Scroll Trigger */}
          <div className="space-y-4 max-w-4xl">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              Paragraph Text - Scroll Trigger
            </p>
            <TextAnim useScrollTrigger={true}>
              <p className="text-lg md:text-xl text-gray-300 font-pp-neue-montreal leading-relaxed">
                This component creates stunning lightning-style text animations that reveal character by character. 
                Each letter flickers with a blue accent color before settling into its final state. 
                Perfect for creating engaging, eye-catching text effects that draw attention to your content.
              </p>
            </TextAnim>
          </div>

          {/* Multiple Lines - Immediate */}
          <div className="space-y-4">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              Multiple Lines - Immediate Animation
            </p>
            <div className="space-y-2">
              <TextAnim useScrollTrigger={false}>
                <p className="text-xl md:text-2xl text-white font-pp-neue-montreal">
                  First line animates immediately
                </p>
              </TextAnim>
              <TextAnim useScrollTrigger={false}>
                <p className="text-xl md:text-2xl text-white font-pp-neue-montreal">
                  Second line follows right after
                </p>
              </TextAnim>
              <TextAnim useScrollTrigger={false}>
                <p className="text-xl md:text-2xl text-white font-pp-neue-montreal">
                  Third line completes the sequence
                </p>
              </TextAnim>
            </div>
          </div>

          {/* Mixed Sizes - Scroll Trigger */}
          <div className="space-y-6 max-w-5xl">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              Mixed Text Sizes - All with Scroll Trigger
            </p>
            <TextAnim useScrollTrigger={true}>
              <h3 className="text-5xl md:text-6xl font-normal text-white font-pp-neue-montreal mb-4">
                Large Title
              </h3>
            </TextAnim>
            <TextAnim useScrollTrigger={true}>
              <h4 className="text-3xl md:text-4xl font-normal text-white font-pp-neue-montreal mb-3">
                Medium Subtitle
              </h4>
            </TextAnim>
            <TextAnim useScrollTrigger={true}>
              <p className="text-base md:text-lg text-gray-300 font-pp-neue-montreal">
                Smaller body text that complements the larger headings above. 
                The animation creates a cohesive visual flow as you scroll through the content.
              </p>
            </TextAnim>
          </div>

          {/* Call to Action - Scroll Trigger */}
          <div className="text-center pt-8">
            <TextAnim useScrollTrigger={true}>
              <p className="text-2xl md:text-3xl font-normal text-white font-pp-neue-montreal">
                Ready to add this effect to your project?
              </p>
            </TextAnim>
          </div>
        </div>
      </section>
    </div>
  );
}
