"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsapConfig";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const servicesData = [
  {
    id: 1,
    title: "Search & Selection",
    description:
      "Connecting top talent with business needs through tailored recruitment solutions for permanent, independent, and executive positions.",
    image: "/images/cards/charlesdeluvio.jpg",
    cta: { text: "Explore Search & Selection", href: "/services/search-selection" },
  },
  {
    id: 2,
    title: "Consulting Services",
    description:
      "Driving business transformation with expert consulting, customized technological solutions, and agile project delivery.",
    image: "/images/cards/clay.jpg",
    cta: { text: "Explore Consulting", href: "/services/consulting" },
  },
  {
    id: 3,
    title: "Managed Services",
    description:
      "Optimizing recruitment and outsourcing operations through personalized managed services that improve efficiency, reduce costs, and ensure compliance.",
    image: "/images/cards/malte.jpg",
    cta: { text: "Explore Managed Services", href: "/services/managed" },
  },
  {
    id: 4,
    title: "Technology & Engineering",
    description:
      "Accelerate digital transformation through customized IT solutions in cloud, cybersecurity, data, and agile project management.",
    image: "/images/cards/zac-wolff.jpg",
    cta: { text: "Explore Technology & Engineering", href: "/hubs/technology" },
  },
];

export default function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const titles = titleRefs.current.filter(Boolean);
      const descs = descRefs.current.filter(Boolean);
      const ctas = ctaRefs.current.filter(Boolean);
      const images = imageRefs.current.filter(Boolean);
      const imageInners = imageInnerRefs.current.filter(Boolean);

      if (
        titles.length === 0 ||
        descs.length === 0 ||
        ctas.length === 0 ||
        images.length === 0 ||
        imageInners.length === 0
      )
        return;

      // Create SplitText instances for all titles and descriptions
      const titleSplits: ReturnType<typeof SplitText.create>[] = [];
      titles.forEach((title) => {
        const h1 = title?.querySelector("h1");
        if (h1) {
          titleSplits.push(
            SplitText.create(h1, {
              type: "lines",
              linesClass: "line-child",
            }),
          );
        }
      });

      const descSplits: ReturnType<typeof SplitText.create>[] = [];
      descs.forEach((desc) => {
        const p = desc?.querySelector("p");
        if (p) {
          descSplits.push(
            SplitText.create(p, {
              type: "lines",
              linesClass: "line-child",
            }),
          );
        }
      });

      // Set initial states for SplitText lines
      titleSplits.forEach((split, index) => {
        if (index === 0) {
          gsap.set(split.lines, { yPercent: 0, autoAlpha: 1 });
        } else {
          gsap.set(split.lines, { yPercent: 100, autoAlpha: 0 });
        }
      });

      descSplits.forEach((split, index) => {
        if (index === 0) {
          gsap.set(split.lines, { yPercent: 0, autoAlpha: 1 });
        } else {
          gsap.set(split.lines, { yPercent: 100, autoAlpha: 0 });
        }
      });

      // Set initial states for wrapper divs
      gsap.set([titles[1], titles[2], titles[3]], { autoAlpha: 1 });
      gsap.set([descs[1], descs[2], descs[3]], { autoAlpha: 1 });

      // Set initial states for CTAs (animate like title/desc)
      gsap.set(ctas[0], { yPercent: 0, autoAlpha: 1 });
      gsap.set([ctas[1], ctas[2], ctas[3]], { yPercent: 100, autoAlpha: 0 });

      // Set initial mask states using clip-path on outer wrapper
      // First image fully visible
      gsap.set(images[0], { clipPath: "inset(0% 0% 0% 0%)" });
      // Other images clipped from top (hidden, will reveal from top to bottom)
      gsap.set([images[1], images[2], images[3]], {
        clipPath: "inset(100% 0% 0% 0%)",
      });

      // Set initial scale states on inner divs
      gsap.set(imageInners[0], { scale: 1 });
      gsap.set([imageInners[1], imageInners[2], imageInners[3]], {
        scale: 1.2,
      });

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%", // 4x viewport height for 4 states
          scrub: 1, // Smoother scrub for more fluid feel
          pin: true,
          pinSpacing: true, // Seamless pinning like StickyCards3D
          invalidateOnRefresh: true,
        },
      });

      // Transition from state 1 to state 2
      tl
        // Animate out current title lines
        .to(titleSplits[0].lines, {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
        })
        // Animate out current description lines
        .to(
          descSplits[0].lines,
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Animate out current CTA
        .to(
          ctas[0],
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Clip current image to the bottom (masking it out from top to bottom)
        .to(
          images[0],
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Scale up the inner div as current image exits
        .to(
          imageInners[0],
          {
            scale: 1.2,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Reveal new image from top to bottom (unmasking)
        .to(
          images[1],
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Scale down from 1.2 to 1 as it reveals
        .to(
          imageInners[1],
          {
            scale: 1,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Animate in new title lines
        .to(
          titleSplits[1].lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "<0.2",
        )
        // Animate in new description lines
        .to(
          descSplits[1].lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "<0.1",
        )
        // Animate in new CTA
        .to(
          ctas[1],
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "<0.1",
        )
        // Hold state 2 for a bit
        .to({}, { duration: 0.3 })
        // Transition from state 2 to state 3
        // Animate out current title lines
        .to(titleSplits[1].lines, {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
        })
        // Animate out current description lines
        .to(
          descSplits[1].lines,
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Animate out current CTA
        .to(
          ctas[1],
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Clip current image to the bottom (masking it out from top to bottom)
        .to(
          images[1],
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Scale up the inner div as current image exits
        .to(
          imageInners[1],
          {
            scale: 1.2,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Reveal new image from top to bottom
        .to(
          images[2],
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Scale down from 1.2 to 1 as it reveals
        .to(
          imageInners[2],
          {
            scale: 1,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Animate in new title lines
        .to(
          titleSplits[2].lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "<0.2",
        )
        // Animate in new description lines
        .to(
          descSplits[2].lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "<0.1",
        )
        // Animate in new CTA
        .to(
          ctas[2],
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "<0.1",
        )
        // Hold state 3 for a bit
        .to({}, { duration: 0.3 })
        // Transition from state 3 to state 4
        // Animate out current title lines
        .to(titleSplits[2].lines, {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
        })
        // Animate out current description lines
        .to(
          descSplits[2].lines,
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Animate out current CTA
        .to(
          ctas[2],
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Clip current image to the bottom (masking it out from top to bottom)
        .to(
          images[2],
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<0.1",
        )
        // Scale up the inner div as current image exits
        .to(
          imageInners[2],
          {
            scale: 1.2,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Reveal new image from top to bottom
        .to(
          images[3],
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Scale down from 1.2 to 1 as it reveals
        .to(
          imageInners[3],
          {
            scale: 1,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        // Animate in new title lines
        .to(
          titleSplits[3].lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "<0.2",
        )
        // Animate in new description lines
        .to(
          descSplits[3].lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "<0.1",
        )
        // Animate in new CTA
        .to(
          ctas[3],
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "<0.1",
        );

      // Refresh ScrollTrigger after timeline is created to prevent pin jumping
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      // Cleanup function
      return () => {
        titleSplits.forEach((split) => split?.revert());
        descSplits.forEach((split) => split?.revert());
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full snap-start snap-always overflow-hidden"
    >
      {/* Left side - Content */}
      <div className="relative z-10 flex w-full flex-col items-start justify-center px-4 md:w-1/2 md:px-8">

        {/* Stacked titles - all in same position */}
        <div className="relative mb-2 h-24 w-full max-w-2xl md:mb-3 md:h-28">
          {servicesData.map((service, index) => (
            <div
              key={`title-${service.id}`}
              ref={(el) => {
                titleRefs.current[index] = el;
              }}
              className="absolute inset-0"
            >
              <h1 className="font-pp-neue-montreal text-white w-full max-w-lg text-left text-3xl md:text-5xl ">
                {service.title}
              </h1>
            </div>
          ))}
        </div>

        {/* Stacked descriptions - all in same position */}
        <div className="relative mb-4 h-32 w-full max-w-xl md:mb-5 md:h-28">
          {servicesData.map((service, index) => (
            <div
              key={`desc-${service.id}`}
              ref={(el) => {
                descRefs.current[index] = el;
              }}
              className="absolute inset-0"
            >
              <p className="font-pp-neue-montreal text-white/80 w-full max-w-sm text-left text-base md:text-lg">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stacked CTAs - one per section, animated like title/desc */}
        <div className="relative h-14 w-full overflow-hidden">
          {servicesData.map((service, index) => (
            <div
              key={`cta-${service.id}`}
              ref={(el) => {
                ctaRefs.current[index] = el;
              }}
              className="absolute inset-0"
            >
              <Link
                href={service.cta.href}
                className="font-pp-neue-montreal bg-secondary text-white hover:bg-secondary/90 group relative z-20 inline-flex items-center gap-3 text-sm transition-all duration-300 md:text-base"
              >
                {service.cta.text}
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Images stacked on top of each other */}
      <div className="absolute top-0 right-0 h-full w-full overflow-hidden md:relative md:w-1/2">
        {servicesData.map((service, index) => (
          <div
            key={`image-${service.id}`}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            className="absolute inset-0 h-full w-full overflow-hidden"
          >
            <div
              ref={(el) => {
                imageInnerRefs.current[index] = el;
              }}
              className="relative h-full w-full"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay gradient for mobile to ensure text readability */}
      {/* <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent md:hidden" /> */}
    </section>
  );
}
