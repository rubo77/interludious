import { describe, it, expect, vi } from 'vitest';
import { TouchControls } from '../../src/input/touch-controls.js';
import { GravitySensor } from '../../src/input/gravity-sensor.js';
import { ResponsiveCanvas } from '../../src/ui/responsive-canvas.js';

describe('Mobile Integration', () => {
  it('should integrate touch controls with game state', () => {
    const controls = new TouchControls();
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    
    global.window = { innerWidth: 800 };
    controls.init(mockElement);
    
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 300, clientY: 200 }]
    };
    
    controls.handleTouchStart(mockEvent);
    
    expect(controls.joystickActive).toBe(true);
    expect(controls.thrustActive).toBe(false);
  });

  it('should integrate gravity sensor with ship rotation', async () => {
    const sensor = new GravitySensor();
    
    global.DeviceOrientationEvent = {
      requestPermission: vi.fn(() => Promise.resolve('granted'))
    };
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    
    await sensor.init();
    
    const mockEvent = {
      alpha: 45,
      beta: 30,
      gamma: 15
    };
    
    sensor.handleOrientation(mockEvent);
    
    const rotation = sensor.getRotation();
    expect(rotation).toBeCloseTo(0.262, 3); // 15 degrees in radians
  });

  it('should integrate responsive canvas with container', () => {
    const mockCanvas = {
      width: 0,
      height: 0,
      style: { width: '', height: '' }
    };
    
    const mockContainer = {
      clientWidth: 800,
      clientHeight: 600
    };
    
    global.ResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn()
    }));
    
    const responsiveCanvas = new ResponsiveCanvas(mockCanvas, mockContainer);
    responsiveCanvas.init();
    
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
  });

  it('should integrate all mobile features together', async () => {
    // Touch controls
    const controls = new TouchControls();
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    global.window = { innerWidth: 800 };
    controls.init(mockElement);
    
    // Gravity sensor
    const sensor = new GravitySensor();
    global.DeviceOrientationEvent = {
      requestPermission: vi.fn(() => Promise.resolve('granted'))
    };
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      innerWidth: 800
    };
    await sensor.init();
    
    // Responsive canvas
    const mockCanvas = {
      width: 0,
      height: 0,
      style: { width: '', height: '' }
    };
    const mockContainer = {
      clientWidth: 800,
      clientHeight: 600
    };
    global.ResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn()
    }));
    const responsiveCanvas = new ResponsiveCanvas(mockCanvas, mockContainer);
    responsiveCanvas.init();
    
    // All systems should be active
    expect(controls.touches.size).toBe(0);
    expect(sensor.enabled).toBe(true);
    expect(mockCanvas.width).toBe(800);
  });
});
