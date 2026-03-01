import * as THREE from 'three'
import { STATES } from '../movementState'
import { getTerrainHeight } from '../terrain'

const GLIDE_SINK_RATE = 3
const GLIDE_FORWARD_SPEED = 18
const GLIDE_STEER_RATE = 1.5
const GLIDE_PITCH_RATE = 0.8
const MIN_GLIDE_HEIGHT = 5

const _forward = new THREE.Vector3()

export function updateGliding(state, delta, input) {
  // Steering
  if (input.left) state.yaw += GLIDE_STEER_RATE * delta
  if (input.right) state.yaw -= GLIDE_STEER_RATE * delta

  // Pitch control: forward = dive faster, backward = pull up (slower descent)
  let sinkRate = GLIDE_SINK_RATE
  if (input.forward) sinkRate += GLIDE_PITCH_RATE * 4 // dive
  if (input.backward) sinkRate = Math.max(0.5, sinkRate - GLIDE_PITCH_RATE * 2) // pull up

  // Forward momentum
  _forward.set(-Math.sin(state.yaw), 0, -Math.cos(state.yaw))
  state.position.x += _forward.x * GLIDE_FORWARD_SPEED * delta
  state.position.z += _forward.z * GLIDE_FORWARD_SPEED * delta

  // Descent
  state.position.y -= sinkRate * delta
  state.velocity.y = -sinkRate

  // Update glide forward speed for external reference
  state.glideForwardSpeed = GLIDE_FORWARD_SPEED
}

export function transitionsGliding(state, input) {
  const terrainY = getTerrainHeight(state.position.x, state.position.z) + 1.0
  const heightAbove = state.position.y - terrainY

  // Land if close to ground
  if (heightAbove <= 1.0) {
    state.position.y = terrainY
    state.velocity.y = 0
    state.isGrounded = true
    state.glideForwardSpeed = 0
    return STATES.GROUNDED
  }

  // Release space to stop gliding
  if (!input.jump) {
    state.glideForwardSpeed = 0
    return STATES.AIRBORNE
  }

  return null
}
