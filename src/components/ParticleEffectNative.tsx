import { useFrame } from "@react-three/fiber/native";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ParticleEffectNativeProps {
  amplitude?: number;
}

// Vertex shader with noise function for organic deformation
const vertexShader = `
  varying vec3 v_color;
  varying vec3 v_normal;
  
  uniform float u_time;
  uniform float u_progress;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
  
  void main() {
    float noise = snoise(position * u_progress + u_time / 10.0);
    vec3 newPos = position * (noise + 0.7);
    
    v_color = hsv2rgb(vec3(noise * 0.1 + 0.01, .7, 0.7));
    
    v_normal = normal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

// Fragment shader for lighting
const fragmentShader = `
  varying vec3 v_color;
  varying vec3 v_normal;
  
  void main() {
    vec3 light = vec3(0.0);
    vec3 skyColor = vec3(1.000, 1.000, 0.547);
    vec3 groundColor = vec3(0.562, 0.275, 0.111);
    
    vec3 lightDirection = normalize(vec3(0.0, -1.0, -1.0));
    light += dot(lightDirection, v_normal);
    
    light = mix(skyColor, groundColor, dot(lightDirection, v_normal));
    
    gl_FragColor = vec4(light * v_color, 1.0);
  }
`;

// Particle vertex shader
const particleVertexShader = `
  uniform float u_time;
  void main() {
    vec3 p = position;
    
    p.y += 0.25*(sin(p.y * 5.0 + u_time) * 0.5 + 0.5);
    p.z += 0.05*(sin(p.y * 10.0 + u_time) * 0.5 + 0.5);
    
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = 10.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Particle fragment shader
const particleFragmentShader = `
  uniform float u_progress;
  void main() {
    gl_FragColor = vec4(0.4, 0.4, 0.4, u_progress);
  }
`;

// Main sphere component
function AudioSphere({ amplitude = 0 }: { amplitude: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_progress: { value: 0.7 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      // Drive deformation with amplitude
      materialRef.current.uniforms.u_progress.value = 0.7 + amplitude * 2;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1, 162, 162]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// Particle system component
function ParticleSystem({ amplitude = 0 }: { amplitude: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create particle geometry with positions using Fibonacci sphere distribution
  const geometry = useMemo(() => {
    const N = 30000;
    const position = new Float32Array(N * 3);
    const inc = Math.PI * (3 - Math.sqrt(5));
    const offset = 2 / N;
    const radius = 2;

    for (let i = 0; i < N; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * inc;

      position[3 * i] = radius * Math.cos(phi) * r;
      position[3 * i + 1] = radius * y;
      position[3 * i + 2] = radius * Math.sin(phi) * r;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    return geo;
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_progress: { value: 0.35 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      materialRef.current.uniforms.u_progress.value = 0.35 + amplitude * 2;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.005;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </points>
  );
}

// Main exported component
export function ParticleEffectNative({
  amplitude = 0,
}: ParticleEffectNativeProps) {
  return (
    <>
      <AudioSphere amplitude={amplitude} />
      <ParticleSystem amplitude={amplitude} />
    </>
  );
}
