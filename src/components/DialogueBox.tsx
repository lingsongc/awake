import React from 'react';
import { ChevronRight } from 'lucide-react';
import { GlitchText } from './GlitchText';

interface DialogueBoxProps {
  speaker: string;
  text: string;
  mode?: 'hallucination' | 'clean';
  onAdvance?: () => void;
  canAdvance?: boolean;
  isPortrait?: boolean;
  reduceMotion?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  mode = 'hallucination',
  onAdvance,
  canAdvance = true,
  isPortrait = false,
  reduceMotion = false,
}) => {
  const isNarration = speaker === '(N)' || speaker === '' || speaker === 'Narration';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && canAdvance && onAdvance) {
      e.preventDefault();
      onAdvance();
    }
  };

  return (
    <div
      id="dialogue-box-container"
      className={
        isPortrait
          ? 'w-full z-30 flex flex-col justify-end p-2 sm:p-3'
          : 'absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end p-3 sm:p-4 md:p-5 max-h-[48%]'
      }
    >
      <div
        id="dialogue-panel"
        tabIndex={canAdvance ? 0 : -1}
        role="region"
        aria-label={isNarration ? 'Narration' : `Dialogue from ${speaker}`}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl bg-[#08120d]/95 border border-[#1e3b2b]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col justify-between shadow-2xl relative transition-colors duration-150 hover:border-[#2f5540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        {/* Speaker Name Tag */}
        {!isNarration && (
          <div className="flex items-center gap-2 mb-1.5">
            <span
              id="speaker-label"
              className="inline-block px-3 py-1 bg-[#12241b] text-[#86efac] border border-[#274937] rounded-md text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase font-mono"
            >
              {speaker}
            </span>
          </div>
        )}

        {/* Dialogue Text (Readable, responsive, wrapped) */}
        <div className="flex-1 flex items-center my-1 pr-2 sm:pr-4">
          <p
            id="dialogue-text"
            className={`font-medium leading-relaxed tracking-wide break-words ${
              isNarration
                ? 'italic text-emerald-200/90 text-base sm:text-lg md:text-xl'
                : 'text-slate-100 text-base sm:text-lg md:text-xl'
            }`}
          >
            <GlitchText text={text} mode={mode} reduceMotion={reduceMotion} />
          </p>
        </div>

        {/* Advance Control Bar: Explicit >=44px button with accessible label */}
        {canAdvance && onAdvance && (
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#172c21]/70">
            <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400/60">
              [SPACE or ENTER to advance]
            </span>

            <button
              id="dialogue-next-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAdvance();
              }}
              aria-label="Advance story to next line"
              className="ml-auto min-h-[44px] min-w-[120px] px-4 py-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 active:scale-95 border border-emerald-500/70 text-emerald-200 hover:text-white text-xs sm:text-sm font-bold tracking-wider font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
