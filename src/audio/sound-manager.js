// Sound manager for game-specific sounds
import { AudioEngine } from './audio-engine.js';

export class SoundManager {
  constructor() {
    this.engine = new AudioEngine();
    this.sounds = {
      thrust: null,
      shoot: null,
      explosion: null,
      pickup: null,
      shield: null,
      tractor: null
    };
    this.currentThrustSound = null;
  }

  async init() {
    await this.engine.init();
  }

  loadSounds(soundBuffers) {
    for (const [name, buffer] of Object.entries(soundBuffers)) {
      this.engine.loadSound(name, buffer);
      this.sounds[name] = buffer;
    }
  }

  playThrust() {
    if (this.currentThrustSound) return; // Already playing
    
    this.currentThrustSound = this.engine.playSound('thrust', 0.3, true);
  }

  stopThrust() {
    if (this.currentThrustSound) {
      this.engine.stopSound(this.currentThrustSound);
      this.currentThrustSound = null;
    }
  }

  playShoot() {
    this.engine.playSound('shoot', 0.5);
  }

  playExplosion() {
    this.engine.playSound('explosion', 0.7);
  }

  playPickup() {
    this.engine.playSound('pickup', 0.4);
  }

  playShield() {
    this.engine.playSound('shield', 0.3);
  }

  playTractor() {
    this.engine.playSound('tractor', 0.2, true);
  }

  stopTractor() {
    // Would need to track tractor sound instance
    // For now, this is a placeholder
  }

  resume() {
    this.engine.resume();
  }
}
