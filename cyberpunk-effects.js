// CYBERPUNK TYPING EFFECTS & SOUND SYSTEM
// Rainbow trails, keyboard sounds, and typing enhancements

class CyberpunkTypingSystem {
  constructor() {
    this.sounds = [];
    this.currentTypingPosition = null;
    this.trailColors = ['#ff0080', '#ffff00', '#ff8000', '#c080ff', '#00ffff', '#00ff80'];
    this.currentColorIndex = 0;
    this.lastKeyTime = 0;
    this.typingSpeed = 0;
    this.wordCompleteChars = [' ', '.', '!', '?', '\n'];
    this.letterTrail = []; // Track recent letters and positions
    this.maxTrailLength = 15;
    this.init();
  }

  init() {
    this.setupSounds();
    this.setupTypingEffects();
  }

  setupSounds() {
    // Create multiple audio contexts for overlapping sounds
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.soundBuffers = [];
    
    // We'll load sounds when user provides them
    this.soundsEnabled = false;
    console.log('🔊 Sound system initialized - waiting for sound files');
  }

  async loadSoundFile(url, name) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.soundBuffers.push({
        name: name,
        buffer: audioBuffer
      });
      
      this.soundsEnabled = true;
      console.log(`🔊 Loaded sound: ${name}`);
      
    } catch (error) {
      console.log(`🔇 Could not load sound ${name}:`, error.message);
    }
  }

  playKeySound() {
    if (!this.soundsEnabled || this.soundBuffers.length === 0) return;
    
    try {
      // Pick random sound
      const soundData = this.soundBuffers[Math.floor(Math.random() * this.soundBuffers.length)];
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = soundData.buffer;
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime); // Lower volume
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
      
    } catch (error) {
      console.log('🔇 Audio playback error:', error);
    }
  }

  setupTypingEffects() {
    const terminal = document.getElementById('terminal');
    
    // Track typing for rainbow trails
    terminal.addEventListener('input', (e) => {
      this.onType(e);
    });
    
    terminal.addEventListener('keydown', (e) => {
      this.onKeyDown(e);
    });
    
    // Make terminal properly editable
    terminal.contentEditable = true;
    terminal.spellcheck = false;
  }

  onKeyDown(e) {
    // Calculate typing speed for intensity effects
    const currentTime = Date.now();
    this.typingSpeed = currentTime - this.lastKeyTime;
    this.lastKeyTime = currentTime;
    
    // Play sound with intensity based on typing speed
    this.playKeySound();
    
    // Handle special keys
    if (e.key === 'Enter') {
      e.preventDefault();
      this.createCommandCompleteEffect();
      this.handleEnterKey();
    } else if (e.key === 'Backspace') {
      this.handleBackspace();
    } else if (e.key.length === 1) {
      // Track the letter and its position for trailing effects
      this.addLetterToTrail(e.key);
      
      // Check for word completion
      if (this.wordCompleteChars.includes(e.key)) {
        this.createWordCompleteEffect();
      }
      
      // Create VHS-style trailing effects
      this.createVHSTrailEffects();
    }
  }

  addLetterToTrail(letter) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Add letter to trail with position and timestamp
    this.letterTrail.push({
      letter: letter,
      x: rect.left,
      y: rect.top,
      time: Date.now(),
      colorIndex: this.currentColorIndex
    });
    
    // Keep trail length manageable
    if (this.letterTrail.length > this.maxTrailLength) {
      this.letterTrail.shift();
    }
    
    this.currentColorIndex = (this.currentColorIndex + 1) % this.trailColors.length;
  }

  handleBackspace() {
    // Remove from trail and create glitch effect
    this.letterTrail.pop();
    this.createBackspaceGlitch();
  }

  createVHSTrailEffects() {
    // Calculate typing intensity
    const intensity = Math.max(0, Math.min(1, (300 - this.typingSpeed) / 300));
    
    // Only create effects if typing with some speed
    if (intensity > 0.2) {
      this.createLetterGhosting(intensity);
      this.createVHSScanlines(intensity);
      this.createChromaticAberration(intensity);
    }
  }

  // LEGACY PARTICLE SYSTEM - Now disabled in favor of VHS trailing
  createTypingEffects() {
    // Old particle system disabled - using VHS trailing instead
    // See createVHSTrailEffects() for the new system
    return;
  }

  createFastTypingBurst(intensity = 1) {
    // Create extra sparkles for fast typing
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Scale burst count with intensity
    const burstCount = Math.floor(2 + intensity * 4);
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => this.createSparkles(rect, intensity), i * 30);
    }
  }

  createWordCompleteEffect() {
    // Special effect when completing words
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Create ring of particles
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 25;
      const x = rect.left + Math.cos(angle) * distance;
      const y = rect.top + Math.sin(angle) * distance;
      
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 3px;
        height: 3px;
        background: ${this.trailColors[i % this.trailColors.length]};
        pointer-events: none;
        z-index: 10000;
        border-radius: 50%;
        box-shadow: 0 0 12px ${this.trailColors[i % this.trailColors.length]};
        animation: word-complete-ring 0.6s ease-out forwards;
      `;
      
      document.body.appendChild(particle);
      setTimeout(() => particle.parentNode?.removeChild(particle), 600);
    }
  }

  createCommandCompleteEffect() {
    // Epic effect when hitting Enter
    const terminal = document.getElementById('terminal');
    const rect = terminal.getBoundingClientRect();
    
    // Create explosion from center of terminal
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create 12 particles exploding outward
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 100 + Math.random() * 50;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const explosion = document.createElement('div');
      explosion.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 4px;
        height: 4px;
        background: ${this.trailColors[i % this.trailColors.length]};
        pointer-events: none;
        z-index: 10000;
        border-radius: 50%;
        box-shadow: 0 0 20px ${this.trailColors[i % this.trailColors.length]};
        animation: command-explosion 0.8s ease-out forwards;
        --end-x: ${x}px;
        --end-y: ${y}px;
      `;
      
      document.body.appendChild(explosion);
      setTimeout(() => explosion.parentNode?.removeChild(explosion), 800);
    }
  }

  createBonusEffect() {
    // Random special effects
    const effects = ['comet', 'spiral', 'burst'];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    if (effect === 'comet') {
      this.createCometEffect(rect);
    } else if (effect === 'spiral') {
      this.createSpiralEffect(rect);
    } else {
      this.createBurstEffect(rect);
    }
  }

  createCometEffect(rect) {
    const comet = document.createElement('div');
    const color = this.trailColors[this.currentColorIndex];
    
    comet.style.cssText = `
      position: fixed;
      left: ${rect.left - 50}px;
      top: ${rect.top}px;
      width: 2px;
      height: 2px;
      background: ${color};
      pointer-events: none;
      z-index: 10000;
      border-radius: 50%;
      box-shadow: 0 0 15px ${color}, -10px 0 30px ${color}80, -20px 0 50px ${color}40;
      animation: comet-trail 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(comet);
    setTimeout(() => comet.parentNode?.removeChild(comet), 800);
  }

  createSpiralEffect(rect) {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const spiral = document.createElement('div');
        const angle = (i * Math.PI) / 3;
        const radius = i * 5;
        const x = rect.left + Math.cos(angle) * radius;
        const y = rect.top + Math.sin(angle) * radius;
        
        spiral.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 2px;
          height: 2px;
          background: ${this.trailColors[i % this.trailColors.length]};
          pointer-events: none;
          z-index: 10000;
          border-radius: 50%;
          box-shadow: 0 0 10px ${this.trailColors[i % this.trailColors.length]};
          animation: spiral-dance 1s ease-out forwards;
        `;
        
        document.body.appendChild(spiral);
        setTimeout(() => spiral.parentNode?.removeChild(spiral), 1000);
      }, i * 50);
    }
  }

  createBurstEffect(rect) {
    // Rapid fire sparkles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => this.createSparkles(rect), i * 30);
    }
  }

  // VHS-STYLE TRAILING EFFECTS
  createLetterGhosting(intensity = 1) {
    // Create ghost copies of recent letters trailing behind
    const now = Date.now();
    const trailLength = Math.floor(5 + intensity * 8); // 5-13 ghost letters
    
    // Get the most recent letters up to trailLength
    const recentLetters = this.letterTrail.slice(-trailLength);
    
    recentLetters.forEach((letterData, index) => {
      // Skip if letter is too old
      if (now - letterData.time > 3000) return;
      
      // Calculate ghost properties
      const age = now - letterData.time;
      const position = index / recentLetters.length; // 0 = oldest, 1 = newest
      const opacity = (0.8 - age / 3000) * (0.3 + position * 0.7); // Fade over time and distance
      
      if (opacity <= 0.1) return;
      
      // Create ghost letter
      this.createGhostLetter(letterData, opacity, position, intensity);
    });
  }

  createGhostLetter(letterData, opacity, position, intensity) {
    const color = this.trailColors[letterData.colorIndex];
    const ghost = document.createElement('div');
    
    // VHS-style offset - letters drift behind
    const offsetX = (1 - position) * -20 * intensity; // Drift left/back
    const offsetY = (1 - position) * -5 * intensity + (Math.random() - 0.5) * 2; // Slight vertical drift
    
    ghost.style.cssText = `
      position: fixed;
      left: ${letterData.x + offsetX}px;
      top: ${letterData.y + offsetY}px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: ${color};
      opacity: ${opacity};
      pointer-events: none;
      z-index: 9900 + Math.floor(position * 100);
      text-shadow: 
        0 0 ${5 + intensity * 10}px ${color}80,
        ${intensity * 2}px 0 ${color}40,
        ${-intensity * 2}px 0 ${color}40;
      filter: blur(${(1 - position) * intensity * 0.5}px);
      animation: ghost-fade ${1 + intensity}s linear forwards;
      mix-blend-mode: screen;
    `;
    ghost.textContent = letterData.letter;
    
    document.body.appendChild(ghost);
    setTimeout(() => ghost.parentNode?.removeChild(ghost), (1 + intensity) * 1000);
  }

  createVHSScanlines(intensity = 1) {
    // Subtle scan lines that occasionally sweep across
    if (Math.random() > intensity * 0.1) return; // Low chance, scales with intensity
    
    const terminal = document.getElementById('terminal');
    const rect = terminal.getBoundingClientRect();
    
    const scanline = document.createElement('div');
    scanline.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top + Math.random() * rect.height}px;
      width: ${rect.width}px;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        ${this.trailColors[this.currentColorIndex]}60 50%, 
        transparent 100%);
      pointer-events: none;
      z-index: 9950;
      animation: scanline-sweep 0.3s linear forwards;
      mix-blend-mode: screen;
    `;
    
    document.body.appendChild(scanline);
    setTimeout(() => scanline.parentNode?.removeChild(scanline), 300);
  }

  createChromaticAberration(intensity = 1) {
    // RGB channel separation effect on terminal
    if (Math.random() > intensity * 0.15) return; // Low chance
    
    const terminal = document.getElementById('terminal');
    const duration = 100 + intensity * 200;
    
    terminal.style.textShadow = `
      ${intensity}px 0 #ff0000,
      ${-intensity}px 0 #00ffff,
      0 0 ${intensity * 5}px ${this.trailColors[this.currentColorIndex]}40
    `;
    
    setTimeout(() => {
      terminal.style.textShadow = '';
    }, duration);
  }

  createBackspaceGlitch() {
    // VHS-style glitch when deleting
    const terminal = document.getElementById('terminal');
    const originalFilter = terminal.style.filter;
    
    // Quick red flash with horizontal distortion
    terminal.style.filter = 'hue-rotate(0deg) saturate(2) brightness(1.2)';
    terminal.style.transform = 'scaleX(1.002) translateX(1px)';
    
    setTimeout(() => {
      terminal.style.filter = originalFilter;
      terminal.style.transform = '';
    }, 80);
  }

  onType(e) {
    // Additional typing feedback
    this.currentColorIndex = (this.currentColorIndex + 1) % this.trailColors.length;
  }

  createRainbowTrail(intensity = 1) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    if (rect.width === 0 && rect.height === 0) return;
    
    // Scale effects based on intensity
    this.createMainTrail(rect, intensity);
    
    // Only add extra effects at higher intensity
    if (intensity > 0.5) {
      this.createSparkles(rect, intensity);
    }
    
    if (intensity > 0.7) {
      this.createAsciiTrail(rect, intensity);
    }
    
    // Always subtle glow
    this.createGlowPulse(rect, intensity * 0.5);
  }

  createMainTrail(rect, intensity = 1) {
    const color = this.trailColors[this.currentColorIndex];
    const trail = document.createElement('div');
    
    // Scale size and effects with intensity
    const baseSize = 1 + intensity * 2;
    const size = baseSize + Math.random() * intensity;
    const offsetX = (Math.random() - 0.5) * (5 + intensity * 5);
    const offsetY = (Math.random() - 0.5) * (5 + intensity * 5);
    
    trail.style.cssText = `
      position: fixed;
      left: ${rect.left + offsetX}px;
      top: ${rect.top + offsetY}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      pointer-events: none;
      z-index: 10000;
      border-radius: 50%;
      box-shadow: 0 0 ${8 + intensity * 10}px ${color}, 0 0 ${15 + intensity * 20}px ${color}40;
      animation: rainbow-trail-main ${0.8 - intensity * 0.3}s ease-out forwards;
      opacity: ${0.7 + intensity * 0.3};
    `;
    
    document.body.appendChild(trail);
    setTimeout(() => trail.parentNode?.removeChild(trail), 800 + intensity * 200);
  }

  createSparkles(rect, intensity = 1) {
    // Scale sparkle count with intensity
    const sparkleCount = Math.floor(1 + intensity * 3);
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      const color = this.trailColors[Math.floor(Math.random() * this.trailColors.length)];
      const angle = (Math.PI * 2 * i) / sparkleCount + Math.random() * 0.5;
      const distance = (10 + Math.random() * 15) * intensity;
      
      const x = rect.left + Math.cos(angle) * distance;
      const y = rect.top + Math.sin(angle) * distance;
      
      sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${0.5 + intensity}px;
        height: ${0.5 + intensity}px;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 ${4 + intensity * 6}px ${color};
        animation: sparkle-burst ${0.3 + intensity * 0.4}s ease-out forwards;
        opacity: ${0.6 + intensity * 0.4};
      `;
      
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.parentNode?.removeChild(sparkle), 500 + intensity * 300);
    }
  }

  createAsciiTrail(rect, intensity = 1) {
    // Random ASCII characters that fade out
    const asciiChars = ['░', '▒', '▓', '█', '◆', '◇', '○', '◉', '●', '◯', '★', '☆', '✦', '✧', '◈'];
    const char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
    const color = this.trailColors[this.currentColorIndex];
    
    const ascii = document.createElement('div');
    ascii.style.cssText = `
      position: fixed;
      left: ${rect.left - 5}px;
      top: ${rect.top - 5}px;
      font-family: 'JetBrains Mono', monospace;
      font-size: ${6 + intensity * 6}px;
      color: ${color};
      pointer-events: none;
      z-index: 9998;
      text-shadow: 0 0 ${6 + intensity * 8}px ${color};
      animation: ascii-fade ${0.6 + intensity * 0.6}s ease-out forwards;
      opacity: ${0.5 + intensity * 0.5};
    `;
    ascii.textContent = char;
    
    document.body.appendChild(ascii);
    setTimeout(() => ascii.parentNode?.removeChild(ascii), 800 + intensity * 600);
  }

  createGlowPulse(rect, intensity = 1) {
    // Pulsing glow effect behind the cursor
    const glow = document.createElement('div');
    const color = this.trailColors[this.currentColorIndex];
    const size = 15 + intensity * 10;
    const opacity = Math.floor(20 + intensity * 30);
    
    glow.style.cssText = `
      position: fixed;
      left: ${rect.left - size/2}px;
      top: ${rect.top - size/2}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color}${opacity} 0%, transparent 70%);
      pointer-events: none;
      z-index: 9997;
      border-radius: 50%;
      animation: glow-pulse ${0.2 + intensity * 0.2}s ease-out forwards;
    `;
    
    document.body.appendChild(glow);
    setTimeout(() => glow.parentNode?.removeChild(glow), 200 + intensity * 200);
  }

  createBackspaceEffect() {
    // Red glitch effect for backspace
    const app = document.getElementById('app');
    const originalFilter = app.style.filter;
    app.style.filter = 'hue-rotate(0deg) brightness(1.2) saturate(2)';
    setTimeout(() => {
      app.style.filter = originalFilter;
    }, 50);
  }

  handleEnterKey() {
    // Get the current command line
    const terminal = document.getElementById('terminal');
    const content = terminal.textContent;
    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1];
    
    if (lastLine.startsWith('$ ')) {
      const command = lastLine.substring(2).trim();
      if (command) {
        // Clear the editable content and execute command
        terminal.contentEditable = false;
        executeCommand(command);
        setTimeout(() => {
          terminal.contentEditable = true;
          this.focusAtEnd();
        }, 100);
      }
    }
  }

  focusAtEnd() {
    const terminal = document.getElementById('terminal');
    terminal.focus();
    
    // Move cursor to end
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(terminal);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Method to add sound files dynamically
  addSoundFile(file, name) {
    const url = URL.createObjectURL(file);
    this.loadSoundFile(url, name);
  }

  // Create typing prompt at end of terminal
  addPrompt() {
    const terminal = document.getElementById('terminal');
    const promptSpan = document.createElement('span');
    promptSpan.textContent = '$ ';
    promptSpan.style.color = 'var(--text-secondary)';
    terminal.appendChild(promptSpan);
    this.focusAtEnd();
  }
}

