import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Scene3D from "./components/Scene3D";
import Topbar from "./components/Topbar";
import Logbar from "./components/Logbar";
import StoragePanel from "./components/StoragePanel";
import FuelCellPanel from "./components/FuelCellPanel";
import ConsumptionPanel from "./components/ConsumptionPanel";
import TransportPanel from "./components/TransportPanel";
import HUDOverlay from "./components/HUDOverlay";
import BottomBar from "./components/BottomBar";
import ConfigDrawer from "./components/ConfigDrawer";
import { calcular } from "./physics/faraday";
import { calcularPilaCombustible } from "./physics/hydrogen";
import GlossaryButton from "./components/GlossaryButton";

const STEPS = [
  { id: "electrolysis", icon: "⚡", name: "Electrólisis", color: "#f59e0b" },
  { id: "storage", icon: "🔵", name: "Almacenamiento", color: "#06b6d4" },
  { id: "fuelcell", icon: "⚙️", name: "Pila PEM", color: "#8b5cf6" },
  { id: "consumption", icon: "🏠", name: "Hogar", color: "#4ade80" },
  { id: "transport", icon: "🚗", name: "Transporte", color: "#f97316" },
];

export default function App() {
  const [params, setParams] = useState({
    voltage: 12,
    resistance: 5,
    time: 60,
    electrolyte: 1.0,
    ph: 14,
    electrode: "Platino (Pt)",
    energySource: "solar",
    systemQuality: "basic",
    vehicle: "car",
  });
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("electrolysis");
  const [waterSource, setWaterSource] = useState("rain");
  const [configOpen, setConfigOpen] = useState(false);

  const results = calcular(
    params.voltage,
    params.resistance,
    params.time,
    params.electrolyte,
    params.electrode,
    params.systemQuality,
  );
  const fuelCell = calcularPilaCombustible(results.massH2 / 1000);

  const currentIndex = STEPS.findIndex((s) => s.id === activeTab);
  const canNext = currentIndex < STEPS.length - 1;
  const canPrev = currentIndex > 0;

  const goNext = () => canNext && setActiveTab(STEPS[currentIndex + 1].id);
  const goPrev = () => canPrev && setActiveTab(STEPS[currentIndex - 1].id);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
      setHistory((prev) => [
        ...prev.slice(-300),
        {
          t: prev.length,
          H2: results.massH2,
          O2: results.massO2,
          I: results.current,
          V: params.voltage,
          P: results.power,
        },
      ]);
    }, 1000);
    return () => clearInterval(id);
  }, [running, results, params.voltage]);

  const handleReset = useCallback(() => {
    setSeconds(0);
    setHistory([]);
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = "Tiempo(s),H2(g),O2(g),Corriente(A),Voltaje(V),Potencia(W)";
    const rows = history
      .map(
        (r) =>
          `${r.t},${r.H2.toFixed(6)},${r.O2.toFixed(6)},${r.I.toFixed(3)},${r.V},${r.P.toFixed(2)}`,
      )
      .join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `electrolisis_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [history]);

  return (
    <div className="app-layout">
      {/* Topbar fija arriba */}
      <Topbar
        seconds={seconds}
        running={running}
        onToggle={() => setRunning((r) => !r)}
        onReset={handleReset}
        onExport={handleExportCSV}
        hasData={history.length > 0}
      />

      {/* Zona de contenido — ocupa todo el espacio restante */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Vista principal según paso activo */}
        {activeTab === "electrolysis" && (
          <Scene3D params={params} results={results} running={running} />
        )}
        {activeTab === "storage" && (
          <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <StoragePanel
              massH2Grams={results.massH2}
              waterSource={waterSource}
              onWaterSourceChange={setWaterSource}
            />
          </div>
        )}
        {activeTab === "fuelcell" && (
          <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <FuelCellPanel massH2Grams={results.massH2} />
          </div>
        )}
        {activeTab === "consumption" && (
          <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <ConsumptionPanel energyElecKWh={fuelCell.energyElecKWh} />
          </div>
        )}
        {activeTab === "transport" && (
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <TransportPanel
              massH2Grams={results.massH2}
              vehicleId={params.vehicle}
              onVehicleChange={(id) =>
                setParams((p) => ({ ...p, vehicle: id }))
              }
            />
          </div>
        )}

        {/* HUD flotante — solo en electrólisis */}
        {activeTab === "electrolysis" && (
          <HUDOverlay results={results} params={params} />
        )}

        {/* Pasos en píldoras — siempre visibles sobre el contenido */}
        <StepPills
          steps={STEPS}
          activeTab={activeTab}
          onChange={setActiveTab}
          currentIndex={currentIndex}
        />

        {/* Drawer de configuración avanzada */}
        <ConfigDrawer
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          params={params}
          setParams={setParams}
          results={results}
        />
      </div>

      {/* Barra inferior fija */}
      <BottomBar
        params={params}
        setParams={setParams}
        results={results}
        canNext={canNext}
        canPrev={canPrev}
        onNext={goNext}
        onPrev={goPrev}
        currentIndex={currentIndex}
        total={STEPS.length}
        activeStep={STEPS[currentIndex]}
        onConfig={() => setConfigOpen((o) => !o)}
        configOpen={configOpen}
      />
      <GlossaryButton />
      <Logbar
        params={params}
        results={results}
        seconds={seconds}
        running={running}
      />
    </div>
  );
}
function StepPills({ steps, activeTab, onChange, currentIndex }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        background: "rgba(7,9,15,.95)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 30,
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        gap: 5,
        backdropFilter: "blur(14px)",
        boxShadow: "0 2px 16px rgba(0,0,0,.4)",
      }}
    >
      {steps.map((step, i) => {
        const isCurrent = step.id === activeTab;
        const isPast = i < currentIndex;

        return (
          <div
            key={step.id}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <button
              onClick={() => onChange(step.id)}
              title={step.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: isCurrent ? "5px 12px" : "5px 9px",
                borderRadius: 20,
                background: isCurrent
                  ? `${step.color}18`
                  : isPast
                    ? "rgba(74,222,128,.07)"
                    : "transparent",
                border: `${isCurrent ? "1.5px" : "1px"} solid ${
                  isCurrent
                    ? `${step.color}60`
                    : isPast
                      ? "rgba(74,222,128,.2)"
                      : "rgba(255,255,255,.08)"
                }`,
                cursor: "pointer",
                outline: "none",
                transition: "all .22s cubic-bezier(.4,0,.2,1)",
              }}
            >
              {/* Check si completado */}
              {isPast && !isCurrent && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M2 5L4.2 7.5L8.5 2.5"
                    stroke="rgba(74,222,128,.65)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {/* Número monospace */}
              <span
                style={{
                  fontSize: 10,
                  lineHeight: 1,
                  fontFamily: "monospace",
                  letterSpacing: ".06em",
                  color: isCurrent
                    ? step.color
                    : isPast
                      ? "rgba(74,222,128,.65)"
                      : "rgba(255,255,255,.4)",
                  fontWeight: 700,
                }}
              >
                {step.label || String(i + 1).padStart(2, "0")}
              </span>

              {/* Nombre solo en el activo */}
              {isCurrent && (
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: 1,
                    color: step.color,
                    fontFamily: "var(--font-main)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    letterSpacing: ".01em",
                  }}
                >
                  {step.name}
                </span>
              )}
            </button>

            {/* Separador */}
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 7,
                  height: 1,
                  flexShrink: 0,
                  background:
                    i < currentIndex
                      ? "rgba(74,222,128,.18)"
                      : "rgba(255,255,255,.07)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
