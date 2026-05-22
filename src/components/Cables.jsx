import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function AnimatedCable({ points, color, speed = 1.5 }) {
  const ref = useRef();
  const matRef = useRef();
  const dotRefs = useRef([]);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [],
  );

  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 40, 0.022, 8, false),
    [curve],
  );

  // Partículas de corriente
  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        offset: i / 6,
        size: 0.035 + Math.random() * 0.02,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const dot = dotRefs.current[i];
      if (!dot) return;
      const progress = (p.offset + t * speed * 0.12) % 1;
      const point = curve.getPoint(progress);
      dot.position.copy(point);
      // pulso de escala
      const scale = 1 + Math.sin(t * 4 + i) * 0.3;
      dot.scale.setScalar(scale);
    });
    // pulso brillo del cable
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.15 + Math.sin(t * 3) * 0.08;
    }
  });

  return (
    <group>
      {/* Tubo del cable */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Partículas de corriente fluyendo */}
      {particles.map((p, i) => (
        <mesh key={i} ref={(el) => (dotRefs.current[i] = el)}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Cables() {
  // Cable rojo: terminal + (izq fuente) → cátodo izquierda
  const redPoints = [
    [0 - 0.55, 3.4 - 0.2, 0.57], // terminal + fuente
    [-0.55, 3.0, 0.3],
    [-0.8, 2.5, 0],
    [-1.2, 2.0, 0],
    [-1.2, 1.65, 0], // terminal cátodo
  ];

  // Cable gris: terminal − (der fuente) → ánodo derecha
  const grayPoints = [
    [0 + 0.55, 3.4 - 0.2, 0.57], // terminal − fuente
    [0.55, 3.0, 0.3],
    [0.8, 2.5, 0],
    [1.2, 2.0, 0],
    [1.2, 1.65, 0], // terminal ánodo
  ];

  return (
    <group>
      <AnimatedCable points={redPoints} color="#ef4444" speed={1.8} />
      <AnimatedCable points={grayPoints} color="#9ca3af" speed={1.4} />
    </group>
  );
}
