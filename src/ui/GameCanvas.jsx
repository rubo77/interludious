import React, { useRef, useEffect, useState } from 'react';
import { Ship } from '../game/ship.js';
import { Pod } from '../game/pod.js';
import { Bunker } from '../game/bunker.js';
import { Bullet } from '../game/bullet.js';
import { Button } from '../game/button.js';
import { Slider } from '../game/slider.js';
import { ParticleSystem } from '../game/particle-system.js';
import { TileRenderer } from '../game/tile-renderer.js';
import { LevelLoader } from '../levels/level-loader.js';
import { CollisionDetection } from '../physics/collision.js';
import { SKY_THRESHOLD_OFFSET, GAME_SPEED, GRAVITY, POD_HOLDER_OFFSET, POD_TETHER_WIDTH, GAME_WIDTH, GAME_HEIGHT, TOUCH_BUTTON_RATIO_THRESHOLD } from '../core/constants.js';

// Geometry of all touch control buttons in canvas-internal coordinates.
// Returns an array of button objects with type, position, size, label, and color.
// Shared by both the renderer and the pointer hit-testing (DRY).
function getTouchButtonRects(w, h, ratio) {
  const margin = 10;
  const btnSize = 50;
  const buttons = [];

  // HUD height is proportional to canvas height (8% of canvas height)
  const hudHeight = h * 0.08;

  // POD (tractor beam) buttons
  if (ratio > TOUCH_BUTTON_RATIO_THRESHOLD) {
    const bw = 60, bh = 120, y = (h - bh) / 2;
    buttons.push(
      { type: 'pod', x: 10, y, w: bw, h: bh, label: 'POD', font: '14px Arial', color: 'rgba(255, 255, 0, 0.2)', activeColor: 'rgba(255, 255, 0, 0.5)' },
      { type: 'pod', x: w - bw - 10, y, w: bw, h: bh, label: 'POD', font: '14px Arial', color: 'rgba(255, 255, 0, 0.2)', activeColor: 'rgba(255, 255, 0, 0.5)' }
    );
  } else {
    const bh = 60;
    // Make the bottom POD button narrower to leave room for thrust buttons in corners
    const podWidth = w - 2 * (btnSize + margin * 2);
    buttons.push(
      { type: 'pod', x: btnSize + margin * 2, y: h - bh - margin, w: podWidth, h: bh, label: 'POD (Traktorstrahl)', font: '16px Arial', color: 'rgba(255, 255, 0, 0.2)', activeColor: 'rgba(255, 255, 0, 0.5)' }
    );
  }

  // Thrust buttons (bottom corners)
  buttons.push(
    { type: 'thrust', x: margin, y: h - btnSize - margin, w: btnSize, h: btnSize, label: '↑', font: '20px Arial', color: 'rgba(0, 255, 0, 0.2)', activeColor: 'rgba(0, 255, 0, 0.5)' },
    { type: 'thrust', x: w - btnSize - margin, y: h - btnSize - margin, w: btnSize, h: btnSize, label: '↑', font: '20px Arial', color: 'rgba(0, 255, 0, 0.2)', activeColor: 'rgba(0, 255, 0, 0.5)' }
  );

  // Fire button (always top-right, below HUD)
  buttons.push(
    { type: 'fire', x: w - btnSize - margin, y: hudHeight + margin, w: btnSize, h: btnSize, label: 'X', font: '20px Arial', color: 'rgba(255, 0, 0, 0.2)', activeColor: 'rgba(255, 0, 0, 0.5)' }
  );

  // Rotate buttons (top-left corner, below HUD)
  const rotateSize = 40;
  buttons.push(
    { type: 'rotateLeft', x: margin, y: hudHeight + margin, w: rotateSize, h: rotateSize, label: '←', font: '18px Arial', color: 'rgba(0, 100, 255, 0.2)', activeColor: 'rgba(0, 100, 255, 0.5)' },
    { type: 'rotateRight', x: margin + rotateSize + 5, y: hudHeight + margin, w: rotateSize, h: rotateSize, label: '→', font: '18px Arial', color: 'rgba(0, 100, 255, 0.2)', activeColor: 'rgba(0, 100, 255, 0.5)' }
  );

  return buttons;
}

// Convert pointer client coordinates to canvas-internal coordinates,
// accounting for object-fit: contain letterboxing.
function pointerToCanvas(canvas, clientX, clientY, w, h) {
  const rect = canvas.getBoundingClientRect();
  const elementRatio = rect.width / rect.height;
  const canvasRatio = w / h;
  let drawW, drawH, offsetX, offsetY;
  if (elementRatio > canvasRatio) {
    drawH = rect.height;
    drawW = drawH * canvasRatio;
    offsetX = (rect.width - drawW) / 2;
    offsetY = 0;
  } else {
    drawW = rect.width;
    drawH = drawW / canvasRatio;
    offsetX = 0;
    offsetY = (rect.height - drawH) / 2;
  }
  return {
    x: (clientX - rect.left - offsetX) / drawW * w,
    y: (clientY - rect.top - offsetY) / drawH * h,
  };
}

