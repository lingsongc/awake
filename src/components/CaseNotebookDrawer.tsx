import React, { useRef } from 'react';
import { CLUES_DATABASE } from '../data/clues';
import { BookOpen, CheckCircle2, X } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface CaseNotebookDrawerProps {
  collectedClueIds: string[];
  questionedCharacters: string[];
  onClose: () => void;
}

export const CaseNotebookDrawer: React.FC<CaseNotebookDrawerProps> = ({
  collectedClueIds,
  questionedCharacters,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalAccessibility({
    isOpen: true,
    onClose,
    modalRef,
    closeOnEscape: true,
  });

  return (
    <div
      id="case-notebook-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notebook-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        id="case-notebook-container"
        tabIndex={-1}
        className="w-full max-w-2xl bg-[#09120e] border-2 border-[#1c3928] rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between max-h-[92dvh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#182e21] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="notebook-title"
                className="text-base sm:text-lg font-bold text-white tracking-wide font-mono"
              >
                DETECTIVE CASE NOTEBOOK
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                {collectedClueIds.length} Evidence Records • {questionedCharacters.length} Witnesses Questioned
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Case Notebook"
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#12241a] hover:bg-[#1b3828] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collected Clues List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
          {collectedClueIds.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-sm">
              No evidence recorded yet. Explore scenes and examine glowing objects.
            </div>
          ) : (
            collectedClueIds.map((cId) => {
              const clue = CLUES_DATABASE[cId];
              if (!clue) return null;

              return (
                <div
                  key={clue.id}
                  id={`notebook-clue-${clue.id}`}
                  className="bg-[#0e1b15] border border-[#213f2e] rounded-2xl p-3 sm:p-4 hover:border-emerald-500/70 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/70 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                        {clue.badgeText}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white font-mono">
                        {clue.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">VERIFIED</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
                    {clue.fullEvidence || clue.shortDesc}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#182e21] flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Press ESC or click outside to return</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notebook and continue"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold font-mono text-xs cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            CLOSE NOTEBOOK [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
