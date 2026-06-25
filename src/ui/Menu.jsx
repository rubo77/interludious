import React from 'react';

export default function Menu({ onStart }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px 60px',
        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.95))',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.6)',
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: '800',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #00ff88, #00ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-2px',
        }}>
          INTERLUDIOUS
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#888',
          margin: '0 0 40px 0',
          letterSpacing: '1px',
        }}>
          A MODERN TAKE ON THE CLASSIC THRUST
        </p>
        <button 
          onClick={onStart}
          style={{
            padding: '16px 48px',
            fontSize: '18px',
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
