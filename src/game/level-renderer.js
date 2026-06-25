// Level renderer for rendering level layout
export class LevelRenderer {
  constructor() {
    this.tileSize = 8; // Original Thrust uses 8 units per pixel
  }

  render(ctx, level, offsetX = 0, offsetY = 0) {
    if (!level || !level.layout) return;

    const layout = level.layout;
    const startX = offsetX;
    const startY = offsetY;

    for (let y = 0; y < layout.length; y++) {
      const row = layout[y];
      for (let x = 0; x < row.length; x++) {
        const tile = row[x];
        const posX = startX + x * this.tileSize;
        const posY = startY + y * this.tileSize;

        this.renderTile(ctx, tile, posX, posY);
      }
    }
  }

  renderTile(ctx, tile, x, y) {
    switch (tile) {
      case '#': // Solid wall
        ctx.fillStyle = '#666666';
        ctx.fillRect(x, y, this.tileSize, this.tileSize);
        ctx.strokeStyle = '#888888';
        ctx.strokeRect(x, y, this.tileSize, this.tileSize);
        break;

      case '*': // Restart point
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x, y, this.tileSize, this.tileSize);
        ctx.fillStyle = '#000000';
        ctx.font = '6px Arial';
        ctx.fillText('R', x + 1, y + 6);
        break;

      case '`': // Fuel
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
        break;

      case 'm': // Pod position
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, this.tileSize / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'd': // Power plant
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(x + 1, y + 1, this.tileSize - 2, this.tileSize - 2);
        break;

      default:
        // Sliders (@-K), Buttons (L,N), Bunkers (P,U,[,\) - render as placeholders
        if (this.isBunker(tile)) {
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
        } else if (this.isButton(tile)) {
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
        } else if (this.isSlider(tile)) {
          ctx.fillStyle = '#0000ff';
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
        }
        break;
    }
  }

  isBunker(tile) {
    return ['P', 'U', '[', '\\'].includes(tile);
  }

  isButton(tile) {
    return ['L', 'N'].includes(tile);
  }

  isSlider(tile) {
    const code = tile.charCodeAt(0);
    return code >= 64 && code <= 75; // @-K
  }

  isWall(tile) {
    return tile === '#';
  }

  getTileAt(level, x, y) {
    if (!level || !level.layout) return null;
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    
    if (tileY < 0 || tileY >= level.layout.length) return null;
    const row = level.layout[tileY];
    if (tileX < 0 || tileX >= row.length) return null;
    
    return row[tileX];
  }

  getLevelDimensions(level) {
    if (!level || !level.layout) return { width: 0, height: 0 };
    return {
      width: level.layout[0].length * this.tileSize,
      height: level.layout.length * this.tileSize
    };
  }
}
