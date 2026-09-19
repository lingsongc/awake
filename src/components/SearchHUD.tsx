import React from 'react';
import { CLUES_DATABASE } from '../data/clues';
import { Sparkles, ArrowRight, DoorOpen } from 'lucide-react';

interface SearchHUDProps {
  sceneTitle: string;
  foundClues: string[];
  totalClues: number;
  onProceed?: () => void;
  canProceed: boolean;
  proceedLabel?: string;
  icon?: 'door' | 'arrow';
  reduceMotion?: boolean;
  isPortrait?: boolean;
}

export const SearchHUD: React.FC<SearchHUDProps> = ({
  sceneTitle,
  foundClues,
  totalClues,
  onProceed,
  canProceed,
  proceedLabel = 'Proceed to next scene',
  icon = 'arrow',
  reduceMotion = false,
  isPortrait = false,
}) => {
  return (
    <div
      id="search-hud"
      className={
        isPortrait
          ? 'w-full px-3 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 z-30'
          : 'absolute top-3 left-4 right-4 z-30 pointer-events-none flex items-center justify-between gap-3'
      }
    >
      {/* Left: Clues Discovered Counter */}
      <div className="pointer-events-auto flex items-center gap-2.5 bg-[#0a1410]/95 border border-[#203a2c] rounded-xl px-3.5 py-2 backdrop-blur-md shadow-xl max-w-full">
        <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold truncate">
            {sceneTitle}
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>Evidence:</span>
            <span className="font-mono text-emerald-400 text-xs sm:text-sm font-bold">
              {foundClues.length} / {totalClues}
            </span>
          </div>
        </div>

        {/* Indicators for each discovered item */}
        <div className="hidden md:flex items-center gap-1 pl-2 border-l border-[#192b21]">
          {foundClues.map((cId) => {
            const clue = CLUES_DATABASE[cId];
            return (
              <span
                key={cId}
                title={clue?.name || cId}
                className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-600/70 text-[10px] font-mono text-emerald-300 font-semibold"
              >
                {clue?.badgeText || 'EVIDENCE'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right: Proceed Button when all clues in this scene are discovered */}
      {canProceed && onProceed && (
        <div className={`pointer-events-auto shrink-0 ${reduceMotion ? '' : 'animate-bounce'}`}>
          <button
            id="search-proceed-btn"
            type="button"
            onClick={onProceed}
            aria-label={proceedLabel}
            className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-400 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            {icon === 'door' ? (
              <DoorOpen className="w-4 h-4 text-emerald-200 shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 text-emerald-200 shrink-0" />
            )}
            <span>{proceedLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
