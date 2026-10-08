# KeyFlow Pro — Modern Touch Typing & Arcade Practice

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://sathvik-ram-yerroju-ai-creator.github.io/typing---game/)
[![Automated Tests](https://img.shields.io/badge/Tests-60%2F60%20Passing-success?style=for-the-badge&logo=playwright)](https://sathvik-ram-yerroju-ai-creator.github.io/typing---game/)

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

### 2. 🎮 Arcade Arena (4 Distinct Futuristic Mini-Games)
The Arcade Arena features 4 high-octane cyber modes equipped with **Dynamic Speed Scaling**, **Futuristic HUDs**, and **Hard Reset on Exit**:

* **🌊 Dynamic Speed Scaling & Slow Start System**:
  * **Slow Start (Level 1)**: All arcade modes start at a relaxed, beginner-friendly pace (Bubble Drop base `0.55`, Nitro Sprint base `1.4`, Word Blaster base `0.35`).
  * **In-Game Leveling**: As distance and score accumulate, in-game Level rises automatically with audio chimes and a level-up banner.
  * **Speed Formula**: Game elements dynamically accelerate as you level up (`speed = baseSpeed + (currentLevel * 0.2)`).
  * **Hard Reset on Exit**: Clicking "Exit Game" or "Back to Menu" hard-resets all mid-game states immediately. Reopening the game starts fresh at score 0 and slow Level 1 pace.

* **Mode 1: Bubble Drop (Single-Letter Vertical Popper)**:
  * Translucent glass bubbles fall downward with organic floating physics and sway.
  * **Strict Single Letter Spawns**: Bubbles exclusively spawn single letters (A–Z) tailored for beginner keyboard targeting.
  * Correct typing triggers a smooth canvas particle splash and ripple wave.

* **Mode 2: Nitro Sprint (Endless Solo Racer Overhaul)**:
  * **Strictly Single-Player Endless Runner**: All multiplayer and AI bots deleted. Pure infinite runner down a multi-lane neon cyberway.
  * **Endless Progression & Speed Scaling**: The player's car continuously advances down the endless track as they type correctly. Visual speed and required typing cadence scale higher the further you survive.
  * **Curriculum-Based Word Generation**: Large, high-contrast holographic cockpit target text at the top of the canvas:
    * **Tier 1 (Home Row only)**: `SAD`, `DAD`, `FALL`, `GLAD`, `FLASH`, `HALL`, `FLAG`, `GLASS`, `SALAD`, `HALF`, `ASK`, `DASH`...
    * **Tier 2 (Top Row introduced)**: `TREE`, `WRITE`, `QUIET`, `POWER`, `WATER`, `LIGHT`, `STREET`, `TURBO`...
    * **Tier 3 (Bottom Row introduced)**: `CYBER`, `MATRIX`, `VECTOR`, `ZENITH`, `VORTEX`, `CIRCUIT`, `VELOCITY`...
    * **Tier 4 (Shift Keys & Sci-Fi Phrases)**: `Nitro Boost`, `Hyper Drive`, `Quantum Leap`, `Mach Velocity`...
  * **Strike System (5-Mistake Failure Condition)**: Internal mistake tracking with high-tech warning pips. Exceeding 5 mistakes immediately engages emergency friction braking with tire skid marks, sparks, audio screech, and halts the car.
  * **Futuristic Results Dashboard**: Replaces race view upon Game Over with telemetry metrics: Final WPM, Time Survived, Accuracy %, and Distance Traveled, with a 1-click **Re-engage Engine** restart.

* **Mode 3: Word Blaster (Dynamic Targeting & Heavy FX)**:
  * Words drift across a 2D cosmic arena.
  * Typing the first letter activates a holographic targeting reticle with tracking guidance.
  * Completing the word triggers a heavy screen shake (18 frames), full-screen flare flash, and a 35+ shard particle explosion.

* **Mode 4: Alphabet Sprint (A to Z Time Trial)**:
  * **Objective**: Type the entire English alphabet from A to Z in exact order as fast as possible!
  * **Millisecond-Accurate Timer**: Timer starts the exact millisecond `A` is struck, and stops the exact millisecond `Z` is pressed.
  * **Strict Order Validation**: Prevent progression if the wrong letter is typed (red card shake and error counter).
  * **Stats & Results Screen**: Instant results overlay displaying Total Time (to 3 decimals), equivalent WPM (`312 / totalTime`), Keystrokes Per Minute (KPM), Accuracy, and a 1-click **Play Again** instant restart.

---

### 3. 🔊 Synthesized Audio System (Zero External Files)
All sound effects are generated procedurally in real time via the native browser **Web Audio API (`AudioContext`)**:
* **Zero `<audio>` elements** and zero external `.mp3`, `.wav`, or `.ogg` dependencies.
* **Soft Click / Pop (`keySuccess`)**: Pure sine wave frequency drop (560Hz → 340Hz) with exponential gain decay.
* **Harsh Buzzer (`keyError`)**: Low square wave (130Hz) with odd harmonics for immediate error awareness.
* **Bubble Pop (`bubblePop`)**: Bandpassed procedural white noise burst paired with an upward sine chirp.
* **Word Explosion (`wordExplosion`)**: Resonant falling lowpass noise shockwave paired with a sub-bass triangle punch.
* **Level Up Fanfare (`levelUp`)**: Ascending 4-tone synthesizer arpeggio.
* **Emergency Brake (`nitroBrake`)**: Resonant bandpassed screech noise and pitch-bent friction sweep.
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
# Run the 60 automated tests
node run_tests.js
```

All 60 test assertions pass with 100% success across:
1. Main menu navigation & visual structure
2. Virtual keyboard highlighting & finger posture hints
3. Keystroke discipline, error handling, and cursor lock
4. Drill completion & 90% accuracy gating
5. Bubble Drop single-letter spawn validation (A–Z)
6. Dynamic Speed Scaling & Slow Start system
7. Nitro Sprint Endless Solo Mode (no AI bots, curriculum tiers, 5-strike braking failure, results dashboard)
8. Alphabet Sprint mode (millisecond start on 'A', strict letter gating, millisecond stop on 'Z', results calculations)
9. Dark/Light theme & sound toggle preferences
10. Progress reset confirmation

---

## 🛠️ Local Development

Simply open `index.html` in any modern web browser:
```bash
# Direct browser launch
start index.html
```
No build step, bundler, or server required!
