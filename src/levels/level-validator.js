// Level validator for checking level syntax and structure

export function validateLevel(level) {
  const errors = [];
  const warnings = [];

  // Check required metadata
  if (!level.metadata || Object.keys(level.metadata).length === 0) {
    errors.push('Level must have metadata section');
  }

  // Check required colors
  if (!level.colors || Object.keys(level.colors).length === 0) {
    errors.push('Level must have colors section');
  } else {
    // Validate color values (0-255)
    for (const [key, color] of Object.entries(level.colors)) {
      if (!Array.isArray(color) || color.length !== 3) {
        errors.push(`Color ${key} must be an array of 3 values`);
      } else {
        color.forEach((value, index) => {
          if (value < 0 || value > 255) {
            errors.push(`Color ${key} value ${index} must be between 0 and 255, got ${value}`);
          }
        });
      }
    }
  }

  // Check required dimensions
  if (!level.dimensions || Object.keys(level.dimensions).length === 0) {
    errors.push('Level must have dimensions section');
  } else {
    // Validate width
    if (level.dimensions.WIDTH) {
      if (level.dimensions.WIDTH < 10 || level.dimensions.WIDTH > 200) {
        errors.push(`WIDTH must be between 10 and 200, got ${level.dimensions.WIDTH}`);
      }
    }

    // Validate height
    if (level.dimensions.HEIGHT) {
      if (level.dimensions.HEIGHT < 10 || level.dimensions.HEIGHT > 200) {
        errors.push(`HEIGHT must be between 10 and 200, got ${level.dimensions.HEIGHT}`);
      }
    }
  }

  // Check layout
  if (!level.layout || level.layout.length === 0) {
    errors.push('Level must have layout section');
  } else {
    // Check for required elements (at least one restart point 'r' and one pod 'p')
    let hasRestartPoint = false;
    let hasPod = false;
    const validChars = new Set(['*', '#', 'r', 'R', 'p', 'm', 'M', 'a', 'b', 'c', 'd', '1', '2', '3', '4', ' ', '.']);

    for (const row of level.layout) {
      for (const char of row) {
        if (char === 'r' || char === 'R') {
          hasRestartPoint = true;
        }
        if (char === 'p') {
          hasPod = true;
        }
        if (!validChars.has(char)) {
          warnings.push(`Invalid character '${char}' in layout`);
        }
      }
    }

    if (!hasRestartPoint) {
      errors.push('Level must have at least one restart point (r or R)');
    }
    if (!hasPod) {
      errors.push('Level must have at least one pod (p)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
