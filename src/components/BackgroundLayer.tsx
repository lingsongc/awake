import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { FallbackBackground } from './FallbackArt';
import { resolveBackgroundAsset } from '../data/assets';

export interface BackgroundLayerProps {
  sceneId: 'bg_bedroom' | 'bg_living' | 'bg_hallway';
  customImageSrc?: string;
  mode?: 'hallucination' | 'clean';
  isDebugMode?: boolean;
  onAssetError?: (filename: string) => void;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  sceneId,
  customImageSrc,
  mode = 'hallucination',
  isDebugMode = false,
  onAssetError,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const defaultAsset = resolveBackgroundAsset(sceneId);
  const primarySrc = customImageSrc || defaultAsset.path;
  const [activeSrc, setActiveSrc] = useState<string>(primarySrc);

  // Reset image failure state whenever src changes
  useEffect(() => {
    setImageFailed(false);
    setActiveSrc(primarySrc);
  }, [primarySrc]);

  const handleImageError = () => {
    // Try alternate assets/images/ path before failing
    if (activeSrc.includes('/assets/') && !activeSrc.includes('/assets/images/')) {
      setActiveSrc(activeSrc.replace('/assets/', '/assets/images/'));
      return;
    }
    if (activeSrc.includes('/assets/images/')) {
      setActiveSrc(activeSrc.replace('/assets/images/', '/assets/'));
      return;
    }
    setImageFailed(true);
    onAssetError?.(defaultAsset.filename);
  };

  // Keep expensive distortion filters scoped strictly to art layers
  const hallucinationStyle: React.CSSProperties =
    mode === 'hallucination'
      ? {
          filter: 'saturate(0.7) hue-rotate(-15deg) contrast(1.15)',
        }
      : {};

  return (
    <div
      id={`background-layer-${sceneId}`}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden"
      style={hallucinationStyle}
    >
      {!imageFailed ? (
        <img
          src={activeSrc}
          alt={defaultAsset.label}
          onError={handleImageError}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      ) : (
        <>
          <FallbackBackground sceneId={sceneId} />
          {isDebugMode && (
            <div className="absolute top-14 left-4 z-40 px-3 py-1.5 rounded-lg bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-2 shadow-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>MISSING ASSET: {defaultAsset.filename} (Emergency SVG fallback active)</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
