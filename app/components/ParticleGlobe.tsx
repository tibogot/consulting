"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
  targetParticles = 110000,
  autoRotateSpeed = 0.001,
  repulsionStrength = 3.5,
  repulsionRadius = 0.16,
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
  const controlsRef = useRef<OrbitControls | null>(null);

  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(9999, 9999));
  const autoRotateRef = useRef<boolean>(true);

  const originalPositionsRef = useRef<Array<{ x: number; y: number; z: number }>>([]);
  const velocitiesRef = useRef<Array<{ x: number; y: number; z: number }>>([]);
  const locationMarkersRef = useRef<THREE.Group | null>(null);
  const routesRef = useRef<
    Array<{
      line: THREE.Line;
      material: THREE.LineDashedMaterial;
      start: THREE.Vector3;
      end: THREE.Vector3;
      dot?: THREE.Sprite;
    }>
  >([]);

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
      1,
      0.1,
      1000
    );
    // Tilt the default view toward Europe (so it sits nearer the center vertically)
    const cameraDistance = 200;
    const europeCenterLatDeg = 30;
    const europeCenterLatRad = THREE.MathUtils.degToRad(europeCenterLatDeg);
    camera.position.set(
      0,
      cameraDistance * Math.sin(europeCenterLatRad),
      cameraDistance * Math.cos(europeCenterLatRad)
    );
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const initialRect = containerEl.getBoundingClientRect();
    const initialWidth = Math.max(1, Math.floor(initialRect.width));
    const initialHeight = Math.max(1, Math.floor(initialRect.height));
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerEl.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    camera.aspect = initialWidth / initialHeight;
    camera.updateProjectionMatrix();

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enablePan = false; // Disable panning (only rotate)
    controls.minDistance = 50; // Allow closer zoom to see locations better
    controls.maxDistance = 400;

    // Constrain mouse rotation to a "globe spin":
    // - allow infinite left/right spin (azimuth / world Y)
    // - prevent up/down tilt (polar) by locking it to the current angle
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    const lockedPolar = controls.getPolarAngle();
    controls.minPolarAngle = lockedPolar;
    controls.maxPolarAngle = lockedPolar;
    controlsRef.current = controls;

    // Raycast helpers (initialized after globe is created)
    let interactionSphereGeometry: THREE.SphereGeometry | null = null;
    let interactionSphereMaterial: THREE.MeshBasicMaterial | null = null;
    let interactionSphere: THREE.Mesh | null = null;
    const raycaster = new THREE.Raycaster();
    const hitWorld = new THREE.Vector3();
    const hitLocal = new THREE.Vector3();

    // Load world map image for accurate continent shapes
    const loadWorldMap = async (): Promise<ImageData> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Create canvas and draw the image
          const mapCanvas = document.createElement("canvas");
          const mapCtx = mapCanvas.getContext("2d");
          if (!mapCtx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Use the image's natural dimensions
          mapCanvas.width = img.naturalWidth || img.width;
          mapCanvas.height = img.naturalHeight || img.height;

          // Draw the image to canvas
          mapCtx.drawImage(img, 0, 0, mapCanvas.width, mapCanvas.height);

          // Get image data for pixel sampling
          const imageData = mapCtx.getImageData(0, 0, mapCanvas.width, mapCanvas.height);
          resolve(imageData);
        };
        img.onerror = () => {
          reject(new Error("Failed to load world map image"));
        };
        // Load image from public folder
        // This mask uses transparent ocean + opaque land (black)
        img.src = "/Equirectangular_projection_world_map_without_borders.svg.png";
      });
    };

    // Load the map and process particles (using IIFE for async)
    (async () => {
      let mapImageData: ImageData | null = null;
      let mapWidth = 4096;
      let mapHeight = 2048;

      try {
        mapImageData = await loadWorldMap();
        mapWidth = mapImageData.width;
        mapHeight = mapImageData.height;
      } catch (error) {
        console.error("Error loading world map:", error);
        return; // Exit if we can't load the map
      }

      const data = mapImageData.data;

      const isLand = (lon: number, lat: number) => {
      const x = Math.floor(((lon + 180) / 360) * mapWidth);
      const y = Math.floor(((90 - lat) / 180) * mapHeight);
      if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return false;
      const index = (y * mapWidth + x) * 4;
      // Mask uses transparent ocean + opaque land (black)
      const a = data[index + 3];
      return a > 10;
    };

      // If a location falls on a border/anti-aliased pixel, snap it to the nearest land pixel
      // so markers sit on top of the particle continents.
      const snapToLand = (lon: number, lat: number, maxRadiusPx: number = 12) => {
        const lonLatToPixel = (lo: number, la: number) => {
          const x = Math.floor(((lo + 180) / 360) * mapWidth);
          const y = Math.floor(((90 - la) / 180) * mapHeight);
          return { x, y };
        };

        const pixelToLonLat = (x: number, y: number) => {
          const lo = (x / mapWidth) * 360 - 180;
          const la = 90 - (y / mapHeight) * 180;
          return { lon: lo, lat: la };
        };

        const isLandPixel = (x: number, y: number) => {
          if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return false;
          const index = (y * mapWidth + x) * 4;
          const a = data[index + 3];
          return a > 10;
        };

        const { x: x0, y: y0 } = lonLatToPixel(lon, lat);
        if (isLandPixel(x0, y0)) return { lon, lat };

        for (let r = 1; r <= maxRadiusPx; r++) {
          // Scan the perimeter of a square ring (cheap + good enough at this scale)
          for (let dx = -r; dx <= r; dx++) {
            const xTop = x0 + dx;
            const yTop = y0 - r;
            if (isLandPixel(xTop, yTop)) return pixelToLonLat(xTop, yTop);

            const xBottom = x0 + dx;
            const yBottom = y0 + r;
            if (isLandPixel(xBottom, yBottom)) return pixelToLonLat(xBottom, yBottom);
          }
          for (let dy = -r + 1; dy <= r - 1; dy++) {
            const xLeft = x0 - r;
            const yLeft = y0 + dy;
            if (isLandPixel(xLeft, yLeft)) return pixelToLonLat(xLeft, yLeft);

            const xRight = x0 + r;
            const yRight = y0 + dy;
            if (isLandPixel(xRight, yRight)) return pixelToLonLat(xRight, yRight);
          }
        }

        // Fallback: leave it unchanged if no land found nearby
        return { lon, lat };
      };

      // Check if a point is near a continent edge (improves visibility)
      const isNearEdge = (lon: number, lat: number, threshold: number = 0.5) => {
      const offsets = [
        [0, -threshold], [0, threshold], [-threshold, 0], [threshold, 0],
        [-threshold, -threshold], [-threshold, threshold],
        [threshold, -threshold], [threshold, threshold],
      ];
      
      const isLandHere = isLand(lon, lat);
      if (!isLandHere) return false;
      
      // Check if any neighbor is ocean (indicating edge)
      for (const [dlon, dlat] of offsets) {
        if (!isLand(lon + dlon, lat + dlat)) {
          return true; // Found ocean neighbor, so we're near an edge
        }
      }
      return false;
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
        
        // Smaller particles; keep edge particles slightly larger for definition
        const nearEdge = isNearEdge(lon, lat, 0.8);
        const baseSize = nearEdge ? 1.6 : 1.3;
        sizes.push(Math.random() * 1.1 + baseSize);
        velocities.push({ x: 0, y: 0, z: 0 });

        count++;

        // Add extra particle near edges for better definition (increases density)
        if (nearEdge && Math.random() < 0.3) {
          const jitter = 0.3;
          const latJitter = lat + (Math.random() - 0.5) * jitter;
          const lonJitter = lon + (Math.random() - 0.5) * jitter;
          
          if (isLand(lonJitter, latJitter)) {
            const phiJ = ((90 - latJitter) * Math.PI) / 180;
            const thetaJ = ((lonJitter + 180) * Math.PI) / 180;
            
            const xJ = -globeRadius * Math.sin(phiJ) * Math.cos(thetaJ);
            const yJ = globeRadius * Math.cos(phiJ);
            const zJ = globeRadius * Math.sin(phiJ) * Math.sin(thetaJ);
            
            positions.push(xJ, yJ, zJ);
            originalPositions.push({ x: xJ, y: yJ, z: zJ });
            
            const colorJ = colorPalette[
              Math.floor(Math.random() * colorPalette.length)
            ].clone();
            colorJ.multiplyScalar(0.7 + Math.random() * 0.5);
            
            particleColors.push(colorJ.r, colorJ.g, colorJ.b);
            sizes.push(Math.random() * 1.1 + 1.6);
            velocities.push({ x: 0, y: 0, z: 0 });
            
            count++;
          }
        }
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
      uniform float uTime;
      uniform float uWobbleAmp;
      varying vec3 vColor;
      varying float vFacing;
      varying float vFade;

      // Small, fast per-particle jitter (GPU-side) to avoid a static look
      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
      }
      vec3 hash3(vec3 p) {
        return vec3(
          hash(p),
          hash(p + vec3(1.0, 0.0, 0.0)),
          hash(p + vec3(0.0, 1.0, 0.0))
        );
      }
      
      void main() {
        vColor = color;

        // Fast micro-jitter ("insect-like" motion) that stays on/near the surface.
        // Mostly tangential to preserve the landmass silhouette.
        vec3 nObj = normalize(position);
        vec3 up = (abs(nObj.y) > 0.9) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
        vec3 t1 = normalize(cross(up, nObj));
        vec3 t2 = cross(nObj, t1);

        float t = uTime * 8.0; // jitter frequency
        float i0 = floor(t);
        float f = fract(t);
        float s = f * f * (3.0 - 2.0 * f); // smoothstep

        // Per-particle seed based on position; interpolate between two random offsets
        vec3 j0 = hash3(position * 0.05 + i0) - 0.5;
        vec3 j1 = hash3(position * 0.05 + i0 + 1.0) - 0.5;
        vec3 j = mix(j0, j1, s);

        vec3 jitterVec = (t1 * j.x + t2 * j.y + nObj * (j.z * 0.15));
        vec3 wobblePos = position + jitterVec * uWobbleAmp;

        vec4 mvPosition = modelViewMatrix * vec4(wobblePos, 1.0);
        
        // Front/back discrimination (planet-like shading)
        // vFacing: +1 = facing camera, -1 = facing away (back side)
        vec3 viewDir = normalize(-mvPosition.xyz);
        vec3 n = normalize(normalMatrix * wobblePos);
        vFacing = dot(n, viewDir);
        // Smooth fade for the back hemisphere (keeps volume without "disappearing" backface)
        vFade = smoothstep(-0.65, 0.35, vFacing);

        // Point sprite size (smaller overall, still readable)
        gl_PointSize = size * (240.0 / -mvPosition.z) * mix(0.80, 1.0, vFade);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vFacing;
      varying float vFade;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha = pow(alpha, 1.2) * 0.85;

        // Darken + de-emphasize the back hemisphere (keep it clearly visible)
        float backDarken = mix(0.65, 1.0, vFade);
        float backAlpha = mix(0.40, 1.0, vFade);

        // Subtle "terminator" band around the limb for depth
        float rim = 1.0 - clamp(vFacing, 0.0, 1.0);
        float rimBoost = pow(rim, 2.0) * 0.10;

        vec3 color = vColor * (1.15 * backDarken + rimBoost);
        gl_FragColor = vec4(color, alpha * backAlpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // Scale wobble with globe radius (keeps it subtle if you change radius)
        uWobbleAmp: { value: globeRadius * 0.0022 },
      },
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

    // Raycast target for precise repulsion (cheap: one sphere intersection)
    interactionSphereGeometry = new THREE.SphereGeometry(globeRadius * 1.005, 48, 32);
    interactionSphereMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    interactionSphere = new THREE.Mesh(interactionSphereGeometry, interactionSphereMaterial);
    scene.add(interactionSphere);

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

    // Location markers - office locations (verified coordinates)
    const locations = [
      { name: "Brussels", lon: 4.3517, lat: 50.8503, color: 0x39ff14 }, // Belgium (neon green for contrast)
      { name: "London", lon: -0.1276, lat: 51.5074, color: 0x00ffff }, // UK
      { name: "Casablanca", lon: -7.6112, lat: 33.5731, color: 0xffff00 }, // Morocco
      { name: "Paris", lon: 2.3522, lat: 48.8566, color: 0x39ff14 }, // France
      { name: "Amsterdam", lon: 4.9041, lat: 52.3676, color: 0x00ffff }, // Netherlands
      { name: "Luxembourg", lon: 6.1319, lat: 49.6116, color: 0x39ff14 }, // Luxembourg
      { name: "Aberdeen", lon: -2.0943, lat: 57.1497, color: 0x00ffff }, // UK Scotland
      { name: "Lisbon", lon: -9.1393, lat: 38.7223, color: 0x39ff14 }, // Portugal
      { name: "Dubai", lon: 55.2708, lat: 25.2048, color: 0xffff00 }, // UAE
    ];

    // Convert lat/lon to 3D position on sphere (using same formula as particles for alignment)
    const latLonToPosition = (lon: number, lat: number) => {
      // Use EXACT same conversion as particles to ensure markers align with continent shapes
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lon + 180) * Math.PI) / 180;
      const radius = globeRadius * 1.02; // Slightly above surface
      
      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      return new THREE.Vector3(x, y, z);
    };

    // Create markers group
    const markersGroup = new THREE.Group();
    locationMarkersRef.current = markersGroup;

    // Minimal "beacon" marker: tiny dot + subtle soft halo (shared texture)
    const haloTexture = (() => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      g.addColorStop(0.0, "rgba(255,255,255,0.22)");
      g.addColorStop(0.35, "rgba(255,255,255,0.12)");
      g.addColorStop(1.0, "rgba(255,255,255,0.0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    })();

    const markerPositions = new Map<string, THREE.Vector3>();

    locations.forEach((location) => {
      const snapped = snapToLand(location.lon, location.lat);
      const pos = latLonToPosition(snapped.lon, snapped.lat);
      markerPositions.set(location.name, pos.clone());

      // Minimal "beacon": small dot + subtle halo (no ripples)
      const markerGroup = new THREE.Group();

      // Tiny solid dot (3D so it reads from any angle)
      const dotGeometry = new THREE.SphereGeometry(0.45, 10, 10);
      const dotMaterial = new THREE.MeshBasicMaterial({
        color: location.color,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.copy(pos);
      markerGroup.add(dot);

      // Soft halo (sprite that always faces camera)
      const haloMaterial = new THREE.SpriteMaterial({
        map: haloTexture ?? undefined,
        color: location.color,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Sprite(haloMaterial);
      halo.position.copy(pos);
      halo.scale.set(6, 6, 1);
      markerGroup.add(halo);

      // Store animation data
      interface MarkerAnimationData {
        dot: THREE.Mesh;
        halo: THREE.Sprite;
        time: number;
        basePosition: THREE.Vector3;
      }
      (markerGroup as THREE.Group & { animationData: MarkerAnimationData }).animationData = {
        dot,
        halo,
        time: Math.random() * Math.PI * 2, // Random phase offset
        basePosition: pos.clone(),
      };

      markersGroup.add(markerGroup);
    });

    // Curved arcs from each location to Brussels (moving dashed line + small traveling pulse)
    const routesGroup = new THREE.Group();
    routesRef.current = [];

    const brusselsPos = markerPositions.get("Brussels");
    if (brusselsPos) {
      const makeArcPoints = (start: THREE.Vector3, end: THREE.Vector3, segments = 160) => {
        const v0 = start.clone().normalize();
        const v1 = end.clone().normalize();
        const angle = v0.angleTo(v1);
        const sinAngle = Math.sin(angle) || 1e-6;
        const baseRadius = (start.length() + end.length()) * 0.5;
        const arcHeight = globeRadius * 0.14;

        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          // Great-circle interpolation (slerp) between directions
          const a = Math.sin((1 - t) * angle) / sinAngle;
          const b = Math.sin(t * angle) / sinAngle;
          const dir = v0
            .clone()
            .multiplyScalar(a)
            .add(v1.clone().multiplyScalar(b))
            .normalize();

          // Lift the middle of the arc away from the surface
          const h = Math.sin(Math.PI * t) * arcHeight;
          pts.push(dir.multiplyScalar(baseRadius + h));
        }
        return pts;
      };

      locations.forEach((loc) => {
        if (loc.name === "Brussels") return;
        const endPos = markerPositions.get(loc.name);
        if (!endPos) return;

        const points = makeArcPoints(brusselsPos, endPos);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineDashedMaterial({
          color: loc.color,
          transparent: true,
          opacity: 0.55,
          dashSize: 2.2,
          gapSize: 1.6,
          depthWrite: false,
        });

        // Animate dashed pattern (three@0.182 doesn't expose `dashOffset`)
        material.onBeforeCompile = (shader) => {
          shader.uniforms.dashOffset = { value: 0 };
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <common>",
            "#include <common>\nuniform float dashOffset;"
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            "mod( vLineDistance, totalSize )",
            "mod( vLineDistance + dashOffset, totalSize )"
          );
          material.userData.shader = shader;
        };

        const line = new THREE.Line(geometry, material);
        line.computeLineDistances();

        // Small pulse traveling along the arc
        const pulseMat = new THREE.SpriteMaterial({
          map: haloTexture ?? undefined,
          color: loc.color,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const pulse = new THREE.Sprite(pulseMat);
        pulse.scale.set(3.2, 3.2, 1);
        pulse.position.copy(points[0]);

        routesGroup.add(line);
        routesGroup.add(pulse);
        routesRef.current.push({
          line,
          material,
          start: brusselsPos.clone(),
          end: endPos.clone(),
          dot: pulse,
        });
      });
    }

    scene.add(routesGroup);
    scene.add(markersGroup);

    // Mouse tracking for particle repulsion (keep this for mouse interaction with particles)
    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse coordinates to NDC relative to the actual canvas rect
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current.x = x * 2 - 1;
      mouseRef.current.y = -(y * 2 - 1);
      
      // Update auto-rotate state based on controls
      if (controls) {
        autoRotateRef.current = controls.autoRotate;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = 9999;
      mouseRef.current.y = 9999;
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      const rect = containerEl.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    // Attach mouse tracking for particle repulsion
    const canvas = renderer.domElement;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      if (!scene || !camera || !renderer || !globe || !glowMesh || !geometry || !controls) return;

      animationRef.current = requestAnimationFrame(animate);

      // Drive subtle idle wobble in the particle shader
      material.uniforms.uTime.value = performance.now() * 0.001;

      // Update OrbitControls (required for damping)
      controls.update();

      // Animate location markers (pulsing/ripple effect)
      if (locationMarkersRef.current) {
        const camPos = camera.position;
        const time = Date.now() * 0.001; // Current time in seconds
        locationMarkersRef.current.children.forEach((marker) => {
          interface MarkerWithData extends THREE.Group {
            animationData?: {
              dot: THREE.Mesh;
              halo: THREE.Sprite;
              time: number;
              basePosition: THREE.Vector3;
            };
          }
          const animData = (marker as MarkerWithData).animationData;
          if (animData) {
            // Hide markers on the back hemisphere (otherwise they show "through" the globe and feel off)
            const isFront = animData.basePosition.dot(camPos) > 0;
            marker.visible = isFront;
            if (!isFront) return;

            const t = time + animData.time;
            const pulse = Math.sin(t * 1.8) * 0.5 + 0.5; // 0..1

            // Minimal breathing: tiny change in halo opacity (and very slight dot opacity)
            const haloOpacity = 0.14 + pulse * 0.06; // 0.14..0.20
            if (animData.halo.material instanceof THREE.SpriteMaterial) {
              animData.halo.material.opacity = haloOpacity;
            }
            if (animData.dot.material instanceof THREE.MeshBasicMaterial) {
              animData.dot.material.opacity = 0.90 + pulse * 0.06; // 0.90..0.96
            }
          }
        });
      }

      // Animate route arcs (moving dashes + traveling pulse), and hide when endpoints are on the back
      if (routesRef.current.length) {
        const camPos = camera.position;
        const t = performance.now() * 0.001;
        for (let i = 0; i < routesRef.current.length; i++) {
          const r = routesRef.current[i];
          const startFront = r.start.dot(camPos) > 0;
          const endFront = r.end.dot(camPos) > 0;
          const visible = startFront && endFront;
          r.line.visible = visible;
          if (r.dot) r.dot.visible = visible;
          if (!visible) continue;

          // Move the dashed pattern (via onBeforeCompile uniform)
          const shader = r.material.userData.shader as
            | { uniforms?: { dashOffset?: { value: number } } }
            | undefined;
          if (shader?.uniforms?.dashOffset) {
            shader.uniforms.dashOffset.value = -(t * 2.0);
          }

          // Move pulse along the line based on time
          if (r.dot) {
            const geom = r.line.geometry as THREE.BufferGeometry;
            const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
            const count = posAttr.count;
            const u = (t * 0.22 + i * 0.13) % 1; // per-route phase
            const idx = Math.min(count - 1, Math.floor(u * count));
            r.dot.position.set(
              posAttr.getX(idx),
              posAttr.getY(idx),
              posAttr.getZ(idx)
            );
          }
        }
      }

      const posArray = geometry.attributes.position.array as Float32Array;

      // Compute the surface point under the cursor (front-most intersection)
      let hasHit = false;
      if (
        interactionSphere &&
        Math.abs(mouseRef.current.x) <= 1 &&
        Math.abs(mouseRef.current.y) <= 1
      ) {
        raycaster.setFromCamera(mouseRef.current, camera);
        const hits = raycaster.intersectObject(interactionSphere, false);
        if (hits.length) {
          hitWorld.copy(hits[0].point);
          hitLocal.copy(hitWorld);
          globe.worldToLocal(hitLocal);
          hasHit = true;
        }
      }

      // Repulsion radius in world units (scaled to globe size)
      const repulseRadiusWorld = globeRadius * repulsionRadius;

      for (let i = 0; i < originalPositionsRef.current.length; i++) {
        const i3 = i * 3;
        const orig = originalPositionsRef.current[i];
        const vel = velocitiesRef.current[i];

        // Repulse only near the hit point on the globe surface (prevents far-side repulsion)
        if (hasHit) {
          // Extra guard: only affect the camera-facing hemisphere (prevents "second" repulse patch near the limb)
          const frontDot =
            posArray[i3] * camera.position.x +
            posArray[i3 + 1] * camera.position.y +
            posArray[i3 + 2] * camera.position.z;
          if (frontDot > 0) {
          const dx = posArray[i3] - hitLocal.x;
          const dy = posArray[i3 + 1] - hitLocal.y;
          const dz = posArray[i3 + 2] - hitLocal.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < repulseRadiusWorld) {
            const force =
              Math.pow(1 - dist / repulseRadiusWorld, 2) * repulsionStrength;
            const inv = 1 / (dist + 1e-6);
            // Push away from the cursor-hit point (more intuitive than pure radial push)
            vel.x += dx * inv * force * 0.06;
            vel.y += dy * inv * force * 0.06;
            vel.z += dz * inv * force * 0.06;
          }
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
    })(); // End async IIFE

    // Cleanup
    return () => {
      const renderer = rendererRef.current;
      const controls = controlsRef.current;
      
      // Event listeners will be cleaned up automatically when DOM element is removed
      // No need to manually remove them as the canvas will be destroyed
      
      if (controls) {
        controls.dispose();
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (renderer && containerEl) {
        try {
          containerEl.removeChild(renderer.domElement);
        } catch {
          // Element may already be removed
        }
        renderer.dispose();
      }

      if (geometryRef.current) {
        geometryRef.current.dispose();
      }

      if (interactionSphere) {
        scene.remove(interactionSphere);
      }
      interactionSphereGeometry?.dispose();
      interactionSphereMaterial?.dispose();

      // Dispose route geometries/materials
      if (routesRef.current.length) {
        routesRef.current.forEach((r) => {
          r.line.geometry.dispose();
          r.material.dispose();
          if (r.dot && r.dot.material instanceof THREE.SpriteMaterial) {
            r.dot.material.dispose();
          }
        });
        routesRef.current = [];
      }

      // Note: material and glow materials are disposed automatically when geometry is disposed
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globeRadius,
    targetParticles,
    autoRotateSpeed,
    repulsionStrength,
    repulsionRadius,
    returnSpeed,
    // colorPalette is a constant, no need to include in deps
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden bg-[#000000] ${className}`}
    />
  );
}
