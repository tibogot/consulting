'use client';

import { useEffect, useRef } from 'react';
import { useControls } from 'leva';

export default function CssGradientTailwind() {
  const blobRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Leva controls for blob size and position
  const blobSize = useControls('Blob Size', {
    width: { value: 2000, min: 500, max: 5000, step: 100, label: 'Width (px)' },
    height: { value: 3000, min: 500, max: 5000, step: 100, label: 'Height (px)' },
  });

  const blobPosition = useControls('Blob Position', {
    initialLeft: { value: 30, min: 0, max: 100, step: 1, label: 'Initial Left (%)' },
    initialTop: { value: 50, min: 0, max: 100, step: 1, label: 'Initial Top (%)' },
  });

  // Helper function to convert hex color to RGBA
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b, a: alpha };
  };

  // Leva controls for gradient colors with color pickers
  const gradientColors = useControls('🎨 Gradient Colors', {
    color1: { value: '#b4a0c8', label: 'Color 1' },
    color1Alpha: { value: 0.7, min: 0, max: 1, step: 0.01, label: 'Color 1 - Alpha' },
    color2: { value: '#9682b4', label: 'Color 2' },
    color2Alpha: { value: 0.5, min: 0, max: 1, step: 0.01, label: 'Color 2 - Alpha' },
    color3: { value: '#786ea0', label: 'Color 3' },
    color3Alpha: { value: 0.3, min: 0, max: 1, step: 0.01, label: 'Color 3 - Alpha' },
    color4: { value: '#645a96', label: 'Color 4' },
    color4Alpha: { value: 0.1, min: 0, max: 1, step: 0.01, label: 'Color 4 - Alpha' },
  });

  // Leva controls for gradient stops
  const gradientStops = useControls('Gradient Stops', {
    stop1: { value: 0, min: 0, max: 100, step: 1, label: 'Stop 1 (%)' },
    stop2: { value: 30, min: 0, max: 100, step: 1, label: 'Stop 2 (%)' },
    stop3: { value: 50, min: 0, max: 100, step: 1, label: 'Stop 3 (%)' },
    stop4: { value: 70, min: 0, max: 100, step: 1, label: 'Stop 4 (%)' },
  });

  // Leva controls for blob effects
  const blobEffects = useControls('Blob Effects', {
    blur: { value: 150, min: 0, max: 300, step: 5, label: 'Blur (px)' },
    scaleY: { value: 1.2, min: 0.5, max: 3, step: 0.1, label: 'Scale Y' },
    borderRadius: { value: '50% 50% 50% 50% / 60% 60% 40% 40%', label: 'Border Radius' },
  });

  // Leva controls for animation
  const animation = useControls('Animation', {
    ease: { value: 0.08, min: 0.01, max: 0.5, step: 0.01, label: 'Ease Speed' },
    transitionDuration: { value: 0.4, min: 0, max: 2, step: 0.1, label: 'Transition Duration (s)' },
  });

  // Leva controls for noise overlay
  const noiseOverlay = useControls('Noise Overlay', {
    opacity: { value: 0.08, min: 0, max: 1, step: 0.01, label: 'Opacity' },
  });

  useEffect(() => {
    // Initialize mouse position based on Leva controls
    if (typeof window !== 'undefined') {
      mouseX.current = (window.innerWidth * blobPosition.initialLeft) / 100;
      mouseY.current = (window.innerHeight * blobPosition.initialTop) / 100;
      currentX.current = mouseX.current;
      currentY.current = mouseY.current;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const animate = () => {
      // Use Leva ease value
      currentX.current += (mouseX.current - currentX.current) * animation.ease;
      currentY.current += (mouseY.current - currentY.current) * animation.ease;

      if (blobRef.current) {
        blobRef.current.style.left = `${currentX.current}px`;
        blobRef.current.style.top = `${currentY.current}px`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [blobPosition.initialLeft, blobPosition.initialTop, animation.ease]);

  // Convert color picker values to RGBA
  const color1Rgba = hexToRgba(gradientColors.color1, gradientColors.color1Alpha);
  const color2Rgba = hexToRgba(gradientColors.color2, gradientColors.color2Alpha);
  const color3Rgba = hexToRgba(gradientColors.color3, gradientColors.color3Alpha);
  const color4Rgba = hexToRgba(gradientColors.color4, gradientColors.color4Alpha);

  // Build gradient string from Leva controls
  const gradientString = `radial-gradient(
    ellipse at center,
    rgba(${color1Rgba.r}, ${color1Rgba.g}, ${color1Rgba.b}, ${color1Rgba.a}) ${gradientStops.stop1}%,
    rgba(${color2Rgba.r}, ${color2Rgba.g}, ${color2Rgba.b}, ${color2Rgba.a}) ${gradientStops.stop2}%,
    rgba(${color3Rgba.r}, ${color3Rgba.g}, ${color3Rgba.b}, ${color3Rgba.a}) ${gradientStops.stop3}%,
    rgba(${color4Rgba.r}, ${color4Rgba.g}, ${color4Rgba.b}, ${color4Rgba.a}) ${gradientStops.stop4}%,
    transparent 100%
  )`;

  return (
    <>
      {/* Gradient background layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] overflow-hidden">
        <div
          ref={blobRef}
          className="absolute"
          style={{
            width: `${blobSize.width}px`,
            height: `${blobSize.height}px`,
            borderRadius: blobEffects.borderRadius,
            background: gradientString,
            filter: `blur(${blobEffects.blur}px)`,
            transform: `translate(-50%, -50%) scaleY(${blobEffects.scaleY})`,
            transition: `left ${animation.transitionDuration}s cubic-bezier(0.25, 0.1, 0.25, 1), top ${animation.transitionDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`,
            left: `${blobPosition.initialLeft}%`,
            top: `${blobPosition.initialTop}%`,
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[2]"
        style={{
          opacity: noiseOverlay.opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
