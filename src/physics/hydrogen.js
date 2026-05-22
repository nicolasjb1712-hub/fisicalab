// ══════════════════════════════════════════════════
//  FÍSICA DEL SISTEMA COMPLETO H₂
// ══════════════════════════════════════════════════

// Constantes físicas
const LHV_H2 = 119.96; // MJ/kg — Poder calorífico inferior del H₂
const FUEL_CELL_EFF = 0.6; // 60% eficiencia típica pila PEM
const INVERTER_EFF = 0.92; // 92% eficiencia inversor DC/AC
const H2_DENSITY = 0.08988; // kg/m³ a presión atmosférica
const TANK_PRESSURE = 350; // bar — presión de almacenamiento típica
const R_GAS = 8.314; // J/(mol·K)
const MOLAR_MASS_H2 = 0.002016; // kg/mol

// Tarifas eléctricas
export const TARIFA_COP_KWH = 780; // COP por kWh — promedio nacional Colombia
export const TARIFA_USD_KWH = 0.19; // USD por kWh — referencia internacional
export const USD_TO_COP = 4100; // Tasa de cambio aproximada

// Electrodomésticos con datos reales
export const APPLIANCES = [
  {
    id: "led_bulb",
    name: "Bombillo LED",
    watts: 10,
    icon: "💡",
    category: "Iluminación",
    description:
      "Bombillo LED estándar 10W — equivale a un incandescente de 60W",
    dailyHours: 5,
  },
  {
    id: "led_panel",
    name: "Panel LED 50W",
    watts: 50,
    icon: "🔆",
    category: "Iluminación",
    description: "Panel LED para iluminar una habitación completa",
    dailyHours: 6,
  },
  {
    id: "phone_charger",
    name: "Cargador celular",
    watts: 18,
    icon: "📱",
    category: "Electrónica",
    description: "Cargador rápido 18W para smartphone moderno",
    dailyHours: 2,
  },
  {
    id: "laptop",
    name: "Portátil",
    watts: 65,
    icon: "💻",
    category: "Electrónica",
    description: "Laptop de trabajo — consumo promedio con carga moderada",
    dailyHours: 8,
  },
  {
    id: "router",
    name: "Router WiFi",
    watts: 12,
    icon: "📡",
    category: "Electrónica",
    description: "Router doméstico encendido las 24 horas",
    dailyHours: 24,
  },
  {
    id: "fan",
    name: "Ventilador de techo",
    watts: 75,
    icon: "🌀",
    category: "Climatización",
    description: "Ventilador de techo velocidad media",
    dailyHours: 8,
  },
  {
    id: "mini_ac",
    name: "Aire acondicionado 9000 BTU",
    watts: 900,
    icon: "❄️",
    category: "Climatización",
    description: "Minisplit 9000 BTU para habitación de 15 m²",
    dailyHours: 6,
  },
  {
    id: "fridge",
    name: "Nevera pequeña",
    watts: 150,
    icon: "🧊",
    category: "Hogar",
    description: "Refrigerador doméstico 200L — ciclo compresión incluido",
    dailyHours: 24,
  },
  {
    id: "tv_led",
    name: 'Televisor LED 42"',
    watts: 80,
    icon: "📺",
    category: "Entretenimiento",
    description: "TV LED Full HD 42 pulgadas",
    dailyHours: 5,
  },
  {
    id: "washing",
    name: "Lavadora",
    watts: 500,
    icon: "🫧",
    category: "Hogar",
    description: "Lavadora de carga frontal 7kg — ciclo completo",
    dailyHours: 1,
  },
  {
    id: "microwave",
    name: "Microondas",
    watts: 1200,
    icon: "🍳",
    category: "Cocina",
    description: "Microondas doméstico 1200W",
    dailyHours: 0.5,
  },
  {
    id: "water_pump",
    name: "Bomba de agua",
    watts: 370,
    icon: "💧",
    category: "Hogar",
    description: "Bomba centrífuga para presurización doméstica",
    dailyHours: 2,
  },
  {
    id: "security_system",
    name: "Sistema de seguridad",
    watts: 30,
    icon: "🔒",
    category: "Electrónica",
    description: "DVR + 4 cámaras de vigilancia 24/7",
    dailyHours: 24,
  },
  {
    id: "medical_cpap",
    name: "CPAP médico",
    watts: 30,
    icon: "🏥",
    category: "Médico",
    description: "Equipo CPAP para apnea del sueño — uso nocturno",
    dailyHours: 8,
  },
];

