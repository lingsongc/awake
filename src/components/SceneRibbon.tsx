import React, { useState } from 'react';
import { SCENES } from '../data/scenes';
import { GameState } from '../types';
import { FastForward, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface SceneRibbonProps {
  gameState: GameState;
  onJumpToScene: (sceneId: string) => void;
  onReset: () => void;
  onToggleSteppedBackFlag: () => void;
  onTriggerIdlePrompt: () => void;
}

export const SceneRibbon: React.FC<SceneRibbonProps> = ({
  gameState,
  onJumpToScene,
  onReset,
  onToggleSteppedBackFlag,
  onTriggerIdlePrompt,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sceneList = Object.keys(SCENES);

  return (
    <div className="absolute bottom-2 left-4 z-50 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a140f]/90 border border-[#203a2c] hover:border-emerald-500 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-lg transition-all"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Stage 2 Scene Engine</span>
          <span className="font-mono text-[10px] text-emerald-400 bg-[#16271e] px-1.5 py-0.5 rounded">
            {gameState.currentSceneId}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onReset}
          title="Reset State to Title"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0a140f]/90 border border-[#203a2c] hover:border-red-500/80 text-xs text-slate-300 hover:text-red-300 backdrop-blur-md transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 bg-[#09120e]/95 border border-[#1f3729] rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-md w-80 text-xs text-slate-300 space-y-3 animate-fadeIn">
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Jump to Scene:
            </span>
            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto pr-1">
              {sceneList.map((sId) => (
                <button
                  key={sId}
                  onClick={() => {
                    onJumpToScene(sId);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 rounded text-left font-mono truncate transition-colors ${
                    gameState.currentSceneId === sId
                      ? 'bg-emerald-800/80 text-white font-bold border border-emerald-500'
                      : 'bg-[#111e17] hover:bg-[#192c22] text-slate-300'
                  }`}
                >
                  {sId}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#18291f] pt-2 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Mode:</span>
              <span className="font-mono text-emerald-300 uppercase">{gameState.mode}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Questioned:</span>
              <span className="font-mono text-emerald-300">
                {gameState.questioned.length > 0 ? gameState.questioned.join(', ') : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Clues Found:</span>
              <span className="font-mono text-emerald-300 font-bold">
                {gameState.clues.length} items
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Flag (steppedBack):</span>
              <button
                onClick={onToggleSteppedBackFlag}
                className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border ${
                  gameState.flags.steppedBack
                    ? 'bg-amber-950 border-amber-600 text-amber-300'
                    : 'bg-[#101b15] border-[#22352a] text-slate-400'
                }`}
              >
                {gameState.flags.steppedBack ? 'TRUE (Stepped Back)' : 'FALSE (Stayed Still)'}
              </button>
            </div>
            <div className="pt-1">
              <button
                onClick={() => {
                  onTriggerIdlePrompt();
                  setIsOpen(false);
                }}
                className="w-full py-1 px-2 rounded bg-amber-950/70 hover:bg-amber-900 border border-amber-700/80 text-amber-200 text-[10px] font-semibold text-center transition-colors"
              >
                Simulate 60s Idle Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
