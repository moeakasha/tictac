# Tic Tac Toe - Multiplayer Game

A real-time multiplayer tic-tac-toe game built with React, Vite, and Socket.io.

## Features

- Create or join game rooms
- Real-time multiplayer gameplay
- Turn-based game logic
- Win detection and draw handling
- Play again functionality
- Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm install
cd server
npm install
cd ..
```

### Running the Application

Everything runs on a single port! Just run:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

- **Development mode**: Vite dev server is integrated with Express
- **Production mode**: Run `npm start` to build and serve the optimized production build

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
├── src/              # Frontend React code
│   ├── App.jsx      # Main game component
│   ├── App.css      # Game styles
│   └── main.jsx     # React entry point
├── server/          # Backend server
│   └── index.js     # Socket.io server
└── package.json     # Frontend dependencies
```

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express, Socket.io
- **Real-time Communication**: WebSockets
