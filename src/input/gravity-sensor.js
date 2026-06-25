// Gravity sensor controls using DeviceOrientation/DeviceMotion API
export class GravitySensor {
  constructor() {
    this.enabled = false;
    this.alpha = 0; // Rotation around Z axis (0-360)
    this.beta = 0;  // Rotation around X axis (-180 to 180)
    this.gamma = 0; // Rotation around Y axis (-90 to 90)
    this.listeners = [];
  }

  async init() {
    if (typeof DeviceOrientationEvent !== 'undefined') {
      // iOS 13+ requires permission request
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            this.enabled = true;
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
          }
        } catch (error) {
          console.error('Device orientation permission denied:', error);
        }
      } else {
        // Non-iOS or older iOS
        this.enabled = true;
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
      }
    }
  }

  handleOrientation(event) {
    this.alpha = event.alpha || 0;
    this.beta = event.beta || 0;
    this.gamma = event.gamma || 0;
    this.notifyListeners();
  }

  getRotation() {
    // Convert gamma (Y-axis rotation) to ship rotation
    // Gamma: -90 (left) to 90 (right)
    // Normalize to radians
    return (this.gamma * Math.PI) / 180;
  }

  getTilt() {
    // Convert beta (X-axis rotation) to tilt
    // Beta: -180 (upside down) to 180 (upright)
    return this.beta;
  }

  isEnabled() {
    return this.enabled;
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    const state = {
      alpha: this.alpha,
      beta: this.beta,
      gamma: this.gamma,
      rotation: this.getRotation(),
      tilt: this.getTilt()
    };
    this.listeners.forEach(callback => callback(state));
  }

  destroy() {
    if (this.enabled) {
      window.removeEventListener('deviceorientation', this.handleOrientation.bind(this));
      this.enabled = false;
    }
  }
}
