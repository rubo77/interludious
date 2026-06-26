// Ship class for player ship
import { GRAVITY, ROTATION_SPEED } from '../core/constants.js';

export class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0; // radians
    this.rotation = 0; // degrees
    this.thrust = 0;
    this.fuel = 100;
  }

  update(dt, gravity = GRAVITY, gravityMultiplier = 1.0) {
    // Apply gravity (10% stronger, multiplied by difficulty multiplier)
    this.vy += gravity * gravityMultiplier * dt;

    // Apply thrust
    if (this.thrust > 0) {
      const thrustPower = 0.3 * dt;
      this.vx += Math.sin(this.angle) * thrustPower;
      this.vy -= Math.cos(this.angle) * thrustPower;
      this.fuel -= 0.1 * dt;
    }

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Friction
    this.vx *= Math.pow(0.99, dt);
    this.vy *= Math.pow(0.99, dt);

    // Clamp fuel
    if (this.fuel < 0) this.fuel = 0;
  }

  rotateLeft() {
    this.angle -= ROTATION_SPEED;
    this.rotation = (this.angle * 180 / Math.PI) % 360;
  }

  rotateRight() {
    this.angle += ROTATION_SPEED;
    this.rotation = (this.angle * 180 / Math.PI) % 360;
  }

  setThrust(thrusting) {
    this.thrust = thrusting ? 1 : 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }
}
