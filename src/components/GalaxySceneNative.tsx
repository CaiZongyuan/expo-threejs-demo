import { Canvas, useFrame } from "@react-three/fiber/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import { useTexture } from "../hooks/useTexture";

// Vertex shader for glow effect
const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize( normalMatrix * normal );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

// Fragment shader for atmospheric glow
const fragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 0.5 ) ), 4.0 );
    gl_FragColor = vec4( 0.89, 0.82, 0.69, 1.0 ) * intensity;
  }
`;

// Individual particle component
function Particle({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <tetrahedronGeometry args={[1, 1]} />
      <meshPhongMaterial color="#111111" flatShading={true} />
    </mesh>
  );
}

// Halo sphere with shader material
function HaloSphere({ scale = 16, position = [0, 0, 0] }: { scale?: number; position?: [number, number, number] }) {
  return (
    <mesh scale={scale} position={position}>
      <sphereGeometry args={[16, 32, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent={true}
      />
    </mesh>
  );
}

// Planet with texture
function TexturedPlanet({ texture }: { texture: THREE.Texture | null }) {
  const meshRef = useRef<Mesh>(null);

  // Log when texture changes
  useEffect(() => {
    console.log("[TexturedPlanet] Texture prop changed:", texture ? "Texture loaded" : "No texture");
    if (texture) {
      console.log("[TexturedPlanet] Texture details:", {
        image: texture.image,
        uuid: texture.uuid,
        needsUpdate: texture.needsUpdate,
      });
    }
  }, [texture]);

  // Use key to force re-render when texture loads
  const textureKey = texture ? "loaded" : "loading";

  return (
    <mesh scale={12} ref={meshRef}>
      <sphereGeometry args={[10, 64, 32]} />
      <meshPhongMaterial
        key={textureKey}
        map={texture || undefined}
        bumpMap={texture || undefined}
        bumpScale={0.05}
        color={texture ? "#ffffff" : "#E3D1AF"}
        emissive="#000000"
        specular="#888888"
        shininess={25}
      />
    </mesh>
  );
}

// Scene component with all 3D content
function GalaxyScene({
  cameraAngleX = 0,
  cameraAngleY = 0,
  zoom = 1,
  texture,
}: {
  cameraAngleX: number;
  cameraAngleY: number;
  zoom: number;
  texture: THREE.Texture | null;
}) {
  const particleRef = useRef<Group>(null);
  const circleRef = useRef<Group>(null);
  const haloRef = useRef<Group>(null);
  const luminorRef = useRef<Group>(null);

  // Generate 500 particles with random positions and rotations
  const particles = useMemo(() => {
    return Array.from({ length: 500 }, () => {
      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      const z = Math.random() - 0.5;
      const length = Math.sqrt(x * x + y * y + z * z);
      const scale = 200 + Math.random() * 500;
      return {
        position: [(x / length) * scale, (y / length) * scale, (z / length) * scale] as [number, number, number],
        rotation: [Math.random() * 2, Math.random() * 2, Math.random() * 2] as [number, number, number],
      };
    });
  }, []);

  useFrame(() => {
    if (particleRef.current) {
      particleRef.current.rotation.y -= 0.004;
    }
    if (circleRef.current) {
      circleRef.current.rotation.x -= 0.001;
      circleRef.current.rotation.y -= 0.001;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z -= 0.005;
    }
    if (luminorRef.current) {
      luminorRef.current.rotation.z -= 0.005;
    }
  });

  return (
    <>
      {/* Background particles - 500 tetrahedrons scattered in space */}
      <group ref={particleRef}>
        {particles.map((p, i) => (
          <Particle key={i} position={p.position} rotation={p.rotation} />
        ))}
      </group>

      {/* Central planet with texture */}
      <group ref={circleRef}>
        <TexturedPlanet texture={texture} />
      </group>

      {/* Glow halos with shader material */}
      <group ref={haloRef}>
        <HaloSphere scale={12} />
        <HaloSphere scale={7} position={[20, 5, 1]} />
      </group>

      {/* Lighting - fixed to actually show the texture */}
      <group ref={luminorRef}>
        <hemisphereLight args={[0x444444, 0x444444, 2]} position={[-1, -1, 2]} />
      </group>
      <directionalLight color="#888888" intensity={2} position={[-1, 0, 0.5]} />
      <directionalLight color="#888888" intensity={2} position={[1, 0, 0.5]} />
      <ambientLight intensity={0.5} color="#333333" />
    </>
  );
}

// Loading screen
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading texture...</Text>
    </View>
  );
}

// Main screen component with touch controls
export default function GalaxySceneScreen() {
  const [cameraAngleX, setCameraAngleX] = useState(0);
  const [cameraAngleY, setCameraAngleY] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Load the asteroid texture
  const texture = useTexture(require("../../assets/textures/asteroid.jpg"));

  // Pan responder for touch controls
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        setCameraAngleY((prev) => prev + dx * 0.005);
        setCameraAngleX((prev) => prev + dy * 0.005);
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Canvas
        camera={{ position: [0, 0, 400 * zoom], fov: 75, near: 1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ backgroundColor: "transparent" }}
      >
        <GalaxyScene
          cameraAngleX={cameraAngleX}
          cameraAngleY={cameraAngleY}
          zoom={zoom}
          texture={texture}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Gradient background similar to original
    backgroundColor: "#000C1C",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000C1C",
  },
  loadingText: {
    color: "#E3D1AF",
    fontSize: 16,
  },
});
