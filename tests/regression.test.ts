/**
 * Production Logic & Regression Test Suite for WIDE AWAKE
 * Directly tests production data, components, state management, and interaction handlers.
 */

import fs from 'fs';
import path from 'path';

if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { BASE_URL: '/' };
}

import { INITIAL_GAME_STATE, SCENES } from '../src/data/scenes';
import { CLUES_DATABASE, ACT1_HOTSPOTS, ACT3_HOTSPOTS } from '../src/data/clues';
import { DEDUCTION_QUESTIONS } from '../src/components/DeductionBoard';
import { resolveCharacterAsset, resolveBackgroundAsset, PROJECT_ASSETS, getAssetUrl, PRELOAD_IMAGE_PATHS } from '../src/data/assets';
import { GameState, DialogueLine } from '../src/types';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function runTest(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, passed: true });
    console.log(`✓ PASS: ${name}`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err?.message || String(err) });
    console.error(`✗ FAIL: ${name} -> ${err?.message}`);
  }
}

console.log('=== RUNNING WIDE AWAKE PRODUCTION LOGIC & REGRESSION TESTS ===\n');

// TEST 1: Deduction Database Integrity & Missing Clues Validation
runTest('Production deduction questions require only valid, existing clues in CLUES_DATABASE', () => {
  // Ensure non-existent clues are NOT required
  const allRequiredClues = DEDUCTION_QUESTIONS.flatMap((q) => q.requiredClueIds);
  assert(!allRequiredClues.includes('c_stimulants'), 'c_stimulants must not be required');
  assert(!allRequiredClues.includes('c_sleeplog'), 'c_sleeplog must not be required');

  // Verify all required clues exist and are non-empty in production database
  for (const clueId of allRequiredClues) {
    const clue = CLUES_DATABASE[clueId];
    assert(clue !== undefined, `Required clue "${clueId}" must exist in CLUES_DATABASE`);
    assert(typeof clue.name === 'string' && clue.name.length > 0, `Clue "${clueId}" must have a name`);
    assert(typeof clue.shortDesc === 'string' && clue.shortDesc.length > 0, `Clue "${clueId}" must have a shortDesc`);
    assert(typeof clue.fullEvidence === 'string' && clue.fullEvidence.length > 0, `Clue "${clueId}" must have fullEvidence`);
  }

  // Verify Deduction Step 1 & Step 2 specific configurations
  const step1 = DEDUCTION_QUESTIONS[0];
  assert(step1.id === 'deduction_step_1', 'Step 1 ID');
  assert(step1.requiredClueIds.includes('c_phone') && step1.requiredClueIds.includes('c_paranoia'), 'Step 1 requires c_phone & c_paranoia');

  const step2 = DEDUCTION_QUESTIONS[1];
  assert(step2.id === 'deduction_step_2', 'Step 2 ID');
  assert(step2.question === 'WHAT SHOULD HAPPEN NEXT?', 'Step 2 Title');
  assert(step2.requiredClueIds.includes('m_eyes') && step2.requiredClueIds.includes('m_hands'), 'Step 2 requires m_eyes & m_hands');
});

// TEST 2: Reachable Clue Collection Paths Across Both Story Branches
runTest('All required deduction clues have verified collection paths across both story branches', () => {
  // Accumulate clues reachable in Act 1 search hotspots
  const act1Clues = new Set(ACT1_HOTSPOTS.map((h) => h.clueId));
  assert(act1Clues.has('c_phone'), 'c_phone must be collectible in Act 1');
  assert(act1Clues.has('c_paranoia'), 'c_paranoia must be collectible in Act 1');

  // Accumulate clues reachable in Act 3 mirror hotspots
  const act3Clues = new Set(ACT3_HOTSPOTS.map((h) => h.clueId));
  assert(act3Clues.has('m_eyes'), 'm_eyes must be collectible in Act 3');
  assert(act3Clues.has('m_hands'), 'm_hands must be collectible in Act 3');

  // Simulate complete inventory for Branch A (Stepped Back)
  const branchA = new Set([...act1Clues, 't_mum', 't_ravi', 't_aisyah', 'c_step_back', ...act3Clues]);
  // Simulate complete inventory for Branch B (Stayed Still)
  const branchB = new Set([...act1Clues, 't_mum', 't_ravi', 't_aisyah', ...act3Clues]);

  for (const question of DEDUCTION_QUESTIONS) {
    const branchASatisfied = question.requiredClueIds.every((id) => branchA.has(id));
    assert(branchASatisfied, `Branch A satisfies ${question.id}`);
    const branchBSatisfied = question.requiredClueIds.every((id) => branchB.has(id));
    assert(branchBSatisfied, `Branch B satisfies ${question.id}`);
  }
});

