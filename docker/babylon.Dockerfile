FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json
COPY babylon/package.json ./

# Instalar dependencias
RUN npm install

COPY . .

# Exponer puerto
EXPOSE 3003

CMD ["npm", "run", "dev"]