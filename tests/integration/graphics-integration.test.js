import { describe, it, expect, vi } from 'vitest';
import { SpriteLoader, Sprite } from '../../src/graphics/sprite-loader.js';
import { ParticleSystem } from '../../src/graphics/particles.js';
import { Shield } from '../../src/graphics/shield.js';
import { TractorBeam } from '../../src/graphics/tractor-beam.js';

describe('Graphics Integration', () => {
  it('should integrate sprite loading and rendering', () => {
    const loader = new SpriteLoader();
    const mockImage = { width: 32, height: 32 };
    loader.loadSprite('ship', mockImage);
    
    const sprite = new Sprite(mockImage, 100, 200, 32, 32);
    
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      globalAlpha: 1,
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn()
    };
    
    sprite.render(mockCtx);
    expect(mockCtx.drawImage).toHaveBeenCalled();
  });

  it('should integrate particle system with emission and rendering', () => {
    const system = new ParticleSystem();
    const config = {
      speed: 2,
      minSpeed: 1,
      life: 30,
      minLife: 10,
      size: 5,
      minSize: 2,
      color: '#ff0'
    };
    
    system.emit(100, 200, 10, config);
    expect(system.getParticleCount()).toBe(10);
    
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      globalAlpha: 1,
      fillStyle: null,
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn()
    };
    
    system.render(mockCtx);
    expect(mockCtx.save).toHaveBeenCalledTimes(10);
  });

  it('should integrate shield activation and rendering', () => {
    const shield = new Shield(100, 200, 30);
    shield.activate(300);
    
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      globalAlpha: 1,
      strokeStyle: null,
      lineWidth: 2,
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      fillStyle: null,
      fill: vi.fn()
    };
    
    shield.render(mockCtx);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('should integrate tractor beam activation and rendering', () => {
    const beam = new TractorBeam();
    beam.activate(100, 200, 150, 250);
    
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      strokeStyle: null,
      lineWidth: 2,
      lineCap: 'round',
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fillStyle: null,
      arc: vi.fn(),
      fill: vi.fn()
    };
    
    beam.render(mockCtx);
    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 200);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(150, 250);
  });

  it('should integrate all graphics systems together', () => {
    // Sprite system
    const loader = new SpriteLoader();
    const mockImage = { width: 32, height: 32 };
    loader.loadSprite('ship', mockImage);
    const sprite = new Sprite(mockImage, 100, 200, 32, 32);
    
    // Particle system
    const particleSystem = new ParticleSystem();
    const config = {
      speed: 2,
      minSpeed: 1,
      life: 30,
      minLife: 10,
      size: 5,
      minSize: 2,
      color: '#ff0'
    };
    particleSystem.emit(100, 200, 5, config);
    
    // Shield
    const shield = new Shield(100, 200, 30);
    shield.activate(300);
    
    // Tractor beam
    const beam = new TractorBeam();
    beam.activate(100, 200, 150, 250);
    
    // All systems should be active
    expect(loader.hasSprite('ship')).toBe(true);
    expect(particleSystem.getParticleCount()).toBe(5);
    expect(shield.active).toBe(true);
    expect(beam.active).toBe(true);
  });
});
