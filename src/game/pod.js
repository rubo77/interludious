// Pod - The fuel canister that the ship must tow to the restart point
export class Pod {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.towed = false;
    this.towingDistance = 30;
  }

  update(dt, gravity = 0.05) {
    if (!this.towed) {
      this.vy += gravity;
    }

    this.vx *= 0.99;
    this.vy *= 0.99;

    this.x += this.vx;
    this.y += this.vy;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setTowing(towing) {
    this.towed = towing;
    if (!towing) {
      this.vx = 0;
      this.vy = 0;
    }
  }

  getTowPosition(ship, angle) {
    const distance = this.towingDistance;
    const behindX = ship.x - Math.sin(angle) * distance;
    const behindY = ship.y + Math.cos(angle) * distance;
    return { x: behindX, y: behindY };
  }

  moveToTowPosition(targetX, targetY, strength = 0.1) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    this.vx += dx * strength;
    this.vy += dy * strength;
  }
}
