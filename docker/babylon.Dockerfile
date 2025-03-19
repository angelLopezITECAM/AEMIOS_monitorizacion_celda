FROM node:22.14-slim AS build

WORKDIR /app

RUN npm install -g pnpm

COPY babylon/package.json ./

RUN pnpm install

COPY . .

EXPOSE 3003

CMD ["pnpm", "dev"]