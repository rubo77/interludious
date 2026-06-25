import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KeyboardInput } from '../../src/input/keyboard.js';

describe('Keyboard Input', () => {
  let keyboard;

  beforeEach(() => {
    keyboard = new KeyboardInput();
  });

  it('should initialize with all keys false', () => {
    const keys = keyboard.getKeys();
    expect(keys.left).toBe(false);
    expect(keys.right).toBe(false);
    expect(keys.thrust).toBe(false);
  });

  it('should set left key on ArrowLeft keydown', () => {
    keyboard.handleKeyDown({ code: 'ArrowLeft' });
    const keys = keyboard.getKeys();
    expect(keys.left).toBe(true);
  });

  it('should set left key on KeyA keydown', () => {
    keyboard.handleKeyDown({ code: 'KeyA' });
    const keys = keyboard.getKeys();
    expect(keys.left).toBe(true);
  });

  it('should set right key on ArrowRight keydown', () => {
    keyboard.handleKeyDown({ code: 'ArrowRight' });
    const keys = keyboard.getKeys();
    expect(keys.right).toBe(true);
  });

  it('should set right key on KeyD keydown', () => {
    keyboard.handleKeyDown({ code: 'KeyD' });
    const keys = keyboard.getKeys();
    expect(keys.right).toBe(true);
  });

  it('should set thrust key on ArrowUp keydown', () => {
    keyboard.handleKeyDown({ code: 'ArrowUp' });
    const keys = keyboard.getKeys();
    expect(keys.thrust).toBe(true);
  });

  it('should set thrust key on KeyW keydown', () => {
    keyboard.handleKeyDown({ code: 'KeyW' });
    const keys = keyboard.getKeys();
    expect(keys.thrust).toBe(true);
  });

  it('should set thrust key on Space keydown', () => {
    keyboard.handleKeyDown({ code: 'Space' });
    const keys = keyboard.getKeys();
    expect(keys.thrust).toBe(true);
  });

  it('should unset left key on ArrowLeft keyup', () => {
    keyboard.handleKeyDown({ code: 'ArrowLeft' });
    keyboard.handleKeyUp({ code: 'ArrowLeft' });
    const keys = keyboard.getKeys();
    expect(keys.left).toBe(false);
  });

  it('should unset right key on ArrowRight keyup', () => {
    keyboard.handleKeyDown({ code: 'ArrowRight' });
    keyboard.handleKeyUp({ code: 'ArrowRight' });
    const keys = keyboard.getKeys();
    expect(keys.right).toBe(false);
  });

  it('should unset thrust key on ArrowUp keyup', () => {
    keyboard.handleKeyDown({ code: 'ArrowUp' });
    keyboard.handleKeyUp({ code: 'ArrowUp' });
    const keys = keyboard.getKeys();
    expect(keys.thrust).toBe(false);
  });

  it('should handle multiple keys pressed simultaneously', () => {
    keyboard.handleKeyDown({ code: 'ArrowLeft' });
    keyboard.handleKeyDown({ code: 'ArrowUp' });
    const keys = keyboard.getKeys();
    expect(keys.left).toBe(true);
    expect(keys.thrust).toBe(true);
  });

  it('should notify listeners on key state change', () => {
    const callback = vi.fn();
    keyboard.addListener(callback);
    keyboard.handleKeyDown({ code: 'ArrowLeft' });
    expect(callback).toHaveBeenCalled();
  });

  it('should return copy of keys to prevent mutation', () => {
    const keys1 = keyboard.getKeys();
    keys1.left = true;
    const keys2 = keyboard.getKeys();
    expect(keys2.left).toBe(false);
  });

  it('should ignore unknown key codes', () => {
    keyboard.handleKeyDown({ code: 'KeyX' });
    const keys = keyboard.getKeys();
    expect(keys.left).toBe(false);
    expect(keys.right).toBe(false);
    expect(keys.thrust).toBe(false);
  });
});
