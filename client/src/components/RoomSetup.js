import React, { useState } from 'react';
import './RoomSetup.css';

function RoomSetup({ onCreateRoom, onJoinRoom, error, isConnected }) {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateRoom(playerName);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    onJoinRoom(playerName, roomId);
  };

  return (
    <div className="room-setup">
      <div className="setup-container">
        <h1>Tic-Tac-Toe Multiplayer</h1>
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Room
          </button>
          <button
            className={`tab ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            Join Room
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'create' ? (
          <form onSubmit={handleCreate} className="setup-form">
            <div className="form-group">
              <label htmlFor="create-name">Your Name</label>
              <input
                id="create-name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={!isConnected}>
              {isConnected ? 'Create Room' : 'Connecting...'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="setup-form">
            <div className="form-group">
              <label htmlFor="join-name">Your Name</label>
              <input
                id="join-name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="room-id">Room ID</label>
              <input
                id="room-id"
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room ID"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={!isConnected}>
              {isConnected ? 'Join Room' : 'Connecting...'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RoomSetup;
