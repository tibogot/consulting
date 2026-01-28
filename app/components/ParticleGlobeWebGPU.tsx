"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Scene,
  PerspectiveCamera,
  Color,
  Vector2,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  AdditiveBlending,
  MathUtils,
  Raycaster,
  Group,
  Line,
  LineDashedMaterial,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  Clock,
  LinearFilter,
  type Points as ThreePoints,
  type Mesh as ThreeMesh,
} from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Fn,
  uniform,
  attribute,
  vec3,
  vec4,
  float,
  sin,
  mix,
  smoothstep,
  normalize,
  dot,
  fract,
  floor,
  cross,
  pow,
  abs,
  clamp,
  select,
  positionLocal,
  positionView,
  modelWorldMatrix,
  cameraPosition,
  varyingProperty,
} from "three/tsl";

interface ParticleGlobeWebGPUProps {
  className?: string;
  globeRadius?: number;
  targetParticles?: number;
  autoRotateSpeed?: number;
  repulsionStrength?: number;
  repulsionRadius?: number;
  returnSpeed?: number;
}

type GlobeLocation = {
  name: string;
  lon: number;
  lat: number;
  color: number;
  description: string;
};

const LOCATIONS: GlobeLocation[] = [
  { name: "Brussels", lon: 4.3517, lat: 50.8503, color: 0x39ff14, description: "Main hub — project delivery, strategy, and coordination across markets." },
  { name: "London", lon: -0.1276, lat: 51.5074, color: 0x00ffff, description: "Client collaboration and delivery for UK-based programs." },
  { name: "Casablanca", lon: -7.6112, lat: 33.5731, color: 0xffff00, description: "Regional delivery and operational support across North Africa." },
  { name: "Paris", lon: 2.3522, lat: 48.8566, color: 0x39ff14, description: "Consulting delivery for France and cross-border initiatives." },
  { name: "Amsterdam", lon: 4.9041, lat: 52.3676, color: 0x00ffff, description: "Benelux delivery and stakeholder workshops." },
  { name: "Luxembourg", lon: 6.1319, lat: 49.6116, color: 0x39ff14, description: "Financial services delivery and transformation support." },
  { name: "Aberdeen", lon: -2.0943, lat: 57.1497, color: 0x00ffff, description: "Operations and on-site program support." },
  { name: "Lisbon", lon: -9.1393, lat: 38.7223, color: 0x39ff14, description: "Delivery support and execution for Iberia-based projects." },
  { name: "Dubai", lon: 55.2708, lat: 25.2048, color: 0xffff00, description: "Regional partnerships and delivery across the Middle East." },
];

async function loadWebGPURenderer() {
  const mod = await import("three/webgpu");
  return mod.WebGPURenderer;
}

