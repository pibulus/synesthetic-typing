/**
 * SparkleModule - Magical sparkles and particle bursts
 *
 * Creates sparkle effects based on typing speed and rhythm
 */

export class SparkleModule {
  constructor(options = {}) {
    this.name = 'sparkle';
    this.config = {
      enabled: true,
      threshold: options.threshold || 0.3, // Minimum intensity to trigger sparkles
      particleCount: options.particleCount || 5,
      burstMode: options.burstMode ?? true, // Burst on fast typing
      colors: options.colors || 'rainbow', // rainbow, monochrome, gradient
      size: options.size || 'small', // small, medium, large
      spread: options.spread || 30, // Pixel spread radius
      gravity: options.gravity ?? false, // Apply gravity effect
      ...options
    };

    this.engine = null;
    this.lastBurstTime = 0;
    this.burstCooldown = 200; // ms between bursts
  }

  init(engine) {
    this.engine = engine;
    this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById('juicy-sparkle-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'juicy-sparkle-styles';
    styles.textContent = `
      @keyframes juicy-sparkle {
        0% {
          opacity: 0;
          transform: scale(0) rotate(0deg);
        }
        20% {
          opacity: 1;
          transform: scale(1) rotate(90deg);
        }
        100% {
          opacity: 0;
          transform: scale(0.3) rotate(180deg);
        }
      }

      @keyframes juicy-sparkle-fall {
        0% {
          opacity: 0;
          transform: translateY(0) scale(0);
        }
        20% {
          opacity: 1;
          transform: translateY(5px) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(30px) scale(0.5);
        }
      }

      @keyframes juicy-sparkle-burst {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(0.5);
        }
        50% {
          opacity: 0.8;
          transform: translate(var(--burst-x), var(--burst-y)) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(calc(var(--burst-x) * 2), calc(var(--burst-y) * 2)) scale(0.2);
        }
      }

      @keyframes juicy-sparkle-spin {
        0% {
          transform: rotate(0deg) scale(1);
          opacity: 1;
        }
        100% {
          transform: rotate(720deg) scale(0);
          opacity: 0;
        }
      }

      .juicy-sparkle {
        position: fixed;
        pointer-events: none;
        z-index: 99997;
      }

      .juicy-sparkle-star {
        width: 100%;
        height: 100%;
        background: currentColor;
        clip-path: polygon(
          50% 0%, 61% 35%, 98% 35%, 68% 57%,
          79% 91%, 50% 70%, 21% 91%, 32% 57%,
          2% 35%, 39% 35%
        );
      }

      .juicy-sparkle-diamond {
        width: 100%;
        height: 100%;
        background: currentColor;
        transform: rotate(45deg);
      }

      .juicy-sparkle-circle {
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, currentColor 0%, transparent 70%);
        border-radius: 50%;
      }
    `;
    document.head.appendChild(styles);
  }

  onKeyDown(context) {
    if (!this.config.enabled) return;

    const { intensity, cursorPosition } = context;

    // Check threshold
    if (intensity < this.config.threshold) return;

    // Create sparkles based on intensity
    const sparkleCount = Math.floor(
      this.config.particleCount * (intensity / this.config.threshold)
    );

    // Check for burst mode
    const now = Date.now();
    const shouldBurst = this.config.burstMode &&
      intensity > 0.7 &&
      (now - this.lastBurstTime) > this.burstCooldown;

    if (shouldBurst) {
      this.createBurst(cursorPosition, intensity);
      this.lastBurstTime = now;
    } else {
      this.createSparkles(cursorPosition, sparkleCount, intensity);
    }
  }

  createSparkles(position, count, intensity) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createSingleSparkle(position, intensity, i);
      }, i * 20); // Stagger creation
    }
  }

  createSingleSparkle(position, intensity, index) {
    const sparkle = document.createElement('div');
    sparkle.className = 'juicy-sparkle';

    // Determine size
    const sizeMap = {
      'small': 4 + intensity * 2,
      'medium': 6 + intensity * 4,
      'large': 8 + intensity * 6
    };
    const size = sizeMap[this.config.size] || sizeMap['small'];

    // Random position within spread
    const angle = (Math.PI * 2 * index) / this.config.particleCount + Math.random();
    const distance = this.config.spread * (0.5 + Math.random() * 0.5);
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    // Get color
    const color = this.getSparkleColor(index);

    // Choose shape
    const shapes = ['star', 'diamond', 'circle'];
    const shape = shapes[index % shapes.length];
    const inner = document.createElement('div');
    inner.className = `juicy-sparkle-${shape}`;

    sparkle.appendChild(inner);

    // Apply styles
    const animation = this.config.gravity ? 'juicy-sparkle-fall' : 'juicy-sparkle';
    const duration = 400 + Math.random() * 200;

    sparkle.style.cssText = `
      left: ${position.x + offsetX}px;
      top: ${position.y + offsetY}px;
      width: ${size}px;
      height: ${size}px;
      color: ${color};
      filter: drop-shadow(0 0 ${size / 2}px ${color});
      animation: ${animation} ${duration}ms ease-out forwards;
    `;

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, duration);
  }

  createBurst(position, intensity) {
    const burstCount = 12 + Math.floor(intensity * 8);

    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount;
      const distance = 50 + Math.random() * 30;
      const burstX = Math.cos(angle) * distance;
      const burstY = Math.sin(angle) * distance;

      const particle = document.createElement('div');
      particle.className = 'juicy-sparkle';

      const size = 2 + Math.random() * 3;
      const color = this.getSparkleColor(i);
      const duration = 600 + Math.random() * 200;

      particle.style.cssText = `
        left: ${position.x}px;
        top: ${position.y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 ${size * 2}px ${color};
        --burst-x: ${burstX}px;
        --burst-y: ${burstY}px;
        animation: juicy-sparkle-burst ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      `;

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, duration);
    }

    // Add a central flash
    this.createFlash(position, intensity);
  }

  createFlash(position, intensity) {
    const flash = document.createElement('div');
    flash.className = 'juicy-sparkle';

    const size = 20 + intensity * 20;
    const color = this.getSparkleColor(0);

    flash.style.cssText = `
      left: ${position.x - size / 2}px;
      top: ${position.y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color}80 0%, transparent 70%);
      border-radius: 50%;
      animation: juicy-sparkle-spin 300ms ease-out forwards;
    `;

    document.body.appendChild(flash);

    setTimeout(() => {
      flash.remove();
    }, 300);
  }

  getSparkleColor(index) {
    if (this.config.colors === 'rainbow') {
      const rainbowColors = [
        '#ff0080', '#ff8000', '#ffff00',
        '#00ff80', '#00ffff', '#c080ff'
      ];
      return rainbowColors[index % rainbowColors.length];
    } else if (this.config.colors === 'monochrome') {
      return '#ffffff';
    } else if (this.config.colors === 'gradient') {
      const hue = (index * 30) % 360;
      return `hsl(${hue}, 100%, 60%)`;
    } else if (Array.isArray(this.config.colors)) {
      return this.config.colors[index % this.config.colors.length];
    }

    return '#ffff00'; // Default yellow
  }

  // Special effects for specific keys
  onInput(context) {
    if (!this.config.enabled) return;

    // Special effect for space bar (word completion)
    if (context.char === ' ') {
      this.createWordCompleteEffect(context.cursorPosition);
    }
  }

  createWordCompleteEffect(position) {
    // Ring of sparkles
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = 20;
      const x = position.x + Math.cos(angle) * distance;
      const y = position.y + Math.sin(angle) * distance;

      this.createSingleSparkle({ x, y }, 0.8, i);
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
    const styles = document.getElementById('juicy-sparkle-styles');
    if (styles) {
      styles.remove();
    }
  }
}

export default SparkleModule;