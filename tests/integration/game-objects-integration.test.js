import { describe, it, expect } from 'vitest';
import { Ship } from '../../src/core/physics.js';
import { createBunker, updateBunkers } from '../../src/game/bunkers.js';
import { ButtonSliderSystem } from '../../src/game/buttons-sliders.js';
import { Button, Slider } from '../../src/game/game-objects.js';
import { createFuel, checkFuelPickup } from '../../src/game/fuel.js';
import { createPod, checkPodPickup, updatePodTowing } from '../../src/game/pod.js';

describe('Game Objects Integration', () => {
  it('should integrate bunkers shooting at ship', () => {
    const ship = new Ship(100, 200);
    const bunkers = [createBunker(100, 300, 1)];
    
    const bullets = updateBunkers(bunkers, ship.x, ship.y);
    
    expect(bullets).toHaveLength(1);
    expect(bullets[0].vy).toBeLessThan(0); // Shoots upward toward ship
  });

  it('should integrate button activating slider', () => {
    const system = new ButtonSliderSystem();
    
    const slider = new Slider(100, 200, 'horizontal', 50);
    slider.id = 'slider1';
    system.addSlider(slider);
    
    const button = new Button(100, 200, 'slider1');
    button.id = 'button1';
    system.addButton(button);
    
    system.update(105, 205); // Ship collides with button
    
    expect(button.pressed).toBe(true);
  });

  it('should integrate fuel pickup with ship', () => {
    const ship = new Ship(100, 200);
    const fuels = [createFuel(105, 205)];
    
    const collected = checkFuelPickup(ship, fuels);
    
    expect(collected).toBe(20);
    expect(fuels[0].active).toBe(false);
  });

  it('should integrate pod pickup and towing', () => {
    const ship = new Ship(100, 200);
    const pod = createPod(150, 250); // Further away to see towing effect
    
    const pickedUp = checkPodPickup(ship, pod);
    expect(pickedUp).toBe(false); // Too far to pickup initially
    
    // Move ship closer for pickup
    ship.x = 140;
    ship.y = 240;
    const pickedUp2 = checkPodPickup(ship, pod);
    expect(pickedUp2).toBe(true);
    expect(pod.towed).toBe(true);
    
    // Move ship further to see towing effect
    ship.x = 100;
    ship.y = 200;
    updatePodTowing(ship, pod);
    expect(pod.x).toBeLessThan(150); // Moves towards ship
  });

  it('should integrate all game objects: bunkers shoot, buttons work, pod tows', () => {
    const ship = new Ship(100, 200);
    
    // Bunkers
    const bunkers = [createBunker(100, 300, 1)];
    const bullets = updateBunkers(bunkers, ship.x, ship.y);
    expect(bullets).toHaveLength(1);
    
    // Buttons/Sliders
    const system = new ButtonSliderSystem();
    const slider = new Slider(100, 200, 'horizontal', 50);
    slider.id = 'slider1';
    system.addSlider(slider);
    const button = new Button(100, 200, 'slider1');
    button.id = 'button1';
    system.addButton(button);
    system.update(105, 205);
    expect(button.pressed).toBe(true);
    
    // Fuel
    const fuels = [createFuel(105, 205)];
    const collected = checkFuelPickup(ship, fuels);
    expect(collected).toBe(20);
    
    // Pod
    const pod = createPod(105, 205);
    checkPodPickup(ship, pod);
    expect(pod.towed).toBe(true);
  });
});
