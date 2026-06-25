import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CapacitorManager } from '../../src/capacitor/capacitor-manager.js';

describe('Capacitor Manager', () => {
  let manager;
  let mockCapacitor;

  beforeEach(() => {
    // Mock Capacitor
    mockCapacitor = {
      isNativePlatform: vi.fn(() => false),
      getPlatform: vi.fn(() => 'web')
    };
    
    manager = new CapacitorManager(mockCapacitor);
  });

  it('should create manager with platform info', () => {
    expect(manager.isNative).toBe(false);
    expect(manager.platform).toBe('web');
  });

  it('should check if native platform', () => {
    expect(manager.isNativePlatform()).toBe(false);
  });

  it('should get platform', () => {
    expect(manager.getPlatform()).toBe('web');
  });

  it('should check if android', () => {
    expect(manager.isAndroid()).toBe(false);
  });

  it('should check if iOS', () => {
    expect(manager.isIOS()).toBe(false);
  });

  it('should check if web', () => {
    expect(manager.isWeb()).toBe(true);
  });

  it('should detect android platform', () => {
    const androidCapacitor = {
      isNativePlatform: vi.fn(() => true),
      getPlatform: vi.fn(() => 'android')
    };
    const androidManager = new CapacitorManager(androidCapacitor);
    expect(androidManager.isAndroid()).toBe(true);
    expect(androidManager.isWeb()).toBe(false);
  });

  it('should detect iOS platform', () => {
    const iosCapacitor = {
      isNativePlatform: vi.fn(() => true),
      getPlatform: vi.fn(() => 'ios')
    };
    const iosManager = new CapacitorManager(iosCapacitor);
    expect(iosManager.isIOS()).toBe(true);
    expect(iosManager.isWeb()).toBe(false);
  });

  it('should detect native platform', () => {
    const nativeCapacitor = {
      isNativePlatform: vi.fn(() => true),
      getPlatform: vi.fn(() => 'ios')
    };
    const nativeManager = new CapacitorManager(nativeCapacitor);
    expect(nativeManager.isNativePlatform()).toBe(true);
  });

  it('should handle plugin load failure gracefully', async () => {
    const plugin = await manager.loadPlugin('nonexistent');
    expect(plugin).toBeNull();
  });

  it('should load SplashScreen plugin', async () => {
    const splashScreen = await manager.SplashScreen();
    expect(splashScreen).toBeDefined();
  });

  it('should load StatusBar plugin', async () => {
    const statusBar = await manager.StatusBar();
    expect(statusBar).toBeDefined();
  });

  it('should load App plugin', async () => {
    const app = await manager.App();
    expect(app).toBeDefined();
  });

  it('should load Device plugin', async () => {
    const device = await manager.Device();
    expect(device).toBeDefined();
  });
});
