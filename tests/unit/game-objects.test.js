import { describe, it, expect } from 'vitest';
import { Bullet, Fragment, Thing, Slider, Button, Bunker, Fuel, Pod } from '../../src/game/game-objects.js';

describe('Game Objects', () => {
  describe('Bullet', () => {
    it('should create bullet with position and velocity', () => {
      const bullet = new Bullet(100, 200, 1, 2);
      expect(bullet.x).toBe(100);
      expect(bullet.y).toBe(200);
      expect(bullet.vx).toBe(1);
      expect(bullet.vy).toBe(2);
      expect(bullet.active).toBe(true);
    });

    it('should update position based on velocity', () => {
      const bullet = new Bullet(100, 200, 1, 2);
      bullet.update();
      expect(bullet.x).toBe(101);
      expect(bullet.y).toBe(202);
    });

    it('should return current position', () => {
      const bullet = new Bullet(100, 200, 1, 2);
      const pos = bullet.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(200);
    });
  });

  describe('Fragment', () => {
    it('should create fragment with life', () => {
      const fragment = new Fragment(100, 200, 1, 2, 30);
      expect(fragment.x).toBe(100);
      expect(fragment.y).toBe(200);
      expect(fragment.life).toBe(30);
      expect(fragment.maxLife).toBe(30);
    });

    it('should update position and decrease life', () => {
      const fragment = new Fragment(100, 200, 1, 2, 30);
      fragment.update();
      expect(fragment.x).toBe(101);
      expect(fragment.y).toBe(202);
      expect(fragment.life).toBe(29);
    });

    it('should be dead when life reaches 0', () => {
      const fragment = new Fragment(100, 200, 1, 2, 1);
      fragment.update();
      expect(fragment.isDead()).toBe(true);
    });

    it('should not be dead when life > 0', () => {
      const fragment = new Fragment(100, 200, 1, 2, 10);
      expect(fragment.isDead()).toBe(false);
    });
  });

  describe('Thing', () => {
    it('should create thing with type and position', () => {
      const thing = new Thing('bunker', 100, 200);
      expect(thing.type).toBe('bunker');
      expect(thing.x).toBe(100);
      expect(thing.y).toBe(200);
      expect(thing.active).toBe(true);
    });
  });

  describe('Slider', () => {
    it('should create slider with direction and range', () => {
      const slider = new Slider(100, 200, 'horizontal', 50);
      expect(slider.x).toBe(100);
      expect(slider.y).toBe(200);
      expect(slider.direction).toBe('horizontal');
      expect(slider.range).toBe(50);
      expect(slider.offset).toBe(0);
    });

    it('should move horizontally when direction is horizontal', () => {
      const slider = new Slider(100, 200, 'horizontal', 50);
      slider.update();
      expect(slider.x).toBe(100.5);
      expect(slider.y).toBe(200);
    });

    it('should move vertically when direction is vertical', () => {
      const slider = new Slider(100, 200, 'vertical', 50);
      slider.update();
      expect(slider.x).toBe(100);
      expect(slider.y).toBe(200.5);
    });

    it('should reverse direction at range limit', () => {
      const slider = new Slider(100, 200, 'horizontal', 10);
      slider.offset = 10;
      slider.update();
      expect(slider.speed).toBe(-0.5);
    });

    it('should not move when not moving', () => {
      const slider = new Slider(100, 200, 'horizontal', 50);
      slider.moving = false;
      slider.update();
      expect(slider.x).toBe(100);
    });

    it('should return current position', () => {
      const slider = new Slider(100, 200, 'horizontal', 50);
      const pos = slider.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(200);
    });
  });

  describe('Button', () => {
    it('should create button with slider ID', () => {
      const button = new Button(100, 200, 'slider1');
      expect(button.x).toBe(100);
      expect(button.y).toBe(200);
      expect(button.sliderId).toBe('slider1');
      expect(button.pressed).toBe(false);
    });

    it('should detect collision with ship', () => {
      const button = new Button(100, 200, 'slider1');
      const collision = button.checkCollision(105, 205);
      expect(collision).toBe(true);
    });

    it('should not detect collision when far away', () => {
      const button = new Button(100, 200, 'slider1');
      const collision = button.checkCollision(200, 300);
      expect(collision).toBe(false);
    });
  });

  describe('Bunker', () => {
    it('should create bunker with type', () => {
      const bunker = new Bunker(100, 200, 1);
      expect(bunker.x).toBe(100);
      expect(bunker.y).toBe(200);
      expect(bunker.type).toBe(1);
      expect(bunker.active).toBe(true);
    });

    it('should decrease shoot cooldown on update', () => {
      const bunker = new Bunker(100, 200, 1);
      bunker.shootCooldown = 10;
      bunker.update();
      expect(bunker.shootCooldown).toBe(9);
    });

    it('should not shoot when cooldown > 0', () => {
      const bunker = new Bunker(100, 200, 1);
      bunker.shootCooldown = 10;
      expect(bunker.canShoot()).toBe(false);
    });

    it('should shoot when cooldown is 0', () => {
      const bunker = new Bunker(100, 200, 1);
      expect(bunker.canShoot()).toBe(true);
    });

    it('should create bullet and set cooldown on shoot', () => {
      const bunker = new Bunker(100, 200, 1);
      const bullet = bunker.shoot();
      expect(bullet).toBeDefined();
      expect(bunker.shootCooldown).toBe(120);
    });

    it('should not shoot when inactive', () => {
      const bunker = new Bunker(100, 200, 1);
      bunker.active = false;
      expect(bunker.canShoot()).toBe(false);
    });
  });

  describe('Fuel', () => {
    it('should create fuel with amount', () => {
      const fuel = new Fuel(100, 200, 50);
      expect(fuel.x).toBe(100);
      expect(fuel.y).toBe(200);
      expect(fuel.amount).toBe(50);
      expect(fuel.active).toBe(true);
    });
  });

  describe('Pod', () => {
    it('should create pod', () => {
      const pod = new Pod(100, 200);
      expect(pod.x).toBe(100);
      expect(pod.y).toBe(200);
      expect(pod.active).toBe(true);
      expect(pod.towed).toBe(false);
    });
  });
});
