import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// ── Vaso de precipitados ──
function Beaker({
  position,
  liquidColor,
  liquidLevel = 0.5,
  radius = 0.18,
  height = 0.55,
}) {
  return (
    <group position={position}>
      {/* Cuerpo vidrio */}
      <mesh>
        <cylinderGeometry args={[radius, radius * 0.88, height, 20, 1, true]} />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.13}
          roughness={0}
          transmission={0.92}
          thickness={0.08}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -height / 2 + 0.01, 0]}>
        <cylinderGeometry args={[radius * 0.88, radius * 0.88, 0.018, 20]} />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.18}
          roughness={0}
        />
      </mesh>
      {/* Líquido */}
      <mesh position={[0, -height / 2 + (height * liquidLevel) / 2, 0]}>
        <cylinderGeometry
          args={[radius * 0.85, radius * 0.85, height * liquidLevel, 20]}
        />
        <meshStandardMaterial
          color={liquidColor}
          transparent
          opacity={0.55}
          emissive={liquidColor}
          emissiveIntensity={0.08}
          roughness={0.1}
        />
      </mesh>
      {/* Superficie líquido */}
      <mesh
        position={[0, -height / 2 + height * liquidLevel, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[radius * 0.85, 20]} />
        <meshStandardMaterial
          color={liquidColor}
          transparent
          opacity={0.5}
          roughness={0.02}
          metalness={0.1}
        />
      </mesh>
      {/* Pico */}
      <mesh
        position={[radius * 0.9, height / 2 - 0.04, 0]}
        rotation={[0, 0, -0.35]}
      >
        <boxGeometry args={[0.06, 0.07, 0.03]} />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.2}
          roughness={0}
        />
      </mesh>
      {/* Graduaciones */}
      {[0.25, 0.5, 0.75].map((lvl, i) => (
        <mesh
          key={i}
          position={[radius + 0.005, -height / 2 + height * lvl, 0]}
        >
          <boxGeometry args={[0.025, 0.007, 0.005]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ── Tubo de ensayo ──
function TestTube({
  position,
  rotation = [0, 0, 0],
  liquidColor,
  liquidLevel = 0.6,
}) {
  const r = 0.045;
  const h = 0.32;
  return (
    <group position={position} rotation={rotation}>
      {/* Cuerpo */}
      <mesh>
        <cylinderGeometry args={[r, r, h, 16, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.15}
          roughness={0}
          transmission={0.95}
          thickness={0.04}
        />
      </mesh>
      {/* Fondo redondeado */}
      <mesh position={[0, -h / 2, 0]}>
        <sphereGeometry args={[r, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.15}
          roughness={0}
          transmission={0.95}
        />
      </mesh>
      {/* Líquido */}
      <mesh position={[0, -h / 2 + (h * liquidLevel) / 2 - 0.01, 0]}>
        <cylinderGeometry args={[r * 0.88, r * 0.88, h * liquidLevel, 16]} />
        <meshStandardMaterial
          color={liquidColor}
          transparent
          opacity={0.65}
          emissive={liquidColor}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Tapón */}
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r * 1.1, r * 1.1, 0.04, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ── Gradilla de tubos ──
function TestTubeRack({ position }) {
  const colors = [
    "#3b82f6",
    "#ef4444",
    "#fbbf24",
    "#4ade80",
    "#a78bfa",
    "#f472b6",
  ];
  return (
    <group position={position}>
      {/* Base de la gradilla */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.55, 0.045, 0.18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Barra superior */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.55, 0.03, 0.04]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Soportes laterales */}
      {[-0.24, 0.24].map((x, i) => (
        <mesh key={i} position={[x, 0.12, 0]}>
          <boxGeometry args={[0.025, 0.25, 0.04]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
      ))}
      {/* Tubos */}
      {colors.map((c, i) => (
        <TestTube
          key={i}
          position={[-0.2 + i * 0.08, 0.17, 0]}
          liquidColor={c}
          liquidLevel={0.4 + Math.random() * 0.4}
        />
      ))}
    </group>
  );
}

// ── Termómetro ──
function Thermometer({ position }) {
  const bulbRef = useRef();
  useFrame(({ clock }) => {
    if (bulbRef.current) {
      bulbRef.current.emissiveIntensity =
        0.4 + Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
    }
  });
  return (
    <group position={position}>
      {/* Tubo de vidrio */}
      <mesh>
        <cylinderGeometry args={[0.022, 0.022, 1.1, 12, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.2}
          roughness={0}
          transmission={0.9}
        />
      </mesh>
      {/* Mercurio/líquido rojo */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.7, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Bulbo inferior */}
      <mesh position={[0, -0.56, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          ref={bulbRef}
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Graduaciones */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0.023, -0.45 + i * 0.1, 0]}>
          <boxGeometry args={[0.02, 0.005, 0.003]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      ))}
    </group>
  );
}

// ── Lámpara de laboratorio ──
function LabLamp({ position }) {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity =
        1.8 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });
  return (
    <group position={position}>
      {/* Base pesada */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.06, 20]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Brazo vertical */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.3, 10]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Brazo horizontal */}
      <mesh position={[0.5, 1.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 1.0, 10]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Articulación */}
      <mesh position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#374151" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Cuello del foco */}
      <mesh position={[0.95, 1.1, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 10]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Pantalla/reflector */}
      <mesh position={[1.05, 0.92, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.18, 0.22, 20, 1, true]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.4}
          metalness={0.8}
          side={2}
        />
      </mesh>
      {/* Bombilla */}
      <mesh position={[1.05, 0.97, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color="#fffbeb"
          emissive="#fbbf24"
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Luz real */}
      <pointLight
        ref={lightRef}
        position={[1.05, 0.85, 0]}
        intensity={1.8}
        color="#fff8e7"
        distance={5}
        castShadow
      />
      {/* Cable */}
      <mesh position={[0, 0.03, 0.12]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ── Libreta ──
function Notebook({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tapa */}
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.04, 0.72]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} />
      </mesh>
      {/* Páginas */}
      <mesh position={[0, 0.028, 0]}>
        <boxGeometry args={[0.94, 0.018, 0.66]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.95} />
      </mesh>
      {/* Líneas escritas */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0.02, 0.038, -0.24 + i * 0.08]}>
          <boxGeometry args={[0.72 - (i % 3) * 0.12, 0.003, 0.007]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
      ))}
      {/* Datos escritos — líneas más cortas simulando números */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-0.3, 0.038, -0.22 + i * 0.14]}>
          <boxGeometry args={[0.15, 0.003, 0.006]} />
          <meshStandardMaterial color="#3b82f6" roughness={1} />
        </mesh>
      ))}
      {/* Espiral */}
      <mesh position={[-0.5, 0.028, 0]}>
        <boxGeometry args={[0.025, 0.04, 0.68]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Bolígrafo */}
      <mesh position={[0.3, 0.06, 0.42]} rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.012, 0.009, 0.65, 8]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.42, 0.06, 0.62]} rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.005, 0.001, 0.06, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.9} />
      </mesh>
    </group>
  );
}

