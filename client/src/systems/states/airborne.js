import * as THREE from 'three'
import { STATES, MOVE_SPEED, SPRINT_MULTIPLIER, GRAVITY } from '../movementState'
import { getTerrainHeight } from '../terrain'
import { resolveObjectCollision, findClimbableSurface } from '../collisionSystem'

const GLIDE_MIN_HEIGHT = 5

const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _moveDir = new THREE.Vector3()

export function updateAirborne(state, delta, input) {
  _forward.set(-Math.sin(state.yaw), 0, -Math.cos(state.yaw))
  _right.set(Math.cos(state.yaw), 0, -Math.sin(state.yaw))
  _moveDir.set(0, 0, 0)

  if (input.forward) _moveDir.add(_forward)
  if (input.backward) _moveDir.sub(_forward)
  if (input.left) _moveDir.sub(_right)
  if (input.right) _moveDir.add(_right)

  if (_moveDir.lengthSq() > 0) {
    _moveDir.normalize()
    const speed = input.sprint ? MOVE_SPEED * SPRINT_MULTIPLIER : MOVE_SPEED
    state.position.x += _moveDir.x * speed * delta
    state.position.z += _moveDir.z * speed * delta
  }

  resolveObjectCollision(state.position)

  state.velocity.y -= GRAVITY * delta
  state.position.y += state.velocity.y * delta
}

export function transitionsAirborne(state, input) {
  const terrainY = getTerrainHeight(state.position.x, state.position.z) + 1.0

  // Landing
  if (state.position.y <= terrainY) {
    state.position.y = terrainY
    state.velocity.y = 0
    state.isGrounded = true
    return STATES.GROUNDED
  }

  // Glide: hold Space while descending and high enough above terrain
  const heightAbove = state.position.y - terrainY
  if (input.jump && state.velocity.y < 0 && heightAbove > GLIDE_MIN_HEIGHT) {
    return STATES.GLIDING
  }

  // Climb: press E near climbable surface while airborne
  if (input.interact) {
    const surface = findClimbableSurface(state.position, state.yaw)
    if (surface) {
      state.climbSurfaceNormal.set(surface.normal.x, surface.normal.y, surface.normal.z)
      state.climbSurfacePoint.set(surface.point.x, surface.point.y, surface.point.z)
      state.velocity.y = 0
      return STATES.CLIMBING
    }
  }

  return null
}
