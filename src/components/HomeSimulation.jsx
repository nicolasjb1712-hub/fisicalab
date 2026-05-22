import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ══════════════════════════════════════════════
//  DIMENSIONES HABITACIÓN
// ══════════════════════════════════════════════
const ROOM = { width: 20, depth: 14, height: 5.5, floorY: -2.2 };
const WALLS = {
  back: -ROOM.depth / 2,
  front: ROOM.depth / 2,
  left: -ROOM.width / 2,
  right: ROOM.width / 2,
};

// ══════════════════════════════════════════════
//  TOOLTIP HTML — SIEMPRE LEGIBLE, NO SE DEFORMA
// ══════════════════════════════════════════════
function ApplianceTooltip({
  visible,
  name,
  watts,
  hours,
  costCOP,
  costUSD,
  isOn,
}) {
  if (!visible) return null;
  const feasible = hours >= 0.1;
  const color = feasible ? "#3b82f6" : "#ef4444";

  return (
    <Html
      center
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          background: "rgba(5,10,20,0.97)",
          border: `2px solid ${color}`,
          borderRadius: 10,
          padding: "12px 14px",
          minWidth: 240,
          fontFamily: "'Segoe UI', sans-serif",
          boxShadow: `0 0 20px ${color}40, 0 8px 24px rgba(0,0,0,.6)`,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            paddingBottom: 6,
            borderBottom: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: isOn ? "#4ade80" : "#ef4444",
              boxShadow: `0 0 10px ${isOn ? "#4ade80" : "#ef4444"}`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isOn ? "#4ade80" : "#ef4444",
              letterSpacing: ".05em",
            }}
          >
            {isOn ? "FUNCIONANDO" : "ENERGÍA INSUFICIENTE"}
          </span>
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#e8eaf2",
            marginBottom: 10,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div>
            <div
              style={{ fontSize: 9, color: "#6b7280", letterSpacing: ".05em" }}
            >
              POTENCIA
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#818cf8",
                fontFamily: "monospace",
              }}
            >
              {watts} W
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: 9, color: "#6b7280", letterSpacing: ".05em" }}
            >
              DURACIÓN
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: feasible ? "#4ade80" : "#6b7280",
                fontFamily: "monospace",
              }}
            >
              {feasible ? `${hours.toFixed(1)} h` : "No alcanza"}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            paddingTop: 6,
            borderTop: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <div
            style={{ fontSize: 11, color: "#fbbf24", fontFamily: "monospace" }}
          >
            ${costCOP?.toLocaleString?.("es-CO") ?? 0} COP
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#22d3ee",
              fontFamily: "monospace",
              textAlign: "right",
            }}
          >
            ${(costUSD ?? 0).toFixed(4)} USD
          </div>
        </div>
      </div>
    </Html>
  );
}

// ══════════════════════════════════════════════
//  CAMERA CONTROLS — teclado
// ══════════════════════════════════════════════
function KeyboardCameraControls() {
  const { camera, controls } = useThree();
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const k = keys.current;
    const speed = 6 * delta;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();

    const move = new THREE.Vector3();
    if (k["arrowup"] || k["w"]) move.addScaledVector(dir, speed);
    if (k["arrowdown"] || k["s"]) move.addScaledVector(dir, -speed);
    if (k["arrowleft"] || k["a"]) move.addScaledVector(right, -speed);
    if (k["arrowright"] || k["d"]) move.addScaledVector(right, speed);
    if (k["q"]) move.y -= speed;
    if (k["e"]) move.y += speed;

    if (move.lengthSq() > 0) {
      const newPos = camera.position.clone().add(move);
      camera.position.copy(newPos);
      // Mover también el target de OrbitControls para que siga la cámara
      if (controls && controls.target) {
        const newTarget = controls.target.clone().add(move);
        controls.target.copy(newTarget);
      }
    }
  });
  return null;
}

// ══════════════════════════════════════════════
//  CABLE — techo → pared derecha → regleta (LIMPIO)
// ══════════════════════════════════════════════
function EnergyCable({ hasEnergy, energyLevel }) {
  const dotRefs = useRef([]);
  const matRef = useRef();

  const points = useMemo(
    () => [
      new THREE.Vector3(3.0, 3.2, 3.0),
      new THREE.Vector3(WALLS.right - 0.1, 3.8, 3.0),
      new THREE.Vector3(WALLS.right - 0.1, ROOM.height - 0.3, 3.0),
      new THREE.Vector3(WALLS.right - 0.1, ROOM.height - 0.3, WALLS.back + 2),
      new THREE.Vector3(WALLS.right - 0.1, 0, WALLS.back + 1.5),
      new THREE.Vector3(WALLS.right - 0.1, -1.4, WALLS.back + 1.5),
    ],
    [],
  );

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 80, 0.025, 8, false),
    [curve],
  );
  const particles = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ offset: i / 12 })),
    [],
  );

  useFrame(({ clock }) => {
    if (!hasEnergy) return;
    const t = clock.getElapsedTime();
    const speed = 0.05 + energyLevel * 0.13;
    particles.forEach((p, i) => {
      const dot = dotRefs.current[i];
      if (!dot) return;
      const progress = (p.offset + t * speed) % 1;
      dot.position.copy(curve.getPoint(progress));
      dot.scale.setScalar(1 + Math.sin(t * 5 + i * 0.7) * 0.4);
    });
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.15 + energyLevel * 0.3;
    }
  });

  const color = hasEnergy ? "#4ade80" : "#1f2937";
  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={hasEnergy ? 0.2 : 0}
          roughness={0.8}
        />
      </mesh>
      {hasEnergy &&
        particles.map((_, i) => (
          <mesh key={i} ref={(el) => (dotRefs.current[i] = el)}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial
              color="#4ade80"
              emissive="#4ade80"
              emissiveIntensity={3.5}
              transparent
              opacity={0.95}
            />
          </mesh>
        ))}
      <PowerStrip
        position={[WALLS.right - 0.08, -1.45, WALLS.back + 1.5]}
        isOn={hasEnergy}
      />
    </group>
  );
}

