export default function ClampTestPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-[clamp(20rem,92vw,76rem)] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(3.5rem,8vw,7rem)]">
        <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-[clamp(0.75rem,1.3vw,1rem)] py-[clamp(0.4rem,0.8vw,0.55rem)] text-[clamp(0.75rem,0.9vw,0.9rem)] tracking-wide text-white/80">
          Clamp playground (resize the window)
        </p>

        <h1 className="mt-[clamp(1rem,2vw,1.5rem)] text-[clamp(2.1rem,5.5vw,4.25rem)] font-semibold tracking-tight leading-[1.02]">
          Managed services that scale smoothly — no breakpoints.
        </h1>

        <p className="mt-[clamp(0.9rem,1.8vw,1.5rem)] max-w-[clamp(22rem,65vw,46rem)] text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[clamp(1.5,2vw,1.8)] text-white/70">
          This page is intentionally built with multiple CSS clamp() values inside Tailwind arbitrary utilities. Watch the typography, spacing, and
          layout change fluidly as the viewport grows and shrinks.
        </p>

        <div className="mt-[clamp(1.25rem,3vw,2.25rem)] flex flex-wrap items-center gap-[clamp(0.75rem,1.8vw,1.25rem)]">
          <a
            href="#"
            className="rounded-[clamp(0.9rem,1.8vw,1.25rem)] bg-white px-[clamp(1rem,2.2vw,1.5rem)] py-[clamp(0.7rem,1.5vw,0.95rem)] text-[clamp(0.95rem,1vw,1.05rem)] font-medium text-zinc-950"
          >
            Primary action
          </a>
          <a
            href="#"
            className="rounded-[clamp(0.9rem,1.8vw,1.25rem)] border border-white/20 bg-white/5 px-[clamp(1rem,2.2vw,1.5rem)] py-[clamp(0.7rem,1.5vw,0.95rem)] text-[clamp(0.95rem,1vw,1.05rem)] font-medium text-white"
          >
            Secondary action
          </a>
        </div>

        <div className="mt-[clamp(2rem,4.5vw,3.25rem)] grid grid-cols-1 gap-[clamp(0.9rem,2.4vw,1.5rem)] md:grid-cols-3">
          <div className="rounded-[clamp(1rem,2vw,1.5rem)] border border-white/10 bg-white/5 p-[clamp(1rem,2.4vw,1.75rem)]">
            <p className="text-[clamp(0.85rem,0.95vw,0.95rem)] font-medium tracking-wide text-white/70">
              Typography clamp
            </p>
            <p className="mt-[clamp(0.6rem,1.2vw,0.9rem)] text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold leading-tight">
              Title scales continuously
            </p>
            <p className="mt-[clamp(0.55rem,1vw,0.8rem)] text-[clamp(0.95rem,1.1vw,1.05rem)] leading-relaxed text-white/70">
              Example: <span className="font-mono text-white/90">text-[clamp(1.35rem,2.2vw,1.75rem)]</span>
            </p>
          </div>

          <div className="rounded-[clamp(1rem,2vw,1.5rem)] border border-white/10 bg-white/5 p-[clamp(1rem,2.4vw,1.75rem)]">
            <p className="text-[clamp(0.85rem,0.95vw,0.95rem)] font-medium tracking-wide text-white/70">
              Spacing clamp
            </p>
            <p className="mt-[clamp(0.6rem,1.2vw,0.9rem)] text-[clamp(1.15rem,1.7vw,1.45rem)] font-semibold leading-tight">
              Padding & gaps scale too
            </p>
            <div className="mt-[clamp(0.75rem,1.6vw,1rem)] flex flex-col gap-[clamp(0.6rem,1.2vw,0.9rem)]">
              <div className="rounded-[clamp(0.8rem,1.6vw,1.1rem)] bg-white/10 px-[clamp(0.75rem,1.6vw,1rem)] py-[clamp(0.55rem,1.2vw,0.75rem)] text-[clamp(0.9rem,1vw,1rem)] text-white/80">
                Box A (fluid padding)
              </div>
              <div className="rounded-[clamp(0.8rem,1.6vw,1.1rem)] bg-white/10 px-[clamp(0.75rem,1.6vw,1rem)] py-[clamp(0.55rem,1.2vw,0.75rem)] text-[clamp(0.9rem,1vw,1rem)] text-white/80">
                Box B (fluid gap above)
              </div>
            </div>
          </div>

          <div className="rounded-[clamp(1rem,2vw,1.5rem)] border border-white/10 bg-white/5 p-[clamp(1rem,2.4vw,1.75rem)]">
            <p className="text-[clamp(0.85rem,0.95vw,0.95rem)] font-medium tracking-wide text-white/70">
              Layout clamp
            </p>
            <p className="mt-[clamp(0.6rem,1.2vw,0.9rem)] text-[clamp(1.15rem,1.7vw,1.45rem)] font-semibold leading-tight">
              Container width is clamped
            </p>
            <p className="mt-[clamp(0.55rem,1vw,0.8rem)] text-[clamp(0.95rem,1.1vw,1.05rem)] leading-relaxed text-white/70">
              The whole section uses{' '}
              <span className="font-mono text-white/90">max-w-[clamp(20rem,92vw,76rem)]</span> so it never gets too narrow or too wide.
            </p>
          </div>
        </div>

        <p className="mt-[clamp(1.5rem,3.2vw,2.5rem)] text-[clamp(0.9rem,1vw,1rem)] text-white/50">
          Tip: drag your browser width slowly to see continuous scaling (no abrupt jumps).
        </p>
      </section>
    </div>
  );
}

