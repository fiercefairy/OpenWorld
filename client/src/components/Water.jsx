import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameContext } from '../contexts/GameContext'
import { LAYER_CONFIG } from '../systems/reality'

export default function Water() {
  const meshRef = useRef()
  const { playerPosition, activeLayer } = useGameContext()
  const config = LAYER_CONFIG[activeLayer].water

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = config.opacity - 0.05 + Math.sin(clock.elapsedTime * 0.5) * 0.05
      meshRef.current.material.color.set(config.color)

      // Follow player position
      const pos = playerPosition.current
      meshRef.current.position.set(pos.x, -1.2, pos.z)
    }
  })

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshLambertMaterial
        color={config.color}
        transparent
        opacity={config.opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
