import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HighScoreManager } from '../../src/game/high-score-manager.js';

describe('High Score Manager', () => {
  let manager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    manager = new HighScoreManager();
  });

  it('should create manager with empty scores', () => {
    expect(manager.scores).toHaveLength(0);
    expect(manager.maxScores).toBe(10);
  });

  it('should add score', () => {
    manager.addScore('Player1', 1000, 1);
    expect(manager.scores).toHaveLength(1);
    expect(manager.scores[0].name).toBe('Player1');
    expect(manager.scores[0].score).toBe(1000);
  });

  it('should sort scores by score descending', () => {
    manager.addScore('Player1', 1000, 1);
    manager.addScore('Player2', 2000, 2);
    manager.addScore('Player3', 500, 1);
    
    expect(manager.scores[0].score).toBe(2000);
    expect(manager.scores[1].score).toBe(1000);
    expect(manager.scores[2].score).toBe(500);
  });

  it('should limit scores to maxScores', () => {
    const customManager = new HighScoreManager(3);
    customManager.addScore('Player1', 1000, 1);
    customManager.addScore('Player2', 2000, 2);
    customManager.addScore('Player3', 3000, 3);
    customManager.addScore('Player4', 4000, 4);
    
    expect(customManager.scores).toHaveLength(3);
    expect(customManager.scores[0].score).toBe(4000);
  });

  it('should get scores', () => {
    manager.addScore('Player1', 1000, 1);
    const scores = manager.getScores();
    
    expect(scores).toHaveLength(1);
    expect(scores[0].name).toBe('Player1');
  });

  it('should get high score', () => {
    manager.addScore('Player1', 1000, 1);
    manager.addScore('Player2', 2000, 2);
    
    expect(manager.getHighScore()).toBe(2000);
  });

  it('should return 0 for high score when no scores', () => {
    expect(manager.getHighScore()).toBe(0);
  });

  it('should get rank', () => {
    manager.addScore('Player1', 1000, 1);
    manager.addScore('Player2', 2000, 2);
    
    expect(manager.getRank(2000)).toBe(1);
    expect(manager.getRank(1000)).toBe(2);
  });

  it('should return -1 for rank when score not found', () => {
    manager.addScore('Player1', 1000, 1);
    expect(manager.getRank(500)).toBe(-1);
  });

  it('should check if score is high score', () => {
    const customManager = new HighScoreManager(2);
    customManager.addScore('Player1', 1000, 1);
    customManager.addScore('Player2', 500, 1);
    
    expect(customManager.isHighScore(2000)).toBe(true);
    expect(customManager.isHighScore(1000)).toBe(true); // Higher than lowest (500)
    expect(customManager.isHighScore(400)).toBe(false); // Lower than lowest (500)
  });

  it('should accept any score when below max', () => {
    expect(manager.isHighScore(1)).toBe(true);
  });

  it('should clear scores', () => {
    manager.addScore('Player1', 1000, 1);
    manager.clearScores();
    
    expect(manager.scores).toHaveLength(0);
  });

  it('should save scores to localStorage', () => {
    manager.addScore('Player1', 1000, 1);
    
    const newManager = new HighScoreManager();
    expect(newManager.scores).toHaveLength(1);
    expect(newManager.scores[0].name).toBe('Player1');
  });

  it('should load scores from localStorage', () => {
    const testScores = [
      { name: 'Player1', score: 1000, level: 1, date: '2024-01-01' }
    ];
    localStorage.setItem('interludious_highscores', JSON.stringify(testScores));
    
    const newManager = new HighScoreManager();
    expect(newManager.scores).toHaveLength(1);
    expect(newManager.scores[0].name).toBe('Player1');
  });

  it('should handle invalid localStorage data', () => {
    localStorage.setItem('interludious_highscores', 'invalid json');
    
    const newManager = new HighScoreManager();
    expect(newManager.scores).toHaveLength(0);
  });

  it('should use anonymous name when no name provided', () => {
    manager.addScore(null, 1000, 1);
    expect(manager.scores[0].name).toBe('Anonymous');
  });

  it('should use 0 score when no score provided', () => {
    manager.addScore('Player1', null, 1);
    expect(manager.scores[0].score).toBe(0);
  });

  it('should use level 1 when no level provided', () => {
    manager.addScore('Player1', 1000, null);
    expect(manager.scores[0].level).toBe(1);
  });

  it('should include date in score entry', () => {
    manager.addScore('Player1', 1000, 1);
    expect(manager.scores[0].date).toBeDefined();
    expect(new Date(manager.scores[0].date)).toBeInstanceOf(Date);
  });
});
