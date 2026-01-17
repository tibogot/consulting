"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { useLenis } from "lenis/react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSyncExternalStore } from "react";

// Safe hydration hook for client-side only rendering
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Tech stack data
const techStack = [
  { name: "React", category: "Frontend", color: "#61DAFB" },
  { name: "Next.js", category: "Framework", color: "#000000" },
  { name: "TypeScript", category: "Language", color: "#3178C6" },
  { name: "Node.js", category: "Backend", color: "#339933" },
  { name: "Python", category: "Language", color: "#3776AB" },
  { name: "AWS", category: "Cloud", color: "#FF9900" },
  { name: "Docker", category: "DevOps", color: "#2496ED" },
  { name: "Kubernetes", category: "DevOps", color: "#326CE5" },
];

// 3D Wireframe Grid Component
function WireframeGrid({ scrollProgress }: { scrollProgress: number }) {
  const gridRef = useRef<THREE.LineSegments>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  // Create geometry once
  useEffect(() => {
    const points: THREE.Vector3[] = [];
    const geometry = new THREE.BufferGeometry();

    // Create grid points
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        const x = (i - 10) * 0.5;
        const y = (j - 10) * 0.5;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      }
    }

    geometry.setFromPoints(points);
    geometryRef.current = geometry;

    return () => {
      geometry.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    if (gridRef.current && geometryRef.current) {
      gridRef.current.rotation.z = scrollProgress * Math.PI * 0.5 + clock.elapsedTime * 0.1;
      
      // Update z positions based on scroll
      const positions = geometryRef.current.attributes.position;
      if (positions) {
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          positions.setZ(i, Math.sin((x || 0) * 0.5 + scrollProgress * Math.PI) * 0.3);
        }
        positions.needsUpdate = true;
      }
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = scrollProgress * Math.PI * 0.3;
      meshRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  if (!geometryRef.current) return null;

  const material = new THREE.LineBasicMaterial({
    color: "#8B5FFB",
    opacity: 0.3,
    transparent: true,
  });

  return (
    <>
      <lineSegments ref={gridRef} geometry={geometryRef.current} material={material} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial
          color="#8B5FFB"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  );
}

// Floating Tech Orbs
function FloatingOrbs({ count = 8 }: { count?: number }) {
  const orbsRef = useRef<THREE.Group>(null);

  const orbs = useRef(
    Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      ),
      speed: Math.random() * 0.02 + 0.01,
      radius: Math.random() * 0.3 + 0.2,
    }))
  ).current;

  useFrame(({ clock }) => {
    if (!orbsRef.current) return;

    orbs.forEach((orb, i) => {
      const child = orbsRef.current?.children[i] as THREE.Mesh;
      if (child) {
        child.position.y = orb.position.y + Math.sin(clock.elapsedTime * orb.speed * 10) * 2;
        child.position.x = orb.position.x + Math.cos(clock.elapsedTime * orb.speed * 8) * 1.5;
        child.rotation.x += orb.speed;
        child.rotation.y += orb.speed * 0.5;
      }
    });
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.radius, 16, 16]} />
          <meshBasicMaterial
            color="#8B5FFB"
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

interface TechnologyShowcaseProps {
  title?: string;
  description?: string;
}

export default function TechnologyShowcase({
  title = "Technology Stack",
  description = "Cutting-edge technologies powering tomorrow's solutions",
}: TechnologyShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const isClient = useIsClient();
  const lenis = useLenis();

  // Lenis integration for ScrollTrigger
  useEffect(() => {
    if (!lenis) return;

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    const handleScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.scrollerProxy(document.body, {});
      ScrollTrigger.refresh();
    };
  }, [lenis]);

  useGSAP(
    () => {
      if (!containerRef.current || !pinnedSectionRef.current || !titleRef.current || !cardsRef.current) return;

      const cards = Array.from(cardsRef.current.children) as HTMLElement[];

      // Set initial states
      gsap.set(cards, {
        opacity: 0,
        y: 100,
        scale: 0.8,
      });

      // Create main pinned timeline
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedSectionRef.current,
          start: "top top",
          end: "+=3000",
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Title animation
      mainTimeline
        .fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          }
        )
        .to(titleRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "power2.in",
        }, "-=0.1");

      // Cards reveal animation - staggered
      cards.forEach((card, index) => {
        const cardDelay = 0.4 + index * 0.15;
        const cardDuration = 0.4;

        mainTimeline.to(
          card,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: cardDuration,
            ease: "power3.out",
          },
          cardDelay
        );

        // Animate card out as next one comes in (except last)
        if (index < cards.length - 1) {
          mainTimeline.to(
            card,
            {
              opacity: 0,
              scale: 0.8,
              y: -50,
              duration: 0.3,
              ease: "power2.in",
            },
            cardDelay + cardDuration + 0.2
          );
        }
      });

      // Final fade out
      if (cards.length > 0) {
        mainTimeline.to(
          [titleRef.current, cards[cards.length - 1]],
          {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.2"
        );
      }
    },
    {
      scope: containerRef,
      dependencies: [],
    }
  );

  if (!isClient) {
    return (
      <div className="w-full min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-pp-neue-montreal mb-4">{title}</h2>
          <p className="text-lg text-white/80 font-pp-neue-montreal">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-black text-white overflow-hidden">
      {/* Pinned Section */}
      <div
        ref={pinnedSectionRef}
        className="relative w-full h-screen flex items-center justify-center"
      >
        {/* 3D Background Canvas */}
        <div className="absolute inset-0 opacity-30">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <WireframeGrid scrollProgress={scrollProgress} />
            <FloatingOrbs count={8} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#8B5FFB" />
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          {/* Title */}
          <div className="text-center mb-16">
            <h2
              ref={titleRef}
              className="text-5xl md:text-7xl font-normal font-pp-neue-montreal mb-6"
            >
              {title}
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-pp-neue-montreal max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Tech Cards Grid */}
          <div
            ref={cardsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className="relative group"
                style={{ position: index === 0 ? "relative" : "absolute", top: 0, left: 0, right: 0 }}
              >
                <div className="aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary hover:bg-white/10">
                  {/* Tech Icon Placeholder */}
                  <div
                    className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-bold font-pp-neue-montreal"
                    style={{
                      background: `linear-gradient(135deg, ${tech.color}20, ${tech.color}40)`,
                      border: `2px solid ${tech.color}60`,
                      color: tech.color,
                    }}
                  >
                    {tech.name.charAt(0)}
                  </div>

                  <h3 className="text-xl font-normal font-pp-neue-montreal mb-2 text-center">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-white/50 font-pp-neue-montreal text-center">
                    {tech.category}
                  </p>

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                    style={{ background: tech.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/40 font-pp-neue-montreal uppercase tracking-wider">
              Scroll to explore
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </div>

      {/* Post-scroll content section */}
      <section className="relative w-full min-h-screen bg-black py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-full h-px bg-white mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl md:text-4xl font-normal font-pp-neue-montreal mb-6">
                Innovation First
              </h3>
              <p className="text-lg text-white/80 font-pp-neue-montreal leading-relaxed">
                We leverage cutting-edge technologies to build solutions that scale,
                perform, and evolve with your business needs. Our stack is continuously
                updated to ensure we're always using the best tools for the job.
              </p>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-normal font-pp-neue-montreal mb-6">
                Future-Ready
              </h3>
              <p className="text-lg text-white/80 font-pp-neue-montreal leading-relaxed">
                Technology choices today determine tomorrow's possibilities. We select
                technologies that not only solve current challenges but position you
                for future growth and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
