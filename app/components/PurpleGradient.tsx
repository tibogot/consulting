'use client';

import { useEffect, useRef } from 'react';
import styles from './PurpleGradient.module.css';

export default function PurpleGradient() {
  const blobRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize gradient position to bottom-right
    if (typeof window !== 'undefined') {
      mouseX.current = window.innerWidth * 1.3;
      mouseY.current = window.innerHeight * 1.0;
      currentX.current = mouseX.current;
      currentY.current = mouseY.current;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const animate = () => {
      // Very slow lerp for subtle, barely noticeable movement
      const ease = 0.005;
      currentX.current += (mouseX.current - currentX.current) * ease;
      currentY.current += (mouseY.current - currentY.current) * ease;

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
  }, []);

  return (
    <>
      {/* Gradient background layer */}
      <div className={styles.gradientContainer}>
        <div ref={blobRef} className={styles.gradientBlob} />
      </div>

      {/* Noise texture overlay */}
      <div className={styles.noiseOverlay} />
    </>
  );
}
