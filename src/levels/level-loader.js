// Level loader for loading level files
export class LevelLoader {
  constructor() {
    this.levels = new Map();
    this.baseUrl = '/levels/';
  }

  async loadLevel(levelId) {
    if (this.levels.has(levelId)) {
      return this.levels.get(levelId);
    }

    try {
      const response = await fetch(`${this.baseUrl}${levelId}.def`);
      if (!response.ok) {
        throw new Error(`Failed to load level: ${levelId}`);
      }
      const content = await response.text();
      this.levels.set(levelId, content);
      return content;
    } catch (error) {
      console.error(`Error loading level ${levelId}:`, error);
      throw error;
    }
  }

  async loadAllLevels() {
    const levelIds = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];
    const levels = {};
    
    for (const levelId of levelIds) {
      try {
        levels[levelId] = await this.loadLevel(levelId);
      } catch (error) {
        console.error(`Failed to load ${levelId}:`, error);
      }
    }
    
    return levels;
  }

  getLevel(levelId) {
    return this.levels.get(levelId);
  }

  hasLevel(levelId) {
    return this.levels.has(levelId);
  }

  clearCache() {
    this.levels.clear();
  }

  getLoadedLevelIds() {
    return Array.from(this.levels.keys());
  }
}
