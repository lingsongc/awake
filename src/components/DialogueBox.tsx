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
          : 'absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end p-3 sm:p-4 md:p-5 max-h-[20vh]'
      }
    >
      <div
        id="dialogue-panel"
        tabIndex={canAdvance ? 0 : -1}
        role="region"
        aria-label={isNarration ? 'Narration' : `Dialogue from ${speaker}`}
        onKeyDown={handleKeyDown}
        className="w-full max-h-[20vh] overflow-y-auto rounded-xl bg-[#08120d]/95 border border-[#1e3b2b]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col justify-between shadow-2xl relative transition-colors duration-150 hover:border-[#2f5540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        {/* Speaker Name Tag */}
        {!isNarration && (
          <div className="flex items-center gap-2 mb-1.5">
            <span
              id="speaker-label"
              className="text-[10px] sm:text-[11px] md:text-xs text-[#86efac] font-bold tracking-wider uppercase font-mono"
            >
              {speaker}
            </span>
          </div>
        )}

        {/* Dialogue Text (Readable, responsive, wrapped) */}
        <div className="flex-1 flex items-center my-1 pr-12 sm:pr-14">
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

        {/* Icon-only advance control; keyboard users can still use Space or Enter. */}
        {canAdvance && onAdvance && (
          <button
            id="dialogue-next-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdvance();
            }}
            aria-label="Advance story to next line"
            className="absolute bottom-3 right-3 min-h-[44px] min-w-[44px] p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 active:scale-95 border border-emerald-500/70 text-emerald-200 hover:text-white flex items-center justify-center cursor-pointer shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
