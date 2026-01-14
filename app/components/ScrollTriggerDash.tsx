"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import {
  AddressBook,
  AlignBottom,
  Aperture,
  AppleLogo,
} from "@phosphor-icons/react";

export default function ScrollTriggerDash() {
  const logoRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const dashboardImgRef = useRef<HTMLImageElement>(null);
  const windowIconImgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (
        !logoRef.current ||
        !dashboardRef.current ||
        !dashboardImgRef.current ||
        !windowIconImgRef.current
      )
        return;

      // Logo animation
      gsap.to(logoRef.current, {
        y: "-50%",
        scale: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "top top",
          end: "100vh top",
          scrub: 1,
        },
      });

      // Dashboard animation
      gsap.to(dashboardRef.current, {
        y: "-25%",
        ease: "none",
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "top top",
          end: "200vh top",
          scrub: 1,
        },
      });

      // Dashboard image blur
      gsap.to(dashboardImgRef.current, {
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "600vh top",
          end: "1000vh top",
          scrub: 0.5,
        },
      });

      // Window icon fade out
      gsap.to(windowIconImgRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "400vh top",
          end: "450vh top",
          scrub: 0.5,
        },
      });

      // Dashboard scale
      gsap.to(dashboardRef.current, {
        transformOrigin: "center 85.6%",
        scale: 75,
        ease: "none",
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "600vh top",
          end: "900vh top",
          scrub: 1,
        },
      });

      // Dashboard fade out
      gsap.to(dashboardRef.current, {
        opacity: 0,
        display: "none",
        ease: "none",
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "800vh top",
          end: "825vh top",
          scrub: true,
        },
      });
    },
    { scope: dashboardRef }
  );

  return (
    <div className="w-full h-full">
      {/* Logo */}
      <div
        ref={logoRef}
        className="fixed w-[300px] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]"
      >
        <Image
          src="/cg-scrolltrigger-dash/logo.png"
          alt="Logo"
          width={300}
          height={300}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Dashboard */}
      <div ref={dashboardRef} className="fixed top-0 w-full h-[150vh] z-[1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={dashboardImgRef}
          src="/cg-scrolltrigger-dash/dashboard.png"
          alt="Dashboard"
          className="w-full h-full object-cover"
        />
        <div className="absolute w-[25%]  left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-[11.5%] h-[50px] rounded-[10px] overflow-hidden flex p-1 max-[900px]:w-[75%] max-[900px]:max-w-none">
          <div className="flex-1 flex justify-center items-center bg-[#e8ebee] border-16 border-[#e8ebee] -mx-[0.5px] rounded-l-[8px]">
            <AddressBook size={20} weight="light" />
          </div>
          <div className="flex-1 flex justify-center items-center bg-[#e8ebee] border-16 border-[#e8ebee] -mx-[0.5px]">
            <AlignBottom size={20} weight="light" />
          </div>
          <div className="flex-1 flex justify-center items-center bg-transparent border-4 border-[#e8ebee] -mx-[0.5px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={windowIconImgRef}
              src="/cg-scrolltrigger-dash/temp-icon.png"
              alt="Window Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex justify-center items-center bg-[#e8ebee] border-16 border-[#e8ebee] -mx-[0.5px]">
            <Aperture size={20} weight="light" />
          </div>
          <div className="flex-1 flex justify-center items-center bg-[#e8ebee] border-16 border-[#e8ebee] -mx-[0.5px] rounded-r-[8px]">
            <AppleLogo size={20} weight="light" />
          </div>
        </div>
      </div>

      {/* Web Content */}
      <div className="w-full">
        <div className="w-full h-[175vh]" />

        <div className="w-[70%] mx-auto">
          <h1 className="text-[5vw] font-normal leading-[120%] text-center text-white/50 mb-16">
            <span className="text-white">Happy Wednesday!</span> <br />
            It&apos;s <span className="text-white">⏰ 9:00 PM</span> and too{" "}
            <span className="text-white">❄️ cold</span> <br />
            in <span className="text-white">Toronto</span>.
          </h1>
          <h1 className="text-[5vw] font-normal leading-[120%] text-center text-white/50 mb-16">
            You got <span className="text-white">📩 2 emails</span> and have{" "}
            <br />
            <span className="text-white">2 meetings</span> today!
          </h1>
        </div>
      </div>
    </div>
  );
}
