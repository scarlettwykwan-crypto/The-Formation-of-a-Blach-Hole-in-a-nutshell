import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { advanceObjectState } from '../lib/physics';

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ObjectInjector({ activeObject, blackHoleMass, onObjectCount }) {
  const { camera } = useThree();
  const [objects, setObjects] = useState([]);
  const objectsRef = useRef([]);

  const spawn = useCallback(() => {
    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();
    const origin = camera.position.clone().add(direction.clone().multiplyScalar(2.8));
    const velocity = direction.clone().multiplyScalar(0.12 + Math.random() * 0.02);
    const newObject = {
      id: makeId(),
      type: activeObject,
      position: [origin.x, origin.y, origin.z],
      velocity: [velocity.x, velocity.y, velocity.z],
      life: 18,
      state: 'traveling',
      trail: [],
      size: activeObject === 'star' ? 0.16 : activeObject === 'rock' ? 0.1 : 0.05,
      mass: activeObject === 'star' ? 1.1 : activeObject === 'rock' ? 0.4 : 0.2,
    };
    objectsRef.current = [...objectsRef.current, newObject];
    setObjects(objectsRef.current);
    onObjectCount?.(objectsRef.current.length);
  }, [activeObject, blackHoleMass, camera, onObjectCount]);

  useFrame((state, delta) => {
    if (objectsRef.current.length === 0) return;
    const next = [];
    for (const object of objectsRef.current) {
      const nextObject = advanceObjectState(object, delta, blackHoleMass);
      object.life -= delta;
      if (object.life > 0 && nextObject.state !== 'absorbed') {
        next.push(nextObject);
      }
    }
    objectsRef.current = next;
    setObjects(next);
    onObjectCount?.(next.length);
  });

  return (
    <group>
      {objects.map((object) => {
        const [x, y, z] = object.position;
        if (object.type === 'gas') {
          return (
            <mesh key={object.id} position={[x, y, z]}>
              <sphereGeometry args={[object.size, 12, 12]} />
              <meshBasicMaterial color="#ffd68a" transparent opacity={0.9} />
            </mesh>
          );
        }
        if (object.type === 'star') {
          return (
            <mesh key={object.id} position={[x, y, z]}>
              <sphereGeometry args={[object.size, 24, 24]} />
              <meshBasicMaterial color="#fff4c7" transparent opacity={0.9} />
            </mesh>
          );
        }
        return (
          <mesh key={object.id} position={[x, y, z]}>
            <boxGeometry args={[object.size * 1.2, object.size * 1.2, object.size * 1.8]} />
            <meshBasicMaterial color="#9cc2ff" transparent opacity={0.85} />
          </mesh>
        );
      })}
      <mesh onClick={spawn}>
        <sphereGeometry args={[0.001, 4, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.001} />
      </mesh>
    </group>
  );
}
