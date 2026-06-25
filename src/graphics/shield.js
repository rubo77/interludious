// Shield effect visualization
export class Shield {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.active = false;
    this.alpha = 0;
    this.pulsePhase = 0;
  }

  activate(duration) {
    this.active = true;
    this.alpha = 1;
    this.duration = duration;
    this.timer = duration;
  }

  update() {
    if (!this.active) return;

    this.timer--;
    this.pulsePhase += 0.1;
    
    // Fade out near end
    if (this.timer < 30) {
      this.alpha = this.timer / 30;
    }

    if (this.timer <= 0) {
      this.active = false;
      this.alpha = 0;
    }
  }

  render(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    
    // Pulsing effect
    const pulse = Math.sin(this.pulsePhase) * 2;
    const currentRadius = this.radius + pulse;

    // Draw shield circle
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw inner glow
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, currentRadius
    );
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
    gradient.addColorStop(0.8, 'rgba(0, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  isHit(x, y) {
    if (!this.active) return false;
    const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
    return distance < this.radius;
  }
}
