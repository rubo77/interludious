import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpriteLoader, Sprite } from '../../src/graphics/sprite-loader.js';

describe('Sprite Loader', () => {
  let loader;

  beforeEach(() => {
    loader = new SpriteLoader();
  });

  it('should create empty loader', () => {
    expect(loader.sprites.size).toBe(0);
  });

  it('should load sprite', () => {
    const imageData = { width: 32, height: 32 };
    loader.loadSprite('ship', imageData);
    expect(loader.hasSprite('ship')).toBe(true);
  });

  it('should get loaded sprite', () => {
    const imageData = { width: 32, height: 32 };
    loader.loadSprite('ship', imageData);
    const sprite = loader.getSprite('ship');
    expect(sprite).toBe(imageData);
  });

  it('should return undefined for non-existent sprite', () => {
    const sprite = loader.getSprite('nonexistent');
    expect(sprite).toBeUndefined();
  });

  it('should check if sprite exists', () => {
    const imageData = { width: 32, height: 32 };
    loader.loadSprite('ship', imageData);
    expect(loader.hasSprite('ship')).toBe(true);
    expect(loader.hasSprite('nonexistent')).toBe(false);
  });

  it('should clear all sprites', () => {
    const imageData = { width: 32, height: 32 };
    loader.loadSprite('ship', imageData);
    loader.clear();
    expect(loader.sprites.size).toBe(0);
  });
});

describe('Sprite', () => {
  let sprite;
  let mockImage;
  let mockCtx;

  beforeEach(() => {
    mockImage = { width: 32, height: 32 };
    sprite = new Sprite(mockImage, 100, 200, 32, 32);
    
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      globalAlpha: 1,
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn()
    };
  });

  it('should create sprite with image and position', () => {
    expect(sprite.image).toBe(mockImage);
    expect(sprite.x).toBe(100);
    expect(sprite.y).toBe(200);
    expect(sprite.width).toBe(32);
    expect(sprite.height).toBe(32);
    expect(sprite.rotation).toBe(0);
    expect(sprite.scale).toBe(1);
    expect(sprite.alpha).toBe(1);
  });

  it('should set position', () => {
    sprite.setPosition(150, 250);
    expect(sprite.x).toBe(150);
    expect(sprite.y).toBe(250);
  });

  it('should set rotation', () => {
    sprite.setRotation(Math.PI / 2);
    expect(sprite.rotation).toBe(Math.PI / 2);
  });

  it('should set scale', () => {
    sprite.setScale(2);
    expect(sprite.scale).toBe(2);
  });

  it('should set alpha', () => {
    sprite.setAlpha(0.5);
    expect(sprite.alpha).toBe(0.5);
  });

  it('should render with transformations', () => {
    sprite.render(mockCtx);
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.globalAlpha).toBe(1);
    expect(mockCtx.translate).toHaveBeenCalledWith(100, 200);
    expect(mockCtx.rotate).toHaveBeenCalledWith(0);
    expect(mockCtx.scale).toHaveBeenCalledWith(1, 1);
    expect(mockCtx.drawImage).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should render with rotation', () => {
    sprite.setRotation(Math.PI / 4);
    sprite.render(mockCtx);
    expect(mockCtx.rotate).toHaveBeenCalledWith(Math.PI / 4);
  });

  it('should render with scale', () => {
    sprite.setScale(2);
    sprite.render(mockCtx);
    expect(mockCtx.scale).toHaveBeenCalledWith(2, 2);
  });

  it('should render with alpha', () => {
    sprite.setAlpha(0.5);
    sprite.render(mockCtx);
    expect(mockCtx.globalAlpha).toBe(0.5);
  });
});
