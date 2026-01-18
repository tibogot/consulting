"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface HolographicGlobeProps {
  className?: string;
  globeRadius?: number;
  autoRotateSpeed?: number;
}

export default function HolographicGlobe({
  className = "",
  globeRadius = 100,
  autoRotateSpeed = 0.5,
}: HolographicGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const animationRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Vertex shader
  const vertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Fragment shader with X-ray wireframe effect
  const fragmentShader = `
    uniform sampler2D uGlobeTexture;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    uniform float uFresnelPower;
    uniform float uScanlineDensity;
    uniform float uScanlineIntensity;
    uniform float uGlowIntensity;
    uniform float uContrast;
    uniform float uBrightness;
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    // Edge detection function (Sobel-like)
    float edgeDetection(vec2 uv, sampler2D tex) {
      float texelSize = 1.0 / 512.0; // Adjust based on texture size
      
      // Sample surrounding pixels
      float tl = length(texture2D(tex, uv + vec2(-texelSize, -texelSize)).rgb);
      float tm = length(texture2D(tex, uv + vec2(0.0, -texelSize)).rgb);
      float tr = length(texture2D(tex, uv + vec2(texelSize, -texelSize)).rgb);
      float ml = length(texture2D(tex, uv + vec2(-texelSize, 0.0)).rgb);
      float mm = length(texture2D(tex, uv).rgb);
      float mr = length(texture2D(tex, uv + vec2(texelSize, 0.0)).rgb);
      float bl = length(texture2D(tex, uv + vec2(-texelSize, texelSize)).rgb);
      float bm = length(texture2D(tex, uv + vec2(0.0, texelSize)).rgb);
      float br = length(texture2D(tex, uv + vec2(texelSize, texelSize)).rgb);
      
      // Sobel edge detection
      float gx = -tl + tr - 2.0 * ml + 2.0 * mr - bl + br;
      float gy = -tl - 2.0 * tm - tr + bl + 2.0 * bm + br;
      float edge = sqrt(gx * gx + gy * gy);
      
      return clamp(edge * 2.0, 0.0, 1.0);
    }
    
    void main() {
      // Base texture sample
      vec3 baseColor = texture2D(uGlobeTexture, vUv).rgb;
      float baseLuminance = length(baseColor);
      
      // Edge detection for continent outlines (X-ray wireframe) - thinner edges
      float edge = edgeDetection(vUv, uGlobeTexture);
      float edgeBrightness = smoothstep(0.5, 0.55, edge); // Narrower range for thinner lines
      
      // Wireframe grid using UV coordinates - thinner grid lines
      vec2 grid = abs(fract(vUv * 32.0) - 0.5);
      float gridLine = smoothstep(0.48, 0.5, max(grid.x, grid.y));
      gridLine *= smoothstep(0.52, 0.5, max(grid.x, grid.y)); // Narrower range for thinner grid
      
      // Fresnel effect for rim glow
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.6 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, uFresnelPower);
      
      // Subtle animated scanlines
      float scanline = sin(vUv.y * uScanlineDensity * 100.0 + uTime * 2.0) * 0.5 + 0.5;
      scanline = pow(scanline, 4.0) * uScanlineIntensity * 0.2;
      
      // X-ray wireframe color - emphasize edges and grid, not filled areas
      vec3 wireframeColor = uColor;
      
      // Combine: edges are bright, grid is visible, base is very dim (X-ray effect)
      vec3 color = vec3(0.0);
      
      // Add edge lines (bright)
      color += vec3(edgeBrightness) * wireframeColor * 1.5;
      
      // Add grid lines (moderate brightness)
      color += vec3(gridLine) * wireframeColor * 0.8;
      
      // Very subtle base texture (X-ray transparency)
      color += baseColor * baseLuminance * 0.1;
      
      // Add scanlines (very subtle)
      color += vec3(scanline);
      
      // Add fresnel rim glow
      color += uGlowColor * fresnel * 0.8;
      
      // Adjust contrast and brightness
      color = (color - 0.5) * (1.0 + uContrast) + 0.5;
      color += uBrightness;
      
      // Clamp color
      color = clamp(color, 0.0, 1.0);
      
      // Alpha: more transparent (X-ray effect), but edges are more opaque
      float alpha = 0.3 + (edgeBrightness * 0.4) + (gridLine * 0.2) + (fresnel * 0.1);
      alpha = clamp(alpha, 0.2, 0.9);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerEl.clientWidth / containerEl.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 350);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerEl.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load world map texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/vecteezy_high-resolution-map-of-the-world-split-into-individual_.jpg",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        textureRef.current = texture;

        // Create holographic shader material
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uGlobeTexture: { value: texture },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0x8202ff) }, // Purple wireframe color
            uGlowColor: { value: new THREE.Color(0xa855f7) }, // Bright purple for glow
            uFresnelPower: { value: 3.0 },
            uScanlineDensity: { value: 8.0 },
            uScanlineIntensity: { value: 0.2 },
            uContrast: { value: 1.5 },
            uBrightness: { value: 0.1 },
            uGlowIntensity: { value: 1.6 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        materialRef.current = material;

        // Create globe geometry
        const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);
        globeMeshRef.current = globe;

        // Create wireframe overlay using EdgesGeometry
        const edgesGeometry = new THREE.EdgesGeometry(geometry, 1.0);
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0x8202ff,
          transparent: true,
          opacity: 0.3,
        });
        const wireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
        scene.add(wireframe);
        wireframeRef.current = wireframe;
      },
      undefined,
      (error) => {
        console.error("Error loading globe texture:", error);
      }
    );

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 150;
    controls.maxDistance = 600;
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const elapsedTime = clockRef.current.getElapsedTime();

      // Update shader time uniform
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsedTime;
      }

      // Update controls
      if (controls) {
        controls.update();
      }

      // Sync wireframe rotation with globe
      if (wireframeRef.current && globeMeshRef.current) {
        wireframeRef.current.rotation.copy(globeMeshRef.current.rotation);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerEl || !camera || !renderer) return;
      const width = containerEl.clientWidth;
      const height = containerEl.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (controls) {
        controls.dispose();
      }

      if (materialRef.current) {
        materialRef.current.dispose();
      }

      if (textureRef.current) {
        textureRef.current.dispose();
      }

      if (globeMeshRef.current) {
        globeMeshRef.current.geometry.dispose();
      }

      if (wireframeRef.current) {
        wireframeRef.current.geometry.dispose();
        if (wireframeRef.current.material instanceof THREE.Material) {
          wireframeRef.current.material.dispose();
        }
      }

      if (renderer && containerEl) {
        containerEl.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
}
