import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GravitySensor } from '../../src/input/gravity-sensor.js';

describe('Gravity Sensor', () => {
  let sensor;

  beforeEach(() => {
    sensor = new GravitySensor();
    
    // Mock DeviceOrientationEvent
    global.DeviceOrientationEvent = {
      requestPermission: vi.fn(() => Promise.resolve('granted'))
    };
    
    // Mock window.addEventListener
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
  });

  it('should create sensor with default values', () => {
    expect(sensor.enabled).toBe(false);
    expect(sensor.alpha).toBe(0);
    expect(sensor.beta).toBe(0);
    expect(sensor.gamma).toBe(0);
  });

  it('should initialize with permission request', async () => {
    await sensor.init();
    expect(DeviceOrientationEvent.requestPermission).toHaveBeenCalled();
    expect(sensor.enabled).toBe(true);
  });

  it('should initialize without permission on non-iOS', async () => {
    delete DeviceOrientationEvent.requestPermission;
    
    await sensor.init();
    expect(sensor.enabled).toBe(true);
  });

  it('should handle orientation event', () => {
    const mockEvent = {
      alpha: 45,
      beta: 30,
      gamma: 15
    };
    
    sensor.handleOrientation(mockEvent);
    expect(sensor.alpha).toBe(45);
    expect(sensor.beta).toBe(30);
    expect(sensor.gamma).toBe(15);
  });

  it('should handle orientation event with null values', () => {
    const mockEvent = {
      alpha: null,
      beta: null,
      gamma: null
    };
    
    sensor.handleOrientation(mockEvent);
    expect(sensor.alpha).toBe(0);
    expect(sensor.beta).toBe(0);
    expect(sensor.gamma).toBe(0);
  });

  it('should convert gamma to rotation in radians', () => {
    sensor.gamma = 45;
    const rotation = sensor.getRotation();
    expect(rotation).toBeCloseTo(0.785, 3); // 45 degrees in radians
  });

  it('should return tilt from beta', () => {
    sensor.beta = 30;
    const tilt = sensor.getTilt();
    expect(tilt).toBe(30);
  });

  it('should check if enabled', () => {
    expect(sensor.isEnabled()).toBe(false);
    sensor.enabled = true;
    expect(sensor.isEnabled()).toBe(true);
  });

  it('should notify listeners on orientation change', () => {
    const callback = vi.fn();
    sensor.addListener(callback);
    
    const mockEvent = {
      alpha: 45,
      beta: 30,
      gamma: 15
    };
    
    sensor.handleOrientation(mockEvent);
    expect(callback).toHaveBeenCalled();
  });

  it('should destroy and remove event listener', () => {
    sensor.enabled = true;
    sensor.destroy();
    expect(sensor.enabled).toBe(false);
    expect(window.removeEventListener).toHaveBeenCalled();
  });

  it('should handle permission denial', async () => {
    DeviceOrientationEvent.requestPermission = vi.fn(() => Promise.reject('denied'));
    
    await sensor.init();
    expect(sensor.enabled).toBe(false);
  });

  it('should handle missing DeviceOrientationEvent', async () => {
    delete global.DeviceOrientationEvent;
    
    await sensor.init();
    expect(sensor.enabled).toBe(false);
  });
});
