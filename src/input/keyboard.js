// Keyboard input handler
export class KeyboardInput {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      accelerate: false
    };
    this.listeners = [];
  }

  init() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = true;
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        this.keys.accelerate = true;
        break;
    }
    this.notifyListeners();
  }

  handleKeyUp(event) {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        this.keys.accelerate = false;
        break;
    }
    this.notifyListeners();
  }

  getKeys() {
    return { ...this.keys };
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getKeys()));
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
