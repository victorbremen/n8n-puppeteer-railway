# Usa una imagen base oficial de Node.js
FROM node:18-slim

# Instala Chromium y sus dependencias
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Establece la ruta del ejecutable de Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Crea directorio de trabajo
WORKDIR /app

# Copia tus archivos de proyecto
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]
