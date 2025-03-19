FROM node:22.14-slim AS build

WORKDIR /app

RUN npm install -g pnpm

# Copiar package.json
COPY frontend/package.json ./

# Instalar dependencias
RUN pnpm install

# Copiar resto de archivos
COPY . .

EXPOSE 3002

CMD ["pnpm", "dev"]