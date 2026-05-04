# Architecture — Peta Ilmu Islam

This document describes the high-level system design, request lifecycle, data flow, and deployment topology of the Peta Ilmu Islam application.

---

## Table of Contents

- [System Overview](#system-overview)
- [Service Topology](#service-topology)
- [Request Lifecycle](#request-lifecycle)
- [Authentication Flow](#authentication-flow)
- [Data Flow: Frontend ↔ Backend ↔ MongoDB](#data-flow-frontend--backend--mongodb)
- [Data Model Relationships (ER Diagram)](#data-model-relationships-er-diagram)
- [Backend Internal Architecture](#backend-internal-architecture)
- [Frontend Internal Architecture](#frontend-internal-architecture)

---

## System Overview

```mermaid
graph TD
    User["User / Browser"]
    Nginx["Nginx 1.27\nReverse Proxy\n(port 80 / 443)"]
    Frontend["Frontend Container\nnginx:alpine\nServes React SPA"]
    Backend["Backend Container\nNode.js 20\nExpress 5 API\n(port 5000 internal)"]
    MongoDB["MongoDB 7\n(internal only)"]

    User -->|HTTPS| Nginx
    Nginx -->|/| Frontend
    Nginx -->|/api/*| Backend
    Backend <-->|Mongoose| MongoDB

    style User fill:#f1f5f9,stroke:#64748b
    style Nginx fill:#e2e8f0,stroke:#94a3b8
    style Frontend fill:#dbeafe,stroke:#3b82f6
    style Backend fill:#dcfce7,stroke:#16a34a
    style MongoDB fill:#fef9c3,stroke:#ca8a04
```

Four services run on an internal Docker bridge network (`app_net`):

| Service | Image | Exposed externally | Role |
|---|---|---|---|
| `nginx` | `nginx:1.27-alpine` | 80, 443 | Reverse proxy; routes `/api/*` to backend, everything else to frontend |
| `frontend` | Custom (`node:20-alpine` → `nginx:1.27-alpine`) | No | Serves the Vite-built static bundle |
| `backend` | Custom (`node:20-alpine`) | No | Express REST API |
| `mongo` | `mongo:7` | No | Database |

---

## Service Topology

```mermaid
graph LR
    subgraph Host
        Port80["Host :80"]
        Port443["Host :443"]
    end

    subgraph app_net["Docker bridge: app_net"]
        Nginx["nginx\n:80/:443"]
        Frontend["frontend\n:80 (internal)"]
        Backend["backend\n:5000 (internal)"]
        Mongo["mongo\n:27017 (internal)"]
    end

    Port80 --> Nginx
    Port443 --> Nginx
    Nginx -->|location /| Frontend
    Nginx -->|location /api/| Backend
    Backend --> Mongo
```

MongoDB is never reachable from the host — only the backend container can connect to it over `app_net`. All traffic from users enters through the single Nginx port.

---

## Request Lifecycle

### Public API request (unauthenticated)

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Nginx
    participant E as Express
    participant DB as MongoDB

    B->>N: GET /api/fields
    N->>E: proxy_pass backend:5000/api/fields
    E->>E: cors() → helmet() → express.json()
    E->>E: asyncMiddleware(getFields)
    E->>DB: Field.find().sort({order:1})
    DB-->>E: [field, ...]
    E-->>B: 200 JSON array
```

### Protected mutation (authenticated)

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Nginx
    participant E as Express
    participant AM as authMiddleware
    participant C as Controller
    participant DB as MongoDB

    B->>N: POST /api/books (Cookie: token=<jwt>)
    N->>E: proxy_pass backend:5000/api/books
    E->>AM: verify JWT from cookie
    AM->>AM: jwt.verify(token, JWT_SECRET)
    AM->>C: req.admin = {id, role}; next()
    C->>C: Joi validate(req.body)
    C->>DB: Book.findOne({title}) — duplicate check
    C->>DB: new Book(req.body).save()
    DB-->>C: saved book
    C-->>B: 201 book object
```

### Error propagation

```mermaid
sequenceDiagram
    participant C as Controller
    participant AW as asyncMiddleware
    participant EH as error.middleware

    C->>C: throws Error (or rejects)
    AW->>EH: next(err)
    EH->>EH: classify: CastError / ValidationError / 11000 / status / fallback
    EH-->>B: 4xx or 500 JSON
```

---

## Authentication Flow

Authentication is cookie-based. No `Authorization` header is used.

```mermaid
sequenceDiagram
    participant B as Browser
    participant API as Backend /api/auth
    participant DB as MongoDB

    Note over B,DB: Login
    B->>API: POST /auth/login {email, password}
    API->>DB: Admin.findOne({email})
    DB-->>API: admin doc (with hashed password)
    API->>API: bcrypt.compare(password, hash)
    API->>API: jwt.sign({id, role}, JWT_SECRET, {expiresIn:"1d"})
    API-->>B: 200 + Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict; Secure(prod)

    Note over B,DB: Subsequent protected requests
    B->>API: GET /auth/me (Cookie: token=<jwt> sent automatically)
    API->>API: jwt.verify(token, JWT_SECRET) → {id, role}
    API->>DB: Admin.findById(id).select("-password")
    DB-->>API: admin doc
    API-->>B: 200 admin object

    Note over B,DB: Logout
    B->>API: POST /auth/logout
    API-->>B: 200 + Set-Cookie: token=; Max-Age=0 (clears cookie)
```

Cookie attributes:
- `httpOnly: true` — inaccessible to JavaScript; protects against XSS token theft.
- `secure: true` — only transmitted over HTTPS (production only).
- `sameSite: "strict"` — not sent on cross-site navigations; protects against CSRF.
- `maxAge: 24h` — matches JWT expiry.

---

## Data Flow: Frontend ↔ Backend ↔ MongoDB

### Public site data flow

```mermaid
flowchart TD
    Page["Public Page Component"]
    StaticJSON["Static JSON\n(src/data/)"]
    Hook["React Query Hook\n(src/hooks/)"]
    Service["Service Function\n(src/services/*.api.ts)"]
    Axios["Axios Instance\n(apiClient.ts)"]
    Backend["Express API"]
    MongoDB

    Page -->|imports directly| StaticJSON
    Page -->|calls| Hook
    Hook --> Service
    Service --> Axios
    Axios -->|GET /api/*| Backend
    Backend --> MongoDB
    MongoDB --> Backend
    Backend -->|JSON| Axios
    Axios -->|data| Hook
    Hook -->|React state| Page
```

### Admin data flow

```mermaid
flowchart TD
    AdminPage["Admin Feature Page"]
    Hook["React Query Hook\n(src/hooks/)"]
    Service["Service Function\n(src/services/*.api.ts)"]
    Axios["Axios Instance\n(withCredentials:true)"]
    Backend["Express API\n(auth middleware)"]
    MongoDB

    AdminPage --> Hook
    Hook -->|mutationFn / queryFn| Service
    Service --> Axios
    Axios -->|HTTP + Cookie| Backend
    Backend --> MongoDB
    MongoDB --> Backend
    Backend -->|JSON| Axios
    Axios -->|data| Hook
    Hook -->|invalidateQueries| Hook
    Hook -->|updated state| AdminPage
```

---

## Data Model Relationships (ER Diagram)

```mermaid
erDiagram
    ADMIN {
        ObjectId _id PK
        String name
        String email
        String password
        String role
    }

    FIELD {
        ObjectId _id PK
        String slug UK
        String name
        String nameArabic
        String description
        String icon
        Number order UK
    }

    BOOK {
        ObjectId _id PK
        String title
        String titleArabic
        String author
        String type
        String level
        String field
        String description
        String recommendedUsage
        Array resources
        Array recommendedEditions
    }

    ROADMAP {
        ObjectId _id PK
        ObjectId field FK
        String title
        String titleArabic
        String description
        String icon
        Array levels
        Array muthalaah
    }

    CONTRIBUTOR {
        ObjectId _id PK
        String name
        String role
        String description
        String avatar
        Object socials
    }

    FIELD ||--o| ROADMAP : "has one"
    ROADMAP }o--o{ BOOK : "references via level.books[]"
```

Notes:
- `BOOK.field` is a plain string (denormalized discipline name), not a reference to `FIELD._id`.
- `ROADMAP.levels[].books[]` and `ROADMAP.muthalaah[].books[]` are arrays of ObjectId refs to `BOOK`.
- `ADMIN` is standalone — no relations to other collections.

---

## Backend Internal Architecture

```mermaid
graph TD
    Server["server.js\n(entry point)"]
    App["app.js\n(Express factory)"]
    Startup["startup/\n(db.js + logging.js)"]
    Routes["routes/\n(5 routers)"]
    MW["middleware/\nasync · auth · error · role"]
    Controllers["controllers/\n(5 controllers)"]
    Models["models/\n(Mongoose + Joi)"]
    MongoDB

    Server --> Startup
    Server --> App
    App --> Routes
    Routes --> MW
    MW --> Controllers
    Controllers --> Models
    Models --> MongoDB
```

### Middleware execution order (per request)

1. `helmet()` — security headers
2. `cors()` — CORS headers + preflight
3. `express.json({ limit: "10kb" })` — body parsing
4. `cookieParser()` — cookie parsing
5. `loginLimiter` (rate limiter, only on `/api/auth/login`, disabled in test)
6. Route-level: `authMiddleware` (protected routes only)
7. Route-level: `asyncMiddleware(controller)` — wraps handler, forwards errors
8. `error.middleware` (global) — normalizes and serializes errors

---

## Frontend Internal Architecture

```mermaid
graph TD
    main["main.tsx\n(React root)"]
    Provider["ColorModeProvider\n(ThemeProvider + CssBaseline)"]
    QC["QueryClientProvider\n(TanStack React Query)"]
    Router["RouterProvider\n(createBrowserRouter)"]
    RootLayout["RootLayout\n(Navbar + Footer)"]
    PublicPages["Public Pages\n(/, /tentang, /roadmap/:slug, /kolaborasi)"]
    AdminGuard["AdminGuard\n(GET /auth/me check)"]
    AdminLayout["AdminLayout\n(Sidebar + Topbar)"]
    AdminFeatures["Admin Features\n(Books, Fields, Roadmaps, Contributors, Settings)"]

    main --> Provider
    Provider --> QC
    QC --> Router
    Router --> RootLayout
    RootLayout --> PublicPages
    Router --> AdminGuard
    AdminGuard --> AdminLayout
    AdminLayout --> AdminFeatures
```
