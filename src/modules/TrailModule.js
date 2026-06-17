/**
 * TrailModule - Rainbow trail effects that follow typing
 *
 * Creates colorful trails behind each keystroke with VHS-style ghosting
 */

export class TrailModule {
  constructor(options = {}) {
    this.name = 'trail';
    this.config = {
      enabled: true,
      maxTrailLength: options.maxTrailLength || 20,
      fadeTime: options.fadeTime || 800,
      colors: options.colors || [
        '#ff0080', // Brutal Pink
        '#ffff00', // Electric Yellow
        '#ff8000', // Neon Orange
        '#c080ff', // Punk Purple
        '#00ffff', // Cyber Blue
        '#00ff80'  // Neo Green
      ],
      style: options.style || 'rainbow', // rainbow, vhs, neon, pastel
      ghosting: options.ghosting ?? true,
      intensity: options.intensity || 1.0,
      ...options
    };

    this.trail = [];
    this.colorIndex = 0;
    this.engine = null;
    this.initialized = false;
  }

  init(engine) {
    this.engine = engine;
    this.injectStyles();
    this.initialized = true;
  }

  injectStyles() {
    if (document.getElementById('juicy-trail-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'juicy-trail-styles';
    styles.textContent = `
      /* Trail animations */
      @keyframes juicy-trail-fade {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(1);
          filter: blur(0px);
        }
        50% {
          opacity: 0.6;
          transform: translate(-15px, -5px) scale(1.1);
          filter: blur(0.5px);
        }
        100% {
          opacity: 0;
          transform: translate(-30px, -10px) scale(0.8);
          filter: blur(2px);
        }
      }

      @keyframes juicy-trail-vhs {
        0% {
          opacity: 1;
          transform: translateX(0) scaleX(1);
          filter: blur(0);
        }
        25% {
          transform: translateX(-5px) scaleX(1.02);
        }
        50% {
          opacity: 0.7;
          transform: translateX(-10px) scaleX(0.98);
          filter: blur(0.5px);
        }
        75% {
          transform: translateX(-15px) scaleX(1.01);
        }
        100% {
          opacity: 0;
          transform: translateX(-25px) scaleX(0.95);
          filter: blur(1.5px);
        }
      }

      @keyframes juicy-trail-neon {
        0% {
          opacity: 1;
          transform: scale(1);
          filter: brightness(2) saturate(2);
        }
        100% {
          opacity: 0;
          transform: scale(1.5);
          filter: brightness(0.5) saturate(0.5) blur(3px);
        }
      }

      @keyframes juicy-trail-pastel {
        0% {
          opacity: 0.8;
          transform: translate(0, 0) scale(1) rotate(0deg);
        }
        100% {
          opacity: 0;
          transform: translate(-20px, -20px) scale(0.5) rotate(180deg);
        }
      }

      /* Ghost letter styles */
      .juicy-ghost-letter {
        position: fixed;
        font-family: inherit;
        font-size: inherit;
        font-weight: bold;
        pointer-events: none;
        z-index: 99999;
        mix-blend-mode: screen;
        user-select: none;
      }

      /* Trail particle base */
      .juicy-trail-particle {
        position: fixed;
        pointer-events: none;
        z-index: 99998;
        border-radius: 50%;
        mix-blend-mode: screen;
      }
    `;
    document.head.appendChild(styles);
  }

  onKeyDown(context) {
    if (!this.config.enabled) return;

    const { cursorPosition, intensity, key } = context;

    // Skip modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(key)) {
      return;
    }

    // Add to trail history
    this.addToTrail(context);

    // Create main trail effect
    this.createTrailEffect(cursorPosition, intensity);

    // Create ghost letters if enabled
    if (this.config.ghosting && key.length === 1) {
      this.createGhostLetter(context);
    }
  }

  addToTrail(context) {
    this.trail.push({
      x: context.cursorPosition.x,
      y: context.cursorPosition.y,
      key: context.key,
      time: context.timestamp,
      color: this.getCurrentColor(),
      intensity: context.intensity
    });

    // Limit trail length
    if (this.trail.length > this.config.maxTrailLength) {
      this.trail.shift();
    }
  }

  createTrailEffect(position, intensity) {
    const scaledIntensity = intensity * this.config.intensity;
    const particleCount = Math.floor(1 + scaledIntensity * 3);

    for (let i = 0; i < particleCount; i++) {
      const delay = i * 20; // Stagger particles
      setTimeout(() => {
        this.createTrailParticle(position, scaledIntensity, i);
      }, delay);
    }
  }

  createTrailParticle(position, intensity, index) {
    const color = this.getCurrentColor();
    const size = 2 + intensity * 3 + Math.random() * 2;
    const offsetX = (Math.random() - 0.5) * (10 * intensity);
    const offsetY = (Math.random() - 0.5) * (10 * intensity);

    const animationMap = {
      'rainbow': 'juicy-trail-fade',
      'vhs': 'juicy-trail-vhs',
      'neon': 'juicy-trail-neon',
      'pastel': 'juicy-trail-pastel'
    };

    const animation = animationMap[this.config.style] || 'juicy-trail-fade';
    const duration = this.config.fadeTime + (index * 50);

    // Self-cleaning DOM particle — same pattern as Sparkle/Ripple modules
    // (the engine no longer keeps a shared pool; each module owns its nodes).
    const particle = document.createElement('div');
    particle.className = 'juicy-particle juicy-trail-particle';
    const glow = this.config.style === 'neon'
      ? `box-shadow: 0 0 ${10 + intensity * 10}px ${color};`
      : '';
    particle.style.cssText = `
      position: fixed;
      left: ${position.x + offsetX}px;
      top: ${position.y + offsetY}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 100000;
      will-change: transform, opacity;
      ${glow}
      animation: ${animation} ${duration}ms ease-out forwards;
    `;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration);

    this.colorIndex++;
  }

