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
npm test        # jest (no single-test flag needed; use .only or describe.only in the file)
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

Controllers are wrapped in `asyncMiddleware` (`middleware/async.middleware.js`) so thrown errors automatically propagate to the global error handler (`middleware/error.middleware.js`) via `next(ex)`. Every route handler must be wrapped with it.

Authentication uses **httpOnly cookies** (not `Authorization` header). `auth.middleware.js` reads `req.cookies.token`, verifies the JWT, and attaches the payload as `req.admin`. JWT expires in 1 day, signed with `process.env.JWT_SECRET`.

Validation schemas live inside the model files (e.g., `models/field.model.js` exports both `Field` and `validateField`). Use Joi for all input validation; errors return 400 with Joi error details.

`role.middleware.js` exists but is not yet applied to any routes — it's scaffolded for future RBAC.

**API routes:**
| Prefix | Resource |
|---|---|
| `/api/fields` | Islamic knowledge fields |
| `/api/roadmaps` | Roadmaps (per field slug) |
| `/api/books` | Books |
| `/api/contributors` | Contributors |
| `/api/auth` | Login / logout / me |

### Roadmap data model

A `Roadmap` belongs to one `Field` and has two parallel section arrays with identical subdocument shape:
- `levels` → the **dars** (study) section
- `muthalaah` → the **muthalaah** (supplementary reading) section

Each array contains level subdocuments (`beginner`, `intermediate`, `advanced`) that hold `books` as ObjectId refs. Route params pass the section as the string `"dars"` or `"muthalaah"` and the controller maps it to the correct array. The roadmap is always looked up by its Field's `slug` (not by its own `_id`).

### Frontend — two distinct areas

**Public site** (`src/features/`, `src/pages/`, `src/sections/`) — the primary pattern is to read from **static JSON files** in `src/data/`. Some components (e.g., `LearningCategories.tsx` in the footer) have been migrated to call the live API via hooks; others still use static data directly.

**Admin panel** (`src/admin/`) — calls the live API via React Query hooks. Protected by `AdminGuard` (`admin/routes/AdminGuard.tsx`), which calls `GET /auth/me` on mount and redirects to `/admin/login` if unauthenticated.

**Routing** is defined in `src/app/router.tsx` via `createBrowserRouter`. Public routes are wrapped in `RootLayout` (Navbar + Footer + Outlet). Admin routes are nested under `/admin` behind `AdminGuard`. `src/App.tsx` is stale and unused — do not edit it.

### Frontend — API layer

All API calls go through the shared axios instance at `src/services/apiClient.ts` (baseURL from `VITE_API_URL`, `withCredentials: true`). Per-resource functions live in `src/services/*.api.ts`. React Query hooks in `src/hooks/` consume those functions.

Never call `fetch`/`axios` directly from a component — always go through the service file and a hook.

Query keys follow the pattern `["fields"]`, `["books"]`, `["roadmap", fieldSlug]`, etc. Mutations call `queryClient.invalidateQueries` on success to keep data fresh.

### Admin feature structure

Each admin feature follows this pattern:

```
admin/features/<feature>/
  <Feature>Page.tsx       # page component, wires hooks to UI
  <Feature>Table.tsx      # MUI DataGrid
  <Feature>Dialog.tsx     # create/edit form (react-hook-form + Zod, handles both modes via initialData)
  <feature>.schema.ts     # Zod validation schema
  <feature>.types.ts      # TypeScript interfaces
```

Dialog components detect create vs. edit mode from `initialData` and call `reset()` in `useEffect` when it changes.

### Admin seeding

The admin user is not created via the API. Run the seed script once with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` set in the backend `.env`.
