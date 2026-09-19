import React, { useEffect, useState } from 'react';
import { Hotspot } from '../data/clues';
import { Search, CheckCircle2, HelpCircle } from 'lucide-react';

interface HotspotOverlayProps {
  hotspots: Hotspot[];
  foundClueIds: string[];
  onSelectHotspot: (hotspot: Hotspot) => void;
  disabled?: boolean;
  lastActivityTime?: number;
  reduceMotion?: boolean;
}

export const HotspotOverlay: React.FC<HotspotOverlayProps> = ({
  hotspots,
  foundClueIds,
  onSelectHotspot,
  disabled = false,
  lastActivityTime = Date.now(),
  reduceMotion = false,
}) => {
  const [isIdleHintActive, setIsIdleHintActive] = useState(false);

  // 10-second idle hint
  useEffect(() => {
    const checkHint = setInterval(() => {
      if (Date.now() - lastActivityTime > 10000) {
        setIsIdleHintActive(true);
      } else {
        setIsIdleHintActive(false);
      }
    }, 1000);

    return () => clearInterval(checkHint);
  }, [lastActivityTime]);

  return (
    <div
      id="hotspot-layer"
      className="absolute inset-0 z-30 pointer-events-none"
    >
      {/* 10s Idle helper banner if any undiscovered clues remain */}
      {isIdleHintActive && hotspots.some((h) => !foundClueIds.includes(h.clueId)) && (
        <div
          className={`absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#08120c]/95 border border-amber-500/80 px-4 py-2 rounded-full text-xs font-mono text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-2 pointer-events-auto ${
            reduceMotion ? '' : 'animate-bounce'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Look for the glowing investigation reticles to examine evidence</span>
        </div>
      )}

      {hotspots.map((hs) => {
        const isDiscovered = foundClueIds.includes(hs.clueId);
        const ariaLabel = isDiscovered
          ? `${hs.name}: Evidence already examined and recorded.`
          : `Investigate ${hs.name}: ${hs.hint}`;

        return (
          <div
            key={hs.id}
            id={`hotspot-${hs.id}`}
            style={{
              left: `${hs.x}%`,
              top: `${hs.y}%`,
              width: `${hs.width}%`,
              height: `${hs.height}%`,
            }}
            className="absolute pointer-events-auto flex items-center justify-center group"
          >
            {/* Outline box */}
            <div
              className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 ${
                isDiscovered
                  ? 'border-2 border-dashed border-emerald-500/40 bg-emerald-950/10'
                  : isIdleHintActive
                  ? `border-2 border-amber-400 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.25)] ${
                      reduceMotion ? '' : 'animate-pulse'
                    }`
                  : 'border border-dashed border-amber-400/50 group-hover:border-amber-300 group-hover:bg-amber-400/10'
              }`}
            />

            {/* Interactive Target Reticle (Minimum 48px touch target) */}
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onSelectHotspot(hs);
              }}
              aria-label={ariaLabel}
              title={hs.name}
              className={`relative z-10 flex items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-200 transform active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 ${
                isDiscovered
                  ? 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 shadow-md ring-2 ring-emerald-500/30'
                  : isIdleHintActive
                  ? `bg-amber-500 border-2 border-amber-200 text-black scale-110 shadow-lg ring-4 ring-amber-400/40 ${
                      reduceMotion ? '' : 'animate-pulse'
                    }`
                  : `bg-amber-950/95 border-2 border-amber-400 text-amber-300 hover:scale-105 shadow-md ring-2 ring-amber-500/30 ${
                      reduceMotion ? '' : 'animate-pulse'
                    }`
              }`}
            >
              {/* Outer pulsing ring for undiscovered items (disabled in reduce-motion) */}
              {!isDiscovered && !reduceMotion && (
                <span
                  aria-hidden="true"
                  className={`absolute -inset-2 rounded-full border pointer-events-none animate-ping ${
                    isIdleHintActive ? 'border-amber-300 border-2' : 'border-amber-400/60'
                  }`}
                />
              )}

              {isDiscovered ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Search
                  className={`w-6 h-6 ${
                    isIdleHintActive ? 'text-black stroke-[2.5]' : 'text-amber-300'
                  }`}
                />
              )}
            </button>

            {/* Visual Tag / Tooltip */}
            <div
              aria-hidden="true"
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#0a1410]/95 border border-[#203a2c] text-[11px] font-mono text-emerald-300 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none shadow-lg z-40"
            >
              {isDiscovered ? `✓ ${hs.name}` : `[EXAMINE] ${hs.name}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};
