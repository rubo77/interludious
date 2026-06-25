import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HapticFeedback } from '../../src/native/haptic.js';

describe('Haptic Feedback', () => {
  let haptic;
  let mockCapacitorManager;

  beforeEach(() => {
    haptic = new HapticFeedback();
    
    mockCapacitorManager = {
      isNativePlatform: vi.fn(() => true),
      Haptics: vi.fn(() => Promise.resolve({
        impact: vi.fn(() => Promise.resolve()),
        notification: vi.fn(() => Promise.resolve()),
        selectionChanged: vi.fn(() => Promise.resolve()),
        selectionStart: vi.fn(() => Promise.resolve()),
        selectionEnd: vi.fn(() => Promise.resolve())
      }))
    };
  });

  it('should create haptic with disabled state', () => {
    expect(haptic.enabled).toBe(false);
  });

  it('should initialize on native platform', async () => {
    await haptic.init(mockCapacitorManager);
    expect(haptic.enabled).toBe(true);
  });

  it('should not initialize on web platform', async () => {
    mockCapacitorManager.isNativePlatform = vi.fn(() => false);
    await haptic.init(mockCapacitorManager);
    expect(haptic.enabled).toBe(false);
  });

  it('should trigger impact', async () => {
    await haptic.init(mockCapacitorManager);
    await haptic.impact('medium');
    expect(haptic.Haptics.impact).toHaveBeenCalledWith({ style: 'medium' });
  });

  it('should trigger notification', async () => {
    await haptic.init(mockCapacitorManager);
    await haptic.notification('success');
    expect(haptic.Haptics.notification).toHaveBeenCalledWith({ type: 'success' });
  });

  it('should trigger selection changed', async () => {
    await haptic.init(mockCapacitorManager);
    await haptic.selectionChanged();
    expect(haptic.Haptics.selectionChanged).toHaveBeenCalled();
  });

  it('should trigger selection start', async () => {
    await haptic.init(mockCapacitorManager);
    await haptic.selectionStart();
    expect(haptic.Haptics.selectionStart).toHaveBeenCalled();
  });

  it('should trigger selection end', async () => {
    await haptic.init(mockCapacitorManager);
    await haptic.selectionEnd();
    expect(haptic.Haptics.selectionEnd).toHaveBeenCalled();
  });

  it('should not trigger when disabled', async () => {
    await haptic.impact('medium');
    expect(mockCapacitorManager.Haptics).not.toHaveBeenCalled();
  });

  it('should check if enabled', () => {
    expect(haptic.isEnabled()).toBe(false);
    haptic.enabled = true;
    expect(haptic.isEnabled()).toBe(true);
  });
});
