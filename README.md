# OpenWorld

A web-based 3D open world game built with Three.js and React.

## Quick Start

```bash
npm run install:all
npm run dev
```

Open http://localhost:5571 and click the canvas to start exploring.

## Controls

| Key | Action |
|-----|--------|
| `W A S D` | Move |
| `Mouse` | Look around |
| `Shift` | Sprint |
| `Space` | Jump |
| `Click` | Lock cursor |
| `Esc` | Release cursor |

## Architecture

- **Client**: React + Three.js + Vite (port 5571)
- **Server**: Express + Socket.IO (port 5570)
- **PM2**: Process management

## Features

- Procedural terrain with heightmap
- Third-person player character with physics
- Trees, rocks, and environmental objects
- Water plane with transparency
- Dynamic sky and lighting
- Fog and distance rendering
- Multiplayer-ready Socket.IO backend

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server in dev mode |
| `npm run build` | Build client for production |
| `npm test` | Run server tests |
