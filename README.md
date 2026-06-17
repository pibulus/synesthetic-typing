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
git clone https://github.com/yourusername/juicy-typing.git

# Open demo
open juicy-typing/demo/index.html
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

```javascript
const synesthetic = new SynestheticTyping({
    // Target element (default: document.body)
    target: document.body,

    // Color palette - Neo Tokyo by default
    colors: [
        '#ff0080', // Brutal Pink
        '#ffff00', // Electric Yellow
        '#ff8000', // Neon Orange
        '#c080ff', // Punk Purple
        '#00ffff', // Cyber Blue
        '#00ff80'  // Neo Green
    ],

    // Effect intensity multiplier (0-2, default: 1.0)
    effectIntensity: 1.0,

    // Enable sound effects (default: false)
    soundEnabled: false,

    // Maximum number of trail particles (default: 15)
    maxTrailLength: 15,

    // Characters that trigger word completion effects
    wordCompleteChars: [' ', '.', '!', '?', '\n']
});
```

## 🎨 Built-in Color Themes

```javascript
// Neo Tokyo (default)
synesthetic.setColors(['#ff0080', '#ffff00', '#ff8000', '#c080ff', '#00ffff', '#00ff80']);

// Classic Terminal
synesthetic.setColors(['#00ff00', '#00ff00', '#00aa00', '#008800', '#006600', '#004400']);

// Warm Sunset
synesthetic.setColors(['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#5b2c87', '#3a0ca3']);

// Cool Ocean
synesthetic.setColors(['#0077be', '#00a8cc', '#7209b7', '#560bad', '#480ca8', '#3a0ca3']);
```

## 🎯 API Methods

```javascript
// Change effect intensity on the fly
synesthetic.setIntensity(1.5);

// Change color palette
synesthetic.setColors(['#ff0000', '#00ff00', '#0000ff']);

// Enable/disable for specific inputs
synesthetic.enable();  // Re-scan for inputs
synesthetic.disable(); // Remove all effects
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

## 🔊 Audio Features

Enable sound for retro keyboard effects:

```javascript
const synesthetic = new SynestheticTyping({
    soundEnabled: true
});

// Or toggle later
synesthetic.soundEnabled = true;
```

- Synthesized sine wave key sounds
- Randomized pitch for each keystroke
- Non-intrusive volume levels
- Gracefully degrades if audio unavailable

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
# Clone the repository
git clone https://github.com/pibulus/synesthetic-typing.git

# Open demo in browser
open demo.html

# Or serve with Python
python -m http.server 8000
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