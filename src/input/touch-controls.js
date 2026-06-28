// Touch controls for mobile devices
export class TouchControls {
  constructor() {
    this.touches = new Map();
    this.joystickActive = false;
    this.joystickCenter = { x: 0, y: 0 };
    this.joystickPosition = { x: 0, y: 0 };
    this.accelerateActive = false;
    this.listeners = [];
  }

  init(element) {
    element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    element.addEventListener('touchmove', this.handleTouchMove.bind(this));
    element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    element.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
  }

  handleTouchStart(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      this.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY
      });
    }

    this.updateControls();
  }

  handleTouchMove(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      const touchData = this.touches.get(touch.identifier);
      if (touchData) {
        touchData.x = touch.clientX;
        touchData.y = touch.clientY;
      }
    }

    this.updateControls();
  }

  handleTouchEnd(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      this.touches.delete(touch.identifier);
    }

    this.updateControls();
  }

  updateControls() {
    // Find left side touches for joystick
    const leftTouches = Array.from(this.touches.values()).filter(
      t => t.startX < window.innerWidth / 2
    );

    if (leftTouches.length > 0) {
      this.joystickActive = true;
      const touch = leftTouches[0];
      this.joystickCenter = { x: touch.startX, y: touch.startY };
      this.joystickPosition = { x: touch.x, y: touch.y };
    } else {
      this.joystickActive = false;
    }

    // Find right side touches for accelerate
    const rightTouches = Array.from(this.touches.values()).filter(
      t => t.startX >= window.innerWidth / 2
    );

    this.accelerateActive = rightTouches.length > 0;

    this.notifyListeners();
  }

  getJoystickDelta() {
    if (!this.joystickActive) return { x: 0, y: 0 };

    const dx = this.joystickPosition.x - this.joystickCenter.x;
    const dy = this.joystickPosition.y - this.joystickCenter.y;
    
    const maxDistance = 50;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      return { x: dx * scale, y: dy * scale };
    }

    return { x: dx, y: dy };
  }

  isAccelerating() {
    return this.accelerateActive;
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    const state = {
      joystickActive: this.joystickActive,
      joystickDelta: this.getJoystickDelta(),
      accelerateActive: this.accelerateActive
    };
    this.listeners.forEach(callback => callback(state));
  }

  destroy(element) {
    element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    element.removeEventListener('touchcancel', this.handleTouchEnd.bind(this));
  }
}
