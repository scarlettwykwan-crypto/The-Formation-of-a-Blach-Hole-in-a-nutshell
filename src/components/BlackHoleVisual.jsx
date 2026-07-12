import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, Color } from 'three';
import { EVENT_HORIZON_RADIUS } from '../lib/physics';

function LensingOverlay({ stageIndex, cinematic }) {
  return (
    <mesh renderOrder={999} position={[0, 0, -4.2]}>
      <planeGeometry args={[24, 24]} />
      <meshBasicMaterial
        color={stageIndex >= 2 ? '#0e1b31' : '#05070f'}
        transparent
        opacity={cinematic ? 0.12 : 0.06}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function BlackHoleVisual({ stageIndex, cinematic }) {
  const starRef = useRef();
  const horizonRef = useRef();
  const innerRingRef = useRef();
  const outerRingRef = useRef();
  const jetARef = useRef();
  const jetBRef = useRef();
  const knotARef = useRef();
  const knotBRef = useRef();

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 1.7) * 0.02;
    if (starRef.current) {
      const scale = stageIndex < 2 ? 1 + pulse * 0.8 : 1 + 0.025 * Math.sin(state.clock.elapsedTime * 0.9);
      starRef.current.scale.setScalar(scale);
      starRef.current.material.emissive.set(stageIndex < 2 ? '#ffd68f' : '#ffc879');
      starRef.current.material.color.set(stageIndex < 2 ? '#ffcc82' : '#ffb572');
    }
    if (horizonRef.current) {
      horizonRef.current.material.opacity = stageIndex >= 2 ? 1 : 0;
      horizonRef.current.scale.setScalar(1 + Math.max(0, stageIndex - 2) * 0.04);
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = state.clock.elapsedTime * 0.14;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -state.clock.elapsedTime * 0.055;
    }
    if (jetARef.current) jetARef.current.rotation.z = 0.18 + pulse * 0.8;
    if (jetBRef.current) jetBRef.current.rotation.z = -0.18 - pulse * 0.8;
    if (knotARef.current) knotARef.current.position.y = 2.8 + Math.sin(state.clock.elapsedTime * 1.6) * 0.24;
    if (knotBRef.current) knotBRef.current.position.y = -2.8 + Math.sin(state.clock.elapsedTime * 1.6 + Math.PI) * 0.24;
  });

  const starRadius = Math.max(0.35, 1.4 - stageIndex * 0.16);
  const horizonRadius = stageIndex >= 2 ? EVENT_HORIZON_RADIUS + (stageIndex - 2) * 0.03 : 0;
  const showJets = stageIndex >= 5;
  const ringGlow = useMemo(() => new Color(cinematic ? '#fff0d6' : '#d9c2a4'), [cinematic]);
  const ringColor = useMemo(() => new Color(cinematic ? '#ffcf8f' : '#cfa87a'), [cinematic]);
  const glowStrength = cinematic ? 0.95 : 0.55;

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={cinematic ? 3.4 : 1.8} distance={18} color="#ffdfb2" />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[starRadius * 1.7, 32, 32]} />
        <meshBasicMaterial color={cinematic ? '#ffd8a1' : '#cfae84'} transparent opacity={cinematic ? 0.24 : 0.14} toneMapped={false} />
      </mesh>
      <mesh ref={starRef} position={[0, 0, 0]}>
        <sphereGeometry args={[starRadius, 56, 56]} />
        <meshPhysicalMaterial
          emissive={cinematic ? '#ffd78c' : '#dfc09d'}
          emissiveIntensity={cinematic ? 2.4 : 1.2}
          clearcoat={0.35}
          metalness={0.08}
          roughness={0.28}
          color={cinematic ? '#ffc57a' : '#d2b48a'}
          toneMapped={false}
        />
      </mesh>
      {stageIndex >= 2 ? (
        <mesh ref={horizonRef}>
          <sphereGeometry args={[horizonRadius, 64, 64]} />
          <meshBasicMaterial color="#000000" transparent opacity={1} />
        </mesh>
      ) : null}
      {stageIndex >= 2 ? (
        <mesh ref={innerRingRef} position={[0, 0, 0]}>
          <torusGeometry args={[1.75 + (stageIndex - 2) * 0.3, 0.065, 32, 180]} />
          <meshStandardMaterial color={ringGlow} transparent opacity={glowStrength} side={DoubleSide} toneMapped={false} emissive={ringGlow} emissiveIntensity={cinematic ? 1.5 : 0.7} roughness={0.16} metalness={0.08} />
        </mesh>
      ) : null}
      {stageIndex >= 2 ? (
        <mesh ref={outerRingRef} position={[0, 0, 0]}>
          <torusGeometry args={[2.0 + (stageIndex - 2) * 0.4, 0.08, 32, 180]} />
          <meshStandardMaterial color={ringColor} transparent opacity={cinematic ? 0.68 : 0.42} side={DoubleSide} toneMapped={false} emissive={ringColor} emissiveIntensity={cinematic ? 0.9 : 0.35} roughness={0.32} metalness={0.04} />
        </mesh>
      ) : null}
      {showJets ? (
        <group>
          <mesh ref={jetARef} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.08, 6.8, 16, 1, true]} />
            <meshStandardMaterial color="#7cd2ff" transparent opacity={cinematic ? 0.28 : 0.16} side={DoubleSide} toneMapped={false} emissive="#81d2ff" emissiveIntensity={cinematic ? 1.1 : 0.5} />
          </mesh>
          <mesh ref={jetBRef} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.08, 6.8, 16, 1, true]} />
            <meshStandardMaterial color="#ffb775" transparent opacity={cinematic ? 0.24 : 0.12} side={DoubleSide} toneMapped={false} emissive="#ffb379" emissiveIntensity={cinematic ? 1.0 : 0.5} />
          </mesh>
          <mesh ref={knotARef} position={[0, 2.8, 0]}>
            <sphereGeometry args={[0.12, 14, 14]} />
            <meshStandardMaterial color="#d5f3ff" transparent opacity={0.7} toneMapped={false} emissive="#d5f3ff" emissiveIntensity={cinematic ? 0.9 : 0.5} />
          </mesh>
          <mesh ref={knotBRef} position={[0, -2.8, 0]}>
            <sphereGeometry args={[0.12, 14, 14]} />
            <meshStandardMaterial color="#ffcda2" transparent opacity={0.7} toneMapped={false} emissive="#ffcda2" emissiveIntensity={cinematic ? 0.9 : 0.5} />
          </mesh>
        </group>
      ) : null}
      <LensingOverlay stageIndex={stageIndex} cinematic={cinematic} />
    </group>
  );
}
