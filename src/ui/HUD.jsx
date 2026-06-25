import React from 'react';

export default function HUD({ score, lives, level, fuel }) {
  return (
    <div className="hud">
      <div className="hud-item">Score: {score}</div>
      <div className="hud-item">Lives: {lives}</div>
      <div className="hud-item">Level: {level}</div>
      <div className="hud-item">Fuel: {Math.round(fuel)}%</div>
    </div>
  );
}
