import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, DoubleSide, Object3D } from 'three';
import { DISK_INNER_RADIUS, DISK_OUTER_RADIUS } from '../lib/physics';

export default function DiskSimulation({ stageIndex, cinematic }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const glowDummy = useMemo(() => new Object3D(), []);
  const count = stageIndex >= 3 ? (cinematic ? 1400 : 900) : 0;

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      radius: DISK_INNER_RADIUS + Math.random() * (DISK_OUTER_RADIUS - DISK_INNER_RADIUS),
      angle: Math.random() * Math.PI * 2,
      height: (Math.random() - 0.5) * 0.75,
      wobble: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      size: 0.012 + Math.random() * 0.05,
      hueOffset: Math.random() * 0.12 - 0.06,
      eccentricity: Math.random() * 0.18 - 0.09,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || count === 0) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      // create a gentle spiral inward depending on stageIndex
      const spiral = 0.0008 * (stageIndex - 2);
      p.radius = Math.max(DISK_INNER_RADIUS, p.radius - spiral * (Math.sin(t * 0.2 + p.phase) * 0.5 + 0.5));
      const angle = p.angle + t * (0.14 + p.wobble * 0.04) + p.eccentricity * Math.sin(t * 0.6 + p.phase);
      const radius = p.radius + Math.sin(t * 0.7 + p.phase) * 0.06;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(t * 0.5 + p.phase) * 0.08 + p.height;
      const tempFactor = (p.radius - DISK_INNER_RADIUS) / (DISK_OUTER_RADIUS - DISK_INNER_RADIUS);
      const color = new Color();
      // map tempFactor to a hue between warm (0.08) and cool (0.58)
      const hue = 0.08 + (0.5 * (1 - tempFactor)) + p.hueOffset;
      color.setHSL(hue, 0.68 - tempFactor * 0.25, 0.48 - tempFactor * 0.18);
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size * (cinematic ? 1.0 : 0.8));
      dummy.rotation.y = Math.sin(t + p.phase) * 0.4;
      dummy.rotation.z = Math.cos(t * 0.6 + p.phase) * 0.22;
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, color);
      // also write a softer, slightly larger matrix for the glow layer
      if (glowRef.current) {
        glowDummy.position.copy(dummy.position);
        glowDummy.rotation.copy(dummy.rotation);
        glowDummy.scale.copy(dummy.scale).multiplyScalar(1.8);
        glowDummy.updateMatrix();
        glowRef.current.setMatrixAt(i, glowDummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    if (glowRef.current) glowRef.current.instanceMatrix.needsUpdate = true;
  });

  if (stageIndex < 3) return null;

  return (
    <group>
      <mesh>
        <ringGeometry args={[2.7, 3.9, 96, 1]} />
        <meshBasicMaterial color="#140806" transparent opacity={1} side={DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[2.95, 3.6, 96, 1]} />
        <meshBasicMaterial color="#3d1108" transparent opacity={0.85} side={DoubleSide} />
      </mesh>
      <instancedMesh ref={meshRef} args={[null, null, particles.length]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={cinematic ? 0.98 : 0.78} vertexColors depthWrite={false} toneMapped={false} />
      </instancedMesh>
      {/* secondary soft glow layer for richer color */}
      <instancedMesh ref={glowRef} args={[null, null, particles.length]}> 
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial transparent opacity={cinematic ? 0.18 : 0.10} vertexColors depthWrite={false} toneMapped={false} />
      </instancedMesh>
      <mesh>
        <ringGeometry args={[4.0, 4.16, 96]} />
        <meshBasicMaterial color="#deac68" transparent opacity={0.64} side={DoubleSide} />
      </mesh>
    </group>
  );
}
