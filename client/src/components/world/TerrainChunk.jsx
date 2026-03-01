import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { generateChunkGeometry } from '../../systems/terrain'

export default function TerrainChunk({ cx, cz, chunkSize, lod, layer = 'physical' }) {
  const geometry = useMemo(
    () => generateChunkGeometry(cx, cz, chunkSize, lod, layer),
    [cx, cz, chunkSize, lod, layer]
  )

  // Safety net: dispose geometry on unmount
  useEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshLambertMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  )
}
