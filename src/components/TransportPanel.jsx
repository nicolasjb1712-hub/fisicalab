import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useState } from "react";
import HydrogenVehicle3D from "./HydrogenVehicle3D";
import { calcularTransporte, VEHICLES, CAR_TYPES } from "../physics/transport";

export default function TransportPanel({
  massH2Grams,
  vehicleId,
  onVehicleChange,
}) {
  const [activeView, setActiveView] = useState("destinations");
  const data = calcularTransporte(massH2Grams, vehicleId);
  const v = data.vehicle;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── VISTA 3D ── */}
      <div
        style={{
          position: "relative",
          background:
            "radial-gradient(ellipse at 50% 40%, #0a1628 0%, #050a12 70%)",
        }}
      >
        <Canvas
          shadows
          camera={{ position: [5, 3, 7], fov: 45 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <HydrogenVehicle3D vehicleId={vehicleId} />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0.5, 0]}
          />
          <Environment preset="city" />
        </Canvas>

        {/* Selector de vehículo flotante */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: 6,
            background: "rgba(10,15,25,.92)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12,
            padding: 6,
            backdropFilter: "blur(10px)",
          }}
        >
          {VEHICLES.map((vh) => (
            <button
              key={vh.id}
              onClick={() => onVehicleChange(vh.id)}
              style={{
                background:
                  vehicleId === vh.id ? `${vh.color}20` : "transparent",
                border: `1px solid ${vehicleId === vh.id ? vh.color : "transparent"}`,
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: vehicleId === vh.id ? vh.color : "#9ca3af",
                fontSize: 12,
                fontWeight: vehicleId === vh.id ? 700 : 400,
                fontFamily: "var(--font-main)",
                transition: "all .2s",
              }}
            >
              <span style={{ fontSize: 16 }}>{vh.icon}</span>
              {vh.name}
            </button>
          ))}
        </div>

        {/* Badge autonomía */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 20,
            zIndex: 10,
            background: "rgba(10,15,25,.92)",
            border: `1px solid ${v.color}40`,
            borderRadius: 10,
            padding: "12px 16px",
            backdropFilter: "blur(10px)",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>
            AUTONOMÍA DISPONIBLE
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: v.color,
              fontFamily: "var(--font-mono)",
            }}
          >
            {data.rangeKm.toFixed(1)}{" "}
            <span style={{ fontSize: 16, color: "#6b7280" }}>km</span>
          </div>
          <div style={{ fontSize: 10, color: "#4b5563", marginTop: 4 }}>
            con {data.massH2Kg.toFixed(4)} g H₂
          </div>
        </div>

        {/* Badge tanque */}
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 20,
            zIndex: 10,
            background: "rgba(10,15,25,.92)",
            border: "1px solid rgba(74,222,128,.3)",
            borderRadius: 10,
            padding: "12px 16px",
            backdropFilter: "blur(10px)",
            pointerEvents: "none",
            minWidth: 240,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#9ca3af",
              marginBottom: 6,
            }}
          >
            <span>TANQUE H₂ ({v.tank_kg} kg)</span>
            <span
              style={{
                color: data.tankFillPercent >= 1 ? "#4ade80" : "#ef4444",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              {data.tankFillPercent < 1
                ? data.tankFillPercent.toFixed(3) + "%"
                : data.tankFillPercent.toFixed(1) + "%"}
            </span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 5,
              background: "rgba(255,255,255,.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0.5, data.tankFillPercent)}%`,
                background:
                  data.tankFillPercent >= 50
                    ? "#4ade80"
                    : data.tankFillPercent >= 10
                      ? "#fbbf24"
                      : "#ef4444",
                transition: "width .6s ease",
                boxShadow: `0 0 8px currentColor`,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#4b5563",
              marginTop: 6,
              fontFamily: "var(--font-mono)",
              lineHeight: 1.6,
            }}
          >
            <div>
              {data.massH2Grams.toFixed(3)} g / {(v.tank_kg * 1000).toFixed(0)}{" "}
              g
            </div>
            <div>
              Faltan {data.h2NeededGrams.toFixed(1)} g · ≈
              {data.daysToFillTank.toFixed(0)} días con solar
            </div>
          </div>
        </div>

        {/* Info inferior */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            background: "rgba(10,15,25,.92)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 10,
            padding: "10px 20px",
            backdropFilter: "blur(10px)",
            display: "flex",
            gap: 24,
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: v.color }}>
              {v.icon} {v.max_range_km} km
            </div>
            <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>
              Autonomía máx.
            </div>
          </div>
          <div
            style={{ width: 1, height: 30, background: "rgba(255,255,255,.1)" }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#4ade80" }}>
              ♻ 0 g/km
            </div>
            <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>
              Emisiones CO₂
            </div>
          </div>
          <div
            style={{ width: 1, height: 30, background: "rgba(255,255,255,.1)" }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>
              ⏱ {v.refuel_minutes} min
            </div>
            <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>
              Tiempo recarga
            </div>
          </div>
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <div
        style={{
          background: "var(--bg2)",
          borderLeft: "1px solid var(--border)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ display: "flex", borderBottom: "1px solid var(--border)" }}
        >
          {[
            { id: "destinations", label: "📍 Destinos" },
            { id: "comparison", label: "⚖️ Comparar" },
            { id: "impact", label: "🌍 Impacto" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                flex: 1,
                padding: "10px 12px",
                background:
                  activeView === tab.id ? "var(--surface)" : "transparent",
                border: "none",
                borderBottom:
                  activeView === tab.id
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
                color: activeView === tab.id ? "#e8eaf2" : "#6b7280",
                fontSize: 11,
                fontWeight: activeView === tab.id ? 700 : 400,
                cursor: "pointer",
                fontFamily: "var(--font-main)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          {activeView === "destinations" && (
            <DestinationsList data={data} vehicle={v} />
          )}
          {activeView === "comparison" && (
            <ComparisonView rangeKm={data.rangeKm} />
          )}
          {activeView === "impact" && <ImpactView data={data} vehicle={v} />}
        </div>
      </div>
    </div>
  );
}

function DestinationsList({ data, vehicle }) {
  // Agrupar por tipo
  const grouped = data.reachableDestinations.reduce((acc, d) => {
    if (!acc[d.type]) acc[d.type] = [];
    acc[d.type].push(d);
    return acc;
  }, {});

  return (
    <div>
      <SectionTitle>Destinos desde Valledupar</SectionTitle>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted)",
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        Con{" "}
        <span style={{ color: vehicle.color, fontWeight: 700 }}>
          {data.rangeKm.toFixed(1)} km
        </span>{" "}
        en tu {vehicle.name.toLowerCase()}:
      </div>

      {Object.entries(grouped).map(([type, dests]) => (
        <div key={type} style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            {type}
          </div>
          {dests.map((d) => (
            <div
              key={d.id}
              style={{
                background: "var(--surface)",
                border: `1px solid ${d.canReach ? "rgba(74,222,128,.2)" : "rgba(239,68,68,.15)"}`,
                borderRadius: 8,
                padding: "9px 12px",
                marginBottom: 5,
                opacity: d.canReach ? 1 : 0.65,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{d.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {d.name}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--muted)" }}>
                      {d.km} km
                    </div>
                  </div>
                </div>
                {d.canReach ? (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#4ade80",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    ×{d.trips} {d.trips === 1 ? "viaje" : "viajes"}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#ef4444",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {d.partialTrip.toFixed(0)}% del viaje
                  </div>
                )}
              </div>
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: "rgba(255,255,255,.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, d.partialTrip)}%`,
                    background: d.canReach ? "#4ade80" : "#ef4444",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ComparisonView({ rangeKm }) {
  return (
    <div>
      <SectionTitle>Comparativa de vehículos</SectionTitle>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>
        Costo, emisiones y características para{" "}
        <b style={{ color: "#3b82f6" }}>100 km</b>:
      </div>
      {CAR_TYPES.map((c) => (
        <div
          key={c.id}
          style={{
            background: "var(--surface)",
            border: `1px solid ${c.color}25`,
            borderRadius: 8,
            padding: "12px",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>
                {c.name}
              </span>
            </div>
            {c.id === "h2" && (
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 8px",
                  background: "rgba(74,222,128,.15)",
                  border: "1px solid rgba(74,222,128,.3)",
                  borderRadius: 10,
                  color: "#4ade80",
                  fontWeight: 600,
                }}
              >
                NUESTRO SISTEMA
              </span>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              fontSize: 11,
            }}
          >
            <div>
              <div style={{ color: "var(--muted)", marginBottom: 2 }}>
                Costo / 100 km
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ${(c.cost_per_km_COP * 100).toLocaleString("es-CO")} COP
              </div>
            </div>
            <div>
              <div style={{ color: "var(--muted)", marginBottom: 2 }}>
                Emisiones CO₂
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: c.co2_per_km === 0 ? "#4ade80" : "#ef4444",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {(c.co2_per_km * 100).toFixed(1)} g
              </div>
            </div>
            <div>
              <div style={{ color: "var(--muted)", marginBottom: 2 }}>
                Autonomía máx.
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {c.range_km} km
              </div>
            </div>
            <div>
              <div style={{ color: "var(--muted)", marginBottom: 2 }}>
                Recarga
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {c.refuel_time}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ImpactView({ data, vehicle }) {
  return (
    <div>
      <SectionTitle>Impacto ambiental</SectionTitle>
      <div
        style={{
          background: "rgba(74,222,128,.08)",
          border: "1px solid rgba(74,222,128,.25)",
          borderRadius: 10,
          padding: "14px",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#4ade80",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          🌱 VS AUTO DE GASOLINA
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#4ade80",
            fontFamily: "var(--font-mono)",
          }}
        >
          {data.co2AvoidedKg.toFixed(3)} kg
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
          CO₂ evitados en {data.rangeKm.toFixed(1)} km
        </div>
      </div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "12px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--muted)",
            marginBottom: 10,
          }}
        >
          RESUMEN DE VIAJE — {vehicle.name.toUpperCase()}
        </div>
        {[
          ["Hidrógeno producido", `${data.massH2Grams.toFixed(3)} g`],
          [
            "Tanque lleno",
            `${data.tankFillPercent < 1 ? data.tankFillPercent.toFixed(3) : data.tankFillPercent.toFixed(1)}%`,
          ],
          ["H₂ faltante", `${data.h2NeededGrams?.toFixed(1) ?? "0.0"} g`],
          [
            "Días para tanque lleno",
            `${data.daysToFillTank?.toFixed(0) ?? "0"} días (solar)`,
          ],
          ["Autonomía obtenida", `${data.rangeKm.toFixed(2)} km`],
          [
            "Costo operativo",
            `$${(data.rangeKm * (vehicle?.cost_per_km_COP ?? 95)).toFixed(0)} COP`,
          ],
          [
            "Ahorro vs gasolina",
            `$${(data.costSavedCOP ?? 0).toLocaleString?.("es-CO") ?? 0} COP`,
          ],
          ["CO₂ evitado", `${data.co2AvoidedKg?.toFixed(4) ?? "0"} kg`],
          ["Subproducto", "💧 Agua pura"],
        ].map(([k, v], i, arr) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              padding: "6px 0",
              borderBottom:
                i < arr.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
            }}
          >
            <span style={{ color: "var(--muted2)" }}>{k}</span>
            <span
              style={{
                color: "var(--text)",
                fontWeight: 600,
                fontFamily: "var(--font-mono)",
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: 11,
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      {children}
      <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}
