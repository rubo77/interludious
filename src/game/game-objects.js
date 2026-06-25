// Game objects structures ported from things.c

export class Bullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.active = true;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }
}

export class Fragment {
  constructor(x, y, vx, vy, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  isDead() {
    return this.life <= 0;
  }
}

export class Thing {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.active = true;
  }
}

export class Slider {
  constructor(x, y, direction, range) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.direction = direction; // 'horizontal' or 'vertical'
    this.range = range;
    this.speed = 0.5;
    this.offset = 0;
    this.moving = true;
  }

  update() {
    if (!this.moving) return;

    this.offset += this.speed;
    
    if (this.offset >= this.range || this.offset <= 0) {
      this.speed *= -1;
    }

    if (this.direction === 'horizontal') {
      this.x = this.startX + this.offset;
    } else {
      this.y = this.startY + this.offset;
    }
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }
}

export class Button {
  constructor(x, y, sliderId) {
    this.x = x;
    this.y = y;
    this.sliderId = sliderId;
    this.pressed = false;
  }

  checkCollision(shipX, shipY) {
    const distance = Math.sqrt((shipX - this.x) ** 2 + (shipY - this.y) ** 2);
    return distance < 10;
  }
}

export class Bunker {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 1-4 for different bunker types
    this.active = true;
    this.shootCooldown = 0;
    this.shootInterval = 120; // frames
  }

  update() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
  }

  canShoot() {
    return this.active && this.shootCooldown === 0;
  }

  shoot() {
    this.shootCooldown = this.shootInterval;
    return new Bullet(this.x, this.y, 0, 2); // Shoot downward
  }
}

export class Fuel {
  constructor(x, y, amount) {
    this.x = x;
    this.y = y;
    this.amount = amount;
    this.active = true;
  }
}

export class Pod {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
    this.towed = false;
  }
}
