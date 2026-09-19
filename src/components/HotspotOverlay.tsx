import React from 'react';
import { Hotspot } from '../data/clues';
import { Search, CheckCircle2 } from 'lucide-react';

interface HotspotOverlayProps {
  hotspots: Hotspot[];
  foundClueIds: string[];
  onSelectHotspot: (hotspot: Hotspot) => void;
  disabled?: boolean;
}

export const HotspotOverlay: React.FC<HotspotOverlayProps> = ({
  hotspots,
  foundClueIds,
  onSelectHotspot,
  disabled = false,
}) => {
  return (
    <div
      id="hotspot-layer"
      className="absolute inset-0 z-30 pointer-events-none"
    >
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
            {/* Subtle interactive target; the scene stays clear until hovered. */}
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onSelectHotspot(hs);
              }}
              aria-label={ariaLabel}
              title={hs.name}
              className={`relative z-10 flex items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-200 transform active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                isDiscovered
                  ? 'bg-emerald-950/25 border border-emerald-300/45 text-emerald-200/80 hover:bg-emerald-900/40'
                  : 'bg-amber-950/25 border border-amber-200/45 text-amber-200/80 hover:bg-amber-900/40 hover:border-amber-200/70'
              }`}
            >
              {isDiscovered ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Search className="w-6 h-6 text-amber-200/80" />
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
