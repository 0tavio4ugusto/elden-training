# ═══════════════════════════════════════════
#  ELDEN TRAINING — Node.js Production Build
# ═══════════════════════════════════════════

# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies (express)
RUN npm ci --only=production --silent
# Copy build files from builder stage
COPY --from=builder /app/dist ./dist
# Copy backend server code
COPY server.js ./
# Create data persistence folder
RUN mkdir -p data
VOLUME [ "/app/data" ]
EXPOSE 80

# Healthcheck querying the database API endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider -q http://127.0.0.1/api/state || exit 1

CMD ["node", "server.js"]
