import React, { useRef } from 'react';
import { Hotspot, CLUES_DATABASE } from '../data/clues';
import { CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface InspectionModalProps {
  hotspot: Hotspot;
  currentLineIndex: number;
  onAdvance: () => void;
  onClose: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  hotspot,
  currentLineIndex,
  onAdvance,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const line = hotspot.examineLines[currentLineIndex] || hotspot.examineLines[0];
  const isLastLine = currentLineIndex >= hotspot.examineLines.length - 1;
  const clue = CLUES_DATABASE[hotspot.clueId];

  useModalAccessibility({
    isOpen: true,
    onClose,
    modalRef,
    closeOnEscape: true,
  });

  return (
    <div
      id="inspection-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end p-3 sm:p-6 select-none animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        id="inspection-dialogue-panel"
        tabIndex={-1}
        className="w-full max-h-[85%] rounded-2xl bg-[#09120e]/95 border-2 border-emerald-500/70 shadow-[0_0_40px_rgba(16,185,129,0.2)] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto my-auto sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between border-b border-[#182d22] pb-3 mb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/80 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider shrink-0">
              INSPECTING OBJECT
            </span>
            <h3
              id="inspection-title"
              className="text-sm sm:text-base font-bold text-white tracking-wide truncate font-mono"
            >
              {hotspot.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {clue && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>RECORDED</span>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close evidence inspection"
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#122219] hover:bg-[#1c3829] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="py-3 flex-1 flex items-center">
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 font-medium leading-relaxed break-words">
            {line.text}
          </p>
        </div>

        {/* Footer controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 border-t border-[#182d22] gap-2 text-xs font-mono text-slate-400">
          <span className="truncate">{hotspot.hint}</span>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={isLastLine ? onClose : onAdvance}
              aria-label={isLastLine ? 'Finish inspection and close' : 'Next observation'}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg border border-emerald-400 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <span>{isLastLine ? 'FINISH EXAMINATION [CLOSE]' : 'NEXT OBSERVATION'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
