export default function Electrodes() {
  return (
    <group>
      {/* ── CÁTODO (−) izquierda — produce H₂ ── */}
      <group position={[-1.2, 0, 0]}>
        {/* Barra principal */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.12, 2.6, 0.12]} />
          <meshStandardMaterial
            color="#6b7280"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
        {/* Placa del electrodo */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.08, 1.8, 0.9]} />
          <meshStandardMaterial
            color="#4b5563"
            roughness={0.2}
            metalness={0.95}
          />
        </mesh>
        {/* Ranuras decorativas */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => (
          <mesh key={i} position={[0.05, y, 0]}>
            <boxGeometry args={[0.02, 0.04, 0.85]} />
            <meshStandardMaterial
              color="#374151"
              roughness={0.5}
              metalness={0.7}
            />
          </mesh>
        ))}
        {/* Terminal superior */}
        <mesh position={[0, 1.65, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.1} metalness={1} />
        </mesh>
        {/* Glow azul del cátodo */}
        <pointLight
          position={[0, 0, 0]}
          intensity={0.8}
          color="#3b82f6"
          distance={1.5}
        />
      </group>

      {/* ── ÁNODO (+) derecha — produce O₂ ── */}
      <group position={[1.2, 0, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.12, 2.6, 0.12]} />
          <meshStandardMaterial
            color="#d1d5db"
            roughness={0.2}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.08, 1.8, 0.9]} />
          <meshStandardMaterial
            color="#9ca3af"
            roughness={0.15}
            metalness={0.98}
          />
        </mesh>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => (
          <mesh key={i} position={[0.05, y, 0]}>
            <boxGeometry args={[0.02, 0.04, 0.85]} />
            <meshStandardMaterial
              color="#6b7280"
              roughness={0.5}
              metalness={0.7}
            />
          </mesh>
        ))}
        <mesh position={[0, 1.65, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.1} metalness={1} />
        </mesh>
        {/* Glow rojo del ánodo */}
        <pointLight
          position={[0, 0, 0]}
          intensity={0.6}
          color="#ef4444"
          distance={1.5}
        />
      </group>

      {/* ── CABLES ── */}
      {/* Cable rojo (+) */}
      <mesh position={[-1.2, 1.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
        <meshStandardMaterial color="#ef4444" roughness={0.8} />
      </mesh>
      {/* Cable negro (−) */}
      <mesh position={[1.2, 1.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </mesh>
    </group>
  );
}
