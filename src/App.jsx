import React, { useState } from 'react';
import Menu from './ui/Menu';
import HUD from './ui/HUD';
import GameCanvas from './ui/GameCanvas';

function App() {
  const [gameState, setGameState] = useState('playing'); // Start directly in playing mode
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [fuel, setFuel] = useState(100);
  const [completedLevels, setCompletedLevels] = useState(new Set());

  const handleStartGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setFuel(100);
  };

  const handleStartLevel = (levelNum) => {
    setGameState('playing');
    setLevel(levelNum);
    setFuel(100);
  };

  const handleLevelComplete = (completedLevel) => {
    setScore(prev => prev + 100);
    setCompletedLevels(prev => new Set([...prev, completedLevel]));
    setLevel(prev => prev + 1);
    setGameState('playing');
  };

  const handleGameOver = (finalScore) => {
    setGameState('gameover');
  };

  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  const levelButtons = [];
  for (let i = 1; i <= 6; i++) {
    levelButtons.push(
      <button
        key={i}
        onClick={() => handleStartLevel(i)}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          backgroundColor: completedLevels.has(i) ? '#00ff00' : '#333',
          color: '#fff',
          border: '1px solid #555',
          margin: '2px'
        }}
      >
        Level {i}
      </button>
    );
  }

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      {gameState === 'menu' && (
        <Menu onStart={handleStartGame} />
      )}
      
      {gameState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <HUD score={score} lives={lives} level={level} fuel={fuel} />
            <GameCanvas 
              width={800} 
              height={600} 
              onFuelChange={setFuel} 
              onLevelComplete={handleLevelComplete}
              onGameOver={handleGameOver}
              onScoreChange={handleScoreChange}
              level={level}
            />
            <button onClick={() => setGameState('menu')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Back to Menu
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', backgroundColor: '#111', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Select Level</h3>
            {levelButtons}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <h1>Game Over</h1>
          <p>Final Score: {score}</p>
          <button onClick={handleStartGame} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Play Again
          </button>
          <button onClick={() => setGameState('menu')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
