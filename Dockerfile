# Usa una imagen base que sí tenga apt-get (como Debian)
FROM node:20-slim

# Instala dependencias necesarias para Puppeteer + Chromium
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
    libxss1 \
    libxtst6 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Crea una carpeta de trabajo
WORKDIR /app

# Copia tus archivos al contenedor
COPY . .

# Instala tus dependencias npm
RUN npm install

# Expone un puerto por si quieres hacer server (opcional)
EXPOSE 3000

# Ejecuta el script cuando el contenedor arranca
CMD ["node", "custom-scripts/scrapeInfoJobs.js"]