export default function ParticleGlobeWebGPU({
  className = "",
  globeRadius = 100,
  targetParticles = 60000,
  autoRotateSpeed = 0.001,
  repulsionStrength = 3.5,
  repulsionRadius = 0.16,
  returnSpeed = 0.045,
}: ParticleGlobeWebGPUProps) {
  const locations = useMemo(() => LOCATIONS, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<InstanceType<Awaited<ReturnType<typeof loadWebGPURenderer>>> | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const globeRef = useRef<ThreePoints | null>(null);
  const geometryRef = useRef<BufferGeometry | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mouseRef = useRef(new Vector2(9999, 9999));
  const originalPositionsRef = useRef<Array<{ x: number; y: number; z: number }>>([]);
  const velocitiesRef = useRef<Array<{ x: number; y: number; z: number }>>([]);
  const locationMarkersRef = useRef<Group | null>(null);
  const markerDirectionsRef = useRef<Map<string, Vector3>>(new Map());
  const activeLocationNameRef = useRef<string | null>(null);
  const [listHoverLocation, setListHoverLocation] = useState<string | null>(null);
  const [globeHoverLocation, setGlobeHoverLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isLocationsPanelOpen, setIsLocationsPanelOpen] = useState(false);
  const [webGPUNotAvailable, setWebGPUNotAvailable] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const globeHoverLocationRef = useRef<string | null>(null);
  const lastGlobeHoverUpdateRef = useRef<number>(0);
  const routesRef = useRef<
    Array<{
      line: Line;
      material: LineDashedMaterial;
      start: Vector3;
      end: Vector3;
      dot?: Sprite;
      baseLineOpacity: number;
      baseDotOpacity: number;
      locName: string;
    }>
  >([]);

  const colorPalette = useMemo(
    () => [
      new Color(0x9b59b6),
      new Color(0x8e44ad),
      new Color(0xe91e63),
      new Color(0xff69b4),
      new Color(0xda70d6),
      new Color(0x9400d3),
      new Color(0xba55d3),
    ],
    []
  );

  const activeLocationName = selectedLocation ?? listHoverLocation ?? globeHoverLocation;
  const activeLocation = useMemo(
    () => locations.find((l) => l.name === activeLocationName) ?? null,
    [activeLocationName, locations]
  );

  useEffect(() => {
    activeLocationNameRef.current = activeLocationName;
  }, [activeLocationName]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    if (typeof navigator !== "undefined" && !navigator.gpu) {
      setWebGPUNotAvailable(true);
      setIsInitializing(false);
      return;
    }

    const loadWorldMap = (): Promise<ImageData> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const mapCanvas = document.createElement("canvas");
          const mapCtx = mapCanvas.getContext("2d");
          if (!mapCtx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          mapCanvas.width = img.naturalWidth || img.width;
          mapCanvas.height = img.naturalHeight || img.height;
          mapCtx.drawImage(img, 0, 0, mapCanvas.width, mapCanvas.height);
          resolve(mapCtx.getImageData(0, 0, mapCanvas.width, mapCanvas.height));
        };
        img.onerror = () => reject(new Error("Failed to load world map image"));
        img.src = "/Equirectangular_projection_world_map_without_borders.svg.png";
      });
    };

    let dispose: (() => void) | undefined;
    let scene: Scene;
    let camera: PerspectiveCamera;
    let renderer: InstanceType<Awaited<ReturnType<typeof loadWebGPURenderer>>>;
    let globe: ThreePoints;
    let controls: OrbitControls;
    let interactionSphere: ThreeMesh | null = null;
    let interactionSphereGeometry: SphereGeometry | null = null;
    let interactionSphereMaterial: MeshBasicMaterial | null = null;
    const raycaster = new Raycaster();
    const clock = new Clock();
    const _camDir = new Vector3();
    const _tempVec = new Vector3();
    const _hitLocal = new Vector3();
    const _hitWorld = new Vector3();
    let hitStartTime = 0;
    const lastHitPoint = new Vector3();

    (async () => {
      let mapImageData: ImageData;
      let mapWidth: number;
      let mapHeight: number;
      try {
        mapImageData = await loadWorldMap();
        mapWidth = mapImageData.width;
        mapHeight = mapImageData.height;
      } catch (e) {
        console.error("Error loading world map:", e);
        setWebGPUNotAvailable(true);
        setIsInitializing(false);
        return;
      }

      const data = mapImageData.data;
      const isLand = (lon: number, lat: number) => {
        const x = Math.floor(((lon + 180) / 360) * mapWidth);
        const y = Math.floor(((90 - lat) / 180) * mapHeight);
        if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return false;
        return data[(y * mapWidth + x) * 4 + 3] > 10;
      };

      const snapToLand = (lon: number, lat: number, maxRadiusPx = 12) => {
        const lonLatToPixel = (lo: number, la: number) => ({
          x: Math.floor(((lo + 180) / 360) * mapWidth),
          y: Math.floor(((90 - la) / 180) * mapHeight),
        });
        const pixelToLonLat = (x: number, y: number) => ({
          lon: (x / mapWidth) * 360 - 180,
          lat: 90 - (y / mapHeight) * 180,
        });
        const isLandPixel = (x: number, y: number) => {
          if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return false;
          return data[(y * mapWidth + x) * 4 + 3] > 10;
        };
        const { x: x0, y: y0 } = lonLatToPixel(lon, lat);
        if (isLandPixel(x0, y0)) return { lon, lat };
        for (let r = 1; r <= maxRadiusPx; r++) {
          for (let dx = -r; dx <= r; dx++) {
            if (isLandPixel(x0 + dx, y0 - r)) return pixelToLonLat(x0 + dx, y0 - r);
            if (isLandPixel(x0 + dx, y0 + r)) return pixelToLonLat(x0 + dx, y0 + r);
          }
          for (let dy = -r + 1; dy <= r - 1; dy++) {
            if (isLandPixel(x0 - r, y0 + dy)) return pixelToLonLat(x0 - r, y0 + dy);
            if (isLandPixel(x0 + r, y0 + dy)) return pixelToLonLat(x0 + r, y0 + dy);
          }
        }
        return { lon, lat };
      };

      const isNearEdge = (lon: number, lat: number, threshold = 0.5) => {
        if (!isLand(lon, lat)) return false;
        const offsets: [number, number][] = [
          [0, -threshold], [0, threshold], [-threshold, 0], [threshold, 0],
          [-threshold, -threshold], [-threshold, threshold], [threshold, -threshold], [threshold, threshold],
        ];
        for (const [dlon, dlat] of offsets) {
          if (!isLand(lon + dlon, lat + dlat)) return true;
        }
        return false;
      };

      const positions: number[] = [];
      const originalPositions: Array<{ x: number; y: number; z: number }> = [];
      const particleColors: number[] = [];
      const sizes: number[] = [];
      const velocities: Array<{ x: number; y: number; z: number }> = [];
      let count = 0;
      let attempts = 0;

      while (count < targetParticles && attempts < targetParticles * 40) {
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

          const color = colorPalette[Math.floor(Math.random() * colorPalette.length)].clone();
          color.multiplyScalar(0.7 + Math.random() * 0.5);
          particleColors.push(color.r, color.g, color.b);

          const nearEdge = isNearEdge(lon, lat, 0.8);
          const baseSize = nearEdge ? 1.6 : 1.3;
          sizes.push(Math.random() * 1.1 + baseSize);
          velocities.push({ x: 0, y: 0, z: 0 });
          count++;

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
              const colorJ = colorPalette[Math.floor(Math.random() * colorPalette.length)].clone();
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

      originalPositionsRef.current = originalPositions;
      velocitiesRef.current = velocities;

      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
      const originalPositionsArray = new Float32Array(positions.length);
      for (let i = 0; i < originalPositions.length; i++) {
        originalPositionsArray[i * 3] = originalPositions[i].x;
        originalPositionsArray[i * 3 + 1] = originalPositions[i].y;
        originalPositionsArray[i * 3 + 2] = originalPositions[i].z;
      }
      geometry.setAttribute("originalPosition", new Float32BufferAttribute(originalPositionsArray, 3));
      geometry.setAttribute("color", new Float32BufferAttribute(particleColors, 3));
      geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
      geometryRef.current = geometry;

      const WebGPURendererClass = await loadWebGPURenderer();
      const { PointsNodeMaterial } = await import("three/webgpu");

      scene = new Scene();
      scene.background = null;

      camera = new PerspectiveCamera(60, 1, 0.1, 1000);
      const cameraDistance = 250;
      const europeCenterLatRad = MathUtils.degToRad(30);
      camera.position.set(
        0,
        cameraDistance * Math.sin(europeCenterLatRad),
        cameraDistance * Math.cos(europeCenterLatRad)
      );
      camera.lookAt(0, 0, 0);

      renderer = new WebGPURendererClass({ antialias: true, alpha: true });
      const initialRect = containerEl.getBoundingClientRect();
      const initialWidth = Math.max(1, Math.floor(initialRect.width));
      const initialHeight = Math.max(1, Math.floor(initialRect.height));
      renderer.setSize(initialWidth, initialHeight);
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, isMobile ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      containerEl.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      try {
        await renderer.init();
      } catch (e) {
        console.error("WebGPU init failed:", e);
        try {
          containerEl.removeChild(renderer.domElement);
        } catch { /* ignore */ }
        renderer.dispose();
        setWebGPUNotAvailable(true);
        setIsInitializing(false);
        return;
      }

      camera.aspect = initialWidth / initialHeight;
      camera.updateProjectionMatrix();

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = autoRotateSpeed * 600;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minAzimuthAngle = -Infinity;
      controls.maxAzimuthAngle = Infinity;
      const lockedPolar = controls.getPolarAngle();
      controls.minPolarAngle = lockedPolar;
      controls.maxPolarAngle = lockedPolar;

      const handleControlsStart = () => { controls.autoRotate = false; };
      const handleControlsEnd = () => { controls.autoRotate = true; };
      controls.addEventListener("start", handleControlsStart);
      controls.addEventListener("end", handleControlsEnd);
      controlsRef.current = controls;

      const uTime = uniform(0);
      const uWobbleAmp = uniform(globeRadius * 0.0022);
      const uHitPoint = uniform(new Vector3(0, 0, 0));
      const uHitActive = uniform(0);
      const uScale = uniform(240); // matches original gl_PointSize attenuation factor

      const vFadeVar = varyingProperty("float", "vFade");
      const vFacingVar = varyingProperty("float", "vFacing");

      const material = new PointsNodeMaterial({
        transparent: true,
        vertexColors: true,
        blending: AdditiveBlending,
        depthWrite: false,
      });

      material.positionNode = Fn(() => {
        const pos = positionLocal.toVar();
        const nObj = normalize(pos);
        const up = select(
          abs(nObj.y).greaterThan(0.9),
          vec3(1, 0, 0),
          vec3(0, 1, 0)
        );
        const t1 = normalize(cross(up, nObj));
        const t2 = cross(nObj, t1);

        const t = uTime.mul(8);
        const i0 = floor(t);
        const f = fract(t);
        const s = f.mul(f).mul(float(3).sub(f.mul(2)));

        const seed = pos.mul(0.05).add(vec3(i0, i0, i0));
        type TSLNode = ReturnType<typeof vec3>;
        const h = (p: TSLNode) =>
          fract(sin(dot(p, vec3(127.1, 311.7, 74.7))).mul(43758.5453123));
        const j0x = h(seed as unknown as TSLNode);
        const j0y = h(seed.add(vec3(1, 0, 0)) as unknown as TSLNode);
        const j0z = h(seed.add(vec3(0, 1, 0)) as unknown as TSLNode);
        const j0 = vec3(j0x, j0y, j0z).sub(0.5);
        const seed1 = pos.mul(0.05).add(vec3(i0.add(1), i0.add(1), i0.add(1)));
        const j1x = h(seed1 as unknown as TSLNode);
        const j1y = h(seed1.add(vec3(1, 0, 0)) as unknown as TSLNode);
        const j1z = h(seed1.add(vec3(0, 1, 0)) as unknown as TSLNode);
        const j1 = vec3(j1x, j1y, j1z).sub(0.5);
        const j = vec3(mix(j0.x, j1.x, s), mix(j0.y, j1.y, s), mix(j0.z, j1.z, s));
        const jitterVec = t1.mul(j.x).add(t2.mul(j.y)).add(nObj.mul(j.z.mul(0.15)));
        const wobblePos = pos.add(jitterVec.mul(uWobbleAmp));

        const worldPos = modelWorldMatrix.mul(vec4(wobblePos, 1)).xyz;
        const toCamera = normalize(cameraPosition.sub(worldPos));
        const normal = normalize(worldPos);
        const facing = dot(normal, toCamera);
        const fade = smoothstep(float(-0.65), float(0.35), facing);
        vFadeVar.assign(fade);
        vFacingVar.assign(facing);

        return wobblePos;
      })();

      material.sizeNode = Fn(() => {
        const size = attribute("size", "float");
        const fade = vFadeVar;
        const scale = uScale
          .div(positionView.z.negate())
          .mul(mix(float(0.72), float(1), fade));
        return size.mul(scale);
      })();

      material.colorNode = Fn(() => {
        const col = attribute("color", "vec3");
        const fade = vFadeVar;
        const facing = vFacingVar;
        const backDarken = mix(float(0.5), float(1), fade);
        const backAlpha = mix(float(0.22), float(1), fade);
        const rim = float(1).sub(clamp(facing, 0, 1));
        const rimBoost = pow(rim, 2).mul(0.1);
        const color = col.mul(float(1.15).mul(backDarken).add(rimBoost));
        const alpha = float(0.85).mul(backAlpha);
        return vec4(color, alpha);
      })();

      globe = new Points(geometry, material);
      scene.add(globe);
      globeRef.current = globe;

      interactionSphereGeometry = new SphereGeometry(globeRadius * 1.005, 48, 32);
      interactionSphereMaterial = new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      interactionSphere = new Mesh(interactionSphereGeometry, interactionSphereMaterial);
      scene.add(interactionSphere);

      const latLonToPosition = (lon: number, lat: number) => {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = ((lon + 180) * Math.PI) / 180;
        const radius = globeRadius * 1.02;
        return new Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };

      const haloTexture = (() => {
        const size = 64;
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        if (!ctx) return null;
        const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        g.addColorStop(0, "rgba(255,255,255,0.22)");
        g.addColorStop(0.35, "rgba(255,255,255,0.12)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
        const tex = new CanvasTexture(c);
        tex.minFilter = LinearFilter;
        tex.magFilter = LinearFilter;
        tex.generateMipmaps = false;
        return tex;
      })();

      const markersGroup = new Group();
      locationMarkersRef.current = markersGroup;
      const markerPositions = new Map<string, Vector3>();
      markerDirectionsRef.current = new Map();

      for (const location of locations) {
        const snapped = snapToLand(location.lon, location.lat);
        const pos = latLonToPosition(snapped.lon, snapped.lat);
        markerPositions.set(location.name, pos.clone());
        markerDirectionsRef.current.set(location.name, pos.clone().normalize());

        const markerGroup = new Group();
        const dotGeom = new SphereGeometry(0.45, 10, 10);
        const dotMat = new MeshBasicMaterial({
          color: location.color,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
        });
        const dot = new Mesh(dotGeom, dotMat);
        dot.position.copy(pos);
        markerGroup.add(dot);

        const haloMat = new SpriteMaterial({
          map: haloTexture ?? undefined,
          color: location.color,
          transparent: true,
          opacity: 0.16,
          blending: AdditiveBlending,
          depthWrite: false,
        });
        const halo = new Sprite(haloMat);
        halo.position.copy(pos);
        halo.scale.set(6, 6, 1);
        markerGroup.add(halo);

        (markerGroup as Group & { animationData: { dot: Mesh; halo: Sprite; time: number; basePosition: Vector3 } }).animationData = {
          dot,
          halo,
          time: Math.random() * Math.PI * 2,
          basePosition: pos.clone(),
        };
        markerGroup.userData = { ...(markerGroup.userData as object), name: location.name };
        markersGroup.add(markerGroup);
      }

      const routesGroup = new Group();
      routesRef.current = [];
      const brusselsPos = markerPositions.get("Brussels");
      if (brusselsPos) {
        const makeArcPoints = (start: Vector3, end: Vector3, segments = 160) => {
          const v0 = start.clone().normalize();
          const v1 = end.clone().normalize();
          const angle = v0.angleTo(v1);
          const sinAngle = Math.sin(angle) || 1e-6;
          const baseRadius = (start.length() + end.length()) * 0.5;
          const arcHeight = globeRadius * 0.14;
          const pts: Vector3[] = [];
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const a = Math.sin((1 - t) * angle) / sinAngle;
            const b = Math.sin(t * angle) / sinAngle;
            const dir = v0.clone().multiplyScalar(a).add(v1.clone().multiplyScalar(b)).normalize();
            const h = Math.sin(Math.PI * t) * arcHeight;
            pts.push(dir.multiplyScalar(baseRadius + h));
          }
          return pts;
        };

        for (const loc of locations) {
          if (loc.name === "Brussels") continue;
          const endPos = markerPositions.get(loc.name);
          if (!endPos) continue;
          const pts = makeArcPoints(brusselsPos, endPos);
          const lineGeom = new BufferGeometry().setFromPoints(pts);
          const lineMat = new LineDashedMaterial({
            color: loc.color,
            transparent: true,
            opacity: 0.55,
            dashSize: 2.2,
            gapSize: 1.6,
            depthWrite: false,
          });
          (lineMat as LineDashedMaterial & { onBeforeCompile?: (shader: { uniforms: { dashOffset?: { value: number } }; fragmentShader: string }) => void }).onBeforeCompile = (shader) => {
            (shader.uniforms as { dashOffset?: { value: number } }).dashOffset = { value: 0 };
            shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nuniform float dashOffset;");
            shader.fragmentShader = shader.fragmentShader.replace("mod( vLineDistance, totalSize )", "mod( vLineDistance + dashOffset, totalSize )");
            (lineMat as { userData: { shader?: typeof shader } }).userData.shader = shader;
          };
          const line = new Line(lineGeom, lineMat);
          line.computeLineDistances();
          const pulseMat = new SpriteMaterial({
            map: haloTexture ?? undefined,
            color: loc.color,
            transparent: true,
            opacity: 0.35,
            blending: AdditiveBlending,
            depthWrite: false,
          });
          const pulse = new Sprite(pulseMat);
          pulse.scale.set(3.2, 3.2, 1);
          pulse.position.copy(pts[0]);
          routesGroup.add(line);
          routesGroup.add(pulse);
          routesRef.current.push({
            line,
            material: lineMat,
            start: brusselsPos.clone(),
            end: endPos.clone(),
            dot: pulse,
            baseLineOpacity: lineMat.opacity,
            baseDotOpacity: pulseMat.opacity,
            locName: loc.name,
          });
        }
      }
      scene.add(routesGroup);
      scene.add(markersGroup);

      sceneRef.current = scene;
      cameraRef.current = camera;

      const canvas = renderer.domElement;
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      };
      const handleMouseLeave = () => {
        mouseRef.current.x = 9999;
        mouseRef.current.y = 9999;
        if (globeHoverLocationRef.current !== null) {
          globeHoverLocationRef.current = null;
          setGlobeHoverLocation(null);
        }
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
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("resize", handleResize);

      const animate = () => {
        if (!scene || !camera || !renderer || !globe || !geometry || !controls) return;

        uTime.value = performance.now() * 0.001;
        controls.update(clock.getDelta());

        if (locationMarkersRef.current) {
          _camDir.copy(camera.position).normalize();
          const time = Date.now() * 0.001;
          for (const marker of locationMarkersRef.current.children) {
            const animData = (marker as Group & { animationData?: { dot: Mesh; halo: Sprite; time: number; basePosition: Vector3 } }).animationData;
            if (!animData) continue;
            const markerName = (marker.userData as { name?: string })?.name;
            const isActive = !!markerName && activeLocationNameRef.current === markerName;
            _tempVec.copy(animData.basePosition).normalize();
            const facing = _tempVec.dot(_camDir);
            const fade = MathUtils.smoothstep(facing, -0.65, 0.35);
            const fadeAlpha = MathUtils.lerp(0.18, 1, fade);
            const t = time + animData.time;
            const pulse = Math.sin(t * 1.8) * 0.5 + 0.5;
            const haloOpacityBase = 0.14 + pulse * 0.06;
            const haloOpacity = Math.min(0.55, haloOpacityBase * (isActive ? 2.2 : 1));
            if (animData.halo.material instanceof SpriteMaterial) {
              animData.halo.material.opacity = haloOpacity * fadeAlpha;
            }
            if (animData.dot.material instanceof MeshBasicMaterial) {
              animData.dot.material.opacity = Math.min(1, (0.9 + pulse * 0.06) * (isActive ? 1.15 : 1)) * fadeAlpha;
            }
            const dotScale = isActive ? 1.65 : 1;
            animData.dot.scale.setScalar(dotScale);
            const haloScale = isActive ? 1.28 : 1;
            animData.halo.scale.set(6 * haloScale, 6 * haloScale, 1);
          }
        }

        if (routesRef.current.length) {
          _camDir.copy(camera.position).normalize();
          const t = performance.now() * 0.001;
          for (let i = 0; i < routesRef.current.length; i++) {
            const r = routesRef.current[i];
            _tempVec.copy(r.start).normalize();
            const startFacing = _tempVec.dot(_camDir);
            _tempVec.copy(r.end).normalize();
            const endFacing = _tempVec.dot(_camDir);
            const facing = Math.min(startFacing, endFacing);
            const fade = MathUtils.smoothstep(facing, -0.65, 0.35);
            const fadeAlpha = MathUtils.lerp(0.12, 1, fade);
            const isActive = activeLocationNameRef.current !== null && activeLocationNameRef.current === r.locName;
            const boost = isActive ? 1.75 : 1;
            r.material.opacity = Math.min(1, r.baseLineOpacity * fadeAlpha * boost);
            if (r.dot?.material instanceof SpriteMaterial) {
              r.dot.material.opacity = Math.min(1, r.baseDotOpacity * fadeAlpha * boost);
            }
            const shader = (r.material as { userData: { shader?: { uniforms: { dashOffset?: { value: number } } } } }).userData?.shader;
            if (shader?.uniforms?.dashOffset) {
              shader.uniforms.dashOffset.value = -(t * (isActive ? 3.2 : 2));
            }
            if (r.dot) {
              const geom = r.line.geometry as BufferGeometry;
              const posAttr = geom.getAttribute("position");
              const cnt = posAttr.count;
              const u = (t * 0.22 + i * 0.13) % 1;
              const idx = Math.min(cnt - 1, Math.floor(u * cnt));
              r.dot.position.set(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
            }
          }
        }

        let hasHit = false;
        if (interactionSphere && Math.abs(mouseRef.current.x) <= 1 && Math.abs(mouseRef.current.y) <= 1) {
          raycaster.setFromCamera(mouseRef.current, camera);
          const hits = raycaster.intersectObject(interactionSphere, false);
          if (hits.length) {
            _hitWorld.copy(hits[0].point);
            _hitLocal.copy(_hitWorld);
            globe.worldToLocal(_hitLocal);
            hasHit = true;
            const hitMoved = _hitLocal.distanceTo(lastHitPoint) > 1;
            if (hitMoved || hitStartTime === 0) {
              hitStartTime = performance.now();
              lastHitPoint.copy(_hitLocal);
            }
            uHitPoint.value.copy(_hitLocal);
            uHitActive.value = 1;
          } else {
            uHitActive.value = 0;
            hitStartTime = 0;
          }
        } else {
          uHitActive.value = 0;
          hitStartTime = 0;
        }

        const now = performance.now();
        if (now - lastGlobeHoverUpdateRef.current > 100) {
          lastGlobeHoverUpdateRef.current = now;
          let nextHover: string | null = null;
          if (hasHit && markerDirectionsRef.current.size) {
            _tempVec.copy(_hitLocal).normalize();
            let bestName: string | null = null;
            let bestAngle = Infinity;
            for (const [name, dir] of markerDirectionsRef.current) {
              const d = MathUtils.clamp(_tempVec.dot(dir), -1, 1);
              const angle = Math.acos(d);
              if (angle < bestAngle) {
                bestAngle = angle;
                bestName = name;
              }
            }
            const enterAngle = 0.06;
            const exitAngle = 0.085;
            const current = globeHoverLocationRef.current;
            if (current && bestName === current) {
              nextHover = bestAngle < exitAngle ? current : null;
            } else {
              nextHover = bestAngle < enterAngle ? bestName : null;
            }
          }
          if (nextHover !== globeHoverLocationRef.current) {
            globeHoverLocationRef.current = nextHover;
            setGlobeHoverLocation(nextHover);
          }
        }

        const posArray = geometry.attributes.position.array as Float32Array;
        const repulseRadiusWorld = globeRadius * repulsionRadius;
        if (hasHit) {
          const hitX = _hitLocal.x, hitY = _hitLocal.y, hitZ = _hitLocal.z;
          for (let i = 0; i < originalPositionsRef.current.length; i++) {
            const i3 = i * 3;
            const orig = originalPositionsRef.current[i];
            const vel = velocitiesRef.current[i];
            const dx = posArray[i3] - hitX, dy = posArray[i3 + 1] - hitY, dz = posArray[i3 + 2] - hitZ;
            const distSq = dx * dx + dy * dy + dz * dz;
            if (distSq < repulseRadiusWorld * repulseRadiusWorld) {
              const frontDot = posArray[i3] * camera.position.x + posArray[i3 + 1] * camera.position.y + posArray[i3 + 2] * camera.position.z;
              if (frontDot > 0) {
                const dist = Math.sqrt(distSq);
                if (dist < repulseRadiusWorld && dist > 0.001) {
                  const force = Math.pow(1 - dist / repulseRadiusWorld, 2) * repulsionStrength;
                  const inv = 1 / (dist + 1e-6);
                  vel.x += dx * inv * force * 0.06;
                  vel.y += dy * inv * force * 0.06;
                  vel.z += dz * inv * force * 0.06;
                }
              }
            }
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
        } else {
          let needsUpdate = false;
          for (let i = 0; i < originalPositionsRef.current.length; i++) {
            const i3 = i * 3;
            const orig = originalPositionsRef.current[i];
            const vel = velocitiesRef.current[i];
            const velMagSq = vel.x * vel.x + vel.y * vel.y + vel.z * vel.z;
            if (velMagSq < 0.0001) {
              const dx = posArray[i3] - orig.x, dy = posArray[i3 + 1] - orig.y, dz = posArray[i3 + 2] - orig.z;
              const dispSq = dx * dx + dy * dy + dz * dz;
              if (dispSq > 0.0001) {
                posArray[i3] += (orig.x - posArray[i3]) * returnSpeed;
                posArray[i3 + 1] += (orig.y - posArray[i3 + 1]) * returnSpeed;
                posArray[i3 + 2] += (orig.z - posArray[i3 + 2]) * returnSpeed;
                needsUpdate = true;
              }
              continue;
            }
            needsUpdate = true;
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
          if (needsUpdate) geometry.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };

      renderer.setAnimationLoop(animate);
      setIsInitializing(false);

      dispose = () => {
        renderer.setAnimationLoop(null);
        controls.removeEventListener("start", handleControlsStart);
        controls.removeEventListener("end", handleControlsEnd);
        controls.dispose();
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", handleResize);

        if (interactionSphere) scene.remove(interactionSphere);
        interactionSphereGeometry?.dispose();
        try {
          interactionSphereMaterial?.dispose();
        } catch {
          /* WebGPU renderer may have cleared refs */
        }
        for (const r of routesRef.current) {
          r.line.geometry.dispose();
          try {
            r.material.dispose();
          } catch {
            /* ignore */
          }
          if (r.dot?.material instanceof SpriteMaterial) {
            try {
              r.dot.material.dispose();
            } catch {
              /* ignore */
            }
          }
        }
        routesRef.current = [];
        geometry.dispose();

        try {
          containerEl.removeChild(canvas);
        } catch {
          /* ignore */
        }
        renderer.dispose();
      };
    })();

    return () => {
      dispose?.();
    };
  }, [
    globeRadius,
    targetParticles,
    autoRotateSpeed,
    repulsionStrength,
    repulsionRadius,
    returnSpeed,
    colorPalette,
    locations,
  ]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full overflow-hidden bg-transparent ${globeHoverLocation ? "cursor-pointer" : ""}`}
      />

      {webGPUNotAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-center px-4 z-10">
          <div>
            <div className="text-lg font-medium mb-2">WebGPU not available</div>
            <div className="text-sm text-white/70">
              Use Chrome, Edge, Firefox 141+, or Safari 26+ for the WebGPU globe.
            </div>
          </div>
        </div>
      )}

      {isInitializing && !webGPUNotAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white/80 z-10">
          Initializing WebGPU…
        </div>
      )}

      {(() => {
        const LocationsPanelBody = ({ variant }: { variant: "desktop" | "mobile" }) => (
          <>
            <div className="text-xs tracking-[0.18em] uppercase text-white/60">Locations</div>
            <div className="mt-3 flex flex-col gap-1.5">
              {locations.map((loc) => {
                const isActive = activeLocationName === loc.name;
                const isSelected = selectedLocation === loc.name;
                return (
                  <button
                    key={loc.name}
                    type="button"
                    className={[
                      "group flex w-full items-center justify-between text-left cursor-pointer",
                      "text-base md:text-lg leading-tight transition-colors",
                      isActive ? "text-white" : "text-white/60 hover:text-white/90",
                    ].join(" ")}
                    onMouseEnter={variant === "desktop" ? () => setListHoverLocation(loc.name) : undefined}
                    onClick={() => {
                      setSelectedLocation((prev) => (prev === loc.name ? null : loc.name));
                      if (variant === "mobile") setIsLocationsPanelOpen(false);
                    }}
                    aria-pressed={isSelected}
                  >
                    <span>{loc.name}</span>
                    <span
                      className={[
                        "text-[11px] uppercase tracking-[0.16em]",
                        isSelected ? "text-white/70" : "text-white/30 group-hover:text-white/50",
                      ].join(" ")}
                    >
                      {isSelected ? "Pinned" : variant === "mobile" ? "Tap" : "Hover"}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 h-px w-full bg-white/10" />
            <div className="mt-4">
              {activeLocation ? (
                <>
                  <div className="text-sm text-white/90">{activeLocation.name}</div>
                  <div className="mt-1 text-sm leading-relaxed text-white/70">{activeLocation.description}</div>
                  <div className="mt-3 text-[11px] tracking-[0.16em] uppercase text-white/40">
                    {variant === "mobile" ? "Tap to pin" : "Click to pin"}
                  </div>
                </>
              ) : (
                <div className="text-sm leading-relaxed text-white/50">
                  {variant === "mobile"
                    ? "Tap a location (or a marker) to highlight it on the globe."
                    : "Hover a location (or a marker) to highlight it on the globe."}
                </div>
              )}
            </div>
          </>
        );

        return (
          <>
            <div
              className="absolute left-4 top-4 z-10 hidden pointer-events-auto font-pp-neue-montreal text-white md:block md:left-8 md:top-8"
              onMouseLeave={() => setListHoverLocation(null)}
            >
              <div className="w-[min(360px,calc(100vw-2rem))] rounded-[2px] border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                <LocationsPanelBody variant="desktop" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-auto font-pp-neue-montreal text-white md:hidden">
              <div className="rounded-[2px] border border-white/10 bg-black/25 backdrop-blur-sm overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => setIsLocationsPanelOpen((v) => !v)}
                  aria-expanded={isLocationsPanelOpen}
                  aria-controls="mobile-locations-panel-wgpu"
                >
                  <div className="min-w-0">
                    <div className="text-xs tracking-[0.18em] uppercase text-white/60">Locations</div>
                    <div className="mt-1 truncate text-sm text-white/70">
                      {activeLocation ? activeLocation.name : "Tap to explore"}
                    </div>
                  </div>
                  <div className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-white/60">
                    {isLocationsPanelOpen ? "Close" : "Open"}
                  </div>
                </button>
                <div
                  id="mobile-locations-panel-wgpu"
                  className={[
                    "transition-[max-height,opacity] duration-300 ease-out",
                    isLocationsPanelOpen ? "max-h-[55vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
                  ].join(" ")}
                  aria-hidden={!isLocationsPanelOpen}
                >
                  <div className="px-4 pb-4 max-h-[55vh] overflow-auto">
                    <LocationsPanelBody variant="mobile" />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
