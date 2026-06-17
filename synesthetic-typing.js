/**
 * SynestheticTyping - VHS-style rainbow typing effects
 * Transforms any text input into a synesthetic, rhythm-based experience
 *
 * Like Tetris Effect/Lumines but for typing
 *
 * @author Pablo Alvarado (pibulus)
 * @version 1.0.0
 * @license MIT
 */

class SynestheticTyping {
  constructor(options = {}) {
    // Core configuration
    this.target = options.target || document.body;
    this.colors = options.colors || [
      '#ff0080', // Brutal Pink
      '#ffff00', // Electric Yellow
      '#ff8000', // Neon Orange
      '#c080ff', // Punk Purple
      '#00ffff', // Cyber Blue
      '#00ff80'  // Neo Green
    ];

    // Performance settings
    this.maxTrailLength = options.maxTrailLength || 15;
    this.effectIntensity = options.effectIntensity || 1.0;
    this.soundEnabled = options.soundEnabled || false;

    // Typing analysis
    this.lastKeyTime = 0;
    this.typingSpeed = 0;
    this.currentColorIndex = 0;
    this.letterTrail = [];

    // Special trigger characters
    this.wordCompleteChars = options.wordCompleteChars || [' ', '.', '!', '?', '\n'];

    // Audio context (if sound enabled)
    this.audioContext = null;
    this.soundBuffers = [];

    this.init();
  }

  init() {
    this.injectStyles();
    this.setupAudio();
    this.bindEvents();
    console.log('🌈 SynestheticTyping initialized');
  }

