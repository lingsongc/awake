import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StageContainer } from './components/StageContainer';
import { BackgroundLayer } from './components/BackgroundLayer';
import { CharacterLayer } from './components/CharacterLayer';
import { DialogueBox } from './components/DialogueBox';
import { AssetConfirmBar } from './components/AssetConfirmBar';
import { TitleScreen } from './components/TitleScreen';
import { ChoiceMenu } from './components/ChoiceMenu';
import { EndScreen } from './components/EndScreen';
import { SceneRibbon } from './components/SceneRibbon';
import { IdlePromptModal } from './components/IdlePromptModal';
import { HotspotOverlay } from './components/HotspotOverlay';
import { SearchHUD } from './components/SearchHUD';
import { InspectionModal } from './components/InspectionModal';
import { CaseNotebookDrawer } from './components/CaseNotebookDrawer';
import { SuspectBoard } from './components/SuspectBoard';
import { PhoneInspectModal } from './components/PhoneInspectModal';
import { DeductionBoard } from './components/DeductionBoard';
import { CaseFileScreen } from './components/CaseFileScreen';
import { KioskPreloader } from './components/KioskPreloader';
import { SCENES, INITIAL_GAME_STATE } from './data/scenes';
import { ACT1_HOTSPOTS, ACT3_HOTSPOTS, Hotspot } from './data/clues';
import { GameState, SceneChoice, DialogueLine } from './types';
import { RotateCcw, AlertTriangle, Monitor } from 'lucide-react';
import { useModalAccessibility } from './hooks/useModalAccessibility';

