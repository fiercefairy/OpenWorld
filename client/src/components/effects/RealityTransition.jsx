import { useGameContext } from '../../contexts/GameContext'

export default function RealityTransition() {
  const { activeLayer, transitioning } = useGameContext()

  if (!transitioning) return null

  return (
    <div
      className="reality-transition"
      style={{
        position: 'fixed',
        inset: 0,
        background: activeLayer === 'memory' ? '#1a1a2e' : '#ffffff',
        animation: 'realityFlash 0.6s ease-in-out',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  )
}
