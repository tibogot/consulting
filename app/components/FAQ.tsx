"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { ChevronDown } from "lucide-react";

export type FAQItem = {
  question: string;
  answer: string;
};

interface FAQProps {
  items: FAQItem[];
  className?: string;
}

export default function FAQ({ items, className = "" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    const contentRef = contentRefs.current[index];
    const iconRef = iconRefs.current[index];
    
    if (!contentRef || !iconRef) return;

    const isCurrentlyOpen = openIndex === index;

    if (isCurrentlyOpen) {
      // Close the current item
      const tl = gsap.timeline();
      tl.to(contentRef, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setOpenIndex(null);
        },
      });
      tl.to(
        iconRef,
        {
          rotation: 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0
      );
    } else {
      // Close previously open item if any
      if (openIndex !== null) {
        const prevContentRef = contentRefs.current[openIndex];
        const prevIconRef = iconRefs.current[openIndex];
        
        if (prevContentRef && prevIconRef) {
          gsap.to(prevContentRef, {
            height: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
          gsap.to(prevIconRef, {
            rotation: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      }

      // Open the new item
      setOpenIndex(index);
      
      // Set height to auto temporarily to measure
      gsap.set(contentRef, { height: "auto" });
      const height = contentRef.scrollHeight;
      gsap.set(contentRef, { height: 0 });

      const tl = gsap.timeline();
      tl.to(contentRef, {
        height: height,
        duration: 0.4,
        ease: "power2.inOut",
      });
      tl.to(
        iconRef,
        {
          rotation: 180,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0
      );
    }
  };

  useGSAP(
    () => {
      // Initialize all content heights to 0 and icon rotations to 0
      contentRefs.current.forEach((ref) => {
        if (ref) {
          gsap.set(ref, { height: 0, overflow: "hidden" });
        }
      });
      iconRefs.current.forEach((ref) => {
        if (ref) {
          gsap.set(ref, { rotation: 0 });
        }
      });
    },
    { scope: contentRefs }
  );

  return (
    <section className={`w-full bg-black py-20 px-4 md:px-8 ${className}`}>
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-normal text-white font-pp-neue-montreal max-w-lg leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="md:w-1/2 w-full">
            <div>
              {items.map((item, index) => {
                const isOpen = openIndex === index;
                
                return (
                  <div
                    key={index}
                    className="border-b border-white/10 transition-colors duration-200"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 md:px-8 py-6 md:py-7 flex items-center justify-between text-left group cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-lg md:text-xl font-pp-neue-montreal text-white pr-8 flex-1">
                        {item.question}
                      </h3>
                      <div
                        ref={(el) => {
                          iconRefs.current[index] = el;
                        }}
                        className="shrink-0"
                      >
                        <ChevronDown
                          className="w-5 h-5 text-white/80 group-hover:text-white transition-colors"
                          strokeWidth={1.5}
                        />
                      </div>
                    </button>
                    
                    <div
                      ref={(el) => {
                        contentRefs.current[index] = el;
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-7">
                        <p className="text-white/75 text-base md:text-lg font-pp-neue-montreal leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
