export default function Topbar({ seconds }) {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <header
      style={{
        gridColumn: "1 / -1",
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: "linear-gradient(135deg, #3b82f6, #818cf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          ⚡
        </div>
        <div>
          <div
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".04em" }}
          >
            Simulador de Electrólisis del Agua
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--muted)",
              fontFamily: "var(--font-mono)",
              marginTop: 1,
            }}
          >
            Leyes de Ohm + Faraday — Visualización 3D en tiempo real
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(74,222,128,.08)",
            border: "1px solid rgba(74,222,128,.2)",
            borderRadius: 20,
            padding: "3px 12px",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--green)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "blink 1.4s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          Simulación activa
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--muted2)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: "3px 10px",
            borderRadius: 6,
          }}
        >
          {hh}:{mm}:{ss}
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </header>
  );
}
