"use client";

import { useEffect, useRef, useId } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { useLenis } from "lenis/react";

// Logo SVG path data (from logoflattensvg.svg - combined all paths)
const logoData =
  "M187.043 16.7921C187.142 19.079 185.608 21.0739 182.888 22.2903C181.255 22.9715 179.425 23.3121 177.545 23.3121C175.715 23.3121 173.736 22.9715 172.104 22.2416C169.631 21.1225 167.751 19.2249 166.91 17.0354C168.147 16.8408 169.433 16.6461 170.669 16.4515C171.312 17.4733 172.351 18.3491 173.637 18.933C175.962 20.0034 179.079 20.0034 181.404 18.9816C181.997 18.6897 183.432 17.9599 183.382 16.9381C183.382 16.0623 182.393 14.8945 180.513 14.262C179.672 13.97 178.584 13.7754 177.397 13.5808C174.429 13.0942 170.719 12.4617 168.839 9.4936C167.8 7.8393 167.602 6.0877 168.245 4.4333C168.987 2.5844 170.867 1.076 173.242 0.4435C176.457 -0.4323 180.167 0.00559962 182.888 1.6112C184.916 2.779 186.4 4.5793 187.043 6.5256C185.806 6.7688 184.619 7.0608 183.432 7.3041C182.987 6.2823 182.146 5.3578 181.057 4.7253C179.128 3.6062 176.457 3.3142 174.231 3.8981C172.945 4.2387 171.956 4.9686 171.659 5.7471C171.411 6.3309 171.51 6.9148 171.956 7.596C172.945 9.153 175.517 9.5909 178.04 10.0288C179.376 10.2235 180.612 10.4667 181.75 10.856C184.866 11.9264 186.944 14.262 187.043 16.7921ZM144.211 13.3862V0.00559998H147.872V13.3862C147.872 16.8894 150.741 19.7115 154.302 19.7115C157.814 19.7115 160.684 16.8894 160.684 13.3862V0.00559998H164.394V13.3862C164.394 18.8844 159.843 23.3121 154.302 23.3121C148.712 23.3121 144.211 18.8844 144.211 13.3862ZM135.843 27.1505C136.684 26.3219 137.278 25.3957 137.674 24.3721L140.892 25.5907C140.15 27.5892 138.813 29.2953 136.932 30.6601C134.902 32.1224 132.526 32.9511 130.1 32.9511C128.02 32.9511 125.941 32.3174 124.159 31.245C121.783 29.734 120.149 27.8817 119.307 25.4445L122.575 24.2259C123.02 25.542 123.812 26.6631 124.901 27.5892C126.387 28.8566 128.119 29.4415 130.149 29.4415C132.328 29.4415 134.258 28.6616 135.843 27.1505ZM141.536 0C141.536 1.8523 141.09 3.7046 140.199 5.3131L140.001 5.6543L140.199 6.0443C141.09 7.6529 141.536 9.4564 141.536 11.3087C141.586 14.2821 140.397 17.1092 138.219 19.254C136.041 21.3987 133.169 22.5686 130.1 22.5686C123.763 22.5686 118.614 17.5479 118.614 11.3574C118.565 9.4076 119.109 7.4579 120.05 5.7518C120.743 4.5332 121.684 3.4609 122.773 2.5347C124.802 0.9262 127.377 0 129.951 0C132.427 0 134.753 0.7312 136.734 2.1448L137.674 2.7784L137.922 1.7061C138.021 1.1211 138.07 0.5849 138.07 0H141.536ZM135.793 16.8168C137.377 15.2082 138.219 13.0147 138.07 10.8212C138.021 10.1388 137.922 9.5051 137.674 8.8715C137.229 7.6041 136.486 6.4343 135.447 5.5081C133.961 4.1433 132.13 3.4121 130.05 3.4121H129.902C127.971 3.4609 126.09 4.192 124.604 5.5081C123.614 6.4343 122.872 7.6041 122.426 8.8715C122.179 9.6514 122.03 10.48 122.03 11.3087C122.08 13.4534 122.921 15.4519 124.406 16.9143C125.892 18.3766 127.921 19.1565 130.1 19.1565H130.248C132.278 19.1565 134.308 18.3278 135.793 16.8168ZM115.115 13.0942C116.104 17.4733 116.104 21.5605 116.104 22.8742C116.104 23.1661 116.104 23.3121 116.104 23.3121H112.344C112.394 22.9715 112.394 22.6309 112.443 22.2417C112.592 20.5873 112.493 19.0303 112.344 17.6679C111.652 18.6897 110.86 19.6142 109.871 20.3441C106.31 23.4581 100.967 24.0906 96.7624 21.7551C92.8545 19.5655 90.4306 14.9918 90.9252 10.5154C91.4199 6.1363 94.7342 2.0978 99.0873 0.7841C102.55 -0.335 107.744 0.2489 110.712 3.4116C110.811 3.5089 110.959 3.6548 111.058 3.7522C111.504 4.2874 111.899 4.8226 112.344 5.3092C112.493 4.2874 112.542 3.071 112.493 1.7572C112.443 1.1734 112.394 0.5408 112.344 0.00559998H115.906C115.906 0.00559998 115.906 0.0542999 115.906 0.1516C115.906 0.4922 115.956 1.5626 115.956 2.9737C115.906 5.2605 115.659 8.5692 114.818 11.8291C114.917 12.2184 115.016 12.6563 115.115 13.0942ZM105.815 18.6897C108.338 17.4247 110.316 14.6999 111.009 11.6345L111.058 11.4399L111.009 11.2939C110.267 7.596 106.804 3.8008 102.402 3.8008C102.055 3.8008 101.66 3.8495 101.363 3.8981C97.8506 4.336 94.9321 7.3041 94.4869 10.71C94.0417 14.1647 96.1687 17.7166 99.4336 18.9817C100.423 19.3709 101.412 19.5655 102.352 19.5655C103.539 19.5655 104.727 19.2736 105.815 18.6897ZM89.2746 0.00559998C89.8188 0.00559998 90.3629 0.0542996 90.9071 0.1029V3.6548C90.3629 3.5575 89.8188 3.5089 89.2746 3.5089C87.0486 3.5089 84.971 4.336 83.4375 5.8444C81.904 7.3527 81.0136 9.445 81.0136 11.6345V23.3608H77.452V0.00559998H81.0136V3.3142C83.1407 1.2707 86.0593 0.00559998 89.2746 0.00559998ZM73.7149 13.0942C74.7042 17.4733 74.7042 21.5605 74.7042 22.8742C74.7042 23.1661 74.7042 23.3121 74.7042 23.3121H70.9447C70.9942 22.9715 70.9942 22.6309 71.0437 22.2417C71.1921 20.5873 71.0931 19.0303 70.9447 17.6679C70.2522 18.6897 69.4607 19.6142 68.4714 20.3441C64.9098 23.4581 59.5673 24.0906 55.3626 21.7551C51.4547 19.5655 49.0308 14.9918 49.5255 10.5154C50.0201 6.1363 53.3344 2.0978 57.6875 0.7841C61.1502 -0.335 66.3443 0.2489 69.3123 3.4116C69.4113 3.5089 69.5597 3.6548 69.6586 3.7522C70.1038 4.2874 70.4995 4.8226 70.9447 5.3092C71.0931 4.2874 71.1426 3.071 71.0931 1.7572C71.0437 1.1734 70.9942 0.5408 70.9447 0.00559998H74.5064C74.5064 0.00559998 74.5064 0.0542999 74.5064 0.1516C74.5064 0.4922 74.5558 1.5626 74.5558 2.9737C74.5064 5.2605 74.259 8.5692 73.4181 11.8291C73.517 12.2184 73.616 12.6563 73.7149 13.0942ZM64.4151 18.6897C66.9379 17.4247 68.9166 14.6999 69.6091 11.6345L69.6586 11.4399L69.6091 11.2939C68.8671 7.596 65.4044 3.8008 61.0019 3.8008C60.6556 3.8008 60.2598 3.8495 59.963 3.8981C56.4509 4.336 53.5323 7.3041 53.0871 10.71C52.6419 14.1647 54.769 17.7166 58.0338 18.9817C59.0232 19.3709 60.0125 19.5655 60.9524 19.5655C62.1396 19.5655 63.3268 19.2736 64.4151 18.6897ZM23.0761 10.0775C22.0867 5.7471 22.0867 1.7572 22.1362 0.443501C22.1362 0.151601 22.1362 0.00559998 22.1362 0.00559998H25.7968C25.7968 0.3462 25.7473 0.6868 25.6978 1.076C25.5989 2.7304 25.6484 4.2387 25.7968 5.6011C26.4893 4.5793 27.2808 3.7035 28.2207 2.9737L28.2701 2.925C31.7328 -0.0917008 36.9763 -0.724201 41.1316 1.5626C44.99 3.7035 47.3644 8.2286 46.9192 12.6077C46.4246 16.9381 43.1103 20.8793 38.8561 22.2417C35.4429 23.3121 30.3477 22.7282 27.4292 19.6142C27.2808 19.5169 27.1819 19.4196 27.0829 19.2736C26.6377 18.7384 26.242 18.2518 25.7968 17.7166C25.6978 18.787 25.5989 19.9548 25.6484 21.2199C25.6978 21.8524 25.7473 32.4648 25.7968 33H22.2846C22.2846 32.6107 22.2351 21.4632 22.2846 20.0521C22.3341 17.7653 22.5814 14.5053 23.3729 11.3426C23.2739 10.9533 23.175 10.5154 23.0761 10.0775ZM32.2275 4.5793C29.7541 5.8444 27.8249 8.4718 27.1324 11.4886C27.1324 11.5372 27.1324 11.5372 27.1324 11.5372L27.0829 11.6832L27.1324 11.8778C27.8744 15.4784 31.2382 19.225 35.6407 19.225C35.987 19.225 36.2838 19.225 36.6301 19.1763C40.0928 18.6897 42.9619 15.819 43.4071 12.413C43.8028 9.0557 41.7252 5.5525 38.5098 4.2874C37.5699 3.8981 36.5806 3.7035 35.6407 3.7035C34.4535 3.7035 33.3158 3.9954 32.2275 4.5793ZM19.6083 16.7921C19.7073 19.0789 18.1738 21.0739 15.4531 22.2903C13.8207 22.9715 11.9904 23.3121 10.1106 23.3121C8.28035 23.3121 6.82647 22.9715 5.19405 22.2416C2.72069 21.1225 0.840942 19.2249 0 17.0354C1.23668 16.8407 2.52283 16.6461 3.7595 16.4515C4.40258 17.4733 5.44139 18.3491 6.72753 18.933C9.05249 20.0034 11.6441 20.0034 13.9691 18.9816C14.5627 18.6897 15.9972 17.9598 15.9478 16.9381C15.9478 16.0622 14.9584 14.8945 13.0787 14.2619C12.2377 13.97 11.1494 13.7754 9.96223 13.5808C6.9942 13.0942 3.07424 12.4617 1.19449 9.4936C0.155682 7.8393 -0.0421862 6.0876 0.600887 4.4333C1.34289 2.5844 3.22265 1.076 5.59707 0.4435C8.81243 -0.4323 12.7324 0.00559962 15.4531 1.6112C17.4812 2.779 18.9653 4.5793 19.6083 6.5255C18.3716 6.7688 17.1844 7.0608 15.9972 7.3041C15.552 6.2823 14.7111 5.3578 13.6228 4.7253C11.6936 3.6061 8.81243 3.3142 6.58641 3.8981C5.30027 4.2387 4.31092 4.9685 4.01412 5.747C3.76678 6.3309 3.86572 6.9148 4.31092 7.596C5.30027 9.153 8.08248 9.5909 10.6053 10.0288C11.9409 10.2234 13.1776 10.4667 14.3153 10.856C17.4318 11.9264 19.5094 14.2619 19.6083 16.7921ZM195.906 9.7547C195.205 9.7547 194.546 9.6284 193.928 9.3759C193.31 9.1233 192.766 8.7761 192.296 8.3341C191.834 7.8843 191.471 7.3634 191.208 6.7715C190.944 6.1796 190.812 5.5482 190.812 4.8774C190.812 4.1986 190.944 3.5673 191.208 2.9832C191.471 2.3913 191.834 1.8744 192.296 1.4324C192.766 0.9826 193.31 0.631399 193.928 0.378799C194.546 0.126299 195.205 0 195.906 0C196.615 0 197.274 0.126299 197.884 0.378799C198.502 0.631399 199.042 0.9826 199.504 1.4324C199.974 1.8744 200.341 2.3913 200.604 2.9832C200.868 3.5673 201 4.1986 201 4.8774C201 5.5482 200.868 6.1796 200.604 6.7715C200.341 7.3634 199.974 7.8843 199.504 8.3341C199.042 8.7761 198.502 9.1233 197.884 9.3759C197.274 9.6284 196.615 9.7547 195.906 9.7547ZM195.906 9.0918C196.516 9.0918 197.085 8.9852 197.612 8.7721C198.148 8.5512 198.618 8.2473 199.022 7.8606C199.426 7.4739 199.739 7.028 199.961 6.5229C200.192 6.0099 200.308 5.4614 200.308 4.8774C200.308 4.2933 200.192 3.7488 199.961 3.2437C199.739 2.7307 199.426 2.2808 199.022 1.8941C198.618 1.5074 198.148 1.2075 197.612 0.9944C197.085 0.7734 196.516 0.662901 195.906 0.662901C195.296 0.662901 194.723 0.7734 194.187 0.9944C193.66 1.2075 193.194 1.5074 192.79 1.8941C192.386 2.2808 192.069 2.7307 191.838 3.2437C191.616 3.7488 191.504 4.2933 191.504 4.8774C191.504 5.4614 191.616 6.0099 191.838 6.5229C192.069 7.028 192.386 7.4739 192.79 7.8606C193.194 8.2473 193.66 8.5512 194.187 8.7721C194.723 8.9852 195.296 9.0918 195.906 9.0918ZM197.493 5.6796L198.241 5.9188L198.118 6.1181C197.667 6.8356 196.889 7.2642 196.019 7.2642C194.667 7.2642 193.571 6.1978 193.571 4.8823C193.571 3.5669 194.667 2.4906 196.019 2.4906C196.879 2.4906 197.678 2.9291 198.118 3.6466L198.241 3.8359L197.493 4.0851L197.411 3.9655C197.104 3.517 196.582 3.248 196.019 3.248C195.097 3.248 194.339 3.9854 194.339 4.8823C194.339 5.7793 195.097 6.5167 196.019 6.5167C196.582 6.5167 197.104 6.2476 197.411 5.7892L197.493 5.6796Z";

