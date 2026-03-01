# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
# Install all dependencies
npm run install:all

# Development (both server and client)
npm run dev

# Run tests
cd server && npm test

# Production
pm2 start ecosystem.config.cjs
```

## Architecture

OpenWorld is a Three.js open world game with an Express.js server (port 5570) and React/Vite client (port 5571). PM2 manages app lifecycles.

### Server (`server/`)
- **index.js**: Express server with Socket.IO for multiplayer game state

### Client (`client/src/`)
- **App.jsx**: Main game canvas with Three.js scene
- **main.jsx**: React entry point
- **components/Terrain.jsx**: Procedural terrain with heightmap
- **components/Player.jsx**: Third-person player controller (WASD + mouse look)
- **components/Trees.jsx**: Procedurally placed trees and rocks
- **components/Water.jsx**: Water plane
- **components/Sky.jsx**: Sky dome, sun, and lighting
- **components/HUD.jsx**: Game overlay UI (crosshair, controls help)

### Tech Stack
- **Three.js** via `@react-three/fiber` and `@react-three/drei`
- **React 18** for UI composition
- **Socket.IO** for multiplayer events
- **Tailwind CSS** for HUD styling

## Code Conventions

- **No try/catch** - errors bubble to centralized middleware
- **Functional programming** - no classes, use hooks in React
- **Single-line logging** - use emoji prefixes

## Git Workflow

- **dev**: Active development (auto-bumps patch on CI pass)
- **main**: Production releases only
