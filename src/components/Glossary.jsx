import { useState } from 'react'

const TERMS = [
  {
    term: 'Electrólisis',
    short: 'Separar el agua con electricidad',
    explanation: 'Es el proceso de usar electricidad para romper las moléculas de agua (H₂O) en dos gases separados: hidrógeno (H₂) y oxígeno (O₂). Ocurre cuando se meten dos electrodos en el agua y se aplica corriente eléctrica.',
    analogy: 'Imagínalo como separar los ingredientes de una mezcla usando una corriente de agua — la electricidad actúa como el separador que rompe el enlace entre el hidrógeno y el oxígeno.',
    color: '#3b82f6',
  },
  {
    term: 'Membrana PEM',
    short: 'El corazón de la pila de combustible',
    explanation: 'PEM significa "Membrana de Intercambio Protónico". Es una lámina delgada de polímero especial que solo deja pasar los protones del hidrógeno, bloqueando todo lo demás. Fue desarrollada por General Electric en los años 60.',
    analogy: 'Es como un colador con huecos microscópicos tan pequeños que solo dejan pasar las partículas más diminutas del hidrógeno — como un filtro de café que solo deja pasar el líquido pero retiene el sólido.',
    color: '#8b5cf6',
  },
  {
    term: 'Electrolito',
    short: 'El líquido que conduce la corriente',
    explanation: 'Es la sustancia disuelta en el agua que permite que la electricidad fluya mejor a través de ella. Los más comunes son el hidróxido de sodio (NaOH) y el hidróxido de potasio (KOH). Sin electrolito, el agua pura conduce muy poca electricidad.',
    analogy: 'Es como añadir sal al agua para que conduzca mejor la corriente — el agua pura casi no conduce electricidad, pero el agua salada sí. Los electrolitos hacen lo mismo pero de forma más controlada.',
    color: '#06b6d4',
  },
  {
    term: 'Voltaje',
    short: 'La fuerza que empuja la corriente',
    explanation: 'Es la diferencia de potencial eléctrico entre los dos electrodos. Determina con qué fuerza se empuja la corriente a través del agua. A mayor voltaje, más rápido ocurre la electrólisis y más hidrógeno se produce por segundo.',
    analogy: 'Es como la presión del agua en una manguera. A mayor presión (voltaje), más agua (corriente) fluye y más rápido llena el balde (produce hidrógeno).',
    color: '#f59e0b',
  },
  {
    term: 'Hidrógeno verde',
    short: 'H₂ producido con energía renovable',
    explanation: 'Se llama hidrógeno verde cuando el proceso de electrólisis usa exclusivamente energía renovable como solar, eólica o hidroeléctrica. El resultado es hidrógeno con cero emisiones de CO₂ en todo su ciclo de vida.',
    analogy: 'Es la diferencia entre cargar tu celular con un panel solar o con electricidad de carbón. El celular queda igual de cargado, pero uno contamina y el otro no. Con el hidrógeno verde pasa lo mismo.',
    color: '#4ade80',
  },
  {
    term: 'Pila de combustible',
    short: 'Convierte H₂ en electricidad',
    explanation: 'Es un dispositivo que genera electricidad a partir de hidrógeno y oxígeno del aire mediante una reacción electroquímica. El único subproducto es agua pura. Es más eficiente que cualquier motor de combustión porque no quema nada.',
    analogy: 'Funciona como una batería que nunca se agota siempre que le des hidrógeno. A diferencia de una batería normal que almacena energía, la pila la genera en el momento — como una planta eléctrica en miniatura.',
    color: '#f97316',
  },
  {
    term: 'Eficiencia Faradaica',
    short: 'Qué tan bien se usa la energía',
    explanation: 'Es el porcentaje de la energía eléctrica que realmente se convierte en hidrógeno. Un sistema básico alcanza el 24%, uno comercial el 60% y uno avanzado PEM el 84%. El resto se pierde en calor.',
    analogy: 'Es como la eficiencia de un auto: si metes 10 litros de gasolina y solo 2.4 litros se convierten en movimiento (el resto en calor y ruido), tu eficiencia es del 24%. Los motores eléctricos modernos llegan al 90%+ por eso son mejores.',
    color: '#ec4899',
  },
  {
    term: 'Electrodo',
    short: 'El conductor que toca el agua',
    explanation: 'Son las piezas de metal o carbono que se sumergen en el agua y por donde entra y sale la corriente eléctrica. El electrodo negativo (cátodo) produce hidrógeno y el positivo (ánodo) produce oxígeno. El material afecta la eficiencia del proceso.',
    analogy: 'Son como los dos polos de una batería que metes en el agua. El polo negativo atrae los átomos de hidrógeno y el positivo atrae los de oxígeno, separándolos.',
    color: '#14b8a6',
  },
]

export default function Glossary() {
  const [open, setOpen] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = TERMS.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.short.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(59,130,246,.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: 13, fontWeight: 600,
            color: 'var(--text)', marginBottom: 2,
          }}>
            📖 Glosario de términos
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            Toca cualquier término para entender qué significa
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        <input
          type="text"
          placeholder="Buscar término..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 12, color: 'var(--text)',
            fontFamily: 'var(--font-main)',
            outline: 'none',
          }}
        />
      </div>

      {/* Lista de términos */}
      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {filtered.map((t, i) => (
          <div key={t.term}>
            {/* Término colapsado */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', padding: '12px 16px',
                background: open === i ? `${t.color}10` : 'transparent',
                border: 'none', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background .2s',
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: t.color, flexShrink: 0,
                boxShadow: open === i ? `0 0 6px ${t.color}` : 'none',
                transition: 'box-shadow .2s',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: open === i ? t.color : 'var(--text)',
                  transition: 'color .2s',
                }}>
                  {t.term}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                  {t.short}
                </div>
              </div>
              <div style={{
                fontSize: 16, color: 'var(--muted)',
                transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform .2s',
              }}>
                ›
              </div>
            </button>

            {/* Término expandido */}
            {open === i && (
              <div style={{
                padding: '14px 16px 16px',
                borderBottom: '1px solid var(--border)',
                background: `${t.color}08`,
                animation: 'fadeIn .2s ease',
              }}>
                <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }`}</style>

                <div style={{
                  fontSize: 12, color: 'var(--text)',
                  lineHeight: 1.7, marginBottom: 12,
                }}>
                  {t.explanation}
                </div>

                <div style={{
                  background: `${t.color}12`,
                  border: `1px solid ${t.color}30`,
                  borderRadius: 8, padding: '10px 12px',
                  borderLeft: `3px solid ${t.color}`,
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700,
                    color: t.color, marginBottom: 4,
                    letterSpacing: '.05em',
                  }}>
                    ANALOGÍA
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--muted2)',
                    lineHeight: 1.6, fontStyle: 'italic',
                  }}>
                    {t.analogy}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{
            padding: '24px', textAlign: 'center',
            fontSize: 12, color: 'var(--muted)',
          }}>
            No se encontró ese término
          </div>
        )}
      </div>
    </div>
  )
}