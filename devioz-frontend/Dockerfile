# --- ETAPA 1: Construcción (Node) ---
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos los archivos de dependencias primero
COPY package.json .
# (Si tienes package-lock.json, descomenta la siguiente línea)
# COPY package-lock.json .

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos la aplicación (Crea la carpeta /dist)
RUN npm run build

# --- ETAPA 2: Servidor (Nginx) ---
FROM nginx:alpine

# Copiamos los archivos compilados (la carpeta dist) al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada para que funcionen las rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 (el estándar web)
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]