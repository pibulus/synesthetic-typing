# JuicyTyping 🌈✨

**Transform typing into a synesthetic experience with colorful trails, sparkles, and magical effects**

*A modular, framework-agnostic typing effects library that brings personality and joy to any text input*

![Version](https://img.shields.io/badge/version-2.0.0-ff0080)
![License](https://img.shields.io/badge/license-MIT-00ffff)
![Size](https://img.shields.io/badge/size-<15kb-00ff80)

## ✨ Features

- 🎨 **10+ Beautiful Themes** - From brutal rainbow to pastel dreams
- 🧩 **Modular Architecture** - Use only what you need
- 🚀 **High Performance** - Particle pooling, efficient animations
- 📱 **Framework Agnostic** - Works with React, Vue, Svelte, or vanilla JS
- 🎯 **Zero Dependencies** - Just pure JavaScript magic
- 💅 **Highly Customizable** - Every effect can be tweaked
- ⚡ **Plug & Play** - Works out of the box with sensible defaults

## 🎮 Try the Demo

Check out the live demo at `demo/index.html` or:

```bash
# Clone the repo
git clone https://github.com/pibulus/synesthetic-typing.git
cd synesthetic-typing

# Serve (ES modules need http://, not file://)
npm run demo          # → http://localhost:8021/demo/
```

## 🚀 Quick Start

```html
<!-- Include the library -->
<script type="module">
  import JuicyTyping from './src/JuicyTyping.js';
  import { TrailModule } from './src/modules/TrailModule.js';
  import { SparkleModule } from './src/modules/SparkleModule.js';

  // Create instance
  const juicy = new JuicyTyping();

  // Register modules
  juicy.registerModule('trail', new TrailModule());
  juicy.registerModule('sparkle', new SparkleModule());

  // Initialize and enable
  juicy.init().then(() => {
    juicy.enableModule('trail');
    juicy.enableModule('sparkle');
  });
</script>
```

That's it! Every text input on your page now has magical typing effects.

## ⚙️ Configuration Options

The engine takes core options; effects are configured per-module.

```javascript
const juicy = new JuicyTyping({
    // Where to look for inputs (default: document.body)
    target: document.body,

    // Which elements get effects (default: common text inputs + contenteditable)
    selector: 'input[type="text"], textarea, [contenteditable="true"]',

    enabled: true,   // start active
    debug: false     // console logging
});

// Each module has its own options:
juicy.registerModule('sparkle', new SparkleModule({
    threshold: 0.3,        // min typing-intensity (0-1) to trigger
    particleCount: 5,
    colors: 'rainbow',     // 'rainbow' | 'monochrome' | 'gradient'
    spread: 30             // px burst radius
}));
```

## 🎨 Built-in Themes

Themes live in `src/themes.js` and are applied across all active modules:

```javascript
import { getTheme, applyTheme } from './src/themes.js';

const modules = { trail: trailModule, sparkle: sparkleModule, ripple: rippleModule };
applyTheme(getTheme('pastel-dream'), modules);
```

Available: `brutal-rainbow` (default) · `pastel-dream` · `cyberpunk-neon` · `wizard-purple` · `sunset-vibes` · `ocean-wave` · `matrix-green` · `cotton-candy` · `fire-ice` · `minimal-mono`

## 🎯 API Methods

```javascript
// Modules
juicy.registerModule('trail', new TrailModule());
juicy.enableModule('trail');
juicy.disableModule('trail');

// Engine
juicy.enable();        // turn effects on
juicy.disable();       // turn effects off (keeps listeners)
juicy.getStats();      // { keystrokes, averageSpeed, peakSpeed, ... }
juicy.destroy();       // detach everything, clean up
```

## 🎮 Effect Types

### 🌈 Basic Trails
- Always active
- Rainbow particle trails that follow your cursor
- Colors cycle through your chosen palette

### ✨ Sparkles (Medium Speed)
- Triggered when typing faster than normal
- Multiple particles with slight randomization
- More particles = faster typing

### 💥 Word Completion Rings
- Triggered by space, period, exclamation, question mark
- Expanding ring effect in rainbow colors
- Satisfying completion feedback

### 🎆 Command Explosions
- Triggered by Enter key
- 12-particle explosion radiating outward
- Perfect for command completion

### ☄️ Bonus Comets (High Speed)
- Triggered during very fast typing
- Comet trails with glowing tails
- Shows you're in "the zone"

## 🔊 Audio

This library is **visuals only** — by design. For keystroke *sound* (real Cherry MX
recordings, speed-responsive volume), pair it with its sibling project
**[juicy-sounds](../juicy-sounds)**. The long-term goal is one synesthetic combo:
juicy-sounds (audio) + synesthetic-typing (visuals), synced per keystroke. See `ROADMAP.md`.

## 🌍 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Uses modern web standards:
- Web Audio API (for sound)
- CSS Animations (for effects)
- MutationObserver (for dynamic content)
- ES6 Classes (transpile if needed for older browsers)

## 🎯 Use Cases

### 📝 Writing Apps
Transform note-taking and writing into a more engaging experience.

### 🎮 Games & Interactive Fiction
Add tactile feedback to text-based games and interactive stories.

### 💻 Code Editors
Make coding more visually rewarding (great for live coding demos).

### 📧 Forms & Input Fields
Turn boring contact forms into delightful interactions.

### 🎨 Creative Tools
Perfect for poetry apps, creative writing tools, and artistic interfaces.

## 🛠 Development

```bash
git clone https://github.com/pibulus/synesthetic-typing.git
cd synesthetic-typing

# ES modules need http:// (won't run from file://)
npm run demo        # → http://localhost:8021/demo/
```

**Project layout:**
```
src/JuicyTyping.js     core engine (event loop, particle pool, module registry)
src/modules/           TrailModule · SparkleModule · RippleModule
src/themes.js          10 built-in themes + helpers
demo/index.html        live playground (loads everything)
```

## 📄 License

MIT License - use it anywhere, modify freely, credit appreciated!

## 🙏 Credits

- Inspired by Tetris Effect, Rez, and Lumines
- Created by Pablo Alvarado ([@pibulus](https://github.com/pibulus))
- Part of the Terminal Power ecosystem

## 🌟 Contributing

Pull requests welcome! Ideas for new effects:

- [ ] Typing rhythm visualization (BPM matching)
- [ ] More particle shapes (stars, hearts, code symbols)
- [ ] Theme system with JSON presets
- [ ] React/Vue component wrappers
- [ ] TypeScript definitions
- [ ] Package for npm/yarn
- [ ] Performance optimizations for mobile
- [ ] Integration with typing speed APIs

---

**Turn your text inputs into rainbow magic!** ✨

*"Every keystroke should spark joy"* - Marie Kondo, probably