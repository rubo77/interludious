import React, { useRef, useEffect, useState } from 'react';
import { Ship } from '../game/ship.js';
import { LevelRenderer } from '../game/level-renderer.js';
import { LevelLoader } from '../levels/level-loader.js';

export default function GameCanvas({ width = 800, height = 600, onFuelChange }) {
  const canvasRef = useRef(null);
  const [ship] = useState(() => new Ship(width / 2, height / 2));
  const [keys, setKeys] = useState({});
  const [level, setLevel] = useState(null);
  const levelLoader = useRef(new LevelLoader());
  const levelRenderer = useRef(new LevelRenderer());

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const loadLevel = async () => {
      try {
        const levelContent = await levelLoader.current.loadLevel('level1');
        const lines = levelContent.split('\n');
        const layout = lines.filter(line => line.trim() && !line.trim().startsWith('#'));
        setLevel({ layout, width: layout[0]?.length || 0, height: layout.length || 0 });
      } catch (error) {
        console.error('Failed to load level:', error);
        // Create simple test level
        const layout = [
          '####################',
          '#                  #',
          '#                  #',
          '#                  #',
          '#  *               #',
          '#                  #',
          '#                  #',
          '#                  #',
          '#                  #',
          '#                  #',
          '#                  #',
          '#                  #',
          '#                  #',
          '#                  #',
          '#                  #',
          '####################'
        ];
        setLevel({ layout, width: layout[0].length, height: layout.length });
      }
    };

    loadLevel();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;

    const render = () => {
      // Handle input
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        ship.rotateLeft();
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        ship.rotateRight();
      }
      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        ship.setThrust(true);
      } else {
        ship.setThrust(false);
      }

      // Update ship
      ship.update(1);

      // Report fuel to parent
      if (onFuelChange) {
        onFuelChange(ship.fuel);
      }

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw level
      if (level) {
        levelRenderer.current.render(ctx, level);
      }

      // Draw ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);

      // Ship body
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 5);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();

      // Thrust flame
      if (ship.thrust > 0) {
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(-5, 10);
        ctx.lineTo(0, 20 + Math.random() * 10);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      // Boundary collision (wrap around)
      if (ship.x < 0) ship.x = width;
      if (ship.x > width) ship.x = 0;
      if (ship.y < 0) ship.y = height;
      if (ship.y > height) ship.y = 0;

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [ship, keys, width, height, onFuelChange, level]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '2px solid #333', backgroundColor: '#000' }}
      tabIndex={0}
    />
  );
}
