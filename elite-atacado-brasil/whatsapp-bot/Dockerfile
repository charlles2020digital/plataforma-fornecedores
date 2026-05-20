FROM node:18-alpine

# Install Chromium and its dependencies for Puppeteer
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to use the system chromium and skip downloading
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Expose a port (optional, not used by WhatsApp) – helps Render health checks
EXPOSE 3000

ENV NODE_ENV=production

# Start the bot via the health server
CMD ["node", "server.js"]
