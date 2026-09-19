import React from 'react';
import { SceneChoice } from '../types';

interface ChoiceMenuProps {
  prompt?: string;
  choices: SceneChoice[];
  onSelectChoice: (choice: SceneChoice) => void;
  isPortrait?: boolean;
}

export const ChoiceMenu: React.FC<ChoiceMenuProps> = ({
  prompt,
  choices,
  onSelectChoice,
  isPortrait = false,
}) => {
  return (
    <div
      id="choice-menu-overlay"
      className={
        isPortrait
          ? 'w-full flex flex-col items-center justify-center p-3 sm:p-4 z-40'
          : 'absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 select-none animate-fadeIn overflow-y-auto'
      }
    >
      <div className="w-full max-w-xl flex flex-col items-center space-y-3">
        {prompt && (
          <div className="w-full bg-[#0b1410]/95 border border-[#213b2c] px-4 sm:px-6 py-3 rounded-xl text-center shadow-lg">
            <h3 className="text-emerald-300 font-semibold text-sm sm:text-base md:text-lg tracking-wide font-mono">
              {prompt}
            </h3>
          </div>
        )}

        <div
          role="group"
          aria-label={prompt || 'Select an action'}
          className="w-full space-y-2.5"
        >
          {choices.map((choice) => (
            <button
              key={choice.id}
              id={`choice-${choice.id}`}
              type="button"
              onClick={() => onSelectChoice(choice)}
              aria-label={choice.text}
              className="w-full min-h-[52px] sm:min-h-[60px] py-3.5 px-5 rounded-xl bg-[#0e1a14]/95 hover:bg-[#162920] active:scale-[0.98] border border-[#2c4e3b] hover:border-emerald-400 text-left transition-all duration-150 shadow-xl group flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span className="text-base sm:text-lg md:text-xl font-bold text-slate-100 group-hover:text-emerald-200">
                {choice.text}
              </span>
              <span
                aria-hidden="true"
                className="text-emerald-400 font-mono text-xs sm:text-sm opacity-80 group-hover:opacity-100 transition-opacity ml-3 shrink-0 font-bold"
              >
                SELECT →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
