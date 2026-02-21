FROM node:lts-alpine3.22
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# example ENV
ENV API_URL=https://api.myapp.com/ 
EXPOSE 5000
CMD [ "node", "src/server.js" ]