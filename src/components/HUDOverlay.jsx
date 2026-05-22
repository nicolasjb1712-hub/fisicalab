export default function HUDOverlay({ results, params }) {
  return (
    <>
      {/* H₂ — izquierda */}
      {/* <div style={hudCard("left", "12px", "#3b82f6")}>
        <div style={hudLabel("#60a5fa")}>H₂ producido</div>
        <div style={hudValue}>{results.massH2.toFixed(4)} g</div>
        <div style={hudSub}>2H₂O + 2e⁻ → H₂ + 2OH⁻</div>
      </div> */}

      {/* O₂ — derecha */}
      {/* <div style={hudCard("right", "12px", "#ef4444")}>
        <div style={hudLabel("#f87171")}>O₂ producido</div>
        <div style={hudValue}>{results.massO2.toFixed(4)} g</div>
        <div style={hudSub}>2H₂O → O₂ + 4H⁺ + 4e⁻</div>
      </div> */}

      {/* Métricas izquierda — debajo del H2 */}
      <div style={{
        position: "absolute", left: 12, top: 110,
        display: "flex", flexDirection: "column", gap: 5,
        zIndex: 20, pointerEvents: "none",
      }}>
        {[
          { label: "Corriente", value: `${results.current.toFixed(3)} A`, color: "#fbbf24" },
          { label: "Potencia",  value: `${results.power.toFixed(2)} W`,   color: "#4ade80" },
          { label: "Eficiencia", value: `${results.efficiency.toFixed(1)}%`, color: "#818cf8" },
        ].map(m => (
          <div key={m.label} style={{
            background: "rgba(13,16,23,.88)",
            border: `1px solid ${m.color}25`,
            borderRadius: 7, padding: "5px 10px",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ fontSize: 9, color: m.color, fontFamily: "var(--font-main)" }}>
              {m.label}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "#e8eaf2",
              fontFamily: "var(--font-mono)",
            }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function hudCard(side, top, color) {
  return {
    position: "absolute", [side]: 12, top,
    background: "rgba(13,16,23,.88)",
    border: `1px solid ${color}30`,
    borderRadius: 9, padding: "8px 12px",
    zIndex: 20, pointerEvents: "none",
    backdropFilter: "blur(10px)",
    minWidth: 130,
  }
}
const hudLabel = color => ({
  fontSize: 9, color, fontWeight: 600,
  letterSpacing: ".05em", fontFamily: "var(--font-main)",
  marginBottom: 2,
})
const hudValue = {
  fontSize: 20, fontWeight: 700, color: "#e8eaf2",
  fontFamily: "var(--font-mono)", lineHeight: 1,
}
const hudSub = {
  fontSize: 8, color: "rgba(255,255,255,.3)",
  fontFamily: "var(--font-mono)", marginTop: 3,
}