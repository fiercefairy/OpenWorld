import { useState, useEffect, useRef, useCallback } from 'react'
import { useGameContext } from '../contexts/GameContext'
import RealityTransition from './effects/RealityTransition'

const STATE_HINTS = {
  GROUNDED: null,
  AIRBORNE: 'Space: Glide (when high enough)',
  CLIMBING: 'W/S: Up/Down | A/D: Lateral | Space: Jump off | E: Let go',
  GLIDING: 'A/D: Steer | W: Dive | S: Pull up | Release Space: Stop',
  BALANCING: 'A/D: Balance | W/S: Walk along path',
}

export default function HUD() {
  const [showControls, setShowControls] = useState(true)
  const { activeLayer, playerState } = useGameContext()
  const [currentHint, setCurrentHint] = useState(null)
  const animRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  // Poll player state for hints
  const checkState = useCallback(() => {
    if (playerState?.current) {
      const hint = STATE_HINTS[playerState.current]
      setCurrentHint(hint)
    }
    animRef.current = requestAnimationFrame(checkState)
  }, [playerState])

  useEffect(() => {
    animRef.current = requestAnimationFrame(checkState)
    return () => cancelAnimationFrame(animRef.current)
  }, [checkState])

  return (
    <div className="hud">
      <RealityTransition />

      <div className="crosshair">+</div>
      <div className="hud-title">OpenWorld</div>

      {/* Layer indicator */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 20,
        color: activeLayer === 'memory' ? '#8866cc' : 'rgba(255,255,255,0.6)',
        fontSize: '0.8rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}>
        {activeLayer === 'memory' ? 'Memory Layer' : 'Physical World'}
      </div>

      {/* Context-sensitive state hint */}
      {currentHint && (
        <div style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.8rem',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          padding: '6px 14px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}>
          {currentHint}
        </div>
      )}

      {showControls && (
        <div className="controls-panel">
          <div className="controls-title">Controls</div>
          <div className="control-row"><kbd>W A S D</kbd> Move</div>
          <div className="control-row"><kbd>Mouse</kbd> Look around</div>
          <div className="control-row"><kbd>Shift</kbd> Sprint</div>
          <div className="control-row"><kbd>Space</kbd> Jump / Glide</div>
          <div className="control-row"><kbd>E</kbd> Climb</div>
          <div className="control-row"><kbd>Tab</kbd> Toggle reality</div>
          <div className="control-row"><kbd>Click</kbd> Lock cursor</div>
          <div className="control-row"><kbd>Esc</kbd> Release cursor</div>
        </div>
      )}

      <div className="click-prompt" id="click-prompt">
        Click to start exploring
      </div>
    </div>
  )
}
