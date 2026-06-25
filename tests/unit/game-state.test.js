import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../../src/game/game-state.js';

describe('Game State', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  it('should create state with menu as default', () => {
    expect(gameState.getState()).toBe('menu');
    expect(gameState.getPreviousState()).toBeNull();
  });

  it('should set new state', () => {
    gameState.setState('playing');
    expect(gameState.getState()).toBe('playing');
    expect(gameState.getPreviousState()).toBe('menu');
  });

  it('should check if menu', () => {
    expect(gameState.isMenu()).toBe(true);
    gameState.setState('playing');
    expect(gameState.isMenu()).toBe(false);
  });

  it('should check if playing', () => {
    expect(gameState.isPlaying()).toBe(false);
    gameState.setState('playing');
    expect(gameState.isPlaying()).toBe(true);
  });

  it('should check if paused', () => {
    expect(gameState.isPaused()).toBe(false);
    gameState.setState('paused');
    expect(gameState.isPaused()).toBe(true);
  });

  it('should check if game over', () => {
    expect(gameState.isGameOver()).toBe(false);
    gameState.setState('gameover');
    expect(gameState.isGameOver()).toBe(true);
  });

  it('should check if level complete', () => {
    expect(gameState.isLevelComplete()).toBe(false);
    gameState.setState('levelcomplete');
    expect(gameState.isLevelComplete()).toBe(true);
  });

  it('should allow pause when playing', () => {
    gameState.setState('playing');
    expect(gameState.canPause()).toBe(true);
  });

  it('should not allow pause when not playing', () => {
    expect(gameState.canPause()).toBe(false);
  });

  it('should allow resume when paused', () => {
    gameState.setState('paused');
    expect(gameState.canResume()).toBe(true);
  });

  it('should not allow resume when not paused', () => {
    expect(gameState.canResume()).toBe(false);
  });

  it('should allow restart when game over', () => {
    gameState.setState('gameover');
    expect(gameState.canRestart()).toBe(true);
  });

  it('should allow restart when level complete', () => {
    gameState.setState('levelcomplete');
    expect(gameState.canRestart()).toBe(true);
  });

  it('should not allow restart when playing', () => {
    gameState.setState('playing');
    expect(gameState.canRestart()).toBe(false);
  });

  it('should reset to menu', () => {
    gameState.setState('playing');
    gameState.reset();
    expect(gameState.getState()).toBe('menu');
    expect(gameState.getPreviousState()).toBeNull();
  });
});