// Add CSS for magical rainbow trails
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow-trail-main {
    0% {
      opacity: 1;
      transform: scale(1) translateY(0) rotate(0deg);
      filter: blur(0px);
    }
    30% {
      opacity: 0.8;
      transform: scale(1.8) translateY(-15px) rotate(180deg);
      filter: blur(1px);
    }
    70% {
      opacity: 0.4;
      transform: scale(2.5) translateY(-30px) rotate(270deg);
      filter: blur(2px);
    }
    100% {
      opacity: 0;
      transform: scale(0.2) translateY(-50px) rotate(360deg);
      filter: blur(3px);
    }
  }
  
  @keyframes sparkle-burst {
    0% {
      opacity: 1;
      transform: scale(0.5) rotate(0deg);
      filter: brightness(2);
    }
    50% {
      opacity: 0.9;
      transform: scale(2) rotate(180deg);
      filter: brightness(3);
    }
    100% {
      opacity: 0;
      transform: scale(4) rotate(360deg);
      filter: brightness(1);
    }
  }
  
  @keyframes ascii-fade {
    0% {
      opacity: 1;
      transform: scale(0.8) translateY(0) rotate(-10deg);
      filter: brightness(2) saturate(2);
    }
    25% {
      opacity: 0.9;
      transform: scale(1.2) translateY(-8px) rotate(5deg);
      filter: brightness(1.5) saturate(1.5);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.5) translateY(-15px) rotate(0deg);
      filter: brightness(1.2) saturate(1.2);
    }
    75% {
      opacity: 0.3;
      transform: scale(1.8) translateY(-25px) rotate(-5deg);
      filter: brightness(0.8) saturate(0.8);
    }
    100% {
      opacity: 0;
      transform: scale(2.2) translateY(-40px) rotate(10deg);
      filter: brightness(0.5) saturate(0.5);
    }
  }
  
  @keyframes glow-pulse {
    0% {
      opacity: 0.8;
      transform: scale(0.5);
      filter: blur(2px);
    }
    50% {
      opacity: 0.4;
      transform: scale(2);
      filter: blur(4px);
    }
    100% {
      opacity: 0;
      transform: scale(3);
      filter: blur(6px);
    }
  }
  
  /* Enhanced typing cursor */
  #terminal:focus {
    caret-color: var(--text-primary);
    box-shadow: inset 0 0 15px rgba(255, 0, 255, 0.4), 0 0 20px rgba(255, 0, 255, 0.2);
    animation: terminal-glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes terminal-glow {
    0% {
      box-shadow: inset 0 0 15px rgba(255, 0, 255, 0.4), 0 0 20px rgba(255, 0, 255, 0.2);
    }
    100% {
      box-shadow: inset 0 0 25px rgba(255, 0, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4);
    }
  }
  
  /* Fast typing burst effect */
  .typing-burst {
    animation: typing-energy 0.2s ease-out;
  }
  
  @keyframes typing-energy {
    0% {
      filter: brightness(1) saturate(1) hue-rotate(0deg);
    }
    50% {
      filter: brightness(1.3) saturate(1.5) hue-rotate(30deg);
    }
    100% {
      filter: brightness(1) saturate(1) hue-rotate(0deg);
    }
  }
  
  @keyframes word-complete-ring {
    0% {
      opacity: 1;
      transform: scale(0.5) rotate(0deg);
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
      transform: translate(calc(var(--end-x) - 100%), calc(var(--end-y) - 100%)) scale(0.2);
    }
  }
  
  @keyframes comet-trail {
    0% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(100px) scale(0.5);
    }
  }
  
  @keyframes spiral-dance {
    0% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.5) rotate(180deg);
    }
    100% {
      opacity: 0;
      transform: scale(2) rotate(360deg);
    }
  }
  
  /* VHS-STYLE TRAILING EFFECTS */
  @keyframes ghost-fade {
    0% {
      opacity: inherit;
      transform: translateX(0) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-30px) translateY(-10px) scale(0.8);
    }
  }
  
  @keyframes scanline-sweep {
    0% {
      opacity: 0;
      transform: scaleX(0);
    }
    50% {
      opacity: 1;
      transform: scaleX(1);
    }
    100% {
      opacity: 0;
      transform: scaleX(1) translateY(5px);
    }
  }
  
  /* Enhanced terminal glow for VHS aesthetic */
  #terminal:focus {
    caret-color: var(--text-primary);
    box-shadow: 
      inset 0 0 20px rgba(255, 0, 255, 0.3), 
      0 0 30px rgba(255, 0, 255, 0.2),
      0 0 1px rgba(255, 255, 255, 0.8);
    animation: vhs-terminal-glow 3s ease-in-out infinite alternate;
  }
  
  @keyframes vhs-terminal-glow {
    0% {
      box-shadow: 
        inset 0 0 20px rgba(255, 0, 255, 0.3), 
        0 0 30px rgba(255, 0, 255, 0.2),
        0 0 1px rgba(255, 255, 255, 0.8);
      filter: contrast(1) brightness(1);
    }
    100% {
      box-shadow: 
        inset 0 0 30px rgba(255, 0, 255, 0.5), 
        0 0 40px rgba(255, 0, 255, 0.4),
        0 0 2px rgba(255, 255, 255, 0.9);
      filter: contrast(1.1) brightness(1.05);
    }
  }
`;
document.head.appendChild(style);

// Global typing system instance
window.cyberpunkTyping = null;