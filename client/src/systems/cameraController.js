import * as THREE from 'three'
import { STATES } from './movementState'

const CAMERA_LERP = 0.1
const _target = new THREE.Vector3()

const CAMERA_CONFIGS = {
  [STATES.GROUNDED]: { distance: 12, height: 6, lookHeight: 1.5 },
  [STATES.AIRBORNE]: { distance: 12, height: 6, lookHeight: 1.5 },
  [STATES.CLIMBING]: { distance: 15, height: 4, lookHeight: 2.0 },
  [STATES.GLIDING]: { distance: 18, height: 8, lookHeight: 0.0 },
  [STATES.BALANCING]: { distance: 8, height: 3, lookHeight: 1.5 },
}

export function updateCamera(state, camera, delta) {
  const config = CAMERA_CONFIGS[state.currentState] || CAMERA_CONFIGS[STATES.GROUNDED]

  const camX = Math.sin(state.yaw) * config.distance * Math.cos(state.pitch)
  const camY = config.height + Math.sin(state.pitch) * config.distance * 0.5
  const camZ = Math.cos(state.yaw) * config.distance * Math.cos(state.pitch)

  _target.set(
    state.position.x + camX,
    state.position.y + camY,
    state.position.z + camZ
  )

  camera.position.lerp(_target, CAMERA_LERP)
  camera.lookAt(state.position.x, state.position.y + config.lookHeight, state.position.z)

  // Subtle roll wobble for balancing
  if (state.currentState === STATES.BALANCING) {
    camera.rotation.z = Math.sin(state.stateTimer * 3) * 0.02 + state.balanceWobble * 0.1
  } else if (state.currentState === STATES.GLIDING) {
    // Tilt camera during glide turns
    camera.rotation.z *= 0.95 // smooth return to 0
  }
}
