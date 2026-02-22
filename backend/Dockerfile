FROM node:lts-alpine3.22

RUN addgroup app && adduser -S -G app app

WORKDIR /app

COPY --chown=app:app package*.json ./
RUN npm install --omit=dev

COPY --chown=app:app . .

# bikin folder logs dan pastikan permission aman
RUN mkdir -p /app/logs && chown -R app:app /app

USER app

ENV API_URL=https://api.myapp.com/

EXPOSE 5000

CMD ["node", "src/server.js"]