import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

const isProduction = process.env.NODE_ENV === 'production';
const distPath = join(__dirname, '../dist');
const rootPath = join(__dirname, '..');

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

// Setup static file serving
async function setupServer() {
  if (isProduction && existsSync(distPath)) {
    // In production, serve static files from dist
    app.use(express.static(distPath));
    
    // For all routes, serve index.html (SPA fallback)
    app.get('*', (req, res) => {
      res.sendFile(join(distPath, 'index.html'));
    });
  } else {
    // In development, use Vite middleware
    const viteServer = await createViteServer({
      root: rootPath,
      server: { middlewareMode: true },
    });
    app.use(viteServer.middlewares);
  }
}

// Store game rooms
const rooms = new Map();

// Game state management
const getInitialBoard = () => Array(9).fill(null);
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Validate room code format (6 uppercase alphanumeric characters)
const isValidRoomCode = (code) => {
  return /^[A-Z0-9]{6}$/.test(code);
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('createRoom', (roomId) => {
    const normalizedRoomId = roomId.toUpperCase().trim();
    
    if (!isValidRoomCode(normalizedRoomId)) {
      socket.emit('roomError', 'Invalid room code format. Must be 6 uppercase alphanumeric characters.');
      return;
    }

    if (rooms.has(normalizedRoomId)) {
      socket.emit('roomError', 'Room already exists');
      return;
    }

    rooms.set(normalizedRoomId, {
      players: [socket.id],
      board: getInitialBoard(),
      currentPlayer: 'X',
      status: 'waiting', // waiting, playing, finished
      winner: null
    });
    socket.join(normalizedRoomId);
    socket.emit('roomCreated', normalizedRoomId);
    console.log(`Room ${normalizedRoomId} created by ${socket.id}`);
  });

  // Join an existing room
  socket.on('joinRoom', (roomId) => {
    const normalizedRoomId = roomId.toUpperCase().trim();
    
    if (!isValidRoomCode(normalizedRoomId)) {
      socket.emit('roomError', 'Invalid room code format. Must be 6 uppercase alphanumeric characters.');
      return;
    }

    const room = rooms.get(normalizedRoomId);
    if (!room) {
      socket.emit('roomError', 'Room not found');
      return;
    }
    if (room.players.length >= 2) {
      socket.emit('roomError', 'Room is full');
      return;
    }
    if (room.players.includes(socket.id)) {
      socket.emit('roomError', 'Already in this room');
      return;
    }

    room.players.push(socket.id);
    room.status = 'playing';
    socket.join(normalizedRoomId);
    socket.emit('roomJoined', normalizedRoomId);
    
    // Notify both players that the game has started
    io.to(normalizedRoomId).emit('gameStart', {
      board: room.board,
      currentPlayer: room.currentPlayer
    });
    console.log(`User ${socket.id} joined room ${normalizedRoomId}`);
  });

  // Make a move
  socket.on('makeMove', ({ roomId, index }) => {
    const normalizedRoomId = roomId.toUpperCase().trim();
    const room = rooms.get(normalizedRoomId);
    if (!room || room.status !== 'playing') {
      socket.emit('moveError', 'Invalid move');
      return;
    }

    const playerIndex = room.players.indexOf(socket.id);
    const playerSymbol = playerIndex === 0 ? 'X' : 'O';

    // Check if it's the player's turn
    if (room.currentPlayer !== playerSymbol) {
      socket.emit('moveError', 'Not your turn');
      return;
    }

    // Check if the cell is already taken
    if (room.board[index] !== null) {
      socket.emit('moveError', 'Cell already taken');
      return;
    }

    // Make the move
    room.board[index] = playerSymbol;
    
    // Check for winner
    const winner = checkWinner(room.board);
    if (winner) {
      room.status = 'finished';
      room.winner = winner;
      io.to(normalizedRoomId).emit('gameUpdate', {
        board: room.board,
        currentPlayer: room.currentPlayer,
        winner: winner,
        status: 'finished'
      });
    } else if (room.board.every(cell => cell !== null)) {
      // Draw
      room.status = 'finished';
      io.to(normalizedRoomId).emit('gameUpdate', {
        board: room.board,
        currentPlayer: room.currentPlayer,
        winner: 'draw',
        status: 'finished'
      });
    } else {
      // Switch turns
      room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
      io.to(normalizedRoomId).emit('gameUpdate', {
        board: room.board,
        currentPlayer: room.currentPlayer,
        status: 'playing'
      });
    }
  });

  // Reset game
  socket.on('resetGame', (roomId) => {
    const normalizedRoomId = roomId.toUpperCase().trim();
    const room = rooms.get(normalizedRoomId);
    if (room) {
      room.board = getInitialBoard();
      room.currentPlayer = 'X';
      room.status = 'playing';
      room.winner = null;
      io.to(normalizedRoomId).emit('gameReset', {
        board: room.board,
        currentPlayer: room.currentPlayer
      });
    }
  });

  // Leave room
  socket.on('leaveRoom', (roomId) => {
    const normalizedRoomId = roomId.toUpperCase().trim();
    socket.leave(normalizedRoomId);
    const room = rooms.get(normalizedRoomId);
    if (room) {
      room.players = room.players.filter(id => id !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(normalizedRoomId);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up rooms
    for (let [roomId, room] of rooms.entries()) {
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter(id => id !== socket.id);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          // Notify remaining player
          io.to(roomId).emit('playerLeft');
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

// Start the server
setupServer().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!isProduction) {
      console.log(`Development mode: Vite dev server integrated`);
    }
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

