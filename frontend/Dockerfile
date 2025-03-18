# Usar una imagen de Node como base
FROM node:18-alpine

# Crear el directorio de trabajo
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install
# Copiar todo el código de la app
COPY . .

# Exponer el puerto donde correrá Vite
EXPOSE 3001:3000

# Comando por defecto para correr Vite en modo desarrollo
CMD ["npm", "run", "dev"]
