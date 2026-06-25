import { describe, it, expect, vi } from 'vitest';
import { GameLoop } from '../../src/game/game-loop.js';
import { ScoringSystem } from '../../src/game/scoring.js';
import { GameState } from '../../src/game/game-state.js';

describe('Game Loop Integration', () => {
  it('should integrate game loop with update and render', (done) => {
    let updateCount = 0;
    let renderCount = 0;
    
    const update = vi.fn(() => {
      updateCount++;
    });
    
    const render = vi.fn(() => {
      renderCount++;
    });
    
    const loop = new GameLoop(update, render);
    loop.start();
    
    setTimeout(() => {
      loop.stop();
      expect(updateCount).toBeGreaterThan(0);
      expect(renderCount).toBeGreaterThan(0);
      done();
    }, 50);
  });

  it('should integrate scoring with game state', () => {
    const scoring = new ScoringSystem();
    const gameState = new GameState();
    
    scoring.addScore(100);
    gameState.setState('playing');
    
    expect(scoring.getScore()).toBe(100);
    expect(gameState.isPlaying()).toBe(true);
  });

  it('should integrate game over state with scoring', () => {
    const scoring = new ScoringSystem();
    const gameState = new GameState();
    
    gameState.setState('playing');
    scoring.loseLife();
    scoring.loseLife();
    scoring.loseLife();
    
    expect(scoring.isGameOver()).toBe(true);
    gameState.setState('gameover');
    expect(gameState.isGameOver()).toBe(true);
  });

  it('should integrate level progression with scoring', () => {
    const scoring = new ScoringSystem();
    const gameState = new GameState();
    
    scoring.addScore(1000);
    scoring.nextLevel();
    gameState.setState('levelcomplete');
    
    expect(scoring.getLevel()).toBe(2);
    expect(gameState.isLevelComplete()).toBe(true);
  });

  it('should integrate all game systems together', () => {
    const scoring = new ScoringSystem();
    const gameState = new GameState();
    
    // Start game
    gameState.setState('playing');
    expect(gameState.isPlaying()).toBe(true);
    
    // Add score
    scoring.addScore(500);
    expect(scoring.getScore()).toBe(500);
    
    // Lose life
    scoring.loseLife();
    expect(scoring.getLives()).toBe(2);
    
    // Complete level
    scoring.nextLevel();
    gameState.setState('levelcomplete');
    expect(scoring.getLevel()).toBe(2);
    expect(gameState.isLevelComplete()).toBe(true);
    
    // Restart
    scoring.resetAll();
    gameState.reset();
    expect(scoring.getScore()).toBe(0);
    expect(scoring.getLives()).toBe(3);
    expect(scoring.getLevel()).toBe(1);
    expect(gameState.isMenu()).toBe(true);
  });
});
