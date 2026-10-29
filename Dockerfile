# Home server: build the demo page (Vite) in a throwaway Node stage, serve
# it with nginx. `docker compose up -d --build` after a change.
FROM node:24.11.0-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build:demo

FROM nginx:1.29.3-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist-demo /usr/share/nginx/html
