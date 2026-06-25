// Fuel pickup logic
import { Fuel } from './game-objects.js';

export function createFuel(x, y, amount = 20) {
  return new Fuel(x, y, amount);
}

export function checkFuelPickup(ship, fuels) {
  let fuelCollected = 0;
  
  for (const fuel of fuels) {
    if (!fuel.active) continue;
    
    const distance = Math.sqrt(
      (ship.x - fuel.x) ** 2 + (ship.y - fuel.y) ** 2
    );
    
    if (distance < 15) {
      fuelCollected += fuel.amount;
      fuel.active = false;
    }
  }
  
  return fuelCollected;
}

export function updateFuels(fuels) {
  return fuels.filter(f => f.active);
}
