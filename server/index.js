const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store rooms and game states
const rooms = new Map();

// Game logic
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

  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('createRoom', (data) => {
    const roomId = (data.roomId || Math.random().toString(36).substring(2, 8)).toUpperCase();
    const playerName = data.playerName || 'Player 1';

    rooms.set(roomId, {
      players: [{ id: socket.id, name: playerName, symbol: 'X' }],
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'waiting', // waiting, playing, finished
      winner: null
    });

    socket.join(roomId);
    socket.emit('roomCreated', { roomId, playerSymbol: 'X' });
    io.to(roomId).emit('roomUpdate', rooms.get(roomId));
    console.log(`Room ${roomId} created by ${socket.id}. Total rooms: ${rooms.size}`);
  });

  // Join an existing room
  socket.on('joinRoom', (data) => {
    const { roomId, playerName } = data;
    // Normalize room ID (uppercase)
    const normalizedRoomId = roomId ? roomId.toUpperCase().trim() : '';
    
    if (!normalizedRoomId) {
      socket.emit('error', { message: 'Invalid room ID' });
      return;
    }

    const room = rooms.get(normalizedRoomId);

    if (!room) {
      socket.emit('error', { message: `Room "${normalizedRoomId}" not found. Make sure the room ID is correct.` });
      console.log(`Room not found: ${normalizedRoomId}. Available rooms:`, Array.from(rooms.keys()));
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    if (room.status === 'playing' || room.status === 'finished') {
      socket.emit('error', { message: 'Game already in progress or finished' });
      return;
    }

    room.players.push({ id: socket.id, name: playerName || 'Player 2', symbol: 'O' });
    room.status = 'playing';

    socket.join(normalizedRoomId);
    socket.emit('roomJoined', { roomId: normalizedRoomId, playerSymbol: 'O' });
    io.to(normalizedRoomId).emit('roomUpdate', room);
    console.log(`Player ${socket.id} joined room ${normalizedRoomId}`);
  });

  // Handle player move
  socket.on('makeMove', (data) => {
    const { roomId, cellIndex } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const player = room.players.find(p => p.id === socket.id);
    if (!player) {
      socket.emit('error', { message: 'You are not in this room' });
      return;
    }

    if (room.status !== 'playing') {
      socket.emit('error', { message: 'Game is not in progress' });
      return;
    }

    if (room.currentPlayer !== player.symbol) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    if (room.board[cellIndex] !== null) {
      socket.emit('error', { message: 'Cell already taken' });
      return;
    }

    // Make the move
    room.board[cellIndex] = player.symbol;

    // Check for winner
    const winner = checkWinner(room.board);
    if (winner) {
      room.status = 'finished';
      room.winner = winner === 'draw' ? 'draw' : player.symbol;
    } else {
      room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
    }

    // Broadcast updated game state
    io.to(roomId).emit('gameUpdate', room);
  });

  // Reset game
  socket.on('resetGame', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    room.board = Array(9).fill(null);
    room.currentPlayer = 'X';
    room.status = 'playing';
    room.winner = null;

    io.to(roomId).emit('gameUpdate', room);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from rooms
    for (let [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('playerLeft', { message: 'A player has left the game' });
          io.to(roomId).emit('roomUpdate', room);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
