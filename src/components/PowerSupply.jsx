import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function useScreenTexture(voltage, current) {
  const canvas  = useMemo(() => {
    const c    = document.createElement('canvas')
    c.width    = 512
    c.height   = 256
    return c
  }, [])

  const texture = useMemo(() => {
    const t           = new THREE.CanvasTexture(canvas)
    t.minFilter       = THREE.LinearFilter
    t.magFilter       = THREE.LinearFilter
    t.generateMipmaps = false
    return t
  }, [canvas])

  // Dibuja siempre que cambien los valores
  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar
    ctx.clearRect(0, 0, 512, 256)

    // Fondo LCD verde oscuro
    ctx.fillStyle = '#001a00'
    ctx.fillRect(0, 0, 512, 256)

    // Borde interior
    ctx.strokeStyle = '#14532d'
    ctx.lineWidth   = 3
    ctx.strokeRect(6, 6, 500, 244)

    // Esquinas oscuras
    ctx.fillStyle = '#052e16'
    ;[[0,0],[492,0],[0,236],[492,236]].forEach(([x,y]) => {
      ctx.fillRect(x, y, 20, 20)
    })

    // ── Label superior ──
    ctx.font      = '500 20px monospace'
    ctx.fillStyle = '#166534'
    ctx.shadowColor = '#166534'
    ctx.shadowBlur  = 4
    ctx.textAlign   = 'center'
    ctx.fillText('DC POWER SUPPLY', 256, 34)

    // Línea separadora
    ctx.shadowBlur  = 0
    ctx.strokeStyle = '#14532d'
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(20, 46)
    ctx.lineTo(492, 46)
    ctx.stroke()

    // ── Voltaje — número grande ──
    ctx.font        = 'bold 100px monospace'
    ctx.fillStyle   = '#4ade80'
    ctx.shadowColor = '#4ade80'
    ctx.shadowBlur  = 22
    ctx.textAlign   = 'center'
    ctx.fillText(`${parseFloat(voltage).toFixed(1)} V`, 256, 152)

    // ── Corriente ──
    ctx.font        = 'bold 38px monospace'
    ctx.fillStyle   = '#22d3ee'
    ctx.shadowColor = '#22d3ee'
    ctx.shadowBlur  = 12
    ctx.textAlign   = 'center'
    ctx.fillText(`I = ${parseFloat(current).toFixed(2)} A`, 256, 208)

    // ── Punto parpadeante activo (esquina) ──
    ctx.shadowBlur  = 8
    ctx.fillStyle   = '#4ade80'
    ctx.shadowColor = '#4ade80'
    ctx.beginPath()
    ctx.arc(474, 24, 7, 0, Math.PI * 2)
    ctx.fill()

    // Forzar actualización de textura
    texture.needsUpdate = true

  }, [voltage, current, canvas, texture])

  return texture
}

// ── Componente LED parpadeante ──
function LEDIndicator() {
  const matRef = useRef()
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity =
        1.5 + Math.sin(clock.getElapsedTime() * 2.5) * 0.6
    }
  })
  return (
    <group position={[-1.35, 0.32, 0.63]}>
      <mesh>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial
          ref={matRef}
          color="#4ade80"
          emissive="#4ade80"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0.1]}
        intensity={0.3}
        color="#4ade80"
        distance={0.6}
      />
    </group>
  )
}

// ── Terminal ──
function Terminal({ pos, color, emissive }) {
  return (
    <group position={pos}>
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.08, 16]} />
        <meshStandardMaterial
          color={color} emissive={emissive}
          emissiveIntensity={0.5} metalness={0.9} roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.04, 8]} />
        <meshStandardMaterial color="#050a05" />
      </mesh>
    </group>
  )
}

// ── Perilla ──
function Knob({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.068, 0.068, 0.065, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.15} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.044, 0.048]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.012, 0.044, 0.012]} />
        <meshStandardMaterial color="#6b7280" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.068, 0.008, 8, 24]} />
        <meshStandardMaterial color="#374151" metalness={0.9} />
      </mesh>
    </group>
  )
}

// ── COMPONENTE PRINCIPAL ──
export default function PowerSupply({ voltage, current }) {
  const screenLightRef = useRef()
  const screenMatRef   = useRef()
  const texture        = useScreenTexture(voltage, current)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (screenLightRef.current) {
      screenLightRef.current.intensity = 1.1 + Math.sin(t * 1.8) * 0.15
    }
    // Leve pulso en el material de la pantalla
    if (screenMatRef.current) {
      screenMatRef.current.emissiveIntensity = 0.52 + Math.sin(t * 1.2) * 0.04
    }
  })

  return (
    <group position={[0, 3.4, 0]}>

      {/* ── Cuerpo principal ── */}
      <mesh castShadow>
        <boxGeometry args={[3.0, 0.95, 1.2]} />
        <meshStandardMaterial color="#0d1117" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Panel frontal */}
      <mesh position={[0, 0, 0.61]}>
        <boxGeometry args={[2.98, 0.93, 0.018]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Tornillos esquinas */}
      {[[-1.4,0.38],[-1.4,-0.38],[1.4,0.38],[1.4,-0.38]].map(([x,y],i) => (
        <mesh key={i} position={[x, y, 0.62]}>
          <cylinderGeometry args={[0.034, 0.034, 0.022, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Rejilla ventilación derecha */}
      {[-0.28,-0.12,0.04,0.2].map((z,i) => (
        <mesh key={i} position={[1.43, 0, z]}>
          <boxGeometry args={[0.018, 0.55, 0.024]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}

      {/* ── Marco de pantalla ── */}
      <mesh position={[0.12, 0.1, 0.619]}>
        <boxGeometry args={[1.95, 0.68, 0.014]} />
        <meshStandardMaterial color="#030a03" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* ── PANTALLA PRINCIPAL ── */}
      <mesh position={[0.12, 0.1, 0.628]}>
        <planeGeometry args={[1.82, 0.60]} />
        <meshStandardMaterial
          ref={screenMatRef}
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.52}
          roughness={0.0}
          metalness={0.0}
          toneMapped={false}
        />
      </mesh>

      {/* Cristal reflectante encima de pantalla */}
      <mesh position={[0.12, 0.1, 0.632]}>
        <planeGeometry args={[1.82, 0.60]} />
        <meshPhysicalMaterial
          transparent opacity={0.05}
          roughness={0}
          transmission={0.97}
          color="#a8d8ff"
        />
      </mesh>

      {/* Luz pantalla */}
      <pointLight
        ref={screenLightRef}
        position={[0.12, 0.1, 1.1]}
        intensity={1.1}
        color="#4ade80"
        distance={3.5}
      />

      {/* ── Perillas ── */}
      <Knob position={[-1.1, -0.22, 0.62]} />
      <Knob position={[-0.8, -0.22, 0.62]} />
      <Knob position={[-0.5, -0.22, 0.62]} />

      {/* ── LED ── */}
      <LEDIndicator />

      {/* ── Terminales ── */}
      <Terminal pos={[-0.55, -0.22, 0.62]} color="#ef4444" emissive="#ef4444" />
      <Terminal pos={[ 0.55, -0.22, 0.62]} color="#374151" emissive="#9ca3af" />

    </group>
  )
}