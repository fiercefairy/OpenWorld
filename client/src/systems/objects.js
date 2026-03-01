import { getTerrainHeight } from './terrain'

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateObjectsForChunk(cx, cz, chunkSize, layer = 'physical', density = 12) {
  const trunks = []
  const foliage = []
  const rocks = []
  const climbableRocks = []

  const worldX = cx * chunkSize
  const worldZ = cz * chunkSize
  const baseSeed = cx * 73856093 + cz * 19349663

  for (let i = 0; i < density; i++) {
    const seed = baseSeed + i * 127
    const lx = seededRandom(seed * 3.7) * chunkSize
    const lz = seededRandom(seed * 7.3 + 100) * chunkSize
    const x = worldX + lx
    const z = worldZ + lz

    if (Math.abs(x) < 15 && Math.abs(z) < 15) continue

    const height = getTerrainHeight(x, z, layer)
    if (height < -0.5) continue

    const scale = 0.6 + seededRandom(seed * 11.1) * 0.8

    // Layer tagging
    const layerRoll = seededRandom(seed * 5.9)
    if (layer === 'memory' && layerRoll < 0.2) {
      rocks.push({ x, y: height + scale * 0.5, z, scale: scale * 0.6, glow: true })
      continue
    }
    if (layer === 'physical' && layerRoll > 0.95) continue

    const isTree = seededRandom(seed * 2.3) > 0.25

    // Some rocks are tall climbable formations
    const climbRoll = seededRandom(seed * 13.7)
    if (!isTree && climbRoll > 0.6) {
      const climbScale = scale * 2.5
      climbableRocks.push({
        x, y: height, z,
        scale: climbScale,
        height: climbScale * 4,
      })
      continue
    }

    if (isTree) {
      trunks.push({ x, y: height, z, scale })
      foliage.push({ x, y: height, z, scale })
    } else {
      rocks.push({ x, y: height + scale * 0.3, z, scale: scale * 0.8, glow: false })
    }
  }

  return { trunks, foliage, rocks, climbableRocks }
}

export function getObjectCollisionData(cx, cz, chunkSize, layer = 'physical', density = 12) {
  const objects = []
  const worldX = cx * chunkSize
  const worldZ = cz * chunkSize
  const baseSeed = cx * 73856093 + cz * 19349663

  for (let i = 0; i < density; i++) {
    const seed = baseSeed + i * 127
    const lx = seededRandom(seed * 3.7) * chunkSize
    const lz = seededRandom(seed * 7.3 + 100) * chunkSize
    const x = worldX + lx
    const z = worldZ + lz

    if (Math.abs(x) < 15 && Math.abs(z) < 15) continue

    const height = getTerrainHeight(x, z, layer)
    if (height < -0.5) continue

    const scale = 0.6 + seededRandom(seed * 11.1) * 0.8
    const isTree = seededRandom(seed * 2.3) > 0.25
    const climbRoll = seededRandom(seed * 13.7)

    const isClimbable = !isTree && climbRoll > 0.6

    objects.push({
      x, z,
      radius: isClimbable ? scale * 1.5 : (isTree ? scale * 0.3 : scale * 0.5),
      climbable: isClimbable,
      height: isClimbable ? scale * 2.5 * 4 : 0,
      baseY: height,
    })
  }

  return objects
}
