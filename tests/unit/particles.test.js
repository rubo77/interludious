import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Particle, ParticleSystem } from '../../src/graphics/particles.js';

describe('Particle', () => {
  let particle;
  let mockCtx;

  beforeEach(() => {
    particle = new Particle(100, 200, 1, 2, 30, '#ff0', 5);
    
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      globalAlpha: 1,
      fillStyle: null,
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn()
    };
  });

  it('should create particle with properties', () => {
    expect(particle.x).toBe(100);
    expect(particle.y).toBe(200);
    expect(particle.vx).toBe(1);
    expect(particle.vy).toBe(2);
    expect(particle.life).toBe(30);
    expect(particle.maxLife).toBe(30);
    expect(particle.color).toBe('#ff0');
    expect(particle.size).toBe(5);
    expect(particle.alpha).toBe(1);
  });

  it('should update position and decrease life', () => {
    particle.update();
    expect(particle.x).toBe(101);
    expect(particle.y).toBe(202);
    expect(particle.life).toBe(29);
  });

  it('should update alpha based on life', () => {
    particle.life = 15;
    particle.update();
    expect(particle.alpha).toBeCloseTo(0.5, 1); // 14/30 = 0.466...
  });

  it('should be dead when life reaches 0', () => {
    particle.life = 1;
    particle.update();
    expect(particle.isDead()).toBe(true);
  });

  it('should not be dead when life > 0', () => {
    expect(particle.isDead()).toBe(false);
  });

  it('should render with transformations', () => {
    particle.render(mockCtx);
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.globalAlpha).toBe(1);
    expect(mockCtx.fillStyle).toBe('#ff0');
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should render with alpha', () => {
    particle.life = 15;
    particle.update();
    particle.render(mockCtx);
    expect(mockCtx.globalAlpha).toBeCloseTo(0.5, 1); // 14/30 = 0.466...
  });
});

describe('Particle System', () => {
  let system;

  beforeEach(() => {
    system = new ParticleSystem();
  });

  it('should create empty system', () => {
    expect(system.particles).toHaveLength(0);
  });

  it('should emit particles', () => {
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
    expect(system.particles).toHaveLength(10);
  });

  it('should update all particles', () => {
    const config = {
      speed: 2,
      minSpeed: 1,
      life: 30,
      minLife: 10,
      size: 5,
      minSize: 2,
      color: '#ff0'
    };
    system.emit(100, 200, 5, config);
    const initialLife = system.particles[0].life;
    system.update();
    expect(system.particles[0].life).toBeLessThan(initialLife);
  });

  it('should remove dead particles', () => {
    const config = {
      speed: 2,
      minSpeed: 1,
      life: 0,
      minLife: 1,
      size: 5,
      minSize: 2,
      color: '#ff0'
    };
    system.emit(100, 200, 5, config);
    system.update();
    expect(system.particles).toHaveLength(0);
  });

  it('should render all particles', () => {
    const config = {
      speed: 2,
      minSpeed: 1,
      life: 30,
      minLife: 10,
      size: 5,
      minSize: 2,
      color: '#ff0'
    };
    system.emit(100, 200, 5, config);
    
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
    expect(mockCtx.save).toHaveBeenCalledTimes(5);
  });

  it('should clear all particles', () => {
    const config = {
      speed: 2,
      minSpeed: 1,
      life: 30,
      minLife: 10,
      size: 5,
      minSize: 2,
      color: '#ff0'
    };
    system.emit(100, 200, 5, config);
    system.clear();
    expect(system.particles).toHaveLength(0);
  });

  it('should return particle count', () => {
    const config = {
      speed: 2,
      minSpeed: 1,
      life: 30,
      minLife: 10,
      size: 5,
      minSize: 2,
      color: '#ff0'
    };
    system.emit(100, 200, 7, config);
    expect(system.getParticleCount()).toBe(7);
  });
});