  createGhostLetter(context) {
    const { key, cursorPosition, intensity } = context;

    // Only create ghosts for actual characters
    if (key.length !== 1) return;

    const ghost = document.createElement('div');
    ghost.className = 'juicy-ghost-letter';
    ghost.textContent = key;

    const color = this.getCurrentColor();
    const opacity = 0.6 + intensity * 0.3;
    const blur = this.config.style === 'vhs' ? 1 : 0;

    ghost.style.cssText = `
      left: ${cursorPosition.x}px;
      top: ${cursorPosition.y}px;
      color: ${color};
      opacity: ${opacity};
      text-shadow:
        0 0 ${5 + intensity * 10}px ${color},
        ${intensity * 2}px 0 ${color}80,
        ${-intensity * 2}px 0 ${color}80;
      filter: blur(${blur}px);
      animation: juicy-trail-${this.config.style} ${this.config.fadeTime}ms ease-out forwards;
    `;

    document.body.appendChild(ghost);

    setTimeout(() => {
      ghost.remove();
    }, this.config.fadeTime);
  }

  getCurrentColor() {
    const colors = this.getColorPalette();
    return colors[this.colorIndex % colors.length];
  }

  getColorPalette() {
    // Style-specific color palettes
    const palettes = {
      'rainbow': this.config.colors,
      'vhs': ['#ff0080', '#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff8000'],
      'neon': ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#00ff80'],
      'pastel': ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e0bbff']
    };

    return palettes[this.config.style] || this.config.colors;
  }

  // Configuration methods
  setConfig(config) {
    Object.assign(this.config, config);
  }

  setStyle(style) {
    this.config.style = style;
  }

  setIntensity(intensity) {
    this.config.intensity = Math.max(0, Math.min(1, intensity));
  }

  enable() {
    this.config.enabled = true;
  }

  disable() {
    this.config.enabled = false;
  }

  destroy() {
    // Clean up styles
    const styles = document.getElementById('juicy-trail-styles');
    if (styles) {
      styles.remove();
    }

    // Clear trail
    this.trail = [];
  }
}

export default TrailModule;