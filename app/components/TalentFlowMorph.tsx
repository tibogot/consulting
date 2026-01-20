"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type TalentFlowMorphProps = {
  className?: string;
  particleCount?: number;
  autoMorphMs?: number;
};

type LoadedImage = {
  url: string;
  img: HTMLImageElement;
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

async function loadImageFromFile(file: File): Promise<LoadedImage> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;

    // Prefer decode() when available (more reliable than onload in some cases)
    if (typeof img.decode === "function") {
      await img.decode();
    } else {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
      });
    }

    return { url, img };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

function extractPositionsFromImage(
  img: HTMLImageElement,
  targetCount: number,
  processorCanvas: HTMLCanvasElement
) {
  const ctx = processorCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array(targetCount * 3);

  const maxSize = 220;
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > height) {
    if (width > maxSize) {
      height = Math.floor((height / width) * maxSize);
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width = Math.floor((width / height) * maxSize);
      height = maxSize;
    }
  }

  width = Math.max(1, Math.floor(width));
  height = Math.max(1, Math.floor(height));

  processorCanvas.width = width;
  processorCanvas.height = height;

  // White background so transparent pixels can be treated consistently
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  const darkPixels: Array<{ x: number; y: number }> = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      const brightness = (r + g + b) / 3;
      const isDark = brightness < 128 || a < 128;

      if (isDark && a > 50) {
        darkPixels.push({ x, y });
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Normalize to the silhouette bounds so padded logos still fill.
  const bboxW = darkPixels.length ? Math.max(1, maxX - minX + 1) : 1;
  const bboxH = darkPixels.length ? Math.max(1, maxY - minY + 1) : 1;
  const centerX = darkPixels.length ? (minX + maxX) * 0.5 : width * 0.5;
  const centerY = darkPixels.length ? (minY + maxY) * 0.5 : height * 0.5;
  const maxDim = Math.max(bboxW, bboxH);

  const positions = new Float32Array(targetCount * 3);
  if (darkPixels.length === 0) {
    for (let i = 0; i < targetCount; i++) {
      const i3 = i * 3;
      // Normalized space (max extent ~0.5 before world scaling)
      positions[i3] = (Math.random() - 0.5);
      positions[i3 + 1] = (Math.random() - 0.5);
      positions[i3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return positions;
  }

  for (let i = 0; i < targetCount; i++) {
    const i3 = i * 3;
    const pixel = darkPixels[Math.floor(Math.random() * darkPixels.length)];
    const jitterX = (Math.random() - 0.5) * (1 / maxDim) * 1.5;
    const jitterY = (Math.random() - 0.5) * (1 / maxDim) * 1.5;

    positions[i3] = (pixel.x - centerX) / maxDim + jitterX;
    positions[i3 + 1] = -((pixel.y - centerY) / maxDim + jitterY);
    positions[i3 + 2] = (Math.random() - 0.5) * 0.06;
  }

  return positions;
}

export default function TalentFlowMorph({
  className = "",
  particleCount = 20000,
  autoMorphMs = 6000,
}: TalentFlowMorphProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [img1, setImg1] = useState<LoadedImage | null>(null);
  const [img2, setImg2] = useState<LoadedImage | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const ready = !!img1 && !!img2;

  const colorPalette = useMemo(
    () => [
      new THREE.Color(0xa855f7),
      new THREE.Color(0xc084fc),
      new THREE.Color(0xec4899),
      new THREE.Color(0xf472b6),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0xd946ef),
    ],
    []
  );

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    if (!isRunning) return;
    if (!img1 || !img2) return;

    const processorCanvas = document.createElement("canvas");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    containerEl.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 12;

    const count = Math.max(1000, Math.floor(particleCount));

    // Scale the normalized silhouette to fill the viewport (contain, with margin).
    let shapeScale = 1;
    const updateShapeScale = () => {
      const distance = camera.position.distanceTo(controls.target);
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
      const visibleWidth = visibleHeight * camera.aspect;
      const minDim = Math.min(visibleWidth, visibleHeight);
      // Normalized silhouette max half-extent is ~0.5 => multiplying by ~minDim makes it fill.
      shapeScale = minDim * 0.85;
    };

    const setSize = () => {
      const rect = containerEl.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      updateShapeScale();
    };
    setSize();

    const shape1Positions = extractPositionsFromImage(img1.img, count, processorCanvas);
    const shape2Positions = extractPositionsFromImage(img2.img, count, processorCanvas);

    const currentPositions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      sizes[i] = 0.012 + Math.random() * 0.018;
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      currentPositions[i3] = shape1Positions[i3] * shapeScale;
      currentPositions[i3 + 1] = shape1Positions[i3 + 1] * shapeScale;
      currentPositions[i3 + 2] = shape1Positions[i3 + 2] * shapeScale;
      targetPositions[i3] = currentPositions[i3];
      targetPositions[i3 + 1] = currentPositions[i3 + 1];
      targetPositions[i3 + 2] = currentPositions[i3 + 2];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const vertexShader = `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (350.0 / max(0.1, -mvPosition.z));
        gl_Position = projectionMatrix * mvPosition;
        // Match the original demo behavior: closer = brighter, farther = dimmer
        vAlpha = 1.0 - smoothstep(2.0, 12.0, -mvPosition.z);
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        float alpha = (1.0 - smoothstep(0.1, 0.5, dist)) * vAlpha;
        vec3 glow = vColor * 1.5;
        vec3 finalColor = mix(vColor, glow, smoothstep(0.3, 0.0, dist));

        gl_FragColor = vec4(finalColor, alpha * 0.95);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    // Mouse repulsion (screen -> plane intersection)
    const mouse = new THREE.Vector2(9999, 9999);
    const mouse3D = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const repulsionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const repulsionRadiusFactor = 0.16;
    const repulsionStrengthFactor = 0.03;

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouse.x = x * 2 - 1;
      mouse.y = -(y * 2 - 1);
    };
    const onPointerLeave = () => {
      mouse.x = 9999;
      mouse.y = 9999;
    };
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);

    // Morph state
    let currentState: "shape1" | "shape2" = "shape1";
    let isTransitioning = false;
    let morphProgress = 0;
    let targetState: "shape1" | "shape2" = "shape1";

    const triggerMorph = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      morphProgress = 0;
      targetState = currentState === "shape1" ? "shape2" : "shape1";
    };

    // Click to transform (no extra UI)
    const onClick = () => triggerMorph();
    renderer.domElement.addEventListener("click", onClick);

    let autoInterval: number | null = null;
    if (autoMorphMs > 0) {
      autoInterval = window.setInterval(() => {
        triggerMorph();
      }, autoMorphMs);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => setSize());
      resizeObserver.observe(containerEl);
    } else {
      window.addEventListener("resize", setSize);
    }

    let raf = 0;
    let time = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      time += 0.005;
      controls.update();

      // Mouse position in 3D
      raycaster.setFromCamera(mouse, camera);
      let mouseValid = Math.abs(mouse.x) < 2 && Math.abs(mouse.y) < 2;
      if (mouseValid) {
        const hit = raycaster.ray.intersectPlane(repulsionPlane, mouse3D);
        if (!hit) mouseValid = false;
      }

      let basePositions = targetPositions;

      if (isTransitioning) {
        morphProgress += 0.008;
        if (morphProgress >= 1) {
          morphProgress = 1;
          isTransitioning = false;
          currentState = targetState;
        }

        const eased = easeInOutCubic(morphProgress);
        const source = targetState === "shape2" ? shape1Positions : shape2Positions;
        const dest = targetState === "shape2" ? shape2Positions : shape1Positions;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const chaos = Math.sin(morphProgress * Math.PI) * (shapeScale * 0.08);
          const noiseX = Math.sin(time * 2 + i * 0.01) * chaos;
          const noiseY = Math.cos(time * 2 + i * 0.02) * chaos;
          const noiseZ = Math.sin(time * 3 + i * 0.015) * chaos;

          const x = source[i3] + (dest[i3] - source[i3]) * eased;
          const y = source[i3 + 1] + (dest[i3 + 1] - source[i3 + 1]) * eased;
          const z = source[i3 + 2] + (dest[i3 + 2] - source[i3 + 2]) * eased;

          targetPositions[i3] = x * shapeScale + noiseX;
          targetPositions[i3 + 1] = y * shapeScale + noiseY;
          targetPositions[i3 + 2] = z * shapeScale + noiseZ;
        }
        basePositions = targetPositions;
      } else {
        const source = currentState === "shape1" ? shape1Positions : shape2Positions;
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const floatAmount = shapeScale * 0.003;
          targetPositions[i3] = source[i3] * shapeScale + Math.sin(time + i * 0.01) * floatAmount;
          targetPositions[i3 + 1] =
            source[i3 + 1] * shapeScale + Math.cos(time * 0.8 + i * 0.02) * floatAmount;
          targetPositions[i3 + 2] =
            source[i3 + 2] * shapeScale + Math.sin(time * 1.2 + i * 0.015) * floatAmount * 0.5;
        }
        basePositions = targetPositions;
      }

      const repulsionRadius = shapeScale * repulsionRadiusFactor;
      const repulsionStrength = shapeScale * repulsionStrengthFactor;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const targetX = basePositions[i3];
        const targetY = basePositions[i3 + 1];
        const targetZ = basePositions[i3 + 2];

        if (mouseValid) {
          const dx = currentPositions[i3] - mouse3D.x;
          const dy = currentPositions[i3 + 1] - mouse3D.y;
          const dz = currentPositions[i3 + 2] - mouse3D.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < repulsionRadius && dist > 0.001) {
            const force = (1 - dist / repulsionRadius) * repulsionStrength;
            const inv = 1 / dist;
            velocities[i3] += dx * inv * force;
            velocities[i3 + 1] += dy * inv * force;
            velocities[i3 + 2] += dz * inv * force;
          }
        }

        velocities[i3] *= 0.92;
        velocities[i3 + 1] *= 0.92;
        velocities[i3 + 2] *= 0.92;

        const springStrength = 0.08;
        velocities[i3] += (targetX - currentPositions[i3]) * springStrength;
        velocities[i3 + 1] += (targetY - currentPositions[i3 + 1]) * springStrength;
        velocities[i3 + 2] += (targetZ - currentPositions[i3 + 2]) * springStrength;

        currentPositions[i3] += velocities[i3];
        currentPositions[i3 + 1] += velocities[i3 + 1];
        currentPositions[i3 + 2] += velocities[i3 + 2];
      }

      const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      positionAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (autoInterval) window.clearInterval(autoInterval);
      cancelAnimationFrame(raf);

      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("click", onClick);

      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", setSize);

      controls.dispose();

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      try {
        containerEl.removeChild(renderer.domElement);
      } catch {
        // ignore
      }
    };
  }, [autoMorphMs, colorPalette, img1, img2, isRunning, particleCount, runKey]);

  useEffect(() => {
    return () => {
      if (img1) URL.revokeObjectURL(img1.url);
      if (img2) URL.revokeObjectURL(img2.url);
    };
  }, [img1, img2]);

  const handlePick1 = async (file: File | null) => {
    if (!file) return;
    if (img1) URL.revokeObjectURL(img1.url);
    const loaded = await loadImageFromFile(file);
    setImg1(loaded);
  };

  const handlePick2 = async (file: File | null) => {
    if (!file) return;
    if (img2) URL.revokeObjectURL(img2.url);
    const loaded = await loadImageFromFile(file);
    setImg2(loaded);
  };

  const reset = () => {
    setIsRunning(false);
    setRunKey((k) => k + 1);
    if (img1) URL.revokeObjectURL(img1.url);
    if (img2) URL.revokeObjectURL(img2.url);
    setImg1(null);
    setImg2(null);
  };

  const start = () => {
    if (!ready) return;
    setRunKey((k) => k + 1);
    setIsRunning(true);
  };

  return (
    <div className={`relative h-svh w-full overflow-hidden bg-black ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />

      {!isRunning && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/90 p-4">
          <div className="w-full max-w-xl">
            <div className="grid grid-cols-2 gap-3">
              <label className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl border border-white/15 bg-white/5 hover:bg-white/10">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePick1(e.target.files?.[0] ?? null)}
                />
                {img1 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img1.url}
                    alt=""
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/60">
                    Image 1
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </label>

              <label className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl border border-white/15 bg-white/5 hover:bg-white/10">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePick2(e.target.files?.[0] ?? null)}
                />
                {img2 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img2.url}
                    alt=""
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/60">
                    Image 2
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </label>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={start}
                disabled={!ready}
                className={[
                  "rounded-full px-6 py-2 text-sm font-semibold tracking-wide",
                  "transition",
                  ready
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/20 text-white/50",
                ].join(" ")}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {isRunning && (
        <button
          type="button"
          onClick={reset}
          className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur hover:bg-black/55"
          title="Choose new images"
        >
          Reset
        </button>
      )}

      {/* Ensure layout height for the absolute canvas */}
      <div className="h-full w-full" />
    </div>
  );
}

