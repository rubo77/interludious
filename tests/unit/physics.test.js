import { describe, it, expect } from 'vitest';
import { Ship } from '../../src/core/physics.js';

describe('Physics Engine', () => {
  describe('Ship', () => {
    it('should create ship with initial position', () => {
      const ship = new Ship(100, 200);
      const pos = ship.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(200);
    });

    it('should have zero initial velocity', () => {
      const ship = new Ship(100, 200);
      const vel = ship.getVelocity();
      expect(vel.vx).toBe(0);
      expect(vel.vy).toBe(0);
    });

    it('should have zero initial angle', () => {
      const ship = new Ship(100, 200);
      expect(ship.getAngle()).toBe(0);
    });

    it('should apply gravity on update', () => {
      const ship = new Ship(100, 200);
      ship.update();
      const vel = ship.getVelocity();
      expect(vel.vy).toBeGreaterThan(0); // Gravity pulls down
    });

    it('should apply thrust when thrusting', () => {
      const ship = new Ship(100, 200);
      ship.thrusting = true;
      ship.update();
      const vel = ship.getVelocity();
      expect(vel.vx).toBeGreaterThan(0); // Thrust in direction of angle (0 = right)
    });

    it('should rotate left when rotatingLeft is true', () => {
      const ship = new Ship(100, 200);
      ship.rotatingLeft = true;
      const initialAngle = ship.getAngle();
      ship.update();
      expect(ship.getAngle()).toBeLessThan(initialAngle);
    });

    it('should rotate right when rotatingRight is true', () => {
      const ship = new Ship(100, 200);
      ship.rotatingRight = true;
      const initialAngle = ship.getAngle();
      ship.update();
      expect(ship.getAngle()).toBeGreaterThan(initialAngle);
    });

    it('should apply friction to velocity', () => {
      const ship = new Ship(100, 200);
      ship.vx = 10;
      ship.vy = 10;
      ship.update();
      const vel = ship.getVelocity();
      expect(Math.abs(vel.vx)).toBeLessThan(10);
      expect(Math.abs(vel.vy)).toBeLessThan(10);
    });

    it('should limit speed to MAX_SPEED', () => {
      const ship = new Ship(100, 200);
      ship.vx = 100;
      ship.vy = 100;
      ship.update();
      const vel = ship.getVelocity();
      const speed = Math.sqrt(vel.vx * vel.vx + vel.vy * vel.vy);
      expect(speed).toBeLessThanOrEqual(5); // MAX_SPEED
    });

    it('should update position based on velocity', () => {
      const ship = new Ship(100, 200);
      ship.vx = 1;
      ship.vy = 1;
      ship.update();
      const pos = ship.getPosition();
      expect(pos.x).toBeCloseTo(100.99, 2); // Friction applied: 1 * 0.99 = 0.99
      expect(pos.y).toBeCloseTo(201.01, 2); // Friction + gravity: 1 * 0.99 + 0.02 = 1.01
    });

    it('should combine gravity and thrust', () => {
      const ship = new Ship(100, 200);
      ship.thrusting = true;
      ship.update();
      const vel = ship.getVelocity();
      expect(vel.vx).toBeGreaterThan(0); // Thrust
      expect(vel.vy).toBeGreaterThan(0); // Gravity
    });

    it('should handle multiple updates', () => {
      const ship = new Ship(100, 200);
      ship.thrusting = true;
      ship.update();
      ship.update();
      ship.update();
      const pos = ship.getPosition();
      expect(pos.x).toBeGreaterThan(100);
      expect(pos.y).toBeGreaterThan(200);
    });
  });
});
