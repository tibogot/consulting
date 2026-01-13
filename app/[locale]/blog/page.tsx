import MaskScrollReveal from "@/app/components/MaskScrollReveal/MaskScrollReveal";

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <MaskScrollReveal imageSrc="/img-1.jpg" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog content will be added here */}
      </div>
    </div>
  );
}
