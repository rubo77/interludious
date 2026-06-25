import { describe, it, expect } from 'vitest';
import { validateLevel } from '../../src/levels/level-validator.js';

describe('Level Validator', () => {
  it('should validate a complete valid level', () => {
    const level = {
      metadata: { NAME: 'Test', AUTHOR: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail if metadata is missing', () => {
    const level = {
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Level must have metadata section');
  });

  it('should fail if colors are missing', () => {
    const level = {
      metadata: { NAME: 'Test' },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Level must have colors section');
  });

  it('should fail if color values are invalid (out of range)', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [300, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('must be between 0 and 255'))).toBe(true);
  });

  it('should fail if color array has wrong length', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24] },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Color BG_COLOR must be an array of 3 values');
  });

  it('should fail if dimensions are missing', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Level must have dimensions section');
  });

  it('should fail if width is out of range', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 5, HEIGHT: 60 },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('WIDTH must be between 10 and 200'))).toBe(true);
  });

  it('should fail if height is out of range', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 300 },
      layout: ['****r****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('HEIGHT must be between 10 and 200'))).toBe(true);
  });

  it('should fail if layout is missing', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 60 }
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Level must have layout section');
  });

  it('should fail if no restart point in layout', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****p****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Level must have at least one restart point'))).toBe(true);
  });

  it('should fail if no pod in layout', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****r****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Level must have at least one pod'))).toBe(true);
  });

  it('should warn about invalid characters in layout', () => {
    const level = {
      metadata: { NAME: 'Test' },
      colors: { BG_COLOR: [189, 24, 33] },
      dimensions: { WIDTH: 82, HEIGHT: 60 },
      layout: ['****r****p****x****']
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("Invalid character 'x' in layout");
  });

  it('should return multiple errors for invalid level', () => {
    const level = {
      metadata: {},
      colors: {},
      dimensions: {},
      layout: []
    };
    const result = validateLevel(level);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
