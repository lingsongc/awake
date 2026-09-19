import React, { useState, useEffect } from 'react';
import { resolveCharacterAsset } from '../data/assets';
import bgBedroom from '../assets/images/bg_bedroom.png';
import bgLiving from '../assets/images/bg_living.png';
import bgHallway from '../assets/images/bg_hallway.png';
import mumHuman from '../assets/images/mum_human.png';
import mumMonster from '../assets/images/mum_monster.png';
import raviHuman from '../assets/images/ravi_human.png';
import raviMonster from '../assets/images/ravi_monster.png';
import aisyahHuman from '../assets/images/aisyah_human.png';
import aisyahMonster from '../assets/images/aisyah_monster.png';
import junMirror from '../assets/images/jun_mirror.png';

interface BackgroundArtProps {
  sceneId: 'bg_bedroom' | 'bg_living' | 'bg_hallway' | string;
  className?: string;
}

const BACKGROUND_SOURCES: Record<string, string> = {
  bg_bedroom: bgBedroom,
  bg_living: bgLiving,
  bg_hallway: bgHallway,
};

const CHARACTER_SOURCES: Record<string, Record<string, string>> = {
  mum: { human: mumHuman, monster: mumMonster },
  ravi: { human: raviHuman, monster: raviMonster },
  aisyah: { human: aisyahHuman, monster: aisyahMonster },
};

export const FallbackBackground: React.FC<BackgroundArtProps> = ({ sceneId, className = '' }) => {
  const bundledSrc = BACKGROUND_SOURCES[sceneId];
  if (bundledSrc) {
    return (
      <img
        src={bundledSrc}
        alt={sceneId}
        className={`w-full h-full object-cover object-center select-none ${className}`}
      />
    );
  }
  return <div className={`w-full h-full bg-[#070e0a] ${className}`} />;
};

interface CharacterArtProps {
  id: 'mum' | 'ravi' | 'aisyah' | 'jun' | string;
  variant: 'monster' | 'human';
  className?: string;
  isMirrorScene?: boolean;
}

