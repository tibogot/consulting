"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { Draggable } from "@/lib/gsapConfig";

export type BlogArticle = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
};

const MOCK_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    title: "Strategy that ships: turning ambiguity into clear roadmaps",
    excerpt:
      "We partner with your team to define the real problem, agree on success metrics, and shape an executable plan—scope, constraints, owners, and milestones.",
    date: "Jan 18, 2025",
    image: "/images/cards/charlesdeluvio.jpg",
    slug: "/blog",
  },
  {
    id: "2",
    title: "From discovery to delivery: building systems that scale",
    excerpt:
      "From discovery to delivery, we turn ambiguity into clear priorities and momentum. We validate assumptions with users and data.",
    date: "Jan 12, 2025",
    image: "/images/cards/clay.jpg",
    slug: "/blog",
  },
  {
    id: "3",
    title: "Clarity, fast: sharp research and decision-ready artifacts",
    excerpt:
      "Sharp research, practical strategy, and decision-ready artifacts—so your team stops debating and starts building.",
    date: "Jan 5, 2025",
    image: "/images/cards/malte.jpg",
    slug: "/blog",
  },
  {
    id: "4",
    title: "Delivery you can trust: clean execution and measurable progress",
    excerpt:
      "Clean execution, predictable cadence, and measurable progress—built with maintainability and long-term ownership in mind.",
    date: "Dec 28, 2024",
    image: "/images/cards/zac-wolff.jpg",
    slug: "/blog",
  },
];

interface BlogPreviewProps {
  articles?: BlogArticle[];
  title?: string;
  viewAllHref?: string;
}

// Threshold for distinguishing tap from drag/scroll (higher = less sensitive)
const TAP_THRESHOLD = 12;

