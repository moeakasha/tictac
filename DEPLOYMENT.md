# Coolify Deployment Guide

This guide will help you deploy the Tic-Tac-Toe Multiplayer game to Coolify.

## Prerequisites

- A Coolify instance set up and running
- A Git repository (GitHub, GitLab, etc.) with your code
- Domain name configured in Coolify (optional but recommended)

## Deployment Steps

### 1. Push Your Code to Git Repository

Make sure all your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create a New Resource in Coolify

1. Log in to your Coolify dashboard
2. Click on "Resources" → "New Resource"
3. Select "Docker Compose" or "Dockerfile" (depending on your Coolify version)
4. Choose your Git repository
5. Select the branch (usually `main` or `master`)

### 3. Configure Build Settings

In Coolify, configure the following:

#### Build Configuration:
- **Build Pack**: Dockerfile
- **Dockerfile Path**: `./Dockerfile` (or leave empty if Dockerfile is in root)
- **Build Command**: (Leave empty - Dockerfile handles this)
- **Start Command**: (Leave empty - Dockerfile CMD handles this)

#### Port Configuration:
- **Port**: `5000`
- **Exposed Port**: `5000`

### 4. Environment Variables

Add the following environment variables in Coolify (optional - defaults work for most cases):

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `NODE_ENV` | `production` | No | Automatically set by Dockerfile |
| `PORT` | `5000` | No | Server port (default: 5000) |
| `ALLOWED_ORIGINS` | `*` or your domain | No | CORS origins (default: allows all in production) |
| `REACT_APP_SOCKET_URL` | (leave empty) | No | Socket URL (defaults to `window.location.origin`) |

**Note**: In most cases, you don't need to set any environment variables. The app will work with defaults:
- `REACT_APP_SOCKET_URL` will default to `window.location.origin` (same domain)
- `ALLOWED_ORIGINS` will allow all origins in production
- `PORT` defaults to 5000

### 5. Domain Configuration (Optional)

If you want to use a custom domain:

1. In Coolify, go to your resource settings
2. Add your domain in the "Domains" section
3. Coolify will automatically configure SSL/TLS certificates

### 6. Deploy

1. Click "Deploy" or "Save & Deploy"
2. Coolify will:
   - Clone your repository
   - Build the Docker image (builds React app + sets up Node server)
   - Start the container
   - Configure networking

### 7. Verify Deployment

Once deployed, you should see:
- Build logs showing React app being built
- Server starting on port 5000
- Health checks passing

Visit your domain or Coolify-provided URL to test the game.

## How It Works

The Dockerfile uses a multi-stage build:

1. **Stage 1 (client-builder)**: 
   - Installs client dependencies
   - Builds the React app for production
   - Creates optimized static files in `client/build`

2. **Stage 2 (production)**:
   - Installs only server dependencies (production)
   - Copies server code
   - Copies built React app from Stage 1
   - Runs the Node.js server that:
     - Serves the React app as static files
     - Handles Socket.io connections
     - Manages game rooms and state

## Troubleshooting

### Build Fails

- Check that all files are committed to Git
- Verify Dockerfile is in the root directory
- Check build logs in Coolify for specific errors

### Socket Connection Issues

- Ensure `REACT_APP_SOCKET_URL` is not set (or set to your domain)
- Check that CORS is properly configured
- Verify the server is running on the correct port

### 404 Errors on Refresh

- The server should handle all routes and serve `index.html`
- Check that the static file serving is working in production mode

### Port Issues

- Ensure port 5000 is exposed in Coolify
- Check that no other service is using port 5000
- Verify environment variable `PORT` if you changed it

## Architecture

```
┌─────────────────────────────────────┐
│         Coolify Container           │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Node.js Server (Port 5000) │  │
│  │                              │  │
│  │  • Express (API)             │  │
│  │  • Socket.io (WebSocket)     │  │
│  │  • Static File Server        │  │
│  │     └─ Serves React Build    │  │
│  └───────────────────────────────┘  │
│                                     │
│  React App (Built)                   │
│  └─ client/build/                   │
└─────────────────────────────────────┘
```

## Security Notes

- The Dockerfile runs as a non-root user (`nodejs`)
- CORS is configured to allow your domain
- Environment variables are used for configuration
- Production builds are optimized and minified

## Updating the Application

To update your deployed application:

1. Make changes to your code
2. Commit and push to Git
3. In Coolify, click "Redeploy" or trigger a new deployment
4. Coolify will rebuild and redeploy automatically

## Support

If you encounter issues:
1. Check Coolify logs for errors
2. Verify all environment variables are set correctly
3. Ensure your domain DNS is properly configured
4. Check that port 5000 is accessible

---

**Happy Deploying! 🚀**
