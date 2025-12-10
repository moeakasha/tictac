import React from 'react';
import './GameStatus.css';

function GameStatus({ gameState, playerSymbol, playerName }) {
  const getStatusMessage = () => {
    if (gameState.status === 'waiting') {
      return 'Waiting for another player to join...';
    }

    if (gameState.status === 'finished') {
      if (gameState.winner === 'draw') {
        return "It's a draw!";
      }
      if (gameState.winner === playerSymbol) {
        return `🎉 You won, ${playerName}!`;
      }
      return 'You lost. Better luck next time!';
    }

    if (gameState.currentPlayer === playerSymbol) {
      return `Your turn, ${playerName}! (${playerSymbol})`;
    }

    return "Waiting for opponent's move...";
  };

  const getPlayersInfo = () => {
    if (!gameState.players || gameState.players.length === 0) {
      return null;
    }

    return (
      <div className="players-info">
        {gameState.players.map((player, index) => (
          <div
            key={player.id}
            className={`player-info ${player.symbol === playerSymbol ? 'current-player' : ''} ${
              gameState.currentPlayer === player.symbol ? 'active-turn' : ''
            }`}
          >
            <span className="player-symbol">{player.symbol}</span>
            <span className="player-name">{player.name}</span>
            {gameState.currentPlayer === player.symbol && gameState.status === 'playing' && (
              <span className="turn-indicator">← Your turn</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-status">
      <div className="status-message">{getStatusMessage()}</div>
      {getPlayersInfo()}
    </div>
  );
}

export default GameStatus;
