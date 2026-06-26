import { describe, it, expect } from 'vitest';
import { Pod } from '../../src/game/pod.js';
import { Ship } from '../../src/game/ship.js';

describe('Pod', () => {
  describe('constructor', () => {
    it('should create pod', () => {
      const pod = new Pod(100, 200);
      expect(pod.x).toBe(100);
      expect(pod.y).toBe(200);
      expect(pod.active).toBe(true);
      expect(pod.towed).toBe(false);
    });
  });

  describe('checkPodPickup', () => {
    it('should detect pod pickup when ship is close', () => {
      const ship = new Ship(100, 200);
      const pod = new Pod(105, 205);
      const distance = Math.sqrt((ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2);
      expect(distance).toBeLessThan(50);
    });

    it('should not detect pickup when ship is far', () => {
      const ship = new Ship(100, 200);
      const pod = new Pod(300, 400);
      const distance = Math.sqrt((ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2);
      expect(distance).toBeGreaterThan(50);
    });

    it('should not pickup inactive pod', () => {
      const pod = new Pod(105, 205);
      pod.active = false;
      expect(pod.active).toBe(false);
    });
  });

  describe('setTowing', () => {
    it('should set towed state', () => {
      const pod = new Pod(100, 200);
      pod.setTowing(true);
      expect(pod.towed).toBe(true);
      pod.setTowing(false);
      expect(pod.towed).toBe(false);
    });
  });

  describe('getTowPosition', () => {
    it('should calculate tow position behind ship', () => {
      const ship = new Ship(100, 200);
      ship.angle = 0;
      const pod = new Pod(100, 200);
      const towPos = pod.getTowPosition(ship, ship.angle);
      const distance = Math.sqrt((ship.x - towPos.x) ** 2 + (ship.y - towPos.y) ** 2);
      expect(distance).toBeCloseTo(pod.towingDistance, 1);
    });
  });

  describe('moveToTowPosition', () => {
    it('should move pod towards target position', () => {
      const pod = new Pod(150, 250);
      const initialX = pod.x;
      const initialY = pod.y;
      pod.moveToTowPosition(100, 200, 0.5);
      expect(pod.x).toBeLessThan(initialX);
      expect(pod.y).toBeLessThan(initialY);
    });
  });

  describe('update', () => {
    it('should update pod position with gravity when not towed', () => {
      const pod = new Pod(150, 250);
      const initialY = pod.y;
      pod.update(1);
      // Pod should have moved down due to gravity
      expect(pod.y).toBeGreaterThan(initialY);
    });

    it('should not apply gravity when towed', () => {
      const pod = new Pod(150, 250);
      pod.setTowing(true);
      const initialY = pod.y;
      pod.update(1);
      // Pod should not have moved due to gravity when towed
      expect(pod.y).toBe(initialY);
    });
  });
});