// ── Estante con frascos al fondo ──
function BackShelf() {
  const flaskColors = [
    "#3b82f6",
    "#ef4444",
    "#fbbf24",
    "#4ade80",
    "#a78bfa",
    "#f472b6",
    "#22d3ee",
    "#fb923c",
    "#84cc16",
    "#e879f9",
  ];

  return (
    <group position={[0, 0, -3.2]}>
      {/* Tablero trasero de la pared */}
      <mesh position={[0, 1.5, -0.1]} receiveShadow>
        <boxGeometry args={[11, 6.5, 0.12]} />
        <meshStandardMaterial color="#080d14" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Zócalo inferior */}
      <mesh position={[0, -1.2, -0.05]}>
        <boxGeometry args={[11, 0.08, 0.18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* ── Estante 1 (bajo) ── */}
      <Shelf y={0.3} width={10.5} />
      {/* ── Estante 2 (medio) ── */}
      <Shelf y={1.5} width={10.5} />
      {/* ── Estante 3 (alto) ── */}
      <Shelf y={2.7} width={10.5} />

      {/* Soportes verticales del estante */}
      {[-5.1, -1.7, 1.7, 5.1].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 0.02]}>
          <boxGeometry args={[0.06, 4.8, 0.14]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      ))}

      {/* ── Frascos estante bajo ── */}
      {flaskColors.slice(0, 5).map((c, i) => (
        <ErlenmeyerFlask
          key={i}
          position={[-3.8 + i * 1.9, 0.58, 0.05]}
          color={c}
          height={0.45 + (i % 3) * 0.08}
        />
      ))}

      {/* ── Frascos estante medio ── */}
      {flaskColors.slice(3, 9).map((c, i) => (
        <BottleFlask
          key={i}
          position={[-4.2 + i * 1.65, 1.78, 0.05]}
          color={c}
        />
      ))}

      {/* ── Frascos estante alto ── */}
      {flaskColors.slice(1, 8).map((c, i) => (
        <SmallVial key={i} position={[-3.5 + i * 1.1, 2.94, 0.05]} color={c} />
      ))}

      {/* Luz de neón fría debajo del estante medio */}
      <mesh position={[0, 1.44, 0.18]}>
        <boxGeometry args={[9.5, 0.025, 0.03]} />
        <meshStandardMaterial
          color="#bfdbfe"
          emissive="#bfdbfe"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight
        position={[0, 1.2, 0.4]}
        intensity={0.4}
        color="#bfdbfe"
        distance={4}
      />

      {/* Letrero laboratorio */}
      <mesh position={[3.8, 3.5, -0.05]}>
        <boxGeometry args={[2.2, 0.4, 0.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      <mesh position={[3.8, 3.5, -0.02]}>
        <boxGeometry args={[2.1, 0.32, 0.01]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#22d3ee"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}

function Shelf({ y, width }) {
  return (
    <group>
      <mesh position={[0, y, 0.08]}>
        <boxGeometry args={[width, 0.05, 0.28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Borde frontal con luz */}
      <mesh position={[0, y + 0.025, 0.22]}>
        <boxGeometry args={[width, 0.01, 0.01]} />
        <meshStandardMaterial
          color="#1e3a5f"
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function ErlenmeyerFlask({ position, color, height = 0.45 }) {
  const liqH = height * 0.5;
  return (
    <group position={position}>
      {/* Cuerpo cónico */}
      <mesh>
        <cylinderGeometry
          args={[height * 0.45, height * 0.1, height, 14, 1, true]}
        />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.14}
          roughness={0}
          transmission={0.93}
          thickness={0.06}
        />
      </mesh>
      {/* Cuello */}
      <mesh position={[0, height * 0.58, 0]}>
        <cylinderGeometry
          args={[height * 0.1, height * 0.1, height * 0.22, 12, 1, true]}
        />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.14}
          roughness={0}
          transmission={0.93}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -height / 2 + 0.01, 0]}>
        <cylinderGeometry args={[height * 0.44, height * 0.44, 0.015, 14]} />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.2}
          roughness={0}
        />
      </mesh>
      {/* Líquido */}
      <mesh position={[0, -height / 2 + liqH / 2, 0]}>
        <cylinderGeometry args={[height * 0.42, height * 0.08, liqH, 14]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.1}
        />
      </mesh>
      {/* Tapón */}
      <mesh position={[0, height * 0.7, 0]}>
        <cylinderGeometry args={[height * 0.12, height * 0.12, 0.04, 10]} />
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </mesh>
    </group>
  );
}

function BottleFlask({ position, color }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.36, 16, 1, true]} />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.12}
          roughness={0}
          transmission={0.94}
          thickness={0.07}
        />
      </mesh>
      <mesh position={[0, -0.18 + 0.01, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.015, 16]} />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.18}
          roughness={0}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.035, 0.09, 0.12, 12, 1, true]} />
        <meshPhysicalMaterial
          color="#c8e6ff"
          transparent
          opacity={0.12}
          roughness={0}
          transmission={0.94}
        />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.096, 0.096, 0.22, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.55}
          emissive={color}
          emissiveIntensity={0.08}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.06, 10]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  );
}

