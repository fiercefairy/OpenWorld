import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Water() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.55 + Math.sin(clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[600, 600]} />
      <meshLambertMaterial
        color="#1a6e8a"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
