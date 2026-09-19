import React, { useState } from 'react';
import { ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { FallbackCardArt } from './FallbackArt';

interface CaseFileCard {
  id: string;
  frontTitle: string;
  frontSubtitle: string;
  frontDesc: string;
  cardId: 'mum' | 'ravi' | 'aisyah' | 'jun';
  backTitle: string;
  backSubtitle: string;
  backDesc: string;
}

const CASE_CARDS: CaseFileCard[] = [
  {
    id: 'card_mum',
    frontTitle: 'TALL SHADOW ENTITY',
    frontSubtitle: 'Apparition with elongated claws',
    frontDesc: 'Perceived as a malevolent entity scratching at the apartment door to break in.',
    cardId: 'mum',
    backTitle: 'MUM (MRS. TAN)',
    backSubtitle: 'Concerned Mother',
    backDesc: 'Stayed awake outside the room in tears, pleading through the door with Jun to open up.',
  },
  {
    id: 'card_ravi',
    frontTitle: 'FOUR-EYED PROJECTION',
    frontSubtitle: 'Flickering ocular entity',
    frontDesc: 'Appeared as a surveillance demon watching Jun through electronic screens.',
    cardId: 'ravi',
    backTitle: 'RAVI',
    backSubtitle: 'Close Friend & Roommate',
    backDesc: 'Stayed by the door to reassure Jun and contacted emergency medical services to ensure he received safe care.',
  },
  {
    id: 'card_aisyah',
    frontTitle: 'CLOAKED FIGURE',
    frontSubtitle: 'Figure with yellow hairclip',
    frontDesc: 'Interpreted as a hostile intruder attempting to break into the apartment.',
    cardId: 'aisyah',
    backTitle: 'AISYAH',
    backSubtitle: 'Concerned Colleague',
    backDesc: 'Checked on Jun after he missed work, brought food, and helped contact emergency medical support.',
  },
  {
    id: 'card_jun',
    frontTitle: 'CORRUPTED REFLECTION',
    frontSubtitle: 'The sleepless watcher in the glass',
    frontDesc: 'Perceived as a distorted entity trapped on the other side of the mirror.',
    cardId: 'jun',
    backTitle: 'JUN TAN',
    backSubtitle: 'Person in Acute Distress',
    backDesc: 'Experiencing severe substance-induced paranoia, anxiety, and sleeplessness after methamphetamine use.',
  },
];

interface CaseFileScreenProps {
  onProceed: () => void;
  reduceMotion?: boolean;
}

export const CaseFileScreen: React.FC<CaseFileScreenProps> = ({
  onProceed,
  reduceMotion = false,
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [viewedCards, setViewedCards] = useState<Record<string, boolean>>({});

  const handleToggleCard = (cardId: string) => {
    const nextFlipped = !flippedCards[cardId];
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: nextFlipped,
    }));
    if (nextFlipped) {
      setViewedCards((prev) => ({
        ...prev,
        [cardId]: true,
      }));
    }
  };

  const allViewed = CASE_CARDS.every((c) => viewedCards[c.id]);
  return (
    <div
      id="case-file-screen"
      role="region"
      aria-label="Case File Revelations: Compare Hallucinations to Reality"
      className="fixed inset-0 z-50 bg-[#040806] flex flex-col justify-between p-3 sm:p-6 select-none overflow-y-auto min-h-[100dvh]"
    >
      {/* Cards Grid */}
      <div className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {CASE_CARDS.map((card) => {
          const isFlipped = !!flippedCards[card.id];
          const hasBeenViewed = !!viewedCards[card.id];

          return (
            <button
              key={card.id}
              id={`case-card-${card.id}`}
              type="button"
              onClick={() => handleToggleCard(card.id)}
              aria-pressed={isFlipped}
              aria-label={`Case file: ${isFlipped ? card.backTitle : card.frontTitle}. Tap to flip.`}
              className={`w-full min-h-[320px] rounded-2xl p-4 flex flex-col justify-between text-left transition-all border-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                isFlipped
                  ? 'bg-[#0d1c15] border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                  : hasBeenViewed
                  ? 'bg-[#09110d] border-emerald-700/60 hover:border-emerald-500'
                  : 'bg-[#09110d] border-[#1d3829] hover:border-amber-500/60'
              }`}
            >
              {/* Card Art */}
              <div>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-[#1b3425] mb-3 relative flex items-center justify-center">
                  <FallbackCardArt
                    cardId={card.cardId}
                    variant={isFlipped ? 'human' : 'monster'}
                    useMirrorForJun={card.cardId === 'jun'}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-[#213f2e] text-[10px] font-mono font-bold text-white flex items-center gap-1">
                    <RotateCw className="w-3 h-3 text-emerald-400" />
                    <span>{isFlipped ? 'REALITY' : 'PERCEPTION'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm sm:text-base font-bold text-white font-mono truncate">
                    {isFlipped ? card.backTitle : card.frontTitle}
                  </h4>
                  {hasBeenViewed && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>

                <div className="text-xs font-mono mb-2 text-emerald-400">
                  {isFlipped ? card.backSubtitle : card.frontSubtitle}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed break-words">
                  {isFlipped ? card.backDesc : card.frontDesc}
                </p>
              </div>

              {/* Flip Action prompt */}
              <div className="pt-3 border-t border-[#182d21] flex items-center justify-between text-[11px] font-mono text-emerald-400 font-semibold mt-2">
                <span>{isFlipped ? 'SHOW PERCEPTION' : 'REVEAL REALITY'}</span>
                <RotateCw className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Proceed Action */}
      <div className="w-full max-w-6xl mx-auto pt-3 border-t border-[#1b3425] flex justify-end">
        <button
          id="case-file-proceed-btn"
          type="button"
          disabled={!allViewed}
          onClick={onProceed}
          aria-label="Proceed to the final conclusion"
          className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-300 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <span>PROCEED TO CONCLUSION</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
