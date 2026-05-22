import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import Tank from "./Tank";
import Electrodes from "./Electrodes";
import Bubbles from "./Bubbles";
import PowerSupply from "./PowerSupply";
import Cables from "./Cables";
import Steam from "./Steam";
import DynamicLighting from "./DynamicLighting";
import MultimeterScreen from "./MultimeterScreen";
import LabEnvironment from "./LabEnvironment";
import HomeSimulation from "./HomeSimulation";
import HomeCameraController from "./HomeCameraController";
import { calcularConsumo, calcularPilaCombustible } from "../physics/hydrogen";
import RenewableSources3D from "./RenewableSources3D";

export default function Scene3D({ params, results }) {
  const [homeMode, setHomeMode] = useState(false);

  const fuelCell = calcularPilaCombustible(results.massH2 / 1000);
  const consumption = calcularConsumo(fuelCell.energyElecKWh);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Badge H2 */}
      <div style={badge("#3b82f6", "left")}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#3b82f6",
            fontFamily: "var(--font-mono)",
          }}
        >
          {results.massH2.toFixed(5)} g
        </div>
        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
          H₂ producido — cátodo (−)
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#3b82f6",
            marginTop: 2,
            fontFamily: "var(--font-mono)",
          }}
        >
          2H₂O + 2e⁻ → H₂ + 2OH⁻
        </div>
      </div>

      {/* Badge O2 */}
      <div style={badge("#ef4444", "right")}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#ef4444",
            fontFamily: "var(--font-mono)",
            textAlign: "right",
          }}
        >
          {results.massO2.toFixed(5)} g
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#9ca3af",
            marginTop: 3,
            textAlign: "right",
          }}
        >
          O₂ producido — ánodo (+)
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#ef4444",
            marginTop: 2,
            fontFamily: "var(--font-mono)",
            textAlign: "right",
          }}
        >
          2H₂O → O₂ + 4H⁺ + 4e⁻
        </div>
      </div>

      {/* Badges métricas inferiores */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        {[
          {
            label: "Corriente",
            value: results.current.toFixed(3),
            unit: "A",
            color: "#fbbf24",
          },
          {
            label: "Potencia",
            value: results.power.toFixed(2),
            unit: "W",
            color: "#4ade80",
          },
          {
            label: "Voltaje",
            value: params.voltage.toFixed(1),
            unit: "V",
            color: "#818cf8",
          },
        ].map((b) => (
          <div
            key={b.label}
            style={{
              background: "rgba(13,16,23,.85)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 8,
              padding: "6px 14px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: b.color }}>
              {b.value}
              <span style={{ fontSize: 10, marginLeft: 2, color: "#6b7280" }}>
                {b.unit}
              </span>
            </div>
            <div style={{ fontSize: 9, color: "#4b5563", marginTop: 2 }}>
              {b.label}
            </div>
          </div>
        ))}
      </div>

      {/* Botón home mode */}
      <button
        onClick={() => setHomeMode((m) => !m)}
        style={{
          position: "absolute",
          top: 58,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          background: homeMode ? "rgba(129,140,248,.2)" : "rgba(13,16,23,.85)",
          border: `1px solid ${homeMode ? "#818cf8" : "rgba(255,255,255,.1)"}`,
          borderRadius: 20,
          padding: "6px 18px",
          color: homeMode ? "#818cf8" : "#9ca3af",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "var(--font-main)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "all .3s",
        }}
      >
        <span>{homeMode ? "🔬" : "🏠"}</span>
        {homeMode ? "Ver laboratorio" : "Ver simulación de hogar"}
      </button>

      {/* Ayuda de controles cuando está en home mode */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 15,
          background: "rgba(13,16,23,.9)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 11,
          color: "#9ca3af",
          fontFamily: "monospace",
          backdropFilter: "blur(8px)",
          lineHeight: 1.8,
        }}
      >
        <div style={{ color: "#818cf8", fontWeight: 700, marginBottom: 4 }}>
          🎮 CONTROLES
        </div>
        <div>⬆⬇⬅➡ / WASD — Mover cámara</div>
        <div>Q / E — Bajar / Subir</div>
        <div>🖱️ Clic izq + arrastrar — Rotar</div>
        <div>🖱️ Rueda — Zoom</div>
      </div>

      {/* Canvas 3D */}
      <Canvas
        shadows="soft"
        camera={{ position: [6, 3, 11], fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        performance={{ min: 0.5 }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, #0f1e3d 0%, #07090f 70%)",
        }}
      >
        <HomeCameraController homeMode={homeMode} />

        <ambientLight intensity={0.25} />
        <directionalLight
          position={[8, 10, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <DynamicLighting voltage={params.voltage} current={results.current} />

        <Stars
          radius={80}
          depth={50}
          count={2000}
          factor={3}
          fade
          speed={0.3}
        />

        {/* Laboratorio */}
        {!homeMode && (
          <>
            <PowerSupply voltage={params.voltage} current={results.current} />
            <Tank />
            <Electrodes />
            <Bubbles current={results.current} />
            <Cables />
            <Steam current={results.current} />
            <MultimeterScreen
              voltage={params.voltage}
              current={results.current}
              resistance={params.resistance}
            />
            <LabEnvironment />
          </>
        )}

        {/* Simulación de hogar */}
        <HomeSimulation
          visible={homeMode}
          applianceData={consumption.appliances}
          energyKWh={fuelCell.energyElecKWh}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={40}
          maxPolarAngle={Math.PI / 1.3}
          autoRotate={false}
          makeDefault
        />
        <Environment preset={homeMode ? "apartment" : "warehouse"} />
        {!homeMode && <RenewableSources3D sourceId={params.energySource} />}
      </Canvas>
    </div>
  );
}

function badge(color, pos) {
  const rgb = color === "#3b82f6" ? "59,130,246" : "239,68,68";
  const side = pos === "left" ? { left: 16 } : { right: 16 };
  return {
    position: "absolute",
    top: 16,
    zIndex: 10,
    background: `rgba(${rgb}, 0.1)`,
    border: `1px solid rgba(${rgb}, 0.3)`,
    borderRadius: 10,
    padding: "10px 14px",
    backdropFilter: "blur(10px)",
    pointerEvents: "none",
    ...side,
  };
}
