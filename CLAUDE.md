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
npm run dev            # nodemon with DEBUG=app:*,db:* logging
npm start              # production
npm test               # jest --watchAll (unit tests only)
npm run test:unit      # unit tests, no watch
npm run test:integration  # integration tests, no watch, --forceExit
npm run test:all       # all tests (unit + integration), no watch
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

#### Security middleware stack (`src/app.js`)

Applied in order before routes:
1. `helmet()` — sets secure HTTP headers
2. `cors({ origin: allowedOrigins, credentials: true })` — `CORS_ORIGIN` env var (comma-separated list); falls back to `true` (allow all) if unset
3. `express.json({ limit: "10kb" })` — body size cap
4. `cookieParser()`
5. `express-rate-limit` on `POST /api/auth/login` only — 10 requests per 15 min window; **disabled when `NODE_ENV=test`**

#### Winston logging (`src/startup/logging.js`)

Structured logging via Winston. Dev: colorized console. Prod: JSON format only.

Writes to `logs/` (auto-created):
- `error.log` — errors only
- `combined.log` — all levels
- `exceptions.log` — uncaught exceptions
- `rejections.log` — unhandled promise rejections

The error middleware logs through Winston before responding. Import logger as `require("../startup/logging")`.

#### Error middleware (`src/middleware/error.middleware.js`)

Handles these error shapes before falling back to 500:
- `CastError` → 400 `"Invalid ID"`
- Mongoose `ValidationError` → 400 with joined field messages
- MongoDB duplicate key (`err.code === 11000`) → 400 `"Duplicate value for <field>"`
- Errors with `err.status` / `err.statusCode` set → that status + `err.message`

#### API routes

All routes follow the same pattern: public GET, auth-protected writes.

| Prefix | Resource | Routes |
|---|---|---|
| `/api/fields` | Islamic knowledge fields | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/roadmaps` | Roadmaps (per field slug) | `GET /`, `GET /:fieldSlug`, `POST /:fieldSlug`, `POST /:fieldSlug/:section/:levelSlug/books`, `DELETE /:fieldSlug/:section/:levelSlug/books/:bookId` |
| `/api/books` | Books | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/contributors` | Contributors | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/auth` | Login / logout / me | — |

### Roadmap data model

A `Roadmap` belongs to one `Field` and has two parallel section arrays with identical subdocument shape:
- `levels` → the **dars** (study) section
- `muthalaah` → the **muthalaah** (supplementary reading) section

Each array contains level subdocuments (`beginner`, `intermediate`, `advanced`) that hold `books` as ObjectId refs. Route params pass the section as the string `"dars"` or `"muthalaah"` and the controller maps it to the correct array. The roadmap is always looked up by its Field's `slug` (not by its own `_id`).

### Backend test suite

Two separate Jest configs:

| Config | File pattern | Run command |
|---|---|---|
| `jest.config.js` | `tests/unit/**/*.test.js` | `npm run test:unit` |
| `jest.integration.config.js` | `tests/integration/**/*.test.js` | `npm run test:integration` |

**Unit tests** (`tests/unit/`) — mock all dependencies, cover controllers, middleware, and model validation functions.

**Integration tests** (`tests/integration/`) — use `mongodb-memory-server` (in-memory MongoDB) + `supertest` against the real Express app. Setup helpers in `tests/integration/setup/`:
- `db.js` — `connect()` / `disconnect()` / `clearCollections()` using `MongoMemoryServer`
- `auth.js` — creates a seeded admin and returns a signed cookie for protected route tests

Integration tests set `NODE_ENV=test` which disables rate limiting.

### Frontend — two distinct areas

**Public site** (`src/features/`, `src/pages/`, `src/sections/`) — the primary pattern is to read from **static JSON files** in `src/data/`. Some components (e.g., `LearningCategories.tsx` in the footer) have been migrated to call the live API via hooks; others still use static data directly.

**Admin panel** (`src/admin/`) — calls the live API via React Query hooks. Protected by `AdminGuard` (`admin/routes/AdminGuard.tsx`), which calls `GET /auth/me` on mount and redirects to `/admin/login` if unauthenticated.

**Routing** is defined in `src/app/router.tsx` via `createBrowserRouter`. Public routes are wrapped in `RootLayout` (Navbar + Footer + Outlet). Admin routes are nested under `/admin` behind `AdminGuard` and `AdminLayout`, exported as `adminRoutes` from `src/admin/routes.tsx`. `src/App.tsx` is stale and unused — do not edit it.

#### Admin route structure (`src/admin/routes.tsx`)

```
/admin/login          → LoginPage      (admin/pages/LoginPage.tsx)
/admin                → DashboardPage  (admin/pages/DashboardPage.tsx)
/admin/books          → BooksPage      (admin/features/books/BooksPage.tsx)
/admin/roadmaps       → RoadmapsPage   (admin/features/roadmaps/RoadmapsPage.tsx)
/admin/fields         → FieldsPage     (admin/features/fields/FieldsPage.tsx)
/admin/contributors   → ContributorsPage (admin/features/contributors/ContributorsPage.tsx)
/admin/settings       → SettingsPage   (admin/features/settings/SettingsPage.tsx)
```

Note: `admin/pages/` contains `DashboardPage` and `LoginPage` (still used) plus stale `BooksPage` and `RoadmapsPage` wrappers that are no longer imported by the router.

### Frontend — API layer

**Two axios instances** with identical config (`baseURL: VITE_API_URL`, `withCredentials: true`):
- `src/services/apiClient.ts` — used by public-facing service files
- `src/admin/services/api.ts` — used by admin service calls

Per-resource service functions live in `src/services/*.api.ts`. React Query hooks in `src/hooks/` consume those functions.

Never call `fetch`/`axios` directly from a component — always go through the service file and a hook.

Query keys follow the pattern `["fields"]`, `["books"]`, `["roadmap", fieldSlug]`, `["roadmaps"]`, etc. Mutations call `queryClient.invalidateQueries` on success to keep data fresh.

**Roadmap hooks are split across two files:**
- `src/hooks/useRoadmaps.ts` — `useAllRoadmaps()` (list all roadmaps)
- `src/hooks/useRoadmap.ts` — `useRoadmap(fieldSlug)`, `useCreateRoadmap`, `useAddBookToSection`, `useRemoveBookFromSection`

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
