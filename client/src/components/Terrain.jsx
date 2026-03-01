import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function createHeightmap(width, depth, scale) {
  const vertices = [];
  const indices = [];
  const colors = [];

  for (let z = 0; z <= depth; z++) {
    for (let x = 0; x <= width; x++) {
      const nx = x / width - 0.5;
      const nz = z / depth - 0.5;

      // Multi-octave noise approximation using sin waves
      let height = 0;
      height += Math.sin(nx * 6.28 * 2) * Math.cos(nz * 6.28 * 2) * 3;
      height += Math.sin(nx * 6.28 * 5 + 1.3) * Math.cos(nz * 6.28 * 4 + 2.1) * 1.5;
      height += Math.sin(nx * 6.28 * 10 + 0.7) * Math.cos(nz * 6.28 * 8 + 1.5) * 0.5;

      // Flatten center area for spawn
      const distFromCenter = Math.sqrt(nx * nx + nz * nz);
      if (distFromCenter < 0.08) {
        height *= distFromCenter / 0.08;
      }

      vertices.push(
        (x - width / 2) * scale,
        height,
        (z - depth / 2) * scale
      );

      // Color based on height
      const color = new THREE.Color();
      if (height < -1) {
        color.setHex(0x2d5a27); // dark green (low valleys)
      } else if (height < 1) {
        color.setHex(0x4a8c3f); // green (grass)
      } else if (height < 2.5) {
        color.setHex(0x6b8c42); // yellow-green (hills)
      } else {
        color.setHex(0x8b8b7a); // grey (peaks)
      }
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let z = 0; z < depth; z++) {
    for (let x = 0; x < width; x++) {
      const a = z * (width + 1) + x;
      const b = a + 1;
      const c = a + (width + 1);
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  return { vertices, indices, colors };
}

export default function Terrain() {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const { vertices, indices, colors } = createHeightmap(128, 128, 4);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshLambertMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}

// Export height sampling for player physics
export function getTerrainHeight(x, z) {
  const nx = x / 512 ;
  const nz = z / 512;
  let height = 0;
  height += Math.sin(nx * 6.28 * 2) * Math.cos(nz * 6.28 * 2) * 3;
  height += Math.sin(nx * 6.28 * 5 + 1.3) * Math.cos(nz * 6.28 * 4 + 2.1) * 1.5;
  height += Math.sin(nx * 6.28 * 10 + 0.7) * Math.cos(nz * 6.28 * 8 + 1.5) * 0.5;
  return height;
}
