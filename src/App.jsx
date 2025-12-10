import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Connect to the same origin (same port as the server)
const socket = io(window.location.origin);

// Generate a 6-character uppercase alphanumeric code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function App() {
  const [roomId, setRoomId] = useState('');
  const [gameRoom, setGameRoom] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [generatedRoomCode, setGeneratedRoomCode] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socket.on('roomCreated', (roomId) => {
      setGameRoom(roomId);
      setPlayerSymbol('X');
      setGameStatus('waiting');
      setError('');
    });

    socket.on('roomJoined', (roomId) => {
      setGameRoom(roomId);
      setPlayerSymbol('O');
      setError('');
    });

    socket.on('roomError', (message) => {
      setError(message);
    });

    socket.on('gameStart', ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setGameStatus('playing');
      setError('');
    });

    socket.on('gameUpdate', ({ board, currentPlayer, winner, status }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setGameStatus(status);
      if (winner) {
        setWinner(winner);
      }
    });

    socket.on('gameReset', ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setGameStatus('playing');
      setWinner(null);
      setError('');
    });

    socket.on('playerLeft', () => {
      setError('Other player left the game');
      setGameStatus('waiting');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('roomError');
      socket.off('gameStart');
      socket.off('gameUpdate');
      socket.off('gameReset');
      socket.off('playerLeft');
    };
  }, []);

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    setGeneratedRoomCode(code);
    setRoomId(code);
    socket.emit('createRoom', code);
  };

  const handleJoinRoom = () => {
    const code = roomId.trim().toUpperCase();
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-character room code');
      return;
    }
    setRoomId(code);
    socket.emit('joinRoom', code);
  };

  const handleCellClick = (index) => {
    if (!gameRoom || gameStatus !== 'playing') return;
    if (board[index] !== null) return;
    if (currentPlayer !== playerSymbol) {
      setError('Not your turn!');
      return;
    }

    socket.emit('makeMove', { roomId: gameRoom, index });
    setError('');
  };

  const handleReset = () => {
    if (gameRoom) {
      socket.emit('resetGame', gameRoom);
    }
  };

  const handleLeaveRoom = () => {
    if (gameRoom) {
      socket.emit('leaveRoom', gameRoom);
      setGameRoom(null);
      setBoard(Array(9).fill(null));
      setCurrentPlayer('X');
      setPlayerSymbol(null);
      setGameStatus('waiting');
      setWinner(null);
      setError('');
      setRoomId('');
      setGeneratedRoomCode('');
    }
  };

  const copyRoomCode = () => {
    if (gameRoom) {
      navigator.clipboard.writeText(gameRoom);
      setError('Room code copied to clipboard!');
      setTimeout(() => setError(''), 2000);
    }
  };

  const getStatusMessage = () => {
    if (!gameRoom) return '';
    if (gameStatus === 'waiting') return 'Waiting for another player...';
    if (gameStatus === 'finished') {
      if (winner === 'draw') return "It's a draw!";
      if (winner === playerSymbol) return 'You won!';
      return 'You lost!';
    }
    if (currentPlayer === playerSymbol) return 'Your turn';
    return "Opponent's turn";
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Tic Tac Toe - Multiplayer</h1>
        
        <div className="connection-status">
          Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>

        {!gameRoom ? (
          <div className="room-setup">
            <div className="button-group">
              <button onClick={handleCreateRoom} className="btn btn-primary">
                Create Room
              </button>
            </div>
            {generatedRoomCode && (
              <div className="room-code-display">
                <div className="room-code-label">Your Room Code:</div>
                <div className="room-code-value">{generatedRoomCode}</div>
                <button onClick={copyRoomCode} className="btn btn-copy">
                  📋 Copy Code
                </button>
                <div className="room-code-hint">Share this code with another player to join</div>
              </div>
            )}
            <div className="divider">OR</div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6-Character Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase().slice(0, 6))}
                maxLength={6}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinRoom();
                  }
                }}
              />
            </div>
            <div className="button-group">
              <button onClick={handleJoinRoom} className="btn btn-secondary">
                Join Room
              </button>
            </div>
            {error && <div className={`error ${error.includes('copied') ? 'success' : ''}`}>{error}</div>}
          </div>
        ) : (
          <div className="game-container">
            <div className="game-info">
              <div className="room-info">
                Room Code: <span className="room-code-badge">{gameRoom}</span>
                <button onClick={copyRoomCode} className="btn-copy-small" title="Copy room code">
                  📋
                </button>
              </div>
              <div className="player-info">You are: {playerSymbol}</div>
              <div className="status-message">{getStatusMessage()}</div>
              {error && <div className={`error ${error.includes('copied') ? 'success' : ''}`}>{error}</div>}
            </div>

            <div className="board">
              {board.map((cell, index) => (
                <button
                  key={index}
                  className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${
                    gameStatus !== 'playing' || currentPlayer !== playerSymbol ? 'disabled' : ''
                  }`}
                  onClick={() => handleCellClick(index)}
                  disabled={cell !== null || gameStatus !== 'playing' || currentPlayer !== playerSymbol}
                >
                  {cell}
                </button>
              ))}
            </div>

            <div className="game-actions">
              {gameStatus === 'finished' && (
                <button onClick={handleReset} className="btn btn-primary">
                  Play Again
                </button>
              )}
              <button onClick={handleLeaveRoom} className="btn btn-secondary">
                Leave Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
