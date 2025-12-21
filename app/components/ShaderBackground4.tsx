"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useControls, button } from "leva";

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

const fragmentShader = `
  #define S(a,b,t) smoothstep(a,b,t)
  #define PI 3.14159265359
  
  // Rotation Function
  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }
  
  // Create Noise
  // Created by inigo quilez - iq/2014
  // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
    return fract(sin(p)*43758.5453);
  }
  
  float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);
    float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                        dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                   mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                        dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    return 0.5 + 0.5*n;
  }
  
  // HSV to RGB conversion
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // Vars
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;
  
  // Customizable parameters
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeed;
  uniform float uNoiseSpeed;
  uniform float uRotationIntensity;
  uniform float uLayerRotation;
  uniform vec2 uUvOffset;
  uniform float uLayerMixStart;
  uniform float uLayerMixEnd;
  
  // Metallic parameters
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
  
  // Magnetic warp parameters
  uniform float uMagneticStrength;
  uniform float uMagneticRadius;
  uniform float uMagneticSoftness;
  
  varying vec2 vUv;
  
  void main() {
    float ratio = iResolution.x / iResolution.y;
    vec2 tUv = vUv;
    
    // Store original UV for effects
    vec2 origUv = vUv;
    
    // ============ MAGNETIC WARP EFFECT (Smooth Lens Distortion) ============
    if (uMagneticStrength != 0.0) {
      // Convert mouse position to UV space (mouse is -0.5 to 0.5, UV is 0 to 1)
      vec2 mouseUv = vec2(iMouse.x + 0.5, 0.5 - iMouse.y);
      
      // Vector from mouse to current pixel (note: reversed direction for lens effect)
      vec2 delta = tUv - mouseUv;
      
      // Adjust for aspect ratio
      delta.x *= ratio;
      
      // Distance from mouse
      float dist = length(delta);
      
      // Smooth bell curve falloff (Gaussian-like) - no harsh edges
      float influence = exp(-dist * dist / (uMagneticRadius * uMagneticRadius * 0.5));
      influence = pow(influence, uMagneticSoftness);
      
      // Lens/Bulge distortion formula
      // This creates a smooth dome-like displacement, not a cone
      float bulge = influence * uMagneticStrength * 0.15;
      
      // Scale UVs away from or toward mouse position (zoom effect)
      vec2 scaledDelta = delta * (1.0 - bulge);
      scaledDelta.x /= ratio; // Correct aspect ratio back
      
      // Apply the smooth warp
      tUv = mouseUv + scaledDelta;
    }
    
    tUv -= uUvOffset;
    
    // Mouse Interaction (for other effects)
    vec2 mouse = vec2(iMouse.x * ratio, iMouse.y * ratio);
    
    // Rotation with Noise
    float degree = noise(vec2(iTime * uNoiseSpeed, tUv.x * tUv.y));
    tUv.y *= 1.0 / ratio;
    tUv *= Rot( radians( (degree - 0.5) * uRotationIntensity + 180.0 ));
    tUv.y *= ratio;
    
    // Wave warp with sin
    float speed = iTime * uSpeed;
    
    tUv.x += sin( tUv.y * uFrequency + speed) / uAmplitude;
    tUv.y += sin( tUv.x * uFrequency * 1.5 + speed ) / ( uAmplitude * 0.5);
    
    // Draw the Image
    vec3 layer1 = mix(color1, color2, S( -.3, .3, ( tUv * Rot( radians( uLayerRotation))).x));
    vec3 layer2 = mix(color3, color4, S( -.3, .3, ( tUv * Rot( radians( uLayerRotation))).x));
    vec3 finalComp = mix(layer1, layer2, S( uLayerMixStart, uLayerMixEnd, tUv.y ));
    
    vec3 col = finalComp;
    
    // ============ METALLIC EFFECTS ============
    
    if (uMetallic > 0.0) {
      // 1. Sheen / Specular highlight (moving bright band)
      float sheenTime = iTime * uSheenSpeed;
      float sheenNoise = noise(tUv * uSheenScale + sheenTime);
      float sheen = pow(sheenNoise, 3.0) * uSheenIntensity;
      
      // Add directional sheen based on angle
      float sheenAngle = sin(tUv.x * 3.0 + tUv.y * 2.0 + sheenTime * 0.5);
      sheen += pow(max(0.0, sheenAngle), 8.0) * uSheenIntensity * 0.5;
      
      // 2. Fresnel effect (brighter at edges)
      vec2 centeredUv = origUv - 0.5;
      float distFromCenter = length(centeredUv);
      float fresnel = pow(distFromCenter * 2.0, uFresnelPower) * uFresnelIntensity;
      
      // 3. Iridescence (rainbow color shift)
      float iridescencePhase = (tUv.x + tUv.y) * 2.0 + iTime * uIridescenceSpeed;
      vec3 iridescenceColor = hsv2rgb(vec3(
        fract(iridescencePhase * 0.1 + noise(tUv * 3.0) * 0.2),
        0.6,
        1.0
      ));
      
      // 4. Apply metallic effects
      // Add sheen highlight
      col += sheen * uMetallic * vec3(1.0, 1.0, 1.0);
      
      // Add fresnel rim lighting
      col += fresnel * uMetallic * (color1 + vec3(0.2));
      
      // Blend iridescence
      col = mix(col, col * iridescenceColor, uIridescence * uMetallic);
      
      // 5. Contrast and brightness adjustment for metallic look
      col = (col - 0.5) * (1.0 + uContrast * uMetallic) + 0.5;
      col += uBrightness * uMetallic;
      
      // 6. Add subtle noise grain for brushed metal effect
      float grain = noise(origUv * 500.0 + iTime * 0.1) * 0.03 * uMetallic;
      col += grain;
    }
    
    // Clamp final color
    col = clamp(col, 0.0, 1.0);
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function GradientPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Color presets
  const colorPresets = {
    "Purple Dark": {
      color1: "#9333EA",
      color2: "#1E1B4B",
      color3: "#7C3AED",
      color4: "#0F172A",
    },
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
    "Orange Metal": {
      // Same palette as "Orange Dark" (the metallic is set separately)
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
    // Default: Purple Dark
    color1: { value: "#9333EA", label: "Accent 1" },
    color2: { value: "#1E1B4B", label: "Dark 1" },
    color3: { value: "#7C3AED", label: "Accent 2" },
    color4: { value: "#0F172A", label: "Dark 2" },
    " ": button(() => {}), // Spacer
    "Purple Dark": button(() => {
      setColors(colorPresets["Purple Dark"]);
    }),
    "Ocean (Default)": button(() => {
      setColors(colorPresets["Ocean (Default)"]);
    }),
    "Orange Dark": button(() => {
      setColors(colorPresets["Orange Dark"]);
    }),
    "Orange Metal": button(() => {
      setColors(colorPresets["Orange Metal"]);
      setMetallic({ metallic: 0.55 });
    }),
    "Orange Light": button(() => {
      setColors(colorPresets["Orange Light"]);
    }),
    "Orange Final": button(() => {
      setColors(colorPresets["Orange Final"]);
    }),
  }));

  const wave = useControls("Wave Effect", {
    frequency: {
      value: 2.0,
      min: 0.1,
      max: 10.0,
      step: 0.1,
      label: "Frequency",
    },
    amplitude: {
      value: 20.0,
      min: 1.0,
      max: 100.0,
      step: 1.0,
      label: "Amplitude",
    },
    speed: { value: 1.25, min: 0.0, max: 5.0, step: 0.05, label: "Speed" },
  });

  const noise = useControls("Noise & Rotation", {
    noiseSpeed: {
      value: 0.1,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Noise Speed",
    },
    rotationIntensity: {
      value: 720.0,
      min: 0.0,
      max: 1440.0,
      step: 10.0,
      label: "Rotation Intensity",
    },
    layerRotation: {
      value: -6.0,
      min: -180.0,
      max: 180.0,
      step: 1.0,
      label: "Layer Rotation",
    },
  });

  const position = useControls("Position & Mix", {
    uvOffsetX: {
      value: 0.25,
      min: -1.0,
      max: 1.0,
      step: 0.01,
      label: "UV Offset X",
    },
    uvOffsetY: {
      value: 0.25,
      min: -1.0,
      max: 1.0,
      step: 0.01,
      label: "UV Offset Y",
    },
    layerMixStart: {
      value: 0.5,
      min: -1.0,
      max: 2.0,
      step: 0.01,
      label: "Layer Mix Start",
    },
    layerMixEnd: {
      value: -0.3,
      min: -1.0,
      max: 2.0,
      step: 0.01,
      label: "Layer Mix End",
    },
  });

  // Magnetic warp controls
  const magnetic = useControls("🧲 Magnetic Warp", {
    magneticStrength: {
      value: 0.5,
      min: -2.0,
      max: 2.0,
      step: 0.01,
      label: "Strength",
    },
    magneticRadius: {
      value: 0.4,
      min: 0.1,
      max: 1.5,
      step: 0.01,
      label: "Radius",
    },
    magneticSoftness: {
      value: 2.0,
      min: 0.5,
      max: 5.0,
      step: 0.1,
      label: "Softness",
    },
  });

  // Metallic controls
  const [metallic, setMetallic] = useControls("✨ Metallic Effect", () => ({
    metallic: {
      value: 0.55,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Metallic",
    },
    sheenIntensity: {
      value: 0.5,
      min: 0.0,
      max: 2.0,
      step: 0.01,
      label: "Sheen Intensity",
    },
    sheenSpeed: {
      value: 0.5,
      min: 0.0,
      max: 3.0,
      step: 0.1,
      label: "Sheen Speed",
    },
    sheenScale: {
      value: 3.0,
      min: 0.5,
      max: 10.0,
      step: 0.1,
      label: "Sheen Scale",
    },
    fresnelPower: {
      value: 2.0,
      min: 0.5,
      max: 5.0,
      step: 0.1,
      label: "Fresnel Power",
    },
    fresnelIntensity: {
      value: 0.3,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Fresnel Intensity",
    },
    iridescence: {
      value: 0.2,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Iridescence",
    },
    iridescenceSpeed: {
      value: 0.3,
      min: 0.0,
      max: 2.0,
      step: 0.1,
      label: "Iridescence Speed",
    },
    contrast: {
      value: 0.3,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Contrast Boost",
    },
    brightness: {
      value: 0.05,
      min: -0.2,
      max: 0.3,
      step: 0.01,
      label: "Brightness",
    },
  }));

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
      },
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
      uUvOffset: {
        value: new THREE.Vector2(position.uvOffsetX, position.uvOffsetY),
      },
      uLayerMixStart: { value: position.layerMixStart },
      uLayerMixEnd: { value: position.layerMixEnd },
      // Magnetic uniforms
      uMagneticStrength: { value: magnetic.magneticStrength },
      uMagneticRadius: { value: magnetic.magneticRadius },
      uMagneticSoftness: { value: magnetic.magneticSoftness },
      // Metallic uniforms
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
    };

    const handleMouseOut = () => {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouseRef.current.x = touch.pageX / window.innerWidth - 0.5;
      mouseRef.current.y = touch.pageY / window.innerHeight - 0.5;
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Animation loop - updates uniforms every frame
  useFrame((state) => {
    if (materialRef.current) {
      // Time and resolution
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

      // Update colors from Leva
      materialRef.current.uniforms.color1.value.set(colors.color1);
      materialRef.current.uniforms.color2.value.set(colors.color2);
      materialRef.current.uniforms.color3.value.set(colors.color3);
      materialRef.current.uniforms.color4.value.set(colors.color4);

      // Update wave parameters
      materialRef.current.uniforms.uFrequency.value = wave.frequency;
      materialRef.current.uniforms.uAmplitude.value = wave.amplitude;
      materialRef.current.uniforms.uSpeed.value = wave.speed;

      // Update noise parameters
      materialRef.current.uniforms.uNoiseSpeed.value = noise.noiseSpeed;
      materialRef.current.uniforms.uRotationIntensity.value =
        noise.rotationIntensity;
      materialRef.current.uniforms.uLayerRotation.value = noise.layerRotation;

      // Update position parameters
      materialRef.current.uniforms.uUvOffset.value.set(
        position.uvOffsetX,
        position.uvOffsetY
      );
      materialRef.current.uniforms.uLayerMixStart.value =
        position.layerMixStart;
      materialRef.current.uniforms.uLayerMixEnd.value = position.layerMixEnd;

      // Update magnetic parameters
      materialRef.current.uniforms.uMagneticStrength.value =
        magnetic.magneticStrength;
      materialRef.current.uniforms.uMagneticRadius.value =
        magnetic.magneticRadius;
      materialRef.current.uniforms.uMagneticSoftness.value =
        magnetic.magneticSoftness;

      // Update metallic parameters
      materialRef.current.uniforms.uMetallic.value = metallic.metallic;
      materialRef.current.uniforms.uSheenIntensity.value =
        metallic.sheenIntensity;
      materialRef.current.uniforms.uSheenSpeed.value = metallic.sheenSpeed;
      materialRef.current.uniforms.uSheenScale.value = metallic.sheenScale;
      materialRef.current.uniforms.uFresnelPower.value = metallic.fresnelPower;
      materialRef.current.uniforms.uFresnelIntensity.value =
        metallic.fresnelIntensity;
      materialRef.current.uniforms.uIridescence.value = metallic.iridescence;
      materialRef.current.uniforms.uIridescenceSpeed.value =
        metallic.iridescenceSpeed;
      materialRef.current.uniforms.uContrast.value = metallic.contrast;
      materialRef.current.uniforms.uBrightness.value = metallic.brightness;
    }
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

export default function ShaderBackground() {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
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
        <GradientPlane />
      </Canvas>
    </div>
  );
}
