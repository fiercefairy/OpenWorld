import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameContext } from '../../contexts/GameContext'
import { ensureCollisionForArea, resetCollisionData } from '../../systems/collisionSystem'
import TerrainChunk from './TerrainChunk'
import ObjectChunk from './ObjectChunk'
import NarrowPathChunk from './NarrowPathChunk'

const CHUNK_SIZE = 64
const VIEW_DISTANCE = 5
const LOD_NEAR = 16
const LOD_FAR = 8
const LOD_THRESHOLD = 3
const CHECK_INTERVAL = 10

export default function ChunkManager() {
  const { playerPosition, playerChunk, activeLayer } = useGameContext()
  const [centerChunk, setCenterChunk] = useState({ cx: 0, cz: 0 })
  const frameCount = useRef(0)
  const lastLayer = useRef(activeLayer)

  if (lastLayer.current !== activeLayer) {
    resetCollisionData()
    lastLayer.current = activeLayer
  }

  useFrame(() => {
    frameCount.current++
    if (frameCount.current % CHECK_INTERVAL !== 0) return

    const pos = playerPosition.current
    const newCX = Math.floor(pos.x / CHUNK_SIZE)
    const newCZ = Math.floor(pos.z / CHUNK_SIZE)

    ensureCollisionForArea(pos.x, pos.z, VIEW_DISTANCE, activeLayer)

    if (newCX !== centerChunk.cx || newCZ !== centerChunk.cz) {
      playerChunk.current.cx = newCX
      playerChunk.current.cz = newCZ
      setCenterChunk({ cx: newCX, cz: newCZ })
    }
  })

  const chunks = useMemo(() => {
    const list = []
    for (let dx = -VIEW_DISTANCE; dx <= VIEW_DISTANCE; dx++) {
      for (let dz = -VIEW_DISTANCE; dz <= VIEW_DISTANCE; dz++) {
        const cx = centerChunk.cx + dx
        const cz = centerChunk.cz + dz
        const dist = Math.max(Math.abs(dx), Math.abs(dz))
        const lod = dist <= LOD_THRESHOLD ? LOD_NEAR : LOD_FAR
        list.push({ cx, cz, lod })
      }
    }
    return list
  }, [centerChunk.cx, centerChunk.cz])

  return (
    <group>
      {chunks.map(({ cx, cz, lod }) => (
        <group key={`${cx},${cz}`}>
          <TerrainChunk cx={cx} cz={cz} chunkSize={CHUNK_SIZE} lod={lod} layer={activeLayer} />
          <ObjectChunk cx={cx} cz={cz} chunkSize={CHUNK_SIZE} layer={activeLayer} />
          <NarrowPathChunk cx={cx} cz={cz} chunkSize={CHUNK_SIZE} layer={activeLayer} />
        </group>
      ))}
    </group>
  )
}
