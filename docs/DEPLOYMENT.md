# Deployment — Peta Ilmu Islam

This document covers the Docker Compose stack, the Nginx reverse-proxy configuration, environment hardening, SSL, log management, and the first-deploy admin seed.

---

## Table of Contents

- [Pre-flight Checklist](#pre-flight-checklist)
- [Docker Compose Walkthrough](#docker-compose-walkthrough)
- [Nginx Reverse-Proxy Configuration](#nginx-reverse-proxy-configuration)
- [Environment Hardening](#environment-hardening)
- [SSL / TLS](#ssl--tls)
- [Volume & Log Management](#volume--log-management)
- [First-Deploy: Seed the Admin User](#first-deploy-seed-the-admin-user)
- [Updating the Application](#updating-the-application)

---

## Pre-flight Checklist

Before running `docker-compose up` on a production server:

- [ ] Docker ≥ 24 and Docker Compose v2 are installed.
- [ ] `.env` file is created from `.env.example` with all values filled in.
- [ ] `MONGO_PASSWORD` is a strong, unique password (≥ 20 random characters).
- [ ] `JWT_SECRET` is a long random string (≥ 32 characters; use `openssl rand -hex 32`).
- [ ] `CORS_ORIGIN` is set to your actual domain (e.g., `https://peta-ilmu-islam.com`).
- [ ] `VITE_API_URL` is set to your public API URL (e.g., `https://peta-ilmu-islam.com/api`).
- [ ] `nginx/default.conf` exists (see [Nginx Configuration](#nginx-reverse-proxy-configuration) below).
- [ ] Ports 80 and 443 are open on the host firewall.
- [ ] DNS A/AAAA records point to the server.

---

## Docker Compose Walkthrough

The `docker-compose.yml` defines four services on an internal bridge network (`app_net`):

```yaml
# docker-compose.yml (simplified annotated view)

services:
  mongo:                        # MongoDB 7 — never exposed to host
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongo_data:/data/db     # data persists across restarts

  backend:                      # Express API — not exposed to host
    build: ./backend
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGO_URI: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo:27017/${MONGO_DB}?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
    volumes:
      - backend_logs:/app/logs  # logs persist across container restarts
    depends_on:
      - mongo

  frontend:                     # React SPA served by nginx:alpine — not exposed to host
    build:
      context: ./frontend
      args:
        VITE_API_URL: ${VITE_API_URL}   # baked into the bundle at build time

  nginx:                        # Only service with host ports
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on:
      - frontend
      - backend
```

### Start the stack

```bash
# Build images and start in the foreground (add -d for background)
docker-compose up --build

# Or build and detach
docker-compose up --build -d
```

### Stop the stack

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f backend
docker-compose logs -f nginx
```

---

## Nginx Reverse-Proxy Configuration

> **TODO:** `nginx/default.conf` is not committed to the repository. Create it at `nginx/default.conf` (relative to the repo root) before the first deployment.

Reference configuration for HTTP (upgrade to HTTPS once you have a certificate):

```nginx
# nginx/default.conf

upstream backend {
    server backend:5000;
}

upstream frontend {
    server frontend:80;
}

server {
    listen 80;
    server_name peta-ilmu-islam.com www.peta-ilmu-islam.com;

    # Proxy API requests to the Express backend
    location /api/ {
        proxy_pass         http://backend;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # Prevent request body from exceeding the backend's 10 KB limit
        client_max_body_size 10k;
    }

    # Proxy everything else to the React SPA
    location / {
        proxy_pass         http://frontend;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
    }
}
```

Replace `peta-ilmu-islam.com` with your actual domain.

---

## Environment Hardening

### `.env` values

| Variable | Production guidance |
|---|---|
| `MONGO_PASSWORD` | ≥ 20 random characters. Use `openssl rand -base64 24`. |
| `JWT_SECRET` | ≥ 32 random bytes. Use `openssl rand -hex 32`. |
| `CORS_ORIGIN` | Set to your exact domain (e.g., `https://peta-ilmu-islam.com`). Avoid wildcard or omitting this. |
| `NODE_ENV` | Must be `production`. Enables `secure` cookie flag, suppresses console logging, sets log level to `info`. |
| `VITE_API_URL` | Must match the domain's public API path. This is baked into the frontend build — rebuild if it changes. |

### Docker hardening

The backend image already:
- Runs as a non-root user (`app`).
- Installs only production dependencies (`npm ci --omit=dev`).
- Does not expose a port to the host (only reachable through `app_net`).

MongoDB is only reachable from `app_net`. The `MONGO_INITDB_ROOT_USERNAME` and password are set via environment variables; no default credentials are left in place.

### HTTP headers

`helmet()` is applied globally in `app.js` and sets:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Strict-Transport-Security` (when `NODE_ENV=production`)
- And several other security headers by default.

### Rate limiting

The `/api/auth/login` endpoint is rate-limited to **10 requests per 15 minutes per IP**. This is disabled in the `test` environment but active in `development` and `production`.

---

## SSL / TLS

The `docker-compose.yml` mounts `./nginx/certs` into the Nginx container at `/etc/nginx/certs`. Place your certificate and key files there and update `nginx/default.conf` to listen on port 443:

```nginx
server {
    listen 443 ssl;
    server_name peta-ilmu-islam.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # ... location blocks same as HTTP config above
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name peta-ilmu-islam.com www.peta-ilmu-islam.com;
    return 301 https://$host$request_uri;
}
```

For automated certificate management, [Certbot with the Nginx plugin](https://certbot.eff.org/instructions) or [Caddy](https://caddyserver.com/) are common choices. If using Certbot, you may need to temporarily expose port 80 for the ACME challenge or use the DNS challenge method.

> **Note:** Once HTTPS is enabled and `NODE_ENV=production`, the `token` cookie will be marked `Secure` automatically by the backend.

---

## Volume & Log Management

### Named volumes

| Volume | Service | Contents |
|---|---|---|
| `mongo_data` | mongo | MongoDB data files |
| `backend_logs` | backend | Winston log files (`combined.log`, `error.log`, `exceptions.log`, `rejections.log`) |

Volumes persist across `docker-compose down` unless you explicitly remove them:

```bash
# Remove containers only (volumes preserved)
docker-compose down

# Remove containers AND volumes (destructive — loses all data)
docker-compose down -v
```

### Accessing backend logs

```bash
# Tail live logs from the mounted volume
docker-compose exec backend tail -f /app/logs/combined.log

# Or copy out the error log
docker cp $(docker-compose ps -q backend):/app/logs/error.log ./error.log
```

Log rotation is not configured by default.

> **TODO:** Add a log rotation strategy (e.g., `winston-daily-rotate-file` or an external logrotate config) to prevent `combined.log` from growing unbounded in production.

---

## First-Deploy: Seed the Admin User

The admin user is not created by the API. Run the seed script once after the stack is healthy:

```bash
# 1. Ensure the backend container is running
docker-compose up -d

# 2. Set seed credentials in your .env (or pass inline)
#    SEED_ADMIN_EMAIL=admin@yourdomain.com
#    SEED_ADMIN_PASSWORD=YourStrongPassword123!

# 3. Run the seed script inside the container
docker-compose exec backend node src/seed/admin.seed.js
```

The script is idempotent — if an admin with `SEED_ADMIN_EMAIL` already exists, it exits without creating a duplicate.

---

## Updating the Application

### Backend or frontend code change

```bash
# Rebuild only the changed service and restart it
docker-compose up --build --no-deps -d backend
# or
docker-compose up --build --no-deps -d frontend
```

> Remember: changing `VITE_API_URL` requires rebuilding the frontend image since the value is baked into the bundle at build time.

### Full rebuild

```bash
docker-compose down
docker-compose up --build -d
```

### Database migrations

Mongoose does not run schema migrations automatically. If you change a schema in a backwards-incompatible way (e.g., rename a field, add a required field without a default), write a migration script and run it manually inside the backend container before redeploying application code.
