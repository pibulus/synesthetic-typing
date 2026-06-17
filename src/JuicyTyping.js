/**
 * JuicyTyping - Modular Typing Effects System
 *
 * Transforms typing into a synesthetic experience with customizable effects.
 * Designed to be framework-agnostic and highly performant.
 *
 * @author Pablo Alvarado (pibulus)
 * @version 2.0.0
 * @license MIT
 */

// ===================================================================
// CORE ENGINE
// ===================================================================

export class JuicyTyping {
  constructor(options = {}) {
    // Core configuration
    this.config = {
      enabled: options.enabled ?? true,
      target: options.target || document.body,
      selector: options.selector || 'input[type="text"], input[type="search"], input[type="email"], input[type="password"], textarea, [contenteditable="true"]',
      debug: options.debug ?? false,
      ...options
    };

    // Module registry
    this.modules = new Map();
    this.activeModules = new Set();

    // Performance tracking
    this.stats = {
      keystrokes: 0,
      averageSpeed: 0,
      peakSpeed: 0,
      lastKeyTime: Date.now()
    };

    // Initialize
    this.initialized = false;
  }

  // ===================================================================
  // INITIALIZATION
  // ===================================================================

  async init() {
    if (this.initialized) {
      this.log('Already initialized');
      return this;
    }

    this.log('🌈 Initializing JuicyTyping...');

    // Setup DOM observation
    this.setupDOMObserver();

    // Attach to existing elements
    this.attachToElements();

    this.initialized = true;
    this.log('✨ JuicyTyping ready!');

    return this;
  }

  // ===================================================================
  // MODULE SYSTEM
  // ===================================================================

  registerModule(name, module) {
    if (this.modules.has(name)) {
      this.log(`Module "${name}" already registered, overwriting...`);
    }

    this.modules.set(name, module);

    // Initialize module if we're already initialized
    if (this.initialized && module.init) {
      module.init(this);
    }

    this.log(`📦 Registered module: ${name}`);
    return this;
  }

  enableModule(name) {
    if (!this.modules.has(name)) {
      this.log(`Module "${name}" not found`, 'warn');
      return this;
    }

    const module = this.modules.get(name);

    // Initialize if needed
    if (module.init && !module.initialized) {
      module.init(this);
      module.initialized = true;
    }

    // Enable module
    if (module.enable) {
      module.enable();
    }

    this.activeModules.add(name);
    this.log(`✅ Enabled module: ${name}`);
    return this;
  }

  disableModule(name) {
    if (!this.modules.has(name)) {
      return this;
    }

    const module = this.modules.get(name);

    if (module.disable) {
      module.disable();
    }

    this.activeModules.delete(name);
    this.log(`🔴 Disabled module: ${name}`);
    return this;
  }

  // ===================================================================
  // DOM MANAGEMENT
  // ===================================================================

  setupDOMObserver() {
    // Observe for new inputs being added to DOM
    this.observer = new MutationObserver((mutations) => {
      // Debounce to avoid multiple calls
      clearTimeout(this.observerTimeout);
      this.observerTimeout = setTimeout(() => {
        this.attachToElements();
      }, 100);
    });

    this.observer.observe(this.config.target, {
      childList: true,
      subtree: true
    });
  }

  attachToElements() {
    const elements = this.config.target.querySelectorAll(this.config.selector);

    elements.forEach(element => {
      if (element.dataset.juicyTypingAttached) return;

      element.dataset.juicyTypingAttached = 'true';

      // Attach event listeners
      element.addEventListener('keydown', (e) => this.onKeyDown(e));
      element.addEventListener('keyup', (e) => this.onKeyUp(e));
      element.addEventListener('input', (e) => this.onInput(e));
      element.addEventListener('focus', (e) => this.onFocus(e));
      element.addEventListener('blur', (e) => this.onBlur(e));
    });

    this.log(`Attached to ${elements.length} elements`);
  }

  detachFromElements() {
    const elements = this.config.target.querySelectorAll('[data-juicy-typing-attached]');

    elements.forEach(element => {
      delete element.dataset.juicyTypingAttached;
      // Event listeners are automatically garbage collected
    });
  }

