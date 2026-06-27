import React from 'react';

export default function OverlayMessage({ title, message, buttons, onClose }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px', background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.98))', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.6)' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#00ff88', fontWeight: '800', fontSize: '48px', letterSpacing: '-2px' }}>{title}</h1>
        {message && <p style={{ margin: '0 0 30px 0', color: '#888', fontSize: '16px' }}>{message}</p>}
        <div style={{ display: 'flex', gap: '15px' }}>
          {buttons}
        </div>
      </div>
    </div>
  );
}
