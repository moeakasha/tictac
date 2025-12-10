# Deployment Guide

This guide explains how to deploy the Tic Tac Toe multiplayer game as a web application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start with Docker

### Using Docker Compose (Recommended)

1. Build and start the container:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at `http://localhost:3001`

3. To stop the container:
   ```bash
   docker-compose down
   ```

### Using Docker directly

1. Build the Docker image:
   ```bash
   docker build -t tictac-game .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 tictac-game
   ```

   Or run in detached mode:
   ```bash
   docker run -d -p 3001:3001 --name tictac tictac-game
   ```

3. Access the application at `http://localhost:3001`

## Custom Port

To use a different port, modify the `docker-compose.yml` file or use:

```bash
docker run -p 8080:3001 -e PORT=3001 tictac-game
```

Then access at `http://localhost:8080`

## Production Deployment

For production deployment:

1. Set environment variables as needed
2. Use a reverse proxy (nginx, traefik, etc.) for SSL/TLS termination
3. Consider using Docker Swarm or Kubernetes for orchestration
4. Set up proper logging and monitoring

## Environment Variables

- `NODE_ENV`: Set to `production` (default in Dockerfile)
- `PORT`: Server port (default: 3001)

## Health Check

The docker-compose.yml includes a health check that verifies the server is responding. You can check container health with:

```bash
docker ps
```

Look for the "healthy" status in the STATUS column.

