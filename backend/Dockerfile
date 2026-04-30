# ---- Stage 1: dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy installed deps and app source
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=app:app . .

# Logs directory (mounted as volume in compose)
RUN mkdir -p logs && chown -R app:app logs

ENV NODE_ENV=production
ENV PORT=5000

USER app
EXPOSE 5000

CMD ["node", "src/server.js"]