import React, { useRef } from 'react';

export default function HamburgerMenu({ isOpen, onClose, levelButtons, onBackToMenu, appVersion }) {
  const menuRef = useRef(null);

  if (!isOpen) return null;

  const scrollToBottom = () => {
    if (menuRef.current) {
      menuRef.current.scrollTo({
        top: menuRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={menuRef} style={{ position: 'absolute', top: '50px', right: '0', width: '250px', maxHeight: '80vh', background: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px', zIndex: 2000, overflowY: 'auto', scrollbarWidth: 'auto' }}>
      <button
        onClick={scrollToBottom}
        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
      >
        ⌄
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

      {onBackToMenu && (
        <button
          onClick={onBackToMenu}
          style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #444, #555)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          Back to Menu
        </button>
      )}
      <div style={{ marginTop: '15px', fontSize: '10px', color: '#555', textAlign: 'center' }}>
        v{appVersion}
      </div>
    </div>
  );
}
