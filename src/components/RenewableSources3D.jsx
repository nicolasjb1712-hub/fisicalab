import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ══════════════════════════════════════════════
//  PANEL SOLAR — solo visible cuando sourceId === 'solar'
// ══════════════════════════════════════════════
function SolarPanel({ position, active }) {
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    glowRef.current.intensity = active
      ? 1.5 + Math.sin(clock.getElapsedTime() * 1.5) * 0.3
      : 0;
  });

  return (
    <group position={position} rotation={[-0.25, 0, 0]}>
      {/* Marco externo */}
      <mesh castShadow>
        <boxGeometry args={[3.4, 0.1, 2.2]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* Células 5×3 */}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) =>
        [-0.72, 0, 0.72].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.06, z]}>
            <boxGeometry args={[0.52, 0.025, 0.58]} />
            <meshStandardMaterial
              color={active ? "#1e3a5f" : "#0f172a"}
              emissive={active ? "#2563eb" : "#000"}
              emissiveIntensity={active ? 0.3 + (i + j) * 0.02 : 0}
              metalness={0.6}
              roughness={0.15}
            />
          </mesh>
        )),
      )}
      {/* Líneas de rejilla horizontal */}
      {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
        <mesh key={`h${i}`} position={[x, 0.08, 0]}>
          <boxGeometry args={[0.02, 0.01, 2.1]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} />
        </mesh>
      ))}
      {/* Líneas rejilla vertical */}
      {[-0.36, 0.36].map((z, i) => (
        <mesh key={`v${i}`} position={[0, 0.08, z]}>
          <boxGeometry args={[3.3, 0.01, 0.02]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} />
        </mesh>
      ))}
      {/* Soporte doble pegado a la mesa */}
      {[-0.9, 0.9].map((x, i) => (
        <mesh
          key={`s${i}`}
          position={[x, -0.35, -0.55]}
          rotation={[0.25, 0, 0]}
        >
          <cylinderGeometry args={[0.045, 0.055, 0.75, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
      ))}
      {/* Base horizontal que se apoya en la mesa */}
      <mesh position={[0, -0.6, -0.4]}>
        <boxGeometry args={[2.0, 0.05, 0.15]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>

      {active && (
        <>
          <pointLight
            ref={glowRef}
            position={[0, 1.0, 0.5]}
            intensity={1.5}
            color="#fbbf24"
            distance={7}
          />
          <SunEffect position={[0, 3.2, 2.0]} />
        </>
      )}
    </group>
  );
}

function SunEffect({ position }) {
  const raysRef = useRef();
  useFrame(({ clock }) => {
    if (raysRef.current)
      raysRef.current.rotation.z = clock.getElapsedTime() * 0.22;
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fbbf24"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight intensity={1.8} color="#fbbf24" distance={12} />
      <group ref={raysRef}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * Math.PI) / 4;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.38, 0.045, 0.02]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fbbf24"
                emissiveIntensity={2.2}
                transparent
                opacity={0.75}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════
//  TURBINA EÓLICA — base al nivel de la mesa
// ══════════════════════════════════════════════
function WindTurbine({ position, active }) {
  const bladesRef = useRef();
  const speedRef = useRef(0);
  const windRef = useRef([]);

  useFrame((_, delta) => {
    const target = active ? 2.4 : 0;
    speedRef.current += (target - speedRef.current) * 0.015;
    if (bladesRef.current)
      bladesRef.current.rotation.z += speedRef.current * delta;

    windRef.current.forEach((p, i) => {
      if (!p) return;
      p.position.x -= delta * (1.2 + i * 0.25) * (active ? 1 : 0.05);
      if (p.position.x < position[0] - 4) p.position.x = position[0] + 4;
    });
  });

  // La base empieza exactamente en Y = position[1] (nivel de la mesa)
  return (
    <group position={position}>
      {/* Base de hormigón — apoyada en la mesa */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.24, 20]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.65}
          metalness={0.35}
        />
      </mesh>
      {/* Placa inferior */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.04, 20]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Torre cónica — empieza desde Y=0.24 (tope de la base) */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.25, 7.6, 20]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.22}
          metalness={0.52}
        />
      </mesh>
      {/* Línea vertical decorativa */}
      <mesh position={[0.14, 4.0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 7.5, 6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* Góndola */}
      <mesh position={[0, 7.95, 0.28]} castShadow>
        <boxGeometry args={[1.1, 0.52, 0.58]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.18}
          metalness={0.55}
        />
      </mesh>
      {/* Cubierta trasera góndola */}
      <mesh position={[-0.38, 7.97, 0.28]}>
        <boxGeometry args={[0.32, 0.28, 0.52]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Cubo del rotor */}
      <mesh position={[0, 7.95, 0.62]}>
        <cylinderGeometry
          args={[0.17, 0.17, 0.21, 20]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <meshStandardMaterial
          color="#d1d5db"
          roughness={0.18}
          metalness={0.72}
        />
      </mesh>
      {/* Cono nariz rotor */}
      <mesh position={[0, 7.95, 0.76]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.17, 0.19, 20]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.18}
          metalness={0.72}
        />
      </mesh>

      {/* 3 Aspas modernas */}
      <group ref={bladesRef} position={[0, 7.95, 0.82]}>
        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          return (
            <group key={i} rotation={[0, 0, angle]}>
              {/* Perfil alar — más ancho en raíz, estrecho en punta */}
              <mesh position={[0, 2.1, 0]}>
                <boxGeometry args={[0.27, 4.2, 0.055]} />
                <meshStandardMaterial
                  color={active ? "#f8fafc" : "#e2e8f0"}
                  roughness={0.28}
                  metalness={0.42}
                  emissive={active ? "#e0f2fe" : "#000"}
                  emissiveIntensity={active ? 0.04 : 0}
                />
              </mesh>
              {/* Refuerzo borde de ataque */}
              <mesh position={[-0.1, 2.1, 0]}>
                <boxGeometry args={[0.055, 4.15, 0.038]} />
                <meshStandardMaterial
                  color="#cbd5e1"
                  roughness={0.18}
                  metalness={0.62}
                />
              </mesh>
              {/* Punta */}
              <mesh position={[0, 4.25, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.11, 0.38, 8]} />
                <meshStandardMaterial color="#f1f5f9" roughness={0.28} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* LED señalización tope */}
      <mesh position={[0, 8.12, 0.28]}>
        <sphereGeometry args={[0.042, 10, 10]} />
        <meshStandardMaterial
          color={active ? "#ef4444" : "#374151"}
          emissive={active ? "#ef4444" : "#000"}
          emissiveIntensity={active ? 3.2 : 0}
        />
      </mesh>

      {/* Plataforma de mantenimiento */}
      <mesh position={[0, 7.56, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 20]} />
        <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.6} />
      </mesh>

      {active && (
        <pointLight
          position={[0, 7.2, 1]}
          intensity={0.7}
          color="#bfdbfe"
          distance={7}
        />
      )}

      {/* Partículas de viento */}
      {active &&
        Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => (windRef.current[i] = el)}
            position={[-3 + i * 0.9, 7.6 + (i % 3) * 0.5, 1.6 + i * 0.18]}
          >
            <boxGeometry args={[0.45, 0.016, 0.016]} />
            <meshStandardMaterial
              color="#bfdbfe"
              emissive="#bfdbfe"
              emissiveIntensity={1.8}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
    </group>
  );
}

