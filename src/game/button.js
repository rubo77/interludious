// Button - Interactive element that triggers sliders
export class Button {
  constructor(x, y, type = 'L', tag = 0) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.tag = tag;
    this.pressed = false;
    this.pressCooldown = 0;
  }

  update(dt) {
    if (this.pressCooldown > 0) {
      this.pressCooldown -= dt;
    }
  }

  press() {
    if (this.pressCooldown <= 0) {
      this.pressed = true;
      this.pressCooldown = 30; // 0.5 seconds at 60fps
      setTimeout(() => {
        this.pressed = false;
      }, 500);
      return true;
    }
    return false;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
