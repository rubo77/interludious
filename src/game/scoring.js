// Scoring system
export class ScoringSystem {
  constructor() {
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('interludious_highscore') || '0', 10);
    this.lives = 3;
    this.level = 1;
  }

  addScore(points) {
    this.score += points;
    this.updateHighScore();
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('interludious_highscore', this.highScore.toString());
    }
  }

  loseLife() {
    this.lives--;
    return this.lives <= 0;
  }

  resetLives() {
    this.lives = 3;
  }

  nextLevel() {
    this.level++;
  }

  resetLevel() {
    this.level = 1;
  }

  resetScore() {
    this.score = 0;
  }

  resetAll() {
    this.resetScore();
    this.resetLives();
    this.resetLevel();
  }

  getScore() {
    return this.score;
  }

  getHighScore() {
    return this.highScore;
  }

  getLives() {
    return this.lives;
  }

  getLevel() {
    return this.level;
  }

  isGameOver() {
    return this.lives <= 0;
  }
}
