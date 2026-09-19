import React, { useState, useRef, useEffect } from 'react';
import { CLUES_DATABASE } from '../data/clues';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, X } from 'lucide-react';

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
  requiredClueIds: string[];
}

export const DEDUCTION_QUESTIONS: DeductionQuestion[] = [
  {
    id: 'deduction_step_1',
    stepNumber: 1,
    question: 'THE INTRUDER HYPOTHESIS',
    prompt: 'Who or what has breached the perimeter of the apartment?',
    options: [
      {
        id: 'opt_supernatural',
        text: 'A malevolent shadow entity mimicking loved ones to force entry.',
        isCorrect: false,
      },
      {
        id: 'opt_physical_breakin',
        text: 'An armed intruder breaking through the bedroom windows.',
        isCorrect: false,
      },
      {
        id: 'opt_internal_projection',
        text: 'No entity has breached the room. The distortions are acute psychological projections of severe sleep deprivation.',
        isCorrect: true,
      },
    ],
    requiredClueIds: ['c_phone', 'c_paranoia'],
  },
  {
    id: 'deduction_step_2',
    stepNumber: 2,
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
    requiredClueIds: ['m_eyes', 'm_hands'],
  },
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [attachedClueIds, setAttachedClueIds] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending transition timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, []);

  const stepData = DEDUCTION_QUESTIONS[currentStep];

  const handleToggleClue = (clueId: string) => {
    setErrorMessage(null);
    setAttachedClueIds((prev) =>
      prev.includes(clueId) ? prev.filter((id) => id !== clueId) : [...prev, clueId]
    );
  };

  const handleSelectOption = (optionId: string) => {
    setErrorMessage(null);
    setSelectedOptionId(optionId);
  };

  const handleSubmitStep = () => {
    // Synchronous double-click guard
    if (isSubmittingRef.current || isSubmitting) return;

    if (!selectedOptionId) {
      setErrorMessage('Please select a hypothesis before validating deduction.');
      return;
    }

    const selectedOption = stepData.options.find((o) => o.id === selectedOptionId);
    if (!selectedOption) return;

    // Validate hypothesis correctness
    if (!selectedOption.isCorrect) {
      setErrorMessage(
        'Hypothesis does not correlate with physical evidence. Re-examine witness testimony and records.'
      );
      return;
    }

    // Validate supporting clues
    const hasRequiredClues = stepData.requiredClueIds.every((req) =>
      attachedClueIds.includes(req)
    );

    if (!hasRequiredClues) {
      const missingCount = stepData.requiredClueIds.filter(
        (req) => !attachedClueIds.includes(req)
      ).length;
      setErrorMessage(
        `Insufficient evidence attached. You need ${missingCount} more key piece of evidence to substantiate this conclusion.`
      );
      return;
    }

    // Mark submitting synchronously
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);

    // Cancel any existing timeout before setting a new one
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // If more steps remain, advance; otherwise complete deduction
    if (currentStep < DEDUCTION_QUESTIONS.length - 1) {
      transitionTimeoutRef.current = setTimeout(() => {
        transitionTimeoutRef.current = null;
        setCurrentStep((prev) => prev + 1);
        setSelectedOptionId(null);
        setAttachedClueIds([]);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }, 400);
    } else {
      transitionTimeoutRef.current = setTimeout(() => {
        transitionTimeoutRef.current = null;
        onComplete();
      }, 400);
    }
  };

  return (
    <div
      id="deduction-board-screen"
      role="region"
      aria-label="Deduction and Case Synthesis Board"
      className="fixed inset-0 z-50 bg-[#050a07] flex flex-col justify-between p-3 sm:p-6 select-none overflow-y-auto min-h-[100dvh]"
    >
      {/* Top Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-[#1b3425] pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-wider">
              MIND PALACE: DEDUCTION SYNTHESIS
            </h2>
            <div className="text-xs text-emerald-400/80 font-mono">
              Stage {stepData.stepNumber} of {DEDUCTION_QUESTIONS.length}: {stepData.question}
            </div>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2">
          {DEDUCTION_QUESTIONS.map((s, idx) => (
            <div
              key={s.id}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                idx === currentStep
                  ? 'bg-emerald-500 text-black border-emerald-300 ring-2 ring-emerald-400/40'
                  : idx < currentStep
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-black/50 text-slate-600 border-slate-800'
              }`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Deduction Content */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between space-y-4">
        {/* Question Prompt */}
        <div className="bg-[#0a1510] border border-[#203e2c] p-4 sm:p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-emerald-200 mb-1 font-mono">
            {stepData.prompt}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Select the valid hypothesis and attach corresponding physical evidence from your investigation to verify.
          </p>
        </div>

        {/* Hypothesis Options */}
        <div className="space-y-2.5" role="radiogroup" aria-label="Hypothesis options">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            1. Formulate Hypothesis
          </div>
          {stepData.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                id={`deduction-opt-${opt.id}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isSubmitting}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full min-h-[52px] p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isSelected
                    ? 'bg-emerald-950/80 border-2 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                    : 'bg-[#08120d] border-[#1c3527] text-slate-300 hover:border-emerald-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-emerald-300 bg-emerald-500 text-black'
                        : 'border-slate-600 bg-black/40'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span className="text-sm sm:text-base font-medium break-words leading-snug">
                    {opt.text}
                  </span>
                </div>

                {isSelected && (
                  <span className="px-2 py-0.5 rounded bg-emerald-900 border border-emerald-400 text-[10px] font-mono text-emerald-200 font-bold uppercase shrink-0">
                    SELECTED
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Evidence Attachment Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              2. Attach Corroborating Evidence ({attachedClueIds.length} attached)
            </div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              aria-expanded={showHint}
              aria-label="Toggle forensic deduction hint"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Investigator Hint'}</span>
            </button>
          </div>

          {showHint && (
            <div className="bg-amber-950/40 border border-amber-600/60 p-3 rounded-xl text-xs font-mono text-amber-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                Hint: Look for evidence cards containing{' '}
                <strong className="text-amber-100">
                  {stepData.requiredClueIds
                    .map((id) => CLUES_DATABASE[id]?.name || id)
                    .join(' and ')}
                </strong>
                .
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {collectedClueIds.map((cId) => {
              const clue = CLUES_DATABASE[cId];
              if (!clue) return null;
              const isAttached = attachedClueIds.includes(cId);

              return (
                <button
                  key={cId}
                  id={`clue-attach-${cId}`}
                  type="button"
                  aria-pressed={isAttached}
                  disabled={isSubmitting}
                  onClick={() => handleToggleClue(cId)}
                  className={`min-h-[46px] p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isAttached
                      ? 'bg-emerald-900/60 border-2 border-emerald-400 text-white shadow-md'
                      : 'bg-[#08120d] border-[#1c3527] text-slate-400 hover:border-emerald-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isAttached
                          ? 'border-emerald-400 bg-emerald-500 text-black'
                          : 'border-slate-600'
                      }`}
                    >
                      {isAttached && '✓'}
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-bold truncate">
                      {clue.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-[#1d3527] shrink-0 text-slate-300">
                    {isAttached ? 'ATTACHED' : 'ATTACH'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div
            id="deduction-error-banner"
            role="alert"
            className="bg-red-950/80 border-2 border-red-500/80 p-3.5 rounded-xl text-red-200 text-xs sm:text-sm font-mono flex items-start gap-2.5 shadow-lg"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
              className="text-red-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Submit Bar */}
        <div className="pt-3 border-t border-[#1b3425] flex justify-end">
          <button
            id="deduction-submit-btn"
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitStep}
            aria-label="Validate and synthesize deduction step"
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-300 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            {isSubmitting ? (
              <span>VERIFYING SYNTHESIS...</span>
            ) : (
              <>
                <span>CONFIRM DEDUCTION STEP</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
