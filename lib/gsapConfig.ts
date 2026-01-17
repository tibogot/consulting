import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useSyncExternalStore } from "react";

// Register all plugins
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, Flip);

// Safe hydration hook for client-side only rendering
const emptySubscribe = () => () => {};
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin, Flip, useGSAP };
