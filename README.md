# Tic Tac Toe - Multiplayer Game

A real-time multiplayer tic-tac-toe game built with React, Vite, and Socket.io. Play with friends online using room codes!

## Features

- 🎮 Create or join game rooms with 6-character codes
- ⚡ Real-time multiplayer gameplay via WebSockets
- 🎯 Turn-based game logic with automatic win detection
- 🏆 Win detection and draw handling
- 🔄 Play again functionality
- 📱 Modern, responsive UI
- 🔗 Easy room code sharing

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tictac
```

2. Install dependencies for both frontend and server:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### Running the Application

#### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

- Vite dev server is integrated with Express
- Hot module replacement enabled
- Automatic server restart on changes

#### Production Mode

Build and run the optimized production version:

```bash
npm start
```

This will:
1. Build the frontend with Vite
2. Start the production server
3. Serve the optimized static files

#### Other Scripts

- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

### How to Play

1. **Player 1 (Host)**:
   - Open the app in your browser at `http://localhost:3001`
   - Click "Create Room" - a 6-character room code will be generated automatically
   - Share the room code with another player
   - Wait for another player to join

2. **Player 2 (Guest)**:
   - Open the app in another browser/tab at `http://localhost:3001`
   - Enter the 6-character room code
   - Click "Join Room"
   - The game will start automatically

3. **Gameplay**:
   - Players take turns clicking on the board
   - X always goes first
   - The game detects wins and draws automatically
   - Click "Play Again" to restart after a game ends

## Project Structure

```
tictac/
├── src/                    # Frontend React code
│   ├── App.jsx            # Main game component with Socket.io client
│   ├── App.css            # Game styles and UI
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── server/                 # Backend server
│   ├── index.js           # Express + Socket.io server
│   ├── package.json       # Server dependencies
│   └── package-lock.json  # Server dependency lock file
├── public/                 # Static assets
│   └── vite.svg           # Favicon
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # Frontend dependencies and scripts
└── README.md              # This file
```

## Technologies Used

- **Frontend**: 
  - React 19
  - Vite (build tool and dev server)
  - Socket.io Client (real-time communication)
  
- **Backend**: 
  - Node.js
  - Express (web server)
  - Socket.io (WebSocket server)
  
- **Real-time Communication**: WebSockets via Socket.io

## Deployment

This application is ready for deployment as a webapp. The server serves both the API and static files in production mode.

### Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (`production` or `development`)

### Deployment Platforms

The app can be deployed to various platforms:
- **Vercel** - For static sites and serverless functions
- **Netlify** - Supports full-stack apps
- **Render** - Easy Node.js deployment
- **Railway** - Simple container deployment
- **Any Node.js hosting** - The app runs on a single port

For production deployment:
1. Set `NODE_ENV=production`
2. Run `npm start` (builds frontend and starts server)
3. Ensure the port is accessible (default: 3001)

## License

This project is open source and available for personal and educational use.
