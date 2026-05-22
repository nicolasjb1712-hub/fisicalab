import { useState, useRef } from "react";
import { calcularPilaCombustible } from "../physics/hydrogen";

function Tip({ text }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef(null);
  const [above, setAbove] = useState(true);
  const visible = hovered || pinned;

  const calcDir = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAbove(rect.top > 160);
    }
  };

  const getStyle = () => {
    if (!ref.current) return {};
    const rect = ref.current.getBoundingClientRect();
    const left = Math.min(Math.max(rect.left - 90, 8), window.innerWidth - 232);
    return {
      top: above ? rect.top - 10 + "px" : rect.bottom + 10 + "px",
      left: left + "px",
      transform: above ? "translateY(-100%)" : "none",
    };
  };

  return (
    <span
      ref={ref}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        marginLeft: 5,
      }}
    >
      <button
        onMouseEnter={() => {
          calcDir();
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          calcDir();
          setPinned((p) => !p);
        }}
        style={{
          width: 15,
          height: 15,
          borderRadius: "50%",
          background: pinned ? "rgba(59,130,246,.25)" : "rgba(255,255,255,.08)",
          border: `1px solid ${pinned ? "#3b82f6" : "rgba(255,255,255,.15)"}`,
          color: pinned ? "#3b82f6" : "#9ca3af",
          fontSize: 9,
          fontWeight: 700,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-main)",
          lineHeight: 1,
          flexShrink: 0,
          transition: "all .2s",
        }}
      >
        {pinned ? "×" : "?"}
      </button>

      {visible && (
        <div
          style={{
            position: "fixed",
            ...getStyle(),
            background: "#0d1117",
            border: `1px solid ${pinned ? "#3b82f6" : "rgba(59,130,246,.3)"}`,
            borderRadius: 8,
            padding: "8px 10px",
            width: 220,
            zIndex: 99999,
            boxShadow: "0 8px 24px rgba(0,0,0,.7)",
            pointerEvents: pinned ? "auto" : "none",
          }}
        >
          {pinned && (
            <div
              style={{
                fontSize: 9,
                color: "#3b82f6",
                fontWeight: 600,
                marginBottom: 5,
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-main)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "inline-block",
                }}
              />
              Fijado — toca × para cerrar
            </div>
          )}
          <div
            style={{
              fontSize: 11,
              color: "#cbd5e1",
              lineHeight: 1.6,
              fontFamily: "var(--font-main)",
            }}
          >
            {text}
          </div>
        </div>
      )}
    </span>
  );
}

