/**
 * JuicyTyping Themes
 *
 * Curated color palettes and effect configurations
 * All themes follow Pablo's aesthetic: pastel-punk with personality
 */

export const themes = {
  // ===================================================================
  // PABLO'S SIGNATURE THEMES
  // ===================================================================

  'brutal-rainbow': {
    name: 'Brutal Rainbow',
    description: 'High-energy VHS aesthetic',
    colors: [
      '#ff0080', // Brutal Pink
      '#ffff00', // Electric Yellow
      '#ff8000', // Neon Orange
      '#c080ff', // Punk Purple
      '#00ffff', // Cyber Blue
      '#00ff80'  // Neo Green
    ],
    trail: {
      style: 'vhs',
      intensity: 1.0,
      ghosting: true
    },
    sparkle: {
      colors: 'rainbow',
      size: 'medium',
      burstMode: true
    },
    ripple: {
      color: '#ff0080',
      size: 80,
      duration: 600
    }
  },

  'pastel-dream': {
    name: 'Pastel Dream',
    description: 'Soft, dreamy pastels with gentle effects',
    colors: [
      '#ffb3ba', // Pastel Pink
      '#ffdfba', // Pastel Peach
      '#ffffba', // Pastel Yellow
      '#baffc9', // Pastel Green
      '#bae1ff', // Pastel Blue
      '#e0bbff'  // Pastel Purple
    ],
    trail: {
      style: 'pastel',
      intensity: 0.7,
      ghosting: false
    },
    sparkle: {
      colors: ['#ffb3ba', '#bae1ff', '#ffffba'],
      size: 'small',
      burstMode: false
    },
    ripple: {
      color: '#ffb3ba',
      size: 60,
      duration: 800
    }
  },

  'cyberpunk-neon': {
    name: 'Cyberpunk Neon',
    description: 'Glowing neon with electric bursts',
    colors: [
      '#ff00ff', // Magenta
      '#00ffff', // Cyan
      '#ffff00', // Yellow
      '#ff0080', // Hot Pink
      '#00ff80'  // Matrix Green
    ],
    trail: {
      style: 'neon',
      intensity: 1.2,
      ghosting: true
    },
    sparkle: {
      colors: 'gradient',
      size: 'large',
      burstMode: true,
      gravity: false
    },
    ripple: {
      color: '#00ffff',
      size: 100,
      duration: 400
    }
  },

  'wizard-purple': {
    name: 'Wizard Purple',
    description: 'Mystical purples with magical sparkles',
    colors: [
      '#8b00ff', // Electric Purple
      '#bf40bf', // Medium Purple
      '#da70d6', // Orchid
      '#9370db', // Medium Purple
      '#8a2be2', // Blue Violet
      '#9400d3'  // Violet
    ],
    trail: {
      style: 'rainbow',
      intensity: 0.8,
      ghosting: true
    },
    sparkle: {
      colors: ['#8b00ff', '#da70d6', '#ffffff'],
      size: 'small',
      burstMode: true,
      gravity: true // Magical falling sparkles
    },
    ripple: {
      color: '#8b00ff',
      size: 70,
      duration: 700
    }
  },

  'sunset-vibes': {
    name: 'Sunset Vibes',
    description: 'Warm gradient from orange to purple',
    colors: [
      '#ff6b35', // Sunset Orange
      '#f77b71', // Coral
      '#ee6c4d', // Burnt Sienna
      '#c76d7e', // Dusty Rose
      '#9d6ea4', // Purple
      '#7d6fa3'  // Deep Purple
    ],
    trail: {
      style: 'rainbow',
      intensity: 0.9,
      ghosting: false
    },
    sparkle: {
      colors: 'gradient',
      size: 'medium',
      burstMode: false
    },
    ripple: {
      color: '#ff6b35',
      size: 75,
      duration: 650
    }
  },

  'ocean-wave': {
    name: 'Ocean Wave',
    description: 'Cool blues and teals with flowing effects',
    colors: [
      '#0077be', // Ocean Blue
      '#00a8cc', // Cyan Blue
      '#00c9d0', // Turquoise
      '#5eb3c2', // Sky Blue
      '#89cff0', // Baby Blue
      '#a1e5f3'  // Pale Cyan
    ],
    trail: {
      style: 'rainbow',
      intensity: 0.7,
      ghosting: true
    },
    sparkle: {
      colors: ['#00c9d0', '#89cff0', '#ffffff'],
      size: 'small',
      burstMode: false,
      gravity: true // Water droplets
    },
    ripple: {
      color: '#0077be',
      size: 90,
      duration: 900
    }
  },

  'matrix-green': {
    name: 'Matrix Green',
    description: 'Digital rain effect in green',
    colors: [
      '#00ff00', // Bright Green
      '#00cc00', // Medium Green
      '#009900', // Dark Green
      '#33ff33', // Light Green
      '#66ff66', // Pale Green
      '#00ff80'  // Mint Green
    ],
    trail: {
      style: 'vhs',
      intensity: 1.0,
      ghosting: true
    },
    sparkle: {
      colors: ['#00ff00', '#00cc00', '#ffffff'],
      size: 'small',
      burstMode: false,
      gravity: true // Falling code
    },
    ripple: {
      color: '#00ff00',
      size: 60,
      duration: 500
    }
  },

  'cotton-candy': {
    name: 'Cotton Candy',
    description: 'Soft pinks and blues',
    colors: [
      '#ffb6c1', // Light Pink
      '#ffc0cb', // Pink
      '#ffddee', // Pale Pink
      '#b6e1ff', // Light Blue
      '#c8e6ff', // Pale Blue
      '#e6f3ff'  // Very Pale Blue
    ],
    trail: {
      style: 'pastel',
      intensity: 0.6,
      ghosting: false
    },
    sparkle: {
      colors: ['#ffb6c1', '#b6e1ff', '#ffffff'],
      size: 'small',
      burstMode: false
    },
    ripple: {
      color: '#ffb6c1',
      size: 50,
      duration: 1000
    }
  },

  'fire-ice': {
    name: 'Fire & Ice',
    description: 'Hot reds meet cool blues',
    colors: [
      '#ff4444', // Red
      '#ff6666', // Light Red
      '#ff8888', // Pale Red
      '#4444ff', // Blue
      '#6666ff', // Light Blue
      '#8888ff'  // Pale Blue
    ],
    trail: {
      style: 'neon',
      intensity: 1.0,
      ghosting: true
    },
    sparkle: {
      colors: ['#ff4444', '#4444ff', '#ffffff'],
      size: 'medium',
      burstMode: true
    },
    ripple: {
      color: '#ff4444',
      size: 85,
      duration: 550
    }
  },

  'minimal-mono': {
    name: 'Minimal Mono',
    description: 'Clean monochrome with subtle effects',
    colors: [
      '#ffffff', // White
      '#e0e0e0', // Light Gray
      '#c0c0c0', // Silver
      '#a0a0a0', // Gray
      '#808080', // Dark Gray
      '#606060'  // Darker Gray
    ],
    trail: {
      style: 'rainbow',
      intensity: 0.5,
      ghosting: false
    },
    sparkle: {
      colors: 'monochrome',
      size: 'small',
      burstMode: false
    },
    ripple: {
      color: '#ffffff',
      size: 40,
      duration: 400
    }
  }
};

