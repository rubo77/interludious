import { describe, it, expect } from 'vitest';
import { createPod, checkPodPickup, updatePodTowing, releasePod } from '../../src/game/pod.js';
import { Ship } from '../../src/core/physics.js';

describe('Pod', () => {
  describe('createPod', () => {
    it('should create pod', () => {
      const pod = createPod(100, 200);
      expect(pod.x).toBe(100);
      expect(pod.y).toBe(200);
      expect(pod.active).toBe(true);
      expect(pod.towed).toBe(false);
    });
  });

  describe('checkPodPickup', () => {
    it('should detect pod pickup when ship is close', () => {
      const ship = new Ship(100, 200);
      const pod = createPod(105, 205);
      const pickedUp = checkPodPickup(ship, pod);
      expect(pickedUp).toBe(true);
      expect(pod.towed).toBe(true);
    });

    it('should not detect pickup when ship is far', () => {
      const ship = new Ship(100, 200);
      const pod = createPod(300, 400);
      const pickedUp = checkPodPickup(ship, pod);
      expect(pickedUp).toBe(false);
      expect(pod.towed).toBe(false);
    });

    it('should not pickup inactive pod', () => {
      const ship = new Ship(100, 200);
      const pod = createPod(105, 205);
      pod.active = false;
      const pickedUp = checkPodPickup(ship, pod);
      expect(pickedUp).toBe(false);
    });
  });

  describe('updatePodTowing', () => {
    it('should move pod towards ship when towed', () => {
      const ship = new Ship(100, 200);
      const pod = createPod(150, 250);
      pod.towed = true;
      
      updatePodTowing(ship, pod);
      
      expect(pod.x).toBeLessThan(150); // Moves towards ship (100)
      expect(pod.y).toBeLessThan(250); // Moves towards ship (200)
    });

    it('should not move pod when not towed', () => {
      const ship = new Ship(100, 200);
      const pod = createPod(150, 250);
      pod.towed = false;
      
      const initialX = pod.x;
      const initialY = pod.y;
      
      updatePodTowing(ship, pod);
      
      expect(pod.x).toBe(initialX);
      expect(pod.y).toBe(initialY);
    });

    it('should not move inactive pod', () => {
      const ship = new Ship(100, 200);
      const pod = createPod(150, 250);
      pod.towed = true;
      pod.active = false;
      
      const initialX = pod.x;
      const initialY = pod.y;
      
      updatePodTowing(ship, pod);
      
      expect(pod.x).toBe(initialX);
      expect(pod.y).toBe(initialY);
    });

    it('should maintain target distance when close', () => {
      const ship = new Ship(100, 200);
      const pod = createPod(115, 215); // Within target distance
      pod.towed = true;
      
      const initialX = pod.x;
      const initialY = pod.y;
      
      updatePodTowing(ship, pod);
      
      // Should not move much when within target distance
      expect(Math.abs(pod.x - initialX)).toBeLessThan(2);
      expect(Math.abs(pod.y - initialY)).toBeLessThan(2);
    });
  });

  describe('releasePod', () => {
    it('should release towed pod', () => {
      const pod = createPod(100, 200);
      pod.towed = true;
      releasePod(pod);
      expect(pod.towed).toBe(false);
    });
  });
});
