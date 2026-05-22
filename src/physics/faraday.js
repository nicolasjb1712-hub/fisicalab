const F_CONST = 96485;
const M_H2 = 2.016;
const M_O2 = 32.0;
const V_MIN = 1.23;

// Calidad del sistema — afecta la eficiencia del proceso completo
export const SYSTEM_QUALITY = {
  basic: {
    id: "basic",
    label: "Sistema básico (actual)",
    efficiencyMultiplier: 1.0, // sin mejora
    description: "Laboratorio estándar 20-30% eficiencia",
  },
  commercial: {
    id: "commercial",
    label: "Sistema comercial",
    efficiencyMultiplier: 2.5,
    description: "Electrolizador alcalino industrial 60-70%",
  },
  advanced: {
    id: "advanced",
    label: "Sistema avanzado PEM",
    efficiencyMultiplier: 3.5,
    description: "Membrana PEM de última generación 80-85%",
  },
};

const ELECTRODE_EFFICIENCY = {
  "Platino (Pt)": 1.0,
  "Grafito (C)": 0.78,
  "Níquel (Ni)": 0.89,
  "Acero (Fe)": 0.65,
};

export function calcular(
  voltage,
  resistance,
  time,
  conductivity,
  electrode = "Platino (Pt)",
  systemQuality = "basic",
) {
  const electrodeEff = ELECTRODE_EFFICIENCY[electrode] ?? 1.0;
  const system = SYSTEM_QUALITY[systemQuality] || SYSTEM_QUALITY.basic;

  // Eficiencia combinada — electrodo × calidad del sistema
  const totalEff = electrodeEff * system.efficiencyMultiplier;

  const current = (voltage / resistance) * conductivity;
  const power = voltage * current;
  const charge = current * time;
  const energy = power * time;

  // Masa afectada por la eficiencia total del sistema
  const massH2 = (M_H2 * charge * totalEff) / (2 * F_CONST);
  const massO2 = (M_O2 * charge * totalEff) / (4 * F_CONST);

  // Eficiencia energética aparente
  const energyEfficiency =
    voltage > 0 ? Math.min(100, (V_MIN / voltage) * 100 * totalEff) : 0;

  return {
    current: parseFloat(current.toFixed(3)),
    effectiveCurrent: parseFloat(current.toFixed(3)),
    power: parseFloat(power.toFixed(2)),
    charge: parseFloat(charge.toFixed(2)),
    energy: parseFloat(energy.toFixed(2)),
    massH2: parseFloat(massH2.toFixed(6)),
    massO2: parseFloat(massO2.toFixed(6)),
    efficiency: parseFloat(energyEfficiency.toFixed(1)),
    electrodeEff: parseFloat((electrodeEff * 100).toFixed(0)),
    systemEff: parseFloat((Math.min(1, totalEff) * 100).toFixed(0)),
    systemLabel: system.label,
  };
}