function FlowBox({ color, label, sub, tip }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "10px 14px",
        background: `${color}12`,
        border: `1px solid ${color}40`,
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {label}
        {tip && <Tip text={tip} />}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#9ca3af",
          marginTop: 2,
          fontFamily: "var(--font-mono)",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      style={{ fontSize: 16, color: "#374151", lineHeight: 1, margin: "2px 0" }}
    >
      ↓
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
        color: "#6b7280",
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

export default function FuelCellPanel({ massH2Grams }) {
  const massKg = massH2Grams / 1000;
  const data = calcularPilaCombustible(massKg);

  const stages = [
    {
      label: "Entrada H₂",
      icon: "🔵",
      value: `${(massKg * 1000).toFixed(4)} g`,
      color: "#3b82f6",
      tip: "El hidrógeno producido en la electrólisis llega aquí almacenado. Es el combustible de la pila — cuanto más H₂ haya, más electricidad se puede generar.",
    },
    {
      label: "Energía química",
      icon: "⚗️",
      value: `${data.energyChemMJ.toFixed(4)} MJ`,
      color: "#fbbf24",
      tip: "Es la energía que contiene el hidrógeno almacenado. Se calcula con el Poder Calorífico Inferior del H₂ (119.96 MJ/kg). Esta energía todavía no es electricidad — es potencial químico.",
    },
    {
      label: "Eficiencia PEM",
      icon: "⚙️",
      value: `${data.efficiency}%`,
      color: "#22d3ee",
      tip: "La pila PEM convierte el 60% de la energía química del H₂ en electricidad. El 40% restante se disipa como calor. Los motores de gasolina solo aprovechan el 20-25%.",
    },
    {
      label: "Energía eléctrica",
      icon: "⚡",
      value: `${data.energyElecKWh.toFixed(5)} kWh`,
      color: "#4ade80",
      tip: "Es la electricidad real que sale de la pila después de aplicar la eficiencia del 60%. Esta es la energía disponible para alimentar electrodomésticos o cargar vehículos.",
    },
    {
      label: "Voltaje stack",
      icon: "🔋",
      value: `${data.stackVoltage.toFixed(1)} V DC`,
      color: "#818cf8",
      tip: "El voltaje que entrega la pila en corriente continua (DC). Cada celda PEM genera ~0.7V. Varias celdas en serie forman el stack y suman el voltaje total.",
    },
    {
      label: "Corriente stack",
      icon: "〰️",
      value: `${data.stackCurrent.toFixed(2)} A`,
      color: "#f472b6",
      tip: "La corriente eléctrica que fluye por el circuito de la pila. Junto con el voltaje determina la potencia entregada (P = V × I).",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        padding: 20,
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* ── Diagrama ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionTitle>Diagrama de la pila PEM</SectionTitle>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignItems: "center",
            }}
          >
            <FlowBox
              color="#3b82f6"
              label="H₂ almacenado"
              sub={`${(massKg * 1000).toFixed(4)} g`}
              tip="El hidrógeno llega desde el tanque de almacenamiento. Es el combustible que va a reaccionar con el oxígeno del aire para generar electricidad."
            />
            <FlowArrow />

            <div
              style={{
                width: "100%",
                padding: "14px 16px",
                background:
                  "linear-gradient(135deg, rgba(59,130,246,.1), rgba(239,68,68,.1))",
                border: "1px solid rgba(129,140,248,.3)",
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                ⚙️ Membrana PEM
                <Tip text="La membrana PEM es una lámina delgada de polímero especial. Solo deja pasar los protones del hidrógeno (H⁺) y bloquea los electrones, que son forzados a viajar por el circuito externo generando corriente eléctrica." />
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
                2H₂ → 4H⁺ + 4e⁻ &nbsp;|&nbsp; O₂ + 4H⁺ + 4e⁻ → 2H₂O
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ← Cátodo (H₂)
                  <Tip text="En el cátodo el H₂ se divide en protones (H⁺) y electrones (e⁻). Los protones cruzan la membrana y los electrones generan la corriente eléctrica." />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Ánodo (O₂) →
                  <Tip text="En el ánodo el oxígeno del aire se combina con los protones que cruzaron la membrana y los electrones que vienen del circuito, produciendo agua pura como único residuo." />
                </div>
              </div>
            </div>
            <FlowArrow />

            <FlowBox
              color="#4ade80"
              label="Electricidad DC"
              sub={`${data.energyElecKWh.toFixed(5)} kWh`}
              tip="La electricidad sale en corriente continua (DC), como la de una batería. Antes de usarla en casa hay que convertirla a corriente alterna (AC) con el inversor."
            />
            <FlowArrow />

            <div
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(251,191,36,.08)",
                border: "1px solid rgba(251,191,36,.25)",
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                🔄 Inversor DC → AC
                <Tip text="El inversor convierte la corriente continua (DC) de la pila en corriente alterna (AC) de 220V — el mismo tipo de electricidad que sale de los enchufes de tu casa. Tiene una eficiencia del 92%, lo que significa que pierde solo el 8% de energía en la conversión." />
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>
                Eficiencia: 92% · {data.stackVoltage.toFixed(0)}V DC → 220V AC
              </div>
            </div>
            <FlowArrow />

            <FlowBox
              color="#818cf8"
              label="Red AC disponible"
              sub="Lista para electrodomésticos"
              tip="La electricidad ya está lista para usarse en cualquier aparato del hogar. A esta energía se le aplica la eficiencia del inversor (92%), por eso es un poco menos que la que salió directamente de la pila."
            />

            <div
              style={{
                marginTop: 10,
                width: "100%",
                background: "rgba(34,211,238,.06)",
                border: "1px solid rgba(34,211,238,.2)",
                borderRadius: 8,
                padding: "8px 12px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 10, color: "#22d3ee" }}>
                💧 Subproducto: agua pura (H₂O)
              </span>
              <Tip text="La reacción química en la pila produce únicamente agua pura como residuo. No hay humo, no hay CO₂, no hay ruido. El agua producida es tan pura que en algunos sistemas se recicla para volver a hacer electrólisis." />
            </div>
          </div>
        </div>
      </div>

      {/* ── Métricas ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionTitle>Parámetros de la pila PEM</SectionTitle>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {stages.map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--surface)",
                border: `1px solid ${s.color}25`,
                borderRadius: 8,
                padding: "10px 11px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#4b5563",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {s.icon} {s.label}
                <Tip text={s.tip} />
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: s.color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              Eficiencia pila PEM
              <Tip text="La eficiencia del 60% significa que de cada 100 unidades de energía química del H₂, 60 se convierten en electricidad útil. Los 40 restantes salen como calor. En sistemas de cogeneración ese calor también se aprovecha, subiendo la eficiencia total al 80-90%." />
            </span>
            <span style={{ color: "#4ade80", fontWeight: 700 }}>60%</span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "var(--surface2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "60%",
                background: "#4ade80",
                borderRadius: 4,
                boxShadow: "0 0 8px #4ade8080",
              }}
            />
          </div>
          <div style={{ fontSize: 9, color: "#374151", marginTop: 6 }}>
            El 40% restante se disipa como calor — recuperable para calefacción
            en sistemas avanzados
          </div>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9ca3af",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Comparativa con fuentes convencionales
            <Tip text="Esta comparativa muestra la eficiencia real de cada tecnología. Un motor de gasolina desperdicia el 75-80% de la energía del combustible en calor. La pila PEM aprovecha el doble de energía útil comparada con la gasolina." />
          </div>
          {[
            { label: "Motor a gasolina", eff: 25, color: "#ef4444" },
            { label: "Motor diésel", eff: 35, color: "#f97316" },
            { label: "Pila combustible PEM", eff: 60, color: "#4ade80" },
            { label: "Pila combustible SOFC", eff: 85, color: "#22d3ee" },
          ].map((c) => (
            <div key={c.label} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "#6b7280",
                  marginBottom: 3,
                }}
              >
                <span>{c.label}</span>
                <span style={{ color: c.color, fontWeight: 700 }}>
                  {c.eff}%
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  borderRadius: 3,
                  background: "var(--surface2)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${c.eff}%`,
                    background: c.color,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