export default function BlogPreview({
  articles = MOCK_ARTICLES,
  title = "Latest from the blog",
  viewAllHref = "/blog",
}: BlogPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const router = useRouter();

  // Simplified drag state tracking
  const dragStateRef = useRef({
    isDragging: false,
    startPointerX: 0,
    startPointerY: 0,
    pointerMoved: false,
  });

  const setupDraggable = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    draggableRef.current?.kill();

    const containerWidth = container.clientWidth;
    const trackWidth = track.scrollWidth;
    const maxScroll = Math.max(0, trackWidth - containerWidth);

    if (maxScroll <= 0) return;

    draggableRef.current = Draggable.create(track, {
      type: "x",
      bounds: { minX: -maxScroll, maxX: 0 },
      inertia: { x: { min: -maxScroll, max: 0 } },
      cursor: "grab",
      activeCursor: "grabbing",
      edgeResistance: 0.85,
      dragResistance: 0,
      // Allow dragging to start on clickable elements (the cards are wrapped in links)
      dragClickables: true,
      // Higher minimum movement for mobile
      minimumMovement: TAP_THRESHOLD,
      onPress: function(event?: MouseEvent | TouchEvent) {
        // Reset state on press
        dragStateRef.current.isDragging = false;
        dragStateRef.current.pointerMoved = false;

        // Store initial pointer position
        if (event) {
          if ('touches' in event && event.touches.length > 0) {
            dragStateRef.current.startPointerX = event.touches[0].clientX;
            dragStateRef.current.startPointerY = event.touches[0].clientY;
          } else if ('clientX' in event) {
            dragStateRef.current.startPointerX = event.clientX;
            dragStateRef.current.startPointerY = event.clientY;
          }
        }
      },
      onDragStart: function() {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.pointerMoved = true;
        container.classList.add("is-dragging");
      },
      onDragEnd: () => {
        container.classList.remove("is-dragging");
        // Keep isDragging true briefly to prevent click
        setTimeout(() => {
          dragStateRef.current.isDragging = false;
        }, 50);
      },
      onClick: function(event: PointerEvent) {
        // Only navigate if no movement occurred (genuine tap/click)
        if (!dragStateRef.current.pointerMoved && !dragStateRef.current.isDragging) {
          const target = event.target as HTMLElement;
          const link = target.closest("a");
          if (link) {
            const href = link.getAttribute("href");
            if (href) {
              router.push(href as "/blog");
            }
          }
        }
      },
    })[0];
  }, [router]);

  useEffect(() => {
    setupDraggable();

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Track touch/pointer movement to detect scroll vs tap
    const handlePointerDown = (e: PointerEvent) => {
      dragStateRef.current.pointerMoved = false;
      dragStateRef.current.startPointerX = e.clientX;
      dragStateRef.current.startPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = Math.abs(e.clientX - dragStateRef.current.startPointerX);
      const deltaY = Math.abs(e.clientY - dragStateRef.current.startPointerY);

      // If moved beyond threshold in any direction, mark as moved
      if (deltaX > TAP_THRESHOLD || deltaY > TAP_THRESHOLD) {
        dragStateRef.current.pointerMoved = true;
      }
    };

    // Prevent link clicks only when dragging or scrolling occurred
    const handleLinkClick = (e: MouseEvent) => {
      if (dragStateRef.current.isDragging || dragStateRef.current.pointerMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Use pointer events for unified touch/mouse handling
    track.addEventListener('pointerdown', handlePointerDown, { passive: true });
    track.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Add click prevention to all links
    const links = track.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', handleLinkClick, { capture: true });
    });

    const ro = new ResizeObserver(() => {
      setupDraggable();
    });
    ro.observe(container);

    return () => {
      track.removeEventListener('pointerdown', handlePointerDown);
      track.removeEventListener('pointermove', handlePointerMove);
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick, { capture: true });
      });
      ro.disconnect();
      draggableRef.current?.kill();
      draggableRef.current = null;
    };
  }, [setupDraggable]);

  return (
    <section className="relative w-full bg-black py-16 md:py-24 px-4 md:px-8">
      <div className="mb-16 md:mb-24">
        <div className="w-full h-px bg-white"></div>
        <h3 className="mt-2 text-sm md:text-base text-white font-pp-neue-montreal">Latest from the blog</h3>
      </div>
      <div className="">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-16">
          <h2 className="text-4xl md:text-6xl  font-normal text-white font-pp-neue-montreal max-w-sm ">
            {title}
          </h2>
          <Link
            href={viewAllHref as "/blog"}
            className="text-white/80 hover:text-white font-pp-neue-montreal text-sm md:text-base transition-colors inline-flex items-center gap-2"
          >
            View all our articles <span aria-hidden>→</span>
          </Link>
        </div>

        <div
          ref={containerRef}
          className="overflow-hidden cursor-grab select-none [&.is-dragging]:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="flex gap-5 md:gap-6 lg:gap-8 w-max will-change-transform"
          >
            {articles.map((article) => (
              <article
                key={article.id}
                className="group shrink-0 w-[340px] sm:w-[420px] md:w-[520px] lg:w-[600px]"
              >
                <Link
                  href={article.slug as "/blog"}
                  className="block"
                  draggable={false}
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-white/5 rounded-sm mb-4">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 600px, (min-width: 768px) 520px, 420px"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <time
                    dateTime={article.date}
                    className="text-white/50 font-pp-neue-montreal text-xs md:text-sm"
                  >
                    {article.date}
                  </time>
                  <h3 className="mt-2 text-xl md:text-2xl font-normal text-white font-pp-neue-montreal leading-tight line-clamp-2 max-w-[32ch]">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-white/70 font-pp-neue-montreal text-sm md:text-base leading-relaxed line-clamp-2 max-w-[40ch]">
                    {article.excerpt}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-white/80 text-sm font-pp-neue-montreal opacity-100 md:opacity-0 translate-y-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-700">
                    Read more <span aria-hidden>→</span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* <p className="mt-6 text-white/40 font-pp-neue-montreal text-xs md:text-sm">
          Drag horizontally to explore · Placeholder content until CMS is connected
        </p> */}
      </div>
    </section>
  );
}
