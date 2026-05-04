# Backend — Peta Ilmu Islam

Node.js + Express 5 REST API backed by MongoDB. Runs on port **5000**.

---

## Table of Contents

- [Architecture](#architecture)
- [Setup & Running](#setup--running)
  - [Local development](#local-development)
  - [Production](#production)
  - [Docker](#docker)
- [Environment Variables](#environment-variables)
- [REST API Reference](#rest-api-reference)
  - [Authentication](#authentication)
  - [Fields](#fields)
  - [Books](#books)
  - [Contributors](#contributors)
  - [Roadmaps](#roadmaps)
- [Authentication & Role Flow](#authentication--role-flow)
- [Data Models](#data-models)
- [Logging](#logging)
- [Testing](#testing)
- [Seeding](#seeding)

---

## Architecture

```mermaid
graph LR
    Client -->|HTTP + Cookie| Routes
    Routes --> AuthMiddleware
    Routes --> AsyncMiddleware
    AsyncMiddleware --> Controllers
    Controllers --> Models
    Models --> MongoDB
    Controllers -->|throws| AsyncMiddleware
    AsyncMiddleware -->|next(err)| ErrorMiddleware
    ErrorMiddleware --> Client
```

The application follows a strict MVC layering:

| Layer | Files | Responsibility |
|---|---|---|
| Routes | `src/routes/*.routes.js` | URL binding, middleware chain |
| Middleware | `src/middleware/` | Auth check, async wrapper, error handler, role guard |
| Controllers | `src/controllers/*.controller.js` | Business logic, input validation, response shaping |
| Models | `src/models/*.model.js` | Mongoose schema + Joi validation function |
| Startup | `src/startup/` | DB connection, Winston logger configuration |

Every route handler is wrapped with `asyncMiddleware` so thrown errors are forwarded to the global error handler automatically — no per-handler `try/catch` needed except in `auth.controller.js` which predates the pattern.

---

## Setup & Running

### Local development

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET at minimum
npm install
npm run dev               # nodemon, restarts on file change
```

The server starts on the port defined by `PORT` (default `5000`).

### Production

```bash
NODE_ENV=production npm start
```

### Docker

The backend Dockerfile is a two-stage build:

1. **deps** stage — installs production-only dependencies with `npm ci --omit=dev`.
2. **runtime** stage — copies deps and source, creates a non-root `app` user, exposes port 5000.

In the Docker Compose stack the backend is not exposed to the host; Nginx proxies `/api/*` to it over the internal `app_net` network.

---

## Environment Variables

| Variable | Description | Required | Default |
|---|---|---|---|
| `PORT` | Port the server listens on | No | `5000` |
| `NODE_ENV` | `development` \| `production` \| `test` | No | — |
| `MONGO_URI` | Full MongoDB connection string | **Yes** | — |
| `JWT_SECRET` | Secret used to sign JWT tokens | **Yes** | — |
| `CORS_ORIGIN` | Comma-separated list of allowed origins | No | Reflects any origin |
| `SEED_ADMIN_EMAIL` | Email for the seeded admin account | Seed only | — |
| `SEED_ADMIN_PASSWORD` | Password for the seeded admin account | Seed only | — |

> When `NODE_ENV=test` the rate limiter on `/api/auth/login` is disabled to avoid false positives in CI.

---

## REST API Reference

Base URL: `http://localhost:5000/api`

All request bodies must be `Content-Type: application/json`.  
Authentication uses an httpOnly cookie named `token` (set on login, cleared on logout). Protected endpoints return `401` if the cookie is absent or invalid.

---

### Authentication

#### `POST /auth/login`

Validates credentials and sets the `token` cookie.

| | |
|---|---|
| Auth required | No |
| Rate limit | 10 req / 15 min per IP |

**Request body:**

```json
{
  "email": "admin@example.com",
  "password": "ChangeMe123!"
}
```

**Success `200`:**

```json
{
  "message": "Login successful",
  "admin": {
    "id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Super Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | Email not found or password mismatch |
| `429` | Rate limit exceeded |
| `500` | Server error |

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"admin@example.com","password":"ChangeMe123!"}'
```

---

#### `POST /auth/logout`

Clears the `token` cookie.

| | |
|---|---|
| Auth required | No |

**Success `200`:**

```json
{ "message": "Logged out successfully" }
```

```bash
curl -X POST http://localhost:5000/api/auth/logout -b cookies.txt -c cookies.txt
```

---

#### `GET /auth/me`

Returns the currently authenticated admin (password field excluded).

| | |
|---|---|
| Auth required | **Yes** |

**Success `200`:**

```json
{
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "name": "Super Admin",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "2024-05-19T10:00:00.000Z",
  "updatedAt": "2024-05-19T10:00:00.000Z"
}
```

**Errors:**

| Status | Condition |
|---|---|
| `401` | No cookie or invalid/expired token |
| `404` | Admin document deleted after token was issued |

```bash
curl http://localhost:5000/api/auth/me -b cookies.txt
```

---

### Fields

A **field** represents a classical Islamic discipline (e.g., Nahwu, Fiqh). Each field has a unique `slug` used as the foreign key for roadmaps.

#### `GET /fields`

Returns all fields sorted by `order` ascending.

| | |
|---|---|
| Auth required | No |

**Success `200`:** Array of field objects.

```json
[
  {
    "_id": "664a...",
    "slug": "nahwu",
    "name": "Nahwu",
    "nameArabic": "النحو",
    "description": "Arabic grammar",
    "icon": "book",
    "order": 1,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

```bash
curl http://localhost:5000/api/fields
```

---

#### `POST /fields`

Creates a new field.

| | |
|---|---|
| Auth required | **Yes** |

**Request body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | Yes | Lowercased, unique |
| `name` | string | Yes | |
| `nameArabic` | string | Yes | |
| `description` | string | Yes | |
| `icon` | string | Yes | |
| `order` | number | Yes | Unique display order |

**Success `200`:** The created field object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Joi validation failure or slug already exists |
| `401` | Not authenticated |

```bash
curl -X POST http://localhost:5000/api/fields \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"slug":"aqidah","name":"Aqidah","nameArabic":"العقيدة","description":"Islamic creed","icon":"star","order":2}'
```

---

#### `PUT /fields/:id`

Updates a field by MongoDB ObjectId.

| | |
|---|---|
| Auth required | **Yes** |

**Request body:** Same shape as `POST /fields`.

**Success `200`:** Updated field object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Invalid ObjectId, Joi failure, or slug taken by another document |
| `401` | Not authenticated |
| `404` | Field not found |

```bash
curl -X PUT http://localhost:5000/api/fields/664a1b2c3d4e5f6a7b8c9d0e \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"slug":"aqidah","name":"Aqidah (updated)","nameArabic":"العقيدة","description":"Islamic creed","icon":"star","order":2}'
```

---

#### `DELETE /fields/:id`

Deletes a field by MongoDB ObjectId.

| | |
|---|---|
| Auth required | **Yes** |

**Success `200`:**

```json
{ "message": "Field deleted" }
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | Invalid ObjectId |
| `401` | Not authenticated |
| `404` | Field not found |

```bash
curl -X DELETE http://localhost:5000/api/fields/664a1b2c3d4e5f6a7b8c9d0e -b cookies.txt
```

---

### Books

A **book** is a classical Islamic text. Books are referenced by roadmap level subdocuments via ObjectId.

#### `GET /books`

Returns all books.

| | |
|---|---|
| Auth required | No |

**Success `200`:** Array of book objects.

```json
[
  {
    "_id": "664b...",
    "title": "Tuhfah Saniyyah",
    "titleArabic": "التحفة السنية",
    "author": "Ibn Ajurrum",
    "type": "matn",
    "level": "beginner",
    "field": "nahwu",
    "description": "Introductory text on Arabic grammar",
    "recommendedUsage": "Read with a teacher",
    "resources": [
      { "label": "PDF", "type": "pdf", "url": "https://example.com/tuhfah.pdf" }
    ],
    "recommendedEditions": [
      { "label": "Dar al-Minhaj edition", "publisher": "Dar al-Minhaj", "note": "Best typesetting" }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

```bash
curl http://localhost:5000/api/books
```

---

#### `POST /books`

Creates a new book.

| | |
|---|---|
| Auth required | **Yes** |

**Request body:**

| Field | Type | Required | Validation |
|---|---|---|---|
| `title` | string | Yes | 3–255 chars |
| `titleArabic` | string | No | 3–255 chars |
| `author` | string | Yes | 3–255 chars |
| `type` | string | No | |
| `level` | string | No | |
| `field` | string | No | |
| `description` | string | No | max 500 chars |
| `recommendedUsage` | string | No | max 500 chars |
| `resources` | array | No | Each item: `label` (3–255), `type` (3–100), `url` (URI) |
| `recommendedEditions` | array | No | Each item: `label` (3–255, required), `publisher` (3–255, optional), `note` (3–255, optional) |

**Success `201`:** Created book object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Joi validation failure or title already exists |
| `401` | Not authenticated |

```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Tuhfah Saniyyah","author":"Ibn Ajurrum","level":"beginner","field":"nahwu"}'
```

---

#### `PUT /books/:id`

Updates a book by MongoDB ObjectId.

| | |
|---|---|
| Auth required | **Yes** |

**Request body:** Same shape as `POST /books`.

**Success `200`:** Updated book object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Invalid ObjectId or Joi failure |
| `401` | Not authenticated |
| `404` | Book not found |

```bash
curl -X PUT http://localhost:5000/api/books/664b... \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Tuhfah Saniyyah","author":"Ibn Ajurrum","level":"beginner","field":"nahwu","description":"Updated desc"}'
```

---

#### `DELETE /books/:id`

Deletes a book by MongoDB ObjectId.

| | |
|---|---|
| Auth required | **Yes** |

**Success `200`:**

```json
{ "message": "Book deleted" }
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | Invalid ObjectId |
| `401` | Not authenticated |
| `404` | Book not found |

```bash
curl -X DELETE http://localhost:5000/api/books/664b... -b cookies.txt
```

---

### Contributors

A **contributor** is a person who helped build the site.

#### `GET /contributors`

Returns all contributors.

| | |
|---|---|
| Auth required | No |

**Success `200`:** Array of contributor objects.

```json
[
  {
    "_id": "664c...",
    "name": "Ahmad Fauzi",
    "role": "Content Editor",
    "description": "Specialist in classical fiqh texts",
    "avatar": "https://example.com/avatar.jpg",
    "socials": {
      "github": "https://github.com/ahmadfauzi",
      "instagram": "@ahmadfauzi",
      "website": "https://ahmadfauzi.dev"
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

```bash
curl http://localhost:5000/api/contributors
```

---

#### `POST /contributors`

Creates a new contributor.

| | |
|---|---|
| Auth required | **Yes** |

**Request body:**

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | Yes | 3–50 chars |
| `role` | string | Yes | 3–100 chars |
| `description` | string | Yes | max 500 chars |
| `avatar` | string | No | URI |
| `socials.github` | string | No | URI |
| `socials.instagram` | string | No | |
| `socials.website` | string | No | URI |

**Success `200`:** Created contributor object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Joi validation failure |
| `401` | Not authenticated |

```bash
curl -X POST http://localhost:5000/api/contributors \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Ahmad Fauzi","role":"Content Editor","description":"Fiqh specialist"}'
```

---

#### `PUT /contributors/:id`

Updates a contributor by MongoDB ObjectId.

| | |
|---|---|
| Auth required | **Yes** |

**Request body:** Same shape as `POST /contributors`.

**Success `200`:** Updated contributor object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Invalid ObjectId or Joi failure |
| `401` | Not authenticated |
| `404` | Contributor not found |

---

#### `DELETE /contributors/:id`

Deletes a contributor by MongoDB ObjectId.

| | |
|---|---|
| Auth required | **Yes** |

**Success `200`:**

```json
{ "message": "Contributor deleted" }
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | Invalid ObjectId |
| `401` | Not authenticated |
| `404` | Contributor not found |

---

### Roadmaps

A **roadmap** belongs to one field and contains two parallel section arrays — `levels` (dars/study) and `muthalaah` (supplementary reading). Each array always contains three level subdocuments: `beginner`, `intermediate`, `advanced`.

#### `GET /roadmaps`

Returns all roadmaps (no population of book or field refs).

| | |
|---|---|
| Auth required | No |

**Success `200`:** Array of roadmap objects.

```bash
curl http://localhost:5000/api/roadmaps
```

---

#### `GET /roadmaps/:fieldSlug`

Returns the roadmap for a specific field, looked up by the field's `slug`.

| | |
|---|---|
| Auth required | No |

**Success `200`:** Roadmap object.

**Errors:**

| Status | Condition |
|---|---|
| `404` | No field with that slug, or field has no roadmap |

```bash
curl http://localhost:5000/api/roadmaps/nahwu
```

---

#### `POST /roadmaps/:fieldSlug`

Creates a roadmap for a field. The roadmap is initialized with empty `beginner`, `intermediate`, and `advanced` level subdocuments in both `levels` and `muthalaah`. The `title` is copied from the field's `name`.

| | |
|---|---|
| Auth required | **Yes** |

**Request body:** None required.

**Success `201`:** Created roadmap object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Roadmap already exists for this field |
| `401` | Not authenticated |
| `404` | Field not found |

```bash
curl -X POST http://localhost:5000/api/roadmaps/nahwu -b cookies.txt
```

---

#### `POST /roadmaps/:fieldSlug/:section/:levelSlug/books`

Adds a book to a roadmap level section.

| | |
|---|---|
| Auth required | **Yes** |

**URL params:**

| Param | Values |
|---|---|
| `section` | `dars` or `muthalaah` |
| `levelSlug` | `beginner`, `intermediate`, or `advanced` |

**Request body:**

```json
{ "bookId": "664b..." }
```

**Success `200`:** Updated roadmap object.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Book already in this level |
| `401` | Not authenticated |
| `404` | Roadmap or level not found |

```bash
curl -X POST http://localhost:5000/api/roadmaps/nahwu/dars/beginner/books \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"bookId":"664b..."}'
```

---

#### `DELETE /roadmaps/:fieldSlug/:section/:levelSlug/books/:bookId`

Removes a book from a roadmap level section.

| | |
|---|---|
| Auth required | **Yes** |

**URL params:** Same as the add endpoint; `bookId` is the MongoDB ObjectId of the book to remove.

**Success `200`:** Updated roadmap object.

**Errors:**

| Status | Condition |
|---|---|
| `401` | Not authenticated |
| `404` | Roadmap or level not found |

```bash
curl -X DELETE http://localhost:5000/api/roadmaps/nahwu/dars/beginner/books/664b... -b cookies.txt
```

---

## Authentication & Role Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as auth.routes
    participant AC as auth.controller
    participant AM as auth.middleware
    participant DB as MongoDB

    C->>A: POST /auth/login {email, password}
    A->>AC: login()
    AC->>DB: Admin.findOne({email})
    DB-->>AC: admin doc
    AC->>AC: bcrypt.compare(password, hash)
    AC->>AC: jwt.sign({id, role}, JWT_SECRET, {expiresIn:"1d"})
    AC-->>C: Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict

    C->>AM: GET /auth/me (Cookie: token=<jwt>)
    AM->>AM: jwt.verify(token, JWT_SECRET)
    AM->>A: req.admin = {id, role}
    A->>AC: me()
    AC->>DB: Admin.findById(id).select("-password")
    DB-->>AC: admin doc
    AC-->>C: 200 admin object
```

- Cookies are `httpOnly` (not accessible via JavaScript), `SameSite=Strict`, and `secure` in production.
- The JWT payload contains `{ id, role }`. Token lifetime is **1 day**.
- `role.middleware.js` is scaffolded for future RBAC but is **not currently applied** to any route. All protected routes require only authentication, not a specific role.

---

## Data Models

### Admin

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Trimmed |
| `email` | String | Yes | Unique, lowercased |
| `password` | String | Yes | Bcrypt hash, min length 6 |
| `role` | String | Yes | `"admin"` \| `"superadmin"`, default `"admin"` |
| `createdAt` | Date | — | Auto (timestamps) |
| `updatedAt` | Date | — | Auto (timestamps) |

---

### Book

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | No* | Joi: required, 3–255 chars |
| `titleArabic` | String | No | Joi: optional, 3–255 chars |
| `author` | String | No* | Joi: required, 3–255 chars |
| `type` | String | No | e.g. `"matn"`, `"sharh"` |
| `level` | String | No | e.g. `"beginner"` |
| `field` | String | No | Discipline name (denormalized string) |
| `description` | String | No | max 500 chars |
| `recommendedUsage` | String | No | max 500 chars |
| `resources` | `[ResourceSchema]` | No | See below |
| `recommendedEditions` | `[EditionSchema]` | No | See below |
| `createdAt` | Date | — | Auto |
| `updatedAt` | Date | — | Auto |

> \* Not `required` at the Mongoose schema level, but required by the Joi validator used in the controller.

**ResourceSchema** (subdocument):

| Field | Type | Joi |
|---|---|---|
| `label` | String | required, 3–255 |
| `type` | String | required, 3–100 |
| `url` | String | required, URI |

**EditionSchema** (subdocument):

| Field | Type | Joi |
|---|---|---|
| `label` | String | required, 3–255 |
| `publisher` | String | optional, 3–255 |
| `note` | String | optional, 3–255 |

---

### Contributor

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Trimmed |
| `role` | String | Yes | Trimmed |
| `description` | String | Yes | Trimmed |
| `avatar` | String | Yes | URI (Joi), trimmed |
| `socials.github` | String | No | URI (Joi) |
| `socials.instagram` | String | No | |
| `socials.website` | String | No | URI (Joi) |
| `createdAt` | Date | — | Auto |
| `updatedAt` | Date | — | Auto |

---

### Field

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | String | Yes | Unique, trimmed, lowercased |
| `name` | String | Yes | Trimmed |
| `nameArabic` | String | No | Trimmed |
| `description` | String | No | Trimmed |
| `icon` | String | No | Trimmed |
| `order` | Number | Yes | Unique, used for list ordering |
| `createdAt` | Date | — | Auto |
| `updatedAt` | Date | — | Auto |

---

### Roadmap

| Field | Type | Required | Notes |
|---|---|---|---|
| `field` | ObjectId (→ Field) | No* | Ref: `"Field"` |
| `title` | String | No | Copied from Field.name on creation |
| `titleArabic` | String | No | |
| `description` | String | No | |
| `icon` | String | No | |
| `levels` | `[LevelSchema]` | No | The **dars** section |
| `muthalaah` | `[LevelSchema]` | No | The **muthalaah** section |
| `createdAt` | Date | — | Auto |
| `updatedAt` | Date | — | Auto |

**LevelSchema** (subdocument):

| Field | Type | Notes |
|---|---|---|
| `slug` | String | `"beginner"`, `"intermediate"`, or `"advanced"` |
| `label` | String | Human-readable label |
| `order` | Number | 1, 2, 3 |
| `books` | `[ObjectId]` (→ Book) | Array of book refs |

---

## Logging

Winston is configured in `src/startup/logging.js`:

| Transport | File | Level | Format |
|---|---|---|---|
| File | `logs/error.log` | `error` only | JSON + timestamp |
| File | `logs/combined.log` | all levels | JSON + timestamp |
| File | `logs/exceptions.log` | uncaught exceptions | JSON + timestamp |
| File | `logs/rejections.log` | unhandled promise rejections | JSON + timestamp |
| Console | — | all levels (dev only) | colorized + human-readable |

- In **production** (`NODE_ENV=production`): level `info`, JSON format, no console transport.
- In **development**: level `debug`, colorized console transport added.
- `exitOnError: false` — the process does not crash on logged errors; uncaught exceptions and unhandled rejections are captured into their respective log files.
- In Docker the `logs/` directory is mounted as the named volume `backend_logs` so logs persist across container restarts.

---

## Testing

The test suite is split across two Jest configs:

### Unit tests

```bash
npm run test:unit
```

Config: `jest.config.js` — matches `tests/unit/**/*.test.js`.

Covers:
- `controllers/` — each controller function mocked at the model layer
- `middleware/` — `asyncMiddleware`, `authMiddleware`, `errorMiddleware`, `roleMiddleware`
- `models/` — Joi validation schemas for Book, Contributor, Field

### Integration tests

```bash
npm run test:integration
```

Config: `jest.integration.config.js` — matches `tests/integration/**/*.test.js`, timeout 30 s.

Uses `mongodb-memory-server` for an in-process MongoDB. Supertest fires real HTTP requests against the Express app. Auth helpers in `tests/integration/setup/` handle login cookie extraction.

Covers all five route groups: auth, book, contributor, field, roadmap.

### Run all tests

```bash
npm run test:all
```

Merges both patterns and runs with `--forceExit`.

---

## Seeding

The admin panel user is **not** created through the API. Run the seed script once after a fresh database:

```bash
# Set these in backend/.env (or export them)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=ChangeMe123!

node src/seed/admin.seed.js
```

The script:
1. Connects to `MONGO_URI`.
2. Checks if an admin with `SEED_ADMIN_EMAIL` already exists — exits early if so.
3. Hashes the password with bcrypt (10 rounds) and saves the document with `role: "admin"`.

In the Docker Compose stack:

```bash
docker-compose exec backend node src/seed/admin.seed.js
```
