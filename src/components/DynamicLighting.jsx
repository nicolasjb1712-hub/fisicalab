import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function DynamicLighting({ voltage, current }) {
  const blueRef = useRef();
  const redRef = useRef();
  const topRef = useRef();
  const fillRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const normalized = Math.min(1, voltage / 30);
    const pulse = Math.sin(t * (2 + current * 0.3)) * 0.15;

    if (blueRef.current) {
      blueRef.current.intensity =
        (0.8 + normalized * 2.2 + pulse) * (current / 5 + 0.2);
    }
    if (redRef.current) {
      redRef.current.intensity =
        (0.5 + normalized * 1.4 + pulse * 0.7) * (current / 5 + 0.2);
    }
    if (topRef.current) {
      topRef.current.intensity = 0.6 + normalized * 0.8;
    }
    if (fillRef.current) {
      fillRef.current.intensity =
        0.3 + normalized * 0.4 + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <>
      {/* Luz cátodo — azul, pulsa con corriente */}
      <pointLight
        ref={blueRef}
        position={[-1.2, 0.5, 1.5]}
        color="#3b82f6"
        intensity={1.2}
        distance={5}
      />
      {/* Luz ánodo — roja */}
      <pointLight
        ref={redRef}
        position={[1.2, 0.5, 1.5]}
        color="#ef4444"
        intensity={0.8}
        distance={5}
      />
      {/* Luz superior — cambia temperatura de color con voltaje */}
      <pointLight
        ref={topRef}
        position={[0, 5, 2]}
        color="#c8e6ff"
        intensity={1.0}
        distance={10}
      />
      {/* Fill suave */}
      <pointLight
        ref={fillRef}
        position={[0, -1, 3]}
        color="#1e3a5f"
        intensity={0.4}
        distance={8}
      />
    </>
  );
}
