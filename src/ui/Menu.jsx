import React from 'react';

export default function Menu({ onStart }) {
  return (
    <div className="menu">
      <h1>Interludious</h1>
      <p>A modern take on the classic Thrust</p>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}
