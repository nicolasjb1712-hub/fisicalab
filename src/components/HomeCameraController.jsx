import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HomeCameraController({ homeMode }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const progress = useRef(0);
  const animating = useRef(false);

  useEffect(() => {
    animating.current = true;
    progress.current = 0;
    if (homeMode) {
      targetPos.current.set(0, 2, 10);
      targetLook.current.set(0, 0, -2);
    } else {
      targetPos.current.set(6, 3, 11);
      targetLook.current.set(0, 0, 0);
    }
  }, [homeMode]);

  useFrame((_, delta) => {
    if (!animating.current) return;
    progress.current = Math.min(1, progress.current + delta * 0.8);
    const t = 1 - Math.pow(1 - progress.current, 3); // ease out cubic

    camera.position.lerp(targetPos.current, t * 0.08);
    currentLook.current.lerp(targetLook.current, t * 0.08);
    camera.lookAt(currentLook.current);

    if (progress.current >= 1) animating.current = false;
  });

  return null;
}
