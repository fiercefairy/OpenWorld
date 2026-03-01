import * as THREE from 'three'
import { getTerrainHeight } from './terrain'

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate narrow paths (bridges/ridgelines) for a chunk
export function generateNarrowPaths(cx, cz, chunkSize, layer = 'physical') {
  const paths = []
  const worldX = cx * chunkSize
  const worldZ = cz * chunkSize
  const baseSeed = cx * 53856093 + cz * 29349663

  // ~1 in 6 chunks has a narrow path
  if (seededRandom(baseSeed * 17.3) > 0.16) return paths

  const pathSeed = baseSeed + 42
  const startX = worldX + seededRandom(pathSeed * 1.1) * chunkSize * 0.3 + chunkSize * 0.1
  const startZ = worldZ + seededRandom(pathSeed * 2.2) * chunkSize * 0.3 + chunkSize * 0.1
  const endX = worldX + seededRandom(pathSeed * 3.3) * chunkSize * 0.3 + chunkSize * 0.6
  const endZ = worldZ + seededRandom(pathSeed * 4.4) * chunkSize * 0.3 + chunkSize * 0.6

  const startH = getTerrainHeight(startX, startZ, layer) + 3
  const endH = getTerrainHeight(endX, endZ, layer) + 3
  const midX = (startX + endX) / 2
  const midZ = (startZ + endZ) / 2
  const midH = Math.max(startH, endH) + 2

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(startX, startH, startZ),
    new THREE.Vector3(midX, midH, midZ),
    new THREE.Vector3(endX, endH, endZ),
  ])

  const length = curve.getLength()

  paths.push({
    curve,
    length,
    width: 1.2,
    startX, startZ, endX, endZ,
  })

  return paths
}

// Check if player is near a narrow path entry point
export function findNearbyPath(playerX, playerZ, cx, cz, chunkSize, layer) {
  const paths = generateNarrowPaths(cx, cz, chunkSize, layer)

  for (const path of paths) {
    // Check distance to start point
    const dxS = playerX - path.startX
    const dzS = playerZ - path.startZ
    const distStart = Math.sqrt(dxS * dxS + dzS * dzS)
    if (distStart < 2.0) {
      return { path, t: 0 }
    }

    // Check distance to end point
    const dxE = playerX - path.endX
    const dzE = playerZ - path.endZ
    const distEnd = Math.sqrt(dxE * dxE + dzE * dzE)
    if (distEnd < 2.0) {
      return { path, t: 1.0 }
    }
  }

  return null
}
