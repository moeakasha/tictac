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

1. Install server dependencies:
```bash
npm install
```

### Running the Application

Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run server
```

The server will run on `http://localhost:5000` and serve the client application.

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
├── index.html            # Single HTML file with inline CSS and JS
├── server/
│   └── index.js          # Express server with Socket.io
├── package.json
└── README.md
```

## Technologies Used

- **Frontend:** Vanilla JavaScript, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Styling:** CSS3 with modern design

## License

MIT
