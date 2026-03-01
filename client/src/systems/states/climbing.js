import * as THREE from 'three'
import { STATES, MOVE_SPEED } from '../movementState'

const CLIMB_SPEED = MOVE_SPEED * 0.4  // 40% of walk speed
const SINK_PULL = 2  // constant downward pull

const _lateral = new THREE.Vector3()

export function updateClimbing(state, delta, input) {
  // Movement along climb surface
  // W/S = up/down, A/D = lateral
  let verticalMove = 0
  let lateralMove = 0

  if (input.forward) verticalMove += CLIMB_SPEED
  if (input.backward) verticalMove -= CLIMB_SPEED
  if (input.left) lateralMove -= CLIMB_SPEED
  if (input.right) lateralMove += CLIMB_SPEED

  // Apply constant sink pull
  verticalMove -= SINK_PULL

  // Move vertically
  state.position.y += verticalMove * delta

  // Move laterally along surface (perpendicular to normal in XZ)
  if (lateralMove !== 0) {
    _lateral.set(-state.climbSurfaceNormal.z, 0, state.climbSurfaceNormal.x).normalize()
    state.position.x += _lateral.x * lateralMove * delta
    state.position.z += _lateral.z * lateralMove * delta
  }

  // Keep player close to wall
  const wallDist = 0.8
  state.position.x = state.climbSurfacePoint.x + state.climbSurfaceNormal.x * wallDist
  state.position.z = state.climbSurfacePoint.z + state.climbSurfaceNormal.z * wallDist

  state.velocity.y = 0
}

export function transitionsClimbing(state, input) {
  // Jump off wall (wall jump)
  if (input.jump) {
    state.velocity.y = 10
    // Push away from wall
    state.position.x += state.climbSurfaceNormal.x * 1.5
    state.position.z += state.climbSurfaceNormal.z * 1.5
    return STATES.AIRBORNE
  }

  // Let go (interact key again)
  if (input.interact) {
    return STATES.AIRBORNE
  }

  // Reached bottom of surface
  if (state.position.y < state.climbSurfacePoint.y - 0.5) {
    return STATES.GROUNDED
  }

  return null
}
