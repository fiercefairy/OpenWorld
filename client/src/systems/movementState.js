import * as THREE from 'three'

export const STATES = {
  GROUNDED: 'GROUNDED',
  AIRBORNE: 'AIRBORNE',
  CLIMBING: 'CLIMBING',
  GLIDING: 'GLIDING',
  BALANCING: 'BALANCING',
}

export const MOVE_SPEED = 20
export const SPRINT_MULTIPLIER = 1.8
export const MOUSE_SENSITIVITY = 0.002
export const JUMP_FORCE = 12
export const GRAVITY = 25

export function createMovementState() {
  return {
    currentState: STATES.GROUNDED,
    previousState: null,
    stateTimer: 0,
    position: new THREE.Vector3(0, 2, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    yaw: 0,
    pitch: 0.3,
    isGrounded: true,
    isLocked: false,
    // Climbing
    climbSurfaceNormal: new THREE.Vector3(),
    climbSurfacePoint: new THREE.Vector3(),
    // Gliding
    glideForwardSpeed: 0,
    // Balancing
    balancePath: null,
    balanceOffset: 0,
    balanceWobble: 0,
  }
}
