// Level parser for enhanced .def format with metadata
// Supports both original .def and enhanced format with metadata

export function parseLevel(defContent) {
  const lines = defContent.split('\n');
  const level = {
    metadata: {},
    colors: {},
    dimensions: {},
    layout: []
  };

  let section = 'metadata';
  let layoutStarted = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      // Check for section markers
      if (trimmed.includes('Colors')) {
        section = 'colors';
      } else if (trimmed.includes('Level dimensions')) {
        section = 'dimensions';
      } else if (trimmed.includes('Level layout')) {
        section = 'layout';
        layoutStarted = true;
      }
      continue;
    }

    if (layoutStarted) {
      // Parse ASCII layout
      level.layout.push(trimmed);
    } else {
      // Parse key-value pairs
      const match = trimmed.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        
        // Remove quotes from string values
        const cleanValue = value.replace(/^"|"$/g, '');
        
        if (section === 'metadata') {
          level.metadata[key] = cleanValue;
        } else if (section === 'colors') {
          const colorValues = value.split(' ').map(Number);
          level.colors[key] = colorValues;
        } else if (section === 'dimensions') {
          level.dimensions[key] = Number(value);
        }
      }
    }
  }

  return level;
}

export function parseLevelJSON(jsonContent) {
  try {
    return JSON.parse(jsonContent);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}
