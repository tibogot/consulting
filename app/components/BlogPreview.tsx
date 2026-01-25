"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
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

export default function BlogPreview({
  articles = MOCK_ARTICLES,
  title = "Latest from the blog",
  viewAllHref = "/blog",
}: BlogPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  // Track drag state to prevent clicks during/after drag on mobile
  const dragStateRef = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    startPointerX: 0,
    startPointerY: 0,
    pressTarget: null as HTMLElement | null,
    tapHandled: false, // Flag to indicate onRelease handled a tap
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
      dragClickables: true,
      // Increase minimum movement for better mobile detection
      minimumMovement: 5,
      onPress: function(event?: MouseEvent | TouchEvent) {
        // Reset drag state on press
        dragStateRef.current.isDragging = false;
        dragStateRef.current.hasMoved = false;
        dragStateRef.current.tapHandled = false;
        // Store initial draggable position
        dragStateRef.current.startX = this.x;
        dragStateRef.current.startY = this.y;
        // Store initial pointer coordinates (actual screen position)
        // This is critical for detecting vertical scrolling vs horizontal dragging
        if (event) {
          if ('touches' in event && event.touches.length > 0) {
            dragStateRef.current.startPointerX = event.touches[0].clientX;
            dragStateRef.current.startPointerY = event.touches[0].clientY;
          } else if ('clientX' in event) {
            dragStateRef.current.startPointerX = event.clientX;
            dragStateRef.current.startPointerY = event.clientY;
          }
        }
        // Store the target element that was pressed
        dragStateRef.current.pressTarget = 
          (event?.target as HTMLElement) || 
          (this.target as HTMLElement) || 
          null;
      },
      onDragStart: function() {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.hasMoved = true;
        container.classList.add("is-dragging");
      },
      onDrag: function() {
        // Mark as moved if we've dragged significantly
        const deltaX = Math.abs(this.x - dragStateRef.current.startX);
        const deltaY = Math.abs(this.y - dragStateRef.current.startY);
        if (deltaX > 5 || deltaY > 5) {
          dragStateRef.current.hasMoved = true;
        }
      },
      onDragEnd: () => {
        container.classList.remove("is-dragging");
      },
      onRelease: function(event?: MouseEvent | TouchEvent) {
        // Get the current pointer position
        let currentPointerX = dragStateRef.current.startPointerX;
        let currentPointerY = dragStateRef.current.startPointerY;
        
        if (event) {
          if ('changedTouches' in event && event.changedTouches.length > 0) {
            currentPointerX = event.changedTouches[0].clientX;
            currentPointerY = event.changedTouches[0].clientY;
          } else if ('clientX' in event) {
            currentPointerX = event.clientX;
            currentPointerY = event.clientY;
          }
        }
        
        // Calculate actual pointer movement (not just draggable position)
        const pointerDeltaX = Math.abs(currentPointerX - dragStateRef.current.startPointerX);
        const pointerDeltaY = Math.abs(currentPointerY - dragStateRef.current.startPointerY);
        
        // Calculate draggable movement (horizontal only)
        const draggableDeltaX = Math.abs(this.x - dragStateRef.current.startX);
        
        // CRITICAL: If there's ANY vertical movement, it's likely a scroll, not a tap
        // Only allow clicks if:
        // 1. Vertical movement is minimal (< 8px) - user wasn't scrolling
        // 2. Horizontal movement is minimal (< 8px) - user wasn't dragging
        // 3. No drag was initiated
        // 4. hasMoved flag is false (from touch event listeners)
        const isVerticalScroll = pointerDeltaY > 8;
        const isHorizontalDrag = pointerDeltaX > 8 || draggableDeltaX > 5;
        const isMinimalMovement = pointerDeltaX < 8 && pointerDeltaY < 8;
        
        // Only trigger click if it was a genuine tap (minimal movement in both directions)
        // AND we haven't detected any movement from touch listeners
        if (
          isMinimalMovement && 
          !isVerticalScroll && 
          !isHorizontalDrag && 
          !dragStateRef.current.isDragging &&
          !dragStateRef.current.hasMoved
        ) {
          // Mark that we're handling this tap
          dragStateRef.current.tapHandled = true;
          // Use the stored press target to find the link
          const target = dragStateRef.current.pressTarget;
          if (target) {
            const link = target.closest("a");
            if (link) {
              // Small delay to ensure drag state is cleared, then trigger navigation
              setTimeout(() => {
                // Triple-check we're not in a drag state before clicking
                if (
                  !dragStateRef.current.isDragging && 
                  !dragStateRef.current.hasMoved &&
                  Math.abs(currentPointerX - dragStateRef.current.startPointerX) < 8 &&
                  Math.abs(currentPointerY - dragStateRef.current.startPointerY) < 8
                ) {
                  link.click();
                }
              }, 10);
            }
          }
        }
        
        // Reset drag state after a short delay to allow click to process
        setTimeout(() => {
          dragStateRef.current.isDragging = false;
          dragStateRef.current.hasMoved = false;
          dragStateRef.current.pressTarget = null;
        }, 100);
      },
      onClick: (event: MouseEvent | TouchEvent) => {
        // Prevent clicks entirely if there's been any movement
        // This is a safety net - onRelease should handle most cases
        if (dragStateRef.current.isDragging || dragStateRef.current.hasMoved) {
          event.preventDefault?.();
          event.stopPropagation?.();
          return;
        }
        
        // Only handle click if no drag occurred (desktop fallback)
        // On mobile, onRelease handles the tap detection
        const target = event.target as HTMLElement;
        const link = target.closest("a");
        if (link) {
          // Trigger the link's click event - Next.js Link will handle navigation
          const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          link.dispatchEvent(clickEvent);
        }
      },
    })[0];
  }, []);

  useEffect(() => {
    setupDraggable();

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Track touch movement to detect vertical scrolling
    let touchStartY = 0;
    let touchStartX = 0;
    let touchMoved = false;
    let isVerticalScroll = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
        isVerticalScroll = false;
        dragStateRef.current.hasMoved = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
        
        // If there's ANY vertical movement, mark it as potential scroll
        // If vertical movement is greater than horizontal, it's definitely a scroll
        if (deltaY > 5) {
          if (deltaY > deltaX || deltaY > 10) {
            isVerticalScroll = true;
          }
          touchMoved = true;
          dragStateRef.current.hasMoved = true;
        } else if (deltaX > 5) {
          // Horizontal movement - might be a drag
          touchMoved = true;
          // Only mark as moved if it's not primarily vertical
          if (!isVerticalScroll) {
            dragStateRef.current.hasMoved = true;
          }
        }
      }
    };

    // Add touch listeners to track movement
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Prevent link clicks if there's been any movement (scrolling or dragging)
    // This is a safety net - onRelease will handle genuine taps
    const handleLinkClick = (e: MouseEvent | TouchEvent) => {
      // Only prevent if we've detected movement or dragging
      // Allow click if onRelease has marked it as a handled tap
      if ((dragStateRef.current.hasMoved || dragStateRef.current.isDragging) && !dragStateRef.current.tapHandled) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // Add click prevention to all links in the track
    const links = track.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', handleLinkClick, { capture: true });
    });

    const ro = new ResizeObserver(() => {
      setupDraggable();
      // Re-attach link handlers after draggable is recreated
      const newLinks = track.querySelectorAll('a');
      newLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick, { capture: true });
      });
    });
    ro.observe(container);

    return () => {
      track.removeEventListener('touchstart', handleTouchStart);
      track.removeEventListener('touchmove', handleTouchMove);
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
          className="overflow-hidden touch-pan-y cursor-grab select-none [&.is-dragging]:cursor-grabbing"
          style={{ touchAction: "pan-x pan-y pinch-zoom" }}
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
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <h3 className="mt-2 text-lg md:text-xl font-normal text-white font-pp-neue-montreal leading-tight line-clamp-2 max-w-[32ch]">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-white/70 font-pp-neue-montreal text-sm md:text-base leading-relaxed line-clamp-2 max-w-[40ch]">
                    {article.excerpt}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-white/80 text-sm font-pp-neue-montreal opacity-0 group-hover:opacity-100 transition-opacity">
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
