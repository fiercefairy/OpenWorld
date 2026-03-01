import { getObjectCollisionData } from './objects'

const CELL_SIZE = 8
const CHUNK_SIZE = 64

const cells = new Map()
const loadedChunks = new Set()

export function loadChunkCollision(cx, cz, layer = 'physical') {
  const key = `${cx},${cz},${layer}`
  if (loadedChunks.has(key)) return

  const objects = getObjectCollisionData(cx, cz, CHUNK_SIZE, layer)
  for (const obj of objects) {
    const minGX = Math.floor((obj.x - obj.radius) / CELL_SIZE)
    const maxGX = Math.floor((obj.x + obj.radius) / CELL_SIZE)
    const minGZ = Math.floor((obj.z - obj.radius) / CELL_SIZE)
    const maxGZ = Math.floor((obj.z + obj.radius) / CELL_SIZE)

    for (let gx = minGX; gx <= maxGX; gx++) {
      for (let gz = minGZ; gz <= maxGZ; gz++) {
        const cellKey = `${gx},${gz}`
        if (!cells.has(cellKey)) cells.set(cellKey, [])
        cells.get(cellKey).push(obj)
      }
    }
  }

  loadedChunks.add(key)
}

export function resetCollisionData() {
  cells.clear()
  loadedChunks.clear()
}

export function ensureCollisionForArea(playerX, playerZ, viewDistance, layer) {
  const pcx = Math.floor(playerX / CHUNK_SIZE)
  const pcz = Math.floor(playerZ / CHUNK_SIZE)

  const radius = Math.min(viewDistance, 2)
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      loadChunkCollision(pcx + dx, pcz + dz, layer)
    }
  }
}

export function queryNearbyObjects(x, z) {
  const cx = Math.floor(x / CELL_SIZE)
  const cz = Math.floor(z / CELL_SIZE)
  const results = []

  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const key = `${cx + dx},${cz + dz}`
      const cell = cells.get(key)
      if (cell) results.push(...cell)
    }
  }

  return results
}

export function resolveObjectCollision(position, playerRadius = 0.5) {
  const nearby = queryNearbyObjects(position.x, position.z)
  for (const obj of nearby) {
    const dx = position.x - obj.x
    const dz = position.z - obj.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    const minDist = playerRadius + obj.radius

    if (dist < minDist && dist > 0) {
      const pushOut = (minDist - dist) / dist
      position.x += dx * pushOut
      position.z += dz * pushOut
    }
  }
}

export function findClimbableSurface(position, yaw, maxRange = 2.5) {
  const nearby = queryNearbyObjects(position.x, position.z)
  // Look for climbable objects in front of player
  const lookX = -Math.sin(yaw)
  const lookZ = -Math.cos(yaw)

  let best = null
  let bestDot = -1

  for (const obj of nearby) {
    if (!obj.climbable) continue

    const dx = obj.x - position.x
    const dz = obj.z - position.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist > maxRange + obj.radius) continue
    if (position.y > obj.baseY + obj.height) continue // above the surface

    // Check if player is facing the object
    const dot = (dx / dist) * lookX + (dz / dist) * lookZ
    if (dot > 0.3 && dot > bestDot) {
      bestDot = dot
      best = {
        point: { x: obj.x, y: obj.baseY, z: obj.z },
        normal: { x: -dx / dist, y: 0, z: -dz / dist },
        height: obj.height,
      }
    }
  }

  return best
}
