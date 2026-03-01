import { useMemo } from 'react';
import * as THREE from 'three';
import { getTerrainHeight } from './Terrain';

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, scale * 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15 * scale, 0.25 * scale, 3 * scale, 6]} />
        <meshLambertMaterial color="#5c3a1e" />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, scale * 3.5, 0]} castShadow>
        <coneGeometry args={[1.8 * scale, 2.5 * scale, 6]} />
        <meshLambertMaterial color="#2d5a27" />
      </mesh>
      <mesh position={[0, scale * 4.5, 0]} castShadow>
        <coneGeometry args={[1.3 * scale, 2 * scale, 6]} />
        <meshLambertMaterial color="#3a7a32" />
      </mesh>
      <mesh position={[0, scale * 5.3, 0]} castShadow>
        <coneGeometry args={[0.8 * scale, 1.5 * scale, 6]} />
        <meshLambertMaterial color="#4a8c3f" />
      </mesh>
    </group>
  );
}

function Rock({ position, scale = 1 }) {
  return (
    <mesh position={position} castShadow>
      <dodecahedronGeometry args={[scale, 0]} />
      <meshLambertMaterial color="#6b6b6b" />
    </mesh>
  );
}

export default function Trees() {
  const objects = useMemo(() => {
    const items = [];
    const count = 200;

    for (let i = 0; i < count; i++) {
      const x = (seededRandom(i * 3.7) - 0.5) * 400;
      const z = (seededRandom(i * 7.3 + 100) - 0.5) * 400;

      // Skip objects too close to spawn
      if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;

      const height = getTerrainHeight(x, z);
      // Only place on land (above water)
      if (height < -0.5) continue;

      const scale = 0.6 + seededRandom(i * 11.1) * 0.8;

      if (seededRandom(i * 2.3) > 0.25) {
        items.push(
          <Tree
            key={`tree-${i}`}
            position={[x, height, z]}
            scale={scale}
          />
        );
      } else {
        items.push(
          <Rock
            key={`rock-${i}`}
            position={[x, height + scale * 0.3, z]}
            scale={scale * 0.8}
          />
        );
      }
    }
    return items;
  }, []);

  return <group>{objects}</group>;
}
