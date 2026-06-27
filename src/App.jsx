import React, { useState, useEffect } from 'react';
import Menu from './ui/Menu';
import GameCanvas from './ui/GameCanvas';
import OverlayMessage from './ui/OverlayMessage';

function App() {
  const [gameState, setGameState] = useState('playing'); // Start directly in playing mode
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [fuel, setFuel] = useState(100);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [gravityMultiplier, setGravityMultiplier] = useState(1.0);
  const [gameSession, setGameSession] = useState(0); // Increments on each new game to force GameCanvas remount

  const handleStartGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setFuel(100);
    setGravityMultiplier(1.0);
    setGameSession(prev => prev + 1); // Force full GameCanvas reset
  };

  const handleStartLevel = (levelNum) => {
    setGameState('playing');
    setLevel(levelNum);
    setFuel(100);
  };

  const handleLevelComplete = (completedLevel) => {
    setScore(prev => prev + 100);
    setCompletedLevels(prev => new Set([...prev, completedLevel]));
    setGameState('levelcomplete');
  };

  const handleNextLevel = () => {
    // If last level (6) completed, restart from level 1 with stronger gravity
    if (level >= 6) {
      setLevel(1);
      setGravityMultiplier(prev => prev + 0.2); // Increase gravity by 20%
    } else {
      setLevel(prev => prev + 1);
    }
    setGameState('playing');
  };

  const handleGameOver = (finalScore) => {
    setGameState('gameover');
  };

  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  const handleLivesChange = (newLives) => {
    setLives(newLives);
  };

  // Keyboard shortcuts for game over and level complete screens
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'gameover') {
        if (e.key === ' ' || e.key === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          handleStartGame();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setGameState('menu');
        }
      } else if (gameState === 'levelcomplete') {
        if (e.key === ' ' || e.key === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          handleNextLevel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

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
    <div className="app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative' }}>
      {gameState === 'menu' && (
        <Menu onStart={handleStartGame} />
      )}

      {(gameState === 'playing' || gameState === 'gameover' || gameState === 'levelcomplete') && (
        <>
          {/* HUD overlay on top */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', fontSize: '12px', color: '#fff', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>SCORE{score}</span>
              <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>LIVES{'❤️'.repeat(lives)}</span>
              <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>LEVEL{level}</span>
              <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>FUEL</span>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', padding: '4px' }}
            >
              ☰
            </button>
          </div>

          {/* Canvas wrapper for scaled canvas and centered overlays */}
          <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}>
              <GameCanvas
                key={`game-${gameSession}`}
                onFuelChange={setFuel}
                onLevelComplete={handleLevelComplete}
                onGameOver={handleGameOver}
                onScoreChange={handleScoreChange}
                onLivesChange={handleLivesChange}
                level={level}
                gravityMultiplier={gravityMultiplier}
                frozen={gameState === 'gameover' || gameState === 'levelcomplete'}
              />

              {/* Game over overlay - centered over canvas */}
              {gameState === 'gameover' && (
                <OverlayMessage
                  title="GAME OVER"
                  message={`Final Score: ${score}`}
                  buttons={
                    <>
                      <button onClick={handleStartGame} style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg, #00ff88, #00cc66)', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 30px rgba(0, 255, 136, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.3)'; }}>
                        Play Again
                      </button>
                      <button onClick={() => setGameState('menu')} style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg, #444, #555)', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}>
                        Back to Menu
                      </button>
                    </>
                  }
                />
              )}

              {/* Level complete overlay - centered over canvas */}
              {gameState === 'levelcomplete' && (
                <OverlayMessage
                  title="LEVEL COMPLETE"
                  message={`Score: ${score}`}
                  buttons={
                    <button onClick={handleNextLevel} style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg, #00ff88, #00cc66)', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 30px rgba(0, 255, 136, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.3)'; }}>
                      Next Level
                    </button>
                  }
                />
              )}
            </div>
          </div>

          {/* Menu overlay for level selection and controls */}
          {showMobileMenu && (
            <div style={{ position: 'absolute', top: '50px', right: '0', width: '250px', background: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px', zIndex: 100 }}>
              <button
                onClick={() => setShowMobileMenu(false)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>

              <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontWeight: '600', fontSize: '14px' }}>SELECT LEVEL</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {levelButtons}
              </div>

              <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: '600', fontSize: '14px' }}>CONTROLS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#aaa', marginBottom: '20px' }}>
                <div><span style={{ color: '#fff' }}>↑ / W</span> - Thrust</div>
                <div><span style={{ color: '#fff' }}>← / A</span> - Rotate Left</div>
                <div><span style={{ color: '#fff' }}>→ / D</span> - Rotate Right</div>
                <div><span style={{ color: '#fff' }}>Space</span> - Tractor Beam</div>
                <div><span style={{ color: '#fff' }}>X</span> - Shoot</div>
              </div>

              <button
                onClick={() => { setGameState('menu'); setShowMobileMenu(false); }}
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #444, #555)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                Back to Menu
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