  // ===================================================================
  // EVENT HANDLING
  // ===================================================================

  onKeyDown(event) {
    if (!this.config.enabled) return;

    // Update stats
    const now = Date.now();
    const timeSinceLastKey = now - this.stats.lastKeyTime;
    this.stats.lastKeyTime = now;
    this.stats.keystrokes++;

    // Calculate typing speed (words per minute approximation)
    const speed = timeSinceLastKey > 0 ? Math.min(1000, 60000 / (timeSinceLastKey * 5)) : 0;
    this.stats.averageSpeed = (this.stats.averageSpeed * 0.9) + (speed * 0.1); // Smooth average
    this.stats.peakSpeed = Math.max(this.stats.peakSpeed, speed);

    // Create event context
    const context = this.createEventContext(event);

    // Notify active modules
    this.activeModules.forEach(moduleName => {
      const module = this.modules.get(moduleName);
      if (module?.onKeyDown) {
        module.onKeyDown(context);
      }
    });
  }

  onKeyUp(event) {
    if (!this.config.enabled) return;

    const context = this.createEventContext(event);

    this.activeModules.forEach(moduleName => {
      const module = this.modules.get(moduleName);
      if (module?.onKeyUp) {
        module.onKeyUp(context);
      }
    });
  }

  onInput(event) {
    if (!this.config.enabled) return;

    const context = this.createEventContext(event);

    this.activeModules.forEach(moduleName => {
      const module = this.modules.get(moduleName);
      if (module?.onInput) {
        module.onInput(context);
      }
    });
  }

  onFocus(event) {
    const context = this.createEventContext(event);

    this.activeModules.forEach(moduleName => {
      const module = this.modules.get(moduleName);
      if (module?.onFocus) {
        module.onFocus(context);
      }
    });
  }

  onBlur(event) {
    const context = this.createEventContext(event);

    this.activeModules.forEach(moduleName => {
      const module = this.modules.get(moduleName);
      if (module?.onBlur) {
        module.onBlur(context);
      }
    });
  }

  createEventContext(event) {
    // Get cursor position
    const cursorPos = this.getCursorPosition(event.target);

    return {
      event,
      element: event.target,
      key: event.key,
      code: event.code,
      char: event.data || event.key,
      cursorPosition: cursorPos,
      typingSpeed: this.stats.averageSpeed,
      intensity: Math.min(1, this.stats.averageSpeed / 100), // 0-1 intensity based on speed
      timestamp: Date.now(),
      stats: { ...this.stats }
    };
  }

  getCursorPosition(element) {
    const rect = element.getBoundingClientRect();

    // For contenteditable
    if (element.contentEditable === 'true') {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rangeRect = range.getBoundingClientRect();
        return {
          x: rangeRect.left,
          y: rangeRect.top,
          width: rangeRect.width,
          height: rangeRect.height
        };
      }
    }

    // For regular inputs/textareas (approximate)
    // This is a simplified version - for more accuracy, you'd need to measure text
    return {
      x: rect.left + 10,
      y: rect.top + rect.height / 2,
      width: 2,
      height: rect.height * 0.8
    };
  }


  // ===================================================================
  // PUBLIC API
  // ===================================================================

  enable() {
    this.config.enabled = true;
    this.log('Enabled');
    return this;
  }

  disable() {
    this.config.enabled = false;
    this.log('Disabled');
    return this;
  }

  destroy() {
    // Clean up
    this.detachFromElements();

    if (this.observer) {
      this.observer.disconnect();
    }

    // Cleanup modules
    this.modules.forEach((module, name) => {
      if (module.destroy) {
        module.destroy();
      }
    });

    this.initialized = false;
    this.log('Destroyed');
  }

  // ===================================================================
  // UTILITIES
  // ===================================================================

  log(message, level = 'log') {
    if (!this.config.debug) return;
    console[level](`[JuicyTyping] ${message}`);
  }

  // Get stats for monitoring
  getStats() {
    return { ...this.stats };
  }

  // Configuration
  setConfig(key, value) {
    this.config[key] = value;
    return this;
  }
}

// ===================================================================
// DEFAULT EXPORT
// ===================================================================

export default JuicyTyping;