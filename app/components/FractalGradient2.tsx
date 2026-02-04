"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

// Safe hydration hook - prevents SSR issues
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
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

// Hardcoded values (matching ShaderBackground5 for colors and shared params)
const COLORS = {
  color1: "#9333EA",
  color2: "#1E1B4B",
  color3: "#b539ed",
  color4: "#0F172A",
};

const WAVE = {
  frequency: 2.0,
  amplitude: 20.0,
  speed: 0.2,
};

const NOISE = {
  noiseSpeed: 0.1,
  rotationIntensity: 720.0,
  layerRotation: -6.0,
};

const POSITION = {
  uvOffsetX: -0.55,
  uvOffsetY: 0.25,
  layerMixStart: 0.5,
  layerMixEnd: -0.3,
};

const MAGNETIC = {
  magneticStrength: 0.5,
  magneticRadius: 0.3,
  magneticSoftness: 2.0,
};

const METALLIC = {
  metallic: 0.8,
  sheenIntensity: 0.5,
  sheenSpeed: 0.5,
  sheenScale: 3.0,
  fresnelPower: 2.0,
  fresnelIntensity: 0.3,
  iridescence: 0.2,
  iridescenceSpeed: 0.3,
  contrast: 0.3,
  brightness: 0.05,
};

const GLASS = {
  glassStrength: 2.0,
  glassSmoothness: 0.0001,
  stripesFrequency: 35.0,
  edgePadding: 0.1,
  parallaxStrength: 0.1,
  distortionMultiplier: 10.0,
};

function FractalGradientPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
      },
      iMouse: { value: new THREE.Vector2(0, 0) },

      color1: { value: new THREE.Color(COLORS.color1) },
      color2: { value: new THREE.Color(COLORS.color2) },
      color3: { value: new THREE.Color(COLORS.color3) },
      color4: { value: new THREE.Color(COLORS.color4) },

      uFrequency: { value: WAVE.frequency },
      uAmplitude: { value: WAVE.amplitude },
      uSpeed: { value: WAVE.speed },
      uNoiseSpeed: { value: NOISE.noiseSpeed },
      uRotationIntensity: { value: NOISE.rotationIntensity },
      uLayerRotation: { value: NOISE.layerRotation },
      uUvOffset: {
        value: new THREE.Vector2(POSITION.uvOffsetX, POSITION.uvOffsetY),
      },
      uLayerMixStart: { value: POSITION.layerMixStart },
      uLayerMixEnd: { value: POSITION.layerMixEnd },

      uMagneticStrength: { value: MAGNETIC.magneticStrength },
      uMagneticRadius: { value: MAGNETIC.magneticRadius },
      uMagneticSoftness: { value: MAGNETIC.magneticSoftness },

      uMetallic: { value: METALLIC.metallic },
      uSheenIntensity: { value: METALLIC.sheenIntensity },
      uSheenSpeed: { value: METALLIC.sheenSpeed },
      uSheenScale: { value: METALLIC.sheenScale },
      uFresnelPower: { value: METALLIC.fresnelPower },
      uFresnelIntensity: { value: METALLIC.fresnelIntensity },
      uIridescence: { value: METALLIC.iridescence },
      uIridescenceSpeed: { value: METALLIC.iridescenceSpeed },
      uContrast: { value: METALLIC.contrast },
      uBrightness: { value: METALLIC.brightness },

      uGlassStrength: { value: GLASS.glassStrength },
      uGlassSmoothness: { value: GLASS.glassSmoothness },
      uStripesFrequency: { value: GLASS.stripesFrequency },
      uEdgePadding: { value: GLASS.edgePadding },
      uParallaxStrength: { value: GLASS.parallaxStrength },
      uDistortionMultiplier: { value: GLASS.distortionMultiplier },
    }),
    []
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
      1
    );
    materialRef.current.uniforms.iMouse.value.set(
      mouseRef.current.x,
      mouseRef.current.y
    );

    // Colors
    materialRef.current.uniforms.color1.value.set(COLORS.color1);
    materialRef.current.uniforms.color2.value.set(COLORS.color2);
    materialRef.current.uniforms.color3.value.set(COLORS.color3);
    materialRef.current.uniforms.color4.value.set(COLORS.color4);

    // Gradient params
    materialRef.current.uniforms.uFrequency.value = WAVE.frequency;
    materialRef.current.uniforms.uAmplitude.value = WAVE.amplitude;
    materialRef.current.uniforms.uSpeed.value = WAVE.speed;
    materialRef.current.uniforms.uNoiseSpeed.value = NOISE.noiseSpeed;
    materialRef.current.uniforms.uRotationIntensity.value =
      NOISE.rotationIntensity;
    materialRef.current.uniforms.uLayerRotation.value = NOISE.layerRotation;
    materialRef.current.uniforms.uUvOffset.value.set(
      POSITION.uvOffsetX,
      POSITION.uvOffsetY
    );
    materialRef.current.uniforms.uLayerMixStart.value = POSITION.layerMixStart;
    materialRef.current.uniforms.uLayerMixEnd.value = POSITION.layerMixEnd;

    // Magnetic
    materialRef.current.uniforms.uMagneticStrength.value =
      MAGNETIC.magneticStrength;
    materialRef.current.uniforms.uMagneticRadius.value =
      MAGNETIC.magneticRadius;
    materialRef.current.uniforms.uMagneticSoftness.value =
      MAGNETIC.magneticSoftness;

    // Metallic
    materialRef.current.uniforms.uMetallic.value = METALLIC.metallic;
    materialRef.current.uniforms.uSheenIntensity.value =
      METALLIC.sheenIntensity;
    materialRef.current.uniforms.uSheenSpeed.value = METALLIC.sheenSpeed;
    materialRef.current.uniforms.uSheenScale.value = METALLIC.sheenScale;
    materialRef.current.uniforms.uFresnelPower.value = METALLIC.fresnelPower;
    materialRef.current.uniforms.uFresnelIntensity.value =
      METALLIC.fresnelIntensity;
    materialRef.current.uniforms.uIridescence.value = METALLIC.iridescence;
    materialRef.current.uniforms.uIridescenceSpeed.value =
      METALLIC.iridescenceSpeed;
    materialRef.current.uniforms.uContrast.value = METALLIC.contrast;
    materialRef.current.uniforms.uBrightness.value = METALLIC.brightness;

    // Glass
    materialRef.current.uniforms.uGlassStrength.value = GLASS.glassStrength;
    materialRef.current.uniforms.uGlassSmoothness.value = GLASS.glassSmoothness;
    materialRef.current.uniforms.uStripesFrequency.value =
      GLASS.stripesFrequency;
    materialRef.current.uniforms.uEdgePadding.value = GLASS.edgePadding;
    materialRef.current.uniforms.uParallaxStrength.value =
      GLASS.parallaxStrength;
    materialRef.current.uniforms.uDistortionMultiplier.value =
      GLASS.distortionMultiplier;
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
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1] }}
      >
        <FractalGradientPlane />
      </Canvas>
    </div>
  );
}
