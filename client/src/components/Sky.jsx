import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sky() {
  const sunRef = useRef();
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.05;
    const sunX = Math.cos(t) * 200;
    const sunY = Math.sin(t) * 200 + 50;
    const sunZ = -100;

    if (sunRef.current) {
      sunRef.current.position.set(sunX, Math.max(sunY, 10), sunZ);
    }
    if (lightRef.current) {
      lightRef.current.position.set(sunX, Math.max(sunY, 30), sunZ);
    }
  });

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color="#87ceeb" />

      {/* Directional sunlight */}
      <directionalLight
        ref={lightRef}
        position={[100, 150, -100]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Hemisphere light for sky/ground ambient */}
      <hemisphereLight
        args={['#87ceeb', '#4a8c3f', 0.3]}
      />

      {/* Sun sphere */}
      <mesh ref={sunRef} position={[100, 150, -100]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial color="#fff5cc" />
      </mesh>

      {/* Skybox - large sphere with sky color */}
      <mesh>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial color="#5b9bd5" side={THREE.BackSide} />
      </mesh>
    </>
  );
}
