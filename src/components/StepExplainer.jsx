import { useState } from "react";

const DATA = {
  electrolysis: {
    icon: "⚡",
    color: "#f59e0b",
    title: "Energía + Electrólisis",
    oneliner:
      "Usamos electricidad renovable para separar el agua en hidrógeno y oxígeno.",
    tips: [
      {
        icon: "☀️",
        label: "Fuente",
        text: "Elige la energía que alimenta el proceso. Solar y eólica producen H₂ verde — cero emisiones.",
      },
      {
        icon: "⚡",
        label: "Voltaje",
        text: "A más voltaje, más rápido se separa el agua. Mínimo teórico: 1.23 V.",
      },
      {
        icon: "⏱",
        label: "Tiempo",
        text: "A más tiempo de electrólisis, más hidrógeno se acumula en el tanque.",
      },
      {
        icon: "🔩",
        label: "Electrodo",
        text: "El platino es el más eficiente. El níquel es el más usado en la industria real.",
      },
    ],
  },
  storage: {
    icon: "🔵",
    color: "#06b6d4",
    title: "Almacenamiento de H₂",
    oneliner:
      "El hidrógeno producido se guarda en un tanque presurizado, igual que el gas de una cocina.",
    tips: [
      {
        icon: "🪣",
        label: "Tanque",
        text: "La capacidad varía según el vehículo. Un Toyota Mirai real tiene 5.6 kg a 700 bar.",
      },
      {
        icon: "💧",
        label: "Agua",
        text: "El agua lluvia filtrada es la fuente ideal — gratuita y sostenible.",
      },
      {
        icon: "📊",
        label: "% llenado",
        text: "Con producción casera, el tanque sube despacio. Los sistemas industriales lo llenan en minutos.",
      },
      {
        icon: "⚡",
        label: "Energía",
        text: "La energía química almacenada en el H₂ es la que usará la pila después.",
      },
    ],
  },
  fuelcell: {
    icon: "⚙️",
    color: "#8b5cf6",
    title: "Pila de combustible PEM",
    oneliner:
      "La membrana PEM convierte el H₂ en electricidad. El único residuo es agua pura.",
    tips: [
      {
        icon: "🧫",
        label: "Membrana",
        text: "Lámina delgada que solo deja pasar protones del H₂. Como un colador molecular.",
      },
      {
        icon: "⚡",
        label: "Electricidad",
        text: "El H₂ más el O₂ del aire generan electricidad directamente, sin quemar nada.",
      },
      {
        icon: "💧",
        label: "Residuo",
        text: "El único subproducto es agua pura — cero humo, cero CO₂, cero ruido.",
      },
      {
        icon: "📈",
        label: "Eficiencia",
        text: "Una pila PEM aprovecha el 60% del H₂. Un motor de gasolina solo el 20-25%.",
      },
    ],
  },
  consumption: {
    icon: "🏠",
    color: "#4ade80",
    title: "Consumo en el hogar",
    oneliner:
      "La electricidad de la pila alimenta electrodomésticos reales a 220 V.",
    tips: [
      {
        icon: "🔄",
        label: "Inversor",
        text: "Convierte la corriente continua de la pila en corriente alterna de 220 V para los enchufes.",
      },
      {
        icon: "🟢",
        label: "Encendido",
        text: "Los aparatos en verde tienen suficiente energía. Los grises necesitan más hidrógeno.",
      },
      {
        icon: "💰",
        label: "Costo",
        text: "Se muestra el equivalente en pesos colombianos si esa energía viniera de la red normal.",
      },
      {
        icon: "🏠",
        label: "Hogar 3D",
        text: "Activa el modo hogar para ver los electrodomésticos encenderse en tiempo real.",
      },
    ],
  },
  transport: {
    icon: "🚗",
    color: "#f97316",
    title: "Transporte con H₂",
    oneliner:
      "El hidrógeno mueve vehículos sin emisiones. El escape solo produce vapor de agua.",
    tips: [
      {
        icon: "🚗",
        label: "Carro",
        text: "Toyota Mirai: 629 km de autonomía, recarga en 4 minutos. Solo emite agua.",
      },
      {
        icon: "🚲",
        label: "Bicicleta",
        text: "La más eficiente: con pocos gramos de H₂ recorre cientos de kilómetros.",
      },
      {
        icon: "🏍️",
        label: "Moto",
        text: "Intermedia en consumo. Ideal para ciudades con infraestructura pequeña de H₂.",
      },
      {
        icon: "📍",
        label: "Destinos",
        text: "Calcula a qué lugares de Valledupar puedes llegar con el H₂ que produjiste.",
      },
    ],
  },
};

export default function StepExplainer({ activeTab }) {
  const [openTip, setOpenTip] = useState(null);
  const d = DATA[activeTab];
  if (!d) return null;

  return (
    <div
      style={{
        background: `${d.color}08`,
        border: `1px solid ${d.color}22`,
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 12,
        fontFamily: "var(--font-main)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>{d.icon}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: d.color }}>
            {d.title}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
            {d.oneliner}
          </div>
        </div>
      </div>

      {/* Tips como chips — toca para ver explicación */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {d.tips.map((tip, i) => (
          <button
            key={i}
            onClick={() => setOpenTip(openTip === i ? null : i)}
            style={{
              background: openTip === i ? `${d.color}20` : "var(--surface)",
              border: `1px solid ${openTip === i ? d.color : "var(--border)"}`,
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 10,
              fontWeight: 600,
              color: openTip === i ? d.color : "var(--muted2)",
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all .18s",
            }}
          >
            <span style={{ fontSize: 12 }}>{tip.icon}</span>
            {tip.label}
          </button>
        ))}
      </div>

      {/* Explicación del tip seleccionado */}
      {openTip !== null && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 10px",
            background: "var(--surface)",
            border: `1px solid ${d.color}30`,
            borderLeft: `3px solid ${d.color}`,
            borderRadius: "0 6px 6px 0",
            fontSize: 11,
            color: "var(--muted2)",
            lineHeight: 1.6,
            animation: "fadeIn .15s ease",
          }}
        >
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {d.tips[openTip]?.text}
        </div>
      )}
    </div>
  );
}
