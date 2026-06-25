// Sprite loading and rendering
export class SpriteLoader {
  constructor() {
    this.sprites = new Map();
  }

  loadSprite(name, imageData) {
    this.sprites.set(name, imageData);
  }

  getSprite(name) {
    return this.sprites.get(name);
  }

  hasSprite(name) {
    return this.sprites.has(name);
  }

  clear() {
    this.sprites.clear();
  }
}

export class Sprite {
  constructor(image, x, y, width, height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.scale = 1;
    this.alpha = 1;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setRotation(angle) {
    this.rotation = angle;
  }

  setScale(scale) {
    this.scale = scale;
  }

  setAlpha(alpha) {
    this.alpha = alpha;
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
