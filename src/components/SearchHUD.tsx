import React from 'react';
import { ArrowRight, DoorOpen } from 'lucide-react';

interface SearchHUDProps {
  onProceed?: () => void;
  canProceed: boolean;
  proceedLabel?: string;
  icon?: 'door' | 'arrow';
  reduceMotion?: boolean;
  isPortrait?: boolean;
}

export const SearchHUD: React.FC<SearchHUDProps> = ({
  onProceed,
  canProceed,
  proceedLabel = 'Proceed to next scene',
  icon = 'arrow',
  reduceMotion = false,
  isPortrait = false,
}) => {
  if (!canProceed || !onProceed) return null;

  return (
    <div
      id="search-hud"
      className={isPortrait ? 'w-full px-3 py-2 z-30' : 'absolute top-3 right-4 z-30'}
    >
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
    </div>
  );
};
