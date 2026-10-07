# KeyFlow Pro — Modern Touch Typing & Arcade Practice

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://sathvik-ram-yerroju-ai-creator.github.io/typing---game/)
[![Automated Tests](https://img.shields.io/badge/Tests-51%2F51%20Passing-success?style=for-the-badge&logo=playwright)](https://sathvik-ram-yerroju-ai-creator.github.io/typing---game/)

> **Unlock Muscle Memory. Type at the Speed of Thought.**  
> A sleek, responsive, and feature-rich touch typing master suite built with pure HTML, modern CSS, and vanilla JavaScript. Completely self-contained with zero runtime dependencies.

🌐 **Live URL**: [https://sathvik-ram-yerroju-ai-creator.github.io/typing---game/](https://sathvik-ram-yerroju-ai-creator.github.io/typing---game/)

---

## 🚀 Key Highlights & Modes

### 1. ⚡ The Programmer Track (100% Instantly Unlocked)
Designed specifically for software engineers and power users:
* **Zero Prerequisite Gating**: 100% unlocked by default so experienced typists can immediately jump into advanced syntax training.
* **Focused Coding Syntax Pool**: Targets all 19 critical programming characters:
  ```
  { } [ ] ( ) < > = + - * / ; : ' " \ _
  ```
* **4 Modular Tracks**:
  * **Module P1: Brackets & Pairs** (`{ } [ ] ( ) < >`)
  * **Module P2: Operators & Logic** (`= + - * / ; :`)
  * **Module P3: Strings, Escapes & Identifiers** (`' " \ _`)
  * **Module P4: Full-Stack Code Idioms** (All 19 symbols integrated into real JS/TS/SQL code snippets)
* **Ergonomic Dual-Key Highlighting**: Dynamically illuminates both the physical base key and the appropriate Shift key (Left or Right Shift depending on touch typing finger assignment).

---

### 2. 🎮 Expanded Arcade Arena (3 Distinct Mini-Games)
Every mini-game dynamically pulls its vocabulary and target characters based on the player's unlocked practice levels:

* **Bubble Drop (Vertical Popper)**:
  * Translucent glass bubbles fall downward with organic floating physics and sway.
  * Correct typing triggers a smooth canvas particle splash and ripple wave.
  * Bandpass noise fizz & upward sine chirp synthesized audio.
* **Nitro Sprint (Horizontal 2D Racer)**:
  * 2D highway sprint against an intelligent AI rival car.
  * Players type complete sentences to accelerate down the 1000m track.
  * Real-time WPM directly controls the player vehicle's velocity, igniting nitro exhaust particles and engine sweeps at >50 WPM.
* **Word Blaster (Dynamic Targeting & Heavy FX)**:
  * Words drift across a 2D arena.
  * Typing the first letter immediately activates a holographic targeting reticle with tracking guidance.
  * Completing the word triggers a heavy screen shake (18 frames), full-screen flare flash, and a 35+ shard particle explosion.

---

### 3. 🔊 Synthesized Audio System (Zero External Files)
All sound effects are generated procedurally in real time via the native browser **Web Audio API (`AudioContext`)**:
* **Zero `<audio>` elements** and zero external `.mp3`, `.wav`, or `.ogg` dependencies.
* **Soft Click / Pop (`keySuccess`)**: Pure sine wave frequency drop (560Hz → 340Hz) with exponential gain decay.
* **Harsh Buzzer (`keyError`)**: Low square wave (130Hz) with odd harmonics for immediate error awareness.
* **Bubble Pop (`bubblePop`)**: Bandpassed procedural white noise burst paired with an upward sine chirp.
* **Word Explosion (`wordExplosion`)**: Resonant falling lowpass noise shockwave paired with a sub-bass triangle punch.
* **Nitro Thrust & Target Lock**: Dynamic saw sweeps and triangle frequency shifts.

---

### 4. 📚 Standard Practice Lessons (Levels 1–6)
* Systematic progression from left-hand home row (`a, s, d, f`) up through full sentences and whole words.
* **Strict Keystroke Discipline**: Red error shakes and cursor locks prevent bad habits before moving forward.
* **90% Accuracy Milestone Gate**: Ensures genuine muscle memory retention before unlocking subsequent levels.
* Real-time WPM, accuracy, and posture finger hints.

---

### 5. 💎 Polish & Modern UX
* **Theming**: Dark and Light theme toggle with local storage persistence.
* **Persistent Progress**: Saved unlocked levels, best WPM, and arcade high scores via `localStorage`.
* **Keyboard Visualizer**: Full QWERTY layout with real-time target key illumination, Shift tracking, and finger color coordination.
* **Celebration Confetti**: Physics-based canvas confetti for milestone completions.

---

## 🧪 Automated Testing

KeyFlow Pro includes a comprehensive Playwright test suite in `run_tests.js`:

```bash
# Run the 51 automated tests
node run_tests.js
```

All 51 test assertions pass with 100% success across:
1. Main menu navigation & visual structure
2. Virtual keyboard highlighting & finger posture hints
3. Keystroke discipline, error handling, and cursor lock
4. Drill completion & 90% accuracy gating
5. Retro arcade backwards-compatibility
6. Dark/Light theme & sound toggle preferences
7. Progress reset functionality
8. Programmer Track instant unlock & syntax pool verification
9. Bubble Drop particle splash mechanics
10. Nitro Sprint AI racer & real-time WPM physics
11. Word Blaster reticle lock-on & screen flash/shake
12. Synthesized Web Audio API compliance

---

## 🛠️ Local Development

Simply open `index.html` in any modern web browser:
```bash
# Direct browser launch
start index.html
```
No build step, bundler, or server required!