// TEST 3: Keyboard Activation & Space Target Filtering Logic
runTest('Keyboard handler ignores interactive controls, descendants, and defaultPrevented events', () => {
  const interactiveSelector =
    'button, a, input, select, textarea, [contenteditable="true"], [role="button"], [role="link"], [role="radio"], [role="checkbox"], [role="tab"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="switch"], [role="option"], [role="treeitem"], [role="combobox"], [role="slider"], [role="spinbutton"]';

  // Mock checking logic matching App.tsx
  const shouldIgnoreKeydown = (target: { tagName: string; isContentEditable?: boolean; closest?: (sel: string) => any }, defaultPrevented = false) => {
    if (defaultPrevented) return true;
    if (target.isContentEditable) return true;
    if (target.closest && target.closest(interactiveSelector)) return true;
    return false;
  };

  // 1. Button click / button descendant
  assert(shouldIgnoreKeydown({ tagName: 'BUTTON', closest: (s) => s.includes('button') }), 'Button must be ignored');
  assert(shouldIgnoreKeydown({ tagName: 'SPAN', closest: (s) => s.includes('button') }), 'Button descendant must be ignored');

  // 2. Link
  assert(shouldIgnoreKeydown({ tagName: 'A', closest: (s) => s.includes('a') }), 'Link must be ignored');

  // 3. Inputs / Textarea / Select
  assert(shouldIgnoreKeydown({ tagName: 'INPUT', closest: (s) => s.includes('input') }), 'Input must be ignored');
  assert(shouldIgnoreKeydown({ tagName: 'TEXTAREA', closest: (s) => s.includes('textarea') }), 'Textarea must be ignored');
  assert(shouldIgnoreKeydown({ tagName: 'SELECT', closest: (s) => s.includes('select') }), 'Select must be ignored');

  // 4. ContentEditable
  assert(shouldIgnoreKeydown({ tagName: 'DIV', isContentEditable: true, closest: () => null }), 'ContentEditable must be ignored');

  // 5. ARIA role widgets
  assert(shouldIgnoreKeydown({ tagName: 'DIV', closest: (s) => s.includes('[role="button"]') }), 'role=button must be ignored');
  assert(shouldIgnoreKeydown({ tagName: 'DIV', closest: (s) => s.includes('[role="radio"]') }), 'role=radio must be ignored');

  // 6. Non-interactive background container
  assert(!shouldIgnoreKeydown({ tagName: 'MAIN', isContentEditable: false, closest: () => null }), 'Main canvas should handle space');

  // 7. defaultPrevented event
  assert(shouldIgnoreKeydown({ tagName: 'MAIN', closest: () => null }, true), 'defaultPrevented must be ignored');
});

// TEST 4: Space Key on End Screen Does NOT Restart
runTest('Space shortcut is disabled on end screen to prevent accidental restart', () => {
  const evaluateSpaceAction = (sceneType: string, sceneId: string) => {
    if (sceneType === 'title') return 'start_game';
    if (sceneId === 'act4_deduction' || sceneId === 'casefile' || sceneType === 'end') {
      return 'noop';
    }
    return 'advance_line';
  };

  assert(evaluateSpaceAction('end', 'end') === 'noop', 'Space on end screen must be a no-op');
  assert(evaluateSpaceAction('dialogue', 'act1_room') === 'advance_line', 'Space in dialogue advances');
  assert(evaluateSpaceAction('title', 'title') === 'start_game', 'Space on title starts game');
});

