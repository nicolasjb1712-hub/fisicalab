// ══════════════════════════════════════════════════
//  FUENTES DE ENERGÍA PARA LA ELECTRÓLISIS
// ══════════════════════════════════════════════════

export const ENERGY_SOURCES = [
  {
    id: "solar",
    name: "Panel Solar",
    icon: "☀️",
    color: "#fbbf24",
    h2Color: "Verde",
    h2ColorHex: "#4ade80",
    renewable: true,
    co2PerKgH2: 0.0, // kg CO₂ por kg de H₂ producido
    costPerKWh_COP: 420, // costo más bajo a largo plazo
    costPerKWh_USD: 0.1,
    availability: "Diurna", // solo de día
    availabilityFactor: 0.45, // 45% del día promedio útil
    description:
      "Energía solar fotovoltaica. Produce hidrógeno 100% limpio durante horas de sol.",
    pros: ["Cero emisiones", "Costo decreciente", "Fuente inagotable"],
    cons: ["Solo funciona de día", "Requiere espacio amplio"],
  },
  {
    id: "wind",
    name: "Turbina Eólica",
    icon: "💨",
    color: "#22d3ee",
    h2Color: "Verde",
    h2ColorHex: "#4ade80",
    renewable: true,
    co2PerKgH2: 0.0,
    costPerKWh_COP: 380,
    costPerKWh_USD: 0.09,
    availability: "24/7 variable",
    availabilityFactor: 0.35,
    description:
      "Energía eólica. Turbinas que aprovechan el viento día y noche.",
    pros: ["Funciona día y noche", "Menor costo operativo", "Cero emisiones"],
    cons: ["Depende del viento", "Impacto visual y sonoro"],
  },
  {
    id: "hydro",
    name: "Hidroeléctrica",
    icon: "💧",
    color: "#3b82f6",
    h2Color: "Verde",
    h2ColorHex: "#4ade80",
    renewable: true,
    co2PerKgH2: 0.0,
    costPerKWh_COP: 320,
    costPerKWh_USD: 0.08,
    availability: "24/7 constante",
    availabilityFactor: 0.92,
    description:
      "Energía de represas y caídas de agua. La más estable de las renovables.",
    pros: ["Disponible 24/7", "Más barata", "Alta confiabilidad"],
    cons: [
      "Requiere infraestructura grande",
      "Impacto en ecosistemas fluviales",
    ],
  },
  {
    id: "mixed",
    name: "Red Eléctrica Nacional",
    icon: "🔌",
    color: "#fb923c",
    h2Color: "Amarillo",
    h2ColorHex: "#facc15",
    renewable: false,
    co2PerKgH2: 11.5, // promedio Colombia
    costPerKWh_COP: 780,
    costPerKWh_USD: 0.19,
    availability: "24/7 constante",
    availabilityFactor: 1.0,
    description:
      "Red eléctrica estándar. Mezcla de hidroeléctrica, térmica y fósiles.",
    pros: ["Siempre disponible", "Ya existe la infraestructura"],
    cons: ["Emisiones indirectas de CO₂", "Costo más alto"],
  },
  {
    id: "fossil",
    name: "Carbón / Gas Natural",
    icon: "🏭",
    color: "#6b7280",
    h2Color: "Gris",
    h2ColorHex: "#9ca3af",
    renewable: false,
    co2PerKgH2: 22.0, // el peor escenario
    costPerKWh_COP: 650,
    costPerKWh_USD: 0.16,
    availability: "24/7 constante",
    availabilityFactor: 1.0,
    description:
      'Energía 100% de combustibles fósiles. El "hidrógeno gris" industrial.',
    pros: ["Disponibilidad total", "Tecnología madura"],
    cons: [
      "Alta huella de CO₂",
      "No es sostenible a largo plazo",
      "Contamina el aire",
    ],
  },
];

// ══════════════════════════════════════════════════
//  CLASIFICACIÓN COLORES DEL HIDRÓGENO
// ══════════════════════════════════════════════════
export const H2_COLORS = {
  Verde: {
    hex: "#4ade80",
    desc: "Producido con 100% energía renovable — cero emisiones",
  },
  Amarillo: { hex: "#facc15", desc: "Mezcla de fuentes renovables y fósiles" },
  Gris: {
    hex: "#9ca3af",
    desc: "Producido con combustibles fósiles — alta huella CO₂",
  },
};

// ══════════════════════════════════════════════════
//  CÁLCULO DE IMPACTO AMBIENTAL
// ══════════════════════════════════════════════════
export function calcularImpactoAmbiental(sourceId, massH2Grams, energyKWh) {
  const source =
    ENERGY_SOURCES.find((s) => s.id === sourceId) || ENERGY_SOURCES[3];
  const massH2Kg = massH2Grams / 1000;

  const emisionesCO2 = massH2Kg * source.co2PerKgH2; // kg CO₂
  const costoEnergiaCOP = energyKWh * source.costPerKWh_COP;
  const costoEnergiaUSD = energyKWh * source.costPerKWh_USD;

  // Ahorro comparado con fuente fósil
  const fossil = ENERGY_SOURCES.find((s) => s.id === "fossil");
  const emisionesEvitadas = Math.max(
    0,
    (fossil.co2PerKgH2 - source.co2PerKgH2) * massH2Kg,
  );

  // Equivalencias ambientales
  const arbolesEquivalentes = emisionesEvitadas / 21; // 1 árbol absorbe ~21 kg CO₂/año
  const kmAutoEquivalentes = emisionesEvitadas / 0.12; // 0.12 kg CO₂ por km de auto promedio

  return {
    source,
    emisionesCO2: parseFloat(emisionesCO2.toFixed(4)),
    costoEnergiaCOP: parseFloat(costoEnergiaCOP.toFixed(0)),
    costoEnergiaUSD: parseFloat(costoEnergiaUSD.toFixed(4)),
    emisionesEvitadas: parseFloat(emisionesEvitadas.toFixed(4)),
    arbolesEquivalentes: parseFloat(arbolesEquivalentes.toFixed(2)),
    kmAutoEquivalentes: parseFloat(kmAutoEquivalentes.toFixed(1)),
    h2Color: source.h2Color,
    h2ColorHex: source.h2ColorHex,
  };
}
