import { useRef, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CarModel({ tankFillPercent }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/car2.glb");

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Rotación lenta tipo showroom
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
    // Flotado sutil
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.03;
  });

  return (
    <group ref={ref} scale={[2, 2, 2]} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Floor() {
  return (
    <>
      {/* Piso circular reflectivo */}
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#0a0f18" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Anillos decorativos */}
      {[2, 3, 4, 5].map((r, i) => (
        <mesh key={i} position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.02, r, 64]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.2 + i * 0.05}
            transparent
            opacity={0.3 - i * 0.05}
          />
        </mesh>
      ))}
      {/* Grid pattern */}
      <gridHelper
        args={[12, 24, "#1e3a5f", "#0d1830"]}
        position={[0, -0.49, 0]}
      />
    </>
  );
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      {/* Luz principal superior */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Luces de acento azules */}
      <pointLight
        position={[5, 2, 5]}
        intensity={1.5}
        color="#3b82f6"
        distance={10}
      />
      <pointLight
        position={[-5, 2, 5]}
        intensity={1.5}
        color="#22d3ee"
        distance={10}
      />
      <pointLight
        position={[0, 2, -5]}
        intensity={1.2}
        color="#818cf8"
        distance={10}
      />
      {/* Luz fill inferior */}
      <pointLight
        position={[0, -1, 0]}
        intensity={0.4}
        color="#1e3a5f"
        distance={5}
      />
    </>
  );
}

function Particles() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 40 }, (_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const radius = 4 + (i % 3) * 0.5;
        const y = -0.3 + ((i * 0.37) % 3);
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={2}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function CarLoader() {
  return (
    <mesh>
      <boxGeometry args={[3, 1, 5]} />
      <meshStandardMaterial color="#374151" wireframe />
    </mesh>
  );
}

export default function HydrogenCar3D({ tankFillPercent }) {
  return (
    <group>
      <StudioLights />
      <Floor />
      <Particles />
      <Suspense fallback={<CarLoader />}>
        <CarModel tankFillPercent={tankFillPercent} />
      </Suspense>
    </group>
  );
}

// Precargar el modelo
useGLTF.preload("/models/car2.glb");
