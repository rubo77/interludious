// Physics engine ported from C code
import { GRAVITY, ACCELERATE_POWER, ROTATION_SPEED, MAX_SPEED, FRICTION } from './constants.js';

export class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0; // Radians
    this.accelerating = false;
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

    // Apply acceleration
    if (this.accelerating) {
      this.vx += Math.cos(this.angle) * ACCELERATE_POWER;
      this.vy += Math.sin(this.angle) * ACCELERATE_POWER;
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
