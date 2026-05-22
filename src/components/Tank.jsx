import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Tank() {
  return (
    <group>
      {/* ── Agua — solo superficie reflectante, sin volumen sólido ── */}
      <WaterSurface />

      {/* ── Paredes de vidrio fino ── */}
      <mesh position={[0, 0, 1.28]} castShadow>
        <boxGeometry args={[4.1, 3.1, 0.05]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.06}
          roughness={0}
          metalness={0}
          transmission={0.98}
          thickness={0.05}
        />
      </mesh>
      <mesh position={[0, 0, -1.28]}>
        <boxGeometry args={[4.1, 3.1, 0.05]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.06}
          roughness={0}
          metalness={0}
          transmission={0.98}
          thickness={0.05}
        />
      </mesh>
      <mesh position={[-2.08, 0, 0]}>
        <boxGeometry args={[0.05, 3.1, 2.63]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.06}
          roughness={0}
          metalness={0}
          transmission={0.98}
          thickness={0.05}
        />
      </mesh>
      <mesh position={[2.08, 0, 0]}>
        <boxGeometry args={[0.05, 3.1, 2.63]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.06}
          roughness={0}
          metalness={0}
          transmission={0.98}
          thickness={0.05}
        />
      </mesh>

      {/* ── Borde de agua visible (línea del nivel) ── */}
      <mesh position={[0, 0.73, 0]}>
        <boxGeometry args={[4.0, 0.012, 2.55]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* ── Base ── */}
      <mesh position={[0, -1.58, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.24, 0.1, 2.76]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* ── Marco metálico superior ── */}
      <mesh position={[0, 1.58, 0]}>
        <boxGeometry args={[4.24, 0.08, 2.76]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ── Columnas esquinas ── */}
      {[
        [-2.1, 0, -1.3],
        [-2.1, 0, 1.3],
        [2.1, 0, -1.3],
        [2.1, 0, 1.3],
      ].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.07, 3.2, 0.07]} />
          <meshStandardMaterial
            color="#4b5563"
            roughness={0.2}
            metalness={0.95}
          />
        </mesh>
      ))}

      {/* ── Membrana central ── */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.06, 2.9, 2.2]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.6}
          metalness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[0.1, 0.08, 2.2]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── MESA DE LABORATORIO ── */}
      {/* Superficie principal */}
      <mesh position={[0, -2.1, 0]} receiveShadow>
        <boxGeometry args={[9.0, 0.12, 5.5]} />
        <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Borde frontal mesa */}
      <mesh position={[0, -2.16, 2.76]}>
        <boxGeometry args={[9.0, 0.06, 0.06]} />
        <meshStandardMaterial
          color="#1e3a5f"
          roughness={0.4}
          metalness={0.6}
          emissive="#1e40af"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Patas metálicas */}
      {[
        [-4.0, -3.5, -2.4],
        [4.0, -3.5, -2.4],
        [-4.0, -3.5, 2.4],
        [4.0, -3.5, 2.4],
      ].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.12, 2.8, 0.12]} />
          <meshStandardMaterial
            color="#1f2937"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      ))}
      {/* Travesaño horizontal trasero */}
      <mesh position={[0, -3.8, -2.4]}>
        <boxGeometry args={[8.2, 0.08, 0.1]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Travesaño horizontal frontal */}
      <mesh position={[0, -3.8, 2.4]}>
        <boxGeometry args={[8.2, 0.08, 0.1]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── Objetos de laboratorio en la mesa ── */}
      {/* Vaso de precipitados izquierda */}
      <BeakerLeft />
      {/* Cuaderno / libreta */}
      <Notebook />
      {/* Multímetro derecha */}
      <Multimeter />
    </group>
  );
}

function WaterSurface() {
  const ref = useRef();
  const matRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 0.72 + Math.sin(t * 1.2) * 0.01;
      ref.current.rotation.x = Math.sin(t * 0.7) * 0.006;
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.08 + Math.sin(t * 1.5) * 0.04;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.9, 2.5, 1, 1]} />
      <meshStandardMaterial
        ref={matRef}
        color="#1e3a5f"
        emissive="#3b82f6"
        emissiveIntensity={0.08}
        transparent
        opacity={0.45}
        roughness={0.02}
        metalness={0.4}
      />
    </mesh>
  );
}

function BeakerLeft() {
  return (
    <group position={[-3.2, -1.9, 0.8]}>
      {/* Cuerpo cilíndrico */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.15, 0.55, 16, 1, true]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.15}
          roughness={0}
          transmission={0.9}
          thickness={0.1}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.275, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.2}
          roughness={0}
        />
      </mesh>
      {/* Líquido interior */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 16]} />
        <meshStandardMaterial
          color="#1d4ed8"
          transparent
          opacity={0.5}
          emissive="#3b82f6"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Pico */}
      <mesh position={[0.17, 0.26, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.06, 0.08, 0.04]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.2}
          roughness={0}
        />
      </mesh>
    </group>
  );
}

function Notebook() {
  return (
    <group position={[3.0, -2.03, 1.2]} rotation={[0, 0.3, 0]}>
      <mesh>
        <boxGeometry args={[0.9, 0.03, 0.65]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Líneas de texto simuladas */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.02, -0.22 + i * 0.12]}>
          <boxGeometry args={[0.7, 0.005, 0.01]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
      {/* Espiral */}
      <mesh position={[-0.46, 0.02, 0]}>
        <boxGeometry args={[0.02, 0.035, 0.6]} />
        <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Multimeter() {
  return (
    <group position={[3.4, -1.88, -0.6]}>
      {/* Cuerpo */}
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.28, 0.85]} />
        <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Pantalla */}
      <mesh position={[0, 0.04, 0.43]}>
        <boxGeometry args={[0.32, 0.14, 0.01]} />
        <meshStandardMaterial
          color="#001800"
          emissive="#4ade80"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Selector rotativo */}
      <mesh position={[0, -0.06, 0.43]}>
        <cylinderGeometry args={[0.07, 0.07, 0.025, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Cables sonda */}
      <mesh position={[-0.1, -0.2, 0.43]} rotation={[0.5, 0, 0.2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        <meshStandardMaterial color="#ef4444" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, -0.2, 0.43]} rotation={[0.5, 0, -0.2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
    </group>
  );
}
