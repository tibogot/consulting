"use client";

import React, { useRef, useEffect } from "react";

interface PathPoint {
  x: number;
  y: number;
}

interface PathData {
  points: PathPoint[];
  isBranch: boolean;
}

class Pulse {
  points: PathPoint[];
  isBranch: boolean;
  progress = 0;
  speed = 0.006 + Math.random() * 0.005;
  pulseLength = 0.18;
  waiting = true;
  delay = Math.random() * 2500;
  startTime = performance.now();
  totalLength = 0;

  constructor(pathData: PathData) {
    this.points = pathData.points;
    this.isBranch = pathData.isBranch;

    for (let i = 0; i < this.points.length - 1; i++) {
      const dx = this.points[i + 1].x - this.points[i].x;
      const dy = this.points[i + 1].y - this.points[i].y;
      this.totalLength += Math.sqrt(dx * dx + dy * dy);
    }
  }

  reset() {
    this.progress = 0;
    this.speed = 0.006 + Math.random() * 0.005;
    this.pulseLength = 0.18;
    this.waiting = true;
    this.delay = Math.random() * 2500;
    this.startTime = performance.now();
  }

  getPointAtProgress(t: number): PathPoint {
    if (t <= 0) return { ...this.points[0] };
    if (t >= 1) return { ...this.points[this.points.length - 1] };

    const targetDist = t * this.totalLength;
    let dist = 0;

    for (let i = 0; i < this.points.length - 1; i++) {
      const dx = this.points[i + 1].x - this.points[i].x;
      const dy = this.points[i + 1].y - this.points[i].y;
      const segLen = Math.sqrt(dx * dx + dy * dy);

      if (dist + segLen >= targetDist) {
        const segT = (targetDist - dist) / segLen;
        return {
          x: this.points[i].x + dx * segT,
          y: this.points[i].y + dy * segT,
        };
      }
      dist += segLen;
    }
    return { ...this.points[this.points.length - 1] };
  }

  update(): { points: PathPoint[]; opacity: number; lineWidth: number } | null {
    const now = performance.now();

    if (this.waiting) {
      if (now - this.startTime > this.delay) {
        this.waiting = false;
        this.progress = 0;
      }
      return null;
    }

    this.progress += this.speed;

    if (this.progress > 1 + this.pulseLength) {
      this.reset();
      this.delay = 1000 + Math.random() * 2500;
      this.startTime = now;
      return null;
    }

    const startT = Math.max(0, this.progress - this.pulseLength);
    const endT = Math.min(1, this.progress);

    if (endT <= startT) return null;

    const pulsePoints: PathPoint[] = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const t = startT + (endT - startT) * (i / steps);
      pulsePoints.push(this.getPointAtProgress(t));
    }

    let opacity = 1;
    if (this.progress < 0.1) {
      opacity = this.progress / 0.1;
    } else if (this.progress > 0.85) {
      opacity = 1 - (this.progress - 0.85) / 0.15;
    }

    return {
      points: pulsePoints,
      opacity,
      lineWidth: this.isBranch ? 0.8 : 1.2,
    };
  }
}

interface CircuitBoardAnimationProps {
  /** Path to logo SVG (from public folder) */
  logoSrc?: string;
  /** Optional additional className for the container */
  className?: string;
}

