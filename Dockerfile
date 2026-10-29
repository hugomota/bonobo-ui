# Home server: build the demo page (Vite) and Storybook in a throwaway Node stage, serve
# it with nginx. `docker compose up -d --build` after a change.
FROM node:24.11.0-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV STORYBOOK_DISABLE_TELEMETRY=1
RUN npm run build:demo && npm run build:storybook

FROM nginx:1.29.3-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist-demo /usr/share/nginx/html
COPY --from=build /app/storybook-static /usr/share/nginx/html/storybook
