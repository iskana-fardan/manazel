FROM node:lts-alpine3.22

RUN addgroup app && adduser -S -G app app

WORKDIR /app

# Fix ownership sekali
RUN chown -R app:app /app

# Create data dir
RUN mkdir data && chown app:app data

# Copy deps
COPY --chown=app:app package*.json .

USER app

RUN npm install

# Copy source code
COPY --chown=app:app . .

ENV API_URL=http://api.myapp.com/
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]