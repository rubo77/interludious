import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CanvasRenderer } from '../../src/graphics/canvas-renderer.js';

describe('Canvas Renderer', () => {
  let canvas;
  let renderer;
  let mockCtx;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    // Mock canvas context since jsdom doesn't support 2D context
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: null,
      getImageData: vi.fn(() => ({ data: [0, 0, 0, 0] }))
    };
    
    canvas.getContext = vi.fn(() => mockCtx);
    renderer = new CanvasRenderer(canvas);
  });

  it('should create renderer with canvas context', () => {
    expect(renderer.canvas).toBe(canvas);
    expect(renderer.ctx).toBe(mockCtx);
    expect(renderer.width).toBe(800);
    expect(renderer.height).toBe(600);
  });

  it('should clear canvas', () => {
    renderer.clear();
    expect(mockCtx.fillStyle).toBe('#000');
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
  });

  it('should draw ship at position', () => {
    const ship = {
      getPosition: () => ({ x: 100, y: 100 }),
      getAngle: () => 0,
      thrusting: false
    };
    renderer.drawShip(ship);
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.translate).toHaveBeenCalledWith(100, 100);
    expect(mockCtx.rotate).toHaveBeenCalledWith(0);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should draw ship with rotation', () => {
    const ship = {
      getPosition: () => ({ x: 100, y: 100 }),
      getAngle: () => Math.PI / 2,
      thrusting: false
    };
    renderer.drawShip(ship);
    expect(mockCtx.rotate).toHaveBeenCalledWith(Math.PI / 2);
  });

  it('should draw engine flame when thrusting', () => {
    const ship = {
      getPosition: () => ({ x: 100, y: 100 }),
      getAngle: () => 0,
      thrusting: true
    };
    renderer.drawShip(ship);
    expect(mockCtx.fillStyle).toBe('#ff0'); // Flame color
  });

  it('should draw level layout', () => {
    const level = {
      layout: ['****', 'r..p']
    };
    renderer.drawLevel(level);
    expect(mockCtx.fillRect).toHaveBeenCalled();
  });

  it('should handle empty level layout', () => {
    const level = { layout: [] };
    expect(() => renderer.drawLevel(level)).not.toThrow();
  });

  it('should render ship and level together', () => {
    const ship = {
      getPosition: () => ({ x: 100, y: 100 }),
      getAngle: () => 0,
      thrusting: false
    };
    const level = {
      layout: ['****']
    };
    renderer.render(ship, level);
    expect(mockCtx.fillRect).toHaveBeenCalled(); // clear
    expect(mockCtx.save).toHaveBeenCalled(); // drawShip
  });
});
