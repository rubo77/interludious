import React, { useRef, useEffect } from 'react';

export default function GameCanvas({ width = 800, height = 600 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw simple placeholder content
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Canvas', width / 2, height / 2);
    ctx.font = '16px Arial';
    ctx.fillText('Game rendering will be implemented here', width / 2, height / 2 + 30);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '2px solid #333', backgroundColor: '#000' }}
    />
  );
}
