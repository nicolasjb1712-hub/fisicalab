import { useState } from "react";
import {
  ENERGY_SOURCES,
  H2_COLORS,
  calcularImpactoAmbiental,
} from "../physics/energySources";

// ══════════════════════════════════════════════
//  TARJETA COLAPSADA — solo el botón de selección
// ══════════════════════════════════════════════
function SourceCard({ source, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(source.id)}
      style={{
        background: isSelected ? `${source.color}18` : "rgba(255,255,255,.03)",
        border: `1.5px solid ${isSelected ? source.color : "rgba(255,255,255,.07)"}`,
        borderRadius: 10,
        padding: "9px 11px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 9,
        transition: "all .25s cubic-bezier(.4,0,.2,1)",
        transform: isSelected ? "scale(1.01)" : "scale(1)",
        boxShadow: isSelected ? `0 0 16px ${source.color}20` : "none",
        width: "100%",
      }}
    >
      {/* Icono con halo */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: isSelected
            ? `${source.color}22`
            : "rgba(255,255,255,.05)",
          border: `1px solid ${isSelected ? source.color + "50" : "rgba(255,255,255,.08)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
          transition: "all .25s",
        }}
      >
        {source.icon}
      </div>

      {/* Nombre + tipo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: isSelected ? source.color : "#cbd5e1",
            transition: "color .2s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {source.name}
        </div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
          {source.co2PerKgH2 === 0
            ? "✦ Sin emisiones"
            : `${source.co2PerKgH2} kg CO₂/kg H₂`}
        </div>
      </div>

      {/* Badge H2 color + checkmark */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
      >
        <span
          style={{
            fontSize: 9,
            padding: "2px 7px",
            background: `${source.h2ColorHex}18`,
            border: `1px solid ${source.h2ColorHex}40`,
            borderRadius: 20,
            color: source.h2ColorHex,
            fontWeight: 700,
            letterSpacing: ".04em",
          }}
        >
          H₂ {source.h2Color}
        </span>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: isSelected ? source.color : "rgba(255,255,255,.06)",
            border: `1.5px solid ${isSelected ? source.color : "rgba(255,255,255,.12)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all .2s",
            fontSize: 10,
            color: "#000",
            fontWeight: 700,
          }}
        >
          {isSelected ? "✓" : ""}
        </div>
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════
//  PANEL EXPANDIDO — detalle de la fuente activa
// ══════════════════════════════════════════════
function ExpandedDetail({ source, impact }) {
  const h2Info = H2_COLORS[source.h2Color];

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${source.color}10 0%, rgba(0,0,0,0) 60%)`,
        border: `1px solid ${source.color}30`,
        borderRadius: 12,
        padding: "14px",
        marginTop: 6,
        marginBottom: 2,
        animation: "fadeSlideIn .3s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header con ícono grande */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            flexShrink: 0,
            background: `${source.color}20`,
            border: `1.5px solid ${source.color}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: `0 0 20px ${source.color}20`,
          }}
        >
          {source.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: source.color,
              marginBottom: 2,
            }}
          >
            {source.name}
          </div>
          <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>
            {source.description}
          </div>
        </div>
        {/* Badge H2 grande */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "6px 10px",
            background: `${source.h2ColorHex}15`,
            border: `1.5px solid ${source.h2ColorHex}40`,
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: source.h2ColorHex,
              boxShadow: `0 0 8px ${source.h2ColorHex}`,
            }}
          />
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: source.h2ColorHex,
              letterSpacing: ".06em",
            }}
          >
            H₂ {source.h2Color.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Descripción del color H₂ */}
      <div
        style={{
          fontSize: 10,
          color: "#475569",
          fontStyle: "italic",
          marginBottom: 12,
          padding: "6px 10px",
          background: `${source.h2ColorHex}08`,
          borderLeft: `2px solid ${source.h2ColorHex}60`,
          borderRadius: "0 6px 6px 0",
        }}
      >
        {h2Info.desc}
      </div>

      {/* Métricas en grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 7,
          marginBottom: 12,
        }}
      >
        <MiniMetric
          label="Costo energía"
          value={`$${source.costPerKWh_COP.toLocaleString("es-CO")}`}
          unit="/kWh COP"
          color={source.color}
        />
        <MiniMetric
          label="Disponibilidad"
          value={`${(source.availabilityFactor * 100).toFixed(0)}%`}
          unit={source.availability}
          color={source.color}
        />
        <MiniMetric
          label="CO₂ evitado"
          value={impact.emisionesEvitadas.toFixed(3)}
          unit="kg vs fósil"
          color="#4ade80"
        />
        <MiniMetric
          label="Árboles equiv."
          value={impact.arbolesEquivalentes.toFixed(2)}
          unit="árb/año"
          color="#4ade80"
        />
      </div>

      {/* Pros y contras */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              color: "#4ade80",
              fontWeight: 700,
              letterSpacing: ".08em",
              marginBottom: 5,
            }}
          >
            VENTAJAS
          </div>
          {source.pros.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 5,
                marginBottom: 3,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "#4ade80",
                  fontSize: 10,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                ✦
              </span>
              <span style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>
                {p}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: 9,
              color: "#f87171",
              fontWeight: 700,
              letterSpacing: ".08em",
              marginBottom: 5,
            }}
          >
            DESVENTAJAS
          </div>
          {source.cons.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 5,
                marginBottom: 3,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "#f87171",
                  fontSize: 10,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                ✗
              </span>
              <span style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value, unit, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: 8,
        padding: "7px 9px",
      }}
    >
      <div style={{ fontSize: 9, color: "#475569", marginBottom: 3 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color,
          fontFamily: "var(--font-mono)",
          lineHeight: 1,
        }}
      >
        {value}
        <span
          style={{
            fontSize: 9,
            marginLeft: 3,
            color: "#475569",
            fontWeight: 400,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════
export default function EnergySelector({
  selectedSource,
  onChange,
  massH2Grams,
  energyKWh,
}) {
  const selected =
    ENERGY_SOURCES.find((s) => s.id === selectedSource) || ENERGY_SOURCES[0];
  const impact = calcularImpactoAmbiental(
    selectedSource,
    massH2Grams,
    energyKWh,
  );

  return (
    <div style={{ padding: "14px 14px 6px" }}>
      {/* Título */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: "linear-gradient(to bottom, #3b82f6, #22d3ee)",
          }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "#475569",
          }}
        >
          Fuente de energía
        </span>
      </div>

      {/* Lista de fuentes — al seleccionar una se ocultan las demás */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {ENERGY_SOURCES.map((source) => {
          const isSelected = selectedSource === source.id;
          // Si hay una seleccionada, ocultar las no seleccionadas con animación
          const isVisible = !selectedSource || isSelected;

          return (
            <div
              key={source.id}
              style={{
                overflow: "hidden",
                maxHeight: isVisible ? "600px" : "0px",
                opacity: isVisible ? 1 : 0,
                transition:
                  "max-height .35s cubic-bezier(.4,0,.2,1), opacity .25s ease",
              }}
            >
              <SourceCard
                source={source}
                isSelected={isSelected}
                onSelect={(id) => {
                  // Si ya está seleccionado, deseleccionar (colapsar)
                  onChange(id === selectedSource ? null : id);
                }}
              />
              {/* Panel expandido solo para el seleccionado */}
              {isSelected && (
                <ExpandedDetail source={selected} impact={impact} />
              )}
            </div>
          );
        })}
      </div>

      {/* Botón "cambiar" si hay una seleccionada */}
      {selectedSource && (
        <button
          onClick={() => onChange(null)}
          style={{
            width: "100%",
            marginTop: 8,
            padding: "7px",
            background: "transparent",
            border: "1px dashed rgba(255,255,255,.1)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 10,
            color: "#475569",
            fontFamily: "var(--font-main)",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,.2)";
            e.target.style.color = "#94a3b8";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,.1)";
            e.target.style.color = "#475569";
          }}
        >
          ↩ Ver todas las fuentes
        </button>
      )}
    </div>
  );
}
