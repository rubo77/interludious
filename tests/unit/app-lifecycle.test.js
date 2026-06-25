import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppLifecycle } from '../../src/native/app-lifecycle.js';

describe('App Lifecycle', () => {
  let lifecycle;
  let mockCapacitorManager;

  beforeEach(() => {
    lifecycle = new AppLifecycle();
    
    mockCapacitorManager = {
      App: vi.fn(() => Promise.resolve({
        addListener: vi.fn(() => Promise.resolve())
      }))
    };
  });

  it('should create lifecycle with active state', () => {
    expect(lifecycle.state).toBe('active');
    expect(lifecycle.listeners).toHaveLength(0);
  });

  it('should initialize with app listener', async () => {
    await lifecycle.init(mockCapacitorManager);
    expect(mockCapacitorManager.App).toHaveBeenCalled();
  });

  it('should handle state change to active', () => {
    lifecycle.handleStateChange({ isActive: true });
    expect(lifecycle.state).toBe('active');
  });

  it('should handle state change to inactive', () => {
    lifecycle.handleStateChange({ isActive: false });
    expect(lifecycle.state).toBe('inactive');
  });

  it('should get current state', () => {
    lifecycle.state = 'inactive';
    expect(lifecycle.getState()).toBe('inactive');
  });

  it('should check if active', () => {
    expect(lifecycle.isActive()).toBe(true);
    lifecycle.state = 'inactive';
    expect(lifecycle.isActive()).toBe(false);
  });

  it('should add listener', () => {
    const callback = vi.fn();
    lifecycle.addListener(callback);
    expect(lifecycle.listeners).toHaveLength(1);
  });

  it('should remove listener', () => {
    const callback = vi.fn();
    lifecycle.addListener(callback);
    lifecycle.removeListener(callback);
    expect(lifecycle.listeners).toHaveLength(0);
  });

  it('should notify listeners on state change', () => {
    const callback = vi.fn();
    lifecycle.addListener(callback);
    
    lifecycle.handleStateChange({ isActive: false });
    
    expect(callback).toHaveBeenCalledWith('inactive');
  });

  it('should destroy lifecycle', () => {
    const callback = vi.fn();
    lifecycle.addListener(callback);
    lifecycle.destroy();
    
    expect(lifecycle.listeners).toHaveLength(0);
  });
});
