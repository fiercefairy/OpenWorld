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

OpenWorld is a monorepo with Express.js server (port 5570) and React/Vite client (port 5571). PM2 manages app lifecycles.

### Server (`server/`)
- **index.js**: Express server with Socket.IO and AI toolkit integration

### Client (`client/src/`)
- **App.jsx**: Main component with routing and collapsible nav
- **main.jsx**: React entry point

### AI Provider Integration

This project includes `portos-ai-toolkit` for AI provider management. The server exposes:
- `GET/POST /api/providers` - Manage AI providers (CLI or API-based)
- `GET/POST /api/runs` - Execute and track AI runs
- `GET/POST /api/prompts` - Manage prompt templates

Provider data is stored in `./data/providers.json`.

## Code Conventions

- **No try/catch** - errors bubble to centralized middleware
- **Functional programming** - no classes, use hooks in React
- **Single-line logging** - use emoji prefixes

## Git Workflow

- **dev**: Active development (auto-bumps patch on CI pass)
- **main**: Production releases only
