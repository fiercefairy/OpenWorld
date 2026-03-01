import { useMemo } from 'react'
import * as THREE from 'three'
import { generateNarrowPaths } from '../../systems/narrowPaths'

const pathMaterial = new THREE.MeshLambertMaterial({ color: '#8a7a6a' })

export default function NarrowPathChunk({ cx, cz, chunkSize, layer = 'physical' }) {
  const meshes = useMemo(() => {
    const paths = generateNarrowPaths(cx, cz, chunkSize, layer)
    return paths.map((path, i) => {
      // Create a tube geometry along the path curve
      const geometry = new THREE.TubeGeometry(path.curve, 16, 0.4, 6, false)
      return { geometry, key: `${cx},${cz}-path-${i}` }
    })
  }, [cx, cz, chunkSize, layer])

  return (
    <group>
      {meshes.map(({ geometry, key }) => (
        <mesh key={key} geometry={geometry} material={pathMaterial} castShadow receiveShadow />
      ))}
    </group>
  )
}
