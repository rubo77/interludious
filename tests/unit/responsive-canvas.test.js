import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResponsiveCanvas } from '../../src/ui/responsive-canvas.js';

describe('Responsive Canvas', () => {
  let responsiveCanvas;
  let mockCanvas;
  let mockContainer;

  beforeEach(() => {
    mockCanvas = {
      width: 0,
      height: 0,
      style: { width: '', height: '' }
    };
    
    mockContainer = {
      clientWidth: 800,
      clientHeight: 600
    };
    
    // Mock ResizeObserver
    global.ResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn()
    }));
    
    responsiveCanvas = new ResponsiveCanvas(mockCanvas, mockContainer);
  });

  it('should create responsive canvas with aspect ratio', () => {
    expect(responsiveCanvas.canvas).toBe(mockCanvas);
    expect(responsiveCanvas.container).toBe(mockContainer);
    expect(responsiveCanvas.aspectRatio).toBe(4 / 3);
  });

  it('should initialize with resize observer', () => {
    responsiveCanvas.init();
    expect(ResizeObserver).toHaveBeenCalled();
    expect(mockContainer.clientWidth).toBe(800);
  });

  it('should resize canvas to fit container width', () => {
    mockContainer.clientWidth = 800;
    mockContainer.clientHeight = 600;
    responsiveCanvas.resize();
    
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
  });

  it('should resize canvas to fit container height when container is wider', () => {
    mockContainer.clientWidth = 1000;
    mockContainer.clientHeight = 600;
    responsiveCanvas.resize();
    
    expect(mockCanvas.width).toBe(800); // 600 * 4/3
    expect(mockCanvas.height).toBe(600);
  });

  it('should resize canvas to fit container width when container is taller', () => {
    mockContainer.clientWidth = 400;
    mockContainer.clientHeight = 600;
    responsiveCanvas.resize();
    
    expect(mockCanvas.width).toBe(400);
    expect(mockCanvas.height).toBe(300); // 400 / (4/3)
  });

  it('should set canvas style dimensions', () => {
    responsiveCanvas.resize();
    expect(mockCanvas.style.width).toBeDefined();
    expect(mockCanvas.style.height).toBeDefined();
  });

  it('should set custom aspect ratio', () => {
    responsiveCanvas.setAspectRatio(16 / 9);
    expect(responsiveCanvas.aspectRatio).toBeCloseTo(1.78, 2);
  });

  it('should destroy resize observer', () => {
    responsiveCanvas.init();
    responsiveCanvas.destroy();
    // ResizeObserver disconnect should be called
  });

  it('should get canvas width', () => {
    mockCanvas.width = 800;
    expect(responsiveCanvas.getWidth()).toBe(800);
  });

  it('should get canvas height', () => {
    mockCanvas.height = 600;
    expect(responsiveCanvas.getHeight()).toBe(600);
  });
});
