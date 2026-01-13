import GTAScrollReveal from "@/app/components/GTAScrollReveal";

export default function GTAScrollDemoPage() {
  return (
    <div className="min-h-screen">
      <GTAScrollReveal
        backgroundImage1="/codegrid-images/hero-img-layer-1.jpg"
        backgroundImage2="/codegrid-images/hero-img-layer-2.png"
        scrollText="Scroll down to reveal"
        title={
          <>
            Your Amazing <br />
            Project Title <br />
            Goes Here
          </>
        }
        outroText="Welcome to the future of web design."
        backgroundColor="#111117"
        overlayColor="#111117"
        textGradientColor="#e66461"
        scrollMultiplier={5}
        enableSmoothScroll={true}
      />
    </div>
  );
}
