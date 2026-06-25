// Particle system for explosions, engine flame, etc.
export class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
    this.alpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.alpha = this.life / this.maxLife;
  }

  isDead() {
    return this.life <= 0;
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count, config) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * config.speed + config.minSpeed;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = Math.random() * config.life + config.minLife;
      const size = Math.random() * config.size + config.minSize;
      
      this.particles.push(new Particle(
        x, y, vx, vy, life, config.color, size
      ));
    }
  }

  update() {
    for (const particle of this.particles) {
      particle.update();
    }
    this.particles = this.particles.filter(p => !p.isDead());
  }

  render(ctx) {
    for (const particle of this.particles) {
      particle.render(ctx);
    }
  }

  clear() {
    this.particles = [];
  }

  getParticleCount() {
    return this.particles.length;
  }
}
