import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Geometría y material compartidos — se crean UNA sola vez
const SPHERE_GEO = new THREE.SphereGeometry(1, 10, 10);

function BubbleSystem({ xPos, color, emissiveColor, count }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Datos fijos por burbuja — no se recrean al cambiar current
  const data = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        x: xPos + (Math.random() - 0.5) * 0.22,
        y: -1.05 + Math.random() * 0.5,
        z: (Math.random() - 0.5) * 0.78,
        speed: 0.005 + Math.random() * 0.009,
        size: 0.022 + Math.random() * 0.052,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 1.0 + Math.random() * 2.2,
        active: true,
      })),
    [xPos],
  ); // ← solo se recrea si cambia xPos, NO si cambia count

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    data.forEach((b, i) => {
      // Solo animar las burbujas activas según count actual
      if (i >= count) {
        dummy.scale.setScalar(0); // invisible
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        return;
      }

      b.y += b.speed;
      if (b.y > 0.78) {
        b.y = -1.05 + Math.random() * 0.3;
        b.x = xPos + (Math.random() - 0.5) * 0.22;
        b.z = (Math.random() - 0.5) * 0.78;
        b.speed = 0.005 + Math.random() * 0.009;
        b.size = 0.022 + Math.random() * 0.052;
      }

      const life = (b.y + 1.05) / 1.83; // 0=fondo 1=superficie
      const wx = Math.sin(t * b.wobbleSpeed + b.wobble) * 0.026;
      const wz = Math.cos(t * b.wobbleSpeed * 0.6 + b.wobble) * 0.016;

      // Física real: achatamiento y crecimiento al subir
      const squishY = 1.0 + life * 0.22;
      const squishXZ = 1.0 / Math.sqrt(squishY);
      const grow = 1.0 + life * 0.28;

      dummy.position.set(b.x + wx, b.y, b.z + wz);
      dummy.scale.set(
        b.size * squishXZ * grow,
        b.size * squishY * grow,
        b.size * squishXZ * grow,
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Intensidad del material según cantidad de burbujas activas
    if (meshRef.current.material) {
      const intensity = 0.2 + (count / 60) * 0.6;
      meshRef.current.material.emissiveIntensity = intensity;
      meshRef.current.material.opacity = 0.45 + (count / 60) * 0.3;
      meshRef.current.material.needsUpdate = false;
    }
  });

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(emissiveColor),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.55,
        roughness: 0.0,
        metalness: 0.0,
        transmission: 0.45,
        thickness: 0.6,
        envMapIntensity: 1.8,
        ior: 1.33,
      }),
    [color, emissiveColor],
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[SPHERE_GEO, material, 60]}
      frustumCulled={false}
    />
  );
}

// Anillos de splash en la superficie
function SurfaceSplash({ xPos, color, count }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const MAX = 6;

  const data = useMemo(
    () =>
      Array.from({ length: MAX }, (_, i) => ({
        x: xPos + (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.65,
        phase: (i / MAX) * Math.PI * 2,
        speed: 0.7 + Math.random() * 0.5,
      })),
    [xPos],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const activeCount = Math.min(Math.floor(count / 8), MAX);

    data.forEach((b, i) => {
      if (i >= activeCount) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        return;
      }
      const progress =
        ((t * b.speed + b.phase) % (Math.PI * 2)) / (Math.PI * 2);
      dummy.position.set(b.x, 0.74, b.z);
      dummy.scale.set(progress * 0.3, 1, progress * 0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geo = useMemo(() => new THREE.TorusGeometry(1, 0.07, 6, 22), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.35,
      }),
    [color],
  );

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, MAX]} frustumCulled={false} />
  );
}

// Luz dinámica que pulsa con la corriente
function ElectrodGlow({ position, color, intensity }) {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime();
    lightRef.current.intensity = intensity * (0.8 + Math.sin(t * 3) * 0.2);
  });
  return (
    <pointLight
      ref={lightRef}
      position={position}
      color={color}
      intensity={intensity}
      distance={3.5}
    />
  );
}

export default function Bubbles({ current }) {
  // count escala suavemente con la corriente
  const h2Count = Math.max(4, Math.min(60, Math.floor(current * 9)));
  const o2Count = Math.max(2, Math.min(30, Math.floor(current * 4.5)));

  // Intensidad de luz de los electrodos según corriente
  const glowIntensity = Math.min(2.5, 0.4 + current * 0.18);

  return (
    <group>
      {/* H₂ cátodo — azul */}
      <BubbleSystem
        xPos={-1.2}
        color="#93c5fd"
        emissiveColor="#1d4ed8"
        count={h2Count}
      />
      <SurfaceSplash xPos={-1.2} color="#3b82f6" count={h2Count} />
      <ElectrodGlow
        position={[-1.2, 0, 0.5]}
        color="#3b82f6"
        intensity={glowIntensity}
      />

      {/* O₂ ánodo — naranja-rojo */}
      <BubbleSystem
        xPos={1.2}
        color="#fca5a5"
        emissiveColor="#991b1b"
        count={o2Count}
      />
      <SurfaceSplash xPos={1.2} color="#ef4444" count={o2Count} />
      <ElectrodGlow
        position={[1.2, 0, 0.5]}
        color="#ef4444"
        intensity={glowIntensity * 0.7}
      />
    </group>
  );
}
