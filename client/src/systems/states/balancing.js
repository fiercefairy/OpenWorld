import * as THREE from 'three'
import { STATES, MOVE_SPEED } from '../movementState'
import { getTerrainHeight } from '../terrain'

const BALANCE_SPEED = MOVE_SPEED * 0.6  // 60% of walk
const WOBBLE_RATE = 2.5
const WOBBLE_GROWTH = 0.3
const MAX_OFFSET = 0.6  // fall off if exceeded
const PATH_WIDTH = 1.5

const _tangent = new THREE.Vector3()
const _pathPoint = new THREE.Vector3()

export function updateBalancing(state, delta, input) {
  if (!state.balancePath) return

  // Move along path
  let moveSpeed = 0
  if (input.forward) moveSpeed += BALANCE_SPEED
  if (input.backward) moveSpeed -= BALANCE_SPEED

  // Advance along path parameter
  state.balanceT = (state.balanceT || 0) + moveSpeed * delta / state.balancePath.length

  // Clamp to path bounds
  state.balanceT = Math.max(0, Math.min(1, state.balanceT))

  // Get position on path
  state.balancePath.curve.getPointAt(state.balanceT, _pathPoint)
  state.balancePath.curve.getTangentAt(state.balanceT, _tangent)

  // Lateral offset (player corrects with A/D)
  if (input.left) state.balanceOffset -= 3 * delta
  if (input.right) state.balanceOffset += 3 * delta

  // Random wobble grows over time
  state.balanceWobble += Math.sin(state.stateTimer * WOBBLE_RATE) * WOBBLE_GROWTH * delta
  state.balanceOffset += state.balanceWobble * delta

  // Dampen wobble
  state.balanceWobble *= 0.98

  // Position player on path + offset
  const perpX = -_tangent.z
  const perpZ = _tangent.x
  state.position.x = _pathPoint.x + perpX * state.balanceOffset
  state.position.z = _pathPoint.z + perpZ * state.balanceOffset

  // Height from path point (bridge height)
  const pathY = _pathPoint.y + 1.0
  const terrainY = getTerrainHeight(state.position.x, state.position.z) + 1.0
  state.position.y = Math.max(pathY, terrainY)

  // Face along path
  state.yaw = Math.atan2(-_tangent.x, -_tangent.z)

  state.velocity.y = 0
}

export function transitionsBalancing(state, input) {
  // Fall off if offset too large
  if (Math.abs(state.balanceOffset) > MAX_OFFSET) {
    state.balancePath = null
    state.balanceOffset = 0
    state.balanceWobble = 0
    return STATES.AIRBORNE
  }

  // Jump off
  if (input.jump) {
    state.velocity.y = 8
    state.balancePath = null
    state.balanceOffset = 0
    state.balanceWobble = 0
    return STATES.AIRBORNE
  }

  // Reached end of path
  if (state.balanceT >= 1.0 || state.balanceT <= 0.0) {
    state.balancePath = null
    state.balanceOffset = 0
    state.balanceWobble = 0
    return STATES.GROUNDED
  }

  return null
}
