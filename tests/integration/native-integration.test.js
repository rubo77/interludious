import { describe, it, expect, vi } from 'vitest';
import { BackButtonHandler } from '../../src/native/back-button.js';
import { AppLifecycle } from '../../src/native/app-lifecycle.js';
import { HapticFeedback } from '../../src/native/haptic.js';

describe('Native Features Integration', () => {
  it('should integrate back button with listeners', async () => {
    const handler = new BackButtonHandler();
    const mockCapacitorManager = {
      isAndroid: vi.fn(() => true),
      App: vi.fn(() => Promise.resolve({
        addListener: vi.fn(() => Promise.resolve())
      }))
    };
    
    await handler.init(mockCapacitorManager);
    
    const callback = vi.fn(() => false);
    handler.addListener(callback);
    
    handler.handleBackButton();
    expect(callback).toHaveBeenCalled();
  });

  it('should integrate app lifecycle with state changes', async () => {
    const lifecycle = new AppLifecycle();
    const mockCapacitorManager = {
      App: vi.fn(() => Promise.resolve({
        addListener: vi.fn(() => Promise.resolve())
      }))
    };
    
    await lifecycle.init(mockCapacitorManager);
    
    const callback = vi.fn();
    lifecycle.addListener(callback);
    
    lifecycle.handleStateChange({ isActive: false });
    expect(callback).toHaveBeenCalledWith('inactive');
  });

  it('should integrate haptic feedback with impact', async () => {
    const haptic = new HapticFeedback();
    const mockCapacitorManager = {
      isNativePlatform: vi.fn(() => true),
      Haptics: vi.fn(() => Promise.resolve({
        impact: vi.fn(() => Promise.resolve())
      }))
    };
    
    await haptic.init(mockCapacitorManager);
    await haptic.impact('medium');
    expect(haptic.Haptics.impact).toHaveBeenCalled();
  });

  it('should integrate all native features together', async () => {
    // Back button
    const handler = new BackButtonHandler();
    const mockCapacitorManager = {
      isAndroid: vi.fn(() => true),
      isNativePlatform: vi.fn(() => true),
      App: vi.fn(() => Promise.resolve({
        addListener: vi.fn(() => Promise.resolve())
      })),
      Haptics: vi.fn(() => Promise.resolve({
        impact: vi.fn(() => Promise.resolve())
      }))
    };
    
    await handler.init(mockCapacitorManager);
    
    // App lifecycle
    const lifecycle = new AppLifecycle();
    await lifecycle.init(mockCapacitorManager);
    
    // Haptic
    const haptic = new HapticFeedback();
    await haptic.init(mockCapacitorManager);
    
    // All systems should be active
    expect(handler.enabled).toBe(true);
    expect(lifecycle.state).toBe('active');
    expect(haptic.enabled).toBe(true);
  });
});