export default function GTAScrollRevealReverseGradientV3() {
  // Hardcoded values
  const backgroundColor = "#ffffff";
  const overlayColor = "#ffffff";
  const scrollMultiplier = 3;
  const enableSmoothScroll = true;
  const logoSvgPath = logoData;

  const heroRef = useRef<HTMLElement>(null);
  const heroImgContainerRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoMaskRef = useRef<SVGPathElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const maskId = useId();

  // Get Lenis instance from ReactLenis provider
  const lenis = useLenis();

  // Integrate Lenis with GSAP ScrollTrigger
  useEffect(() => {
    if (!lenis || !enableSmoothScroll) return;

    // Set up scrollerProxy for proper integration
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
      // Remove event listeners
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(tickerCallback);
      // Clear scrollerProxy
      ScrollTrigger.scrollerProxy(document.body, {});
      // Refresh ScrollTrigger to clear any cached values
      ScrollTrigger.refresh();
    };
  }, [lenis, enableSmoothScroll]);


  // Update logo mask position and scale
  const updateLogoMask = () => {
    if (!logoContainerRef.current || !logoMaskRef.current) return;

    // Get the hero section's position relative to viewport
    const heroSection = heroRef.current;
    if (!heroSection) return;

    const heroRect = heroSection.getBoundingClientRect();
    const logoDimensions = logoContainerRef.current.getBoundingClientRect();
    const logoBoundingBox = logoMaskRef.current.getBBox();

    const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
    const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
    const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);

    // Calculate position relative to the SVG overlay (which is absolute positioned in the hero section)
    const logoHorizontalPosition =
      logoDimensions.left - heroRect.left +
      (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -
      logoBoundingBox.x * logoScaleFactor;
    const logoVerticalPosition =
      logoDimensions.top - heroRect.top +
      (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 -
      logoBoundingBox.y * logoScaleFactor;

    logoMaskRef.current.setAttribute(
      "transform",
      `translate(${logoHorizontalPosition}, ${logoVerticalPosition}) scale(${logoScaleFactor})`
    );
  };

  useGSAP(() => {
    if (
      !heroRef.current ||
      !heroImgContainerRef.current ||
      !fadeOverlayRef.current ||
      !svgOverlayRef.current ||
      !logoContainerRef.current ||
      !logoMaskRef.current
    )
      return;

    // Normalize scroll to prevent abrupt jumps when unpinning
    // Only use if smooth scroll is disabled (Lenis can conflict with normalizeScroll)
    if (!enableSmoothScroll) {
      ScrollTrigger.normalizeScroll(true);
    }

    // Set logo SVG path
    logoMaskRef.current.setAttribute("d", logoSvgPath);
    
    // Set an initial transform to ensure mask is visible immediately
    // This prevents blank screen when component first appears
    const initialTransform = "translate(0, 0) scale(1)";
    logoMaskRef.current.setAttribute("transform", initialTransform);

    // Update logo mask immediately and ensure it's visible
    // Use multiple attempts to ensure it calculates correctly
    updateLogoMask();
    
    // Also update on next frame to ensure correct positioning
    requestAnimationFrame(() => {
      updateLogoMask();
    });
    
    // And once more after a short delay to catch any layout changes
    const maskUpdateTimeout = setTimeout(() => {
      updateLogoMask();
    }, 50);
    
    // Also update when component becomes visible (IntersectionObserver)
    let observer: IntersectionObserver | null = null;
    if (heroRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateLogoMask();
              requestAnimationFrame(() => {
                updateLogoMask();
              });
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(heroRef.current);
    }

    // REVERSE: Start with small overlay scale (like 1 or 0.01) instead of 500
    const finalOverlayScale = 800;
    const initialOverlayScale = 1;

    // Ensure images are visible immediately (normal scale)
    // Use immediate: true to avoid any animation delay
    gsap.set(heroImgContainerRef.current, {
      scale: 1,
      opacity: 1,
      visibility: "visible",
      immediateRender: true,
    });


    // Set fade overlay to be transparent initially
    gsap.set(fadeOverlayRef.current, {
      opacity: 0,
      visibility: "visible",
      immediateRender: true,
    });

    // Set initial overlay scale - start small (centered at logo position)
    // The overlay should be small initially, revealing the image
    gsap.set(svgOverlayRef.current, {
      transformOrigin: "52% 50%",
      xPercent: 0,
      yPercent: 0,
      left: 0,
      top: 0,
      scale: initialOverlayScale,
      opacity: 1,
      visibility: "visible",
      immediateRender: true,
    });

    let isSettingUp = false;
    const setupScrollTrigger = () => {
      // Prevent infinite recursion
      if (isSettingUp) return;
      isSettingUp = true;

      // Kill existing ScrollTrigger instance if it exists
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      const triggerElement = heroRef.current;
      if (!triggerElement) {
        isSettingUp = false;
        return;
      }

      const endValue = window.innerHeight * scrollMultiplier;

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: triggerElement,
        start: "top top",
        end: () => `+=${endValue}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          // Ensure logo mask is updated when section enters viewport
          // Update multiple times to ensure correct positioning
          updateLogoMask();
          requestAnimationFrame(() => {
            updateLogoMask();
          });
        },
        onLeave: () => {
          // Smooth unpinning - don't refresh immediately to avoid scrollbar hang
          // Let ScrollTrigger handle it naturally
        },
        onEnterBack: () => {
          // Update logo mask when scrolling back
          updateLogoMask();
        },
        onUpdate: (self) => {
          const scrollProgress = self.progress;

          // REVERSE: Main animation - scale image and overlay UP (first 85% of scroll)
          if (scrollProgress <= 0.85) {
            const normalizedProgress = scrollProgress * (1 / 0.85);
            // Image scales from 1 to 1.5 (reverse)
            const heroImgContainerScale = 1 + 0.5 * normalizedProgress;
            // Overlay scales from 1 to 800 (reverse)
            const overlayScale =
              initialOverlayScale *
              Math.pow(
                finalOverlayScale / initialOverlayScale,
                normalizedProgress
              );

            gsap.set(heroImgContainerRef.current, {
              scale: heroImgContainerScale,
            });

            gsap.set(svgOverlayRef.current, {
              transformOrigin: "52% 50%",
              scale: overlayScale,
              force3D: true,
            });

            gsap.set(fadeOverlayRef.current, {
              opacity: 0,
            });
          } else {
            // Ensure final state is set when progress > 0.85 to prevent jump
            const finalHeroImgContainerScale = 1.5;
            const finalOverlayScaleValue =
              initialOverlayScale *
              Math.pow(finalOverlayScale / initialOverlayScale, 1);

            gsap.set(heroImgContainerRef.current, {
              scale: finalHeroImgContainerScale,
            });

            gsap.set(svgOverlayRef.current, {
              transformOrigin: "52% 50%",
              scale: finalOverlayScaleValue,
              force3D: true,
            });

            gsap.set(fadeOverlayRef.current, {
              opacity: 0,
            });
          }

        },
      });

      isSettingUp = false;
    };

    // Initial setup - setup immediately, don't wait for image
    // The image will load naturally and be visible
    const initTimeout = setTimeout(() => {
      setupScrollTrigger();
      // Refresh after ScrollTrigger is created to ensure proper positioning
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, 50);

    const handleResize = () => {
      updateLogoMask();
      // Use requestAnimationFrame to debounce and avoid recursion
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        setupScrollTrigger();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(maskUpdateTimeout);
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      // Cleanup normalizeScroll
      if (!enableSmoothScroll) {
        ScrollTrigger.normalizeScroll(false);
      }
      // Refresh ScrollTrigger to clear any cached values
      ScrollTrigger.refresh();
    };
  }, [logoSvgPath, scrollMultiplier, overlayColor]);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative w-full h-screen bg-white text-center overflow-hidden"
        style={{ backgroundColor }}
      >
        {/* Background Container (Black Div) */}
        <div
          ref={heroImgContainerRef}
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{ transform: "scale(1)", opacity: 1, backgroundColor: "#000000" }}
        />

        {/* Fade Overlay */}
        <div
          ref={fadeOverlayRef}
          className="absolute top-0 left-0 w-full h-full bg-white will-change-[opacity] z-10"
        />

        {/* SVG Overlay with Mask */}
        <div
          ref={svgOverlayRef}
          className="absolute top-0 left-0 w-full h-full z-[100] origin-center pointer-events-none"
          style={{ opacity: 1, visibility: "visible", display: "block" }}
        >
          <svg width="100%" height="100%" style={{ display: "block" }}>
            <defs>
              <mask id={maskId}>
                <rect width="100%" height="100%" fill="white" />
                <path
                  ref={logoMaskRef}
                  id="logoMask"
                  d={logoSvgPath}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={overlayColor}
              mask={`url(#${maskId})`}
            />
          </svg>
        </div>

        {/* Logo Container (invisible, used for positioning) */}
        <div
          ref={logoContainerRef}
          className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center w-[400px] h-[400px] z-[101]"
        />
      </section>
    </>
  );
}
