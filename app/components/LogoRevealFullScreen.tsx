"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

type LogoRevealFullScreenProps = {
  svgSrc?: string;
  className?: string;
};

export default function LogoRevealFullScreen({
  svgSrc = "/logostroke.svg",
  className = "",
}: LogoRevealFullScreenProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  // Create a stable key so animations re-run only when content changes.
  const svgKey = useMemo(() => svgMarkup ?? "loading", [svgMarkup]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(svgSrc, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${res.status}`);
        return res.text();
      })
      .then((raw) => {
        // Strip fixed size so it becomes responsive in layout.
        // (We'll size it with CSS.)
        const cleaned = raw
          .replace(/\swidth="[^"]*"/i, "")
          .replace(/\sheight="[^"]*"/i, "");
        setSvgMarkup(cleaned);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        // Keep it quiet in prod; component will show fallback.
        console.error(err);
        setSvgMarkup(null);
      });

    return () => controller.abort();
  }, [svgSrc]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (!svgMarkup) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      const svg = root.querySelector("svg") as SVGSVGElement | null;
      const paths = Array.from(root.querySelectorAll("svg path")) as SVGPathElement[];
      const shine = root.querySelector("[data-logo-shine]") as HTMLDivElement | null;

      if (!svg) return;

      // Ensure responsive sizing.
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.style.width = "100%";
      svg.style.height = "auto";
      svg.style.display = "block";

      if (prefersReducedMotion) {
        gsap.set([svg, paths], { clearProps: "all" });
        if (shine) gsap.set(shine, { opacity: 0 });
        return;
      }

      gsap.set(svg, {
        opacity: 1,
        scale: 0.985,
        clipPath: "inset(0 100% 0 0)",
        filter: "drop-shadow(0 0 0px rgba(130, 2, 255, 0))",
        transformOrigin: "50% 50%",
        willChange: "transform, clip-path, filter",
      });

      gsap.set(paths, {
        opacity: 0,
        y: 14,
        scale: 0.99,
        transformOrigin: "50% 50%",
        willChange: "transform, opacity",
      });

      if (shine) {
        gsap.set(shine, {
          xPercent: -140,
          opacity: 0,
          willChange: "transform, opacity",
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.6,
      });

      tl.to(svg, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut" }, 0)
        .to(svg, { scale: 1, duration: 1.1 }, 0.05)
        .to(
          paths,
          { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.035 },
          0.12
        )
        .to(
          svg,
          { filter: "drop-shadow(0 0 26px rgba(130, 2, 255, 0.32))", duration: 0.9 },
          0.15
        )
        .to(
          svg,
          { filter: "drop-shadow(0 0 14px rgba(130, 2, 255, 0.18))", duration: 0.8 },
          0.95
        );

      if (shine) {
        tl.to(
          shine,
          { opacity: 0.35, duration: 0.25, ease: "power2.out" },
          0.2
        ).to(
          shine,
          { xPercent: 140, duration: 1.15, ease: "power2.inOut" },
          0.2
        ).to(shine, { opacity: 0, duration: 0.35, ease: "power2.in" }, 1.0);
      }
    },
    { scope: rootRef, dependencies: [svgKey] }
  );

  return (
    <section
      ref={rootRef}
      className={[
        "relative w-full h-svh overflow-hidden",
        "bg-black",
        "flex items-center justify-center",
        className,
      ].join(" ")}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-radial from-[#8202FF]/18 via-black/0 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/70" />
      </div>

      {/* Logo container */}
      <div className="relative w-[min(1100px,92vw)]">
        {/* Shine sweep */}
        <div
          data-logo-shine
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 45%, rgba(130,2,255,0.35) 55%, rgba(255,255,255,0) 100%)",
            filter: "blur(10px)",
          }}
        />

        {svgMarkup ? (
          <div
            aria-label="Sparagus logo"
            role="img"
            className="select-none"
            // SVG is local/static; we keep it as markup to target internal nodes for GSAP.
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        ) : (
          <div className="text-white/70 font-pp-neue-montreal text-lg">
            Loading logo…
          </div>
        )}
      </div>
    </section>
  );
}

