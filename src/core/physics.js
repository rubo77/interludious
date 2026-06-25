// Physics engine ported from thrust.c
import { GRAVITY, THRUST_POWER, ROTATION_SPEED, MAX_SPEED, FRICTION } from './constants.js';

export class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0; // Radians
    this.thrusting = false;
    this.rotatingLeft = false;
    this.rotatingRight = false;
  }

  update() {
    // Apply rotation
    if (this.rotatingLeft) {
      this.angle -= ROTATION_SPEED;
    }
    if (this.rotatingRight) {
      this.angle += ROTATION_SPEED;
    }

    // Apply thrust
    if (this.thrusting) {
      this.vx += Math.cos(this.angle) * THRUST_POWER;
      this.vy += Math.sin(this.angle) * THRUST_POWER;
    }

    // Apply gravity
    this.vy += GRAVITY;

    // Apply friction
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    // Limit speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > MAX_SPEED) {
      this.vx = (this.vx / speed) * MAX_SPEED;
      this.vy = (this.vy / speed) * MAX_SPEED;
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getVelocity() {
    return { vx: this.vx, vy: this.vy };
  }

  getAngle() {
    return this.angle;
  }
}
