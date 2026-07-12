import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import SceneSetup from './SceneSetup';
import BlackHoleVisual from './BlackHoleVisual';
import DiskSimulation from './DiskSimulation';
import CameraController from './CameraController';
import { getDiskTemperature, getDistanceToHorizon, getTimeDilationFactor, getVelocityMagnitude } from '../lib/physics';

const STAGES = [
  {
    id: 'star',
    title: 'A star in its normal life',
    copy: 'A stable star glows as nuclear fusion converts hydrogen into helium in its core. The outward pressure from this fusion balances gravity, holding the star in a long-lived equilibrium while its light carries energy into space.',
  },
  {
    id: 'fuel',
    title: 'Core collapse trigger',
    copy: 'As core hydrogen is exhausted, the star can no longer sustain the same fusion rate. Gravity begins to dominate, the core contracts, and temperatures spike, signaling the end of the star’s stable life.',
  },
  {
    id: 'event',
    title: 'Event horizon forms',
    copy: 'During collapse, the core becomes so dense that the escape velocity at its surface exceeds the speed of light. A one-way boundary called the event horizon appears, beyond which nothing can escape.',
  },
  {
    id: 'disk',
    title: 'Accretion disk spins up',
    copy: 'Gas and debris spiraling inward conserve angular momentum and flatten into a rotating disk. Friction heats the material, causing it to glow brightly around the dark center.',
  },
  {
    id: 'tidal',
    title: 'A passing object is stretched',
    copy: 'A nearby object feels a huge difference in gravity between its near and far sides. Those tidal forces can elongate and tear the object apart before it is drawn into the black hole.',
  },
  {
    id: 'jets',
    title: 'Relativistic jets',
    copy: 'Strong magnetic fields around the spinning hole channel some inflowing plasma into narrow, powerful jets that shoot away from the poles at nearly the speed of light.',
  },
];

export default function BlackHoleScene() {
  const [stageIndex, setStageIndex] = useState(0);
  const [mode, setMode] = useState('education');
  const [cinematic, setCinematic] = useState(true);
  const [hasSpawned, setHasSpawned] = useState(false);

  const stage = STAGES[stageIndex];
  const distance = getDistanceToHorizon(stageIndex);
  const velocity = getVelocityMagnitude(stageIndex);
  const dilation = getTimeDilationFactor(stageIndex);
  const temperature = getDiskTemperature(stageIndex);

  const startSimulation = () => {
    setHasSpawned(true);
    setStageIndex(0);
  };

  const advanceStage = () => {
    if (!hasSpawned) {
      startSimulation();
      return;
    }
    setStageIndex((value) => (value + 1 < STAGES.length ? value + 1 : 0));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#02030a' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 2]}>
        <SceneSetup cinematic={cinematic} />
        <CameraController mode={mode} />
        {hasSpawned ? (
          <>
            <BlackHoleVisual stageIndex={stageIndex} cinematic={cinematic} />
            <DiskSimulation stageIndex={stageIndex} cinematic={cinematic} />
          </>
        ) : null}
      </Canvas>
      {!hasSpawned ? (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(1, 3, 8, 0.84)', pointerEvents: 'auto' }}>
          <div style={{ width: 'min(420px, calc(100vw - 48px))', padding: '32px 30px', borderRadius: 28, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(10, 14, 28, 0.96)', color: 'white', textAlign: 'center', boxShadow: '0 28px 72px rgba(0,0,0,0.28)' }}>
            <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 18 }}>Spawn a Star</div>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(255,255,255,0.84)', marginBottom: 26 }}>Begin the simulation with a glowing star at the center of the scene. Each click advances the star through the next stage of collapse and reveals the physics of black hole formation.</div>
            <button onClick={startSimulation} style={{ padding: '16px 30px', borderRadius: 999, border: 'none', background: '#ffc768', color: '#08101d', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>Spawn the Star</button>
          </div>
        </div>
      ) : null}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, width: 280, maxHeight: '74vh', padding: '22px 16px', borderRadius: 26, background: 'rgba(5,7,14,0.90)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', color: 'white', fontSize: 15, pointerEvents: 'auto', overflowY: 'auto' }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Black hole formation</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.74)', marginBottom: 18 }}>Settings</div>
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setMode('education')} style={{ flex: 1, borderRadius: 18, border: mode === 'education' ? '1px solid rgba(255,255,255,0.60)' : '1px solid rgba(255,255,255,0.20)', background: mode === 'education' ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 16px', fontSize: 15, cursor: 'pointer' }}>
                  Guided learning
                </button>
                <button onClick={() => setMode('explore')} style={{ flex: 1, borderRadius: 18, border: mode === 'explore' ? '1px solid rgba(255,255,255,0.60)' : '1px solid rgba(255,255,255,0.20)', background: mode === 'explore' ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 16px', fontSize: 15, cursor: 'pointer' }}>
                  Free flight
                </button>
              </div>
              <div style={{ display: 'grid', gap: 8, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)' }}>
                <div>
                  <strong>Guided learning</strong> locks the camera and guides you through each stage with a stable, educational perspective.
                </div>
                <div>
                  <strong>Free flight</strong> unlocks full camera control so you can explore the scene and inspect the formation from any angle.
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <button onClick={() => setCinematic((value) => !value)} style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.18)', background: cinematic ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.24)', color: 'white', padding: '14px 16px', fontSize: 15, cursor: 'pointer' }}>
                Toggle cinematic mode
              </button>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)' }}>
                  for enhanced graphics
                </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 20, top: 20, width: 240, maxHeight: '78vh', padding: '18px 12px', borderRadius: 22, background: 'rgba(5,7,14,0.82)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(18px)', color: 'white', pointerEvents: 'auto', overflowY: 'auto' }}>
          <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Stages of formation</div>
          <div style={{ fontWeight: 800, marginBottom: 12, fontSize: 16, color: 'rgba(255,255,255,0.94)' }}>{stage.title}</div>
          <div style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.88)' }}>{stage.copy}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            {STAGES.map((entry, index) => (
              <button key={entry.id} onClick={() => setStageIndex(index)} style={{ padding: '10px 12px', borderRadius: 999, border: stageIndex === index ? '1px solid rgba(255,255,255,0.45)' : '1px solid rgba(255,255,255,0.14)', background: stageIndex === index ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, cursor: 'pointer' }}>
                {index + 1}
              </button>
            ))}
          </div>
          <button onClick={advanceStage} style={{ marginTop: 18, padding: '14px 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.14)', color: 'white', fontSize: 15, cursor: 'pointer' }}>Continue</button>
        </div>
        <div style={{ position: 'absolute', right: 20, bottom: 20, padding: '14px 16px', borderRadius: 20, background: 'rgba(5,7,14,0.78)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(18px)', color: 'white', fontSize: 14, lineHeight: 1.75, pointerEvents: 'auto' }}>
          <div>Horizon distance: {distance.toFixed(2)} AU</div>
          <div>Velocity: {velocity.toFixed(2)} c</div>
          <div>Dilation: {dilation.toFixed(2)}×</div>
          <div>Disk temp: {temperature.toFixed(0)} K</div>
        </div>
      </div>
    </div>
  );
}
