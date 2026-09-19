import React, { useRef } from 'react';
import { Users, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { FallbackCardArt } from './FallbackArt';

interface SuspectBoardProps {
  questioned: string[];
  mode: 'hallucination' | 'clean';
  onClose: () => void;
}

export const SuspectBoard: React.FC<SuspectBoardProps> = ({
  questioned,
  mode,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalAccessibility({
    isOpen: true,
    onClose,
    modalRef,
    closeOnEscape: true,
  });

  const suspects: {
    id: 'mum' | 'ravi' | 'aisyah';
    name: string;
    role: string;
    encountered: boolean;
    notes: string;
  }[] = [
    {
      id: 'mum',
      name: mode === 'hallucination' ? 'TALL SHADOW ENTITY' : 'MUM (MRS. TAN)',
      role: mode === 'hallucination' ? 'Apparition with elongated claws' : 'Concerned Mother',
      encountered: questioned.includes('mum'),
      notes:
        mode === 'hallucination'
          ? 'Hovered outside the bedroom door at 02:00 AM, crying and begging for the door to open.'
          : 'Pounding on bedroom door, terrified for Jun after he barricaded himself inside for days.',
    },
    {
      id: 'ravi',
      name: mode === 'hallucination' ? 'FOUR-EYED PROJECTION' : 'RAVI (BEST FRIEND)',
      role: mode === 'hallucination' ? 'Distorted figure with flickering eyes' : 'Close Friend / Roommate',
      encountered: questioned.includes('ravi'),
      notes:
        mode === 'hallucination'
          ? 'Spoke through the door with fragmented audio, asking Jun to step away from the window.'
          : 'Stayed outside the door to reassure Jun and contacted emergency medical services when Jun showed severe distress.',
    },
    {
      id: 'aisyah',
      name: mode === 'hallucination' ? 'CLOAKED FIGURE' : 'AISYAH (COLLEAGUE)',
      role: mode === 'hallucination' ? 'Figure with yellow hairclip' : 'Concerned Colleague',
      encountered: questioned.includes('aisyah'),
      notes:
        mode === 'hallucination'
          ? 'Appeared outside the bedroom door speaking in distorted fragments about Jun missing from work.'
          : 'Came over after Jun missed work, brought food, and helped contact his family and emergency medical support.',
    },
  ];

  return (
    <div
      id="suspect-board-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suspect-board-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        id="suspect-board-container"
        tabIndex={-1}
        className="w-full max-w-4xl bg-[#09120e] border-2 border-[#1c3928] rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between max-h-[92dvh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#182e21] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="suspect-board-title"
                className="text-base sm:text-lg font-bold text-white tracking-wide font-mono"
              >
                WITNESS & SUBJECT PROFILES
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                {questioned.length} of 3 people encountered
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Suspect Board"
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#12241a] hover:bg-[#1b3828] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suspect Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {suspects.map((s) => {
            return (
              <div
                key={s.id}
                id={`suspect-card-${s.id}`}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                  s.encountered
                    ? 'bg-[#0e1b15] border-[#254633] shadow-lg'
                    : 'bg-[#070e0a] border-[#16271c] opacity-60'
                }`}
              >
                <div>
                  {/* Portrait or silhouette */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-[#1b3425] mb-3 relative flex items-center justify-center">
                    {s.encountered ? (
                      <FallbackCardArt
                        cardId={s.id}
                        variant={mode === 'hallucination' ? 'monster' : 'human'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-600 font-mono text-xs gap-1.5 p-4 text-center">
                        <ShieldAlert className="w-6 h-6 stroke-[1.5]" />
                        <span>UNENCOUNTERED</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-sm sm:text-base font-bold text-white font-mono truncate">
                      {s.encountered ? s.name : 'UNKNOWN WITNESS'}
                    </h4>
                    {s.encountered && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <div className="text-xs text-emerald-400/80 font-mono mb-2">
                    {s.encountered ? s.role : 'Awaiting contact'}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed break-words">
                    {s.encountered ? s.notes : 'No testimony recorded yet.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#182e21] flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Press ESC to return to case</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close board and continue"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold font-mono text-xs cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            CLOSE BOARD [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};