// ══════════════════════════════════════════════
//  PLANTA HIDROELÉCTRICA — mejorada
// ══════════════════════════════════════════════
function HydroPlant({ position, active }) {
  const waterParticles = useRef([]);
  const turbineRef = useRef();
  const foamRef = useRef();
  const waveRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (turbineRef.current) {
      turbineRef.current.rotation.z += active ? 0.065 : 0.004;
    }
    if (foamRef.current) {
      foamRef.current.material.opacity = active
        ? 0.5 + Math.sin(t * 4.5) * 0.18
        : 0.1;
    }
    if (waveRef.current) {
      waveRef.current.material.emissiveIntensity = active
        ? 0.25 + Math.sin(t * 2) * 0.1
        : 0.04;
    }
    waterParticles.current.forEach((p, i) => {
      if (!p) return;
      const speed = active ? 0.09 + (i % 3) * 0.04 : 0.008;
      p.position.y -= speed;
      if (p.position.y < -1.8) {
        p.position.y = 0.6;
        p.position.x = -0.18 + (i % 5) * 0.09;
      }
    });
  });

  return (
    <group position={position}>
      {/* ── Terreno/colina detrás de la presa ── */}
      {/* En lugar de conos flotantes, usamos cajas y cilindros
          apoyados en el piso formando una colina */}
      <mesh position={[0, -0.8, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 2.0, 1.8]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Capa de tierra encima */}
      <mesh position={[0, 0.12, -1.2]}>
        <boxGeometry args={[5.0, 0.25, 1.8]} />
        <meshStandardMaterial
          color="#4b5563"
          roughness={0.98}
          metalness={0.02}
        />
      </mesh>
      {/* Loma izquierda */}
      <mesh position={[-2.2, 0.0, -1.0]} castShadow>
        <boxGeometry args={[1.2, 1.8, 1.6]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Loma derecha */}
      <mesh position={[2.2, 0.0, -1.0]} castShadow>
        <boxGeometry args={[1.2, 1.8, 1.6]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Tope redondeado loma izquierda */}
      <mesh position={[-2.2, 0.95, -1.0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 12]} />
        <meshStandardMaterial
          color="#4b5563"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
      {/* Tope redondeado loma derecha */}
      <mesh position={[2.2, 0.95, -1.0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 12]} />
        <meshStandardMaterial
          color="#4b5563"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* ── PRESA principal ── */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3.6, 3.0, 0.65]} />
        <meshStandardMaterial
          color="#6b7280"
          roughness={0.62}
          metalness={0.32}
        />
      </mesh>
      {/* Textura frontal */}
      <mesh position={[0, 0.5, 0.33]}>
        <boxGeometry args={[3.55, 2.95, 0.02]} />
        <meshStandardMaterial
          color="#9ca3af"
          roughness={0.48}
          metalness={0.42}
        />
      </mesh>
      {/* Franjas horizontales */}
      {[-0.8, -0.2, 0.4, 1.0].map((y, i) => (
        <mesh key={i} position={[0, y, 0.34]}>
          <boxGeometry args={[3.5, 0.025, 0.01]} />
          <meshStandardMaterial color="#7f8c9a" roughness={0.5} />
        </mesh>
      ))}
      {/* Tapa superior */}
      <mesh position={[0, 2.06, 0.2]} castShadow>
        <boxGeometry args={[3.7, 0.18, 1.1]} />
        <meshStandardMaterial
          color="#4b5563"
          roughness={0.38}
          metalness={0.52}
        />
      </mesh>
      {/* Barandal tope */}
      {[-1.4, -0.7, 0, 0.7, 1.4].map((x, i) => (
        <mesh key={i} position={[x, 2.38, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      <mesh position={[0, 2.6, 0.2]}>
        <boxGeometry args={[3.6, 0.04, 0.04]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Embalse (agua detrás) ── */}
      <mesh position={[0, 1.7, -0.9]}>
        <boxGeometry args={[3.4, 0.45, 1.2]} />
        <meshStandardMaterial
          color={active ? "#1d4ed8" : "#1e3a5f"}
          emissive={active ? "#2563eb" : "#1e3a5f"}
          emissiveIntensity={active ? 0.22 : 0.05}
          transparent
          opacity={0.82}
          roughness={0}
          metalness={0.3}
        />
      </mesh>
      <mesh
        ref={waveRef}
        position={[0, 1.94, -0.9]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3.4, 1.2]} />
        <meshStandardMaterial
          color={active ? "#3b82f6" : "#1e3a5f"}
          emissive={active ? "#2563eb" : "#000"}
          emissiveIntensity={active ? 0.25 : 0.04}
          transparent
          opacity={0.72}
          roughness={0}
          metalness={0.5}
        />
      </mesh>

      {/* ── Compuertas ── */}
      {[-0.65, 0.65].map((x, i) => (
        <group key={i} position={[x, 0.0, 0.34]}>
          <mesh>
            <boxGeometry args={[0.52, 1.1, 0.06]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.82}
              roughness={0.28}
            />
          </mesh>
          <mesh position={[0, 0, 0.038]}>
            <boxGeometry args={[0.46, 1.02, 0.02]} />
            <meshStandardMaterial
              color={active ? "#1d4ed8" : "#0f172a"}
              emissive={active ? "#3b82f6" : "#000"}
              emissiveIntensity={active ? 0.42 : 0}
              transparent
              opacity={0.82}
            />
          </mesh>
          <mesh position={[0, 0.58, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.02, 8, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* ── Caída de agua ── */}
      <mesh position={[0, 0.05, 0.44]}>
        <boxGeometry args={[1.15, 2.2, 0.04]} />
        <meshStandardMaterial
          color={active ? "#3b82f6" : "#1e3a5f"}
          emissive={active ? "#22d3ee" : "#000"}
          emissiveIntensity={active ? 0.52 : 0}
          transparent
          opacity={active ? 0.68 : 0.18}
          roughness={0}
          metalness={0.1}
        />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (waterParticles.current[i] = el)}
          position={[
            -0.18 + (i % 5) * 0.09,
            0.6 - Math.floor(i / 5) * 0.55,
            0.46,
          ]}
        >
          <sphereGeometry args={[0.038, 6, 6]} />
          <meshStandardMaterial
            color={active ? "#93c5fd" : "#1e3a5f"}
            emissive={active ? "#3b82f6" : "#000"}
            emissiveIntensity={active ? 2.2 : 0}
            transparent
            opacity={active ? 0.82 : 0.18}
          />
        </mesh>
      ))}

      {/* ── Canal de descarga ── */}
      <mesh position={[0, -1.12, 0.6]}>
        <boxGeometry args={[2.2, 0.32, 0.55]} />
        <meshStandardMaterial
          color="#4b5563"
          roughness={0.68}
          metalness={0.32}
        />
      </mesh>
      <mesh position={[0, -1.02, 0.62]}>
        <boxGeometry args={[2.1, 0.1, 0.5]} />
        <meshStandardMaterial
          color={active ? "#3b82f6" : "#1e3a5f"}
          emissive={active ? "#22d3ee" : "#000"}
          emissiveIntensity={active ? 0.3 : 0}
          transparent
          opacity={0.75}
          roughness={0}
        />
      </mesh>

      {/* ── Espuma ── */}
      <mesh
        ref={foamRef}
        position={[0, -1.02, 0.52]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2.0, 0.55]} />
        <meshStandardMaterial
          color="#bfdbfe"
          emissive="#93c5fd"
          emissiveIntensity={active ? 0.5 : 0}
          transparent
          opacity={active ? 0.5 : 0.08}
          roughness={0}
        />
      </mesh>

      {/* ── Casa de máquinas ── */}
      <mesh position={[0, -1.48, 0.52]} castShadow>
        <boxGeometry args={[2.4, 0.92, 0.95]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.52}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[0, -0.98, 0.52]}>
        <boxGeometry args={[2.5, 0.09, 1.0]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.6} />
      </mesh>
      {[-0.72, 0, 0.72].map((x, i) => (
        <mesh key={i} position={[x, -1.48, 1.0]}>
          <boxGeometry args={[0.3, 0.28, 0.01]} />
          <meshStandardMaterial
            color={active ? "#fef3c7" : "#1f2937"}
            emissive={active ? "#fbbf24" : "#000"}
            emissiveIntensity={active ? 0.9 : 0}
          />
        </mesh>
      ))}

      {/* ── Turbina hidráulica ── */}
      <group ref={turbineRef} position={[0, -1.48, 0.65]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.14, Math.sin(angle) * 0.14, 0]}
            >
              <boxGeometry args={[0.09, 0.26, 0.04]} />
              <meshStandardMaterial
                color={active ? "#3b82f6" : "#374151"}
                emissive={active ? "#3b82f6" : "#000"}
                emissiveIntensity={active ? 0.7 : 0}
                metalness={0.82}
                roughness={0.18}
              />
            </mesh>
          );
        })}
        <mesh>
          <cylinderGeometry
            args={[0.06, 0.06, 0.06, 12]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <meshStandardMaterial
            color="#e5e7eb"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* ── Pilones alta tensión ── */}
      {[2.0, -2.0].map((x, i) => (
        <group key={i} position={[x, -0.5, 0.35]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.06, 3.6, 8]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.72}
              roughness={0.32}
            />
          </mesh>
          {[1.6, 2.6].map((y, j) => (
            <mesh key={j} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.72, 0.03, 0.03]} />
              <meshStandardMaterial color="#6b7280" metalness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 2.75, 0]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial
              color={active ? "#fbbf24" : "#374151"}
              emissive={active ? "#fbbf24" : "#000"}
              emissiveIntensity={active ? 2.2 : 0}
            />
          </mesh>
        </group>
      ))}

      {active && (
        <pointLight
          position={[0, 0.2, 1.4]}
          intensity={0.9}
          color="#3b82f6"
          distance={6}
          castShadow
        />
      )}
    </group>
  );
}

