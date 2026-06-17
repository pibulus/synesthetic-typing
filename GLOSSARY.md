# GLOSSARY.md

## Core Files
**src/JuicyTyping.js** - Main modular engine class (the one canonical core)
**src/modules/** - Effect modules: Trail, Sparkle, Ripple
**src/themes.js** - 10 built-in theme definitions + helpers
**demo/index.html** - Live playground that loads everything

## Main Class
**JuicyTyping** - Core engine managing modules, stats, particle pools

## Modules
**RippleModule** - Expanding circle ripples on keypress
**SparkleModule** - Particle bursts at caret position
**TrailModule** - Following trails behind cursor movement

## Key Methods
**init()** - Initializes engine, attaches to elements, creates particle pool
**registerModule(name, module)** - Adds visual effect module to registry
**enableModule(name)** - Activates specific module
**disableModule(name)** - Deactivates specific module
**attachToElements()** - Finds and binds to input elements
**setupDOMObserver()** - Watches for new input elements (dynamic content)
**initParticlePool()** - Pre-creates particle objects for performance

## Module Interface
Each module has:
**onKeyDown(event, element)** - Triggered on key press
**onKeyUp(event, element)** - Triggered on key release
**onCursorMove(x, y, element)** - Triggered on cursor position change
**cleanup()** - Removes visual artifacts

## Stats Tracking
**keystrokes** - Total key count
**averageSpeed** - Average typing speed
**peakSpeed** - Fastest typing speed recorded
**lastKeyTime** - Timestamp of last keypress

## Configuration
**enabled** - Enable/disable all effects
**target** - DOM element to attach to
**selector** - CSS selector for input elements
**debug** - Console logging flag

## Concepts
**Modular architecture** - Plug-and-play visual effect system
**Particle pooling** - Pre-allocated objects for performance
**DOM observation** - Auto-detects new inputs via MutationObserver
**Framework-agnostic** - Pure JS, works anywhere
**Performance tracking** - Real-time typing stats
**Synesthetic design** - Visual feedback for tactile typing experience