function SmallVial({ position, color }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.22, 12, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.16}
          roughness={0}
          transmission={0.95}
        />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.04, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.16}
          roughness={0}
          transmission={0.95}
        />
      </mesh>
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.036, 0.036, 0.14, 12]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.65}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 10]} />
        <meshStandardMaterial color="#374151" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ── EXPORT PRINCIPAL ──
export default function LabEnvironment() {
  return (
    <group>
      <BackShelf />

      {/* Vasos precipitados en mesa */}
      <Beaker
        position={[-3.4, -1.88, 0.9]}
        liquidColor="#3b82f6"
        liquidLevel={0.55}
      />
      <Beaker
        position={[-3.0, -1.88, 0.2]}
        liquidColor="#22d3ee"
        liquidLevel={0.35}
        radius={0.13}
        height={0.42}
      />
      <Beaker
        position={[-2.6, -1.88, 0.9]}
        liquidColor="#fbbf24"
        liquidLevel={0.45}
        radius={0.22}
        height={0.65}
      />

      {/* Gradilla con tubos de ensayo */}
      <TestTubeRack position={[3.2, -1.89, 0.7]} />

      {/* Termómetro — dentro del tanque */}
      <Thermometer position={[0.6, 0.15, 1.1]} />

      {/* Lámpara de laboratorio */}
      <LabLamp position={[-4.0, -2.08, -0.8]} />

      {/* Libreta con anotaciones */}
      <Notebook position={[3.2, -2.03, -0.5]} rotation={[0, -0.25, 0]} />
    </group>
  );
}
