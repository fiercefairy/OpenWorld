import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Terrain from './components/Terrain';
import Water from './components/Water';
import Trees from './components/Trees';
import Player from './components/Player';
import Sky from './components/Sky';
import HUD from './components/HUD';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-text">Loading OpenWorld...</div>
    </div>
  );
}

export default function App() {
  return (
    <div className="game-container">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 10, 20] }}
          gl={{ antialias: true }}
        >
          <fog attach="fog" args={['#5b9bd5', 150, 400]} />
          <Sky />
          <Terrain />
          <Water />
          <Trees />
          <Player />
        </Canvas>
      </Suspense>
      <HUD />
    </div>
  );
}
