import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STEAM_GEO = new THREE.SphereGeometry(1, 6, 6);

export default function Steam({ current }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const MAX = 30;

  const data = useMemo(
    () =>
      Array.from({ length: MAX }, (_, i) => ({
        x: (Math.random() - 0.5) * 3.2,
        y: 0.75 + Math.random() * 0.3,
        z: (Math.random() - 0.5) * 1.8,
        vy: 0.003 + Math.random() * 0.004,
        vx: (Math.random() - 0.5) * 0.001,
        size: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        life: Math.random(),
      })),
    [],
  );

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.0,
        roughness: 1,
        metalness: 0,
        depthWrite: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const active = Math.max(2, Math.min(MAX, Math.floor(current * 3)));

    data.forEach((p, i) => {
      if (i >= active) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        return;
      }

      p.y += p.vy;
      p.x += p.vx;
      p.life = (p.y - 0.75) / 1.8;

      if (p.y > 2.5 || p.life > 1) {
        p.x = (Math.random() - 0.5) * 3.2;
        p.y = 0.75 + Math.random() * 0.2;
        p.z = (Math.random() - 0.5) * 1.8;
        p.life = 0;
        p.size = 0.04 + Math.random() * 0.08;
      }

      // Crece y se desvanece al subir
      const grow = 1 + p.life * 4;
      const opacity = Math.sin(p.life * Math.PI) * 0.18;
      mat.opacity = opacity;

      const wobble = Math.sin(t * 0.8 + p.phase) * 0.06;
      dummy.position.set(p.x + wobble, p.y, p.z);
      dummy.scale.setScalar(p.size * grow);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[STEAM_GEO, mat, MAX]}
      frustumCulled={false}
    />
  );
}
