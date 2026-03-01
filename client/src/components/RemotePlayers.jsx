import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  connectMultiplayer,
  getRemotePlayers,
  onPlayersChanged,
  interpolateRemotePlayers,
} from '../systems/multiplayer'

function RemotePlayer({ player }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(player.position.x, player.position.y, player.position.z)
      groupRef.current.rotation.y = player.rotation.y || 0
    }
  })

  // Tint remote players slightly different
  const bodyColor = player.state === 'GLIDING' ? '#44cc88' : '#cc8844'

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshLambertMaterial color="#ffcc99" />
      </mesh>
    </group>
  )
}

export default function RemotePlayers() {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    connectMultiplayer()
    return onPlayersChanged(() => setVersion(v => v + 1))
  }, [])

  useFrame(() => {
    interpolateRemotePlayers()
  })

  const players = Array.from(getRemotePlayers().values())

  return (
    <group>
      {players.map(player => (
        <RemotePlayer key={player.id} player={player} />
      ))}
    </group>
  )
}
