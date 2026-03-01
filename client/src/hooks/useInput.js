import { useRef, useEffect, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { MOUSE_SENSITIVITY } from '../systems/movementState'

export function useInput(stateRef) {
  const { gl } = useThree()
  const keysRef = useRef({})

  const handleKeyDown = useCallback((e) => {
    keysRef.current[e.code] = true
    if (e.code === 'Tab') e.preventDefault()
  }, [])

  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.code] = false
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!stateRef.current.isLocked) return
    stateRef.current.yaw -= e.movementX * MOUSE_SENSITIVITY
    stateRef.current.pitch = Math.max(
      -0.5,
      Math.min(1.2, stateRef.current.pitch + e.movementY * MOUSE_SENSITIVITY)
    )
  }, [stateRef])

  const handlePointerLock = useCallback(() => {
    stateRef.current.isLocked = document.pointerLockElement === gl.domElement
  }, [gl, stateRef])

  const handleClick = useCallback(() => {
    if (!stateRef.current.isLocked) {
      gl.domElement.requestPointerLock()
    }
  }, [gl, stateRef])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('pointerlockchange', handlePointerLock)
    gl.domElement.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerlockchange', handlePointerLock)
      gl.domElement.removeEventListener('click', handleClick)
    }
  }, [gl, handleKeyDown, handleKeyUp, handleMouseMove, handlePointerLock, handleClick])

  const keys = keysRef.current
  return {
    get forward() { return !!(keys['KeyW'] || keys['ArrowUp']) },
    get backward() { return !!(keys['KeyS'] || keys['ArrowDown']) },
    get left() { return !!(keys['KeyA'] || keys['ArrowLeft']) },
    get right() { return !!(keys['KeyD'] || keys['ArrowRight']) },
    get sprint() { return !!(keys['ShiftLeft'] || keys['ShiftRight']) },
    get jump() { return !!(keys['Space']) },
    get interact() { return !!(keys['KeyE']) },
    get tab() { return !!(keys['Tab']) },
  }
}
