# Multi-stage Dockerfile for Tic-Tac-Toe Multiplayer
# Stage 1: Build React client
FROM node:18-alpine AS client-builder

WORKDIR /app/client

# Copy only package.json first to avoid lock file sync issues
COPY client/package.json ./

# Install client dependencies (this will generate/update package-lock.json)
RUN npm install

# Copy the rest of client files (including package-lock.json if it exists)
COPY client/ ./

# Note: client files are already copied above

# Build React app for production
# Note: REACT_APP_SOCKET_URL will be set at runtime, so we build without it
# The client will use window.location.origin as fallback
RUN npm run build

# Stage 2: Production server
FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY package*.json ./

# Install server dependencies (production only)
RUN npm ci --only=production

# Copy server source code
COPY server/ ./server/

# Copy built React app from builder stage
COPY --from=client-builder /app/client/build ./client/build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (Coolify will map this)
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server/index.js"]
