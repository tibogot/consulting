"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

interface Service {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface ServiceCardsScrollProps {
  services?: Service[];
}

const defaultServices: Service[] = [
  {
    title: "Custom Web Development",
    description:
      "We provide bespoke web development solutions tailored to your business needs. Our team ensures top-notch performance and scalability.",
    image: "/img-1.jpg",
    imageAlt: "Web Development",
  },
  {
    title: "Mobile App Development",
    description:
      "Crafting intuitive and engaging mobile applications for both Android and iOS platforms. Enhance your user experience with our expert team.",
    image: "/img-2.jpg",
    imageAlt: "App Development",
  },
  {
    title: "Digital Marketing",
    description:
      "Comprehensive digital marketing services to boost your online presence. From SEO to social media campaigns, we cover it all.",
    image: "/img-3.jpg",
    imageAlt: "Digital Marketing",
  },
  {
    title: "Cloud Solutions",
    description:
      "Reliable and secure cloud solutions to streamline your business operations. Leverage the power of the cloud with our expertise.",
    image: "/img-4.jpg",
    imageAlt: "Cloud Solutions",
  },
  {
    title: "IT Consultancy",
    description:
      "Expert IT consultancy services to guide your business through digital transformation. Optimize your IT infrastructure with our insights.",
    image: "/img-5.jpg",
    imageAlt: "IT Consultancy",
  },
];

export default function ServiceCardsScroll({
  services = defaultServices,
}: ServiceCardsScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Wait for Lenis and layout to be fully ready
      const timeoutId = setTimeout(() => {
        if (!containerRef.current) return;

        const serviceElements = gsap.utils.toArray<HTMLDivElement>(
          containerRef.current.querySelectorAll(".service")
        );

        serviceElements.forEach((service) => {
          const imgContainer = service.querySelector(".img") as HTMLElement;
          if (!imgContainer) return;

          const rect = service.getBoundingClientRect();
          const isAboveViewport = rect.bottom < 0;
          const isBelowViewport = rect.top > window.innerHeight;

          // Set initial state based on position
          if (isBelowViewport) {
            // Card is below viewport - start at beginning
            gsap.set(service, { height: 150 });
            gsap.set(imgContainer, { width: "30%" });
          } else if (isAboveViewport) {
            // Card is above viewport - show end state
            gsap.set(service, { height: 450 });
            gsap.set(imgContainer, { width: "100%" });
          }
          // Cards in viewport will be handled by ScrollTrigger

          // Image width animation
          gsap.to(imgContainer, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: service,
              start: "bottom bottom",
              end: "top top",
              scrub: true,
            },
          });

          // Height animation
          gsap.to(service, {
            height: 450,
            ease: "none",
            scrollTrigger: {
              trigger: service,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        });

        ScrollTrigger.refresh(true);
      }, 200);

      return () => {
        clearTimeout(timeoutId);
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="services bg-black"
      style={{ padding: "8em 2em", display: "flex", flexDirection: "column" }}
    >
      <div className="services-header w-full flex" style={{ gap: "4em" }}>
        <div className="col" style={{ flex: 2 }}></div>
        <div className="col" style={{ flex: 5, padding: "1em" }}>
          <h1 className="text-white font-pp-neue-montreal text-4xl font-medium">
            All Services
          </h1>
        </div>
      </div>

      {services.map((service, index) => (
        <div
          key={index}
          ref={(el) => {
            serviceRefs.current[index] = el;
          }}
          className="service"
          style={{
            display: "flex",
            gap: "2em",
            height: "150px",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            className="service-info"
            style={{
              flex: 2,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "1em",
            }}
          >
            <h1 className="text-white font-pp-neue-montreal text-4xl font-medium">
              {service.title}
            </h1>
            <p className="text-white font-pp-neue-montreal text-base font-normal leading-[150%]">
              {service.description}
            </p>
          </div>
          <div
            className="service-img"
            style={{ flex: 5, width: "100%", height: "100%", padding: "1em" }}
          >
            <div
              className="img"
              style={{
                width: "30%",
                height: "100%",
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
