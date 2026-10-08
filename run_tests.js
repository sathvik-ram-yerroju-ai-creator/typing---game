
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTestSuite() {
  console.log('🚀 Starting Comprehensive Typing Game Test Suite...');

  // Launch using installed Microsoft Edge or Chrome
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 }
  });
  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  console.log('📍 Navigating to:', filePath);
  await page.goto(filePath);

  const results = [];

  function assert(name, condition, extra = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name} ${extra}`);
      results.push({ name, status: 'PASS', extra });
    } else {
      console.error(`  ❌ FAIL: ${name} ${extra}`);
      results.push({ name, status: 'FAIL', extra });
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Initial Page Load & Main Menu
  // -------------------------------------------------------------
  console.log('\n--- Test 1: Main Menu & Visual Structure ---');
  const title = await page.title();
  assert('Page Title', title.includes('KeyFlow Pro'), `(Title: "${title}")`);

  const heroTitle = await page.textContent('.hero-title');
  assert('Hero Title present', heroTitle.includes('Speed of Thought'));

  const practiceCard = await page.isVisible('#cardLaunchPractice');
  const arcadeCard = await page.isVisible('#cardLaunchArcade');
  assert('Mode Cards Visible', practiceCard && arcadeCard);

  const overviewLvl = await page.textContent('#overviewHighestLevel');
  assert('Initial Unlocked Level', overviewLvl.includes('Level 1'));

  // -------------------------------------------------------------
  // TEST 2: Practice Lessons Navigation & Virtual Keyboard
  // -------------------------------------------------------------
  console.log('\n--- Test 2: Practice Lessons Navigation & Virtual Keyboard ---');
  await page.click('#cardLaunchPractice');
  await page.waitForTimeout(300);

  const practiceViewActive = await page.isVisible('#practiceView.active');
  assert('Navigated to Practice View', practiceViewActive);

  // Check initial target char
  const firstChar = await page.textContent('#char-0');
  assert('First target character loaded', firstChar === 'a', `(Got: "${firstChar}")`);

  // Check keyboard target key highlighted
  const highlightedKey = await page.$eval('.kb-key.target-highlight', el => el.dataset.key);
  assert('Virtual keyboard highlighted target key', highlightedKey === 'a', `(Highlighted: "${highlightedKey}")`);

  const fingerHint = await page.textContent('#fingerHintText');
  assert('Finger posture hint accurate', fingerHint.includes('Left Pinky'), `(Hint: "${fingerHint}")`);

  // -------------------------------------------------------------
  // TEST 3: Keystroke Validation & Beginner Enforcement
  // -------------------------------------------------------------
  console.log('\n--- Test 3: Keystroke Discipline (Error handling & Cursor lock) ---');
  // Type wrong key 'z'
  await page.keyboard.press('z');
  await page.waitForTimeout(100);

  const errorCount = await page.textContent('#liveErrorsVal');
  const stillChar0Current = await page.$eval('#char-0', el => el.classList.contains('current'));
  assert('Wrong key rejected & cursor stayed on char-0', stillChar0Current && errorCount === '1');

  // Now type the correct key 'a'
  await page.keyboard.press('a');
  await page.waitForTimeout(100);

  const char0Correct = await page.$eval('#char-0', el => el.classList.contains('correct'));
  const char1Current = await page.$eval('#char-1', el => el.classList.contains('current'));
  assert('Correct key "a" advances to char-1 and marks char-0 green', char0Correct && char1Current);

  // Next char is 's'
  const nextTarget = await page.$eval('.kb-key.target-highlight', el => el.dataset.key);
  assert('Virtual keyboard advances target highlight to "s"', nextTarget === 's');

  // -------------------------------------------------------------
  // TEST 4: Completing a Drill & Progression (90% accuracy gate)
  // -------------------------------------------------------------
  console.log('\n--- Test 4: Completing Level 1 Drill to Unlock Level 2 ---');

  // Drill text is: "asdf fdsa asdf fads sad dad fad"
  // We already typed 'a' for char-0. Let's type the rest accurately:
  const remainingText = "sdf fdsa asdf fads sad dad fad";
  for (const ch of remainingText) {
    if (ch === ' ') {
      await page.keyboard.press('Space');
    } else {
      await page.keyboard.press(ch);
    }
  }
  await page.waitForTimeout(500);

  // Result modal should be open
  const modalOpen = await page.isVisible('#lessonResultModal.open');
  assert('Result Modal displayed after drill', modalOpen);

  const modalTitle = await page.textContent('#modalTitle');
  assert('Level Passed modal triggered', modalTitle.includes('Unlocked') || modalTitle.includes('Passed'));

  // Check localStorage persistence
  const storedState = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('keyflow_pro_state_v1'));
  });
  assert('Level 2 unlocked in localStorage', storedState.highestLevelUnlocked >= 2, `(Highest Level: ${storedState.highestLevelUnlocked})`);
  assert('Best WPM recorded in localStorage', storedState.bestWpm > 0, `(Best WPM: ${storedState.bestWpm})`);

  // Close modal and verify Level 2 pill is unlocked
  await page.click('#modalNextBtn');
  await page.waitForTimeout(300);

  const lvl2Unlocked = await page.$eval('.level-pill[data-level-index="1"]', el => !el.classList.contains('locked'));
  assert('Level 2 selector pill unlocked on UI', lvl2Unlocked);

  // -------------------------------------------------------------
  // TEST 5: Arcade Mode (Falling Meteors)
  // -------------------------------------------------------------
  console.log('\n--- Test 5: Arcade Mode (Meteor Strike) ---');
  await page.click('#tabArcade');
  await page.waitForTimeout(300);

  const arcadeActive = await page.isVisible('#arcadeView.active');
  assert('Arcade tab active', arcadeActive);

  // Check pool description is dynamically updated to Level 2
  const poolDesc = await page.textContent('#arcadePoolDesc');
  assert('Dynamic Difficulty reflects unlocked Level 2', poolDesc.includes('Level 2') || poolDesc.includes('Home Row'), `(Pool: "${poolDesc}")`);

  // Start game
  await page.click('#btnStartArcadeGame');
  await page.waitForTimeout(600);

  const isPlaying = await page.evaluate(() => meteorArcade.isPlaying);
  assert('Arcade Game Loop started', isPlaying);

  // Wait for meteors to spawn
  await page.waitForTimeout(1500);
  const meteorsCount = await page.evaluate(() => meteorArcade.meteors.length);
  assert('Meteors spawned on Canvas', meteorsCount > 0, `(${meteorsCount} meteors)`);

  // Single Letter Spawns Assertion: verify all spawned bubbles contain strictly single letters (A-Z)
  const allBubblesSingleLetters = await page.evaluate(() => {
    return arcadeController.bubbleDrop.bubbles.every(b => b.text && b.text.length === 1);
  });
  assert('Bubble Drop strictly spawns single letters (A-Z) per UI requirement', allBubblesSingleLetters);

  // Target and type the first meteor's letter
  const meteorChar = await page.evaluate(() => meteorArcade.meteors[0].text[0]);
  console.log(`  🎯 Typing meteor target key: "${meteorChar}"`);
  await page.keyboard.press(meteorChar);
  await page.waitForTimeout(200);

  const score = await page.evaluate(() => meteorArcade.score);
  assert('Score increased and laser fired upon keystroke', score > 0, `(Score: ${score})`);

  // Test Pause / Resume
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const isPaused = await page.evaluate(() => meteorArcade.isPaused);
  assert('Arcade paused with Escape key', isPaused);

  await page.click('#btnResumeArcadeGame');
  await page.waitForTimeout(200);
  const isResumed = await page.evaluate(() => !meteorArcade.isPaused);
  assert('Arcade resumed', isResumed);

  // -------------------------------------------------------------
  // TEST 6: Dynamic Speed Scaling & Hard Reset on Exit
  // -------------------------------------------------------------
  console.log('\n--- Test 6: Dynamic Speed Scaling & Hard Reset on Exit ---');
  // Check slow start pace (Level 1)
  const initialArcadeLvl = await page.evaluate(() => arcadeController.currentLevel);
  assert('Arcade starts at Level 1 slow pace', initialArcadeLvl === 1, `(Level: ${initialArcadeLvl})`);

  const initialBaseSpeed = await page.evaluate(() => arcadeController.bubbleDrop.baseSpeed);
  assert('Bubble Drop baseSpeed is slow beginner pace (0.55)', initialBaseSpeed === 0.55);

  // In-Game Leveling: As score increases, level increases
  await page.evaluate(() => {
    arcadeController.bubbleDrop.addScore(450); // score crosses 300 milestone -> level 2
  });
  const lvlAfterScore = await page.evaluate(() => arcadeController.bubbleDrop.currentLevel);
  assert('Score increase triggers in-game level up', lvlAfterScore >= 2, `(Level: ${lvlAfterScore})`);

  // Check speed calculation formula: speed = baseSpeed + (currentLevel * 0.2)
  const expectedBubbleSpeed = 0.55 + (lvlAfterScore * 0.2);
  const testBubble = await page.evaluate(() => {
    const b = arcadeController.bubbleDrop.spawnBubble();
    return b.speed;
  });
  assert('Spawned bubble speed scales with Level (baseSpeed + level*0.2)', Math.abs(testBubble - expectedBubbleSpeed) <= 0.25);

  // Check Nitro Sprint and Word Blaster slow start
  const nitroBaseSpeed = await page.evaluate(() => arcadeController.nitroSprint.baseSpeed);
  assert('Nitro Sprint starts at slow baseSpeed 1.4', nitroBaseSpeed === 1.4);

  const wordBlasterBaseSpeed = await page.evaluate(() => arcadeController.wordBlaster.baseSpeed);
  assert('Word Blaster starts at slow baseSpeed 0.35', wordBlasterBaseSpeed === 0.35);

  // Hard Reset on Exit:
  // Click Exit Game button
  await page.click('#arcadeExitBtn');
  await page.waitForTimeout(300);

  const menuActiveAfterExit = await page.isVisible('#menuView.active');
  assert('Exit Game returns to Main Menu', menuActiveAfterExit);

  // Verify state completely reset: score = 0, level = 1, mid-game states NOT saved
  const resetBubbleScore = await page.evaluate(() => arcadeController.bubbleDrop.score);
  const resetBubbleLevel = await page.evaluate(() => arcadeController.bubbleDrop.currentLevel);
  const resetBubbleCount = await page.evaluate(() => arcadeController.bubbleDrop.bubbles.length);
  assert('Hard Reset reset score to 0', resetBubbleScore === 0);
  assert('Hard Reset reset level to Level 1', resetBubbleLevel === 1);
  assert('Hard Reset cleared active bubbles', resetBubbleCount === 0);

  // Re-enter Arcade mode from Menu
  await page.click('#cardLaunchArcade');
  await page.waitForTimeout(300);
  const arcadeReopened = await page.isVisible('#arcadeView.active');
  assert('Reopened Arcade view', arcadeReopened);

  const recheckScore = await page.evaluate(() => arcadeController.score);
  const recheckLevel = await page.evaluate(() => arcadeController.currentLevel);
  assert('Arcade state remains reset on reopen (score 0, level 1)', recheckScore === 0 && recheckLevel === 1);

  // -------------------------------------------------------------
  // TEST 7: Nitro Sprint Overhaul (Endless Solo Mode)
  // -------------------------------------------------------------
  console.log('\n--- Test 7: Nitro Sprint Overhaul (Endless Solo Mode) ---');
  await page.click('#tabArcadeNitroSprint');
  await page.waitForTimeout(300);

  const isNitroMode = await page.evaluate(() => arcadeController.activeMode === 'nitroSprint');
  assert('Nitro Sprint mode selected', isNitroMode);

  // Verify Start Overlay description reflects Endless Solo Racer
  const nitroStartDesc = await page.textContent('#arcadeStartDesc');
  assert('Nitro Sprint overlay describes Endless Solo Racer', nitroStartDesc.includes('Endless Solo Racer'));

  // Start Nitro Sprint
  await page.click('#btnStartArcadeGame');
  await page.waitForTimeout(400);

  const nitroPlaying = await page.evaluate(() => arcadeController.nitroSprint.isPlaying);
  assert('Nitro Sprint game loop active', nitroPlaying);

  // Solo Runner: verify NO AI rival bot exists
  const hasAiRival = await page.evaluate(() => typeof arcadeController.nitroSprint.aiDistance !== 'undefined');
  assert('Multiplayer & AI bots removed (strictly endless solo runner)', !hasAiRival);

  // 1. Movement strictly tied to typing: car is stationary initially (0 speed, 0 distance)
  const initialSpeed = await page.evaluate(() => arcadeController.nitroSprint.playerSpeed);
  const initialDistance = await page.evaluate(() => arcadeController.nitroSprint.playerDistance);
  assert('Car does not drive forward automatically (speed=0, dist=0 when idle)', initialSpeed === 0 && initialDistance === 0);

  // 2. Curriculum-based word generation: Level 1 generates words using ONLY Home Row keys
  const initialWord = await page.evaluate(() => arcadeController.nitroSprint.currentWord);
  const tier1Words = await page.evaluate(() => arcadeController.nitroSprint.tiers[1].words);
  assert('Level 1 curriculum strictly generates Home Row words (e.g. SAD, DAD, FALL)', tier1Words.includes(initialWord), `(Target: "${initialWord}")`);

  // 3. Keystroke Validation: Typing correct character advances car and charIndex
  console.log(`  🏎️ Typing Home Row curriculum word: "${initialWord}"`);
  for (const ch of initialWord) {
    await page.keyboard.press(ch);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(200);

  const completedWords = await page.evaluate(() => arcadeController.nitroSprint.wordsCompleted);
  const distanceTraveled = await page.evaluate(() => arcadeController.nitroSprint.playerDistance);
  const speedAfterTyping = await page.evaluate(() => arcadeController.nitroSprint.playerSpeed);
  assert('Correct typing advances word counter, speed, and distance', completedWords >= 1 && distanceTraveled > 0 && speedAfterTyping > 0, `(Dist: ${distanceTraveled.toFixed(1)}m, Speed: ${speedAfterTyping.toFixed(1)})`);

  // 4. Strike System (Failure Condition): 5-mistake limit. More than 5 errors triggers emergency braking!
  console.log('  ⚠️ Testing Strike System: making consecutive errors...');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('1'); // number key is never expected in tier 1 words
    await page.waitForTimeout(50);
  }

  const mistakesRecorded = await page.evaluate(() => arcadeController.nitroSprint.mistakes);
  const isEmergencyBraking = await page.evaluate(() => arcadeController.nitroSprint.isBraking);
  assert('Recorded 6 errors and immediately engaged emergency braking', mistakesRecorded > 5 && isEmergencyBraking);

  // Allow braking animation to decelerate to halt and trigger results dashboard
  await page.waitForTimeout(1200);

  const nitroResultsVisible = await page.isVisible('#nitroSprintResultsOverlay:not(.hidden)');
  assert('Results Dashboard displayed upon 5-strike Game Over', nitroResultsVisible);

  const finalWpmText = await page.textContent('#nitroFinalWpm');
  const finalTimeText = await page.textContent('#nitroFinalTime');
  const finalAccText = await page.textContent('#nitroFinalAccuracy');
  const finalDistText = await page.textContent('#nitroFinalDistance');
  const strikeStatusChip = await page.textContent('#nitroStatusChip');
  assert('Results dashboard displays valid telemetry & Engine Halted chip',
    finalWpmText.includes('WPM') && finalTimeText.includes('s') && finalAccText.includes('%') && strikeStatusChip.includes('ENGINE HALTED'),
    `(${finalWpmText}, ${finalTimeText}, ${finalAccText}, ${strikeStatusChip})`
  );

  // 5. Test "Re-engage Engine" button
  await page.click('#btnRestartNitroSprint');
  await page.waitForTimeout(300);

  const restartedNitroPlaying = await page.evaluate(() => arcadeController.nitroSprint.isPlaying);
  const restartedMistakes = await page.evaluate(() => arcadeController.nitroSprint.mistakes);
  const resultsOverlayHidden = await page.isHidden('#nitroSprintResultsOverlay');
  assert('Re-engage Engine button restarts solo racer cleanly', restartedNitroPlaying && restartedMistakes === 0 && resultsOverlayHidden);

  // 6. Test 5-Second Idle Timeout & Obstacle Crash:
  console.log('  🛑 Testing 5-Second Idle Timeout (waiting without typing)...');
  await page.waitForTimeout(5300);

  const isCrashed = await page.evaluate(() => arcadeController.nitroSprint.isCrashed);
  assert('5s idle timeout triggers obstacle crash', isCrashed);

  await page.waitForTimeout(1100);
  const crashResultsVisible = await page.isVisible('#nitroSprintResultsOverlay:not(.hidden)');
  const crashTitle = await page.textContent('#nitroResultsTitle');
  const crashChip = await page.textContent('#nitroStatusChip');
  assert('Collision Impact results dashboard displayed upon idle timeout crash', crashResultsVisible && crashTitle.includes('Obstacle Impact') && crashChip.includes('COLLISION IMPACT'));

  // Cleanly dismiss results for next tests
  await page.click('#btnRestartNitroSprint');
  await page.waitForTimeout(300);
  // -------------------------------------------------------------
  // TEST 8: Alphabet Sprint (A to Z Time Trial)
  // -------------------------------------------------------------
  console.log('\n--- Test 8: Alphabet Sprint (A to Z) Mode ---');
  // Switch to Alphabet Sprint mode
  await page.click('#tabArcadeAlphabetSprint');
  await page.waitForTimeout(300);

  const isSprintMode = await page.evaluate(() => arcadeController.activeMode === 'alphabetSprint');
  assert('Alphabet Sprint mode selected', isSprintMode);

  const startTitle = await page.textContent('#arcadeStartTitle');
  assert('Start overlay displays Alphabet Sprint', startTitle.includes('Alphabet Sprint'));

  // Start Alphabet Sprint
  await page.click('#btnStartArcadeGame');
  await page.waitForTimeout(400);

  const sprintStarted = await page.evaluate(() => arcadeController.alphabetSprint.isPlaying);
  const isWaitingA = await page.evaluate(() => arcadeController.alphabetSprint.isWaitingForStart);
  assert('Alphabet Sprint game initiated and waiting for "A"', sprintStarted && isWaitingA);

  // Mechanics: Prevent progression if typing wrong letter before start
  await page.keyboard.press('x');
  await page.waitForTimeout(100);
  const waitingStill = await page.evaluate(() => arcadeController.alphabetSprint.isWaitingForStart);
  const timerNotRunning = await page.evaluate(() => arcadeController.alphabetSprint.isTimerRunning);
  const errorsCount = await page.evaluate(() => arcadeController.alphabetSprint.errors);
  assert('Wrong key "x" rejected, timer did not start', waitingStill && !timerNotRunning && errorsCount === 1);

  // Mechanics: Timer starts the exact millisecond player presses 'a'
  await page.keyboard.press('a');
  await page.waitForTimeout(100);
  const timerRunning = await page.evaluate(() => arcadeController.alphabetSprint.isTimerRunning);
  const currIdxAfterA = await page.evaluate(() => arcadeController.alphabetSprint.currentIndex);
  assert('Pressing "a" starts timer and advances target to "B"', timerRunning && currIdxAfterA === 1);

  // Mechanics: Prevent progression if typing wrong letter during sprint
  await page.keyboard.press('z');
  await page.waitForTimeout(100);
  const currIdxAfterWrong = await page.evaluate(() => arcadeController.alphabetSprint.currentIndex);
  const errorsAfterWrong = await page.evaluate(() => arcadeController.alphabetSprint.errors);
  assert('Wrong key "z" when expecting "B" rejected and prevented progression', currIdxAfterWrong === 1 && errorsAfterWrong === 2);

  // Sprint through remaining letters B through Y
  const lettersBtoY = 'bcdefghijklmnopqrstuvwxy';
  for (const letter of lettersBtoY) {
    await page.keyboard.press(letter);
  }
  await page.waitForTimeout(100);
  const currIdxBeforeZ = await page.evaluate(() => arcadeController.alphabetSprint.currentIndex);
  assert('Accurately sprinted through B-Y (now on Z, index 25)', currIdxBeforeZ === 25);

  // Mechanics: Timer stops the exact millisecond player presses 'z'
  await page.keyboard.press('z');
  await page.waitForTimeout(300);

  const isFinished = await page.evaluate(() => arcadeController.alphabetSprint.isFinished);
  const timerStopped = await page.evaluate(() => !arcadeController.alphabetSprint.isTimerRunning);
  const totalTime = await page.evaluate(() => arcadeController.alphabetSprint.elapsedTime);
  assert('Pressing "z" finishes sprint and stops timer', isFinished && timerStopped && totalTime > 0, `(Time: ${totalTime.toFixed(3)}s)`);

  // Results & Stats: Overlay displayed with Time, WPM, KPM, Accuracy
  const resultsVisible = await page.isVisible('#alphabetSprintResultsOverlay:not(.hidden)');
  assert('Results overlay immediately displayed upon finish', resultsVisible);

  const displayTime = await page.textContent('#sprintFinalTime');
  const displayWpm = await page.textContent('#sprintFinalWpm');
  const displayKpm = await page.textContent('#sprintFinalKpm');
  const displayAcc = await page.textContent('#sprintFinalAccuracy');
  assert('Results display valid stats (Time, WPM, KPM, Acc)', 
    displayTime.includes('s') && displayWpm.includes('WPM') && displayKpm.includes('KPM') && displayAcc.includes('%'),
    `(${displayTime}, ${displayWpm}, ${displayKpm}, ${displayAcc})`
  );

  // Play Again button: instantly restart
  await page.click('#btnRestartAlphabetSprint');
  await page.waitForTimeout(300);

  const restartedWaiting = await page.evaluate(() => arcadeController.alphabetSprint.isWaitingForStart);
  const restartedIndex = await page.evaluate(() => arcadeController.alphabetSprint.currentIndex);
  const resultsHidden = await page.isHidden('#alphabetSprintResultsOverlay');
  assert('Play Again button instantly restarts sprint (waiting for "A", index 0, overlay hidden)', restartedWaiting && restartedIndex === 0 && resultsHidden);

  // -------------------------------------------------------------
  // TEST 9: Theme Toggle & Sound Toggle
  // -------------------------------------------------------------
  console.log('\n--- Test 9: Theme & Audio Preferences ---');
  const initialTheme = await page.getAttribute('html', 'data-theme');
  await page.click('#toggleThemeBtn');
  const toggledTheme = await page.getAttribute('html', 'data-theme');
  assert('Theme toggled successfully', initialTheme !== toggledTheme, `(${initialTheme} -> ${toggledTheme})`);

  // Re-toggle back
  await page.click('#toggleThemeBtn');

  // Toggle sound
  await page.click('#toggleSoundBtn');
  const isMuted = await page.evaluate(() => userState.soundMuted);
  assert('Sound muted via header toggle', isMuted === true);

  // -------------------------------------------------------------
  // TEST 10: Reset Progress
  // -------------------------------------------------------------
  console.log('\n--- Test 10: Reset Progress Confirmation ---');
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  await page.click('#resetProgressBtn');
  await page.waitForTimeout(300);

  const resetLvl = await page.evaluate(() => userState.highestLevelUnlocked);
  assert('Progress reset successfully to Level 1', resetLvl === 1);

  // Take visual verification screenshots
  await page.screenshot({ path: 'test_evidence_practice.png', fullPage: false });
  console.log('📸 Evidence screenshot saved: test_evidence_practice.png');

  await browser.close();

  // Summary
  console.log('\n=============================================');
  const passedCount = results.filter(r => r.status === 'PASS').length;
  console.log(`TEST SUMMARY: ${passedCount}/${results.length} Tests Passed!`);
  console.log('=============================================');

  if (passedCount === results.length) {
    console.log('🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
  } else {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
