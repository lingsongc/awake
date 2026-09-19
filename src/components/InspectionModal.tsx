import React, { useRef } from 'react';
import { Hotspot } from '../data/clues';
import { ChevronRight } from 'lucide-react';
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
      aria-label="Evidence inspection"
      className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-end p-3 sm:p-6 select-none animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        id="inspection-dialogue-panel"
        tabIndex={-1}
        className="relative w-full max-h-[20vh] rounded-2xl bg-[#09120e]/95 border-2 border-emerald-500/70 shadow-[0_0_40px_rgba(16,185,129,0.2)] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto my-auto sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialogue and centered advance control */}
        <div className="min-h-0 py-3 px-2 sm:px-8 flex items-center justify-center gap-6">
          <p className="flex-1 text-base sm:text-lg md:text-xl text-emerald-100 font-medium leading-relaxed break-words text-center">
            {line.text}
          </p>
          <button
            type="button"
            onClick={isLastLine ? onClose : onAdvance}
            aria-label={isLastLine ? 'Finish inspection and close' : 'Next observation'}
            title={isLastLine ? 'Finish inspection' : 'Next observation'}
            className="shrink-0 min-w-[52px] min-h-[52px] w-13 h-13 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-lg border border-emerald-400 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