export default function GameCanvas({ width = GAME_WIDTH, height = GAME_HEIGHT, onFuelChange, onLevelComplete, onGameOver, onScoreChange, onLivesChange, level: levelProp, gravityMultiplier = 1.0, frozen = false }) {
  const canvasRef = useRef(null);
  const [ship] = useState(() => new Ship(width / 2, height / 2));
  const [keys, setKeys] = useState({});
  const [touchActive, setTouchActive] = useState(false); // tractor-beam touch button pressed
  const [thrustActive, setThrustActive] = useState(false); // thrust button pressed
  const [fireActive, setFireActive] = useState(false); // fire button pressed
  const [rotateLeftActive, setRotateLeftActive] = useState(false); // rotate left button pressed
  const [rotateRightActive, setRotateRightActive] = useState(false); // rotate right button pressed
  const [screenRatio, setScreenRatio] = useState(() => (typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 4 / 3));
  const [level, setLevel] = useState(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [tilesetLoaded, setTilesetLoaded] = useState(false);
  const [pod, setPod] = useState(null);
  const [podPosition, setPodPosition] = useState(null);
  const [restartPosition, setRestartPosition] = useState(null);
  const [bunkers, setBunkers] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [playerBullets, setPlayerBullets] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [score, setScore] = useState(0);
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0, intensity: 0 });
  const [podExploded, setPodExploded] = useState(false);
  const [podExplosionTime, setPodExplosionTime] = useState(null);
  const [podStartPosition, setPodStartPosition] = useState(null);
  const [stars, setStars] = useState([]);
  const particleSystem = useRef(new ParticleSystem());
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(levelProp || 1);
  const [gameState, setGameState] = useState('playing'); // playing, levelcomplete, gameover, docking
  const [dockingAnimation, setDockingAnimation] = useState(null); // { progress: 0-1, phase: 'docking' | 'flying' }
  const levelLoader = useRef(new LevelLoader());
  const tileRenderer = useRef(new TileRenderer());
  const collision = useRef(new CollisionDetection(tileRenderer.current));
  const levelCompleteTriggered = useRef(false);
  const shipDestroyed = useRef(false);
  const deathAnim = useRef({ active: false, timeLeft: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
      // Prevent space from scrolling the page
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
      // Prevent space from scrolling the page
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Track screen aspect ratio so the touch button(s) reposition on resize/orientation change
  useEffect(() => {
    const onResize = () => setScreenRatio(window.innerWidth / window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Pointer handling for all on-screen touch buttons (mouse + touch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getButtonAt = (clientX, clientY) => {
      const p = pointerToCanvas(canvas, clientX, clientY, width, height);
      return getTouchButtonRects(width, height, screenRatio).find(
        (b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h
      );
    };

    const handlePointerDown = (e) => {
      const btn = getButtonAt(e.clientX, e.clientY);
      if (btn) {
        e.preventDefault();
        switch (btn.type) {
          case 'pod': setTouchActive(true); break;
          case 'thrust': setThrustActive(true); break;
          case 'fire': setFireActive(true); break;
          case 'rotateLeft': setRotateLeftActive(true); break;
          case 'rotateRight': setRotateRightActive(true); break;
        }
      }
    };

    const handlePointerUp = () => {
      setTouchActive(false);
      setThrustActive(false);
      setFireActive(false);
      setRotateLeftActive(false);
      setRotateRightActive(false);
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [width, height, screenRatio]);

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
        const levelContent = await levelLoader.current.loadLevel(`level${currentLevel}`);
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

        // Find pod position (character 'm'), restart point (character '*'), buttons (L,N), and sliders (@-K)
        let podPos = null;
        let restartPos = null;
        const bunkerPositions = [];
        const buttonPositions = [];
        const sliderPositions = [];
        const scaledSize = 16; // TileRenderer scale
        for (let y = 0; y < layout.length; y++) {
          for (let x = 0; x < layout[y].length; x++) {
            if (layout[y][x] === 'm') {
              podPos = { x: x * scaledSize + scaledSize / 2, y: y * scaledSize + scaledSize / 2 };
            }
            if (layout[y][x] === '*' && !restartPos) {
              restartPos = { x: x * scaledSize + scaledSize / 2, y: y * scaledSize + scaledSize / 2 };
            }
            if (['P', 'U', '[', '\\'].includes(layout[y][x])) {
              bunkerPositions.push({ 
                x: x * scaledSize + scaledSize / 2, 
                y: y * scaledSize + scaledSize / 2, 
                type: layout[y][x] 
              });
            }
            if (['L', 'N'].includes(layout[y][x])) {
              buttonPositions.push({ 
                x: x * scaledSize + scaledSize / 2, 
                y: y * scaledSize + scaledSize / 2, 
                type: layout[y][x] 
              });
            }
            if (layout[y][x].charCodeAt(0) >= 64 && layout[y][x].charCodeAt(0) <= 75) {
              sliderPositions.push({ 
                x: x * scaledSize + scaledSize / 2, 
                y: y * scaledSize + scaledSize / 2, 
                type: layout[y][x] 
              });
            }
          }
          if (podPos && restartPos) break;
        }

        // Remove the 'm' pod marker tile from the layout: in the tileset it renders
        // as a transparent ball AND its char code (109) counts as a wall, which made
        // the pod explode the moment it left the holder. The holder itself is built
        // from the surrounding stand tiles (digits 0-4) and stays in the layout.
        const cleanedLayout = layout.map(row => row.replace(/m/g, ' '));

        console.log('[LEVEL] Loaded level1:', layout.length, 'rows x', lenx, 'cols');
        console.log('[POD] Position:', podPos);
        console.log('[RESTART] Position:', restartPos);
        console.log('[BUNKERS] Count:', bunkerPositions.length);
        console.log('[BUTTONS] Count:', buttonPositions.length);
        console.log('[SLIDERS] Count:', sliderPositions.length);
        setLevel({ layout: cleanedLayout, width: lenx, height: cleanedLayout.length });
        setPodPosition(podPos);
        setRestartPosition(restartPos);
        if (podPos) {
          // Pod sits a bit ABOVE the holder marker to avoid colliding with it
          const podX = podPos.x;
          const podY = podPos.y - POD_HOLDER_OFFSET;
          setPod(new Pod(podX, podY));
          setPodStartPosition({ x: podX, y: podY });
        }
        if (restartPos) {
          ship.setPosition(restartPos.x, restartPos.y);
          ship.setVelocity(0, 0);
          // Reset level complete guard for the new level
          levelCompleteTriggered.current = false;
          shipDestroyed.current = false;
          deathAnim.current = { active: false, timeLeft: 0 };
          // Reset camera to center on ship spawn, clamped to level bounds
          const levelWidth = lenx * scaledSize;
          const levelHeight = layout.length * scaledSize;
          const camX = Math.max(0, Math.min(restartPos.x - width / 2, Math.max(0, levelWidth - width)));
          const camY = Math.max(0, Math.min(restartPos.y - height / 2, Math.max(0, levelHeight - height)));
          setCamera({ x: camX, y: camY });
        }
        setBunkers(bunkerPositions.map(bp => new Bunker(bp.x, bp.y, bp.type)));
        setButtons(buttonPositions.map(bp => new Button(bp.x, bp.y, bp.type)));
        setSliders(sliderPositions.map(sp => new Slider(sp.x, sp.y, sp.type, 'horizontal')));

        // Generate stars in the SKY (the region ABOVE the level, i.e. negative y).
        // Density ramps from 0 starting 100px above the ship spawn up to full
        // density at SKY_THRESHOLD_OFFSET. Random positions, brightness, flicker.
        const newStars = [];
        if (restartPos) {
          const levelWidthPx = lenx * 16;
          const shipStartY = restartPos.y;
          const yDensityStart = shipStartY - 100;        // density 0 boundary (lower edge of sky)
          const yFullDensity = -SKY_THRESHOLD_OFFSET;    // full density boundary (higher in the sky)
          const yTop = yFullDensity - 400;               // generate a bit beyond full-density edge
          const candidateCount = 1200;
          for (let i = 0; i < candidateCount; i++) {
            const y = yDensityStart - Math.random() * (yDensityStart - yTop);
            // Density factor: 0 at yDensityStart, 1 at/above yFullDensity
            const density = Math.max(0, Math.min(1, (yDensityStart - y) / (yDensityStart - yFullDensity)));
            if (Math.random() > density) continue; // keep star with probability = density
            newStars.push({
              x: Math.random() * levelWidthPx,
              y,
              size: Math.random() * 1.5 + 0.5,
              brightness: Math.random() * 0.6 + 0.4, // 0.4 - 1.0 base brightness
              flickerSpeed: Math.random() * 0.004 + 0.001,
              flickerOffset: Math.random() * Math.PI * 2
            });
          }
        }
        setStars(newStars);
      } catch (error) {
        console.error('[LEVEL] Failed to load:', error);
      }
    };

    loadAssets();
  }, [currentLevel]);

  // Update currentLevel when levelProp changes
  useEffect(() => {
    if (levelProp !== undefined && levelProp !== currentLevel) {
      setCurrentLevel(levelProp);
      // Reset game state when level changes
      setGameState('playing');
      setDockingAnimation(null);
      setScore(0);
      setLives(3);
      if (onLivesChange) onLivesChange(3);
    }
  }, [levelProp, currentLevel]);

  // Render logic is stored in a ref so the requestAnimationFrame loop can stay stable
  // (a single loop for the whole component lifetime). Previously the loop lived inside an
  // effect whose dependency array changed every frame, so it was torn down and recreated
  // constantly and could spawn multiple concurrent loops -> progressive slowdown under load.
  const lastTimeRef = useRef(performance.now());
  const renderFnRef = useRef(() => {});

  renderFnRef.current = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Enable anti-aliasing and smooth rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Reset ship and pod back to their level-start state (DRY helper used by every respawn site)
    const respawnShipAndPod = () => {
      if (restartPosition) {
        ship.setPosition(restartPosition.x, restartPosition.y);
        ship.setVelocity(0, 0);
        ship.fuel = 100;
      }
      // Put the pod safely back on its holder (recreate it if it had exploded)
      if (podStartPosition) {
        if (!pod || !pod.active) {
          setPod(new Pod(podStartPosition.x, podStartPosition.y));
        } else {
          pod.setPosition(podStartPosition.x, podStartPosition.y);
          pod.vx = 0;
          pod.vy = 0;
          pod.towed = false;
          pod.onHolder = true;
          pod.active = true;
        }
      }
      setPodExploded(false);
      setPodExplosionTime(null);
      shipDestroyed.current = false;
    };

    // Destroy the ship: start ~1s explosion animation, then game over or respawn (DRY helper)
    const destroyShip = () => {
      if (shipDestroyed.current) return;
      shipDestroyed.current = true;
      // Big explosion with debris flying apart
      particleSystem.current.spawnExplosion(ship.x, ship.y, 80, '#ff6600');
      particleSystem.current.spawnExplosion(ship.x, ship.y, 40, '#ffff00');
      particleSystem.current.spawnExplosion(ship.x, ship.y, 30, '#00ff00');
      setScreenShake({ x: 0, y: 0, intensity: 15 });
      ship.setVelocity(0, 0);
      ship.setThrust(false);
      // Start ~1s death animation (60 frames at 60fps)
      deathAnim.current = { active: true, timeLeft: 60 };
    };

    // Finalize death after the explosion animation: lose a life, respawn or game over
    const finalizeDeath = () => {
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (onLivesChange) onLivesChange(newLives);
        if (newLives <= 0) {
          setGameState('gameover');
          if (onGameOver) onGameOver(score);
        } else {
          // Respawn at restart point with the pod back on its holder
          respawnShipAndPod();
        }
        return newLives;
      });
    };

    const currentTime = performance.now();
    let deltaTime = (currentTime - lastTimeRef.current) / 16.67; // Normalize to 1.0 at 60fps
    // Cap delta to avoid a "spiral of death" if a single frame is very slow
    if (deltaTime > 3) deltaTime = 3;
    // Apply global game speed multiplier
    deltaTime *= GAME_SPEED;
    lastTimeRef.current = currentTime;

      // Death animation: explode for ~1s with debris, then game over or respawn
      const isDying = deathAnim.current.active;
      if (isDying) {
        deathAnim.current.timeLeft -= deltaTime;
        // Keep spawning debris for a lively explosion
        if (Math.random() < 0.4) {
          particleSystem.current.spawnExplosion(
            ship.x + (Math.random() - 0.5) * 40,
            ship.y + (Math.random() - 0.5) * 40,
            6, '#ff9900'
          );
        }
        if (deathAnim.current.timeLeft <= 0) {
          deathAnim.current.active = false;
          finalizeDeath();
        }
      }

      // Handle input (skipped while the ship is exploding)
      if (!isDying) {
        if (keys['ArrowLeft'] || keys['a'] || keys['A'] || rotateLeftActive) {
          ship.rotateLeft();
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D'] || rotateRightActive) {
          ship.rotateRight();
        }
        if (keys['ArrowUp'] || keys['w'] || keys['W'] || thrustActive) {
          ship.setThrust(true);
          // Spawn thrust particles
          const thrustX = ship.x - Math.sin(ship.angle) * 15;
          const thrustY = ship.y + Math.cos(ship.angle) * 15;
          particleSystem.current.spawnThrust(thrustX, thrustY, ship.angle);
        } else {
          ship.setThrust(false);
        }
      }

      // Tractor beam (Space key or on-screen touch button)
      const tractorBeamActive = keys[' '] || keys['Space'] || touchActive;

      // Tractor beam raycast: beam shoots straight down until it hits the first obstacle.
      // Disabled while the pod is being towed (docked).
      const beamActive = tractorBeamActive && !(pod && pod.towed);
      let beamEndY = ship.y;
      if (beamActive && level && tilesetLoaded) {
        const maxBeam = 240;
        const step = 4;
        beamEndY = ship.y + maxBeam;
        for (let d = 10; d <= maxBeam; d += step) {
          const checkY = ship.y + d;
          const tile = tileRenderer.current.getTileAt(level, ship.x, checkY);
          if (tile === '`') {
            // Fuel depot inside the beam: recharge fuel gradually (like the original)
            ship.fuel = Math.min(100, ship.fuel + 0.8 * deltaTime);
            beamEndY = checkY;
            break;
          }
          if (tileRenderer.current.isWall(tile)) {
            beamEndY = checkY;
            break;
          }
        }
      }

      // Player shooting (X key)
      setPlayerBullets(prev => {
        const newBullets = [...prev];
        // Check if X is pressed or fire button is active and add cooldown logic
        if (keys['x'] || keys['X'] || fireActive) {
          // Simple cooldown: only shoot every ~10 frames
          const lastShotTime = newBullets.length > 0 ? newBullets[newBullets.length - 1].time : 0;
          if (performance.now() - lastShotTime > 150) { // 150ms cooldown
            const bulletSpeed = 8;
            newBullets.push({
              x: ship.x + Math.sin(ship.angle) * 20,
              y: ship.y - Math.cos(ship.angle) * 20,
              vx: Math.sin(ship.angle) * bulletSpeed,
              vy: -Math.cos(ship.angle) * bulletSpeed,
              time: performance.now()
            });
          }
        }
        return newBullets;
      });

      // Check if 0.5 seconds have passed after pod explosion, then destroy ship
      if (podExploded && podExplosionTime) {
        const timeSinceExplosion = performance.now() - podExplosionTime;
        if (timeSinceExplosion >= 500 && !isDying) {
          destroyShip();
          setPodExploded(false);
          setPodExplosionTime(null);
        }
      }

      // Skip all updates if frozen (game over state with frozen canvas)
      if (frozen) {
        // Still render the scene but don't update anything
      } else {
      // Update ship (frozen while exploding)
      if (!isDying) {
        ship.update(deltaTime, GRAVITY, gravityMultiplier);
      }

      // Check collision with level - touching a wall destroys the ship
      if (level && tilesetLoaded && gameState === 'playing') {
        const collisionResult = collision.current.checkShipCollision(ship, level);
        if (collisionResult.collided) {
          destroyShip();
        }
      }

      // Update pod
      if (pod && pod.active) {
        // Tractor beam grabs the pod once the ship is close enough.
        // Grabbing the pod permanently takes it off the holder; while the beam
        // stays active the pod remains towed (the tether keeps them together).
        if (tractorBeamActive) {
          if (pod.onHolder) {
            const distance = Math.sqrt((ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2);
            if (distance < 50) {
              pod.onHolder = false; // [POD_HOLDER] leaving the holder for good
              pod.towed = true;
            }
          } else {
            pod.towed = true;
          }
        } else {
          pod.towed = false;
        }

        // Apply physically-correct tow tether forces (affects both ship and pod)
        if (pod.towed) {
          pod.applyTether(ship, deltaTime);
        }

        // Pod collision with walls/obstacles: only when off the holder.
        // On the holder the pod is completely safe.
        if (!podExploded && gameState === 'playing' && !pod.onHolder) {
          const podCollision = collision.current.checkPodCollision(pod, level);
          if (podCollision.collided) {
            console.log('[POD_COLLISION] Pod hit wall tile:', podCollision.tile, 'at', podCollision.point, 'podPos:', { x: pod.x, y: pod.y });
            // Pod explodes first, ship follows 0.5s later (see explosion timer above)
            setPodExploded(true);
            setPodExplosionTime(performance.now());
            particleSystem.current.spawnExplosion(pod.x, pod.y, 40, '#00ff00');
            pod.active = false;
          }
        }

        pod.update(deltaTime);

        // Win condition: pod delivered to restart point
        if (restartPosition && gameState === 'playing') {
          const distanceToRestart = Math.sqrt(
            (pod.x - restartPosition.x) ** 2 + (pod.y - restartPosition.y) ** 2
          );
          if (distanceToRestart < 20) {
            // Start docking animation (works whether pod is towed or not)
            setGameState('docking');
            setDockingAnimation({ progress: 0, phase: 'docking' });
          }
        }

        // Handle docking animation
        if (gameState === 'docking' && dockingAnimation) {
          const { progress, phase } = dockingAnimation;
          const newProgress = progress + 0.01;

          if (phase === 'docking') {
            // Phase 1: Pod snaps to restart point
            pod.setPosition(restartPosition.x, restartPosition.y);
            pod.vx = 0;
            pod.vy = 0;
            if (newProgress >= 0.3) {
              setDockingAnimation({ progress: 0.3, phase: 'flying' });
            } else {
              setDockingAnimation({ progress: newProgress, phase: 'docking' });
            }
          } else if (phase === 'flying') {
            // Phase 2: Pod and ship fly up into the sky, camera scrolls up
            const flySpeed = 2;
            pod.y -= flySpeed;
            ship.y -= flySpeed;
            
            // Scroll camera up
            setCamera(prev => ({ ...prev, y: prev.y - flySpeed }));
            
            if (newProgress >= 1.0) {
              // Animation complete, level finished
              setGameState('levelcomplete');
              setDockingAnimation(null);
              if (onLevelComplete) onLevelComplete(currentLevel);
            } else {
              setDockingAnimation({ progress: newProgress, phase: 'flying' });
            }
          }
        }
      }

      // Update bunkers and spawn bullets
      if (gameState === 'playing') {
        const newBullets = [...bullets];
        bunkers.forEach(bunker => {
          const shot = bunker.update(deltaTime, ship.x, ship.y);
          if (shot) {
            newBullets.push(new Bullet(bunker.x, bunker.y, shot.angle, shot.speed));
          }
        });
        setBullets(newBullets);

        // Update player bullets and check collision with bunkers
        setPlayerBullets(prev => {
          return prev.filter(bullet => {
            // Update position
            bullet.x += bullet.vx * deltaTime;
            bullet.y += bullet.vy * deltaTime;

            // Only the ship's own shots can destroy the pod - watch out!
            if (pod && pod.active && !podExploded) {
              const pdx = bullet.x - pod.x;
              const pdy = bullet.y - pod.y;
              if (Math.sqrt(pdx * pdx + pdy * pdy) < 12) {
                setPodExploded(true);
                setPodExplosionTime(performance.now());
                particleSystem.current.spawnExplosion(pod.x, pod.y, 40, '#00ff00');
                pod.active = false;
                return false; // Remove bullet
              }
            }

            // Check collision with bunkers
            let bulletHit = false;
            const newBunkers = bunkers.filter(bunker => {
              const dx = bullet.x - bunker.x;
              const dy = bullet.y - bunker.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 20) {
                bulletHit = true;
                setScore(prev => prev + 50);
                particleSystem.current.spawnExplosion(bunker.x, bunker.y, 10);
                return false; // Remove bunker
              }
              return true;
            });
            setBunkers(newBunkers);

            // Remove bullet if it hit a bunker or is out of bounds
            if (bulletHit) return false;
            if (bullet.x < -100 || bullet.x > level.width * 16 + 100 ||
                bullet.y < -100 || bullet.y > level.height * 16 + 100) {
              return false;
            }
            return true;
          });
        });

        // Update buttons and check collision with ship
        buttons.forEach(button => {
          button.update(deltaTime);
          const dx = ship.x - button.x;
          const dy = ship.y - button.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 15) {
            if (button.press()) {
              // Button pressed, activate all sliders with matching tag
              sliders.forEach(slider => {
                slider.activate();
              });
            }
          }
        });

        // Update sliders
        sliders.forEach(slider => {
          slider.update(deltaTime);
        });

        // Update screen shake
        if (screenShake.intensity > 0) {
          const shakeX = (Math.random() - 0.5) * screenShake.intensity;
          const shakeY = (Math.random() - 0.5) * screenShake.intensity;
          setScreenShake(prev => ({
            x: shakeX,
            y: shakeY,
            intensity: Math.max(0, prev.intensity - 0.5)
          }));
        }

        // Update particles
        particleSystem.current.update(deltaTime);
      }
      } // End of frozen else block

      // Update bullets and check collision with ship
      setBullets(prev => {
        const activeBullets = prev.filter(bullet => {
          if (!bullet.active) return false;
          bullet.update(deltaTime);
          
          // Check collision with ship
          const dx = bullet.x - ship.x;
          const dy = bullet.y - ship.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 15) {
            // Ship hit by bullet = destroy ship
            destroyShip();
            return false;
          }
          
          return true;
        });
        return activeBullets;
      });

      // Lose condition: fuel empty
      if (ship.fuel <= 0) {
        setLives(prev => {
          const newLives = prev - 1;
          if (onLivesChange) onLivesChange(newLives);
          if (newLives <= 0) {
            setGameState('gameover');
            if (onGameOver) onGameOver(score);
          } else {
            // Respawn at restart point with the pod back on its holder
            respawnShipAndPod();
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

      // Update camera to follow ship with smooth interpolation
      if (level) {
        const scaledSize = tileRenderer.current.getScaledTileSize();
        const levelWidth = level.width * scaledSize;
        const levelHeight = level.height * scaledSize;

        // Target camera position (center on ship)
        const targetX = ship.x - width / 2;
        const targetY = ship.y - height / 2;

        // Smooth camera interpolation (lerp)
        const lerpFactor = 0.1;
        const clampedTargetX = Math.max(0, Math.min(targetX, Math.max(0, levelWidth - width)));
        // Allow camera to go above level (sky), but clamp bottom
        const clampedTargetY = Math.min(targetY, Math.max(0, levelHeight - height));
        
        setCamera(prev => ({
          x: prev.x + (clampedTargetX - prev.x) * lerpFactor,
          y: prev.y + (clampedTargetY - prev.y) * lerpFactor
        }));
      }

      // Check if flying into sky (above level top at y=0)
      if (level && tilesetLoaded && gameState === 'playing') {
        // The sky is above the level top (y=0), so the threshold is negative
        const skyThreshold = -SKY_THRESHOLD_OFFSET;
        
        if (ship.y < skyThreshold) {
          // Check if pod is close to ship (within towing distance)
          const podDistance = pod ? Math.sqrt((ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2) : Infinity;
          const podClose = pod && (pod.towed || podDistance < 80);
          if (podClose) {
            // Flying into sky with pod = level complete (guard against multiple triggers)
            if (!levelCompleteTriggered.current) {
              levelCompleteTriggered.current = true;
              setGameState('levelcomplete');
              setDockingAnimation(null);
              if (onLevelComplete) onLevelComplete(currentLevel);
            }
          } else {
            // Flying into sky without pod = lose a life and respawn
            setLives(prev => {
              const newLives = prev - 1;
              if (onLivesChange) onLivesChange(newLives);
              if (newLives <= 0) {
                setGameState('gameover');
                if (onGameOver) onGameOver(score);
              } else {
                // Respawn at restart point with the pod back on its holder
                respawnShipAndPod();
              }
              return newLives;
            });
          }
        }
      }

      // Report fuel to parent
      if (onFuelChange) {
        onFuelChange(ship.fuel);
      }

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Apply screen shake
      ctx.save();
      if (screenShake.intensity > 0) {
        ctx.translate(screenShake.x, screenShake.y);
      }

      // Draw stars in the sky (before level tiles)
      if (level && tilesetLoaded && stars.length > 0) {
        const time = performance.now();
        stars.forEach(star => {
          // Slight flicker around the star's base brightness
          const flicker = 0.85 + 0.15 * Math.sin(time * star.flickerSpeed + star.flickerOffset);
          const alpha = Math.max(0, Math.min(1, star.brightness * flicker));
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x - camera.x, star.y - camera.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw level with camera offset
      if (level && tilesetLoaded) {
        tileRenderer.current.render(ctx, level, -camera.x, -camera.y);
      }

      // Draw ship with camera offset (hidden while exploding)
      if (!isDying) {
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
      }

      // Draw buttons with camera offset
      buttons.forEach(button => {
        ctx.save();
        ctx.translate(button.x - camera.x, button.y - camera.y);
        
        // Button body (green when pressed, blue when not)
        ctx.fillStyle = button.pressed ? '#00ff00' : '#0066ff';
        ctx.fillRect(-8, -8, 16, 16);
        
        // Button outline
        ctx.strokeStyle = button.pressed ? '#00aa00' : '#0044aa';
        ctx.lineWidth = 2;
        ctx.strokeRect(-8, -8, 16, 16);
        
        ctx.restore();
      });

      // Draw sliders with camera offset
      sliders.forEach(slider => {
        ctx.save();
        ctx.translate(slider.x - camera.x, slider.y - camera.y);
        
        // Slider body (orange)
        ctx.fillStyle = '#ff9900';
        ctx.fillRect(-16, -8, 32, 16);
        
        // Slider outline
        ctx.strokeStyle = '#cc6600';
        ctx.lineWidth = 2;
        ctx.strokeRect(-16, -8, 32, 16);
        
        // Movement indicator
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(-4, -4, 8, 8);
        
        ctx.restore();
      });

      // Draw bunkers with camera offset
      bunkers.forEach(bunker => {
        ctx.save();
        ctx.translate(bunker.x - camera.x, bunker.y - camera.y);
        
        // Bunker body (red rectangle)
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(-10, -10, 20, 20);
        
        // Bunker outline
        ctx.strokeStyle = '#aa0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(-10, -10, 20, 20);
        
        // Bunker turret
        ctx.fillStyle = '#cc0000';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw bullets with camera offset
      bullets.forEach(bullet => {
        ctx.save();
        ctx.translate(bullet.x - camera.x, bullet.y - camera.y);
        
        // Bullet (yellow circle)
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bullet glow
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, bullet.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw player bullets with camera offset
      playerBullets.forEach(bullet => {
        ctx.save();
        ctx.translate(bullet.x - camera.x, bullet.y - camera.y);
        
        // Player bullet (cyan circle)
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Player bullet glow
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw the tow tether (visible line between ship and pod when being towed)
      if (pod && pod.active && pod.towed) {
        ctx.save();
        ctx.strokeStyle = '#00ffff'; // Ship color (cyan)
        ctx.lineWidth = POD_TETHER_WIDTH;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ship.x - camera.x, ship.y - camera.y);
        ctx.lineTo(pod.x - camera.x, pod.y - camera.y);
        ctx.stroke();
        ctx.restore();
      }

      // Draw pod with camera offset
      if (pod && pod.active) {
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

        // If pod is close (not yet docked), draw a subtle connection to the pod
        if (beamActive) {
          const distance = Math.sqrt((ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2);
          if (distance < 50) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(ship.x - camera.x, ship.y - camera.y);
            ctx.lineTo(pod.x - camera.x, pod.y - camera.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw fine iridescent tractor beam spiral (down to first obstacle only)
      if (beamActive) {
        const sx = ship.x - camera.x;
        const sy = ship.y - camera.y;
        const length = beamEndY - ship.y;
        if (length > 0) {
          const t = performance.now() / 300;
          ctx.save();
          ctx.lineWidth = 1.2;
          // Two intertwined strands form a delicate helix/spiral
          for (let strand = 0; strand < 2; strand++) {
            ctx.beginPath();
            for (let d = 0; d <= length; d += 3) {
              const phase = d * 0.18 + t + strand * Math.PI;
              const amp = 5 * (1 - (d / length) * 0.25); // gently tapering
              const x = sx + Math.sin(phase) * amp;
              const y = sy + d;
              if (d === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            // Iridescent shifting hue, very low alpha so it is barely perceptible
            const hue = (t * 50 + strand * 140) % 360;
            ctx.strokeStyle = `hsla(${hue}, 95%, 72%, 0.22)`;
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // Restore screen shake
      if (screenShake.intensity > 0) {
        ctx.restore();
      }

      // Render particles
      particleSystem.current.render(ctx, camera.x, camera.y);

      // Draw all touch control buttons (inside canvas).
      // Geometry comes from the shared helper so rendering and hit-testing stay in sync (DRY).
      // Transparent buttons, highlight when active.
      ctx.textAlign = 'center';
      for (const btn of getTouchButtonRects(width, height, screenRatio)) {
        let active = false;
        switch (btn.type) {
          case 'pod': active = touchActive; break;
          case 'thrust': active = thrustActive; break;
          case 'fire': active = fireActive; break;
          case 'rotateLeft': active = rotateLeftActive; break;
          case 'rotateRight': active = rotateRightActive; break;
        }
        ctx.fillStyle = active ? btn.activeColor : btn.color;
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
        ctx.strokeStyle = btn.activeColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
        ctx.fillStyle = '#fff';
        ctx.font = btn.font;
        ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 5);
      }

      // X-axis wrapping based on level width, not canvas width
      // Only wrap if the ship is not colliding with walls at the boundary
      if (level && tilesetLoaded) {
        const levelWidth = level.width * 16; // scaled tile size
        if (ship.x < 0) {
          // Check if there's a wall at the right boundary before wrapping
          const tileAtRight = tileRenderer.current.getTileAt(level, levelWidth - 1, Math.floor(ship.y / 16));
          if (!tileAtRight || [' ', '.'].includes(tileAtRight)) {
            ship.x = levelWidth;
          }
        } else if (ship.x > levelWidth) {
          // Check if there's a wall at the left boundary before wrapping
          const tileAtLeft = tileRenderer.current.getTileAt(level, 0, Math.floor(ship.y / 16));
          if (!tileAtLeft || [' ', '.'].includes(tileAtLeft)) {
            ship.x = 0;
          }
        }
      }

  };

  // Single stable RAF loop for the whole component lifetime.
  // It always calls the latest render logic via renderFnRef, so the loop is never torn down/recreated.
  useEffect(() => {
    let animationId;
    const loop = () => {
      renderFnRef.current();
      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', backgroundColor: '#000' }}
      tabIndex={0}
    />
  );
}
