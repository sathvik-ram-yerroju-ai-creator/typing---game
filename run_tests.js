
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
  // TEST 6: Theme Toggle & Sound Toggle
  // -------------------------------------------------------------
  console.log('\n--- Test 6: Theme & Audio Preferences ---');
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
  // TEST 7: Reset Progress
  // -------------------------------------------------------------
  console.log('\n--- Test 7: Reset Progress Confirmation ---');
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
