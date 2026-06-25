// Audio engine using Web Audio API
export class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }

  loadSound(name, audioBuffer) {
    this.sounds.set(name, audioBuffer);
  }

  playSound(name, volume = 1.0, loop = false) {
    if (!this.initialized || !this.audioContext) return null;

    const sound = this.sounds.get(name);
    if (!sound) return null;

    const source = this.audioContext.createBufferSource();
    source.buffer = sound;
    source.loop = loop;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);

    return { source, gainNode };
  }

  stopSound(soundInstance) {
    if (soundInstance && soundInstance.source) {
      soundInstance.source.stop();
    }
  }

  setVolume(soundInstance, volume) {
    if (soundInstance && soundInstance.gainNode) {
      soundInstance.gainNode.gain.value = volume;
    }
  }

  hasSound(name) {
    return this.sounds.has(name);
  }

  clearSounds() {
    this.sounds.clear();
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}
