// ══════════════════════════════════════════════════
//  FÍSICA DEL TRANSPORTE CON HIDRÓGENO
// ══════════════════════════════════════════════════

// Consumo real: Toyota Mirai consume ~0.89 kg H₂ / 100 km
const H2_CONSUMPTION_KG_PER_100KM = 0.89;

// Capacidad tanque típica: 5.6 kg a 700 bar
const TANK_CAPACITY_KG = 5.6;

// Velocidad carga en estación H₂: 3-5 min para tanque lleno
const REFUEL_TIME_MINUTES = 4;

// Velocidad de electrólisis doméstica vs comercial
const DOMESTIC_H2_PER_HOUR_G = 2.0; // gramos H₂ por hora en sistema casero

// Autonomía máxima con tanque lleno
const MAX_RANGE_KM = (TANK_CAPACITY_KG / H2_CONSUMPTION_KG_PER_100KM) * 100; // ~629 km

// ══════════════════════════════════════════════════
//  VEHÍCULOS
// ══════════════════════════════════════════════════
export const VEHICLES = [
  {
    id: "car",
    name: "Carro H₂",
    icon: "🚗",
    color: "#3b82f6",
    model: "Sedán tipo Toyota Mirai",
    tank_kg: 5.6,
    h2_per_100km_kg: 0.89,
    max_range_km: 629,
    cost_per_km_COP: 95,
    cost_per_km_USD: 0.023,
    refuel_minutes: 4,
    max_speed_kmh: 175,
  },
  {
    id: "motorcycle",
    name: "Moto H₂",
    icon: "🏍️",
    color: "#fb923c",
    model: "Suzuki Burgman Fuel Cell",
    tank_kg: 1.0,
    h2_per_100km_kg: 0.18,
    max_range_km: 555,
    cost_per_km_COP: 32,
    cost_per_km_USD: 0.008,
    refuel_minutes: 3,
    max_speed_kmh: 120,
  },
  {
    id: "bike",
    name: "Bicicleta H₂",
    icon: "🚲",
    color: "#4ade80",
    model: "Pragma Alpha con pila H₂",
    tank_kg: 0.12,
    h2_per_100km_kg: 0.015,
    max_range_km: 800,
    cost_per_km_COP: 6,
    cost_per_km_USD: 0.0015,
    refuel_minutes: 2,
    max_speed_kmh: 35,
  },
];

// ══════════════════════════════════════════════════
//  DESTINOS DE EJEMPLO — Colombia
// ══════════════════════════════════════════════════
export const DESTINATIONS = [
  // Cortos (ciudad)
  {
    id: "mayales",
    name: "Barrio Los Mayales",
    km: 3,
    icon: "🏘️",
    type: "Cercano",
  },
  {
    id: "centro",
    name: "Centro histórico",
    km: 5,
    icon: "🏛️",
    type: "Cercano",
  },
  {
    id: "guatapuri",
    name: "Balneario Hurtado",
    km: 7,
    icon: "💦",
    type: "Cercano",
  },
  {
    id: "upc",
    name: "Universidad Popular Cesar",
    km: 9,
    icon: "🎓",
    type: "Cercano",
  },

  {
    id: "andina",
    name: "Universidad Andina",
    km: 12,
    icon: "🎓",
    type: "Cercano",
  },

  // Medianos (alrededores)
  {
    id: "aguachica",
    name: "Valledupar → La Paz",
    km: 25,
    icon: "🏞️",
    type: "Medio",
  },
  {
    id: "sanjuan",
    name: "Valledupar → San Juan Cesar",
    km: 62,
    icon: "🌄",
    type: "Medio",
  },
  {
    id: "codazzi",
    name: "Valledupar → Agustín Codazzi",
    km: 50,
    icon: "🌿",
    type: "Medio",
  },
  {
    id: "mbecerril",
    name: "Valledupar → Becerril",
    km: 85,
    icon: "⛰️",
    type: "Medio",
  },

  // Largos (departamental e interdep.)
  {
    id: "santamar",
    name: "Valledupar → Santa Marta",
    km: 205,
    icon: "🏖️",
    type: "Largo",
  },
  {
    id: "riohacha",
    name: "Valledupar → Riohacha",
    km: 165,
    icon: "🏝️",
    type: "Largo",
  },
  {
    id: "bquilla",
    name: "Valledupar → Barranquilla",
    km: 295,
    icon: "🌊",
    type: "Largo",
  },
  {
    id: "cartagena",
    name: "Valledupar → Cartagena",
    km: 420,
    icon: "🏰",
    type: "Largo",
  },
  {
    id: "bucaraman",
    name: "Valledupar → Bucaramanga",
    km: 490,
    icon: "🏔️",
    type: "Largo",
  },
  {
    id: "bogota",
    name: "Valledupar → Bogotá",
    km: 930,
    icon: "🗼",
    type: "Muy largo",
  },
];

