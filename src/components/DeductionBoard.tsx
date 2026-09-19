import React, { useState, useRef, useEffect } from 'react';
import { CLUES_DATABASE } from '../data/clues';
import { ArrowRight, EyeOff } from 'lucide-react';

export interface DeductionQuestion {
  id: string;
  stepNumber: number;
  question: string;
  prompt: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export const DEDUCTION_QUESTIONS: DeductionQuestion[] = [
  {
    id: 'deduction_step_2',
    stepNumber: 1,
    question: 'WHAT SHOULD HAPPEN NEXT?',
    prompt: 'Given the acute distress and physical observations, what should happen next?',
    options: [
      {
        id: 'opt_handle_alone',
        text: 'Try to manage the distress alone and wait for symptoms to resolve without outside help.',
        isCorrect: false,
      },
      {
        id: 'opt_professional_help',
        text: 'Jun is in severe physical and psychological distress and needs connection to professional medical care and support.',
        isCorrect: true,
      },
      {
        id: 'opt_further_investigation',
        text: 'Keep the room barricaded and continue investigating the apartment alone.',
        isCorrect: false,
      },
    ],
  },
];

const GLITCH_CHARS = ['#', '%', '&', '§', '▓', '▒', '░', '?', '!', '0', '1', 'ø', '¥', 'Δ', '§', 'Ø'];

interface DeductionBoardProps {
  collectedClueIds: string[];
  onComplete: () => void;
  reduceMotion?: boolean;
}

export const DeductionBoard: React.FC<DeductionBoardProps> = ({
  collectedClueIds,
  onComplete,
  reduceMotion = false,
}) => {
  const [currentStep] = useState(0);
  const [revealedOptionId, setRevealedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [glitchSeed, setGlitchSeed] = useState(0);
  const isSubmittingRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stepData = DEDUCTION_QUESTIONS[currentStep];

  // Cycle the glitch glyphs over the hidden truth until it's revealed
  useEffect(() => {
    if (revealedOptionId || reduceMotion) return;
    const glitchInterval = setInterval(() => {
      setGlitchSeed((prev) => (prev + 1) % 100);
    }, 90);
    return () => clearInterval(glitchInterval);
  }, [revealedOptionId, reduceMotion]);

  // Clean up any pending transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, []);

  const handleOptionClick = (optionId: string) => {
    if (isSubmitting || revealedOptionId) return;

    const option = stepData.options.find((o) => o.id === optionId);
    if (!option || !option.isCorrect) return;

    setRevealedOptionId(optionId);
  };

  const handleAcceptTruth = () => {
    if (isSubmittingRef.current || isSubmitting) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      transitionTimeoutRef.current = null;
      onComplete();
    }, 400);
  };

  return (
    <div
      id="deduction-board-screen"
      role="region"
      aria-label="Deduction and Case Synthesis Board"
      className="fixed inset-0 z-50 bg-[#050a07] flex flex-col justify-between p-3 sm:p-6 select-none overflow-y-auto min-h-[100dvh]"
    >
      {/* Main Deduction Content */}
      <div className="w-full max-w-4xl mx-auto flex-1 min-h-0 flex flex-col space-y-4">
        {/* Evidence Summary */}
        <div className="flex-1 min-h-0 flex flex-col space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Evidence Gathered ({collectedClueIds.length})
          </div>
          {collectedClueIds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-0 overflow-y-auto pr-1">
              {collectedClueIds.map((cId) => {
                const clue = CLUES_DATABASE[cId];
                if (!clue) return null;
                return (
                  <div
                    key={cId}
                    className="p-2.5 rounded-lg border border-[#1c3527] bg-[#08120d] text-slate-300"
                  >
                    <div className="text-xs font-mono font-bold text-emerald-200 truncate">
                      {clue.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{clue.shortDesc}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-slate-600 italic">No evidence gathered yet.</div>
          )}
        </div>

        {/* Question Prompt */}
        <div className="bg-[#0a1510] border border-[#203e2c] p-4 sm:p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-emerald-200 mb-1 font-mono">
            {stepData.prompt}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Two of these are wrong. The truth is here too — you already sense which one. Choose.
          </p>
        </div>

        {/* Corrupted Synthesis: the correct option stays garbled until chosen */}
        <div className="space-y-2.5" role="radiogroup" aria-label="Final synthesis options">
          {stepData.options.map((opt) => {
            const isRevealed = revealedOptionId === opt.id;
            const isHazed = opt.isCorrect && !revealedOptionId;
            const isDimmed = revealedOptionId !== null && !isRevealed;

            const glitchedText = Array.from(opt.text)
              .map((ch, i) => (ch === ' ' ? ' ' : GLITCH_CHARS[(glitchSeed + i * 3) % GLITCH_CHARS.length]))
              .join('');

            return (
              <button
                key={opt.id}
                id={`deduction-final-opt-${opt.id}`}
                type="button"
                role="radio"
                aria-checked={isRevealed}
                aria-label={isHazed ? 'Obscured hypothesis' : opt.text}
                disabled={isSubmitting || revealedOptionId !== null}
                onClick={() => handleOptionClick(opt.id)}
                className={`relative w-full min-h-[64px] p-4 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isRevealed
                    ? 'bg-emerald-950/80 border-2 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                    : isDimmed
                    ? 'bg-[#08120d] border-[#1c3527] text-slate-600 opacity-40 cursor-default'
                    : 'bg-[#08120d] border-[#1c3527] text-slate-300 hover:border-emerald-700 hover:text-white'
                }`}
              >
                {isHazed ? (
                  <span className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                    <span
                      aria-hidden="true"
                      className="font-mono text-amber-300 font-bold tracking-widest break-words"
                    >
                      {glitchedText}
                    </span>
                  </span>
                ) : (
                  <span className="block text-sm sm:text-base font-medium leading-snug">
                    {opt.text}
                  </span>
                )}

                {isRevealed && (
                  <span className="absolute top-2 right-3 px-2 py-0.5 rounded bg-emerald-900 border border-emerald-400 text-[10px] font-mono text-emerald-200 font-bold uppercase">
                    TRUTH
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {revealedOptionId && (
          <div className="pt-3 border-t border-[#1b3425] flex justify-end">
            <button
              id="deduction-accept-truth-btn"
              type="button"
              disabled={isSubmitting}
              onClick={handleAcceptTruth}
              aria-label="Accept the revealed truth and proceed"
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-300 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              {isSubmitting ? (
                <span>ACCEPTING...</span>
              ) : (
                <>
                  <span>ACCEPT THE TRUTH</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
