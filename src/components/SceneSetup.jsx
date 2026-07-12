import { Stars } from '@react-three/drei';
import { useMemo } from 'react';
import { BackSide, BufferAttribute, CanvasTexture } from 'three';

function createSpaceTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#040814';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 8; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 120 + Math.random() * 180;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255, ${170 + Math.round(Math.random() * 60)}, ${220 + Math.round(Math.random() * 35)}, 0.16)`);
    gradient.addColorStop(0.5, `rgba(90, 120, 190, 0.08)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  for (let i = 0; i < 850; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 1.5 + 0.1;
    const alpha = Math.random() * 0.6 + 0.18;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Starfield({ count = 700 }) {
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 60 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      data[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      data[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      data[i * 3 + 2] = Math.cos(phi) * radius;
    }
    return data;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#d6e3ff" sizeAttenuation transparent opacity={0.72} />
    </points>
  );
}

export default function SceneSetup({ cinematic }) {
  const backgroundTexture = useMemo(() => createSpaceTexture(), []);

  return (
    <>
      <color attach="background" args={[cinematic ? '#030717' : '#071024']} />
      <fog attach="fog" args={[cinematic ? '#02030f' : '#040814', cinematic ? 16 : 22, cinematic ? 130 : 170]} />
      <ambientLight intensity={cinematic ? 0.28 : 0.18} />
      <pointLight position={[7, 3, 5]} intensity={cinematic ? 2.0 : 1.2} color="#ffe7b0" />
      <pointLight position={[-5, -2, -6]} intensity={cinematic ? 1.2 : 0.65} color="#9dc6ff" />
      {backgroundTexture ? (
        <mesh rotation={[0, 0.1, 0]}> 
          <sphereGeometry args={[120, 64, 64]} />
          <meshBasicMaterial map={backgroundTexture} side={BackSide} toneMapped={false} />
        </mesh>
      ) : null}
      <Stars radius={120} depth={50} count={12000} factor={3} saturation={0.45} fade speed={0.35} />
      <Starfield count={700} />
    </>
  );
}
