import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

export default function CameraController({ mode }) {
  const { camera } = useThree();
  const controls = useRef();

  useEffect(() => {
    if (mode === 'education') {
      camera.position.set(0, 0, 9.5);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 0, 12);
      camera.lookAt(0, 0, 0);
    }
    if (controls.current) {
      controls.current.target.set(0, 0, 0);
      controls.current.update();
    }
  }, [camera, mode]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={55} />
      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.06}
        minDistance={6}
        maxDistance={28}
        enablePan={mode === 'explore'}
        enableRotate={mode === 'explore'}
        enableZoom={mode === 'explore'}
      />
    </>
  );
}
