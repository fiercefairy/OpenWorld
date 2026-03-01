import * as THREE from 'three'

export function getTerrainHeight(x, z, layer = 'physical') {
  const nx = x / 512
  const nz = z / 512

  let height = 0
  height += Math.sin(nx * 6.28 * 2) * Math.cos(nz * 6.28 * 2) * 3
  height += Math.sin(nx * 6.28 * 5 + 1.3) * Math.cos(nz * 6.28 * 4 + 2.1) * 1.5
  height += Math.sin(nx * 6.28 * 10 + 0.7) * Math.cos(nz * 6.28 * 8 + 1.5) * 0.5

  // Flatten center area for spawn
  const distFromCenter = Math.sqrt(nx * nx + nz * nz)
  if (distFromCenter < 0.08) {
    height *= distFromCenter / 0.08
  }

  if (layer === 'memory') {
    height *= 1.4
    height += Math.sin(x * 0.03) * Math.cos(z * 0.03) * 2
  }

  return height
}

export function getTerrainColor(height, layer = 'physical') {
  const colors = layer === 'physical'
    ? [
        { threshold: -1, r: 0x2d, g: 0x5a, b: 0x27 },
        { threshold: 1, r: 0x4a, g: 0x8c, b: 0x3f },
        { threshold: 2.5, r: 0x6b, g: 0x8c, b: 0x42 },
        { threshold: Infinity, r: 0x8b, g: 0x8b, b: 0x7a },
      ]
    : [
        { threshold: -1, r: 0x1a, g: 0x1a, b: 0x3a },
        { threshold: 1, r: 0x3a, g: 0x2a, b: 0x5a },
        { threshold: 2.5, r: 0x5a, g: 0x4a, b: 0x6a },
        { threshold: Infinity, r: 0x6a, g: 0x6a, b: 0x8a },
      ]

  for (const c of colors) {
    if (height < c.threshold) return c
  }
  return colors[colors.length - 1]
}

export function generateChunkGeometry(cx, cz, chunkSize, resolution, layer = 'physical') {
  const vertices = []
  const indices = []
  const colors = []

  const worldX = cx * chunkSize
  const worldZ = cz * chunkSize
  const step = chunkSize / resolution

  for (let iz = 0; iz <= resolution; iz++) {
    for (let ix = 0; ix <= resolution; ix++) {
      const x = worldX + ix * step
      const z = worldZ + iz * step
      const height = getTerrainHeight(x, z, layer)

      vertices.push(x, height, z)

      const c = getTerrainColor(height, layer)
      colors.push(c.r / 255, c.g / 255, c.b / 255)
    }
  }

  for (let iz = 0; iz < resolution; iz++) {
    for (let ix = 0; ix < resolution; ix++) {
      const a = iz * (resolution + 1) + ix
      const b = a + 1
      const c = a + (resolution + 1)
      const d = c + 1
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()

  return geo
}
