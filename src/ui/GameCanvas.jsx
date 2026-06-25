import React, { useRef, useEffect, useState } from 'react';
import { Ship } from '../game/ship.js';
import { Pod } from '../game/pod.js';
import { TileRenderer } from '../game/tile-renderer.js';
import { LevelLoader } from '../levels/level-loader.js';
import { CollisionDetection } from '../physics/collision.js';

export default function GameCanvas({ width = 800, height = 600, onFuelChange, onLevelComplete, onGameOver, onScoreChange }) {
  const canvasRef = useRef(null);
  const [ship] = useState(() => new Ship(width / 2, height / 2));
  const [keys, setKeys] = useState({});
  const [level, setLevel] = useState(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [tilesetLoaded, setTilesetLoaded] = useState(false);
  const [pod, setPod] = useState(null);
  const [podPosition, setPodPosition] = useState(null);
  const [restartPosition, setRestartPosition] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // playing, levelcomplete, gameover
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

        // Find pod position (character 'm') and restart point (character '*')
        let podPos = null;
        let restartPos = null;
        const scaledSize = 16; // TileRenderer scale
        for (let y = 0; y < layout.length; y++) {
          for (let x = 0; x < layout[y].length; x++) {
            if (layout[y][x] === 'm') {
              podPos = { x: x * scaledSize + scaledSize / 2, y: y * scaledSize + scaledSize / 2 };
            }
            if (layout[y][x] === '*' && !restartPos) {
              restartPos = { x: x * scaledSize + scaledSize / 2, y: y * scaledSize + scaledSize / 2 };
            }
          }
          if (podPos && restartPos) break;
        }

        console.log('[LEVEL] Loaded level1:', layout.length, 'rows x', lenx, 'cols');
        console.log('[POD] Position:', podPos);
        console.log('[RESTART] Position:', restartPos);
        setLevel({ layout, width: lenx, height: layout.length });
        setPodPosition(podPos);
        setRestartPosition(restartPos);
        if (podPos) {
          setPod(new Pod(podPos.x, podPos.y));
        }
        if (restartPos) {
          ship.setPosition(restartPos.x, restartPos.y);
          ship.setVelocity(0, 0);
        }
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

      // Tractor beam (Space key)
      const tractorBeamActive = keys[' '] || keys['Space'];

      // Update ship
      ship.update(1);

      // Check collision with level
      if (level && tilesetLoaded) {
        const collisionResult = collision.current.checkShipCollision(ship, level);
        if (collisionResult.collided) {
          collision.current.resolveCollision(ship, collisionResult);
        }
      }

      // Update pod
      if (pod) {
        if (tractorBeamActive) {
          // Check if close enough to tow
          const distance = Math.sqrt((ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2);
          if (distance < 50) {
            pod.setTowing(true);
            const towPos = pod.getTowPosition(ship, ship.angle);
            pod.moveToTowPosition(towPos.x, towPos.y, 0.15);
          } else {
            pod.setTowing(false);
          }
        } else {
          pod.setTowing(false);
        }
        pod.update(1);

        // Win condition: pod delivered to restart point
        if (restartPosition) {
          const distanceToRestart = Math.sqrt(
            (pod.x - restartPosition.x) ** 2 + (pod.y - restartPosition.y) ** 2
          );
          if (distanceToRestart < 20 && !pod.towed) {
            // Level complete
            setGameState('levelcomplete');
            if (onLevelComplete) onLevelComplete(currentLevel);
          }
        }
      }

      // Lose condition: fuel empty
      if (ship.fuel <= 0) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameover');
            if (onGameOver) onGameOver(score);
          } else {
            // Respawn at restart point
            if (restartPosition) {
              ship.setPosition(restartPosition.x, restartPosition.y);
              ship.setVelocity(0, 0);
              ship.fuel = 100;
            }
            if (pod && podPosition) {
              pod.setPosition(podPosition.x, podPosition.y);
              pod.setVelocity(0, 0);
            }
          }
          return newLives;
        });
      }

      // Check for fuel pickup
      if (level && tilesetLoaded) {
        const scaledSize = tileRenderer.current.getScaledTileSize();
        const shipTileX = Math.floor(ship.x / scaledSize);
        const shipTileY = Math.floor(ship.y / scaledSize);
        if (shipTileY >= 0 && shipTileY < level.layout.length) {
          const row = level.layout[shipTileY];
          if (shipTileX >= 0 && shipTileX < row.length) {
            if (row[shipTileX] === '`') {
              ship.fuel = Math.min(100, ship.fuel + 25);
              // Remove fuel pickup from layout (simple implementation)
              const newLayout = [...level.layout];
              const newRow = newLayout[shipTileY].split('');
              newRow[shipTileX] = ' ';
              newLayout[shipTileY] = newRow.join('');
              setLevel({ ...level, layout: newLayout });
              setScore(prev => prev + 10);
              if (onScoreChange) onScoreChange(score + 10);
            }
          }
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

      // Draw pod with camera offset
      if (pod) {
        ctx.save();
        ctx.translate(pod.x - camera.x, pod.y - camera.y);
        
        // Pod body (green circle)
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Pod outline
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Draw tractor beam when active and close
        if (tractorBeamActive) {
          const distance = Math.sqrt((ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2);
          if (distance < 50) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ship.x - camera.x, ship.y - camera.y);
            ctx.lineTo(pod.x - camera.x, pod.y - camera.y);
            ctx.stroke();
            
            // Glowing effect
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(ship.x - camera.x, ship.y - camera.y);
            ctx.lineTo(pod.x - camera.x, pod.y - camera.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

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
  }, [ship, keys, width, height, onFuelChange, level, tilesetLoaded, camera, pod, restartPosition, gameState, score, lives, currentLevel, onLevelComplete, onGameOver, onScoreChange]);

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