function PowerStrip({ position, isOn }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[0.7, 0.12, 0.1]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.7} />
      </mesh>
      {[-0.24, -0.08, 0.08, 0.24].map((x, i) => (
        <group key={i} position={[x, 0, 0.052]}>
          {[
            [-0.02, 0.02],
            [0.02, 0.02],
            [0, -0.02],
          ].map(([px, py], j) => (
            <mesh key={j} position={[px, py, 0]}>
              <boxGeometry args={[0.016, 0.022, 0.008]} />
              <meshStandardMaterial color="#050a10" />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[-0.3, 0, 0.052]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color={isOn ? "#4ade80" : "#374151"}
          emissive={isOn ? "#4ade80" : "#000"}
          emissiveIntensity={isOn ? 2.5 : 0}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════
//  HABITACIÓN
// ══════════════════════════════════════════════
function Room() {
  return (
    <group>
      <mesh
        position={[0, ROOM.floorY, 0]}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial
          color="#1a1510"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      {[-8, -5, -2, 1, 4, 7].map((x, i) => (
        <mesh
          key={i}
          position={[x, ROOM.floorY + 0.001, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.03, ROOM.depth]} />
          <meshStandardMaterial color="#0d0a07" />
        </mesh>
      ))}
      {/* Paredes */}
      <mesh position={[0, ROOM.height / 2 - 1, WALLS.back]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.height + 2]} />
        <meshStandardMaterial color="#1e2a3a" roughness={0.95} />
      </mesh>
      <mesh
        position={[WALLS.left, ROOM.height / 2 - 1, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM.depth, ROOM.height + 2]} />
        <meshStandardMaterial color="#1e2a3a" roughness={0.95} />
      </mesh>
      <mesh
        position={[WALLS.right, ROOM.height / 2 - 1, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM.depth, ROOM.height + 2]} />
        <meshStandardMaterial color="#1e2a3a" roughness={0.95} />
      </mesh>
      <mesh position={[0, ROOM.height - 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#0a0d12" roughness={1} />
      </mesh>

      {/* Zócalos */}
      <mesh position={[0, ROOM.floorY + 0.08, WALLS.back + 0.02]}>
        <boxGeometry args={[ROOM.width, 0.16, 0.03]} />
        <meshStandardMaterial color="#2a2017" roughness={0.8} />
      </mesh>
      <mesh
        position={[WALLS.left + 0.02, ROOM.floorY + 0.08, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[ROOM.depth, 0.16, 0.03]} />
        <meshStandardMaterial color="#2a2017" roughness={0.8} />
      </mesh>
      <mesh
        position={[WALLS.right - 0.02, ROOM.floorY + 0.08, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry args={[ROOM.depth, 0.16, 0.03]} />
        <meshStandardMaterial color="#2a2017" roughness={0.8} />
      </mesh>

      <WindowWithView position={[WALLS.left + 0.06, 1, -2]} />
      <Door position={[WALLS.left + 0.06, -0.8, 3]} />
      {/* Cuadros pared fondo */}
      <WallFrame
        position={[-6.5, 1.5, WALLS.back + 0.06]}
        size={[1.4, 1.0]}
        color="#1e40af"
      />
      <WallFrame
        position={[-4.5, 1.2, WALLS.back + 0.06]}
        size={[1.0, 1.4]}
        color="#166534"
      />
      <WallFrame
        position={[1, 2.2, WALLS.back + 0.06]}
        size={[1.8, 0.8]}
        color="#7c2d12"
      />

      {/* Reloj */}
      <WallClock position={[3, 2.5, WALLS.back + 0.06]} />

      {/* Estante flotante pared fondo */}
      <FloatingShelf position={[-3, 0.3, WALLS.back + 0.06]} />

      {/* Cuadros pared derecha */}
      <WallFrame
        position={[WALLS.right - 0.06, 1.5, 0]}
        size={[1.2, 0.9]}
        color="#581c87"
        rotationY={-Math.PI / 2}
      />
      <WallFrame
        position={[WALLS.right - 0.06, 1.5, 2]}
        size={[1.0, 1.0]}
        color="#a16207"
        rotationY={-Math.PI / 2}
      />

      {/* Planta decorativa en esquina */}
      <Plant position={[WALLS.left + 1.5, ROOM.floorY, 5]} />
      <Plant position={[-8, ROOM.floorY, WALLS.back + 0.5]} />

      <mesh
        position={[-2, ROOM.floorY + 0.005, -2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[5.5, 3.8]} />
        <meshStandardMaterial color="#14213d" roughness={1} />
      </mesh>
      <mesh
        position={[-2, ROOM.floorY + 0.01, -2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[5.2, 3.5]} />
        <meshStandardMaterial
          color="#1e3a5f"
          roughness={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
function FloatingShelf({ position }) {
  return (
    <group position={position}>
      {/* Repisa */}
      <mesh>
        <boxGeometry args={[1.5, 0.05, 0.3]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>
      {/* Libros */}
      {[-0.5, -0.35, -0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]}>
          <boxGeometry args={[0.08, 0.25, 0.2]} />
          <meshStandardMaterial
            color={["#1e40af", "#166534", "#7f1d1d"][i]}
            roughness={0.7}
          />
        </mesh>
      ))}
      {/* Florero */}
      <mesh position={[0.3, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.25, 12]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Portarretrato */}
      <mesh position={[0.6, 0.12, 0]}>
        <boxGeometry args={[0.18, 0.2, 0.03]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Plant({ position }) {
  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Maceta */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.5, 16]} />
        <meshStandardMaterial color="#1e1308" roughness={0.8} />
      </mesh>
      {/* Tallo */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </mesh>
      {/* Hojas — esferas apiladas */}
      {[
        [0, 1.3, 0, 0.35],
        [0.2, 1.5, 0.1, 0.28],
        [-0.2, 1.5, -0.1, 0.28],
        [0, 1.7, 0.2, 0.25],
        [0.15, 1.75, -0.15, 0.22],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <sphereGeometry args={[p[3], 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function WindowWithView({ position }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[2.4, 2.0, 0.08]} />
        <meshStandardMaterial color="#2a2017" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.2, 1.8]} />
        <meshStandardMaterial
          color="#0a1230"
          emissive="#1e3a5f"
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      {[
        [-0.6, -0.2],
        [0.3, -0.4],
        [-0.2, 0.2],
        [0.7, 0.1],
        [0.5, -0.6],
        [-0.8, -0.5],
        [0.1, 0.4],
        [-0.4, -0.7],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.06]}>
          <circleGeometry args={[0.025, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.04, 1.8, 0.02]} />
        <meshStandardMaterial color="#2a2017" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#2a2017" roughness={0.7} />
      </mesh>
      <pointLight
        position={[0.5, 0, 0]}
        intensity={0.3}
        color="#1e3a5f"
        distance={5}
      />
    </group>
  );
}

function Door({ position }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.0, 2.2, 0.08]} />
        <meshStandardMaterial color="#3d2817" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.3, 0.045]}>
        <boxGeometry args={[0.7, 0.7, 0.02]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.5, 0.045]}>
        <boxGeometry args={[0.7, 0.7, 0.02]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      <mesh position={[0.38, 0, 0.06]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function WallFrame({ position, size, color, rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.04]} />
        <meshStandardMaterial color="#1a1108" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

function WallClock({ position }) {
  const handRef = useRef();
  useFrame(({ clock }) => {
    if (handRef.current)
      handRef.current.rotation.z = -clock.getElapsedTime() * 0.1;
  });
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.04, 24]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <circleGeometry args={[0.32, 24]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i * Math.PI) / 6;
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.26, Math.cos(angle) * 0.26, 0.03]}
          >
            <boxGeometry args={[0.015, 0.05, 0.005]} />
            <meshStandardMaterial color="#0d1117" />
          </mesh>
        );
      })}
      <group ref={handRef} position={[0, 0, 0.035]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.02, 0.22, 0.008]} />
          <meshStandardMaterial color="#0d1117" />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.04]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════
//  SOFÁ — orientado al TV (pared fondo)
// ══════════════════════════════════════════════
function Sofa({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.5, 1.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Respaldo MIRANDO AL FRENTE — hacia Z positivo (el sofá mira a -Z) */}
      <mesh position={[0, 0.95, 0.42]} castShadow>
        <boxGeometry args={[2.8, 0.75, 0.18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {[-1.4, 1.4].map((x, i) => (
        <mesh key={i} position={[x, 0.65, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 1.0]} />
          <meshStandardMaterial color="#172130" roughness={0.9} />
        </mesh>
      ))}
      {[-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.65, -0.08]} castShadow>
          <boxGeometry args={[0.65, 0.25, 0.75]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>
      ))}
      {[-0.75, 0, 0.75].map((x, i) => (
        <mesh key={i} position={[x, 1.1, 0.32]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.2]} />
          <meshStandardMaterial color="#475569" roughness={0.95} />
        </mesh>
      ))}
      {[
        [-1.2, 0.05, -0.4],
        [1.2, 0.05, -0.4],
        [-1.2, 0.05, 0.4],
        [1.2, 0.05, 0.4],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial
            color="#0d1117"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function CoffeeTable({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.07, 0.75]} />
        <meshStandardMaterial color="#2a1810" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.25, 0.02, 0.7]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.2}
          roughness={0}
          transmission={0.85}
        />
      </mesh>
      {[
        [-0.55, 0, -0.32],
        [0.55, 0, -0.32],
        [-0.55, 0, 0.32],
        [0.55, 0, 0.32],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.035, 0.035, 0.78, 8]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      ))}
      <mesh position={[0.2, 0.44, 0.1]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.22]} />
        <meshStandardMaterial color="#1e40af" roughness={0.7} />
      </mesh>
      <mesh position={[-0.25, 0.45, -0.1]}>
        <cylinderGeometry args={[0.06, 0.05, 0.1, 12]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.4} />
      </mesh>
    </group>
  );
}

function TVStand({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.2, 0.9, 0.55]} />
        <meshStandardMaterial color="#2a1810" roughness={0.5} metalness={0.2} />
      </mesh>
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0.28]}>
          <boxGeometry args={[0.9, 0.35, 0.015]} />
          <meshStandardMaterial
            color="#1e1308"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      ))}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[2.2, 0.02, 0.55]} />
        <meshStandardMaterial
          color="#1e3a5f"
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════
//  NEVERA GRANDE con tooltip DELANTE
// ══════════════════════════════════════════════
function LargeRefrigerator({
  position,
  isOn,
  appData,
  onHover,
  onLeave,
  hovered,
}) {
  const coldRef = useRef();
  useFrame(({ clock }) => {
    if (!coldRef.current) return;
    coldRef.current.intensity = isOn
      ? 0.5 + Math.sin(clock.getElapsedTime() * 0.6) * 0.1
      : 0;
  });

  return (
    <group position={[position[0], ROOM.floorY + 1.4, position[2]]}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={onHover}
        onPointerOut={onLeave}
      >
        <boxGeometry args={[1.3, 2.8, 0.9]} />
        <meshStandardMaterial
          color="#e5e7eb"
          roughness={0.25}
          metalness={0.75}
        />
      </mesh>
      <mesh position={[0, 1.415, 0]}>
        <boxGeometry args={[1.32, 0.04, 0.92]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.85, 0.455]}>
        <boxGeometry args={[1.28, 0.9, 0.02]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.95, 0.47]}>
        <boxGeometry args={[0.6, 0.45, 0.01]} />
        <meshPhysicalMaterial
          color="#a8d8ff"
          transparent
          opacity={0.25}
          roughness={0}
          transmission={0.8}
        />
      </mesh>
      <mesh position={[0, -0.45, 0.455]}>
        <boxGeometry args={[1.28, 1.7, 0.02]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.85, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.98}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0.5, -0.45, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.98}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.4, 0.47]}>
        <boxGeometry args={[1.28, 0.04, 0.02]} />
        <meshStandardMaterial color="#6b7280" roughness={0.4} />
      </mesh>
      <mesh position={[-0.4, 1.22, 0.47]}>
        <boxGeometry args={[0.3, 0.15, 0.015]} />
        <meshStandardMaterial color="#0d1117" />
      </mesh>
      <mesh position={[-0.4, 1.22, 0.478]}>
        <boxGeometry args={[0.26, 0.11, 0.005]} />
        <meshStandardMaterial
          color="#001400"
          emissive={isOn ? "#4ade80" : "#000"}
          emissiveIntensity={isOn ? 0.8 : 0}
        />
      </mesh>
      <mesh position={[-0.38, 0.05, 0.47]}>
        <boxGeometry args={[0.28, 0.45, 0.02]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.7} />
      </mesh>
      {[
        [-0.55, -1.42, -0.38],
        [0.55, -1.42, -0.38],
        [-0.55, -1.42, 0.38],
        [0.55, -1.42, 0.38],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.05, 0.06, 0.04, 8]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
      {isOn && (
        <pointLight
          ref={coldRef}
          position={[0, 0.2, 0.7]}
          intensity={0.5}
          color="#22d3ee"
          distance={3}
        />
      )}
      {/* Tooltip flotando DELANTE de la nevera */}
      <group position={[0, 0.3, 1.6]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Nevera grande"}
          watts={appData?.watts || 150}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════
//  BOMBILLO (cable corto, sin colgar largo)
// ══════════════════════════════════════════════
function LEDBulb({ position, isOn, appData, onHover, onLeave, hovered }) {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    lightRef.current.intensity = isOn
      ? 2 + Math.sin(clock.getElapsedTime() * 3) * 0.08
      : 0;
  });
  return (
    <group position={position}>
      {/* Base del techo */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Casquillo (sin cable colgante) */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh
        position={[0, -0.18, 0]}
        onPointerOver={onHover}
        onPointerOut={onLeave}
      >
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshPhysicalMaterial
          color={isOn ? "#fffbeb" : "#1f2937"}
          emissive={isOn ? "#fbbf24" : "#000"}
          emissiveIntensity={isOn ? 1.8 : 0}
          transparent
          opacity={isOn ? 0.9 : 0.6}
          roughness={0}
          transmission={isOn ? 0.35 : 0.1}
        />
      </mesh>
      {isOn && (
        <>
          <pointLight
            ref={lightRef}
            position={[0, -0.18, 0]}
            intensity={2}
            color="#fff8e7"
            distance={7}
            castShadow
          />
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.26, 10, 10]} />
            <meshStandardMaterial
              color="#fbbf24"
              transparent
              opacity={0.06}
              emissive="#fbbf24"
              emissiveIntensity={0.25}
            />
          </mesh>
        </>
      )}
      {/* Tooltip DEBAJO */}
      <group position={[0, -1.5, 0]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Bombillo LED"}
          watts={appData?.watts || 10}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

function CeilingFan({ position, isOn, appData, onHover, onLeave, hovered }) {
  const bladesRef = useRef();
  const speedRef = useRef(0);
  useFrame((_, delta) => {
    if (!bladesRef.current) return;
    const target = isOn ? 4.0 : 0;
    speedRef.current += (target - speedRef.current) * 0.018;
    bladesRef.current.rotation.y += speedRef.current * delta;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 10]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh onPointerOver={onHover} onPointerOut={onLeave}>
        <cylinderGeometry args={[0.22, 0.22, 0.26, 24]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.22, 0.025, 8, 30]} />
        <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
      </mesh>
      <group ref={bladesRef} position={[0, -0.08, 0]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0.8, 0, 0]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[1.0, 0.035, 0.24]} />
                <meshStandardMaterial
                  color={isOn ? "#1e3a5f" : "#1f2937"}
                  emissive={isOn ? "#1e40af" : "#000"}
                  emissiveIntensity={isOn ? 0.15 : 0}
                  roughness={0.3}
                  metalness={0.7}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color={isOn ? "#4ade80" : "#374151"}
          emissive={isOn ? "#4ade80" : "#000"}
          emissiveIntensity={isOn ? 2.5 : 0}
        />
      </mesh>
      {isOn && (
        <pointLight
          position={[0, -0.3, 0]}
          intensity={0.4}
          color="#c8e6ff"
          distance={6}
        />
      )}
      <group position={[0, -1.5, 0]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Ventilador de techo"}
          watts={appData?.watts || 75}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════
//  TV — orientado hacia +Z (mira al sofá)
// ══════════════════════════════════════════════
function Television({ position, isOn, appData, onHover, onLeave, hovered }) {
  const screenRef = useRef();
  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    screenRef.current.emissiveIntensity = isOn
      ? 0.6 + Math.sin(clock.getElapsedTime() * 0.4) * 0.1
      : 0;
  });
  return (
    <group position={position}>
      <mesh castShadow onPointerOver={onHover} onPointerOut={onLeave}>
        <boxGeometry args={[1.8, 1.1, 0.08]} />
        <meshStandardMaterial color="#080d14" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0.042]}>
        <boxGeometry args={[1.68, 0.94, 0.01]} />
        <meshStandardMaterial color="#040810" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0.048]}>
        <planeGeometry args={[1.55, 0.82]} />
        <meshStandardMaterial
          ref={screenRef}
          color={isOn ? "#0f1e38" : "#050a10"}
          emissive={isOn ? "#2563eb" : "#000"}
          emissiveIntensity={isOn ? 0.6 : 0}
          roughness={0}
        />
      </mesh>
      {isOn && (
        <mesh position={[0, 0.05, -0.05]}>
          <boxGeometry args={[1.85, 1.13, 0.01]} />
          <meshStandardMaterial
            color="#1e40af"
            emissive="#1e40af"
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
      <mesh position={[0.8, -0.52, 0.042]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color={isOn ? "#4ade80" : "#ef4444"}
          emissive={isOn ? "#4ade80" : "#ef4444"}
          emissiveIntensity={1.5}
        />
      </mesh>
      {isOn && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.8}
          color="#1e40af"
          distance={5}
        />
      )}
      {/* Tooltip DELANTE del TV */}
      <group position={[0, 1.2, 0.5]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || 'Televisor LED 42"'}
          watts={appData?.watts || 80}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

function Router({ position, isOn, appData, onHover, onLeave, hovered }) {
  const led0 = useRef();
  const led1 = useRef();
  const led2 = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (led0.current)
      led0.current.emissiveIntensity = isOn
        ? Math.sin(t * 2.5) > 0
          ? 2.5
          : 0.2
        : 0;
    if (led1.current)
      led1.current.emissiveIntensity = isOn
        ? Math.sin(t * 3.5 + 1.2) > 0
          ? 2.5
          : 0.2
        : 0;
    if (led2.current)
      led2.current.emissiveIntensity = isOn
        ? Math.sin(t * 1.8 + 2.4) > 0
          ? 2.5
          : 0.2
        : 0;
  });
  return (
    <group position={position} onPointerOver={onHover} onPointerOut={onLeave}>
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.075, 0.24]} />
        <meshStandardMaterial color="#0d1117" roughness={0.3} metalness={0.7} />
      </mesh>
      {[-0.13, 0.13].map((x, i) => (
        <mesh key={i} position={[x, 0.21, -0.09]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.36, 6]} />
          <meshStandardMaterial
            color="#1f2937"
            roughness={0.5}
            metalness={0.8}
          />
        </mesh>
      ))}
      <mesh position={[-0.11, 0.042, 0.122]}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshStandardMaterial
          ref={led0}
          color="#4ade80"
          emissive="#4ade80"
          emissiveIntensity={isOn ? 2 : 0}
        />
      </mesh>
      <mesh position={[-0.04, 0.042, 0.122]}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshStandardMaterial
          ref={led1}
          color="#4ade80"
          emissive="#4ade80"
          emissiveIntensity={isOn ? 2 : 0}
        />
      </mesh>
      <mesh position={[0.04, 0.042, 0.122]}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshStandardMaterial
          ref={led2}
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={isOn ? 2 : 0}
        />
      </mesh>
      {isOn && (
        <pointLight
          position={[0, 0.1, 0.2]}
          intensity={0.2}
          color="#4ade80"
          distance={1}
        />
      )}
      <group position={[0, 0.8, 0]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Router WiFi"}
          watts={appData?.watts || 12}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

function Laptop({
  position,
  rotation = [0, 0, 0],
  isOn,
  appData,
  onHover,
  onLeave,
  hovered,
}) {
  const screenRef = useRef();
  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    screenRef.current.emissiveIntensity = isOn
      ? 0.5 + Math.sin(clock.getElapsedTime() * 0.25) * 0.04
      : 0;
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.52, 0.022, 0.36]} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>
      <group position={[0, 0.195, -0.155]} rotation={[-0.52, 0, 0]}>
        <mesh onPointerOver={onHover} onPointerOut={onLeave}>
          <boxGeometry args={[0.52, 0.33, 0.018]} />
          <meshStandardMaterial
            color="#0d1117"
            roughness={0.15}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.48, 0.3]} />
          <meshStandardMaterial
            ref={screenRef}
            color={isOn ? "#0a1628" : "#050a10"}
            emissive={isOn ? "#2563eb" : "#000"}
            emissiveIntensity={isOn ? 0.5 : 0}
            roughness={0}
          />
        </mesh>
        {isOn &&
          [0.07, 0.01, -0.05, -0.11].map((y, i) => (
            <mesh key={i} position={[-0.06 + (i % 2) * 0.04, y, 0.014]}>
              <planeGeometry args={[0.2 - i * 0.02, 0.013]} />
              <meshStandardMaterial
                color="#4ade80"
                emissive="#4ade80"
                emissiveIntensity={0.9}
                transparent
                opacity={0.75}
              />
            </mesh>
          ))}
      </group>
      <mesh position={[0, 0.013, 0.03]}>
        <boxGeometry args={[0.48, 0.005, 0.28]} />
        <meshStandardMaterial color="#1f2937" roughness={0.85} />
      </mesh>
      <group position={[0, 0.8, 0]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Portátil"}
          watts={appData?.watts || 65}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

function FloorLamp({ position, isOn }) {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    lightRef.current.intensity = isOn
      ? 1.3 + Math.sin(clock.getElapsedTime() * 2.5) * 0.1
      : 0;
  });
  return (
    <group position={[position[0], ROOM.floorY, position[2]]}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.06, 20]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 2.0, 10]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>
      <mesh position={[0, 2.1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.28, 0.4, 20, 1, true]} />
        <meshStandardMaterial color="#2a2017" roughness={0.5} side={2} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color={isOn ? "#fffbeb" : "#1f2937"}
          emissive={isOn ? "#fbbf24" : "#000"}
          emissiveIntensity={isOn ? 2 : 0}
        />
      </mesh>
      {isOn && (
        <pointLight
          ref={lightRef}
          position={[0, 1.9, 0]}
          intensity={1.3}
          color="#fff8e7"
          distance={6}
          castShadow
        />
      )}
    </group>
  );
}

