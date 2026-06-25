import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameLoop } from '../../src/game/game-loop.js';

describe('Game Loop', () => {
  let loop;
  let mockUpdate;
  let mockRender;

  beforeEach(() => {
    mockUpdate = vi.fn();
    mockRender = vi.fn();
    loop = new GameLoop(mockUpdate, mockRender);
    
    // Mock performance.now and requestAnimationFrame
    global.performance = {
      now: vi.fn(() => 0)
    };
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(() => cb(16), 0);
      return 1;
    });
  });

  it('should create loop with update and render functions', () => {
    expect(loop.update).toBe(mockUpdate);
    expect(loop.render).toBe(mockRender);
    expect(loop.running).toBe(false);
  });

  it('should start loop', () => {
    loop.start();
    expect(loop.running).toBe(true);
  });

  it('should not start if already running', () => {
    loop.start();
    const wasRunning = loop.running;
    loop.start();
    expect(loop.running).toBe(wasRunning);
  });

  it('should stop loop', () => {
    loop.start();
    loop.stop();
    expect(loop.running).toBe(false);
  });

  it('should check if running', () => {
    expect(loop.isRunning()).toBe(false);
    loop.start();
    expect(loop.isRunning()).toBe(true);
  });

  it('should call update when loop runs', (done) => {
    loop.start();
    
    setTimeout(() => {
      expect(mockUpdate).toHaveBeenCalled();
      loop.stop();
      done();
    }, 50);
  });

  it('should call render when loop runs', (done) => {
    loop.start();
    
    setTimeout(() => {
      expect(mockRender).toHaveBeenCalled();
      loop.stop();
      done();
    }, 50);
  });

  it('should use fixed time step', () => {
    expect(loop.timeStep).toBeCloseTo(16.67, 2);
  });

  it('should accumulate delta time', () => {
    global.performance.now = vi.fn(() => 100);
    loop.start();
    expect(loop.lastTime).toBe(100);
  });
});
