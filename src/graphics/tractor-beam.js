// Tractor beam visualization for pod towing
export class TractorBeam {
  constructor() {
    this.active = false;
    this.shipX = 0;
    this.shipY = 0;
    this.podX = 0;
    this.podY = 0;
    this.pulsePhase = 0;
  }

  activate(shipX, shipY, podX, podY) {
    this.active = true;
    this.shipX = shipX;
    this.shipY = shipY;
    this.podX = podX;
    this.podY = podY;
  }

  deactivate() {
    this.active = false;
  }

  update(shipX, shipY, podX, podY) {
    if (!this.active) return;

    this.shipX = shipX;
    this.shipY = shipY;
    this.podX = podX;
    this.podY = podY;
    this.pulsePhase += 0.2;
  }

  render(ctx) {
    if (!this.active) return;

    ctx.save();

    // Calculate distance and angle
    const dx = this.podX - this.shipX;
    const dy = this.podY - this.shipY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Pulsing effect
    const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    const width = 4 * pulse;

    // Draw beam line
    ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.shipX, this.shipY);
    ctx.lineTo(this.podX, this.podY);
    ctx.stroke();

    // Draw particles along beam
    const particleCount = Math.floor(distance / 20);
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount + this.pulsePhase * 0.1) % 1;
      const px = this.shipX + dx * t;
      const py = this.shipY + dy * t;
      const size = 3 * pulse;

      ctx.fillStyle = `rgba(0, 255, 255, ${pulse})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw connection points
    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.arc(this.shipX, this.shipY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.podX, this.podY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