  injectStyles() {
    // Inject minimal required CSS if not already present
    if (document.getElementById('synesthetic-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'synesthetic-styles';
    styleSheet.textContent = `
      @keyframes synesthetic-trail {
        0% {
          opacity: 1;
          transform: translateX(0) translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateX(-30px) translateY(-10px) scale(0.8);
        }
      }

      @keyframes word-complete-ring {
        0% {
          opacity: 1;
          transform: scale(0) rotate(0deg);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.5) rotate(180deg);
        }
        100% {
          opacity: 0;
          transform: scale(2.5) rotate(360deg);
        }
      }

      @keyframes command-explosion {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(var(--end-x), var(--end-y)) scale(0.5);
        }
      }

      @keyframes comet-trail {
        0% {
          opacity: 1;
          transform: translateX(0);
        }
        100% {
          opacity: 0;
          transform: translateX(100px);
        }
      }

      .synesthetic-particle {
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  setupAudio() {
    if (!this.soundEnabled) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🔊 Audio context ready');
    } catch (error) {
      console.log('🔇 Audio not available:', error.message);
      this.soundEnabled = false;
    }
  }

  bindEvents() {
    // Auto-detect text inputs and make them magical
    this.observeTextInputs();

    // Listen for dynamic content
    const observer = new MutationObserver(() => this.observeTextInputs());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  observeTextInputs() {
    // Find all text inputs, textareas, and contenteditable elements
    const inputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');

    inputs.forEach(input => {
      if (input.dataset.synestheticEnabled) return; // Already enabled

      input.dataset.synestheticEnabled = 'true';

      input.addEventListener('input', (e) => this.onInput(e));
      input.addEventListener('keydown', (e) => this.onKeyDown(e));
    });
  }

  onKeyDown(e) {
    const currentTime = Date.now();
    this.typingSpeed = currentTime - this.lastKeyTime;
    this.lastKeyTime = currentTime;

    // Play sound effect
    this.playKeySound();

    // Handle special keys
    if (e.key === 'Enter') {
      this.createCommandCompleteEffect(e.target);
    }
  }

  onInput(e) {
    const target = e.target;
    const inputType = e.inputType;

    // Skip if deletion
    if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
      return;
    }

    // Get cursor position for effects
    const selection = window.getSelection();
    let rect;

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    } else {
      rect = target.getBoundingClientRect();
    }

    // Calculate typing intensity (0-1, higher = faster typing)
    const intensity = this.calculateIntensity();

    // Create effects based on intensity
    this.createTypingEffects(rect, intensity, e.data);
  }

  calculateIntensity() {
    // Convert typing speed to intensity (0-1)
    // Faster typing (lower delay) = higher intensity
    const maxSpeed = 300; // ms between keys for minimum intensity
    const intensity = Math.max(0, Math.min(1, (maxSpeed - this.typingSpeed) / maxSpeed));
    return intensity * this.effectIntensity;
  }

  createTypingEffects(rect, intensity, char) {
    // Always create basic trail
    this.createBasicTrail(rect);

    // Progressive enhancement based on intensity
    if (intensity > 0.3) {
      this.createSparkles(rect, intensity);
    }

    if (intensity > 0.7) {
      this.createBonusEffect(rect);
    }

    // Special effects for word completion
    if (char && this.wordCompleteChars.includes(char)) {
      this.createWordCompleteEffect(rect);
    }
  }

  createBasicTrail(rect) {
    const trail = document.createElement('div');
    const color = this.colors[this.currentColorIndex % this.colors.length];

    trail.className = 'synesthetic-particle';
    trail.style.cssText = `
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 3px;
      height: 3px;
      background: ${color};
      box-shadow: 0 0 10px ${color};
      animation: synesthetic-trail 0.6s ease-out forwards;
    `;

    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 600);

    this.currentColorIndex++;
  }

  createSparkles(rect, intensity) {
    const sparkleCount = Math.floor(intensity * 3);

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      const color = this.colors[(this.currentColorIndex + i) % this.colors.length];
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;

      sparkle.className = 'synesthetic-particle';
      sparkle.style.cssText = `
        left: ${rect.left + rect.width / 2 + offsetX}px;
        top: ${rect.top + rect.height / 2 + offsetY}px;
        width: 2px;
        height: 2px;
        background: ${color};
        box-shadow: 0 0 8px ${color};
        animation: synesthetic-trail 0.4s ease-out forwards;
      `;

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 400);
    }
  }

  createWordCompleteEffect(rect) {
    // Ring explosion effect
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      const color = this.colors[i % this.colors.length];

      particle.className = 'synesthetic-particle';
      particle.style.cssText = `
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 3px;
        height: 3px;
        background: ${color};
        box-shadow: 0 0 12px ${color};
        animation: word-complete-ring 0.6s ease-out forwards;
      `;

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  }

  createCommandCompleteEffect(target) {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create explosion effect
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 100 + Math.random() * 50;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      const explosion = document.createElement('div');
      const color = this.colors[i % this.colors.length];

      explosion.className = 'synesthetic-particle';
      explosion.style.cssText = `
        left: ${centerX}px;
        top: ${centerY}px;
        width: 4px;
        height: 4px;
        background: ${color};
        box-shadow: 0 0 20px ${color};
        animation: command-explosion 0.8s ease-out forwards;
        --end-x: ${endX - centerX}px;
        --end-y: ${endY - centerY}px;
      `;

      document.body.appendChild(explosion);
      setTimeout(() => explosion.remove(), 800);
    }
  }

  createBonusEffect(rect) {
    // Random comet effect for high-speed typing
    const comet = document.createElement('div');
    const color = this.colors[this.currentColorIndex % this.colors.length];

    comet.className = 'synesthetic-particle';
    comet.style.cssText = `
      left: ${rect.left - 50}px;
      top: ${rect.top + rect.height / 2}px;
      width: 2px;
      height: 2px;
      background: ${color};
      box-shadow: 0 0 15px ${color}, -10px 0 30px ${color}80, -20px 0 50px ${color}40;
      animation: comet-trail 0.8s ease-out forwards;
    `;

    document.body.appendChild(comet);
    setTimeout(() => comet.remove(), 800);
  }

  playKeySound() {
    if (!this.soundEnabled || !this.audioContext) return;

    // Simple synthesized key sound
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);

    } catch (error) {
      console.log('🔇 Sound error:', error);
    }
  }

  // Public API
  enable() {
    this.observeTextInputs();
  }

  disable() {
    // Remove event listeners and mark inputs as disabled
    const inputs = document.querySelectorAll('[data-synesthetic-enabled="true"]');
    inputs.forEach(input => {
      delete input.dataset.synestheticEnabled;
    });
  }

  setColors(colors) {
    this.colors = colors;
  }

  setIntensity(intensity) {
    this.effectIntensity = Math.max(0, Math.min(1, intensity));
  }
}

// Auto-initialize if not in module environment
if (typeof window !== 'undefined' && !window.SynestheticTyping) {
  window.SynestheticTyping = SynestheticTyping;

  // Auto-start with default settings unless explicitly disabled
  if (!document.body.dataset.synestheticDisabled) {
    document.addEventListener('DOMContentLoaded', () => {
      new SynestheticTyping();
    });
  }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SynestheticTyping;
}

export default SynestheticTyping;