# OpenWorld

Built with PortOS Stack.

## Quick Start

```bash
npm run install:all
npm run dev
```

## Architecture

- **Client**: React + Vite + Tailwind (port 5571)
- **Server**: Express + Socket.IO (port 5570)
- **AI**: portos-ai-toolkit for provider management
- **PM2**: Process management
- **CI/CD**: GitHub Actions

## API Endpoints

- `GET /api/health` - Health check
- `GET/POST /api/providers` - AI provider management
- `GET/POST /api/runs` - AI execution runs
- `GET/POST /api/prompts` - Prompt templates

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server |
| `npm run build` | Build client for production |
| `npm test` | Run server tests |