// ══════════════════════════════════════════════
//  RED / FÓSIL — torre eléctrica con chimeneas
// ══════════════════════════════════════════════
function GridIndicator({ position, sourceId }) {
  const smokeRef = useRef([]);

  useFrame(({ clock }) => {
    smokeRef.current.forEach((s, i) => {
      if (!s) return;
      s.position.y += 0.012;
      if (s.material) {
        s.material.opacity = Math.max(
          0,
          0.38 - (s.position.y - position[1] - 0.3) * 0.14,
        );
      }
      if (s.position.y > position[1] + 4.2) {
        s.position.y = position[1] + 0.3;
        s.position.x = position[0] + (-0.12 + (i % 3) * 0.12);
      }
    });
  });

  const isFossil = sourceId === "fossil";

  return (
    <group position={position}>
      {/* Torres eléctricas */}
      {[-0.5, 0.5].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.07, 4.0, 8]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {[1.6, 2.8].map((y, j) => (
            <mesh key={j} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.75, 0.03, 0.03]} />
              <meshStandardMaterial color="#6b7280" metalness={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 3.05, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color="#fb923c"
              emissive="#fb923c"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}

      {/* Chimeneas si es fósil */}
      {isFossil &&
        [-0.35, 0.35].map((x, i) => (
          <mesh key={i} position={[x, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.17, 2.8, 12]} />
            <meshStandardMaterial
              color="#374151"
              roughness={0.5}
              metalness={0.4}
            />
          </mesh>
        ))}

      {/* Humo */}
      {isFossil &&
        Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => (smokeRef.current[i] = el)}
            position={[
              position[0] + (-0.12 + (i % 3) * 0.12),
              position[1] + 2.8 + i * 0.3,
              position[2],
            ]}
          >
            <sphereGeometry args={[0.16 + i * 0.028, 8, 8]} />
            <meshStandardMaterial color="#4b5563" transparent opacity={0.32} />
          </mesh>
        ))}

      <pointLight
        position={[0, 2.5, 0]}
        intensity={0.35}
        color={isFossil ? "#f97316" : "#fb923c"}
        distance={5}
      />
    </group>
  );
}