export const FallbackCharacter: React.FC<CharacterArtProps> = ({
  id,
  variant,
  className = '',
  isMirrorScene = false,
}) => {
  const isMonster = variant === 'monster';

  // Jun in Hallway Mirror (Act 3 Mirror) — bundled art exists for this scene
  if (isMirrorScene) {
    return (
      <img
        src={junMirror}
        alt="Jun's Reflection in Mirror"
        className={`h-full w-auto max-w-full object-contain select-none ${className}`}
      />
    );
  }

  // Jun elsewhere (pacing silhouette) has no bundled source art yet — keep hand-drawn fallback
  // Aligns with hs_eyes (y: 20-34%), hs_jaw (y: 35-48%), hs_hands (y: 52-74%)
  if (id === 'jun') {
    return (
      <svg
        className={`h-full w-auto max-w-full select-none ${className}`}
        viewBox="0 0 600 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="junFaceGrad" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#7a5c49" />
            <stop offset="70%" stopColor="#543c2f" />
            <stop offset="100%" stopColor="#38261d" />
          </radialGradient>
        </defs>

        {/* Torso in Mirror */}
        <path
          d="M 180,480 Q 90,620 130,900 L 470,900 Q 510,620 420,480 Z"
          fill="#1c2520"
          stroke="#2f3d35"
          strokeWidth="6"
        />

        {/* Head (Centered at y: 260) */}
        <ellipse cx="300" cy="270" rx="95" ry="120" fill="url(#junFaceGrad)" stroke="#2b1e16" strokeWidth="4" />

        {/* HAIR */}
        <path
          d="M 200,240 C 200,160 400,160 400,240 Q 370,190 300,190 Q 230,190 200,240 Z"
          fill="#18181b"
        />

        {/* EYES // Dilated Pupils & Dark Hollow Circles (Aligned with hs_eyes at top 20%-34%) */}
        <g id="jun-eyes" transform="translate(0, 0)">
          {/* Dark bruised under-eye circles */}
          <ellipse cx="250" cy="285" rx="36" ry="20" fill="#2d1e18" opacity="0.8" />
          <ellipse cx="350" cy="285" rx="36" ry="20" fill="#2d1e18" opacity="0.8" />
          {/* Eye Whites */}
          <ellipse cx="250" cy="270" rx="30" ry="18" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
          <ellipse cx="350" cy="270" rx="30" ry="18" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
          {/* Severely Dilated Pupils (Filling almost the entire iris) */}
          <circle cx="250" cy="270" r="15" fill="#020617" />
          <circle cx="350" cy="270" r="15" fill="#020617" />
          <circle cx="245" cy="265" r="4" fill="#ffffff" />
          <circle cx="345" cy="265" r="4" fill="#ffffff" />
        </g>

        {/* JAW & MOUTH // Involuntary Clench & Parched Lips (Aligned with hs_jaw at top 35%-48%) */}
        <g id="jun-jaw" transform="translate(0, 0)">
          {/* Tight clenched jawline shadow */}
          <path d="M 230,340 Q 300,380 370,340" stroke="#2d1e18" strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Dry, parched lips */}
          <path d="M 260,345 Q 300,342 340,345" stroke="#78350f" strokeWidth="5" fill="none" strokeLinecap="round" />
          <line x1="275" y1="345" x2="325" y2="345" stroke="#451a03" strokeWidth="2" />
        </g>

        {/* HANDS // Trembling against counter edge (Aligned with hs_hands at top 52%-74%) */}
        <g id="jun-hands" transform="translate(0, 0)">
          {/* Left Hand Gripping Counter */}
          <g transform="translate(180, 540)">
            <ellipse cx="0" cy="0" rx="32" ry="20" fill="#6e5241" stroke="#3d2c22" strokeWidth="4" />
            <rect x="-24" y="-12" width="12" height="35" rx="5" fill="#6e5241" stroke="#3d2c22" strokeWidth="3" />
            <rect x="-8" y="-14" width="12" height="40" rx="5" fill="#6e5241" stroke="#3d2c22" strokeWidth="3" />
            <rect x="8" y="-12" width="12" height="36" rx="5" fill="#6e5241" stroke="#3d2c22" strokeWidth="3" />
          </g>
          {/* Right Hand Gripping Counter */}
          <g transform="translate(420, 540)">
            <ellipse cx="0" cy="0" rx="32" ry="20" fill="#6e5241" stroke="#3d2c22" strokeWidth="4" />
            <rect x="-20" y="-12" width="12" height="36" rx="5" fill="#6e5241" stroke="#3d2c22" strokeWidth="3" />
            <rect x="-4" y="-14" width="12" height="40" rx="5" fill="#6e5241" stroke="#3d2c22" strokeWidth="3" />
            <rect x="12" y="-12" width="12" height="35" rx="5" fill="#6e5241" stroke="#3d2c22" strokeWidth="3" />
          </g>
        </g>
      </svg>
    );
  }

  const bundledSrc = CHARACTER_SOURCES[id]?.[variant];
  return (
    <img
      src={bundledSrc}
      alt={`${id} (${variant})`}
      className={`h-full w-auto max-w-full object-contain select-none ${className}`}
    />
  );
};

// Fallback Card Art for Suspect Board and Case File Screen
export const FallbackCardArt: React.FC<{
  cardId: 'mum' | 'ravi' | 'aisyah' | 'door' | 'jun' | string;
  variant: 'monster' | 'human' | 'hallucination' | 'truth';
  className?: string;
}> = ({ cardId, variant, className = '' }) => {
  const isMonster = variant === 'monster' || variant === 'hallucination';
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [cardId, variant]);

  if (cardId === 'door') {
    return (
      <div className={`w-full h-full bg-[#09140f] flex items-center justify-center p-3 ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="40" y="20" width="120" height="160" fill="#132019" stroke={isMonster ? "#b91c1c" : "#10b981"} strokeWidth="6" rx="4" />
          <circle cx="60" cy="100" r="8" fill="#94a3b8" />
          {isMonster && (
            <line x1="20" y1="30" x2="180" y2="170" stroke="#f87171" strokeWidth="8" strokeDasharray="12 6" />
          )}
        </svg>
      </div>
    );
  }

  const charId = cardId as 'mum' | 'ravi' | 'aisyah' | 'jun';
  // Silhouette / ??? suspect card maps to jun_silhouette.png
  const asset = resolveCharacterAsset(
    charId,
    isMonster ? 'monster' : 'human',
    false
  );

  return (
    <div className={`w-full h-full bg-[#070e0a] flex items-center justify-center overflow-hidden ${className}`}>
      {!imageError ? (
        <img
          src={asset.path}
          alt={asset.label}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      ) : (
        <FallbackCharacter
          id={charId}
          variant={isMonster ? 'monster' : 'human'}
          isMirrorScene={false}
          className="w-full h-full max-h-full object-contain"
        />
      )}
    </div>
  );
};