// ══════════════════════════════════════════════
//  NUEVOS OBJETOS — Microondas, Lavadora, CPAP
// ══════════════════════════════════════════════
function Microwave({ position, isOn, appData, onHover, onLeave, hovered }) {
  return (
    <group position={position} onPointerOver={onHover} onPointerOut={onLeave}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.5, 0.5]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Puerta vidrio */}
      <mesh position={[-0.15, 0, 0.255]}>
        <boxGeometry args={[0.52, 0.42, 0.01]} />
        <meshPhysicalMaterial
          color={isOn ? "#fbbf24" : "#0d1117"}
          emissive={isOn ? "#fbbf24" : "#000"}
          emissiveIntensity={isOn ? 0.5 : 0}
          transparent
          opacity={0.6}
          roughness={0.1}
          transmission={0.6}
        />
      </mesh>
      {/* Panel control */}
      <mesh position={[0.3, 0, 0.255]}>
        <boxGeometry args={[0.25, 0.42, 0.01]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} />
      </mesh>
      {/* Display */}
      <mesh position={[0.3, 0.12, 0.26]}>
        <boxGeometry args={[0.18, 0.06, 0.005]} />
        <meshStandardMaterial
          color="#001400"
          emissive={isOn ? "#4ade80" : "#000"}
          emissiveIntensity={isOn ? 1 : 0}
        />
      </mesh>
      {/* Botones */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            0.22 + (i % 2) * 0.08,
            -0.05 - Math.floor(i / 2) * 0.08,
            0.26,
          ]}
        >
          <boxGeometry args={[0.04, 0.04, 0.008]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
      {isOn && (
        <pointLight
          position={[-0.15, 0, 0.5]}
          intensity={0.4}
          color="#fbbf24"
          distance={2}
        />
      )}
      <group position={[0, 0.8, 0]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Microondas"}
          watts={appData?.watts || 1200}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

function WashingMachine({
  position,
  isOn,
  appData,
  onHover,
  onLeave,
  hovered,
}) {
  const drumRef = useRef();
  useFrame((_, delta) => {
    if (!drumRef.current) return;
    if (isOn) drumRef.current.rotation.z += delta * 3;
  });
  return (
    <group position={position} onPointerOver={onHover} onPointerOut={onLeave}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 1.6, 0.95]} />
        <meshStandardMaterial
          color="#e5e7eb"
          roughness={0.25}
          metalness={0.75}
        />
      </mesh>
      {/* Puerta circular */}
      <mesh position={[0, 0.1, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.06, 12, 24]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 0.485]}>
        <circleGeometry args={[0.35, 24]} />
        <meshPhysicalMaterial
          color={isOn ? "#60a5fa" : "#0d1117"}
          emissive={isOn ? "#3b82f6" : "#000"}
          emissiveIntensity={isOn ? 0.3 : 0}
          transparent
          opacity={0.4}
          roughness={0.1}
          transmission={0.5}
        />
      </mesh>
      <mesh ref={drumRef} position={[0, 0.05, 0.37]}>
        <ringGeometry args={[0.12, 0.22, 12]} />
        <meshStandardMaterial color="#4b5563" transparent opacity={0.3} />
      </mesh>
      {/* Panel superior */}
      <mesh position={[0, 0.78, 0.4]}>
        <boxGeometry args={[1.0, 0.06, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>
      {/* Perillas */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.82, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      ))}
      <group position={[0, 1.0, 0]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Lavadora"}
          watts={appData?.watts || 500}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

function MiniSplit({ position, isOn, appData, onHover, onLeave, hovered }) {
  return (
    <group position={position} onPointerOver={onHover} onPointerOut={onLeave}>
      <mesh castShadow>
        <boxGeometry args={[2.2, 0.55, 0.4]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Rejilla */}
      <mesh position={[0, -0.1, 0.2]}>
        <boxGeometry args={[2.0, 0.06, 0.015]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.4} />
      </mesh>
      {/* Display */}
      <mesh position={[0.55, 0.08, 0.13]}>
        <boxGeometry args={[0.12, 0.04, 0.005]} />
        <meshStandardMaterial
          color="#0d1117"
          emissive={isOn ? "#4ade80" : "#000"}
          emissiveIntensity={isOn ? 0.8 : 0}
        />
      </mesh>
      {isOn && (
        <pointLight
          position={[0, -0.3, 0.5]}
          intensity={0.3}
          color="#22d3ee"
          distance={3}
        />
      )}
      <group position={[0, 0.6, 0]}>
        <ApplianceTooltip
          visible={hovered}
          name={appData?.name || "Aire acondicionado"}
          watts={appData?.watts || 900}
          hours={appData?.hoursAvailable || 0}
          costCOP={appData?.costCOP || 0}
          costUSD={appData?.costUSD || 0}
          isOn={isOn}
        />
      </group>
    </group>
  );
}

function SecurityCamera({ position, isOn }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry
          args={[0.04, 0.04, 0.04, 12]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <meshStandardMaterial color="#0d1117" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color={isOn ? "#ef4444" : "#374151"}
          emissive={isOn ? "#ef4444" : "#000"}
          emissiveIntensity={isOn ? 2 : 0}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════
//  ESCENA COMPLETA
// ══════════════════════════════════════════════
export default function HomeSimulation({ visible, applianceData, energyKWh }) {
  const [hovered, setHovered] = useState(null);
  if (!visible) return null;

  const getApp = (id) => applianceData?.find((a) => a.id === id);
  const isOn = (id) => (getApp(id)?.hoursAvailable || 0) >= 0.1;
  const energyLevel = Math.min(1, energyKWh / 0.05);
  const hover = (id) => () => setHovered(id);
  const leave = () => setHovered(null);

  return (
    <group>
      <KeyboardCameraControls />
      <Room />
      <EnergyCable hasEnergy={energyKWh > 0} energyLevel={energyLevel} />

      {/* ── SALA DE ESTAR ── */}
      <Sofa position={[-2, ROOM.floorY, -1]} />
      <CoffeeTable position={[-2, ROOM.floorY, -2.5]} />
      <FloorLamp position={[-5, 0, -0.5]} isOn={isOn("led_bulb")} />

      {/* ── ZONA TV ── */}
      <TVStand position={[-2, ROOM.floorY, WALLS.back + 0.4]} />
      <Television
        position={[-2, ROOM.floorY + 1.5, WALLS.back + 0.4]}
        isOn={isOn("tv_led")}
        appData={getApp("tv_led")}
        onHover={hover("tv_led")}
        onLeave={leave}
        hovered={hovered === "tv_led"}
      />

      {/* ── ESCRITORIO ── */}
      <Desk position={[5, ROOM.floorY + 0.8, WALLS.back + 0.6]} />
      <Laptop
        position={[5.2, ROOM.floorY + 0.88, WALLS.back + 0.6]}
        rotation={[0, -0.3, 0]}
        isOn={isOn("laptop")}
        appData={getApp("laptop")}
        onHover={hover("laptop")}
        onLeave={leave}
        hovered={hovered === "laptop"}
      />
      <Router
        position={[4.0, ROOM.floorY + 0.92, WALLS.back + 0.8]}
        isOn={isOn("router")}
        appData={getApp("router")}
        onHover={hover("router")}
        onLeave={leave}
        hovered={hovered === "router"}
      />

      {/* ── COCINA (derecha, junto a la nevera) ── */}
      <LargeRefrigerator
        position={[8.5, 0, WALLS.back + 0.6]}
        isOn={isOn("fridge")}
        appData={getApp("fridge")}
        onHover={hover("fridge")}
        onLeave={leave}
        hovered={hovered === "fridge"}
      />

      {/* ── COCINA — pegada a pared derecha, junto a la nevera ── */}
      <KitchenCounter
        position={[WALLS.right - 0.5, ROOM.floorY + 0.5, WALLS.back + 2.5]}
      />
      <Microwave
        position={[WALLS.right - 0.5, ROOM.floorY + 1.3, WALLS.back + 2.5]}
        isOn={isOn("microwave")}
        appData={getApp("microwave")}
        onHover={hover("microwave")}
        onLeave={leave}
        hovered={hovered === "microwave"}
      />

      {/* ── LAVANDERÍA — pegada a pared derecha, más al frente ── */}
      <WashingMachine
        position={[WALLS.right - 0.7, ROOM.floorY + 0.8, WALLS.back + 4.5]}
        isOn={isOn("washing")}
        appData={getApp("washing")}
        onHover={hover("washing")}
        onLeave={leave}
        hovered={hovered === "washing"}
      />

      {/* Aire acondicionado pared fondo */}
      <MiniSplit
        position={[3, 2.8, WALLS.back + 0.25]}
        isOn={isOn("mini_ac")}
        appData={getApp("mini_ac")}
        onHover={hover("mini_ac")}
        onLeave={leave}
        hovered={hovered === "mini_ac"}
      />

      {/* Cámara de seguridad en esquina */}
      <SecurityCamera
        position={[WALLS.right - 0.3, ROOM.height - 0.6, WALLS.back + 0.3]}
        isOn={isOn("security_system")}
      />

      {/* ── TECHO ── */}
      <LEDBulb
        position={[-4, ROOM.height - 0.3, 0]}
        isOn={isOn("led_bulb")}
        appData={getApp("led_bulb")}
        onHover={hover("led_bulb")}
        onLeave={leave}
        hovered={hovered === "led_bulb"}
      />
      <LEDBulb
        position={[4, ROOM.height - 0.3, 0]}
        isOn={isOn("led_panel")}
        appData={getApp("led_panel")}
        onHover={hover("led_panel")}
        onLeave={leave}
        hovered={hovered === "led_panel"}
      />
      <CeilingFan
        position={[0, ROOM.height - 0.4, -2]}
        isOn={isOn("fan")}
        appData={getApp("fan")}
        onHover={hover("fan")}
        onLeave={leave}
        hovered={hovered === "fan"}
      />

      <ambientLight intensity={isOn("led_bulb") ? 0.35 : 0.1} color="#fffbeb" />
      {isOn("tv_led") && (
        <pointLight
          position={[-2, 0, WALLS.back + 2]}
          intensity={0.6}
          color="#1e40af"
          distance={6}
        />
      )}
    </group>
  );
}

function Desk({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.06, 0.9]} />
        <meshStandardMaterial color="#2a1810" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.084, 0.45]}>
        <boxGeometry args={[2.2, 0.008, 0.008]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#1e40af"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0.9, -0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.85]} />
        <meshStandardMaterial color="#1e1308" roughness={0.4} />
      </mesh>
      {[
        [-1.0, -0.4, -0.4],
        [-1.0, -0.4, 0.4],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#1e1308" metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function KitchenCounter({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.0, 0.7]} />
        <meshStandardMaterial color="#1e2a3a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.51, 0]}>
        <boxGeometry args={[1.22, 0.04, 0.72]} />
        <meshStandardMaterial color="#0d1117" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* Frente con líneas decorativas */}
      {[0.2, -0.2].map((y, i) => (
        <mesh key={i} position={[0, y, 0.35]}>
          <boxGeometry args={[1.15, 0.02, 0.01]} />
          <meshStandardMaterial color="#0d1117" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