export type ActiveOverlay =
  | 'none'
  | 'inspection'
  | 'phone'
  | 'case_notebook'
  | 'suspect_board'
  | 'restart_confirm'
  | 'idle_prompt';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Debug Inspector overrides (active when user modifies background/character in AssetConfirmBar)
  const [debugInspectorActive, setDebugInspectorActive] = useState<boolean>(false);
  const [debugBg, setDebugBg] = useState<'bg_bedroom' | 'bg_living' | 'bg_hallway'>('bg_bedroom');
  const [debugChar, setDebugChar] = useState<'mum' | 'ravi' | 'aisyah' | 'jun'>('ravi');
  const [debugVariant, setDebugVariant] = useState<'monster' | 'human'>('monster');
  const [debugPosition, setDebugPosition] = useState<'left' | 'center' | 'right'>('center');
  const [failedAssets, setFailedAssets] = useState<Record<string, boolean>>({});

  const handleAssetError = useCallback((filename: string) => {
    setFailedAssets((prev) => ({ ...prev, [filename]: true }));
  }, []);

  // Motion Preference (Persisted across resets)
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wideawake_reduce_motion');
      if (saved !== null) {
        return saved === 'true';
      }
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }
    return false;
  });

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('wideawake_reduce_motion', String(next));
      }
      return next;
    });
  }, []);

  // Portrait vs Landscape Responsive Detection
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Run/Session ID to reject stale async callbacks
  const runIdRef = useRef<number>(1);
  const shakeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Single Active Overlay State
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>('none');
  const [inspectionState, setInspectionState] = useState<{
    hotspot: Hotspot;
    lineIndex: number;
  } | null>(null);

  // Debug & Kiosk mode opt-ins (default: clean ordinary play)
  const [isDebugMode, setIsDebugMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('debug') === 'true' || params.get('debug') === '1';
    }
    return false;
  });

  const [isKioskMode, setIsKioskMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('kiosk') === 'true' || params.get('kiosk') === '1';
    }
    return false;
  });

  // Preloader State
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Last Activity tracker stored in Ref
  const lastActivityRef = useRef<number>(Date.now());

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Global activity listeners
  useEffect(() => {
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastActivityRef.current = Date.now();
      }
    };

    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // One Complete Run Reset (Preserves reduceMotion preference)
  const resetGame = useCallback(() => {
    runIdRef.current += 1;

    if (shakeTimerRef.current) {
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = null;
    }

    setDebugInspectorActive(false);
    setActiveOverlay('none');
    setInspectionState(null);
    setIsShaking(false);
    setIsFlashing(false);
    lastActivityRef.current = Date.now();
    setGameState(INITIAL_GAME_STATE);
  }, []);

  // Jump to arbitrary scene
  const jumpToScene = useCallback((sceneId: string) => {
    if (!SCENES[sceneId]) return;
    const targetScene = SCENES[sceneId];
    setDebugInspectorActive(false);
    setGameState((prev) => ({
      ...prev,
      currentSceneId: sceneId,
      currentLineIndex: 0,
      mode: targetScene.mode,
    }));
  }, []);

  // Current Scene definition
  const currentScene = useMemo(() => {
    return SCENES[gameState.currentSceneId] || SCENES.title;
  }, [gameState.currentSceneId]);

  const isPostReveal = useMemo(() => {
    return (
      gameState.mode === 'clean' ||
      ['reveal', 'casefile', 'flashback', 'end'].includes(gameState.currentSceneId)
    );
  }, [gameState.mode, gameState.currentSceneId]);

  // Compute active dialogue lines
  const activeLines = useMemo((): DialogueLine[] => {
    if (gameState.currentSceneId === 'flashback') {
      const raviLine: DialogueLine = gameState.flags.steppedBack
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
      return [raviLine, ...currentScene.lines];
    }

    if (gameState.currentSceneId === 'act2_suspects') {
      const allQuestioned =
        gameState.questioned.includes('mum') &&
        gameState.questioned.includes('ravi') &&
        gameState.questioned.includes('aisyah');

      if (allQuestioned) {
        return [
          {
            speaker: '(N)',
            text: 'All three witnesses have spoken. The figure in the red cap steps closer, holding out a glass of water.',
          },
        ];
      }
    }

    return currentScene.lines;
  }, [currentScene, gameState.currentSceneId, gameState.flags.steppedBack, gameState.questioned]);

  // Kiosk Inactivity Checker (Active only when kiosk mode is on)
  useEffect(() => {
    if (!isKioskMode) return;

    const checkIdle = setInterval(() => {
      if (
        gameState.currentSceneId !== 'title' &&
        gameState.currentSceneId !== 'end' &&
        activeOverlay !== 'idle_prompt' &&
        Date.now() - lastActivityRef.current > 60000
      ) {
        setActiveOverlay('idle_prompt');
      }
    }, 2000);

    return () => clearInterval(checkIdle);
  }, [isKioskMode, gameState.currentSceneId, activeOverlay]);

  // Choices to display
  const choicesToDisplay = useMemo((): SceneChoice[] | null => {
    if (!currentScene.choices) return null;

    if (currentScene.type === 'question_menu') {
      const allQuestioned =
        gameState.questioned.includes('mum') &&
        gameState.questioned.includes('ravi') &&
        gameState.questioned.includes('aisyah');

      if (allQuestioned) {
        return null;
      }

      if (gameState.currentLineIndex >= activeLines.length - 1) {
        return currentScene.choices.map((choice) => {
          let charId: 'mum' | 'ravi' | 'aisyah' = 'mum';
          if (choice.id.includes('ravi')) charId = 'ravi';
          if (choice.id.includes('aisyah')) charId = 'aisyah';
          const isDone = gameState.questioned.includes(charId);

          return {
            ...choice,
            text: isDone ? `✓ ${choice.text} (Questioned)` : choice.text,
          };
        });
      }
    }

    if (currentScene.type === 'choice') {
      if (gameState.currentLineIndex >= activeLines.length - 1) {
        return currentScene.choices;
      }
    }

    return null;
  }, [currentScene, gameState.currentLineIndex, activeLines.length, gameState.questioned]);

  // Hotspots for search scenes
  const currentHotspots = useMemo((): Hotspot[] => {
    if (gameState.currentSceneId === 'act1_room') return ACT1_HOTSPOTS;
    if (gameState.currentSceneId === 'act3_mirror') return ACT3_HOTSPOTS;
    return [];
  }, [gameState.currentSceneId]);

  const isSearchScene = currentScene.type === 'search' && currentHotspots.length > 0;

  const searchSceneCluesFound = useMemo(() => {
    if (!isSearchScene) return [];
    return currentHotspots
      .map((h) => h.clueId)
      .filter((clueId) => gameState.clues.includes(clueId));
  }, [isSearchScene, currentHotspots, gameState.clues]);

  const canProceedFromSearch =
    isSearchScene && searchSceneCluesFound.length >= currentHotspots.length;

  // Single Overlay Hotspot Inspection Management
  const handleSelectHotspot = (hotspot: Hotspot) => {
    recordActivity();

    if (hotspot.id === 'hs_phone') {
      setInspectionState(null);
      setActiveOverlay('phone');
      return;
    }

    setInspectionState({ hotspot, lineIndex: 0 });
    setActiveOverlay('inspection');
  };

  const handleAdvanceInspection = () => {
    recordActivity();
    if (!inspectionState) return;

    if (inspectionState.lineIndex < inspectionState.hotspot.examineLines.length - 1) {
      setInspectionState((prev) =>
        prev ? { ...prev, lineIndex: prev.lineIndex + 1 } : null
      );
    } else {
      const clueId = inspectionState.hotspot.clueId;
      setGameState((prev) => {
        if (prev.clues.includes(clueId)) return prev;
        return { ...prev, clues: [...prev.clues, clueId] };
      });
      setInspectionState(null);
      setActiveOverlay('none');
    }
  };

  const handleCloseInspection = () => {
    recordActivity();
    if (inspectionState) {
      const clueId = inspectionState.hotspot.clueId;
      setGameState((prev) => {
        if (prev.clues.includes(clueId)) return prev;
        return { ...prev, clues: [...prev.clues, clueId] };
      });
    }
    setInspectionState(null);
    setActiveOverlay('none');
  };

  const handlePhoneCompleteClue = () => {
    setGameState((prev) => {
      if (prev.clues.includes('c_phone')) return prev;
      return { ...prev, clues: [...prev.clues, 'c_phone'] };
    });
  };

  // Handle Choice Selection
  const handleSelectChoice = (choice: SceneChoice) => {
    recordActivity();

    if (choice.id === 'c_step_back' && !reduceMotion) {
      setIsShaking(true);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setIsShaking(false), 300);
    }

    const updatedFlags = { ...gameState.flags };
    if (choice.setFlags) {
      if (typeof choice.setFlags.steppedBack === 'boolean') {
        updatedFlags.steppedBack = choice.setFlags.steppedBack;
      }
    }

    const updatedClues = [...gameState.clues];
    if (choice.addClue && !updatedClues.includes(choice.addClue)) {
      updatedClues.push(choice.addClue);
    }

    const updatedQuestioned = [...gameState.questioned];
    if (choice.id === 'q_mum' && !updatedQuestioned.includes('mum')) updatedQuestioned.push('mum');
    if (choice.id === 'q_ravi' && !updatedQuestioned.includes('ravi')) updatedQuestioned.push('ravi');
    if (choice.id === 'q_aisyah' && !updatedQuestioned.includes('aisyah')) updatedQuestioned.push('aisyah');

    const nextScene = SCENES[choice.nextSceneId];
    setGameState((prev) => ({
      ...prev,
      flags: updatedFlags,
      clues: updatedClues,
      questioned: updatedQuestioned,
      currentSceneId: choice.nextSceneId,
      currentLineIndex: 0,
      mode: nextScene?.mode || prev.mode,
    }));
  };

  // Handle Dialogue Advance
  const handleAdvance = useCallback(() => {
    recordActivity();

    if (activeOverlay !== 'none') return;

    if (currentScene.type === 'title' || currentScene.type === 'end' || choicesToDisplay !== null) {
      return;
    }

    if (gameState.currentSceneId === 'act2_suspects') {
      const allQuestioned =
        gameState.questioned.includes('mum') &&
        gameState.questioned.includes('ravi') &&
        gameState.questioned.includes('aisyah');
      if (allQuestioned) {
        jumpToScene('act2_reach');
        return;
      }
    }

    if (gameState.currentLineIndex < activeLines.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentLineIndex: prev.currentLineIndex + 1,
      }));
    } else {
      if (isSearchScene && !canProceedFromSearch) {
        return;
      }

      if (currentScene.nextSceneId) {
        jumpToScene(currentScene.nextSceneId);
      }
    }
  }, [
    activeOverlay,
    currentScene,
    choicesToDisplay,
    gameState.currentSceneId,
    gameState.currentLineIndex,
    gameState.questioned,
    activeLines.length,
    isSearchScene,
    canProceedFromSearch,
    jumpToScene,
    recordActivity,
  ]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.isContentEditable) {
          return;
        }
        const interactiveSelector =
          'button, a, input, select, textarea, [contenteditable="true"], [role="button"], [role="link"], [role="radio"], [role="checkbox"], [role="tab"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="switch"], [role="option"], [role="treeitem"], [role="combobox"], [role="slider"], [role="spinbutton"]';
        if (target.closest && target.closest(interactiveSelector)) {
          return;
        }
      }

      // Debug toggle shortcut: Ctrl + Alt + D
      if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        setIsDebugMode((prev) => !prev);
        return;
      }

      // Kiosk toggle shortcut: Ctrl + Alt + K
      if (e.ctrlKey && e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsKioskMode((prev) => !prev);
        return;
      }

      // Space to advance
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        recordActivity();

        if (activeOverlay === 'inspection') {
          handleAdvanceInspection();
          return;
        }

        if (activeOverlay !== 'none') {
          return;
        }

        if (currentScene.type === 'title') {
          jumpToScene('act1_room');
          return;
        }

        if (
          gameState.currentSceneId === 'act4_deduction' ||
          gameState.currentSceneId === 'casefile' ||
          currentScene.type === 'end'
        ) {
          return;
        }

        handleAdvance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeOverlay,
    currentScene,
    gameState.currentSceneId,
    handleAdvance,
    handleAdvanceInspection,
    jumpToScene,
    recordActivity,
    resetGame,
  ]);

  const currentLine = activeLines[gameState.currentLineIndex] || {
    speaker: '',
    text: '',
  };

  const toggleSteppedBackFlag = () => {
    setGameState((prev) => ({
      ...prev,
      flags: { ...prev.flags, steppedBack: !prev.flags.steppedBack },
    }));
  };

  const handleCustomImageLoad = (filename: string, url: string) => {
    setCustomImages((prev) => ({ ...prev, [filename]: url }));
  };

  // Active stage rendering parameters (supports Asset Inspector live testing overrides)
  const renderedBg = debugInspectorActive ? debugBg : currentScene.bg;
  const isMirrorScene = debugInspectorActive
    ? debugChar === 'jun' && debugBg === 'bg_hallway'
    : gameState.currentSceneId === 'act3_mirror';

  const renderedCharacters = debugInspectorActive
    ? [
        {
          id: debugChar,
          position: debugPosition,
          variant: debugVariant,
        },
      ]
    : currentScene.characters;

  const getCustomImageForCharacter = (
    id: 'mum' | 'ravi' | 'aisyah' | 'jun',
    variant: 'monster' | 'human',
    isMirror: boolean
  ): string | undefined => {
    if (id === 'jun') {
      return isMirror
        ? customImages['jun_mirror.png']
        : customImages['jun_silhouette.png'];
    }
    return customImages[`${id}_${variant}.png`];
  };

  // Restart modal accessibility ref
  const restartModalRef = useRef<HTMLDivElement>(null);
  useModalAccessibility({
    isOpen: activeOverlay === 'restart_confirm',
    onClose: () => setActiveOverlay('none'),
    modalRef: restartModalRef,
    closeOnEscape: true,
  });

  const showHeaderControls =
    currentScene.type !== 'title' &&
    currentScene.type !== 'end' &&
    gameState.currentSceneId !== 'act4_deduction' &&
    gameState.currentSceneId !== 'casefile';

  return (
    <main
      className={`w-screen min-h-screen min-h-[100dvh] bg-black text-slate-100 flex flex-col items-center justify-center cursor-default select-none ${
        reduceMotion ? 'reduce-motion' : ''
      }`}
      onClick={recordActivity}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Preloader */}
      {!isPreloaded && (
        <KioskPreloader onComplete={() => setIsPreloaded(true)} />
      )}

      {/* Main Responsive Stage */}
      <StageContainer
        mode={gameState.mode}
        shaking={isShaking}
        flashing={isFlashing}
        reduceMotion={reduceMotion}
        isPortrait={isPortrait}
      >
        {/* Visual Artwork Box: On Landscape it fills the 16:9 stage; on Portrait it forms the 16:9 top section */}
        <div
          id="illustration-stage-container"
          aria-hidden={activeOverlay !== 'none'}
          className={
            isPortrait
              ? 'w-full aspect-[16/9] relative overflow-hidden bg-[#070b09] shrink-0 border-b border-[#1b3427]'
              : 'absolute inset-0 overflow-hidden'
          }
        >
          {/* Layer 1: Background */}
          <BackgroundLayer
            sceneId={renderedBg}
            customImageSrc={customImages[`${renderedBg}.png`]}
            mode={gameState.mode}
            isDebugMode={isDebugMode}
            onAssetError={handleAssetError}
          />

          {/* Layer 2: Characters */}
          {renderedCharacters.map((char) => {
            const charVariant =
              char.variant || (gameState.mode === 'hallucination' ? 'monster' : 'human');
            return (
              <CharacterLayer
                key={`${char.id}-${char.position}-${charVariant}`}
                id={char.id}
                variant={charVariant}
                position={char.position}
                isMirrorScene={isMirrorScene}
                isLarge={renderedCharacters.length > 0 && !isMirrorScene}
                isPortrait={isPortrait}
                isDebugMode={isDebugMode}
                onAssetError={handleAssetError}
                customImageSrc={getCustomImageForCharacter(char.id, charVariant, isMirrorScene)}
              />
            );
          })}

          {/* Stage Search Hotspots (100% accurate coordinates matching 16:9 ratio) */}
          {isSearchScene && (
            <HotspotOverlay
              hotspots={currentHotspots}
              foundClueIds={gameState.clues}
              onSelectHotspot={handleSelectHotspot}
              disabled={activeOverlay !== 'none'}
            />
          )}
        </div>

        {/* Story, HUD, and Control Area */}
        <div
          id="story-interactive-area"
          aria-hidden={activeOverlay !== 'none'}
          className={
            isPortrait
              ? 'flex-1 w-full flex flex-col justify-between p-3 sm:p-4 relative bg-[#050a08] min-h-[300px]'
              : 'contents'
          }
        >
          {/* Header Controls Bar */}
          {showHeaderControls && (
            <div
              id="game-header-controls"
              className={
                isPortrait
                  ? 'w-full flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#15291e] z-30'
                  : 'absolute top-3 left-4 right-4 z-40 flex items-center justify-between pointer-events-none'
              }
            >
              {/* Left group: Restart Case */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  id="restart-run-btn"
                  type="button"
                  onClick={() => setActiveOverlay('restart_confirm')}
                  aria-label="Restart the case from beginning"
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0a1410]/95 hover:bg-[#152a1e] border border-[#203a2c] hover:border-emerald-500 text-xs font-mono text-slate-200 hover:text-white backdrop-blur-md shadow-lg transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Restart</span>
                </button>
              </div>

            </div>
          )}

          {/* Search HUD Bar */}
          {isSearchScene && (
            <SearchHUD
              canProceed={canProceedFromSearch}
              proceedLabel={
                gameState.currentSceneId === 'act1_room'
                  ? 'All Evidence Found (Open Door)'
                  : 'Observations Complete (Proceed)'
              }
              icon={gameState.currentSceneId === 'act1_room' ? 'door' : 'arrow'}
              reduceMotion={reduceMotion}
              isPortrait={isPortrait}
              onProceed={() => {
                if (activeOverlay !== 'none') return;
                if (gameState.currentSceneId === 'act1_room') {
                  jumpToScene('act2_suspects');
                } else if (gameState.currentSceneId === 'act3_mirror') {
                  jumpToScene('act4_deduction');
                }
              }}
            />
          )}

          {/* Dialogue Box */}
          {currentLine.text &&
            currentScene.type !== 'title' &&
            currentScene.type !== 'end' &&
            gameState.currentSceneId !== 'act4_deduction' &&
            gameState.currentSceneId !== 'casefile' && (
              <DialogueBox
                speaker={currentLine.speaker}
                text={currentLine.text}
                mode={gameState.mode}
                onAdvance={handleAdvance}
                canAdvance={choicesToDisplay === null && activeOverlay === 'none'}
                isPortrait={isPortrait}
                reduceMotion={reduceMotion}
              />
            )}

          {/* Choices / Question Menu Overlay */}
          {choicesToDisplay && activeOverlay === 'none' && (
            <ChoiceMenu
              prompt={currentScene.choicePrompt}
              choices={choicesToDisplay}
              onSelectChoice={handleSelectChoice}
              isPortrait={isPortrait}
            />
          )}
        </div>

        {/* Title Screen Overlay */}
        {currentScene.type === 'title' && (
          <TitleScreen
            onStart={() => jumpToScene('act1_room')}
            reduceMotion={reduceMotion}
          />
        )}

        {/* End Screen Overlay */}
        {currentScene.type === 'end' && (
          <EndScreen
            steppedBack={gameState.flags.steppedBack}
            onRestart={resetGame}
            reduceMotion={reduceMotion}
          />
        )}

        {/* Deduction Board Engine (Act 4 Deduction) */}
        {gameState.currentSceneId === 'act4_deduction' && (
          <DeductionBoard
            collectedClueIds={gameState.clues}
            onComplete={() => {
              recordActivity();
              jumpToScene('reveal');
            }}
            reduceMotion={reduceMotion}
          />
        )}

        {/* Case File 3D Card Flips */}
        {gameState.currentSceneId === 'casefile' && (
          <CaseFileScreen
            onProceed={() => {
              recordActivity();
              jumpToScene('flashback');
            }}
            reduceMotion={reduceMotion}
          />
        )}

        {/* Hotspot Inspection Dialogue Modal */}
        {activeOverlay === 'inspection' && inspectionState && (
          <InspectionModal
            hotspot={inspectionState.hotspot}
            currentLineIndex={inspectionState.lineIndex}
            onAdvance={handleAdvanceInspection}
            onClose={handleCloseInspection}
          />
        )}

        {/* Dedicated Phone Screen Overlay */}
        {activeOverlay === 'phone' && (
          <PhoneInspectModal
            onClose={() => setActiveOverlay('none')}
            onAwardClue={handlePhoneCompleteClue}
            isClueCollected={gameState.clues.includes('c_phone')}
          />
        )}

        {/* Case Evidence Notebook Drawer */}
        {activeOverlay === 'case_notebook' && (
          <CaseNotebookDrawer
            collectedClueIds={gameState.clues}
            questionedCharacters={gameState.questioned}
            onClose={() => setActiveOverlay('none')}
          />
        )}

        {/* Witness & Suspect Board Modal */}
        {activeOverlay === 'suspect_board' && (
          <SuspectBoard
            questioned={gameState.questioned}
            mode={gameState.mode}
            onClose={() => setActiveOverlay('none')}
          />
        )}

        {/* Restart Confirmation Dialog */}
        {activeOverlay === 'restart_confirm' && (
          <div
            id="restart-confirm-overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="restart-dialog-title"
            aria-describedby="restart-dialog-desc"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
            onClick={() => setActiveOverlay('none')}
          >
            <div
              ref={restartModalRef}
              id="restart-confirm-container"
              tabIndex={-1}
              className="bg-[#0b1410] border-2 border-[#21372a] rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 id="restart-dialog-title" className="text-lg font-bold text-white tracking-wide font-mono">
                  Restart the Case?
                </h3>
                <p id="restart-dialog-desc" className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to restart from the beginning? Current case progress and collected evidence will be reset to Title.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  id="restart-cancel-btn"
                  type="button"
                  onClick={() => setActiveOverlay('none')}
                  aria-label="Cancel restart"
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#14231b] hover:bg-[#1d3527] border border-[#233a2d] text-xs font-semibold text-slate-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Cancel
                </button>
                <button
                  id="restart-confirm-btn"
                  type="button"
                  onClick={resetGame}
                  aria-label="Confirm restart and wipe case state"
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-xs font-bold text-white shadow-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  Confirm Restart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kiosk Mode 60s Idle Prompt Modal */}
        {activeOverlay === 'idle_prompt' && (
          <IdlePromptModal
            onContinue={() => {
              recordActivity();
              setActiveOverlay('none');
            }}
            onReset={resetGame}
          />
        )}

        {/* DEBUG-ONLY ELEMENTS (Rendered strictly behind explicit debug opt-in) */}
        {isDebugMode && (
          <>
            <AssetConfirmBar
              currentBg={debugInspectorActive ? debugBg : currentScene.bg}
              onChangeBg={(bg) => {
                setDebugInspectorActive(true);
                setDebugBg(bg);
              }}
              currentCharacter={debugInspectorActive ? debugChar : 'ravi'}
              onChangeCharacter={(char) => {
                setDebugInspectorActive(true);
                setDebugChar(char);
              }}
              currentVariant={
                debugInspectorActive
                  ? debugVariant
                  : gameState.mode === 'hallucination'
                    ? 'monster'
                    : 'human'
              }
              onChangeVariant={(variant) => {
                setDebugInspectorActive(true);
                setDebugVariant(variant);
              }}
              currentPosition={debugInspectorActive ? debugPosition : 'center'}
              onChangePosition={(pos) => {
                setDebugInspectorActive(true);
                setDebugPosition(pos);
              }}
              onCustomImageLoad={handleCustomImageLoad}
              customImages={customImages}
              failedAssets={failedAssets}
              onMarkAssetMissing={handleAssetError}
            />

            <SceneRibbon
              gameState={gameState}
              onJumpToScene={jumpToScene}
              onReset={resetGame}
              onToggleSteppedBackFlag={toggleSteppedBackFlag}
              onTriggerIdlePrompt={() => setActiveOverlay('idle_prompt')}
            />

            <div className="absolute top-16 right-4 z-30 pointer-events-none flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsKioskMode((prev) => !prev)}
                className="pointer-events-auto px-2.5 py-1 rounded-full bg-[#0a1410]/90 hover:bg-[#15281e] border border-[#203a2c] text-[10px] font-mono text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Monitor className="w-3 h-3 text-amber-400" />
                <span>KIOSK: {isKioskMode ? 'ON' : 'OFF'}</span>
              </button>
              <div className="px-2.5 py-1 rounded-full bg-[#0a1410]/90 border border-[#203a2c] text-[10px] font-mono text-emerald-400 tracking-wider">
                SCENE: {gameState.currentSceneId.toUpperCase()}
              </div>
              <div
                className={`px-2.5 py-1 rounded-full border text-[10px] font-mono tracking-wider ${
                  gameState.mode === 'hallucination'
                    ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                    : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                }`}
              >
                {gameState.mode.toUpperCase()}
              </div>
            </div>
          </>
        )}
      </StageContainer>
    </main>
  );
}
