import { SYSTEM_QUALITY } from "../physics/faraday";
import EnergySelector from "./EnergySelector";
import Glossary from "./Glossary";
import StepExplainer from "./StepExplainer";
import InfoTooltip from "./InfoTooltip";

export default function ConfigDrawer({
  open,
  onClose,
  params,
  setParams,
  results,
}) {
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
    <>
      {/* Fondo semitransparente */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 45,
            background: "rgba(0,0,0,.4)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Panel que sube desde abajo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          background: "var(--bg2)",
          borderTop: "1px solid rgba(255,255,255,.1)",
          borderRadius: "16px 16px 0 0",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform .35s cubic-bezier(.4,0,.2,1)",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Handle + header */}
        <div
          style={{
            padding: "12px 20px 10px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,.15)",
              margin: "0 auto 0 auto",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 8,
            }}
          />
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text)",
              flex: 1,
            }}
          >
            ⚙️ Configuración avanzada
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              fontSize: 18,
              cursor: "pointer",
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div style={{ overflowY: "auto", flex: 1, padding: "0 0 20px" }}>
          {/* Explicador del paso */}
          <div style={{ padding: "12px 20px 0" }}>
            <StepExplainer activeTab={params.activeTab || "electrolysis"} />
          </div>

          {/* Fuente de energía */}
          <EnergySelector
            selectedSource={params.energySource}
            onChange={(id) => update("energySource", id)}
            massH2Grams={results.massH2}
            energyKWh={results.energy / 3600000}
          />

          {/* Electrolito */}
          <Section title="Electrolito">
            <LabelTip
              label="Sustancia en el agua"
              tip="Mejora la conductividad. Sin electrolito el agua pura casi no conduce corriente."
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

          {/* Calidad del sistema */}
          <Section title="Calidad del sistema">
            <LabelTip
              label="Nivel del electrolizador"
              tip="Sistema avanzado PEM produce 3.5× más H₂ con la misma energía que uno básico."
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {Object.values(SYSTEM_QUALITY).map((sq) => {
                const active = params.systemQuality === sq.id;
                const eff = Math.min(
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
                      ≈{eff}%
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Electrodos */}
          <Section title="Material de electrodos">
            <LabelTip
              label="Conductor en el agua"
              tip="El electrodo negativo produce H₂ y el positivo O₂. El platino es el más eficiente."
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
                padding: "6px 10px",
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
          </Section>

          {/* Fórmulas */}
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
              {[
                [
                  "Ley de Ohm",
                  `I = V/R → ${results.current.toFixed(3)} A`,
                  "var(--cyan)",
                ],
                ["1ª Faraday", "m = (M × I × t) / (n × F)", "var(--muted2)"],
                ["m(H₂)", `${results.massH2.toFixed(6)} g`, "var(--cyan)"],
                ["m(O₂)", `${results.massO2.toFixed(6)} g`, "var(--red)"],
                [
                  "Potencia",
                  `P = V×I → ${results.power.toFixed(2)} W`,
                  "var(--cyan)",
                ],
                [
                  "Energía",
                  `E = P×t → ${(results.energy / 1000).toFixed(4)} kJ`,
                  "var(--cyan)",
                ],
                ["F (Faraday)", "96,485 C/mol", "var(--amber)"],
              ].map(([lbl, val, col]) => (
                <div
                  key={lbl}
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
                    {lbl}
                  </span>
                  <span style={{ color: col, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Glosario */}
          {/* <Section title="Glosario de términos" last>
            <Glossary />
          </Section> */}
        </div>
      </div>
    </>
  );
}

function LabelTip({ label, tip }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}
    >
      <span style={{ fontSize: 11, color: "var(--muted)" }}>{label}</span>
      <InfoTooltip text={tip} />
    </div>
  );
}

function Section({ title, children, last }) {
  return (
    <div
      style={{
        padding: "12px 20px",
        borderBottom: last ? "none" : "1px solid var(--border)",
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