// ── Etapa 2: Almacenamiento ──
export function calcularAlmacenamiento(massH2Kg, tankVolumeLiters = 50) {
  // Volumen de H₂ a presión atmosférica (litros)
  const volumenAtmL = (massH2Kg / H2_DENSITY) * 1000;

  // Para visualización usamos un tanque de laboratorio pequeño (2 litros)
  // más apropiado para las cantidades que produce el simulador
  const TANK_LAB_L = 2.0; // litros — tanque de laboratorio
  const fillPercent = Math.min(100, (volumenAtmL / TANK_LAB_L) * 100);

  // Volumen comprimido a 350 bar (para referencia técnica)
  const volumenTankL = volumenAtmL / TANK_PRESSURE;

  // Energía química almacenada
  const energyMJ = massH2Kg * LHV_H2;
  const energyKWh = energyMJ / 3.6;

  return {
    massKg: parseFloat(massH2Kg.toFixed(6)),
    massGrams: parseFloat((massH2Kg * 1000).toFixed(4)),
    volumenAtmL: parseFloat(volumenAtmL.toFixed(4)),
    volumenTankL: parseFloat(volumenTankL.toFixed(6)),
    fillPercent: parseFloat(fillPercent.toFixed(2)),
    energyMJ: parseFloat(energyMJ.toFixed(4)),
    energyKWh: parseFloat(energyKWh.toFixed(5)),
    tankVolume: TANK_LAB_L,
  };
}

// ── Etapa 3: Pila de combustible ──
export function calcularPilaCombustible(massH2Kg) {
  // Energía química disponible
  const energyChemMJ = massH2Kg * LHV_H2;

  // Energía eléctrica generada por la pila (kWh)
  const energyElecKWh = (energyChemMJ / 3.6) * FUEL_CELL_EFF;

  // Potencia estimada (asumiendo descarga en 1 hora como referencia)
  const powerKW = energyElecKWh; // kW si se descarga en 1h

  // Voltaje y corriente típicos de pila PEM
  const cellVoltage = 0.7; // V por celda típica
  const numCells = 10; // celdas en serie
  const stackVoltage = cellVoltage * numCells;
  const stackCurrent = (powerKW * 1000) / stackVoltage;

  // Corriente DC disponible para inversor
  const powerDC_W = energyElecKWh * 1000; // Wh disponibles

  return {
    energyChemMJ: parseFloat(energyChemMJ.toFixed(4)),
    energyElecKWh: parseFloat(energyElecKWh.toFixed(5)),
    powerKW: parseFloat(powerKW.toFixed(4)),
    powerDC_W: parseFloat(powerDC_W.toFixed(3)),
    stackVoltage: parseFloat(stackVoltage.toFixed(1)),
    stackCurrent: parseFloat(stackCurrent.toFixed(2)),
    efficiency: FUEL_CELL_EFF * 100,
  };
}

// ── Etapa 4: Inversor y consumo ──
export function calcularConsumo(energyElecKWh) {
  // Energía AC disponible tras el inversor
  const energyAC_KWh = energyElecKWh * INVERTER_EFF;
  const energyAC_Wh = energyAC_KWh * 1000;

  // Costo equivalente en red eléctrica
  const costoCOP = energyAC_KWh * TARIFA_COP_KWH;
  const costoUSD = energyAC_KWh * TARIFA_USD_KWH;

  // Calcular horas de uso por electrodoméstico
  const applianceData = APPLIANCES.map((a) => {
    const hoursAvailable = energyAC_Wh / a.watts;
    const hoursFormatted =
      hoursAvailable >= 1
        ? `${hoursAvailable.toFixed(1)} h`
        : `${(hoursAvailable * 60).toFixed(0)} min`;
    const feasible = hoursAvailable >= 0.1;

    // Costo de esa energía si viniera de la red
    const costCOP = (a.watts / 1000) * hoursAvailable * TARIFA_COP_KWH;
    const costUSD = (a.watts / 1000) * hoursAvailable * TARIFA_USD_KWH;

    return {
      ...a,
      hoursAvailable: parseFloat(hoursAvailable.toFixed(2)),
      hoursFormatted,
      feasible,
      energyUsed_Wh: parseFloat((a.watts * hoursAvailable).toFixed(1)),
      costCOP: parseFloat(costCOP.toFixed(0)),
      costUSD: parseFloat(costUSD.toFixed(4)),
    };
  });

  return {
    energyAC_KWh: parseFloat(energyAC_KWh.toFixed(5)),
    energyAC_Wh: parseFloat(energyAC_Wh.toFixed(3)),
    costoCOP: parseFloat(costoCOP.toFixed(0)),
    costoUSD: parseFloat(costoUSD.toFixed(4)),
    inverterEff: INVERTER_EFF * 100,
    appliances: applianceData,
  };
}

// ── Agua lluvia ──
export const WATER_SOURCES = [
  {
    id: "rain",
    label: "Agua lluvia filtrada",
    conductivity: 0.85,
    ph: 6.5,
    purity: 92,
    costPerL_COP: 0,
    costPerL_USD: 0,
  },
  {
    id: "distilled",
    label: "Agua destilada",
    conductivity: 0.15,
    ph: 7.0,
    purity: 99,
    costPerL_COP: 2500,
    costPerL_USD: 0.6,
  },
  {
    id: "tap",
    label: "Agua de acueducto",
    conductivity: 0.6,
    ph: 7.2,
    purity: 78,
    costPerL_COP: 4,
    costPerL_USD: 0.001,
  },
  {
    id: "nacoh",
    label: "Agua + NaOH 1M",
    conductivity: 1.0,
    ph: 14.0,
    purity: 95,
    costPerL_COP: 800,
    costPerL_USD: 0.2,
  },
];
