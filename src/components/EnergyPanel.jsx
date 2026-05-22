export default function EnergyPanel({ results, params }) {
  // Eficiencia teórica: voltaje mínimo necesario para electrólisis = 1.23V
  const V_MIN = 1.23;
  const efficiency = Math.min(100, (V_MIN / params.voltage) * 100);
  const energyPerGH2 =
    results.massH2 > 0 ? results.energy / 1000 / results.massH2 : 0;

  const bars = [
    {
      label: "Eficiencia energética",
      value: efficiency,
      color:
        efficiency > 50 ? "#4ade80" : efficiency > 25 ? "#fbbf24" : "#ef4444",
      unit: "%",
    },
    {
      label: "Voltaje vs mínimo",
      value: Math.min(100, (V_MIN / params.voltage) * 100),
      color: "#3b82f6",
      unit: "%",
    },
    {
      label: "Uso de corriente",
      value: Math.min(100, results.current * 10),
      color: "#818cf8",
      unit: "%",
    },
  ];

  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--border)",
      }}
    >
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
        Eficiencia energética
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {bars.map((b) => (
        <div key={b.label} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--muted2)",
              marginBottom: 4,
            }}
          >
            <span>{b.label}</span>
            <strong style={{ color: b.color, fontFamily: "var(--font-mono)" }}>
              {b.value.toFixed(1)}
              {b.unit}
            </strong>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: "var(--surface2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 3,
                width: `${Math.max(2, b.value)}%`,
                background: b.color,
                boxShadow: `0 0 6px ${b.color}80`,
                transition: "width .4s ease",
              }}
            />
          </div>
        </div>
      ))}

      {/* kJ por gramo de H₂ */}
      <div
        style={{
          marginTop: 10,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "8px 10px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#4ade80",
              fontFamily: "var(--font-mono)",
            }}
          >
            {efficiency.toFixed(1)}
            <span
              style={{ fontSize: 10, color: "var(--muted)", marginLeft: 2 }}
            >
              %
            </span>
          </div>
          <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>
            Eficiencia Faradaica
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fbbf24",
              fontFamily: "var(--font-mono)",
            }}
          >
            {energyPerGH2 > 0 ? energyPerGH2.toFixed(2) : "—"}
            <span
              style={{ fontSize: 10, color: "var(--muted)", marginLeft: 2 }}
            >
              kJ/g
            </span>
          </div>
          <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>
            Energía por g H₂
          </div>
        </div>
      </div>
    </div>
  );
}
