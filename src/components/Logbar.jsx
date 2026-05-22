import { useRef, useEffect } from "react";

export default function Logbar({ params, results, seconds }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const msg =
    `[${mm}:${ss}]  V=${params.voltage.toFixed(1)}V  ` +
    `I=${results.current.toFixed(3)}A  ` +
    `H₂=${results.massH2.toFixed(5)}g  ` +
    `O₂=${results.massO2.toFixed(5)}g  ` +
    `P=${results.power.toFixed(2)}W  ` +
    `E=${(results.energy / 1000).toFixed(3)}kJ  ` +
    `Q=${results.charge.toFixed(2)}C  ` +
    `Electrodo: ${params.electrode}  ` +
    `Electrolito: conductividad=${params.electrolyte}  pH=${params.ph}`;

  return (
    <footer
      style={{
        gridColumn: "1 / -1",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
      }}
    >
      <span
        style={{
          color: "var(--green)",
          marginRight: 10,
          whiteSpace: "nowrap",
          fontWeight: 700,
        }}
      >
        SYS &gt;
      </span>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <span
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            color: "var(--muted)",
            animation: "scroll-log 20s linear infinite",
          }}
        >
          {msg}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{msg}
        </span>
      </div>
      <style>{`@keyframes scroll-log { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </footer>
  );
}
