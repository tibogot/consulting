import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-4 font-pp-neue-montreal antialiased md:px-8">
      <div className="w-full max-w-2xl text-center">
        <p className="text-sm text-white/60 md:text-base">Not found</p>
        <div className="mt-4 h-px w-full bg-white/20" />
        <h1 className="mt-8 text-7xl font-normal leading-[1.1] text-white md:text-8xl">
          404
        </h1>
        <h2 className="mt-6 text-3xl font-normal leading-tight text-white md:text-4xl">
          Page Not Found
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/80">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-block bg-[#8202FF] px-8 py-3 text-base text-white transition-colors hover:bg-[#6a02cc]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
