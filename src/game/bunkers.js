// Bunker types and shooting logic
import { Bunker, Bullet } from './game-objects.js';

const BUNKER_TYPES = {
  1: { shootInterval: 120, bulletSpeed: 2, color: '#f00' },
  2: { shootInterval: 90, bulletSpeed: 3, color: '#0f0' },
  3: { shootInterval: 60, bulletSpeed: 4, color: '#00f' },
  4: { shootInterval: 30, bulletSpeed: 5, color: '#ff0' }
};

export function createBunker(x, y, type) {
  const config = BUNKER_TYPES[type] || BUNKER_TYPES[1];
  const bunker = new Bunker(x, y, type);
  bunker.shootInterval = config.shootInterval;
  bunker.bulletSpeed = config.bulletSpeed;
  bunker.color = config.color;
  return bunker;
}

export function updateBunkers(bunkers, shipX, shipY) {
  const bullets = [];
  
  for (const bunker of bunkers) {
    if (!bunker.active) continue;
    
    bunker.update();
    
    if (bunker.canShoot()) {
      // Calculate direction to ship
      const dx = shipX - bunker.x;
      const dy = shipY - bunker.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only shoot if ship is in range
      if (distance < 200) {
        const vx = (dx / distance) * bunker.bulletSpeed;
        const vy = (dy / distance) * bunker.bulletSpeed;
        const bullet = bunker.shoot();
        bullet.vx = vx;
        bullet.vy = vy;
        bullets.push(bullet);
      }
    }
  }
  
  return bullets;
}
