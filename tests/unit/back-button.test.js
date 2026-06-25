import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BackButtonHandler } from '../../src/native/back-button.js';

describe('Back Button Handler', () => {
  let handler;
  let mockCapacitorManager;

  beforeEach(() => {
    handler = new BackButtonHandler();
    
    mockCapacitorManager = {
      isAndroid: vi.fn(() => true),
      App: vi.fn(() => Promise.resolve({
        addListener: vi.fn(() => Promise.resolve())
      }))
    };
  });

  it('should create handler with no listeners', () => {
    expect(handler.listeners).toHaveLength(0);
    expect(handler.enabled).toBe(false);
  });

  it('should initialize on Android', async () => {
    await handler.init(mockCapacitorManager);
    expect(handler.enabled).toBe(true);
  });

  it('should not initialize on non-Android', async () => {
    mockCapacitorManager.isAndroid = vi.fn(() => false);
    await handler.init(mockCapacitorManager);
    expect(handler.enabled).toBe(false);
  });

  it('should add listener', () => {
    const callback = vi.fn(() => false);
    handler.addListener(callback);
    expect(handler.listeners).toHaveLength(1);
  });

  it('should remove listener', () => {
    const callback = vi.fn(() => false);
    handler.addListener(callback);
    handler.removeListener(callback);
    expect(handler.listeners).toHaveLength(0);
  });

  it('should call listeners in order', () => {
    const callback1 = vi.fn(() => false);
    const callback2 = vi.fn(() => false);
    handler.addListener(callback1);
    handler.addListener(callback2);
    
    handler.handleBackButton();
    
    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it('should stop calling listeners when one returns true', () => {
    const callback1 = vi.fn(() => true);
    const callback2 = vi.fn(() => false);
    handler.addListener(callback1);
    handler.addListener(callback2);
    
    handler.handleBackButton();
    
    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  it('should destroy handler', () => {
    const callback = vi.fn(() => false);
    handler.addListener(callback);
    handler.destroy();
    
    expect(handler.listeners).toHaveLength(0);
    expect(handler.enabled).toBe(false);
  });
});
