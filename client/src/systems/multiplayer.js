import { io } from 'socket.io-client'

let socket = null
const remotePlayers = new Map()
const listeners = new Set()

export function connectMultiplayer() {
  if (socket) return socket

  socket = io(window.location.origin, {
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('Connected to server:', socket.id)
  })

  socket.on('players:init', (players) => {
    for (const p of players) {
      if (p.id !== socket.id) {
        remotePlayers.set(p.id, {
          ...p,
          targetPosition: { ...p.position },
          targetRotation: { ...p.rotation },
          state: p.state || 'GROUNDED',
        })
      }
    }
    notifyListeners()
  })

  socket.on('player:joined', (player) => {
    remotePlayers.set(player.id, {
      ...player,
      targetPosition: { ...player.position },
      targetRotation: { ...player.rotation },
      state: player.state || 'GROUNDED',
    })
    notifyListeners()
  })

  socket.on('player:moved', (data) => {
    const existing = remotePlayers.get(data.id)
    if (existing) {
      existing.targetPosition = { ...data.position }
      existing.targetRotation = { ...data.rotation }
      existing.state = data.state || existing.state
      existing.velocity = data.velocity || existing.velocity
    }
  })

  socket.on('player:left', (id) => {
    remotePlayers.delete(id)
    notifyListeners()
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
    remotePlayers.clear()
    notifyListeners()
  })

  return socket
}

export function sendPlayerUpdate(position, rotation, state, velocity) {
  if (!socket?.connected) return
  socket.emit('player:move', { position, rotation, state, velocity })
}

export function getRemotePlayers() {
  return remotePlayers
}

export function onPlayersChanged(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function notifyListeners() {
  for (const cb of listeners) cb()
}

// Interpolate remote player positions toward target (call in useFrame)
export function interpolateRemotePlayers(lerpFactor = 0.15) {
  for (const [, player] of remotePlayers) {
    const p = player.position
    const t = player.targetPosition
    p.x += (t.x - p.x) * lerpFactor
    p.y += (t.y - p.y) * lerpFactor
    p.z += (t.z - p.z) * lerpFactor

    const r = player.rotation
    const tr = player.targetRotation
    r.y += (tr.y - r.y) * lerpFactor
  }
}
