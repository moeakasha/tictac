# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies for both root and server
RUN npm ci --only=production=false && \
    cd server && \
    npm ci --only=production=false && \
    cd ..

# Copy all source files
COPY . .

# Build the frontend
RUN npm run build

# Expose the port
EXPOSE 3001

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3001

# Start the server
CMD ["npm", "start"]

