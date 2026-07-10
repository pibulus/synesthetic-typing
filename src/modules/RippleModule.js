/**
 * RippleModule - Ripple effects that emanate from typing
 *
 * Creates expanding ripples like water drops
 */

export class RippleModule {
  constructor(options = {}) {
    this.name = 'ripple';
    this.config = {
      enabled: true,
      color: options.color || '#ff0080',
      size: options.size || 80,
      duration: options.duration || 600,
      style: options.style || 'circle', // circle, square, star
      multiRipple: options.multiRipple ?? true,
      fadeOut: options.fadeOut ?? true,
      ...options
    };

    this.engine = null;
  }

  init(engine) {
    this.engine = engine;
    this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById('juicy-ripple-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'juicy-ripple-styles';
    styles.textContent = `
      @keyframes juicy-ripple-expand {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        70% {
          transform: scale(1);
          opacity: 0.5;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }

      @keyframes juicy-ripple-pulse {
        0% {
          transform: scale(0.95);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.05);
          opacity: 1;
        }
        100% {
          transform: scale(0.95);
          opacity: 0.8;
        }
      }

      .juicy-ripple {
        position: fixed;
        pointer-events: none;
        z-index: 99996;
        transform-origin: center;
      }

      .juicy-ripple-circle {
        border-radius: 50%;
        border: 2px solid currentColor;
      }

      .juicy-ripple-square {
        border: 2px solid currentColor;
      }

      .juicy-ripple-star {
        background: currentColor;
        clip-path: polygon(
          50% 0%, 61% 35%, 98% 35%, 68% 57%,
          79% 91%, 50% 70%, 21% 91%, 32% 57%,
          2% 35%, 39% 35%
        );
      }
    `;
    document.head.appendChild(styles);
  }

  onKeyDown(context) {
    if (!this.config.enabled) return;

    const { cursorPosition, intensity } = context;

    // Create main ripple
    this.createRipple(cursorPosition, intensity);

    // Create secondary ripples for multi-ripple effect
    if (this.config.multiRipple && intensity > 0.5) {
      setTimeout(() => {
        this.createRipple(cursorPosition, intensity * 0.7);
      }, 100);

      if (intensity > 0.8) {
        setTimeout(() => {
          this.createRipple(cursorPosition, intensity * 0.5);
        }, 200);
      }
    }
  }

  createRipple(position, intensity) {
    const ripple = document.createElement('div');
    ripple.className = `juicy-ripple juicy-ripple-${this.config.style}`;

    const size = this.config.size * (0.8 + intensity * 0.4);
    const duration = this.config.duration * (0.8 + intensity * 0.4);
    const color = this.getColor(intensity);

    ripple.style.cssText = `
      left: ${position.x - size / 2}px;
      top: ${position.y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      color: ${color};
      opacity: ${0.6 + intensity * 0.4};
      animation: juicy-ripple-expand ${duration}ms cubic-bezier(0, 0, 0.2, 1) forwards;
    `;

    if (this.config.style === 'star') {
      ripple.style.border = 'none';
    }

    (this.config.container || document.body).appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, duration);
  }

  getColor(intensity) {
    if (typeof this.config.color === 'function') {
      return this.config.color(intensity);
    }

    // Add intensity-based color variation
    if (this.config.color.startsWith('#')) {
      // Lighten color based on intensity
      const hex = this.config.color.slice(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      const factor = 1 + intensity * 0.3;
      const newR = Math.min(255, Math.floor(r * factor));
      const newG = Math.min(255, Math.floor(g * factor));
      const newB = Math.min(255, Math.floor(b * factor));

      return `rgb(${newR}, ${newG}, ${newB})`;
    }

    return this.config.color;
  }

  // Special effect for Enter key
  onKeyUp(context) {
    if (!this.config.enabled) return;

    if (context.key === 'Enter') {
      this.createBigRipple(context.cursorPosition);
    }
  }

  createBigRipple(position) {
    // Create 3 expanding ripples
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'juicy-ripple juicy-ripple-circle';

        const size = this.config.size * 2;
        const duration = this.config.duration * 1.5;

        ripple.style.cssText = `
          left: ${position.x - size / 2}px;
          top: ${position.y - size / 2}px;
          width: ${size}px;
          height: ${size}px;
          color: ${this.config.color};
          opacity: ${0.8 - i * 0.2};
          animation: juicy-ripple-expand ${duration}ms cubic-bezier(0, 0, 0.2, 1) forwards;
        `;

        (this.config.container || document.body).appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, duration);
      }, i * 150);
    }
  }

  setConfig(config) {
    Object.assign(this.config, config);
  }

  enable() {
    this.config.enabled = true;
  }

  disable() {
    this.config.enabled = false;
  }

  destroy() {
    const styles = document.getElementById('juicy-ripple-styles');
    if (styles) {
      styles.remove();
    }
  }
}

export default RippleModule;