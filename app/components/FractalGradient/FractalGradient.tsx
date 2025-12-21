"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useControls, button } from "leva";

// Safe hydration hook - prevents SSR issues
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Animated gradient (ShaderBackground4) + FractalGlass-style stripe refraction.
const fragmentShader = `
  #define S(a,b,t) smoothstep(a,b,t)
  #define PI 3.14159265359

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  // iq/2014 noise
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1,81.17)), dot(p, vec2(1269.5,283.37)));
    return fract(sin(p) * 43758.5453);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    float n = mix(
      mix(dot(-1.0+2.0*hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
          dot(-1.0+2.0*hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
      mix(dot(-1.0+2.0*hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
          dot(-1.0+2.0*hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x),
      u.y
    );
    return 0.5 + 0.5 * n;
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  // === Base gradient uniforms (from ShaderBackground4) ===
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;

  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeed;
  uniform float uNoiseSpeed;
  uniform float uRotationIntensity;
  uniform float uLayerRotation;
  uniform vec2 uUvOffset;
  uniform float uLayerMixStart;
  uniform float uLayerMixEnd;

  uniform float uMetallic;
  uniform float uSheenIntensity;
  uniform float uSheenSpeed;
  uniform float uSheenScale;
  uniform float uFresnelPower;
  uniform float uFresnelIntensity;
  uniform float uIridescence;
  uniform float uIridescenceSpeed;
  uniform float uContrast;
  uniform float uBrightness;

  uniform float uMagneticStrength;
  uniform float uMagneticRadius;
  uniform float uMagneticSoftness;

  // === Fractal "glass" uniforms (adapted from FractalGlass) ===
  uniform float uGlassStrength;
  uniform float uGlassSmoothness;
  uniform float uStripesFrequency;
  uniform float uEdgePadding;
  uniform float uParallaxStrength;
  uniform float uDistortionMultiplier;

  varying vec2 vUv;

  float displacement(float x, float num_stripes, float strength) {
    float modulus = 1.0 / num_stripes;
    return mod(x, modulus) * strength;
  }

  float fractalGlass(float x) {
    float d = 0.0;
    for (int i = -5; i <= 5; i++) {
      d += displacement(x + float(i) * uGlassSmoothness, uStripesFrequency, uGlassStrength);
    }
    d = d / 11.0;
    return x + d;
  }

  float smoothEdge(float x, float padding) {
    float edge = padding;
    if (x < edge) return smoothstep(0.0, edge, x);
    if (x > 1.0 - edge) return smoothstep(1.0, 1.0 - edge, x);
    return 1.0;
  }

  void main() {
    float ratio = iResolution.x / iResolution.y;
    vec2 uv = vUv;
    vec2 origUv = uv;

    // ==== Glass stripe refraction (applied before gradient is computed) ====
    float originalX = uv.x;
    float edgeFactor = smoothEdge(originalX, uEdgePadding);
    float distortedX = fractalGlass(originalX);
    uv.x = mix(originalX, distortedX, edgeFactor);

    float distortionFactor = uv.x - originalX;

    // Parallax direction based on mouse x (ShaderBackground uses -0.5..0.5)
    float mouseX01 = iMouse.x + 0.5;
    float parallaxDirection = -sign(0.5 - mouseX01);
    vec2 parallaxOffset = vec2(
      parallaxDirection * abs(mouseX01 - 0.5) * uParallaxStrength * (1.0 + abs(distortionFactor) * uDistortionMultiplier),
      0.0
    );
    parallaxOffset *= edgeFactor;
    uv += parallaxOffset;

    // ==== Magnetic warp (from ShaderBackground4) ====
    vec2 tUv = uv;
    if (uMagneticStrength != 0.0) {
      vec2 mouseUv = vec2(iMouse.x + 0.5, 0.5 - iMouse.y);
      vec2 delta = tUv - mouseUv;
      delta.x *= ratio;
      float dist = length(delta);
      float influence = exp(-dist * dist / (uMagneticRadius * uMagneticRadius * 0.5));
      influence = pow(influence, uMagneticSoftness);
      float bulge = influence * uMagneticStrength * 0.15;
      vec2 scaledDelta = delta * (1.0 - bulge);
      scaledDelta.x /= ratio;
      tUv = mouseUv + scaledDelta;
    }

    tUv -= uUvOffset;

    // Rotation with noise
    float degree = noise(vec2(iTime * uNoiseSpeed, tUv.x * tUv.y));
    tUv.y *= 1.0 / ratio;
    tUv *= Rot(radians((degree - 0.5) * uRotationIntensity + 180.0));
    tUv.y *= ratio;

    // Wave warp
    float speed = iTime * uSpeed;
    tUv.x += sin(tUv.y * uFrequency + speed) / uAmplitude;
    tUv.y += sin(tUv.x * uFrequency * 1.5 + speed) / (uAmplitude * 0.5);

    // Gradient layers
    vec3 layer1 = mix(color1, color2, S(-.3, .3, (tUv * Rot(radians(uLayerRotation))).x));
    vec3 layer2 = mix(color3, color4, S(-.3, .3, (tUv * Rot(radians(uLayerRotation))).x));
    vec3 col = mix(layer1, layer2, S(uLayerMixStart, uLayerMixEnd, tUv.y));

    // Metallic effects (from ShaderBackground4)
    if (uMetallic > 0.0) {
      float sheenTime = iTime * uSheenSpeed;
      float sheenNoise = noise(tUv * uSheenScale + sheenTime);
      float sheen = pow(sheenNoise, 3.0) * uSheenIntensity;
      float sheenAngle = sin(tUv.x * 3.0 + tUv.y * 2.0 + sheenTime * 0.5);
      sheen += pow(max(0.0, sheenAngle), 8.0) * uSheenIntensity * 0.5;

      vec2 centeredUv = origUv - 0.5;
      float distFromCenter = length(centeredUv);
      float fresnel = pow(distFromCenter * 2.0, uFresnelPower) * uFresnelIntensity;

      float iridescencePhase = (tUv.x + tUv.y) * 2.0 + iTime * uIridescenceSpeed;
      vec3 iridescenceColor = hsv2rgb(vec3(
        fract(iridescencePhase * 0.1 + noise(tUv * 3.0) * 0.2),
        0.6,
        1.0
      ));

      col += sheen * uMetallic * vec3(1.0);
      col += fresnel * uMetallic * (color1 + vec3(0.2));
      col = mix(col, col * iridescenceColor, uIridescence * uMetallic);

      col = (col - 0.5) * (1.0 + uContrast * uMetallic) + 0.5;
      col += uBrightness * uMetallic;
      float grain = noise(origUv * 500.0 + iTime * 0.1) * 0.03 * uMetallic;
      col += grain;
    }

    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function FractalGradientPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Color presets (mirrors ShaderBackground4)
  const colorPresets = {
    "Ocean (Default)": {
      color1: "#62d8e0",
      color2: "#020328",
      color3: "#0e3e5d",
      color4: "#030329",
    },
    "Orange Dark": {
      color1: "#FF8000",
      color2: "#0A1628",
      color3: "#FF6B35",
      color4: "#050D18",
    },
    "Orange Light": {
      color1: "#FF8000",
      color2: "#E8E8E8",
      color3: "#FFB366",
      color4: "#F5F5F5",
    },
    "Orange Final": {
      color1: "#FF8000",
      color2: "#FF8000",
      color3: "#FFB366",
      color4: "#FFB366",
    },
  };

  // Leva controls
  const [colors, setColors] = useControls("🎨 Colors", () => ({
    color1: { value: "#FF8000", label: "Accent 1" },
    color2: { value: "#FF8000", label: "Dark 1" },
    color3: { value: "#FFB366", label: "Accent 2" },
    color4: { value: "#FFB366", label: "Dark 2" },
    " ": button(() => {}),
    "Orange Final": button(() => {
      setColors(colorPresets["Orange Final"]);
    }),
    "Ocean (Default)": button(() => {
      setColors(colorPresets["Ocean (Default)"]);
    }),
    "Orange Dark": button(() => {
      setColors(colorPresets["Orange Dark"]);
    }),
    "Orange Light": button(() => {
      setColors(colorPresets["Orange Light"]);
    }),
  }));

  const wave = useControls("Wave Effect", {
    frequency: { value: 2.0, min: 0.1, max: 10.0, step: 0.1, label: "Frequency" },
    amplitude: { value: 20.0, min: 1.0, max: 100.0, step: 1.0, label: "Amplitude" },
    speed: { value: 1.25, min: 0.0, max: 5.0, step: 0.05, label: "Speed" },
  });

  const noise = useControls("Noise & Rotation", {
    noiseSpeed: { value: 0.1, min: 0.0, max: 1.0, step: 0.01, label: "Noise Speed" },
    rotationIntensity: {
      value: 720.0,
      min: 0.0,
      max: 1440.0,
      step: 10.0,
      label: "Rotation Intensity",
    },
    layerRotation: { value: -6.0, min: -180.0, max: 180.0, step: 1.0, label: "Layer Rotation" },
  });

  const position = useControls("Position & Mix", {
    uvOffsetX: { value: 0.25, min: -1.0, max: 1.0, step: 0.01, label: "UV Offset X" },
    uvOffsetY: { value: 0.25, min: -1.0, max: 1.0, step: 0.01, label: "UV Offset Y" },
    layerMixStart: { value: 0.5, min: -1.0, max: 2.0, step: 0.01, label: "Layer Mix Start" },
    layerMixEnd: { value: -0.3, min: -1.0, max: 2.0, step: 0.01, label: "Layer Mix End" },
  });

  const magnetic = useControls("🧲 Magnetic Warp", {
    magneticStrength: { value: 0.5, min: -2.0, max: 2.0, step: 0.01, label: "Strength" },
    magneticRadius: { value: 0.4, min: 0.1, max: 1.5, step: 0.01, label: "Radius" },
    magneticSoftness: { value: 2.0, min: 0.5, max: 5.0, step: 0.1, label: "Softness" },
  });

  const metallic = useControls("✨ Metallic Effect", {
    metallic: { value: 0.0, min: 0.0, max: 1.0, step: 0.01, label: "Metallic" },
    sheenIntensity: { value: 0.5, min: 0.0, max: 2.0, step: 0.01, label: "Sheen Intensity" },
    sheenSpeed: { value: 0.5, min: 0.0, max: 3.0, step: 0.1, label: "Sheen Speed" },
    sheenScale: { value: 3.0, min: 0.5, max: 10.0, step: 0.1, label: "Sheen Scale" },
    fresnelPower: { value: 2.0, min: 0.5, max: 5.0, step: 0.1, label: "Fresnel Power" },
    fresnelIntensity: { value: 0.3, min: 0.0, max: 1.0, step: 0.01, label: "Fresnel Intensity" },
    iridescence: { value: 0.2, min: 0.0, max: 1.0, step: 0.01, label: "Iridescence" },
    iridescenceSpeed: { value: 0.3, min: 0.0, max: 2.0, step: 0.1, label: "Iridescence Speed" },
    contrast: { value: 0.3, min: 0.0, max: 1.0, step: 0.01, label: "Contrast Boost" },
    brightness: { value: 0.05, min: -0.2, max: 0.3, step: 0.01, label: "Brightness" },
  });

  const glass = useControls("🪟 Fractal Glass", {
    glassStrength: { value: 2.0, min: 0.0, max: 6.0, step: 0.01, label: "Strength" },
    glassSmoothness: { value: 0.0001, min: 0.00001, max: 0.01, step: 0.00001, label: "Smoothness" },
    stripesFrequency: { value: 35.0, min: 1.0, max: 120.0, step: 1.0, label: "Stripes" },
    edgePadding: { value: 0.1, min: 0.0, max: 0.45, step: 0.01, label: "Edge Padding" },
    parallaxStrength: { value: 0.1, min: 0.0, max: 1.0, step: 0.01, label: "Parallax" },
    distortionMultiplier: { value: 10.0, min: 0.0, max: 50.0, step: 0.1, label: "Parallax Boost" },
  });

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
      iMouse: { value: new THREE.Vector2(0, 0) },

      color1: { value: new THREE.Color(colors.color1) },
      color2: { value: new THREE.Color(colors.color2) },
      color3: { value: new THREE.Color(colors.color3) },
      color4: { value: new THREE.Color(colors.color4) },

      uFrequency: { value: wave.frequency },
      uAmplitude: { value: wave.amplitude },
      uSpeed: { value: wave.speed },
      uNoiseSpeed: { value: noise.noiseSpeed },
      uRotationIntensity: { value: noise.rotationIntensity },
      uLayerRotation: { value: noise.layerRotation },
      uUvOffset: { value: new THREE.Vector2(position.uvOffsetX, position.uvOffsetY) },
      uLayerMixStart: { value: position.layerMixStart },
      uLayerMixEnd: { value: position.layerMixEnd },

      uMagneticStrength: { value: magnetic.magneticStrength },
      uMagneticRadius: { value: magnetic.magneticRadius },
      uMagneticSoftness: { value: magnetic.magneticSoftness },

      uMetallic: { value: metallic.metallic },
      uSheenIntensity: { value: metallic.sheenIntensity },
      uSheenSpeed: { value: metallic.sheenSpeed },
      uSheenScale: { value: metallic.sheenScale },
      uFresnelPower: { value: metallic.fresnelPower },
      uFresnelIntensity: { value: metallic.fresnelIntensity },
      uIridescence: { value: metallic.iridescence },
      uIridescenceSpeed: { value: metallic.iridescenceSpeed },
      uContrast: { value: metallic.contrast },
      uBrightness: { value: metallic.brightness },

      uGlassStrength: { value: glass.glassStrength },
      uGlassSmoothness: { value: glass.glassSmoothness },
      uStripesFrequency: { value: glass.stripesFrequency },
      uEdgePadding: { value: glass.edgePadding },
      uParallaxStrength: { value: glass.parallaxStrength },
      uDistortionMultiplier: { value: glass.distortionMultiplier },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Pointer tracking (desktop only; mobile stays stable)
  useEffect(() => {
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
    if (!canHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
    };
    const handleMouseOut = () => {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.iTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.iResolution.value.set(
      window.innerWidth * state.viewport.dpr,
      window.innerHeight * state.viewport.dpr,
      1,
    );
    materialRef.current.uniforms.iMouse.value.set(mouseRef.current.x, mouseRef.current.y);

    // Colors
    materialRef.current.uniforms.color1.value.set(colors.color1);
    materialRef.current.uniforms.color2.value.set(colors.color2);
    materialRef.current.uniforms.color3.value.set(colors.color3);
    materialRef.current.uniforms.color4.value.set(colors.color4);

    // Gradient params
    materialRef.current.uniforms.uFrequency.value = wave.frequency;
    materialRef.current.uniforms.uAmplitude.value = wave.amplitude;
    materialRef.current.uniforms.uSpeed.value = wave.speed;
    materialRef.current.uniforms.uNoiseSpeed.value = noise.noiseSpeed;
    materialRef.current.uniforms.uRotationIntensity.value = noise.rotationIntensity;
    materialRef.current.uniforms.uLayerRotation.value = noise.layerRotation;
    materialRef.current.uniforms.uUvOffset.value.set(position.uvOffsetX, position.uvOffsetY);
    materialRef.current.uniforms.uLayerMixStart.value = position.layerMixStart;
    materialRef.current.uniforms.uLayerMixEnd.value = position.layerMixEnd;

    // Magnetic
    materialRef.current.uniforms.uMagneticStrength.value = magnetic.magneticStrength;
    materialRef.current.uniforms.uMagneticRadius.value = magnetic.magneticRadius;
    materialRef.current.uniforms.uMagneticSoftness.value = magnetic.magneticSoftness;

    // Metallic
    materialRef.current.uniforms.uMetallic.value = metallic.metallic;
    materialRef.current.uniforms.uSheenIntensity.value = metallic.sheenIntensity;
    materialRef.current.uniforms.uSheenSpeed.value = metallic.sheenSpeed;
    materialRef.current.uniforms.uSheenScale.value = metallic.sheenScale;
    materialRef.current.uniforms.uFresnelPower.value = metallic.fresnelPower;
    materialRef.current.uniforms.uFresnelIntensity.value = metallic.fresnelIntensity;
    materialRef.current.uniforms.uIridescence.value = metallic.iridescence;
    materialRef.current.uniforms.uIridescenceSpeed.value = metallic.iridescenceSpeed;
    materialRef.current.uniforms.uContrast.value = metallic.contrast;
    materialRef.current.uniforms.uBrightness.value = metallic.brightness;

    // Glass
    materialRef.current.uniforms.uGlassStrength.value = glass.glassStrength;
    materialRef.current.uniforms.uGlassSmoothness.value = glass.glassSmoothness;
    materialRef.current.uniforms.uStripesFrequency.value = glass.stripesFrequency;
    materialRef.current.uniforms.uEdgePadding.value = glass.edgePadding;
    materialRef.current.uniforms.uParallaxStrength.value = glass.parallaxStrength;
    materialRef.current.uniforms.uDistortionMultiplier.value = glass.distortionMultiplier;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 40, 40]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function FractalGradient({
  zIndex = -1,
  position = "fixed",
}: {
  zIndex?: number;
  position?: "fixed" | "absolute";
}) {
  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <div
      style={{
        position,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex,
        background: "#000",
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1] }}
      >
        <FractalGradientPlane />
      </Canvas>
    </div>
  );
}


