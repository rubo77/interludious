import { describe, it, expect } from 'vitest';
import { createBunker, updateBunkers } from '../../src/game/bunkers.js';

describe('Bunkers', () => {
  describe('createBunker', () => {
    it('should create bunker type 1 with default config', () => {
      const bunker = createBunker(100, 200, 1);
      expect(bunker.x).toBe(100);
      expect(bunker.y).toBe(200);
      expect(bunker.type).toBe(1);
      expect(bunker.shootInterval).toBe(120);
      expect(bunker.bulletSpeed).toBe(2);
      expect(bunker.color).toBe('#f00');
    });

    it('should create bunker type 2 with faster shooting', () => {
      const bunker = createBunker(100, 200, 2);
      expect(bunker.shootInterval).toBe(90);
      expect(bunker.bulletSpeed).toBe(3);
      expect(bunker.color).toBe('#0f0');
    });

    it('should create bunker type 3 with even faster shooting', () => {
      const bunker = createBunker(100, 200, 3);
      expect(bunker.shootInterval).toBe(60);
      expect(bunker.bulletSpeed).toBe(4);
      expect(bunker.color).toBe('#00f');
    });

    it('should create bunker type 4 with fastest shooting', () => {
      const bunker = createBunker(100, 200, 4);
      expect(bunker.shootInterval).toBe(30);
      expect(bunker.bulletSpeed).toBe(5);
      expect(bunker.color).toBe('#ff0');
    });

    it('should default to type 1 for invalid type', () => {
      const bunker = createBunker(100, 200, 99);
      expect(bunker.shootInterval).toBe(120);
      expect(bunker.bulletSpeed).toBe(2);
    });
  });

  describe('updateBunkers', () => {
    it('should update bunker cooldowns', () => {
      const bunkers = [createBunker(100, 200, 1)];
      bunkers[0].shootCooldown = 10;
      updateBunkers(bunkers, 150, 250);
      expect(bunkers[0].shootCooldown).toBe(9);
    });

    it('should not shoot when ship is out of range', () => {
      const bunkers = [createBunker(100, 200, 1)];
      const bullets = updateBunkers(bunkers, 500, 500);
      expect(bullets).toHaveLength(0);
    });

    it('should shoot when ship is in range', () => {
      const bunkers = [createBunker(100, 200, 1)];
      const bullets = updateBunkers(bunkers, 150, 250);
      expect(bullets).toHaveLength(1);
    });

    it('should shoot towards ship', () => {
      const bunkers = [createBunker(100, 200, 1)];
      const bullets = updateBunkers(bunkers, 150, 250);
      expect(bullets[0].vx).toBeGreaterThan(0);
      expect(bullets[0].vy).toBeGreaterThan(0);
    });

    it('should not shoot when bunker is inactive', () => {
      const bunkers = [createBunker(100, 200, 1)];
      bunkers[0].active = false;
      const bullets = updateBunkers(bunkers, 150, 250);
      expect(bullets).toHaveLength(0);
    });

    it('should handle multiple bunkers', () => {
      const bunkers = [
        createBunker(100, 200, 1),
        createBunker(200, 200, 1)
      ];
      const bullets = updateBunkers(bunkers, 150, 250);
      expect(bullets.length).toBeGreaterThan(0);
    });

    it('should set cooldown after shooting', () => {
      const bunkers = [createBunker(100, 200, 1)];
      updateBunkers(bunkers, 150, 250);
      expect(bunkers[0].shootCooldown).toBe(120);
    });
  });
});
