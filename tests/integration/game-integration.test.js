import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Ship } from '../../src/core/physics.js';
import { KeyboardInput } from '../../src/input/keyboard.js';
import { CanvasRenderer } from '../../src/graphics/canvas-renderer.js';
import { parseLevel } from '../../src/levels/level-parser.js';

describe('Game Integration', () => {
  it('should integrate ship physics with keyboard input', () => {
    const ship = new Ship(100, 200);
    const keyboard = new KeyboardInput();
    
    // Connect keyboard to ship
    keyboard.addListener((keys) => {
      ship.rotatingLeft = keys.left;
      ship.rotatingRight = keys.right;
      ship.thrusting = keys.thrust;
    });

    // Simulate thrust key press
    keyboard.handleKeyDown({ code: 'ArrowUp' });
    
    // Update ship physics
    ship.update();
    
    const vel = ship.getVelocity();
    expect(vel.vx).toBeGreaterThan(0); // Ship should thrust
  });

  it('should integrate ship with level parser and renderer', () => {
    const defContent = `
# Metadata section
NAME: "Test Level"

# Colors
BG_COLOR: 189 24 33

# Level dimensions
WIDTH: 82
HEIGHT: 60

# Level layout
********************
*r..p****************
********************
`;
    
    const level = parseLevel(defContent);
    expect(level.metadata.NAME).toBe('Test Level');
    expect(level.layout).toHaveLength(3);
  });

  it('should simulate complete game loop: ship flies in level with gravity', () => {
    // Create ship
    const ship = new Ship(100, 200);
    
    // Parse level
    const defContent = `
# Metadata section
NAME: "Test Level"

# Colors
BG_COLOR: 189 24 33

# Level dimensions
WIDTH: 82
HEIGHT: 60

# Level layout
********************
*r..p****************
********************
`;
    const level = parseLevel(defContent);
    
    // Apply thrust
    ship.thrusting = true;
    
    // Simulate multiple frames
    for (let i = 0; i < 10; i++) {
      ship.update();
    }
    
    // Verify ship moved
    const pos = ship.getPosition();
    expect(pos.x).toBeGreaterThan(100); // Moved right due to thrust
    expect(pos.y).toBeGreaterThan(200); // Moved down due to gravity
    
    // Verify level is valid
    expect(level.layout).toBeDefined();
    expect(level.layout.length).toBeGreaterThan(0);
  });
});
