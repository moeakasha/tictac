import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';
import GameBoard from './components/GameBoard';
import RoomSetup from './components/RoomSetup';
import GameStatus from './components/GameStatus';

function App() {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError('');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Unable to connect to server. Make sure the server is running on port 5000.');
    });

    socket.on('roomCreated', (data) => {
      console.log('Room created:', data);
      setRoomId(data.roomId);
      setPlayerSymbol(data.playerSymbol);
      setIsInRoom(true);
      setError('');
    });

    socket.on('roomJoined', (data) => {
      console.log('Room joined:', data);
      setRoomId(data.roomId);
      setPlayerSymbol(data.playerSymbol);
      setIsInRoom(true);
      setError('');
    });

    socket.on('roomUpdate', (data) => {
      console.log('Room update:', data);
      setGameState(data);
    });

    socket.on('gameUpdate', (data) => {
      console.log('Game update:', data);
      setGameState(data);
    });

    socket.on('error', (data) => {
      console.error('Error:', data);
      setError(data.message);
    });

    socket.on('playerLeft', (data) => {
      setError(data.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('roomUpdate');
      socket.off('gameUpdate');
      socket.off('error');
      socket.off('playerLeft');
      socket.disconnect();
    };
  }, []);

  const handleCreateRoom = (name) => {
    if (!isConnected) {
      setError('Not connected to server. Please wait...');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setPlayerName(name);
    setError('');
    socketRef.current.emit('createRoom', { playerName: name });
  };

  const handleJoinRoom = (name, room) => {
    if (!isConnected) {
      setError('Not connected to server. Please wait...');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!room.trim()) {
      setError('Please enter a room ID');
      return;
    }
    setPlayerName(name);
    setError('');
    // Normalize room ID (uppercase, trim)
    const normalizedRoomId = room.trim().toUpperCase();
    socketRef.current.emit('joinRoom', { roomId: normalizedRoomId, playerName: name });
  };

  const handleMakeMove = (cellIndex) => {
    if (gameState && gameState.currentPlayer === playerSymbol && isConnected) {
      socketRef.current.emit('makeMove', { roomId, cellIndex });
    }
  };

  const handleResetGame = () => {
    if (isConnected) {
      socketRef.current.emit('resetGame', { roomId });
    }
  };

  const handleLeaveRoom = () => {
    setIsInRoom(false);
    setRoomId('');
    setPlayerSymbol(null);
    setGameState(null);
    setError('');
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leaveRoom', { roomId });
    }
  };

  if (!isInRoom) {
    return (
      <div className="app">
        {!isConnected && (
          <div className="connection-status">
            Connecting to server... Make sure the server is running on port 5000.
          </div>
        )}
        <RoomSetup
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          error={error}
          isConnected={isConnected}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-container">
        <div className="game-header">
          <h1>Tic-Tac-Toe</h1>
          <div className="room-info">
            <p>Room ID: <strong>{roomId}</strong></p>
            <button onClick={handleLeaveRoom} className="leave-btn">Leave Room</button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {gameState && (
          <>
            <GameStatus
              gameState={gameState}
              playerSymbol={playerSymbol}
              playerName={playerName}
            />
            <GameBoard
              board={gameState.board}
              currentPlayer={gameState.currentPlayer}
              playerSymbol={playerSymbol}
              onCellClick={handleMakeMove}
              disabled={gameState.status !== 'playing' || gameState.currentPlayer !== playerSymbol}
            />
            {gameState.status === 'finished' && (
              <button onClick={handleResetGame} className="reset-btn">
                Play Again
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
