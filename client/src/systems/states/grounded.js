import * as THREE from 'three'
import { STATES, MOVE_SPEED, SPRINT_MULTIPLIER, JUMP_FORCE, GRAVITY } from '../movementState'
import { getTerrainHeight } from '../terrain'
import { resolveObjectCollision, findClimbableSurface } from '../collisionSystem'
import { findNearbyPath } from '../narrowPaths'

const CHUNK_SIZE = 64

const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _moveDir = new THREE.Vector3()

export function updateGrounded(state, delta, input) {
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

  const terrainY = getTerrainHeight(state.position.x, state.position.z) + 1.0
  if (state.position.y < terrainY) {
    state.position.y = terrainY
    state.velocity.y = 0
    state.isGrounded = true
  }
}

export function transitionsGrounded(state, input) {
  // Climb
  if (input.interact) {
    const surface = findClimbableSurface(state.position, state.yaw)
    if (surface) {
      state.climbSurfaceNormal.set(surface.normal.x, surface.normal.y, surface.normal.z)
      state.climbSurfacePoint.set(surface.point.x, surface.point.y, surface.point.z)
      state.velocity.y = 0
      return STATES.CLIMBING
    }
  }

  // Check for narrow path entry
  const cx = Math.floor(state.position.x / CHUNK_SIZE)
  const cz = Math.floor(state.position.z / CHUNK_SIZE)
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const result = findNearbyPath(state.position.x, state.position.z, cx + dx, cz + dz, CHUNK_SIZE)
      if (result) {
        state.balancePath = result.path
        state.balanceT = result.t
        state.balanceOffset = 0
        state.balanceWobble = 0
        return STATES.BALANCING
      }
    }
  }

  // Jump
  if (input.jump && state.isGrounded) {
    state.velocity.y = JUMP_FORCE
    state.isGrounded = false
    return STATES.AIRBORNE
  }

  return null
}
