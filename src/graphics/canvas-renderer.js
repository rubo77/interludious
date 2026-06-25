// Canvas renderer for game
export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawShip(ship) {
    const { x, y } = ship.getPosition();
    const angle = ship.getAngle();

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    // Draw ship as triangle
    this.ctx.beginPath();
    this.ctx.moveTo(10, 0);
    this.ctx.lineTo(-8, -6);
    this.ctx.lineTo(-8, 6);
    this.ctx.closePath();
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();

    // Draw engine flame if thrusting
    if (ship.thrusting) {
      this.ctx.beginPath();
      this.ctx.moveTo(-8, -3);
      this.ctx.lineTo(-15, 0);
      this.ctx.lineTo(-8, 3);
      this.ctx.closePath();
      this.ctx.fillStyle = '#ff0';
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawLevel(level) {
    if (!level.layout) return;

    const tileSize = 8;
    const offsetX = 50;
    const offsetY = 50;

    for (let row = 0; row < level.layout.length; row++) {
      const line = level.layout[row];
      for (let col = 0; col < line.length; col++) {
        const char = line[col];
        const x = offsetX + col * tileSize;
        const y = offsetY + row * tileSize;

        if (char === '*') {
          // Wall
          this.ctx.fillStyle = '#888';
          this.ctx.fillRect(x, y, tileSize, tileSize);
        } else if (char === 'r' || char === 'R') {
          // Restart point
          this.ctx.fillStyle = '#0f0';
          this.ctx.fillRect(x, y, tileSize, tileSize);
        } else if (char === 'p') {
          // Pod
          this.ctx.fillStyle = '#00f';
          this.ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }
  }

  render(ship, level) {
    this.clear();
    this.drawLevel(level);
    this.drawShip(ship);
  }
}
