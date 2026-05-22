import { useState } from "react";
import {
  calcularConsumo,
  TARIFA_COP_KWH,
  TARIFA_USD_KWH,
} from "../physics/hydrogen";

const CATEGORIES = [
  "Todos",
  "Iluminación",
  "Electrónica",
  "Climatización",
  "Hogar",
  "Cocina",
  "Médico",
  "Entretenimiento",
];

export default function ConsumptionPanel({ energyElecKWh }) {
  const [category, setCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("hours");
  const data = calcularConsumo(energyElecKWh);

  const filtered = data.appliances
    .filter((a) => category === "Todos" || a.category === category)
    .sort((a, b) =>
      sortBy === "hours"
        ? b.hoursAvailable - a.hoursAvailable
        : a.watts - b.watts,
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── Resumen energético ── */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginBottom: 12,
          }}
        >
          {[
            {
              label: "Energía AC disponible",
              value: `${data.energyAC_Wh.toFixed(1)} Wh`,
              sub: `${data.energyAC_KWh.toFixed(5)} kWh`,
              color: "#4ade80",
            },
            {
              label: "Costo equivalente red",
              value: `$${data.costoCOP.toFixed(0)} COP`,
              sub: `$${data.costoUSD.toFixed(4)} USD`,
              color: "#fbbf24",
            },
            {
              label: "Eficiencia inversor",
              value: `${data.inverterEff}%`,
              sub: "DC → AC 220V",
              color: "#818cf8",
            },
            {
              label: "Tarifa referencia",
              value: `$${TARIFA_COP_KWH} COP/kWh`,
              sub: `$${TARIFA_USD_KWH} USD/kWh`,
              color: "#22d3ee",
            },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                background: "var(--surface)",
                border: `1px solid ${m.color}25`,
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: m.color,
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>
                {m.sub}
              </div>
              <div style={{ fontSize: 9, color: "#374151", marginTop: 2 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 10, color: "#6b7280" }}>Categoría:</span>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                background:
                  category === c ? "rgba(59,130,246,.15)" : "var(--surface)",
                border: `1px solid ${category === c ? "#3b82f6" : "var(--border)"}`,
                borderRadius: 20,
                padding: "3px 10px",
                cursor: "pointer",
                color: category === c ? "#3b82f6" : "#6b7280",
                fontSize: 10,
                fontWeight: category === c ? 700 : 400,
                fontFamily: "var(--font-main)",
              }}
            >
              {c}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#6b7280" }}>
            Ordenar:
          </span>
          <button
            onClick={() => setSortBy("hours")}
            style={sortBtn(sortBy === "hours")}
          >
            Por duración
          </button>
          <button
            onClick={() => setSortBy("watts")}
            style={sortBtn(sortBy === "watts")}
          >
            Por consumo
          </button>
        </div>
      </div>

      {/* ── Tabla de electrodomésticos ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 16px" }}>
        {/* Header tabla */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr 70px 100px 100px 110px 110px",
            gap: 8,
            padding: "10px 12px",
            fontSize: 10,
            fontWeight: 600,
            color: "#4b5563",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            position: "sticky",
            top: 0,
            background: "var(--bg2)",
            borderBottom: "1px solid var(--border)",
            zIndex: 5,
          }}
        >
          <span></span>
          <span>Electrodoméstico</span>
          <span>Potencia</span>
          <span>Horas disp.</span>
          <span>Energía usada</span>
          <span>Costo equiv. COP</span>
          <span>Costo equiv. USD</span>
        </div>

        {/* Filas */}
        {filtered.map((a, i) => {
          const feasible = a.hoursAvailable >= 0.1;
          return (
            <div
              key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 70px 100px 100px 110px 110px",
                gap: 8,
                padding: "10px 12px",
                background:
                  i % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)",
                borderBottom: "1px solid rgba(255,255,255,.03)",
                opacity: feasible ? 1 : 0.75,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 16 }}>{a.icon}</span>

              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: feasible ? "#e8eaf2" : "#4b5563",
                  }}
                >
                  {a.name}
                  {!feasible && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 9,
                        color: "#fbbf24",
                        background: "rgba(251,191,36,.15)",
                        border: "1px solid rgba(251,191,36,.3)",
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontWeight: 600,
                      }}
                    >
                      insuficiente
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>
                  {a.description}
                </div>
                <div style={{ fontSize: 9, color: "#374151", marginTop: 1 }}>
                  Categoría: {a.category}
                </div>
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#818cf8",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {a.watts}W
              </span>

              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: feasible ? "#4ade80" : "#374151",
                  }}
                >
                  {a.hoursFormatted}
                </div>
                {/* Mini barra */}
                <div
                  style={{
                    height: 3,
                    borderRadius: 2,
                    background: "var(--surface2)",
                    overflow: "hidden",
                    marginTop: 4,
                    width: 80,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      width: `${Math.min(100, (a.hoursAvailable / 24) * 100)}%`,
                      background: feasible ? "#4ade80" : "#374151",
                    }}
                  />
                </div>
              </div>

              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "#fbbf24",
                }}
              >
                {a.energyUsed_Wh.toFixed(1)} Wh
              </span>

              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "#22d3ee",
                }}
              >
                ${a.costCOP.toLocaleString("es-CO")}
              </span>

              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "#a78bfa",
                }}
              >
                ${a.costUSD.toFixed(4)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer nota */}
      <div
        style={{
          padding: "8px 20px",
          borderTop: "1px solid var(--border)",
          fontSize: 9,
          color: "#374151",
          fontFamily: "var(--font-mono)",
          flexShrink: 0,
        }}
      >
        * Costos equivalentes = lo que costaría esa energía tomada de la red
        eléctrica · Tarifa promedio nacional Colombia $780 COP/kWh · $0.19
        USD/kWh · Electrodomésticos marcados como "insuficiente" requieren más
        H₂ del producido actualmente
      </div>
    </div>
  );
}

const sortBtn = (active) => ({
  background: active ? "rgba(59,130,246,.1)" : "transparent",
  border: `1px solid ${active ? "#3b82f640" : "var(--border)"}`,
  borderRadius: 5,
  padding: "3px 8px",
  cursor: "pointer",
  color: active ? "#3b82f6" : "#6b7280",
  fontSize: 10,
  fontFamily: "var(--font-main)",
});