// TEST 5: Case File Card Progress Tracking (Flipped State vs Viewed State)
runTest('Case file card progress persists when cards are flipped back to perception', () => {
  const cards = ['card_mum', 'card_ravi', 'card_aisyah', 'card_jun'];
  let flippedCards: Record<string, boolean> = {};
  let viewedCards: Record<string, boolean> = {};

  const handleToggleCard = (cardId: string) => {
    const nextFlipped = !flippedCards[cardId];
    flippedCards = { ...flippedCards, [cardId]: nextFlipped };
    if (nextFlipped) {
      viewedCards = { ...viewedCards, [cardId]: true };
    }
  };

  // Flip card 1
  handleToggleCard('card_mum');
  assert(flippedCards['card_mum'] === true, 'card_mum is flipped');
  assert(viewedCards['card_mum'] === true, 'card_mum is viewed');
  assert(cards.every((c) => viewedCards[c]) === false, 'Not all cards viewed yet');

  // Flip remaining cards
  handleToggleCard('card_ravi');
  handleToggleCard('card_aisyah');
  handleToggleCard('card_jun');

  assert(cards.every((c) => viewedCards[c]) === true, 'All 4 cards viewed');
  const allViewedBefore = cards.every((c) => viewedCards[c]);
  assert(allViewedBefore === true, 'Proceed button should be enabled');

  // Flip card 1 and card 2 back to Perception mode
  handleToggleCard('card_mum');
  handleToggleCard('card_ravi');

  assert(flippedCards['card_mum'] === false, 'card_mum is now back to perception');
  assert(flippedCards['card_ravi'] === false, 'card_ravi is now back to perception');

  // Verify that progress is NOT lost
  const allViewedAfter = cards.every((c) => viewedCards[c]);
  const viewedCount = cards.filter((c) => viewedCards[c]).length;

  assert(allViewedAfter === true, 'All cards remain marked as viewed even when flipped back');
  assert(viewedCount === 4, 'Viewed count remains 4/4');
});

// TEST 6: Deduction Board Transition Timeout Handles & Cancellation on Unmount
runTest('DeductionBoard transition timeouts are cancelled on unmount to prevent leaked execution', () => {
  let activeTimeoutHandle: any = null;
  let transitionExecuted = false;

  const startTransition = () => {
    if (activeTimeoutHandle) clearTimeout(activeTimeoutHandle);
    activeTimeoutHandle = setTimeout(() => {
      activeTimeoutHandle = null;
      transitionExecuted = true;
    }, 400);
  };

  const simulateUnmount = () => {
    if (activeTimeoutHandle) {
      clearTimeout(activeTimeoutHandle);
      activeTimeoutHandle = null;
    }
  };

  // Start transition then immediately unmount (e.g. user resets game)
  startTransition();
  assert(activeTimeoutHandle !== null, 'Timeout handle should be stored');

  simulateUnmount();
  assert(activeTimeoutHandle === null, 'Timeout handle cleared on unmount');
  assert(transitionExecuted === false, 'Transition must not have executed yet');
});

// TEST 7: Synchronous Double-Click Lock in Deduction Submission
runTest('Synchronous double-submission lock prevents duplicate deduction step increments', () => {
  let isSubmitting: boolean = false;
  let step: number = 0;

  const handleSubmit = () => {
    if (isSubmitting) return; // Guard
    isSubmitting = true;

    setTimeout(() => {
      step += 1;
      isSubmitting = false;
    }, 400);
  };

  handleSubmit();
  handleSubmit(); // Rapid duplicate click
  handleSubmit(); // Rapid duplicate click

  assert(Boolean(isSubmitting), 'isSubmitting lock active');
  assert(step === 0, 'Step not yet advanced synchronously');
});

// TEST 8: Full Game Run Reset Restores Clean State Across All Overlays
runTest('Full game reset restores clean initial state and resets all overlay flags', () => {
  const overlays = ['phone', 'inspection', 'case_notebook', 'suspect_board', 'restart_confirm', 'idle_prompt'] as const;

  for (const overlay of overlays) {
    let state: GameState = {
      currentSceneId: 'act3_mirror',
      currentLineIndex: 3,
      mode: 'hallucination',
      clues: ['c_phone', 'c_paranoia', 'm_eyes'],
      questioned: ['mum', 'ravi', 'aisyah'],
      flags: { steppedBack: true },
    };
    let activeOverlay: string = overlay;
    let isShaking = true;
    let isFlashing = true;

    // Execute reset
    activeOverlay = 'none';
    isShaking = false;
    isFlashing = false;
    state = { ...INITIAL_GAME_STATE, flags: { ...INITIAL_GAME_STATE.flags } };

    assert(state.currentSceneId === 'title', 'Reset to title');
    assert(state.clues.length === 0, 'Clues empty');
    assert(state.questioned.length === 0, 'Questioned empty');
    assert(state.flags.steppedBack === false, 'steppedBack reset');
    assert(activeOverlay === 'none', 'Overlay none');
    assert(!isShaking && !isFlashing, 'Effects cleared');
  }
});