export default function CircuitBoardAnimation({
  logoSrc = "/images/logosvg.svg",
  className = "",
}: CircuitBoardAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const scaleRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasEl = canvas;
    const context = ctx;

    const allPaths: PathData[] = [];
    const pulses: Pulse[] = [];

    const centerX = () => window.innerWidth / 2;
    const centerY = () => window.innerHeight / 2;
    const chipWidth = () => 200 * scaleRef.current;
    const chipHeight = () => 80 * scaleRef.current;
    const linesPerSide = 22;

    function generateMotherboardPath(
      startX: number,
      startY: number,
      direction: "up" | "down" | "left" | "right",
      spreadFactor: number
    ) {
      const points = [{ x: startX, y: startY }];
      let x = startX;
      let y = startY;

      const numSegments = 3 + Math.floor(Math.random() * 4);

      const mainVectors: Record<string, { x: number; y: number }> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };

      const diagonalVectors: Record<string, { x: number; y: number }[]> = {
        up: [
          { x: 0.707, y: -0.707 },
          { x: -0.707, y: -0.707 },
        ],
        down: [
          { x: 0.707, y: 0.707 },
          { x: -0.707, y: 0.707 },
        ],
        left: [
          { x: -0.707, y: -0.707 },
          { x: -0.707, y: 0.707 },
        ],
        right: [
          { x: 0.707, y: -0.707 },
          { x: 0.707, y: 0.707 },
        ],
      };

      let lastWasDiagonal = false;

      for (let i = 0; i < numSegments; i++) {
        const length = (35 + Math.random() * 100) * scaleRef.current;
        let vec: { x: number; y: number };

        if (lastWasDiagonal || Math.random() < 0.4) {
          vec = mainVectors[direction];
          lastWasDiagonal = false;
        } else {
          const diags = diagonalVectors[direction];
          if (spreadFactor > 0.2) {
            vec = diags[0];
          } else if (spreadFactor < -0.2) {
            vec = diags[1];
          } else {
            vec = diags[Math.floor(Math.random() * 2)];
          }
          lastWasDiagonal = true;
        }

        x += vec.x * length;
        y += vec.y * length;
        points.push({ x, y });
      }

      return points;
    }

    function generateBranch(
      startX: number,
      startY: number,
      direction: "up" | "down" | "left" | "right",
      branchDir: number
    ) {
      const points = [{ x: startX, y: startY }];
      let x = startX;
      let y = startY;

      const numSegments = 2 + Math.floor(Math.random() * 2);

      const branchVectors: Record<string, { x: number; y: number }> = {
        up: branchDir > 0 ? { x: 0.707, y: -0.707 } : { x: -0.707, y: -0.707 },
        down: branchDir > 0 ? { x: 0.707, y: 0.707 } : { x: -0.707, y: 0.707 },
        left:
          branchDir > 0 ? { x: -0.707, y: -0.707 } : { x: -0.707, y: 0.707 },
        right: branchDir > 0 ? { x: 0.707, y: -0.707 } : { x: 0.707, y: 0.707 },
      };

      const straightVectors: Record<string, { x: number; y: number }> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };

      let useDiagonal = true;

      for (let i = 0; i < numSegments; i++) {
        const length = (25 + Math.random() * 70) * scaleRef.current;
        const vec = useDiagonal
          ? branchVectors[direction]
          : straightVectors[direction];

        x += vec.x * length;
        y += vec.y * length;
        points.push({ x, y });

        if (Math.random() < 0.5) useDiagonal = !useDiagonal;
      }

      return points;
    }

    function generateAllPaths() {
      allPaths.length = 0;

      const cx = centerX();
      const cy = centerY();
      const halfW = chipWidth() / 2;
      const halfH = chipHeight() / 2;

      const sides: {
        name: string;
        getStart: (t: number) => { x: number; y: number };
        dir: "up" | "down" | "left" | "right";
      }[] = [
        {
          name: "top",
          getStart: (t) => ({
            x: cx - halfW + t * chipWidth(),
            y: cy - halfH,
          }),
          dir: "up",
        },
        {
          name: "bottom",
          getStart: (t) => ({
            x: cx - halfW + t * chipWidth(),
            y: cy + halfH,
          }),
          dir: "down",
        },
        {
          name: "left",
          getStart: (t) => ({
            x: cx - halfW,
            y: cy - halfH + t * chipHeight(),
          }),
          dir: "left",
        },
        {
          name: "right",
          getStart: (t) => ({
            x: cx + halfW,
            y: cy - halfH + t * chipHeight(),
          }),
          dir: "right",
        },
      ];

      sides.forEach((side) => {
        const count =
          side.name === "left" || side.name === "right"
            ? Math.floor(linesPerSide * 0.4)
            : linesPerSide;
        for (let i = 0; i < count; i++) {
          const t = i / (count - 1);
          const start = side.getStart(t);
          const spreadFactor = t - 0.5;

          const mainPath = generateMotherboardPath(
            start.x,
            start.y,
            side.dir,
            spreadFactor * 2
          );
          allPaths.push({ points: mainPath, isBranch: false });

          if (Math.random() < 0.4 && mainPath.length > 2) {
            const branchStart = mainPath[1];
            const branchDir = spreadFactor > 0 ? 1 : -1;
            const branch = generateBranch(
              branchStart.x,
              branchStart.y,
              side.dir,
              branchDir
            );
            allPaths.push({ points: branch, isBranch: true });
          }

          if (Math.random() < 0.2 && mainPath.length > 3) {
            const branchStart = mainPath[2];
            const branchDir = spreadFactor > 0 ? -1 : 1;
            const branch = generateBranch(
              branchStart.x,
              branchStart.y,
              side.dir,
              branchDir
            );
            allPaths.push({ points: branch, isBranch: true });
          }
        }
      });
    }

    function drawPath(
      points: PathPoint[],
      color: string,
      lineWidth: number,
      glow = false
    ) {
      if (points.length < 2) return;

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }

      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      context.lineJoin = "round";

      if (glow) {
        context.shadowColor = "#e9d5ff";
        context.shadowBlur = 10 * scaleRef.current;
      } else {
        context.shadowBlur = 0;
      }

      context.stroke();
    }

    function drawStaticLines() {
      context.shadowBlur = 0;
      allPaths.forEach((pathData) => {
        const color = pathData.isBranch
          ? "rgba(40, 35, 55, 0.7)"
          : "rgba(45, 40, 65, 0.7)";
        const lineWidth = (pathData.isBranch ? 0.8 : 1.2) * scaleRef.current;
        drawPath(pathData.points, color, lineWidth, false);
      });
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvasEl.width = window.innerWidth * dpr;
      canvasEl.height = window.innerHeight * dpr;
      context.scale(dpr, dpr);

      scaleRef.current = Math.min(
        window.innerWidth / 1000,
        window.innerHeight / 700
      );
      scaleRef.current = Math.max(0.5, Math.min(scaleRef.current, 1.5));

      generateAllPaths();
      pulses.length = 0;
      allPaths.forEach((path) => pulses.push(new Pulse(path)));
    }

    function animate() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      context.fillStyle = "#000";
      context.fillRect(0, 0, w, h);

      const cx = centerX();
      const cy = centerY();
      const gradient = context.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        350 * scaleRef.current
      );
      gradient.addColorStop(0, "rgba(10, 21, 32, 0.5)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, w, h);

      drawStaticLines();

      pulses.forEach((pulse) => {
        const result = pulse.update();
        if (result) {
          context.globalAlpha = result.opacity * 0.6;
          drawPath(
            result.points,
            "#a78bfa",
            (result.lineWidth + 3) * scaleRef.current,
            true
          );

          context.globalAlpha = result.opacity;
          drawPath(
            result.points,
            "#fce7ff",
            result.lineWidth * scaleRef.current,
            true
          );

          context.globalAlpha = 1;
        }
      });

      context.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`relative h-full min-h-screen w-full overflow-hidden bg-black ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      <img
        src={logoSrc}
        alt="Logo"
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-auto w-[clamp(200px,32vw,420px)] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
