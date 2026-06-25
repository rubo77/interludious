import { describe, it, expect } from 'vitest';
import { createFuel, checkFuelPickup, updateFuels } from '../../src/game/fuel.js';
import { Ship } from '../../src/core/physics.js';

describe('Fuel', () => {
  describe('createFuel', () => {
    it('should create fuel with default amount', () => {
      const fuel = createFuel(100, 200);
      expect(fuel.x).toBe(100);
      expect(fuel.y).toBe(200);
      expect(fuel.amount).toBe(20);
      expect(fuel.active).toBe(true);
    });

    it('should create fuel with custom amount', () => {
      const fuel = createFuel(100, 200, 50);
      expect(fuel.amount).toBe(50);
    });
  });

  describe('checkFuelPickup', () => {
    it('should detect fuel pickup when ship is close', () => {
      const ship = new Ship(100, 200);
      const fuels = [createFuel(105, 205)];
      const collected = checkFuelPickup(ship, fuels);
      expect(collected).toBe(20);
      expect(fuels[0].active).toBe(false);
    });

    it('should not detect pickup when ship is far', () => {
      const ship = new Ship(100, 200);
      const fuels = [createFuel(300, 400)];
      const collected = checkFuelPickup(ship, fuels);
      expect(collected).toBe(0);
      expect(fuels[0].active).toBe(true);
    });

    it('should collect multiple fuel pickups', () => {
      const ship = new Ship(100, 200);
      const fuels = [
        createFuel(105, 205),
        createFuel(110, 210)
      ];
      const collected = checkFuelPickup(ship, fuels);
      expect(collected).toBe(40);
    });

    it('should not collect inactive fuel', () => {
      const ship = new Ship(100, 200);
      const fuels = [createFuel(105, 205)];
      fuels[0].active = false;
      const collected = checkFuelPickup(ship, fuels);
      expect(collected).toBe(0);
    });

    it('should handle empty fuel array', () => {
      const ship = new Ship(100, 200);
      const fuels = [];
      const collected = checkFuelPickup(ship, fuels);
      expect(collected).toBe(0);
    });
  });

  describe('updateFuels', () => {
    it('should filter out inactive fuels', () => {
      const fuels = [
        createFuel(100, 200),
        createFuel(200, 300)
      ];
      fuels[1].active = false;
      const activeFuels = updateFuels(fuels);
      expect(activeFuels).toHaveLength(1);
      expect(activeFuels[0].x).toBe(100);
    });

    it('should return all fuels when all active', () => {
      const fuels = [
        createFuel(100, 200),
        createFuel(200, 300)
      ];
      const activeFuels = updateFuels(fuels);
      expect(activeFuels).toHaveLength(2);
    });

    it('should return empty array when all inactive', () => {
      const fuels = [
        createFuel(100, 200),
        createFuel(200, 300)
      ];
      fuels[0].active = false;
      fuels[1].active = false;
      const activeFuels = updateFuels(fuels);
      expect(activeFuels).toHaveLength(0);
    });
  });
});
