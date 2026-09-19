import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  reduceMotion?: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  reduceMotion = false,
}) => {
  return (
    <div
      id="title-screen-overlay"
      role="region"
      aria-label="WIDE AWAKE Title Screen"
      className="absolute inset-0 z-40 bg-gradient-to-t from-black via-[#060e09]/95 to-black/80 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-y-auto"
    >
      <div className="w-full flex justify-between items-center">
        <div className="text-[11px] font-mono tracking-widest text-emerald-500/80 uppercase">
          FORENSIC PSYCHOLOGY MYSTERY
        </div>
        <div className="text-[11px] font-mono text-emerald-400/60">
          ACT I - ACT III
        </div>
      </div>

      <div className="flex flex-col items-center text-center max-w-xl my-auto py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-mono text-xs mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Detective Experience</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 font-mono">
          WIDE <span className="text-emerald-400">AWAKE</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium leading-relaxed mb-6">
          80 hours without sleep. Shadows whispering at the door. Search your locked room for physical evidence, cross-examine witnesses, and uncover what is real.
        </p>

        <button
          id="title-start-btn"
          type="button"
          onClick={onStart}
          aria-label="Begin Investigation"
          className="min-h-[52px] min-w-[220px] px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(16,185,129,0.5)] border-2 border-emerald-300 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>BEGIN CASE</span>
        </button>
      </div>

      <div className="text-[11px] font-mono text-slate-500 text-center">
        Use Touch, Mouse, or Keyboard (Tab/Space/Enter/ESC)
      </div>
    </div>
  );
};