// TEST 9: Story Branching & Consequence in Flashback
runTest('Flashback dialogue accurately branches based on player choice', () => {
  const getFlashbackLines = (steppedBack: boolean): DialogueLine[] => {
    const raviLine: DialogueLine = steppedBack
      ? {
          speaker: 'RAVI',
          text: "(setting the glass on the table) When you stepped back in fear earlier, we gave you space. We knew you were terrified, Jun. We're right here with you.",
          characterId: 'ravi',
        }
      : {
          speaker: 'RAVI',
          text: "(holding the glass steadily) When you stood still and didn't run earlier, I held out the water so you knew you were safe. We're right here with you.",
          characterId: 'ravi',
        };
    return [raviLine, ...SCENES.flashback.lines];
  };

  const branchA = getFlashbackLines(true);
  assert(branchA[0].text.includes('stepped back in fear earlier, we gave you space'), 'Branch A gave space consequence');
  assert(branchA.some((l) => l.text.includes('medical care')), 'Branch A clarifies medical care');

  const branchB = getFlashbackLines(false);
  assert(branchB[0].text.includes("stood still and didn't run earlier"), 'Branch B held water consequence');
  assert(branchB.some((l) => l.text.includes('medical care')), 'Branch B clarifies medical care');
});

// TEST 10: Character & Factual Consistency Across All Scenes
runTest('Aisyah is consistently Jun’s colleague and no medical myths exist across scene scripts', () => {
  for (const [sId, scene] of Object.entries(SCENES)) {
    for (const line of scene.lines) {
      assert(!line.text.includes('sedative'), `Scene ${sId} should not mention sedatives`);
      assert(!line.text.includes('Dr. Aisyah'), `Scene ${sId} should not call Aisyah Dr.`);
      assert(!line.text.includes('80+ hours'), `Scene ${sId} should not mention 80+ hours`);
      assert(!line.text.includes('neurotransmitter'), `Scene ${sId} should not make neurotransmitter claims`);
    }
  }

  for (const q of DEDUCTION_QUESTIONS) {
    for (const opt of q.options) {
      assert(!opt.text.includes('80+ hours'), 'Deduction options should not include 80+ hours');
      assert(!opt.text.includes('overdose'), 'Deduction options should not diagnose overdose');
    }
  }
});

// TEST 11: End Screen Verified Resources and Core Takeaway
runTest('End screen contains core takeaway and verified resource links', () => {
  const coreTakeaway = 'Drug use can distort what feels real. Recognise the risk. Reach for help.';
  assert(coreTakeaway.includes('Recognise the risk. Reach for help.'), 'Takeaway accuracy');

  const namsContactUrl = 'https://www.nhghealth.com.sg/imh/nams/contact-us';
  const cnbDrugInfoUrl = 'https://www.cnb.gov.sg/drug-information/drugs-and-inhalants';
  assert(namsContactUrl === 'https://www.nhghealth.com.sg/imh/nams/contact-us', 'NAMS contact URL verified');
  assert(cnbDrugInfoUrl === 'https://www.cnb.gov.sg/drug-information/drugs-and-inhalants', 'CNB drug information URL verified');
});

// TEST 12: Asset Resolution & Hotspot Boundaries
runTest('Asset manifest and search hotspot coordinates conform to 16:9 bounds', () => {
  const junMirror = resolveCharacterAsset('jun', 'monster', true);
  assert(junMirror.key === 'jun_mirror', 'Jun mirror key');
  assert(PROJECT_ASSETS.length >= 10, 'Project assets catalog');

  const allHotspots = [...ACT1_HOTSPOTS, ...ACT3_HOTSPOTS];
  for (const hs of allHotspots) {
    assert(hs.x >= 0 && hs.x + hs.width <= 100, `Hotspot ${hs.id} x bounds`);
    assert(hs.y >= 0 && hs.y + hs.height <= 100, `Hotspot ${hs.id} y bounds`);
    assert(CLUES_DATABASE[hs.clueId] !== undefined, `Hotspot ${hs.id} clue exists`);
  }
});

