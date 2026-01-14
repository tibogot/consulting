import GTAScrollRevealReverseGradientV2 from "@/app/components/GTAScrollRevealReverseGradientV2";

export default function GTAScrollReverseDemoV2Page() {
  return (
    <div className="min-h-screen">
      <GTAScrollRevealReverseGradientV2
        backgroundImage1="/codegrid-images/hero-img-layer-1.jpg"
        backgroundImage2="/codegrid-images/hero-img-layer-2.png"
        scrollText="Scroll down to reveal"
        outroText="The journey begins with a single step."
        backgroundColor="#111117"
        overlayColor="#111117"
        textGradientColor="#e66461"
        scrollMultiplier={3}
        enableSmoothScroll={true}
      />
    </div>
  );
}
