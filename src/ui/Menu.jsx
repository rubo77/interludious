import React, { useEffect, useState } from 'react';
import HamburgerMenu from './HamburgerMenu';

export default function Menu({ onStart, levelButtons, onBackToMenu, appVersion }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // Allow starting the game with Space or Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div id="menu" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundImage: 'url(/dev/ideas/logo2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      padding: '20px',
    }}>
      {/* Hamburger menu button - always on the right */}
      <button
        id="menu-hamburger-button"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        style={{ position: 'fixed', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', padding: '4px', zIndex: 1001 }}
      >
        ☰
      </button>

      {/* Hamburger menu overlay */}
      <HamburgerMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        levelButtons={levelButtons || []}
        onBackToMenu={onBackToMenu}
        appVersion={appVersion}
      />
      <div id="menu-content" style={{
        textAlign: 'center',
        padding: 'clamp(20px, 5vw, 60px)',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(20px, 5vw, 40px)',
        margin: 'auto',
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 6vw, 64px)',
          fontWeight: '800',
          margin: '0',
          background: 'linear-gradient(135deg, #00ff88, #00ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-2px',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}>
          INTERLUDIOUS
        </h1>
        <button
          onClick={onStart}
          style={{
            padding: 'clamp(12px, 3vw, 20px) clamp(24px, 6vw, 60px)',
            fontSize: 'clamp(14px, 3.5vw, 20px)',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #00ff88, #00cc66)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 30px rgba(0, 255, 136, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.3)';
          }}
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