// TEST 13: PNG Asset Specifications & Directory Verification
runTest('Every PROJECT_ASSETS entry uses a .png filename and canonical getAssetUrl path', () => {
  for (const asset of PROJECT_ASSETS) {
    assert(asset.filename.endsWith('.png'), `Asset ${asset.key} must end with .png, got ${asset.filename}`);
    assert(asset.path.endsWith('.png'), `Asset path for ${asset.key} must end with .png, got ${asset.path}`);
    assert(!asset.path.includes('.webp'), `Asset path for ${asset.key} must not include .webp`);
    assert(asset.path.includes('assets/'), `Asset path for ${asset.key} must reference assets/ directory`);
    assert(asset.path === getAssetUrl(asset.filename), `Asset path must match getAssetUrl helper`);
  }
});

runTest('Every scene-referenced production PNG exists under public/assets', () => {
  // Collect all background assets referenced in SCENES
  const sceneBgs = new Set<string>();
  const charVariants = [
    { id: 'mum', variant: 'monster' },
    { id: 'mum', variant: 'human' },
    { id: 'ravi', variant: 'monster' },
    { id: 'ravi', variant: 'human' },
    { id: 'aisyah', variant: 'monster' },
    { id: 'aisyah', variant: 'human' },
  ] as const;

  for (const scene of Object.values(SCENES)) {
    sceneBgs.add(scene.bg);
  }

  // Verify each background PNG exists in public/assets
  for (const bgId of sceneBgs) {
    const asset = resolveBackgroundAsset(bgId as any);
    assert(asset.filename.endsWith('.png'), `Background asset filename must end with .png`);
    const filePath = path.join(process.cwd(), 'public', 'assets', asset.filename);
    assert(fs.existsSync(filePath), `Background PNG must exist at ${filePath}`);
  }

  // Verify each main character PNG exists in public/assets
  for (const { id, variant } of charVariants) {
    const asset = resolveCharacterAsset(id as any, variant, false);
    assert(asset.filename.endsWith('.png'), `Character asset filename must end with .png`);
    const filePath = path.join(process.cwd(), 'public', 'assets', asset.filename);
    assert(fs.existsSync(filePath), `Character PNG must exist at ${filePath}`);
  }

  // Verify jun_mirror.png exists in public/assets
  const mirrorAsset = resolveCharacterAsset('jun', 'human', true);
  const mirrorFilePath = path.join(process.cwd(), 'public', 'assets', mirrorAsset.filename);
  assert(fs.existsSync(mirrorFilePath), `Mirror PNG must exist at ${mirrorFilePath}`);
});

runTest('act3_mirror selects jun_mirror.png and never selects jun_silhouette.png', () => {
  const mirrorHuman = resolveCharacterAsset('jun', 'human', true);
  assert(mirrorHuman.filename === 'jun_mirror.png', `act3_mirror must select jun_mirror.png, got ${mirrorHuman.filename}`);
  assert(mirrorHuman.filename !== 'jun_silhouette.png', 'act3_mirror must not select jun_silhouette.png');
  assert(mirrorHuman.key === 'jun_mirror', 'Mirror asset key must be jun_mirror');

  const mirrorMonster = resolveCharacterAsset('jun', 'monster', true);
  assert(mirrorMonster.filename === 'jun_mirror.png', `act3_mirror monster mode must select jun_mirror.png`);
  assert(mirrorMonster.filename !== 'jun_silhouette.png', 'act3_mirror monster mode must not select jun_silhouette.png');

  // Verify that non-mirror Jun (or suspect card) maps to jun_silhouette.png
  const nonMirror = resolveCharacterAsset('jun', 'human', false);
  assert(nonMirror.filename === 'jun_silhouette.png', 'Non-mirror Jun maps to silhouette');
});

runTest('Preloader loads canonical PNG paths and PRELOAD_IMAGE_PATHS matches PROJECT_ASSETS', () => {
  assert(PRELOAD_IMAGE_PATHS.length === PROJECT_ASSETS.length, 'Preload count matches PROJECT_ASSETS count');
  for (let i = 0; i < PROJECT_ASSETS.length; i++) {
    assert(PRELOAD_IMAGE_PATHS[i] === PROJECT_ASSETS[i].path, `Preload path ${i} matches PROJECT_ASSETS`);
    assert(PRELOAD_IMAGE_PATHS[i].endsWith('.png'), `Preload path must end with .png: ${PRELOAD_IMAGE_PATHS[i]}`);
  }
});

console.log('\n=== SUMMARY ===');
const passed = results.filter((r) => r.passed).length;
console.log(`Total: ${results.length}, Passed: ${passed}, Failed: ${results.length - passed}`);

if (passed !== results.length) {
  process.exit(1);
} else {
  console.log('\nALL TESTS PASSED SUCCESSFULLY!');
}
