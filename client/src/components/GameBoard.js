import React from 'react';
import './GameBoard.css';

function GameBoard({ board, currentPlayer, playerSymbol, onCellClick, disabled }) {
  const renderCell = (index) => {
    const value = board[index];
    const isClickable = !disabled && value === null && currentPlayer === playerSymbol;
    
    return (
      <button
        key={index}
        className={`cell ${value ? `cell-${value.toLowerCase()}` : ''} ${isClickable ? 'clickable' : ''}`}
        onClick={() => isClickable && onCellClick(index)}
        disabled={!isClickable}
      >
        {value || ''}
      </button>
    );
  };

  return (
    <div className="game-board">
      <div className="board-grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
      </div>
    </div>
  );
}

export default GameBoard;
