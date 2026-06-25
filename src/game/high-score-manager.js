// High score manager with localStorage persistence
export class HighScoreManager {
  constructor(maxScores = 10) {
    this.maxScores = maxScores;
    this.storageKey = 'interludious_highscores';
    this.scores = this.loadScores();
  }

  loadScores() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load high scores:', error);
    }
    return [];
  }

  saveScores() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    } catch (error) {
      console.error('Failed to save high scores:', error);
    }
  }

  addScore(name, score, level) {
    const entry = {
      name: name || 'Anonymous',
      score: score || 0,
      level: level || 1,
      date: new Date().toISOString()
    };

    this.scores.push(entry);
    this.scores.sort((a, b) => b.score - a.score);
    
    // Keep only top scores
    if (this.scores.length > this.maxScores) {
      this.scores = this.scores.slice(0, this.maxScores);
    }

    this.saveScores();
    return this.getRank(entry.score);
  }

  getScores() {
    return [...this.scores];
  }

  getHighScore() {
    if (this.scores.length === 0) return 0;
    return this.scores[0].score;
  }

  getRank(score) {
    const rank = this.scores.findIndex(s => s.score === score);
    return rank >= 0 ? rank + 1 : -1;
  }

  isHighScore(score) {
    if (this.scores.length < this.maxScores) {
      return score > 0;
    }
    return score > this.scores[this.scores.length - 1].score;
  }

  clearScores() {
    this.scores = [];
    this.saveScores();
  }

  resetToDefaults() {
    this.scores = [];
    this.saveScores();
  }
}
