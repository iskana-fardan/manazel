# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fullstack web application for managing and exploring Islamic knowledge roadmaps (Peta Ilmu Islam).

- **Backend**: Node.js + Express 5 + MongoDB (Mongoose) — `commonjs`, runs on port 5000
- **Frontend**: React 19 + TypeScript + Material UI v7 — `esm`, Vite dev server on port 5173
- **Infra**: Docker Compose with MongoDB 7 service

---

## Commands

### Backend (`/backend`)

```bash
npm run dev     # nodemon with DEBUG=app:*,db:* logging
npm start       # production
npm test        # jest
node src/seed/admin.seed.js   # seed the first admin user (requires SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD in .env)
```

### Frontend (`/frontend`)

```bash
npm run dev     # Vite dev server (--host)
npm run build   # tsc -b && vite build
npm run lint    # eslint
```

### Full stack

```bash
docker-compose up   # spins up frontend, backend, and MongoDB together
```

---

## Architecture

### Backend

Controllers are wrapped in `asyncMiddleware` (`middleware/async.middleware.js`) so thrown errors automatically propagate to the global error handler (`middleware/error.middleware.js`) via `next(ex)`. All route handlers must be wrapped with it.

Authentication uses **httpOnly cookies** (not `Authorization` header). `auth.middleware.js` reads `req.cookies.token`, verifies the JWT, and attaches the payload as `req.admin`.

Validation schemas live inside the model files (e.g., `models/roadmap.model.js` exports both `Roadmap` and `validate`). Use Joi for all input validation.

**API routes:**
| Prefix | Resource |
|---|---|
| `/api/fields` | Islamic knowledge fields |
| `/api/roadmaps` | Roadmaps (per field slug) |
| `/api/books` | Books |
| `/api/contributors` | Contributors |
| `/api/auth` | Login / logout |

### Roadmap data model

A `Roadmap` belongs to one `Field` and has two parallel section arrays:
- `levels` → the **dars** (study) section
- `muthalaah` → the **muthalaah** (supplementary reading) section

Each section array contains level subdocuments (`beginner`, `intermediate`, `advanced`) that hold `books` as ObjectId refs. In route params, the section is passed as the string `"dars"` or `"muthalaah"` and mapped in the controller.

### Frontend — two distinct areas

**Public site** (`src/features/`, `src/pages/`, `src/sections/`) — reads from **static JSON files** in `src/data/` (roadmaps, fields, books). It does not call the API.

**Admin panel** (`src/admin/`) — calls the live API via React Query hooks. Protected by `AdminGuard` which checks local auth state before rendering `AdminLayout`.

Each admin feature follows this structure:
```
admin/features/<feature>/
  <Feature>Page.tsx       # page component, wires hooks to UI
  <Feature>Table.tsx      # MUI DataGrid
  <Feature>Dialog.tsx     # create/edit form
  <feature>.schema.ts     # zod schema for react-hook-form
  <feature>.types.ts      # TypeScript types
```

### Frontend — API layer

All API calls go through the shared axios instance at `src/services/apiClient.ts` (baseURL from `VITE_API_URL` env var, `withCredentials: true`). Per-resource functions live in `src/services/*.api.ts`. React Query hooks in `src/hooks/` consume those functions.

Never call `fetch`/`axios` directly from a component — always go through the service file and a hook.

### Admin seeding

The admin user is not created via the API. Run the seed script once with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` set in the backend `.env`.
