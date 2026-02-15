# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PyWebIO Playground is an online code editor for the PyWebIO framework (play.pywebio.online). Users write Python code in a Monaco editor with Language Server Protocol (LSP) support, execute it, and see results in an embedded iframe.

## Architecture

```
Frontend (TypeScript)                    Backend (Python)
├── Monaco Editor                        ├── pywebio_server.py (code executor)
├── LSP WebSocket client                 └── pylsp (language server)
└── Express static server
```

**Flow**: User writes code → clicks Run → code is base64-encoded → posted to iframe → server decodes and executes with `exec()` → result renders in iframe.

**Deployment**: Frontend on GitHub Pages (`docs/`), backend on Fly.io (pywebio-server + pywebio-lsp containers).

## Build Commands

### Frontend (`/frontend`)
```bash
yarn                  # Install dependencies
yarn prepare          # Full build (clean, compile, webpack, copy)
yarn run start        # Start dev server on port 4200
yarn run watch        # Watch TypeScript files
yarn run compile      # TypeScript compilation only
```

### Backend (`/server`)
```bash
pip install -r requirements.txt
python pywebio_server.py              # Run server locally

# Docker builds
docker build -t pywebio-server -f Dockerfile .
docker build -t pywebio-language-server -f LSP.dockerfile .
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/index.html` | Main UI with Monaco editor container and execution logic |
| `frontend/src/client.ts` | Monaco setup + LSP WebSocket connection to `wss://pywebio-lsp.fly.dev` |
| `frontend/src/main.ts` | Entry point that bootstraps Monaco and client |
| `server/pywebio_server.py` | Receives base64 code, validates referrer, executes with `exec()` |
| `server/url_shorter_workers.js` | Cloudflare Workers URL shortener for code sharing |

## Configuration

- `frontend/webpack.config.js` - Monaco editor bundling with web workers
- `server/fly.toml` - Fly.io deployment (port 8080, auto-restart enabled)
- `.github/workflows/build.yml` - Auto-builds frontend on master push, deploys to `docs/`

## Implementation Notes

- **Security**: Referrer validation whitelist (localhost, play.pywebio.online)
- **Code Sharing**: Base64-encoded code in URL hash
- **Auto-restart**: Server restarts every 30 minutes in production (Dockerfile timeout)
- **LSP**: Connects via WebSocket with automatic reconnection handling
