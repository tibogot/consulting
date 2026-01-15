"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useSyncExternalStore } from "react";
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

// Hardcoded values (previously from Leva controls)
const COLORS = {
  color1: "#9333EA",
  color2: "#1E1B4B",
  color3: "#b539ed",
  color4: "#0F172A",
};

const WAVE = {
  frequency: 2.0,
  amplitude: 20.0,
  speed: 0.5,
};

const NOISE = {
  noiseSpeed: 0.1,
  rotationIntensity: 720.0,
  layerRotation: -6.0,
};

const POSITION = {
  uvOffsetX: -0.25,
  uvOffsetY: 0.25,
  layerMixStart: 0.5,
  layerMixEnd: -0.3,
};

const MAGNETIC = {
  magneticStrength: 1,
  magneticRadius: 0.8,
  magneticSoftness: 2.0,
};

const METALLIC = {
  metallic: 0.2,
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

function GradientPlane() {
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
      // Magnetic uniforms
      uMagneticStrength: { value: MAGNETIC.magneticStrength },
      uMagneticRadius: { value: MAGNETIC.magneticRadius },
      uMagneticSoftness: { value: MAGNETIC.magneticSoftness },
      // Metallic uniforms
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
    }),
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
        zIndex: 0,
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
