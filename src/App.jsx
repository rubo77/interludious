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

  const handleStartGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setFuel(100);
  };

  const handleLevelComplete = (completedLevel) => {
    setScore(prev => prev + 100);
    setLevel(prev => prev + 1);
    setGameState('playing');
  };

  const handleGameOver = (finalScore) => {
    setGameState('gameover');
  };

  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      {gameState === 'menu' && (
        <Menu onStart={handleStartGame} />
      )}
      
      {gameState === 'playing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <HUD score={score} lives={lives} level={level} fuel={fuel} />
          <GameCanvas 
            width={800} 
            height={600} 
            onFuelChange={setFuel} 
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            onScoreChange={handleScoreChange}
          />
          <button onClick={() => setGameState('menu')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Back to Menu
          </button>
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
