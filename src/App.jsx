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
          padding: '12px 16px',
          cursor: 'pointer',
          background: completedLevels.has(i) 
            ? 'linear-gradient(135deg, #00ff88, #00cc66)' 
            : 'linear-gradient(135deg, #333, #444)',
          color: '#fff',
          border: completedLevels.has(i) 
            ? '1px solid #00ff88' 
            : '1px solid #555',
          borderRadius: '8px',
          margin: '4px',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          boxShadow: completedLevels.has(i) 
            ? '0 2px 10px rgba(0, 255, 136, 0.3)' 
            : 'none',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = completedLevels.has(i) 
            ? '0 4px 15px rgba(0, 255, 136, 0.5)' 
            : '0 4px 15px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = completedLevels.has(i) 
            ? '0 2px 10px rgba(0, 255, 136, 0.3)' 
            : 'none';
        }}
      >
        Level {i}
        {completedLevels.has(i) && ' ✓'}
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.95))', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontWeight: '600', fontSize: '14px', letterSpacing: '1px', color: '#888' }}>SELECT LEVEL</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {levelButtons}
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: '600', fontSize: '14px', letterSpacing: '1px', color: '#888' }}>CONTROLS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#aaa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  <span>↑ / W</span>
                  <span>Thrust</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  <span>← / A</span>
                  <span>Rotate Left</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  <span>→ / D</span>
                  <span>Rotate Right</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  <span>Space</span>
                  <span>Tractor Beam / Pod</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px', background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.95))', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.6)' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#ff4444', fontWeight: '800', fontSize: '48px', letterSpacing: '-2px' }}>GAME OVER</h1>
          <p style={{ margin: '0 0 30px 0', color: '#888', fontSize: '16px' }}>Final Score: <span style={{ color: '#00ff88', fontWeight: '700', fontSize: '24px', fontFamily: 'monospace' }}>{score}</span></p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleStartGame} style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg, #00ff88, #00cc66)', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 30px rgba(0, 255, 136, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.3)'; }}>
              Play Again
            </button>
            <button onClick={() => setGameState('menu')} style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg, #444, #555)', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}>
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
