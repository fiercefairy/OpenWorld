import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { STATES, createMovementState } from '../systems/movementState'
import { updateStateMachine } from '../systems/stateMachine'
import { updateCamera } from '../systems/cameraController'
import { getTerrainHeight } from '../systems/terrain'
import { sendPlayerUpdate } from '../systems/multiplayer'
import { useInput } from '../hooks/useInput'
import { useGameContext } from '../contexts/GameContext'

const SYNC_INTERVAL = 3  // send every 3 frames (~20Hz at 60fps)

export default function Player() {
  const meshRef = useRef()
  const { camera } = useThree()
  const state = useRef(createMovementState())
  const input = useInput(state)
  const { playerPosition, activeLayer, toggleLayer, playerState } = useGameContext()
  const tabWasPressed = useRef(false)
  const syncCounter = useRef(0)

  useFrame((_, delta) => {
    const s = state.current
    const dt = Math.min(delta, 0.05)

    // Tab toggle
    if (input.tab && !tabWasPressed.current) {
      tabWasPressed.current = true
      toggleLayer()
      const newLayer = activeLayer === 'physical' ? 'memory' : 'physical'
      const newTerrainY = getTerrainHeight(s.position.x, s.position.z, newLayer) + 1.0
      if (s.position.y < newTerrainY) {
        s.position.y = newTerrainY
        s.velocity.y = 0
      }
    }
    if (!input.tab) tabWasPressed.current = false

    updateStateMachine(s, dt, input)
    updateCamera(s, camera, dt)
    playerPosition.current.copy(s.position)

    if (playerState) playerState.current = s.currentState

    if (meshRef.current) {
      meshRef.current.position.copy(s.position)
      meshRef.current.rotation.y = s.yaw

      if (s.currentState === STATES.GLIDING) {
        const tiltTarget = (input.left ? 0.3 : 0) + (input.right ? -0.3 : 0)
        meshRef.current.rotation.z += (tiltTarget - meshRef.current.rotation.z) * 0.1
        meshRef.current.rotation.x = 0.3
      } else {
        meshRef.current.rotation.z *= 0.9
        meshRef.current.rotation.x *= 0.9
      }
    }

    // Multiplayer sync
    syncCounter.current++
    if (syncCounter.current >= SYNC_INTERVAL) {
      syncCounter.current = 0
      sendPlayerUpdate(
        { x: s.position.x, y: s.position.y, z: s.position.z },
        { y: s.yaw },
        s.currentState,
        { x: s.velocity.x, y: s.velocity.y, z: s.velocity.z }
      )
    }
  })

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshLambertMaterial color="#4488cc" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshLambertMaterial color="#ffcc99" />
      </mesh>
    </group>
  )
}
