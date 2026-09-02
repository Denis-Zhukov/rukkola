# Rukkola

Full-stack marketplace application built as a **TypeScript monorepo**: a Next.js frontend, a NestJS backend and a shared types package, orchestrated with Docker Compose.

## Monorepo layout

```
packages/
├── frontend/   # Next.js client (App Router, components, hooks, lib)
├── backend/    # NestJS API
└── shared/     # Shared TypeScript code (types, contracts)
docker/         # Per-service Dockerfiles + docker-compose.yaml
```

## Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend:** NestJS, TypeScript
- **Tooling:** Yarn workspaces, Docker Compose, ESLint

## Getting started

```bash
cp .env.example .env
yarn install
```

Local services are orchestrated via `docker/docker-compose.yaml` — per-service Dockerfiles for the backend and frontend are included in `docker/`.
