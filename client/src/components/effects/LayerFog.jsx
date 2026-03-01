import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { useGameContext } from '../../contexts/GameContext'
import { LAYER_CONFIG } from '../../systems/reality'

export default function LayerFog() {
  const { scene } = useThree()
  const { activeLayer } = useGameContext()

  useEffect(() => {
    const config = LAYER_CONFIG[activeLayer].fog
    scene.fog = new THREE.Fog(config.color, config.near, config.far)
  }, [activeLayer, scene])

  return null
}
