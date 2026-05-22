import { SYSTEM_QUALITY } from "../physics/faraday";
import EnergySelector from "./EnergySelector";
import InfoTooltip from "./InfoTooltip";
import Glossary from "./Glossary";

export default function ControlPanel({ params, setParams, results }) {
  const update = (key, val) => setParams((p) => ({ ...p, [key]: val }));

  const electrolytes = [
    { label: "NaOH 1M — pH 14", value: "1.0,14" },
    { label: "KOH 1M — pH 14", value: "0.9,14" },
    { label: "H₂SO₄ 0.5M — pH 1", value: "0.85,1" },
    { label: "NaCl 0.1M — pH 7", value: "0.6,7" },
    { label: "Agua destilada — pH 7", value: "0.15,7" },
  ];

  const electrodes = [
    "Platino (Pt)",
    "Grafito (C)",
    "Níquel (Ni)",
    "Acero (Fe)",
  ];

  return (
    <aside
      style={{
        background: "var(--bg2)",
        borderLeft: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "var(--font-main)",
      }}
    >
      {/* ── Métricas ── */}
      <Section title="Magnitudes en tiempo real">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          <MCard label="Voltaje" value={params.voltage.toFixed(1)} unit="V" />
          <MCard
            label="Corriente"
            value={results.current.toFixed(3)}
            unit="A"
          />
          <MCard
            label="H₂ producido"
            value={results.massH2.toFixed(5)}
            unit="g"
            color="#3b82f6"
            bg="rgba(59,130,246,.07)"
            border="rgba(59,130,246,.2)"
          />
          <MCard
            label="O₂ producido"
            value={results.massO2.toFixed(5)}
            unit="g"
            color="#ef4444"
            bg="rgba(239,68,68,.07)"
            border="rgba(239,68,68,.2)"
          />
          <MCard
            label="Potencia"
            value={results.power.toFixed(2)}
            unit="W"
            color="#4ade80"
            bg="rgba(74,222,128,.06)"
            border="rgba(74,222,128,.18)"
          />
          <MCard
            label="Carga acum."
            value={results.charge.toFixed(2)}
            unit="C"
            color="#fbbf24"
            bg="rgba(251,191,36,.06)"
            border="rgba(251,191,36,.18)"
          />
          <MCard
            label="Energía"
            value={(results.energy / 1000).toFixed(3)}
            unit="kJ"
            color="#818cf8"
            bg="rgba(129,140,248,.06)"
            border="rgba(129,140,248,.18)"
          />
          <MCard
            label="pH solución"
            value={params.ph.toFixed(1)}
            unit=""
            color="#22d3ee"
            bg="rgba(34,211,238,.06)"
            border="rgba(34,211,238,.18)"
          />
        </div>
      </Section>

      {/* ── Fuente de energía ── */}
      <EnergySelector
        selectedSource={params.energySource}
        onChange={(id) => update("energySource", id)}
        massH2Grams={results.massH2}
        energyKWh={results.energy / 3600000}
      />

      {/* ── Sliders ── */}
      <Section title="Control de variables">
        <Slider
          label="Voltaje"
          unit="V"
          min={1}
          max={30}
          step={0.5}
          cls=""
          value={params.voltage}
          onChange={(v) => update("voltage", v)}
          tooltip="La fuerza que empuja la corriente por el agua. A más voltaje, más H₂ se produce por segundo."
        />
        <Slider
          label="Resistencia"
          unit="Ω"
          min={0.5}
          max={50}
          step={0.5}
          cls="red"
          value={params.resistance}
          onChange={(v) => update("resistance", v)}
          tooltip="Dificultad del circuito. Menos resistencia = más corriente = más H₂ producido."
        />
        <Slider
          label="Tiempo"
          unit="s"
          min={1}
          max={7200}
          step={1}
          cls="green"
          value={params.time}
          onChange={(v) => update("time", v)}
          tooltip="Duración del experimento. A más tiempo, más H₂ se acumula en el tanque."
        />
      </Section>

      {/* ── Electrolito ── */}
      <Section title="Electrolito">
        <LabelWithTip
          label="Sustancia en el agua"
          tip="Mejora la conductividad eléctrica del agua. Sin electrolito, el agua pura casi no conduce corriente."
        />
        <select
          style={sel}
          onChange={(e) => {
            const [c, p] = e.target.value.split(",").map(Number);
            setParams((prev) => ({ ...prev, electrolyte: c, ph: p }));
          }}
        >
          {electrolytes.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </Section>

      {/* ── Calidad del sistema ── */}
      <Section title="Calidad del sistema">
        <LabelWithTip
          label="Nivel del electrolizador"
          tip="Representa la tecnología del equipo. Un sistema avanzado PEM produce 3.5× más H₂ con la misma energía que uno básico."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {Object.values(SYSTEM_QUALITY).map((sq) => {
            const active = params.systemQuality === sq.id;
            const effPercent = Math.min(
              85,
              Math.round(sq.efficiencyMultiplier * 24),
            );
            return (
              <button
                key={sq.id}
                onClick={() => update("systemQuality", sq.id)}
                style={{
                  background: active
                    ? "rgba(74,222,128,.08)"
                    : "var(--surface)",
                  border: `1px solid ${active ? "#4ade80" : "var(--border2)"}`,
                  borderRadius: 7,
                  padding: "7px 10px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all .2s",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: active ? "#4ade80" : "var(--text)",
                    }}
                  >
                    {sq.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      marginTop: 1,
                    }}
                  >
                    {sq.description}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: active ? "#4ade80" : "var(--muted2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ≈{effPercent}%
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Electrodos ── */}
      <Section title="Material de electrodos">
        <LabelWithTip
          label="Conductor en el agua"
          tip="El electrodo negativo produce H₂ y el positivo O₂. El platino es el más eficiente pero costoso. El níquel es el estándar industrial."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 5,
            marginBottom: 8,
          }}
        >
          {electrodes.map((e) => (
            <button
              key={e}
              onClick={() => update("electrode", e)}
              style={{
                padding: "6px 0",
                borderRadius: 7,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-main)",
                border:
                  params.electrode === e
                    ? "1px solid #3b82f6"
                    : "1px solid var(--border2)",
                background:
                  params.electrode === e
                    ? "rgba(59,130,246,.1)"
                    : "var(--surface)",
                color: params.electrode === e ? "#3b82f6" : "var(--muted2)",
                transition: "all .2s",
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            padding: "7px 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "var(--muted2)" }}>
            Eficiencia del electrodo
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color:
                results.electrodeEff >= 90
                  ? "#4ade80"
                  : results.electrodeEff >= 75
                    ? "#fbbf24"
                    : "#ef4444",
            }}
          >
            {results.electrodeEff}%
          </span>
        </div>
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: "var(--surface2)",
            overflow: "hidden",
            marginTop: 5,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${results.electrodeEff}%`,
              borderRadius: 2,
              background:
                results.electrodeEff >= 90
                  ? "#4ade80"
                  : results.electrodeEff >= 75
                    ? "#fbbf24"
                    : "#ef4444",
              transition: "width .4s ease",
            }}
          />
        </div>
      </Section>

      {/* ── Fórmulas ── */}
      <Section title="Leyes físicas aplicadas">
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--muted)",
            lineHeight: 2,
          }}
        >
          <Row
            label="Ley de Ohm"
            formula={`I = V/R → ${results.current.toFixed(3)} A`}
            color="var(--cyan)"
          />
          <Row
            label="1ª Ley Faraday"
            formula="m = (M × I × t) / (n × F)"
            color="var(--muted2)"
          />
          <Row
            label="m(H₂)"
            formula={`${results.massH2.toFixed(6)} g`}
            color="var(--cyan)"
          />
          <Row
            label="m(O₂)"
            formula={`${results.massO2.toFixed(6)} g`}
            color="var(--red)"
          />
          <Row
            label="Potencia"
            formula={`P = V×I → ${results.power.toFixed(2)} W`}
            color="var(--cyan)"
          />
          <Row
            label="Energía"
            formula={`E = P×t → ${(results.energy / 1000).toFixed(4)} kJ`}
            color="var(--cyan)"
          />
          <Row
            label="F (Faraday)"
            formula="96,485 C/mol"
            color="var(--amber)"
          />
        </div>
      </Section>

      {/* ── Glosario ── */}
      {/* <Section title="Glosario de términos" last>
        <Glossary />
      </Section> */}
    </aside>
  );
}

/* ── helpers ── */
function LabelWithTip({ label, tip }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}
    >
      <span style={{ fontSize: 11, color: "var(--muted)" }}>{label}</span>
      <InfoTooltip text={tip} />
    </div>
  );
}

function Row({ label, formula, color }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: "var(--border2)",
          textTransform: "uppercase",
          letterSpacing: ".06em",
        }}
      >
        {label}
      </span>
      <span style={{ color, fontWeight: 600 }}>{formula}</span>
    </div>
  );
}

function Section({ title, children, last }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderBottom: last ? "none" : "1px solid var(--border)",
        flex: last ? 1 : "none",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        {title}
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      {children}
    </div>
  );
}

function MCard({
  label,
  value,
  unit,
  color = "var(--text)",
  bg = "var(--surface)",
  border = "var(--border)",
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: "8px 10px",
      }}
    >
      <div
        style={{
          fontSize: 16,
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
            fontWeight: 400,
            color: "var(--muted)",
            marginLeft: 2,
          }}
        >
          {unit}
        </span>
      </div>
      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}

function Slider({
  label,
  tooltip,
  value,
  unit,
  min,
  max,
  step,
  onChange,
  cls,
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 12, color: "var(--muted2)" }}>{label}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <strong
          style={{
            fontSize: 12,
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {value} {unit}
        </strong>
      </div>
      <input
        type="range"
        className={cls}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}
      >
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          style={{
            width: 70,
            fontSize: 12,
            padding: "3px 7px",
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            borderRadius: 6,
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            outline: "none",
          }}
        />
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{unit}</span>
      </div>
    </div>
  );
}

const sel = {
  width: "100%",
  fontSize: 12,
  padding: "6px 9px",
  borderRadius: 7,
  background: "var(--surface2)",
  border: "1px solid var(--border2)",
  color: "var(--text)",
  outline: "none",
  cursor: "pointer",
  fontFamily: "var(--font-main)",
};
