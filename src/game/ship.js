// Ship class for player ship
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

  update(dt, gravity = 0.1) {
    // Apply gravity
    this.vy += gravity;

    // Apply thrust
    if (this.thrust > 0) {
      const thrustPower = 0.3;
      this.vx += Math.sin(this.angle) * thrustPower;
      this.vy -= Math.cos(this.angle) * thrustPower;
      this.fuel -= 0.1;
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Friction
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Clamp fuel
    if (this.fuel < 0) this.fuel = 0;
  }

  rotateLeft() {
    this.angle -= 0.1;
    this.rotation = (this.angle * 180 / Math.PI) % 360;
  }

  rotateRight() {
    this.angle += 0.1;
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
