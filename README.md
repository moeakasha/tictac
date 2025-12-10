# Tic-Tac-Toe Multiplayer Game

A real-time multiplayer tic-tac-toe game built with React and Socket.io.

## Features

- 🎮 Real-time multiplayer gameplay
- 🏠 Room-based system (create or join rooms)
- 👥 Two-player support
- 🎯 Turn-based gameplay
- 🎨 Modern and responsive UI
- ⚡ Real-time game state synchronization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install all dependencies (both root and client):
```bash
npm run install-all
```

Or manually:
```bash
npm install
cd client
npm install
cd ..
```

### Running the Application

Start both the server and client simultaneously:
```bash
npm run dev
```

Or run them separately:

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
```bash
npm run client
```

The server will run on `http://localhost:5000` and the client on `http://localhost:3000`.

## How to Play

1. **Player 1 (Room Creator):**
   - Enter your name
   - Click "Create Room"
   - Share the Room ID with Player 2
   - Wait for Player 2 to join

2. **Player 2 (Joiner):**
   - Enter your name
   - Enter the Room ID provided by Player 1
   - Click "Join Room"

3. **Gameplay:**
   - Players take turns placing X or O
   - First player to get 3 in a row wins
   - Click "Play Again" to restart after a game ends

## Project Structure

```
tictac/
├── server/
│   └── index.js          # Express server with Socket.io
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameBoard.js
│   │   │   ├── GameStatus.js
│   │   │   └── RoomSetup.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## Technologies Used

- **Frontend:** React, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Styling:** CSS3 with modern design

## License

MIT
