import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Position } from '../types';
import { FallbackCharacter } from './FallbackArt';
import { resolveCharacterAsset } from '../data/assets';

export interface CharacterLayerProps {
  id: 'mum' | 'ravi' | 'aisyah' | 'jun';
  variant: 'monster' | 'human';
  position: Position;
  customImageSrc?: string;
  name?: string;
  identifyingItem?: string;
  isMirrorScene?: boolean;
  isLarge?: boolean;
  isPortrait?: boolean;
  isDebugMode?: boolean;
  onAssetError?: (filename: string) => void;
}

export const CharacterLayer: React.FC<CharacterLayerProps> = ({
  id,
  variant,
  position,
  customImageSrc,
  isMirrorScene = false,
  isLarge = false,
  isPortrait = false,
  isDebugMode = false,
  onAssetError,
}) => {
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  // Resolve character asset from typed manifest (resolves jun_mirror explicitly when isMirrorScene is true)
  const asset = resolveCharacterAsset(id, variant, isMirrorScene);
  const primarySrc = customImageSrc || asset.path;
  const [activeSrc, setActiveSrc] = useState<string>(primarySrc);

  // Reset image failure state whenever src changes
  useEffect(() => {
    setImageFailed(false);
    setActiveSrc(primarySrc);
  }, [primarySrc]);

  const handleImageError = () => {
    setImageFailed(true);
    onAssetError?.(asset.filename);
  };

  // Position mappings across 16:9 stage
  const positionClasses = {
    left: 'left-[10%] -translate-x-1/2',
    center: 'left-1/2 -translate-x-1/2',
    right: 'left-[90%] -translate-x-1/2',
  }[position];

  return (
    <div
      id={`character-layer-${id}`}
      className={`absolute z-10 flex items-end justify-center pointer-events-none transition-all duration-300 ${
        isLarge && !isPortrait ? 'bottom-[15vh] h-[140%]' : 'bottom-0 h-[70%]'
      } ${positionClasses}`}
      style={{
        width: isLarge && !isPortrait ? '76%' : '38%',
        maxHeight: isLarge && !isPortrait ? '140%' : '70%',
      }}
    >
      {!imageFailed ? (
        <img
          src={activeSrc}
          alt={asset.label}
          onError={handleImageError}
          className="h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] filter transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-end relative">
          <FallbackCharacter
            id={id}
            variant={variant}
            isMirrorScene={isMirrorScene}
            className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          />
          {isDebugMode && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 px-2 py-1 rounded bg-red-950/90 border border-red-500 text-red-200 text-[11px] font-mono whitespace-nowrap shadow-lg flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>MISSING: {asset.filename}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
