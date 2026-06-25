import { describe, it, expect } from 'vitest';
import { parseLevel, parseLevelJSON } from '../../src/levels/level-parser.js';

describe('Level Parser', () => {
  describe('parseLevel (.def format)', () => {
    it('should parse metadata section', () => {
      const defContent = `
# Metadata section
NAME: "Crystal Caves"
AUTHOR: "Player"
DIFFICULTY: 3
VERSION: 1.0
`;
      const result = parseLevel(defContent);
      expect(result.metadata.NAME).toBe('Crystal Caves');
      expect(result.metadata.AUTHOR).toBe('Player');
      expect(result.metadata.DIFFICULTY).toBe('3');
      expect(result.metadata.VERSION).toBe('1.0');
    });

    it('should parse colors section', () => {
      const defContent = `
# Colors
BG_COLOR: 189 24 33
GUN_COLOR: 24 211 24
`;
      const result = parseLevel(defContent);
      expect(result.colors.BG_COLOR).toEqual([189, 24, 33]);
      expect(result.colors.GUN_COLOR).toEqual([24, 211, 24]);
    });

    it('should parse dimensions section', () => {
      const defContent = `
# Level dimensions
WIDTH: 82
HEIGHT: 60
START_HEIGHT: 17
`;
      const result = parseLevel(defContent);
      expect(result.dimensions.WIDTH).toBe(82);
      expect(result.dimensions.HEIGHT).toBe(60);
      expect(result.dimensions.START_HEIGHT).toBe(17);
    });

    it('should parse ASCII layout', () => {
      const defContent = `
# Level layout
********************
********************
********************
`;
      const result = parseLevel(defContent);
      expect(result.layout).toHaveLength(3);
      expect(result.layout[0]).toBe('********************');
    });

    it('should parse complete level with all sections', () => {
      const defContent = `
# Metadata section
NAME: "Test Level"
AUTHOR: "Test"

# Colors
BG_COLOR: 189 24 33

# Level dimensions
WIDTH: 82
HEIGHT: 60

# Level layout
********************
********************
`;
      const result = parseLevel(defContent);
      expect(result.metadata.NAME).toBe('Test Level');
      expect(result.colors.BG_COLOR).toEqual([189, 24, 33]);
      expect(result.dimensions.WIDTH).toBe(82);
      expect(result.layout).toHaveLength(2);
    });

    it('should handle empty lines and comments', () => {
      const defContent = `
# Comment
NAME: "Test"

# Another comment
# Level dimensions
WIDTH: 82
`;
      const result = parseLevel(defContent);
      expect(result.metadata.NAME).toBe('Test');
      expect(result.dimensions.WIDTH).toBe(82);
    });

    it('should return empty object for empty input', () => {
      const result = parseLevel('');
      expect(result.metadata).toEqual({});
      expect(result.colors).toEqual({});
      expect(result.dimensions).toEqual({});
      expect(result.layout).toEqual([]);
    });
  });

  describe('parseLevelJSON', () => {
    it('should parse valid JSON level', () => {
      const jsonContent = JSON.stringify({
        name: "Test Level",
        author: "Test",
        width: 82,
        height: 60,
        layout: ["********************"]
      });
      const result = parseLevelJSON(jsonContent);
      expect(result.name).toBe('Test Level');
      expect(result.width).toBe(82);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => parseLevelJSON('invalid json')).toThrow('Invalid JSON');
    });
  });
});
