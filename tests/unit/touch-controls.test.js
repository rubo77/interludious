import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TouchControls } from '../../src/input/touch-controls.js';

describe('Touch Controls', () => {
  let controls;
  let mockElement;

  beforeEach(() => {
    controls = new TouchControls();
    mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    
    // Mock window.innerWidth
    global.window = { innerWidth: 800 };
  });

  it('should create controls with no active touches', () => {
    expect(controls.touches.size).toBe(0);
    expect(controls.joystickActive).toBe(false);
    expect(controls.thrustActive).toBe(false);
  });

  it('should initialize with event listeners', () => {
    controls.init(mockElement);
    expect(mockElement.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(mockElement.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(mockElement.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
    expect(mockElement.addEventListener).toHaveBeenCalledWith('touchcancel', expect.any(Function));
  });

  it('should handle touch start', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 100, clientY: 200 }]
    };
    
    controls.handleTouchStart(mockEvent);
    expect(controls.touches.has(1)).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle touch move', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 150, clientY: 250 }]
    };
    
    controls.touches.set(1, { x: 100, y: 200, startX: 100, startY: 200 });
    controls.handleTouchMove(mockEvent);
    
    const touch = controls.touches.get(1);
    expect(touch.x).toBe(150);
    expect(touch.y).toBe(250);
  });

  it('should handle touch end', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 150, clientY: 250 }]
    };
    
    controls.touches.set(1, { x: 100, y: 200, startX: 100, startY: 200 });
    controls.handleTouchEnd(mockEvent);
    
    expect(controls.touches.has(1)).toBe(false);
  });

  it('should activate joystick on left side touch', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 300, clientY: 200 }]
    };
    
    controls.handleTouchStart(mockEvent);
    expect(controls.joystickActive).toBe(true);
  });

  it('should not activate joystick on right side touch', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 500, clientY: 200 }]
    };
    
    controls.handleTouchStart(mockEvent);
    expect(controls.joystickActive).toBe(false);
  });

  it('should activate thrust on right side touch', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 500, clientY: 200 }]
    };
    
    controls.handleTouchStart(mockEvent);
    expect(controls.thrustActive).toBe(true);
  });

  it('should not activate thrust on left side touch', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 300, clientY: 200 }]
    };
    
    controls.handleTouchStart(mockEvent);
    expect(controls.thrustActive).toBe(false);
  });

  it('should get joystick delta', () => {
    controls.joystickActive = true;
    controls.joystickCenter = { x: 100, y: 200 };
    controls.joystickPosition = { x: 130, y: 230 }; // Within max distance
    
    const delta = controls.getJoystickDelta();
    expect(delta.x).toBe(30);
    expect(delta.y).toBe(30);
  });

  it('should clamp joystick delta to max distance', () => {
    controls.joystickActive = true;
    controls.joystickCenter = { x: 100, y: 200 };
    controls.joystickPosition = { x: 200, y: 300 };
    
    const delta = controls.getJoystickDelta();
    const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    expect(distance).toBeLessThanOrEqual(50);
  });

  it('should return zero delta when joystick inactive', () => {
    const delta = controls.getJoystickDelta();
    expect(delta.x).toBe(0);
    expect(delta.y).toBe(0);
  });

  it('should notify listeners on state change', () => {
    const callback = vi.fn();
    controls.addListener(callback);
    
    const mockEvent = {
      preventDefault: vi.fn(),
      changedTouches: [{ identifier: 1, clientX: 300, clientY: 200 }]
    };
    
    controls.handleTouchStart(mockEvent);
    expect(callback).toHaveBeenCalled();
  });

  it('should destroy event listeners', () => {
    controls.init(mockElement);
    controls.destroy(mockElement);
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });
});
