# 🏴‍☠️ TEXTREME Raid Notes

> Stuff worth lifting from **[cis-ash/TEXTREME](https://github.com/cis-ash/TEXTREME)** into synesthetic-typing.
> Captured 2026-06-16 during a star-triage session. Come back to this when reviving the visual engine.

**What TEXTREME is:** an "opensome *meaty* text editor" built in **Godot** (game engine, GDScript) where every keystroke fires game-feel effects — lazers, sparklers, hit-confirms. Created 2018, abandoned 2022. **MIT licensed** (Lev Kamenskyi) → free to raid assets + ideas. The *code* is Godot-specific (not portable to web), but the **effects vocabulary, sounds, and fonts are gold**, and it's basically proof-of-concept for what synesthetic-typing already does — just maximalist and game-engine-native.

---

## ✅ Liftable ASSETS (MIT — drop straight in)

### 🔊 Sounds (`TEXTREME/Sounds/*.wav`)
- `keystroke.wav` — generic key press
- `enter.wav` — enter/commit sound
- `pistol.wav` — a punchy "fire" sound (could map to fast-typing / command explosion)
- `250551__druminfected__metronomeup.wav` — metronome tick (rhythm/BPM idea)
- **Note:** these overlap with what `juicy-sounds` already nails (Cherry MX recordings) — juicy-sounds is probably *better* for keys. But `pistol.wav` / the punchy one-shots could be fun for the bigger *visual* effect triggers (explosions, comets).

### 🔤 Fonts (`TEXTREME/Fonts/*.ttf`) — all retro/terminal, very on-brand
- `BigBlue_TerminalPlus.ttf` — IBM-style terminal font
- `Px437_AMI_BIOS.ttf` — old BIOS pixel font (the AMIGA/demoscene vibe!)
- `Pixel-UniCode.ttf` — pixel unicode font
- Great for a "retro mode" theme in synesthetic-typing.

---

## 💡 Liftable IDEAS — the effects vocabulary (their effect list = our feature menu)

TEXTREME's `Effects/` folder is a moodboard of "what feels good per keystroke." Map these onto synesthetic-typing's Canvas rewrite:

| TEXTREME effect | What it does | Maps to synesthetic-typing as |
|---|---|---|
| **Lazer** | beam shoots from the typed char | trail/beam effect for fast typing |
| **FlyingLetter** | the letter you typed flies off | char physics — letters launch + fade |
| **Sparkler** | sparkle burst | ✅ already have (SparkleModule) |
| **hit confirm** | fighting-game "your hit landed" pop | **the missing juice** — punchy confirm flash per keystroke (this is THE good one) |
| **Flash** | screen flash | word-completion / command flash |
| **Dash / Dot / Cross** | small punctuation-triggered marks | punctuation-specific effects |
| **ExclamationMark / QuestionMark** | char-specific celebratory pops | trigger special effects on `!` / `?` |
| **PasteEffect** | special effect on paste | juicy paste feedback (nice touch most editors miss) |

**The single best idea:** "**hit confirm**" — the fighting-game framing. Typing should feel like *landing combos*. That's the emotional core synesthetic-typing is reaching for (it already cites Tetris Effect / Rez / Lumines — same DNA). Lean into game-feel language: combos, hit-confirms, "in the zone" states.

---

## 🎯 So what to actually do (later)
1. **Don't** port TEXTREME's Godot code — it's engine-locked.
2. **Maybe** grab `pistol.wav` + the 3 retro fonts (MIT, free) for a retro/punchy theme.
3. **Do** steal the effects *vocabulary* — esp. "hit confirm" and "flying letter" — as targets for the Canvas particle rewrite (see ROADMAP.md Phase 1).
4. Remember the real blocker is OUR roadmap: DOM→Canvas visual engine + sync with juicy-sounds. TEXTREME is the moodboard, not the fix.

*Clone was at /tmp/_textreme (ephemeral). Re-clone: `gh repo clone cis-ash/TEXTREME`*
