import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameContext } from '../contexts/GameContext'
import { LAYER_CONFIG } from '../systems/reality'

export default function Sky() {
  const sunRef = useRef()
  const lightRef = useRef()
  const ambientRef = useRef()
  const hemiRef = useRef()
  const skyRef = useRef()
  const { activeLayer, playerPosition } = useGameContext()
  const config = LAYER_CONFIG[activeLayer]

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.05
    const sunX = Math.cos(t) * 200
    const sunY = Math.sin(t) * 200 + 50
    const sunZ = -100

    if (sunRef.current) {
      sunRef.current.position.set(sunX, Math.max(sunY, 10), sunZ)
      sunRef.current.material.color.set(config.sunSphere)
    }
    if (lightRef.current) {
      lightRef.current.position.set(sunX, Math.max(sunY, 30), sunZ)
      lightRef.current.intensity = config.sky.sunIntensity
      lightRef.current.color.set(config.sky.sunColor)

      // Shadow frustum follows player
      const pos = playerPosition.current
      const cam = lightRef.current.shadow.camera
      cam.left = pos.x - 40
      cam.right = pos.x + 40
      cam.top = pos.z + 40
      cam.bottom = pos.z - 40
      cam.updateProjectionMatrix()
    }
    if (skyRef.current) {
      skyRef.current.material.color.set(config.skybox)
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={config.ambient.intensity} color={config.ambient.color} />

      <directionalLight
        ref={lightRef}
        position={[100, 150, -100]}
        intensity={config.sky.sunIntensity}
        color={config.sky.sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      <hemisphereLight
        ref={hemiRef}
        args={[config.hemisphere.sky, config.hemisphere.ground, config.hemisphere.intensity]}
      />

      <mesh ref={sunRef} position={[100, 150, -100]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial color={config.sunSphere} />
      </mesh>

      <mesh ref={skyRef}>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial color={config.skybox} side={THREE.BackSide} />
      </mesh>
    </>
  )
}
