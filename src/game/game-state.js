// Game state management
export class GameState {
  constructor() {
    this.state = 'menu'; // menu, playing, paused, gameover, levelcomplete
    this.previousState = null;
  }

  setState(newState) {
    this.previousState = this.state;
    this.state = newState;
  }

  getState() {
    return this.state;
  }

  getPreviousState() {
    return this.previousState;
  }

  isMenu() {
    return this.state === 'menu';
  }

  isPlaying() {
    return this.state === 'playing';
  }

  isPaused() {
    return this.state === 'paused';
  }

  isGameOver() {
    return this.state === 'gameover';
  }

  isLevelComplete() {
    return this.state === 'levelcomplete';
  }

  canPause() {
    return this.state === 'playing';
  }

  canResume() {
    return this.state === 'paused';
  }

  canRestart() {
    return this.state === 'gameover' || this.state === 'levelcomplete';
  }

  reset() {
    this.state = 'menu';
    this.previousState = null;
  }
}
