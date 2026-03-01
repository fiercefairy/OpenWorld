// Hub region data — designed geography for the first playable area
export const HUB_REGION = {
  id: 'hub',
  name: 'Central Nexus',
  bounds: { minX: -256, maxX: 256, minZ: -256, maxZ: 256 },

  // Climbable zones (chunks with higher density of climbable rocks)
  climbableZones: [
    { cx: 2, cz: 1, density: 20 },
    { cx: -3, cz: 2, density: 18 },
    { cx: 1, cz: -3, density: 16 },
  ],

  // Points of interest for exploration
  landmarks: [
    { x: 128, z: 64, name: 'Eastern Cliffs', type: 'climb' },
    { x: -192, z: 128, name: 'Western Ridge', type: 'climb' },
    { x: 64, z: -192, name: 'Southern Bridge', type: 'balance' },
    { x: 0, z: 0, name: 'Spawn Point', type: 'spawn' },
  ],

  // Memory layer secrets (things visible only in the memory layer)
  memorySecrets: [
    { x: 100, z: 50, type: 'glow-marker' },
    { x: -150, z: 100, type: 'glow-marker' },
    { x: 50, z: -150, type: 'glow-marker' },
    { x: -80, z: -80, type: 'glow-marker' },
  ],
}

// Audio events (placeholder for future audio integration)
export const AUDIO_EVENTS = {
  footstep: { trigger: 'grounded-moving', interval: 0.4 },
  jump: { trigger: 'state-enter-AIRBORNE' },
  land: { trigger: 'state-enter-GROUNDED', fromState: 'AIRBORNE' },
  climbGrip: { trigger: 'state-enter-CLIMBING' },
  windGlide: { trigger: 'state-active-GLIDING', loop: true },
  balanceCreak: { trigger: 'state-active-BALANCING', interval: 1.5 },
  realityShift: { trigger: 'layer-toggle' },
}
