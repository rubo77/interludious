import React, { useRef, useEffect, useState } from 'react';
import { Ship } from '../game/ship.js';
import { TileRenderer } from '../game/tile-renderer.js';
import { LevelLoader } from '../levels/level-loader.js';
import { CollisionDetection } from '../physics/collision.js';

export default function GameCanvas({ width = 800, height = 600, onFuelChange }) {
  const canvasRef = useRef(null);
  const [ship] = useState(() => new Ship(width / 2, height / 2));
  const [keys, setKeys] = useState({});
  const [level, setLevel] = useState(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [tilesetLoaded, setTilesetLoaded] = useState(false);
  const levelLoader = useRef(new LevelLoader());
  const tileRenderer = useRef(new TileRenderer());
  const collision = useRef(new CollisionDetection(tileRenderer.current));

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
    const loadAssets = async () => {
      // Load the original tileset
      try {
        await tileRenderer.current.load();
        setTilesetLoaded(true);
        console.log('[TILESET] Loaded successfully');
      } catch (error) {
        console.error('[TILESET] Failed to load:', error);
      }

      // Load the level
      try {
        const levelContent = await levelLoader.current.loadLevel('level1');
        const lines = levelContent.split('\n');

        // Parse metadata: width, height, height of start, empty space, bedrock
        const lenx = parseInt(lines[0], 10);
        const sx = parseInt(lines[2], 10); // height of start (stars)
        const sy = parseInt(lines[3], 10); // height of empty space

        // Layout starts after 10 metadata lines
        // Keep ALL layout lines including space-only lines (they are sky)
        // Remove only the final trailing empty line
        let layout = lines.slice(10);
        while (layout.length > 0 && layout[layout.length - 1].length === 0) {
          layout.pop();
        }

        // Pad each row to full level width so tiles align
        layout = layout.map(row => row.padEnd(lenx, ' '));

        console.log('[LEVEL] Loaded level1:', layout.length, 'rows x', lenx, 'cols');
        setLevel({ layout, width: lenx, height: layout.length });
      } catch (error) {
        console.error('[LEVEL] Failed to load:', error);
      }
    };

    loadAssets();
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

      // Check collision with level
      if (level && tilesetLoaded) {
        const collisionResult = collision.current.checkShipCollision(ship, level);
        if (collisionResult.collided) {
          collision.current.resolveCollision(ship, collisionResult);
        }
      }

      // Update camera to follow ship
      if (level) {
        const scaledSize = tileRenderer.current.getScaledTileSize();
        const levelWidth = level.width * scaledSize;
        const levelHeight = level.height * scaledSize;

        // Center camera on ship, clamping to level bounds
        const targetX = ship.x - width / 2;
        const targetY = ship.y - height / 2;

        setCamera({
          x: Math.max(0, Math.min(targetX, Math.max(0, levelWidth - width))),
          y: Math.max(0, Math.min(targetY, Math.max(0, levelHeight - height)))
        });
      }

      // Report fuel to parent
      if (onFuelChange) {
        onFuelChange(ship.fuel);
      }

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw level with camera offset
      if (level && tilesetLoaded) {
        tileRenderer.current.render(ctx, level, -camera.x, -camera.y);
      }

      // Draw ship with camera offset
      ctx.save();
      ctx.translate(ship.x - camera.x, ship.y - camera.y);
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
  }, [ship, keys, width, height, onFuelChange, level, tilesetLoaded, camera]);

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
