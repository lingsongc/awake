import React, { useRef } from 'react';
import { Clock, Play, RotateCcw } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface IdlePromptModalProps {
  onContinue: () => void;
  onReset: () => void;
}

export const IdlePromptModal: React.FC<IdlePromptModalProps> = ({
  onContinue,
  onReset,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalAccessibility({
    isOpen: true,
    onClose: onContinue,
    modalRef,
    closeOnEscape: true,
  });

  return (
    <div
      id="idle-prompt-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="idle-title"
      aria-describedby="idle-desc"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
    >
      <div
        ref={modalRef}
        id="idle-prompt-container"
        tabIndex={-1}
        className="w-full max-w-md bg-[#0a1610] border-2 border-amber-500/70 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col items-center text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/80 flex items-center justify-center text-amber-300">
          <Clock className="w-6 h-6" />
        </div>

        <div>
          <h3 id="idle-title" className="text-lg font-bold text-white font-mono mb-1">
            STILL INVESTIGATING?
          </h3>
          <p id="idle-desc" className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The case has been paused due to inactivity. Would you like to continue from your current progress or reset to the title screen?
          </p>
        </div>

        <div className="w-full space-y-2.5 pt-2">
          <button
            id="idle-continue-btn"
            type="button"
            onClick={onContinue}
            aria-label="Continue current investigation"
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-md border border-emerald-300 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>CONTINUE INVESTIGATION</span>
          </button>

          <button
            id="idle-reset-btn"
            type="button"
            onClick={onReset}
            aria-label="Reset case and return to title screen"
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#14261c] hover:bg-[#203c2d] active:scale-95 text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 border border-[#234230] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO TITLE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
