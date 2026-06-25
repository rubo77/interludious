// Collision detection system
export class CollisionDetection {
  constructor(levelRenderer) {
    this.levelRenderer = levelRenderer;
  }

  checkShipCollision(ship, level) {
    if (!level || !level.layout) return { collided: false };

    const shipRadius = 8;
    
    // Check ship center
    const centerTile = this.levelRenderer.getTileAt(level, ship.x, ship.y);
    if (this.levelRenderer.isWall(centerTile)) {
      return { collided: true, tile: centerTile, point: { x: ship.x, y: ship.y } };
    }

    const shipPoints = this.getShipPoints(ship, shipRadius);

    for (const point of shipPoints) {
      const tile = this.levelRenderer.getTileAt(level, point.x, point.y);
      if (this.levelRenderer.isWall(tile)) {
        return { collided: true, tile, point };
      }
    }

    return { collided: false };
  }

  getShipPoints(ship, radius) {
    const points = [];
    const numPoints = 8;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      points.push({
        x: ship.x + Math.cos(angle) * radius,
        y: ship.y + Math.sin(angle) * radius
      });
    }

    return points;
  }

  resolveCollision(ship, collision) {
    if (!collision.collided) return;

    // Simple bounce back
    ship.vx *= -0.5;
    ship.vy *= -0.5;
    
    // Push ship back
    ship.x -= ship.vx * 2;
    ship.y -= ship.vy * 2;
  }

  checkCircleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2;
  }

  checkPointCollision(x, y, level) {
    if (!level || !level.layout) return false;
    const tile = this.levelRenderer.getTileAt(level, x, y);
    return this.levelRenderer.isWall(tile);
  }

  checkAABB(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (
      x1 < x2 + w2 &&
      x1 + w1 > x2 &&
      y1 < y2 + h2 &&
      y1 + h1 > y2
    );
  }
}
