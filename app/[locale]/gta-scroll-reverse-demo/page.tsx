import GTAScrollRevealReverse from "@/app/components/GTAScrollRevealReverse";

export default function GTAScrollReverseDemoPage() {
  return (
    <div className="min-h-screen">
      <GTAScrollRevealReverse
        backgroundImage1="/codegrid-images/hero-img-layer-1.jpg"
        backgroundImage2="/codegrid-images/hero-img-layer-2.png"
        scrollText="Scroll down to reveal"
        title={
          <>
            Reverse Animation <br />
            Experiment 453 <br />
            By Codegrid
          </>
        }
        outroText="The journey begins with a single step."
        backgroundColor="#111117"
        overlayColor="#111117"
        textGradientColor="#e66461"
        scrollMultiplier={5}
        enableSmoothScroll={true}
      />
    </div>
  );
}
