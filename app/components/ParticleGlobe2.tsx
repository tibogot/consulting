"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleGlobeProps {
  className?: string;
  globeRadius?: number;
  targetParticles?: number;
  autoRotateSpeed?: number;
  repulsionStrength?: number;
  repulsionRadius?: number;
  returnSpeed?: number;
}

export default function ParticleGlobe({
  className = "",
  globeRadius = 100,
  targetParticles = 45000,
  autoRotateSpeed = 0.001,
  repulsionStrength = 3.5,
  repulsionRadius = 0.1,
  returnSpeed = 0.045,
}: ParticleGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeRef = useRef<THREE.Points | null>(null);
  const glowMeshRef = useRef<THREE.Mesh | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const animationRef = useRef<number | null>(null);

  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(9999, 9999));
  const autoRotateRef = useRef<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const originalPositionsRef = useRef<Array<{ x: number; y: number; z: number }>>([]);
  const velocitiesRef = useRef<Array<{ x: number; y: number; z: number }>>([]);

  // Continent data
  const continentData = {
    northAmerica: [
      [-168, 65], [-166, 60], [-143, 60], [-140, 70], [-156, 71], [-157, 72], [-152, 78],
      [-120, 76], [-86, 78], [-82, 83], [-62, 83], [-62, 78], [-68, 75], [-73, 78], [-80, 73],
      [-87, 68], [-92, 68], [-94, 72], [-96, 76], [-109, 78], [-117, 76], [-130, 70], [-141, 69],
      [-143, 70], [-168, 65],
    ],
    northAmericaMain: [
      [-130, 55], [-125, 50], [-124, 40], [-117, 33], [-110, 32], [-104, 29], [-100, 28],
      [-97, 26], [-97, 28], [-95, 29], [-90, 30], [-88, 30], [-83, 29], [-81, 25], [-80, 25],
      [-82, 28], [-81, 31], [-75, 35], [-76, 37], [-73, 40], [-70, 41], [-70, 44], [-67, 45],
      [-67, 47], [-70, 47], [-64, 45], [-66, 43], [-60, 46], [-55, 47], [-55, 52], [-60, 53],
      [-66, 50], [-70, 47], [-75, 45], [-80, 45], [-83, 46], [-88, 48], [-90, 48], [-94, 49],
      [-102, 49], [-115, 49], [-123, 49], [-125, 50], [-130, 55],
    ],
    centralAmerica: [
      [-117, 33], [-110, 32], [-104, 29], [-100, 28], [-97, 26], [-97, 22], [-96, 19], [-94, 18],
      [-92, 15], [-88, 16], [-84, 16], [-83, 15], [-83, 10], [-80, 9], [-78, 9], [-77, 8],
      [-82, 8], [-84, 11], [-86, 12], [-88, 13], [-90, 14], [-92, 15], [-94, 16], [-96, 17],
      [-97, 22], [-100, 22], [-105, 20], [-110, 23], [-117, 28], [-117, 33],
    ],
    southAmerica: [
      [-80, 9], [-78, 9], [-77, 8], [-77, 5], [-80, 2], [-80, -3], [-75, -5], [-70, -4],
      [-70, -15], [-75, -18], [-70, -22], [-67, -22], [-58, -24], [-55, -22], [-55, -25],
      [-58, -28], [-56, -30], [-58, -32], [-58, -38], [-62, -38], [-64, -40], [-65, -42],
      [-65, -46], [-70, -46], [-72, -50], [-74, -52], [-70, -55], [-65, -55], [-58, -52],
      [-55, -50], [-52, -45], [-50, -40], [-48, -30], [-46, -24], [-48, -20], [-42, -18],
      [-40, -15], [-35, -10], [-35, -5], [-50, 0], [-52, 4], [-60, 6], [-62, 10], [-68, 12],
      [-72, 11], [-75, 10], [-78, 9], [-80, 9],
    ],
    europe: [
      [-10, 36], [-6, 37], [-5, 36], [0, 38], [3, 43], [7, 44], [9, 41], [13, 45], [14, 42],
      [17, 43], [20, 40], [22, 37], [26, 35], [26, 40], [29, 41], [32, 42], [34, 43], [38, 44],
      [40, 43], [35, 46], [33, 48], [32, 52], [30, 55], [28, 60], [25, 60], [22, 55], [18, 55],
      [14, 54], [12, 55], [8, 54], [5, 52], [4, 53], [7, 58], [10, 58], [12, 57], [11, 60],
      [14, 65], [18, 68], [20, 70], [26, 71], [28, 70], [32, 70], [40, 67], [50, 68], [60, 68],
      [68, 77], [60, 80], [40, 82], [10, 82], [-10, 78], [-22, 72], [-20, 66], [-14, 66],
      [-13, 65], [-24, 64], [-22, 62], [-15, 63], [-14, 58], [-8, 58], [-10, 52], [-5, 50],
      [-6, 54], [-8, 58], [-5, 59], [0, 61], [3, 57], [0, 51], [-5, 50], [-8, 48], [-3, 44],
      [-8, 44], [-10, 40], [-10, 36],
    ],
    africa: [
      [-17, 15], [-16, 13], [-12, 15], [-9, 15], [-5, 14], [0, 15], [3, 13], [10, 13],
      [15, 13], [20, 15], [25, 22], [25, 29], [28, 31], [32, 31], [35, 30], [38, 27], [43, 11],
      [48, 8], [50, 2], [42, -5], [40, -11], [38, -17], [35, -22], [32, -26], [28, -33],
      [22, -35], [18, -34], [15, -30], [12, -25], [12, -18], [14, -12], [12, -6], [10, -4],
      [8, -5], [5, 5], [1, 5], [-3, 5], [-8, 5], [-8, 8], [-15, 11], [-17, 15],
    ],
    asiaMain: [
      [26, 35], [26, 40], [29, 41], [32, 42], [34, 43], [38, 44], [40, 43], [42, 41], [45, 40],
      [50, 37], [52, 36], [55, 37], [58, 38], [60, 36], [62, 35], [67, 37], [70, 38], [72, 35],
      [75, 30], [72, 22], [75, 18], [78, 15], [80, 10], [82, 8], [88, 15], [90, 22], [92, 21],
      [95, 20], [98, 23], [100, 22], [103, 18], [105, 20], [107, 18], [110, 20], [117, 23],
      [120, 22], [122, 25], [125, 30], [128, 33], [130, 35], [132, 35], [135, 35], [140, 40],
      [144, 44], [142, 50], [140, 55], [138, 52], [133, 48], [130, 43], [128, 42], [120, 52],
      [100, 55], [85, 55], [73, 55], [68, 58], [60, 56], [55, 55], [50, 55], [45, 53], [40, 55],
      [33, 48], [32, 52], [30, 55], [28, 60], [25, 60], [22, 55], [18, 55], [14, 54], [12, 55],
      [8, 54], [5, 52], [4, 53], [7, 58], [10, 58], [12, 57], [11, 60], [14, 65], [18, 68],
      [20, 70], [26, 71], [28, 70], [32, 70], [40, 67], [50, 68], [60, 68], [68, 70], [75, 72],
      [90, 72], [100, 75], [110, 78], [130, 72], [145, 60], [155, 62], [165, 66], [180, 65],
      [180, 70], [170, 72], [160, 70], [150, 60], [143, 50], [145, 44], [140, 40], [135, 35],
      [130, 35], [140, 52], [155, 58], [162, 60], [172, 60], [180, 65],
    ],
    russia: [
      [28, 70], [32, 70], [40, 67], [50, 68], [60, 68], [68, 70], [75, 72], [90, 72], [100, 75],
      [110, 78], [130, 72], [145, 60], [155, 62], [165, 66], [180, 65], [180, 72], [170, 75],
      [150, 75], [120, 78], [90, 78], [60, 78], [40, 75], [30, 73], [28, 70],
    ],
    middleEast: [
      [26, 35], [30, 32], [35, 30], [38, 27], [42, 28], [45, 29], [48, 30], [52, 26], [55, 25],
      [55, 22], [52, 20], [50, 18], [48, 15], [44, 13], [43, 11], [48, 8], [50, 2], [55, 0],
      [60, 2], [62, 5], [60, 10], [58, 15], [55, 18], [57, 22], [60, 25], [64, 25], [67, 27],
      [70, 25], [72, 22], [75, 18], [78, 15], [75, 15], [70, 20], [65, 22], [60, 22], [57, 20],
      [55, 18], [52, 20], [52, 25], [48, 30], [45, 32], [42, 35], [38, 37], [35, 35], [30, 35],
      [26, 35],
    ],
    india: [
      [72, 35], [75, 30], [72, 22], [75, 18], [78, 15], [80, 10], [82, 8], [85, 10], [88, 15],
      [90, 22], [92, 21], [88, 24], [88, 27], [85, 28], [80, 30], [78, 32], [75, 33], [72, 35],
    ],
    seAsia: [
      [92, 21], [95, 20], [98, 23], [100, 22], [103, 18], [105, 20], [107, 18], [110, 20],
      [108, 15], [107, 10], [105, 8], [103, 5], [100, 2], [105, 0], [110, -5], [115, -8],
      [120, -8], [127, -8], [130, -3], [135, -5], [140, -6], [142, -10], [145, -15], [148, -20],
      [152, -23], [154, -25], [150, -35], [144, -38], [140, -36], [135, -35], [130, -32],
      [124, -35], [117, -35], [115, -33], [115, -25], [120, -20], [125, -15], [122, -10],
      [118, -8], [115, -5], [112, 0], [108, 2], [105, 5], [103, 2], [100, 5], [98, 7], [100, 12],
      [102, 15], [105, 18], [103, 20], [100, 22], [98, 23], [95, 20], [92, 21],
    ],
    japan: [
      [130, 32], [132, 34], [135, 35], [137, 35], [140, 38], [141, 43], [145, 44], [144, 42],
      [142, 40], [140, 36], [137, 34], [135, 33], [130, 32],
    ],
    australia: [
      [115, -35], [117, -35], [120, -35], [124, -35], [127, -32], [130, -32], [133, -32],
      [136, -35], [140, -36], [145, -38], [150, -37], [153, -28], [150, -23], [148, -20],
      [145, -15], [142, -10], [140, -11], [138, -12], [136, -14], [132, -12], [129, -15],
      [125, -14], [122, -18], [117, -20], [115, -22], [114, -26], [115, -30], [115, -35],
    ],
    newZealand: [
      [172, -34], [175, -37], [178, -38], [177, -42], [174, -42], [168, -45], [167, -46],
      [168, -47], [171, -45], [173, -40], [172, -34],
    ],
    indonesia: [
      [95, 5], [100, 2], [105, 0], [108, -2], [105, -6], [107, -8], [112, -8], [115, -8],
      [120, -8], [125, -8], [130, -5], [135, -3], [140, -3], [141, -5], [140, -8], [135, -8],
      [130, -8], [125, -8], [120, -10], [115, -8], [112, -8], [108, -8], [105, -6], [100, -2],
      [95, 2], [95, 5],
    ],
    greenland: [
      [-45, 60], [-43, 65], [-35, 66], [-25, 70], [-20, 73], [-22, 78], [-30, 80], [-45, 82],
      [-55, 82], [-65, 80], [-70, 78], [-68, 75], [-60, 70], [-50, 65], [-45, 60],
    ],
    uk: [
      [-10, 52], [-5, 50], [-6, 54], [-8, 58], [-5, 59], [0, 61], [2, 58], [0, 51], [-5, 50],
      [-10, 52],
    ],
    madagascar: [
      [44, -12], [48, -13], [50, -18], [50, -24], [47, -25], [44, -24], [43, -18], [44, -12],
    ],
    sriLanka: [
      [80, 10], [82, 8], [82, 6], [80, 6], [80, 10],
    ],
    philippines: [
      [117, 5], [120, 10], [122, 15], [125, 18], [127, 15], [125, 10], [122, 8], [119, 5],
      [117, 5],
    ],
    taiwan: [
      [120, 22], [122, 25], [122, 22], [120, 22],
    ],
    korea: [
      [125, 33], [127, 35], [129, 37], [130, 38], [128, 42], [125, 40], [125, 37], [125, 33],
    ],
    cuba: [
      [-85, 22], [-80, 23], [-75, 20], [-78, 20], [-82, 22], [-85, 22],
    ],
    iceland: [
      [-24, 64], [-22, 66], [-15, 66], [-13, 65], [-15, 63], [-22, 62], [-24, 64],
    ],
    scandinavia: [
      [5, 58], [10, 58], [12, 60], [14, 65], [18, 68], [20, 70], [26, 71], [28, 70], [30, 70],
      [28, 65], [25, 62], [22, 60], [18, 58], [12, 57], [8, 58], [5, 58],
    ],
  };

  const colorPalette = [
    new THREE.Color(0x9b59b6),
    new THREE.Color(0x8e44ad),
    new THREE.Color(0xe91e63),
    new THREE.Color(0xff69b4),
    new THREE.Color(0xda70d6),
    new THREE.Color(0x9400d3),
    new THREE.Color(0xba55d3),
  ];

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 280;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerEl.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create canvas for continent mask
    const mapCanvas = document.createElement("canvas");
    const mapCtx = mapCanvas.getContext("2d");
    if (!mapCtx) return;

    mapCanvas.width = 4096;
    mapCanvas.height = 2048;

    // Fill with black (ocean)
    mapCtx.fillStyle = "#000";
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

    // Draw continents in white
    mapCtx.fillStyle = "#fff";

    const lonLatToCanvas = (lon: number, lat: number) => {
      const x = ((lon + 180) / 360) * mapCanvas.width;
      const y = ((90 - lat) / 180) * mapCanvas.height;
      return [x, y];
    };

    const drawPolygon = (coords: number[][]) => {
      if (coords.length < 3) return;
      mapCtx.beginPath();
      const [startX, startY] = lonLatToCanvas(coords[0][0], coords[0][1]);
      mapCtx.moveTo(startX, startY);
      for (let i = 1; i < coords.length; i++) {
        const [x, y] = lonLatToCanvas(coords[i][0], coords[i][1]);
        mapCtx.lineTo(x, y);
      }
      mapCtx.closePath();
      mapCtx.fill();
    };

    // Draw all continent polygons
    Object.values(continentData).forEach((polygon) => {
      drawPolygon(polygon);
    });

    // Get image data
    const imageData = mapCtx.getImageData(0, 0, mapCanvas.width, mapCanvas.height);
    const data = imageData.data;

    const isLand = (lon: number, lat: number) => {
      const x = Math.floor(((lon + 180) / 360) * mapCanvas.width);
      const y = Math.floor(((90 - lat) / 180) * mapCanvas.height);
      if (x < 0 || x >= mapCanvas.width || y < 0 || y >= mapCanvas.height) return false;
      const index = (y * mapCanvas.width + x) * 4;
      return data[index] > 128;
    };

    // Generate particles
    const positions: number[] = [];
    const originalPositions: Array<{ x: number; y: number; z: number }> = [];
    const particleColors: number[] = [];
    const sizes: number[] = [];
    const velocities: Array<{ x: number; y: number; z: number }> = [];

    let count = 0;
    let attempts = 0;

    while (count < targetParticles && attempts < targetParticles * 40) {
      // Uniform spherical distribution
      const u = Math.random();
      const v = Math.random();
      const lat = (Math.asin(2 * v - 1) * 180) / Math.PI;
      const lon = u * 360 - 180;

      if (isLand(lon, lat)) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = ((lon + 180) * Math.PI) / 180;

        const x = -globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = globeRadius * Math.cos(phi);
        const z = globeRadius * Math.sin(phi) * Math.sin(theta);

        positions.push(x, y, z);
        originalPositions.push({ x, y, z });

        // Random color from palette
        const color = colorPalette[
          Math.floor(Math.random() * colorPalette.length)
        ].clone();
        color.multiplyScalar(0.7 + Math.random() * 0.5);

        particleColors.push(color.r, color.g, color.b);
        sizes.push(Math.random() * 0.9 + 0.5);
        velocities.push({ x: 0, y: 0, z: 0 });

        count++;
      }
      attempts++;
    }

    console.log(`Created ${count} particles`);

    // Store original positions and velocities
    originalPositionsRef.current = originalPositions;
    velocitiesRef.current = velocities;

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(particleColors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    geometryRef.current = geometry;

    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (170.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha = pow(alpha, 1.2) * 0.85;
        
        gl_FragColor = vec4(vColor * 1.15, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const globe = new THREE.Points(geometry, material);
    scene.add(globe);
    globeRef.current = globe;

    // Atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(globeRadius * 1.08, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x9b59b6) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1)), 3.0);
          gl_FragColor = vec4(glowColor, intensity * 0.12);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);
    glowMeshRef.current = glowMesh;

    // Event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDraggingRef.current && globe) {
        globe.rotation.y += (e.clientX - prevMouseRef.current.x) * 0.005;
        globe.rotation.x += (e.clientY - prevMouseRef.current.y) * 0.003;
        globe.rotation.x = Math.max(-1, Math.min(1, globe.rotation.x));
        if (glowMesh) {
          glowMesh.rotation.copy(globe.rotation);
        }
      }
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        autoRotateRef.current = true;
      }, 1500);
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = 9999;
      mouseRef.current.y = 9999;
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      if (!scene || !camera || !renderer || !globe || !glowMesh || !geometry) return;

      animationRef.current = requestAnimationFrame(animate);

      if (autoRotateRef.current) {
        globe.rotation.y += autoRotateSpeed;
        glowMesh.rotation.y = globe.rotation.y;
      }

      const posArray = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < originalPositionsRef.current.length; i++) {
        const i3 = i * 3;
        const orig = originalPositionsRef.current[i];
        const vel = velocitiesRef.current[i];

        // Project particle to screen
        const pos = new THREE.Vector3(posArray[i3], posArray[i3 + 1], posArray[i3 + 2]);
        pos.applyMatrix4(globe.matrixWorld);
        const screenPos = pos.clone().project(camera);

        // Only interact with front-facing particles
        if (screenPos.z < 1) {
          const dx = screenPos.x - mouseRef.current.x;
          const dy = screenPos.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repulsionRadius) {
            const force = Math.pow(1 - dist / repulsionRadius, 2) * repulsionStrength;
            const pushDir = new THREE.Vector3(
              posArray[i3],
              posArray[i3 + 1],
              posArray[i3 + 2]
            ).normalize();

            vel.x += pushDir.x * force * 0.06;
            vel.y += pushDir.y * force * 0.06;
            vel.z += pushDir.z * force * 0.06;
          }
        }

        // Apply velocity and spring back
        posArray[i3] += vel.x;
        posArray[i3 + 1] += vel.y;
        posArray[i3 + 2] += vel.z;

        posArray[i3] += (orig.x - posArray[i3]) * returnSpeed;
        posArray[i3 + 1] += (orig.y - posArray[i3 + 1]) * returnSpeed;
        posArray[i3 + 2] += (orig.z - posArray[i3 + 2]) * returnSpeed;

        vel.x *= 0.93;
        vel.y *= 0.93;
        vel.z *= 0.93;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (renderer && containerEl) {
        try {
          containerEl.removeChild(renderer.domElement);
        } catch (e) {
          // Element may already be removed
        }
        renderer.dispose();
      }

      if (geometry) {
        geometry.dispose();
      }

      if (material) {
        material.dispose();
      }

      if (glowMaterial) {
        glowMaterial.dispose();
      }

      if (glowGeometry) {
        glowGeometry.dispose();
      }
    };
  }, [
    globeRadius,
    targetParticles,
    autoRotateSpeed,
    repulsionStrength,
    repulsionRadius,
    returnSpeed,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden bg-[#0a0a12] ${className}`}
    />
  );
}
