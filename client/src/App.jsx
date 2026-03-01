import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Stats, PerformanceMonitor } from '@react-three/drei'
import { GameProvider } from './contexts/GameContext'
import ChunkManager from './components/world/ChunkManager'
import Water from './components/Water'
import Player from './components/Player'
import RemotePlayers from './components/RemotePlayers'
import Sky from './components/Sky'
import HUD from './components/HUD'
import LayerFog from './components/effects/LayerFog'

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-text">Loading OpenWorld...</div>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <div className="game-container">
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            shadows
            camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 10, 20] }}
            gl={{ antialias: true }}
          >
            <PerformanceMonitor />
            <LayerFog />
            <Sky />
            <ChunkManager />
            <Water />
            <Player />
            <RemotePlayers />
            <Stats />
          </Canvas>
        </Suspense>
        <HUD />
      </div>
    </GameProvider>
  )
}
