import InfoTooltip from "./InfoTooltip";

export default function BottomBar({
  params,
  setParams,
  results,
  canNext,
  canPrev,
  onNext,
  onPrev,
  currentIndex,
  total,
  activeStep,
  onConfig,
  configOpen,
}) {
  const update = (key, val) => setParams((p) => ({ ...p, [key]: val }));

  return (
    <div
      style={{
        background: "rgba(13,16,23,.96)",
        borderTop: "1px solid rgba(255,255,255,.07)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-main)",
        backdropFilter: "blur(12px)",
        zIndex: 40,
        flexShrink: 0,
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Anterior */}
      <button
        onClick={onPrev}
        disabled={!canPrev}
        style={navBtn(canPrev, null)}
      >
        ← Ant.
      </button>

      {/* Sliders principales */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 8,
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <SliderCompact
          label="Voltaje"
          unit="V"
          min={1}
          max={30}
          step={0.5}
          value={params.voltage}
          cls=""
          onChange={(v) => update("voltage", v)}
          tooltip="La fuerza que empuja la corriente por el agua. A más voltaje, más H₂ se produce."
          color="#3b82f6"
        />
        <SliderCompact
          label="Resistencia"
          unit="Ω"
          min={0.5}
          max={50}
          step={0.5}
          value={params.resistance}
          cls="red"
          onChange={(v) => update("resistance", v)}
          tooltip="Dificultad del circuito. Menos resistencia = más corriente = más H₂."
          color="#ef4444"
        />
        <SliderCompact
          label="Tiempo"
          unit="s"
          min={1}
          max={7200}
          step={1}
          value={params.time}
          cls="green"
          onChange={(v) => update("time", v)}
          tooltip="Duración del experimento. A más tiempo, más H₂ se acumula."
          color="#4ade80"
        />
      </div>

      {/* Progreso y paso actual */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: activeStep?.color || "var(--text)",
            whiteSpace: "nowrap",
          }}
        >
          {activeStep?.icon} {activeStep?.name}
        </div>
        <div
          style={{
            width: 80,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              width: `${((currentIndex + 1) / total) * 100}%`,
              background: activeStep?.color || "#3b82f6",
              transition: "width .4s ease",
            }}
          />
        </div>
        <div style={{ fontSize: 9, color: "var(--muted)" }}>
          {currentIndex + 1} / {total}
        </div>
      </div>

      {/* Botón configuración */}
      <button
        onClick={onConfig}
        style={{
          background: configOpen
            ? "rgba(129,140,248,.15)"
            : "rgba(255,255,255,.05)",
          border: `1px solid ${configOpen ? "#818cf8" : "rgba(255,255,255,.1)"}`,
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 11,
          color: configOpen ? "#818cf8" : "var(--muted2)",
          cursor: "pointer",
          fontFamily: "var(--font-main)",
          display: "flex",
          alignItems: "center",
          gap: 5,
          transition: "all .2s",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 14 }}>⚙️</span>
        {configOpen ? "Cerrar" : "Config."}
      </button>

      {/* Siguiente */}
      <button
        onClick={onNext}
        disabled={!canNext}
        style={navBtn(canNext, activeStep?.color)}
      >
        Sig. →
      </button>
    </div>
  );
}

function SliderCompact({
  label,
  unit,
  min,
  max,
  step,
  value,
  cls,
  onChange,
  tooltip,
  color,
}) {
  return (
    <div style={{ flex: 1, minWidth: 80 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, color, fontWeight: 600 }}>{label}</span>
          <InfoTooltip text={tooltip} />
        </div>
        <span
          style={{
            fontSize: 10,
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        className={cls}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function navBtn(enabled, color) {
  return {
    background: enabled && color ? color : "rgba(255,255,255,.05)",
    border: `1px solid ${enabled && color ? color : "rgba(255,255,255,.1)"}`,
    borderRadius: 7,
    padding: "5px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: enabled && color ? "#000" : "var(--muted)",
    cursor: enabled ? "pointer" : "not-allowed",
    fontFamily: "var(--font-main)",
    opacity: enabled ? 1 : 0.35,
    flexShrink: 0,
    transition: "all .2s",
  };
}
