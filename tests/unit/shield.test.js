import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Shield } from '../../src/graphics/shield.js';

describe('Shield', () => {
  let shield;
  let mockCtx;

  beforeEach(() => {
    shield = new Shield(100, 200, 30);
    
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      globalAlpha: 1,
      strokeStyle: null,
      lineWidth: 2,
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      fillStyle: null,
      fill: vi.fn()
    };
  });

  it('should create shield with position and radius', () => {
    expect(shield.x).toBe(100);
    expect(shield.y).toBe(200);
    expect(shield.radius).toBe(30);
    expect(shield.active).toBe(false);
    expect(shield.alpha).toBe(0);
  });

  it('should activate shield with duration', () => {
    shield.activate(300);
    expect(shield.active).toBe(true);
    expect(shield.alpha).toBe(1);
    expect(shield.duration).toBe(300);
    expect(shield.timer).toBe(300);
  });

  it('should update timer when active', () => {
    shield.activate(300);
    shield.update();
    expect(shield.timer).toBe(299);
  });

  it('should update pulse phase', () => {
    shield.activate(300);
    const initialPhase = shield.pulsePhase;
    shield.update();
    expect(shield.pulsePhase).toBeGreaterThan(initialPhase);
  });

  it('should fade out near end', () => {
    shield.activate(30);
    shield.timer = 20;
    shield.update();
    expect(shield.alpha).toBeLessThan(1);
  });

  it('should deactivate when timer reaches 0', () => {
    shield.activate(10);
    for (let i = 0; i < 10; i++) {
      shield.update();
    }
    expect(shield.active).toBe(false);
    expect(shield.alpha).toBe(0);
  });

  it('should not update when inactive', () => {
    shield.update();
    expect(shield.timer).toBeUndefined();
  });

  it('should render when active', () => {
    shield.activate(300);
    shield.render(mockCtx);
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.strokeStyle).toBe('#0ff');
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should not render when inactive', () => {
    shield.render(mockCtx);
    expect(mockCtx.save).not.toHaveBeenCalled();
  });

  it('should set position', () => {
    shield.setPosition(150, 250);
    expect(shield.x).toBe(150);
    expect(shield.y).toBe(250);
  });

  it('should detect hit when active and within radius', () => {
    shield.activate(300);
    const hit = shield.isHit(110, 210);
    expect(hit).toBe(true);
  });

  it('should not detect hit when inactive', () => {
    const hit = shield.isHit(110, 210);
    expect(hit).toBe(false);
  });

  it('should not detect hit when outside radius', () => {
    shield.activate(300);
    const hit = shield.isHit(200, 300);
    expect(hit).toBe(false);
  });
});