// ══════════════════════════════════════════════════
//  TIPOS DE CARRO PARA COMPARACIÓN
// ══════════════════════════════════════════════════
export const CAR_TYPES = [
  {
    id: "h2",
    name: "Hidrógeno",
    icon: "💧",
    color: "#3b82f6",
    co2_per_km: 0.0,
    cost_per_km_COP: 95,
    cost_per_km_USD: 0.023,
    refuel_time: "4 min",
    range_km: 629,
    maintenance: "Bajo",
  },
  {
    id: "electric",
    name: "Eléctrico",
    icon: "🔋",
    color: "#4ade80",
    co2_per_km: 0.05,
    cost_per_km_COP: 65,
    cost_per_km_USD: 0.016,
    refuel_time: "30-60 min",
    range_km: 450,
    maintenance: "Bajo",
  },
  {
    id: "gasoline",
    name: "Gasolina",
    icon: "⛽",
    color: "#ef4444",
    co2_per_km: 0.192,
    cost_per_km_COP: 320,
    cost_per_km_USD: 0.078,
    refuel_time: "5 min",
    range_km: 650,
    maintenance: "Alto",
  },
  {
    id: "diesel",
    name: "Diésel",
    icon: "🚛",
    color: "#f97316",
    co2_per_km: 0.171,
    cost_per_km_COP: 260,
    cost_per_km_USD: 0.063,
    refuel_time: "5 min",
    range_km: 800,
    maintenance: "Medio",
  },
];

// ══════════════════════════════════════════════════
//  CÁLCULOS PRINCIPALES POR VEHÍCULO
// ══════════════════════════════════════════════════
export function calcularTransporte(massH2Grams, vehicleId = "car") {
  const vehicle = VEHICLES.find((v) => v.id === vehicleId) || VEHICLES[0];
  const massH2Kg = massH2Grams / 1000;

  // Kilómetros reales con el H₂ producido
  const rangeKm = (massH2Kg / vehicle.h2_per_100km_kg) * 100;

  // Porcentaje REAL del tanque
  const tankFillPercent = Math.min(100, (massH2Kg / vehicle.tank_kg) * 100);

  // Cuánto falta para llenar el tanque
  const h2NeededKg = Math.max(0, vehicle.tank_kg - massH2Kg);

  // Cuántas sesiones de 2 horas con sistema avanzado necesitarías
  // (asumiendo ~5 g/h con sistema avanzado)
  const ADVANCED_H2_PER_HOUR_G = 5.0;
  const hoursToFillTank = (h2NeededKg * 1000) / ADVANCED_H2_PER_HOUR_G;
  const daysToFillTank = hoursToFillTank / 8; // 8 horas de sol al día

  const reachableDestinations = DESTINATIONS.map((d) => {
    const trips = Math.floor(rangeKm / d.km);
    const canReach = rangeKm >= d.km;
    const partialTrip = rangeKm < d.km ? (rangeKm / d.km) * 100 : 100;
    return { ...d, trips, canReach, partialTrip };
  });

  const gasoline = CAR_TYPES.find((c) => c.id === "gasoline");
  const costSavedCOP =
    rangeKm * (gasoline.cost_per_km_COP - vehicle.cost_per_km_COP);
  const costSavedUSD =
    rangeKm * (gasoline.cost_per_km_USD - vehicle.cost_per_km_USD);
  const co2AvoidedKg = rangeKm * gasoline.co2_per_km;

  return {
    vehicle,
    massH2Kg: parseFloat(massH2Kg.toFixed(6)),
    massH2Grams: parseFloat(massH2Grams.toFixed(3)),
    rangeKm: parseFloat(rangeKm.toFixed(2)),
    tankFillPercent: parseFloat(tankFillPercent.toFixed(4)),
    h2NeededKg: parseFloat(h2NeededKg.toFixed(4)),
    h2NeededGrams: parseFloat((h2NeededKg * 1000).toFixed(2)),
    hoursToFillTank: parseFloat(hoursToFillTank.toFixed(1)),
    daysToFillTank: parseFloat(daysToFillTank.toFixed(1)),
    reachableDestinations,
    costSavedCOP: parseFloat(costSavedCOP.toFixed(0)),
    costSavedUSD: parseFloat(costSavedUSD.toFixed(3)),
    co2AvoidedKg: parseFloat(co2AvoidedKg.toFixed(4)),
    maxRangeKm: vehicle.max_range_km,
  };
}

export { H2_CONSUMPTION_KG_PER_100KM, TANK_CAPACITY_KG, MAX_RANGE_KM };
