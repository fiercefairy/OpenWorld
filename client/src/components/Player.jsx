import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getTerrainHeight } from './Terrain';

const MOVE_SPEED = 20;
const SPRINT_MULTIPLIER = 1.8;
const MOUSE_SENSITIVITY = 0.002;
const CAMERA_DISTANCE = 12;
const CAMERA_HEIGHT = 6;
const JUMP_FORCE = 12;
const GRAVITY = 25;

export default function Player() {
  const meshRef = useRef();
  const { camera, gl } = useThree();

  const state = useRef({
    keys: {},
    yaw: 0,
    pitch: 0.3,
    velocityY: 0,
    isGrounded: true,
    position: new THREE.Vector3(0, 2, 0),
    isLocked: false
  });

  const handleKeyDown = useCallback((e) => {
    state.current.keys[e.code] = true;
  }, []);

  const handleKeyUp = useCallback((e) => {
    state.current.keys[e.code] = false;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!state.current.isLocked) return;
    state.current.yaw -= e.movementX * MOUSE_SENSITIVITY;
    state.current.pitch = Math.max(
      -0.5,
      Math.min(1.2, state.current.pitch + e.movementY * MOUSE_SENSITIVITY)
    );
  }, []);

  const handlePointerLock = useCallback(() => {
    state.current.isLocked = document.pointerLockElement === gl.domElement;
  }, [gl]);

  const handleClick = useCallback(() => {
    if (!state.current.isLocked) {
      gl.domElement.requestPointerLock();
    }
  }, [gl]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLock);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLock);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handlePointerLock, handleClick, gl]);

  useFrame((_, delta) => {
    const s = state.current;
    const clampedDelta = Math.min(delta, 0.05);

    // Movement direction
    const forward = new THREE.Vector3(
      -Math.sin(s.yaw),
      0,
      -Math.cos(s.yaw)
    );
    const right = new THREE.Vector3(
      Math.cos(s.yaw),
      0,
      -Math.sin(s.yaw)
    );

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (s.keys['KeyW'] || s.keys['ArrowUp']) moveDir.add(forward);
    if (s.keys['KeyS'] || s.keys['ArrowDown']) moveDir.sub(forward);
    if (s.keys['KeyA'] || s.keys['ArrowLeft']) moveDir.sub(right);
    if (s.keys['KeyD'] || s.keys['ArrowRight']) moveDir.add(right);

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      const speed = s.keys['ShiftLeft'] || s.keys['ShiftRight']
        ? MOVE_SPEED * SPRINT_MULTIPLIER
        : MOVE_SPEED;
      s.position.x += moveDir.x * speed * clampedDelta;
      s.position.z += moveDir.z * speed * clampedDelta;
    }

    // Jump
    if ((s.keys['Space']) && s.isGrounded) {
      s.velocityY = JUMP_FORCE;
      s.isGrounded = false;
    }

    // Gravity
    s.velocityY -= GRAVITY * clampedDelta;
    s.position.y += s.velocityY * clampedDelta;

    // Terrain collision
    const terrainY = getTerrainHeight(s.position.x, s.position.z) + 1.0;
    if (s.position.y < terrainY) {
      s.position.y = terrainY;
      s.velocityY = 0;
      s.isGrounded = true;
    }

    // Clamp to world bounds
    s.position.x = Math.max(-250, Math.min(250, s.position.x));
    s.position.z = Math.max(-250, Math.min(250, s.position.z));

    // Update mesh
    if (meshRef.current) {
      meshRef.current.position.copy(s.position);
      meshRef.current.rotation.y = s.yaw;
    }

    // Third-person camera
    const camOffset = new THREE.Vector3(
      Math.sin(s.yaw) * CAMERA_DISTANCE * Math.cos(s.pitch),
      CAMERA_HEIGHT + Math.sin(s.pitch) * CAMERA_DISTANCE * 0.5,
      Math.cos(s.yaw) * CAMERA_DISTANCE * Math.cos(s.pitch)
    );
    camera.position.lerp(s.position.clone().add(camOffset), 0.1);
    camera.lookAt(s.position.x, s.position.y + 1.5, s.position.z);
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshLambertMaterial color="#4488cc" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshLambertMaterial color="#ffcc99" />
      </mesh>
    </group>
  );
}
