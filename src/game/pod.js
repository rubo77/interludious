// Pod - The fuel canister that the ship must tow to the restart point
export class Pod {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.towed = false;
    this.active = true;
    this.towingDistance = 30;
  }

  update(dt, gravity = 0.05) {
    if (!this.active) return;
    
    if (!this.towed) {
      this.vy += gravity * dt;
    }

    this.vx *= Math.pow(0.99, dt);
    this.vy *= Math.pow(0.99, dt);

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setTowing(towing) {
    this.towed = towing;
    // Don't reset velocity when releasing - let gravity take over
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
    this.x += dx * strength;
    this.y += dy * strength;
  }
}
