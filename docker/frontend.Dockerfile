FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json
COPY frontend/package.json ./

# Instalar dependencias
RUN npm install

# Copiar resto de archivos
COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]