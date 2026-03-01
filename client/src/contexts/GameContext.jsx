import { createContext, useContext, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

const GameContext = createContext()

export function useGameContext() {
  return useContext(GameContext)
}

export function GameProvider({ children }) {
  const playerPosition = useRef(new THREE.Vector3(0, 2, 0))
  const playerChunk = useRef({ cx: 0, cz: 0 })
  const playerState = useRef('GROUNDED')
  const [activeLayer, setActiveLayer] = useState('physical')
  const [transitioning, setTransitioning] = useState(false)

  const toggleLayer = useCallback(() => {
    setTransitioning(true)
    setActiveLayer(prev => prev === 'physical' ? 'memory' : 'physical')
    setTimeout(() => setTransitioning(false), 600)
  }, [])

  return (
    <GameContext.Provider value={{
      playerPosition, playerChunk, playerState,
      activeLayer, transitioning, toggleLayer
    }}>
      {children}
    </GameContext.Provider>
  )
}
