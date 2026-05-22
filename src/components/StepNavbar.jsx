const STEPS = [
  {
    id: "electrolysis",
    number: 1,
    icon: "☀️",
    name: "Energía y Electrólisis",
    color: "#f59e0b",
  },
  {
    id: "storage",
    number: 2,
    icon: "🔵",
    name: "Almacenamiento H₂",
    color: "#06b6d4",
  },
  {
    id: "fuelcell",
    number: 3,
    icon: "⚙️",
    name: "Pila de combustible",
    color: "#8b5cf6",
  },
  {
    id: "consumption",
    number: 4,
    icon: "🏠",
    name: "Consumo en el hogar",
    color: "#4ade80",
  },
  {
    id: "transport",
    number: 5,
    icon: "🚗",
    name: "Transporte H₂",
    color: "#f97316",
  },
];

export default function StepNavbar({ activeTab, onChange }) {
  const currentIndex = STEPS.findIndex((s) => s.id === activeTab);
  const current = STEPS[currentIndex] || STEPS[0];
  const canNext = currentIndex < STEPS.length - 1;
  const canPrev = currentIndex > 0;

  return (
    <div
      style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border)",
        fontFamily: "var(--font-main)",
        userSelect: "none",
      }}
    >
      {/* Fila de pasos */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px 0",
          gap: 0,
          overflowX: "auto",
        }}
      >
        {STEPS.map((step, i) => {
          const isCurrent = step.id === activeTab;
          const isPast = i < currentIndex;
          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i < STEPS.length - 1 ? 1 : 0,
              }}
            >
              <button
                onClick={() => onChange(step.id)}
                title={step.name}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0 6px 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  borderBottom: isCurrent
                    ? `2px solid ${step.color}`
                    : "2px solid transparent",
                  transition: "all .2s",
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: isCurrent
                      ? step.color
                      : isPast
                        ? "rgba(255,255,255,.1)"
                        : "var(--surface)",
                    border: `2px solid ${isCurrent ? step.color : isPast ? "rgba(255,255,255,.15)" : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isCurrent ? 12 : 10,
                    fontWeight: 700,
                    color: isCurrent
                      ? "#000"
                      : isPast
                        ? "#fff"
                        : "var(--muted)",
                    transition: "all .25s",
                    flexShrink: 0,
                  }}
                >
                  {isPast ? "✓" : isCurrent ? step.icon : step.number}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: isCurrent ? 700 : 400,
                    color: isCurrent ? step.color : "var(--muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.name}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    minWidth: 10,
                    margin: "0 2px 10px",
                    background:
                      i < currentIndex
                        ? "rgba(255,255,255,.15)"
                        : "var(--border)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      right: -3,
                      top: -6,
                      fontSize: 10,
                      color: "var(--border)",
                    }}
                  >
                    ›
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fila inferior con botones */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 12px 8px",
          gap: 10,
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => canPrev && onChange(STEPS[currentIndex - 1].id)}
          disabled={!canPrev}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "4px 12px",
            fontSize: 11,
            color: canPrev ? "var(--text)" : "var(--muted)",
            cursor: canPrev ? "pointer" : "not-allowed",
            fontFamily: "var(--font-main)",
            opacity: canPrev ? 1 : 0.35,
            flexShrink: 0,
            transition: "all .2s",
          }}
        >
          ← Anterior
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: current.color,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Paso {currentIndex + 1} de {STEPS.length} — {current.name}
          </div>
          {/* Barra de progreso */}
          <div
            style={{
              height: 3,
              borderRadius: 2,
              background: "var(--border)",
              marginTop: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                width: `${((currentIndex + 1) / STEPS.length) * 100}%`,
                background: current.color,
                transition: "width .4s ease",
              }}
            />
          </div>
        </div>

        <button
          onClick={() => canNext && onChange(STEPS[currentIndex + 1].id)}
          disabled={!canNext}
          style={{
            background: canNext ? current.color : "var(--surface)",
            border: `1px solid ${canNext ? current.color : "var(--border)"}`,
            borderRadius: 6,
            padding: "4px 14px",
            fontSize: 11,
            fontWeight: 700,
            color: canNext ? "#000" : "var(--muted)",
            cursor: canNext ? "pointer" : "not-allowed",
            fontFamily: "var(--font-main)",
            opacity: canNext ? 1 : 0.35,
            flexShrink: 0,
            transition: "all .2s",
          }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