// ===================================================================
// THEME UTILITIES
// ===================================================================

export function getTheme(name) {
  return themes[name] || themes['brutal-rainbow'];
}

export function getThemeNames() {
  return Object.keys(themes);
}

export function getRandomTheme() {
  const names = getThemeNames();
  return themes[names[Math.floor(Math.random() * names.length)]];
}

// Create a custom theme from user preferences
export function createCustomTheme(options) {
  return {
    name: options.name || 'Custom',
    description: options.description || 'Custom theme',
    colors: options.colors || themes['brutal-rainbow'].colors,
    trail: {
      style: options.trailStyle || 'rainbow',
      intensity: options.trailIntensity ?? 1.0,
      ghosting: options.ghosting ?? true
    },
    sparkle: {
      colors: options.sparkleColors || 'rainbow',
      size: options.sparkleSize || 'medium',
      burstMode: options.burstMode ?? true,
      gravity: options.gravity ?? false
    },
    ripple: {
      color: options.rippleColor || '#ff0080',
      size: options.rippleSize || 80,
      duration: options.rippleDuration || 600
    }
  };
}

// Apply theme to modules
export function applyTheme(theme, modules) {
  // Apply colors to trail module
  if (modules.trail && theme.trail) {
    modules.trail.setConfig({
      colors: theme.colors,
      style: theme.trail.style,
      intensity: theme.trail.intensity,
      ghosting: theme.trail.ghosting
    });
  }

  // Apply to sparkle module
  if (modules.sparkle && theme.sparkle) {
    modules.sparkle.setConfig({
      colors: theme.sparkle.colors === 'rainbow' ? theme.colors : theme.sparkle.colors,
      size: theme.sparkle.size,
      burstMode: theme.sparkle.burstMode,
      gravity: theme.sparkle.gravity
    });
  }

  // Apply to ripple module
  if (modules.ripple && theme.ripple) {
    modules.ripple.setConfig({
      color: theme.ripple.color,
      size: theme.ripple.size,
      duration: theme.ripple.duration
    });
  }
}

export default themes;