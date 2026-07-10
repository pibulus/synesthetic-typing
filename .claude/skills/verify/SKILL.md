---
name: verify
description: How to run and verify synesthetic-typing changes end-to-end via the demo page
---

# Verifying synesthetic-typing

ES modules need http://, so the demo won't run from file://.

```bash
npm run demo   # python http.server → http://localhost:8021/demo/
```

Use `127.0.0.1` instead of `localhost` if the browser times out (Playwright MCP did).

## Drive it

1. Load `http://127.0.0.1:8021/demo/` — expect zero console errors (a `/favicon.ico` 404 is pre-existing noise).
2. Type slowly into any input (real keystrokes, e.g. Playwright `pressSequentially`).
3. Particles are short-lived (300–1000ms), so to observe them either screenshot
   mid-typing or count DOM nodes right after: `.juicy-trail-particle`,
   `.juicy-sparkle`, `.juicy-ripple`, `.juicy-ghost-letter`.
4. Default mount is `document.body`; modules accept a `container` option —
   verify by constructing a module with `{ container: el }` via
   `import('/src/modules/SparkleModule.js')` in the page and checking particles
   land inside `el`, not body.

## Gotchas

- Caret-position tracking in textareas is approximate — effects near the left
  edge of the box are normal, not a regression.
- Synthetic `KeyboardEvent` dispatch triggers the engine's keydown handlers
  fine (good for stress bursts), but doesn't move the real caret.