// ══════════════════════════════════════════════
//  INDICADOR DE FUENTE
// ══════════════════════════════════════════════
function SourceIndicator({ sourceId, position }) {
  const colors = {
    solar: "#fbbf24",
    wind: "#22d3ee",
    hydro: "#3b82f6",
    mixed: "#fb923c",
    fossil: "#6b7280",
  };
  const h2Colors = {
    solar: "#4ade80",
    wind: "#4ade80",
    hydro: "#4ade80",
    mixed: "#facc15",
    fossil: "#9ca3af",
  };
  const color = colors[sourceId] || colors.mixed;
  const h2Color = h2Colors[sourceId] || "#9ca3af";
  const pulse = useRef();

  useFrame(({ clock }) => {
    if (pulse.current) {
      pulse.current.material.emissiveIntensity =
        0.45 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.5, 0.62, 0.1]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.052]}>
        <boxGeometry args={[1.44, 0.56, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.42}
        />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <boxGeometry args={[1.38, 0.5, 0.01]} />
        <meshStandardMaterial color="#040810" />
      </mesh>
      <mesh ref={pulse} position={[-0.55, 0, 0.08]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={h2Color}
          emissive={h2Color}
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[-0.55, 0, 0.3]}
        intensity={0.4}
        color={h2Color}
        distance={1.3}
      />
    </group>
  );
}

// ══════════════════════════════════════════════
//  CONTROLADOR PRINCIPAL
//  Solo muestra el modelo de la fuente activa
// ══════════════════════════════════════════════
export default function RenewableSources3D({ sourceId }) {
  return (
    <group>
      {/* Panel solar — solo si sourceId === 'solar' */}
      {sourceId === "solar" && (
        <SolarPanel position={[-3, 5.8, -2]} active={true} />
      )}

      {/* Turbina eólica — solo si sourceId === 'wind' */}
      {sourceId === "wind" && (
        <WindTurbine position={[-11, -5, 0]} active={true} />
      )}

      {sourceId === "hydro" && (
        <HydroPlant position={[-11, -1.8, 0]} active={true} />
      )}

      {/* Red o fósil */}
      {(sourceId === "mixed" || sourceId === "fossil") && (
        <GridIndicator position={[7, -2.2, -4]} sourceId={sourceId} />
      )}

      {/* Indicador siempre visible */}
      <SourceIndicator sourceId={sourceId} position={[0, 4.5, -3]} />
    </group>
  );
}
