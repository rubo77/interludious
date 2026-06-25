// Tile renderer using original dulsi/thrust blks tileset
// Renders level tiles pixel-perfect using the original 8x8 pixel tileset and color palette
export class TileRenderer {
  constructor() {
    this.tileSize = 8; // Original tile size in pixels
    this.scale = 2; // Render scale factor for visibility
    this.palette = null;
    this.tiles = null;
    this.tileCache = new Map(); // ASCII code -> pre-rendered canvas
    this.loaded = false;
  }

  async load(url = '/assets/blocks.json') {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load tileset: ${response.status}`);
    }
    const data = await response.json();
    this.tileSize = data.tileSize;
    this.palette = data.palette;
    this.tiles = data.tiles;
    this.loaded = true;
    this.preRenderTiles();
  }

  preRenderTiles() {
    // Pre-render each tile to an offscreen canvas for performance
    for (const code in this.tiles) {
      const canvas = this.renderTileToCanvas(parseInt(code, 10));
      if (canvas) {
        this.tileCache.set(parseInt(code, 10), canvas);
      }
    }
  }

  renderTileToCanvas(code) {
    const tile = this.tiles[code];
    if (!tile) return null;

    const size = this.tileSize * this.scale;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let py = 0; py < this.tileSize; py++) {
      for (let px = 0; px < this.tileSize; px++) {
        const colorIndex = tile[py * this.tileSize + px];
        const color = this.palette[colorIndex] || [0, 0, 0];
        const isTransparent = colorIndex === 0;

        // Draw scaled pixel block
        for (let sy = 0; sy < this.scale; sy++) {
          for (let sx = 0; sx < this.scale; sx++) {
            const dx = px * this.scale + sx;
            const dy = py * this.scale + sy;
            const idx = (dy * size + dx) * 4;
            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = isTransparent ? 0 : 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  getScaledTileSize() {
    return this.tileSize * this.scale;
  }

  render(ctx, level, offsetX = 0, offsetY = 0) {
    if (!this.loaded || !level || !level.layout) return;

    const scaledSize = this.getScaledTileSize();
    const layout = level.layout;

    for (let y = 0; y < layout.length; y++) {
      const row = layout[y];
      for (let x = 0; x < row.length; x++) {
        const code = row.charCodeAt(x);
        const tileCanvas = this.tileCache.get(code);
        if (tileCanvas) {
          ctx.drawImage(
            tileCanvas,
            offsetX + x * scaledSize,
            offsetY + y * scaledSize
          );
        }
      }
    }
  }

  isWall(tile) {
    if (tile === ' ' || tile === undefined || tile === null) return false;
    const code = tile.charCodeAt(0);
    // In original Thrust, characters 76-108 (L-l range) are solid landscape
    // Platform tiles p-t (112-116) and many landscape chars are solid
    // Empty space is ' ' (32), '*' restart, and object markers
    // Solid: landscape tiles (uppercase letters and lowercase a-z used for terrain)
    return code >= 76; // Most terrain/platform tiles
  }

  getTileAt(level, x, y) {
    if (!level || !level.layout) return null;
    const scaledSize = this.getScaledTileSize();
    const tileX = Math.floor(x / scaledSize);
    const tileY = Math.floor(y / scaledSize);

    if (tileY < 0 || tileY >= level.layout.length) return null;
    const row = level.layout[tileY];
    if (tileX < 0 || tileX >= row.length) return null;

    return row[tileX];
  }

  getLevelDimensions(level) {
    if (!level || !level.layout) return { width: 0, height: 0 };
    const scaledSize = this.getScaledTileSize();
    return {
      width: level.layout[0].length * scaledSize,
      height: level.layout.length * scaledSize
    };
  }
}
