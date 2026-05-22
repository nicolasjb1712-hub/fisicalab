import { useRef, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function VehicleModel({ vehicleId }) {
  const ref = useRef();

  // Cada vehículo tiene su propio modelo o se arma
  // Si tienes car.glb, bike.glb, motorcycle.glb usa este código
  const modelPath = `/models/${vehicleId === "car" ? "car" : vehicleId === "bike" ? "bike" : "motorcycle"}.glb`;

  let scene;
  try {
    const result = useGLTF(modelPath);
    scene = result.scene;
  } catch (e) {
    scene = null;
  }

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.03;
  });

  // Escalas distintas según el vehículo
  const scale =
    vehicleId === "car" ? 1.2 : vehicleId === "motorcycle" ? 1.8 : 1;

  if (!scene) return <FallbackVehicle vehicleId={vehicleId} />;

  return (
    <group ref={ref} scale={[scale, scale, scale]} position={[0, 0, 0]}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Modelos de respaldo armados con geometrías si no hay .glb
function FallbackVehicle({ vehicleId }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.03;
  });

  if (vehicleId === "bike") return <BikeGeometry groupRef={ref} />;
  if (vehicleId === "motorcycle") return <MotorcycleGeometry groupRef={ref} />;
  return <CarGeometry groupRef={ref} />;
}

function CarGeometry({ groupRef }) {
  return (
    <group ref={groupRef}>
      {/* Cuerpo */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 0.7, 1.8]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* Cabina */}
      <mesh position={[0.2, 1.1, 0]} castShadow>
        <boxGeometry args={[2.4, 0.6, 1.6]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      {/* Ruedas */}
      {[
        [-1.3, 0, 0.9],
        [1.3, 0, 0.9],
        [-1.3, 0, -0.9],
        [1.3, 0, -0.9],
      ].map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 24]} />
          <meshStandardMaterial color="#1f2937" roughness={0.7} />
        </mesh>
      ))}
      {/* Parabrisas */}
      <mesh position={[0.2, 1.15, 0]}>
        <boxGeometry args={[2.38, 0.55, 1.58]} />
        <meshPhysicalMaterial
          color="#93c5fd"
          transparent
          opacity={0.35}
          roughness={0}
          transmission={0.8}
        />
      </mesh>
      {/* Faros */}
      {[-0.8, 0.8].map((z, i) => (
        <mesh key={i} position={[2, 0.5, z]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fbbf24"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function BikeGeometry({ groupRef }) {
  return (
    <group ref={groupRef}>
      {/* Marco */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.05]} />
        <meshStandardMaterial color="#4ade80" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Tubo vertical */}
      <mesh position={[-0.5, 0.45, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.7, 0.05]} />
        <meshStandardMaterial color="#4ade80" metalness={0.8} />
      </mesh>
      {/* Tubo horizontal */}
      <mesh position={[0.4, 0.45, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.08, 0.7, 0.05]} />
        <meshStandardMaterial color="#4ade80" metalness={0.8} />
      </mesh>
      {/* Manubrio */}
      <mesh position={[0.65, 1, 0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} />
      </mesh>
      {/* Asiento */}
      <mesh position={[-0.5, 0.85, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.15]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Ruedas */}
      {[
        [-0.7, 0.3, 0],
        [0.7, 0.3, 0],
      ].map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.3, 0.05, 8, 24]} />
          <meshStandardMaterial color="#0d1117" roughness={0.7} />
        </mesh>
      ))}
      {/* Radios */}
      {[
        [-0.7, 0.3, 0],
        [0.7, 0.3, 0],
      ].map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 16]} />
          <meshStandardMaterial
            color="#9ca3af"
            metalness={0.8}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
      {/* Tanque H₂ pequeño */}
      <mesh position={[-0.1, 0.6, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          metalness={0.9}
        />
      </mesh>
      {/* Motor eléctrico pequeño */}
      <mesh position={[0.7, 0.3, 0]}>
        <cylinderGeometry
          args={[0.08, 0.08, 0.08, 16]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
    </group>
  );
}

function MotorcycleGeometry({ groupRef }) {
  return (
    <group ref={groupRef}>
      {/* Cuerpo principal */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.2, 0.35, 0.35]} />
        <meshStandardMaterial
          color="#fb923c"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>
      {/* Asiento */}
      <mesh position={[-0.3, 0.95, 0]} castShadow>
        <boxGeometry args={[0.6, 0.12, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Carenado delantero */}
      <mesh position={[0.55, 0.75, 0]}>
        <boxGeometry args={[0.35, 0.6, 0.45]} />
        <meshStandardMaterial color="#ea580c" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Faro */}
      <mesh position={[0.72, 0.8, 0]}>
        <boxGeometry args={[0.05, 0.25, 0.3]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fbbf24"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Manubrio */}
      <mesh position={[0.5, 1.05, 0]} castShadow>
        <boxGeometry args={[0.06, 0.1, 0.55]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} />
      </mesh>
      {/* Tanque H₂ — más visible */}
      <mesh position={[0.1, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.35, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          metalness={0.9}
        />
      </mesh>
      {/* Etiqueta H2 */}
      <mesh position={[0.1, 0.85, 0.18]}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#4ade80"
          emissiveIntensity={1}
        />
      </mesh>
      {/* Ruedas — más grandes */}
      {[
        [-0.65, 0.35, 0],
        [0.65, 0.35, 0],
      ].map((p, i) => (
        <group key={i} position={p}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.15, 24]} />
            <meshStandardMaterial color="#0d1117" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.18, 24]} />
            <meshStandardMaterial color="#374151" metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Escape (vapor de agua!) */}
      <mesh position={[-0.5, 0.55, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.3, 8]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Floor() {
  return (
    <>
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#0a0f18" roughness={0.3} metalness={0.7} />
      </mesh>
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
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
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

export default function HydrogenVehicle3D({ vehicleId }) {
  return (
    <group>
      <StudioLights />
      <Floor />
      <Particles />
      <Suspense fallback={<FallbackVehicle vehicleId={vehicleId} />}>
        <VehicleModel vehicleId={vehicleId} />
      </Suspense>
    </group>
  );
}
