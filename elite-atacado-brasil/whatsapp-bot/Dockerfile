FROM node:18-alpine

WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the source code
COPY . .

# Expose a port (optional, not used by WhatsApp) – helps Render health checks
EXPOSE 3000

ENV NODE_ENV=production

# Start the bot
CMD ["node", "index.js"]
