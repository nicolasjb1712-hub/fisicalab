import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function MultimeterScreen({ voltage, current, resistance }) {
  const canvas = useMemo(() => document.createElement("canvas"), []);
  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);

  useEffect(() => {
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");

    // Fondo
    ctx.fillStyle = "#001800";
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = "#14532d";
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 250, 154);

    // Valor principal — voltaje
    ctx.font = "bold 42px monospace";
    ctx.fillStyle = "#4ade80";
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 10;
    ctx.textAlign = "center";
    ctx.fillText(`${parseFloat(voltage).toFixed(1)} V`, 128, 52);

    // Separador
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#14532d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 65);
    ctx.lineTo(236, 65);
    ctx.stroke();

    // Corriente
    ctx.font = "500 22px monospace";
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 6;
    ctx.textAlign = "left";
    ctx.fillText(`I`, 20, 92);
    ctx.textAlign = "right";
    ctx.fillText(`${parseFloat(current).toFixed(3)} A`, 236, 92);

    // Resistencia
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.textAlign = "left";
    ctx.fillText(`R`, 20, 118);
    ctx.textAlign = "right";
    ctx.fillText(`${parseFloat(resistance).toFixed(1)} Ω`, 236, 118);

    // Potencia
    ctx.fillStyle = "#a78bfa";
    ctx.shadowColor = "#a78bfa";
    ctx.textAlign = "left";
    ctx.fillText(`P`, 20, 144);
    ctx.textAlign = "right";
    ctx.fillText(`${(voltage * current).toFixed(1)} W`, 236, 144);

    texture.needsUpdate = true;
  }, [voltage, current, resistance, canvas, texture]);

  return (
    <mesh position={[3.4, -1.6, -0.17]} rotation={[0.15, -0.3, 0]}>
      <planeGeometry args={[0.48, 0.3]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={0.5}
        toneMapped={false}
      />
    </mesh>
  );
}
