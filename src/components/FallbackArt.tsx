import React, { useState, useEffect } from 'react';
import { resolveCharacterAsset } from '../data/assets';

interface BackgroundArtProps {
  sceneId: 'bg_bedroom' | 'bg_living' | 'bg_hallway' | string;
  className?: string;
}

export const FallbackBackground: React.FC<BackgroundArtProps> = ({ sceneId, className = '' }) => {
  if (sceneId === 'bg_bedroom') {
    return (
      <svg
        className={`w-full h-full object-cover select-none ${className}`}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgBedWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#08100d" />
            <stop offset="60%" stopColor="#0e1713" />
            <stop offset="100%" stopColor="#060b08" />
          </linearGradient>
          <linearGradient id="phoneGlowPulse" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="floorBedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1814" />
            <stop offset="100%" stopColor="#040705" />
          </linearGradient>
        </defs>

        {/* Back Wall */}
        <rect width="1920" height="780" fill="url(#bgBedWall)" />

        {/* Singapore HDB Bedroom Window Grilles (Taped with Newspaper) */}
        <g id="window-grille-cluster" transform="translate(140, 100)">
          <rect width="460" height="560" fill="#040605" stroke="#1c2c26" strokeWidth="12" rx="4" />
          {/* Grille Bars */}
          <line x1="115" y1="0" x2="115" y2="560" stroke="#1c2c26" strokeWidth="8" />
          <line x1="230" y1="0" x2="230" y2="560" stroke="#1c2c26" strokeWidth="8" />
          <line x1="345" y1="0" x2="345" y2="560" stroke="#1c2c26" strokeWidth="8" />
          <line x1="0" y1="280" x2="460" y2="280" stroke="#1c2c26" strokeWidth="8" />
          {/* Taped Newspapers */}
          <rect x="25" y="30" width="180" height="230" fill="#222b26" stroke="#2d3832" strokeWidth="2" transform="rotate(-3 115 145)" />
          <rect x="220" y="45" width="200" height="240" fill="#1e2722" stroke="#2a352f" strokeWidth="2" transform="rotate(3 320 165)" />
          <rect x="40" y="290" width="180" height="230" fill="#202a24" stroke="#2c3731" strokeWidth="2" transform="rotate(2 130 405)" />
          <rect x="210" y="280" width="220" height="250" fill="#243029" stroke="#313f36" strokeWidth="2" transform="rotate(-4 320 405)" />
          {/* Packing Tape Crosses */}
          <line x1="15" y1="20" x2="440" y2="540" stroke="#526359" strokeWidth="12" strokeOpacity="0.7" strokeDasharray="20 12" />
          <line x1="440" y1="20" x2="15" y2="540" stroke="#526359" strokeWidth="12" strokeOpacity="0.7" strokeDasharray="20 12" />
          <text x="230" y="595" fill="#3f534a" fontSize="15" fontFamily="monospace" textAnchor="middle">
            [TAPED WINDOW GRILLES]
          </text>
        </g>

        {/* Fortified Bedroom Door on Right (Aligned with hs_door at x:77%, y:20%) */}
        <g id="door-cluster" transform="translate(1480, 200)">
          <rect width="320" height="600" fill="#0b1310" stroke="#22332a" strokeWidth="12" rx="4" />
          <rect x="25" y="30" width="270" height="240" fill="#111c17" stroke="#22332a" strokeWidth="4" />
          <rect x="25" y="300" width="270" height="270" fill="#111c17" stroke="#22332a" strokeWidth="4" />
          {/* Heavy Deadbolt & Tape along seams */}
          <line x1="0" y1="0" x2="0" y2="600" stroke="#485c52" strokeWidth="14" strokeDasharray="24 10" />
          <line x1="320" y1="0" x2="320" y2="600" stroke="#485c52" strokeWidth="14" strokeDasharray="24 10" />
          {/* Deadbolt mechanism */}
          <rect x="35" y="290" width="55" height="30" rx="4" fill="#64748b" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="50" cy="305" r="8" fill="#cbd5e1" />
          <rect x="25" y="335" width="40" height="14" rx="4" fill="#475569" />
          <text x="160" y="635" fill="#3f534a" fontSize="15" fontFamily="monospace" textAnchor="middle">
            [DEADBOLTED DOOR & TAPED SEAMS]
          </text>
        </g>

        {/* Floor */}
        <polygon points="0,780 1920,780 1920,1080 0,1080" fill="url(#floorBedGrad)" />
        <line x1="0" y1="780" x2="1920" y2="780" stroke="#18251f" strokeWidth="4" />

        {/* Mattress & Bedside Table with Glowing Phone (Aligned with hs_phone at x:34%, y:62%) */}
        <g id="bed-and-phone-cluster" transform="translate(600, 640)">
          {/* Bed mattress */}
          <rect x="-350" y="40" width="450" height="220" rx="12" fill="#141e19" stroke="#22332a" strokeWidth="4" />
          <path d="M -350,100 Q -150,140 100,100 L 100,260 L -350,260 Z" fill="#0f1713" />
          {/* Nightstand / Floor spot for Phone */}
          <rect x="40" y="20" width="140" height="160" rx="8" fill="#16221c" stroke="#263a30" strokeWidth="3" />
          {/* Glowing Smartphone emitting illumination */}
          <circle cx="110" cy="90" r="130" fill="url(#phoneGlowPulse)" />
          <rect x="75" y="45" width="70" height="120" rx="10" fill="#090d0b" stroke="#38bdf8" strokeWidth="3" />
          <rect x="81" y="53" width="58" height="104" rx="6" fill="#082f49" />
          {/* Notification bars on screen */}
          <line x1="90" y1="75" x2="130" y2="75" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="90" x2="122" y2="90" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
          <circle cx="110" cy="125" r="7" fill="#38bdf8" />
          <text x="110" y="195" fill="#38bdf8" fontSize="13" fontFamily="monospace" textAnchor="middle" opacity="0.9">
            04:12 AM (34 UNREAD)
          </text>
        </g>

        {/* Scattered Foil, Cut Straws & Supplies on Floor (Aligned with hs_supplies at x:56%, y:72%) */}
        <g id="supplies-cluster" transform="translate(1080, 780)">
          {/* Discarded foil strips */}
          <polygon points="10,20 45,5 60,35 25,45" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2" transform="rotate(15 35 25)" />
          <polygon points="70,40 115,25 130,55 85,70" fill="#64748b" stroke="#94a3b8" strokeWidth="2" transform="rotate(-20 100 45)" />
          <polygon points="140,15 175,5 190,30 150,45" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="2" transform="rotate(35 165 25)" />
          {/* Cut plastic straws */}
          <line x1="30" y1="70" x2="90" y2="85" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
          <line x1="110" y1="75" x2="160" y2="60" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
          {/* Crushed plastic bottle */}
          <ellipse cx="210" cy="65" rx="35" ry="16" fill="#334155" stroke="#64748b" strokeWidth="2" transform="rotate(-10 210 65)" />
          <text x="120" y="115" fill="#3f534a" fontSize="14" fontFamily="monospace" textAnchor="middle">
            [SCATTERED FOIL & STRAWS]
          </text>
        </g>

        {/* Ambient Room Clock 04:12 AM */}
        <g transform="translate(960, 120)">
          <rect x="-80" y="-30" width="160" height="60" rx="8" fill="#040806" stroke="#16251d" strokeWidth="3" />
          <text x="0" y="12" fill="#22c55e" fontSize="32" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle" opacity="0.9">
            04:12
          </text>
        </g>
      </svg>
    );
  }

  // Living Room Fallback (bg_living)
  if (sceneId === 'bg_living') {
    return (
      <svg
        className={`w-full h-full object-cover select-none ${className}`}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="livingWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a120e" />
            <stop offset="60%" stopColor="#101b15" />
            <stop offset="100%" stopColor="#080e0b" />
          </linearGradient>
          <linearGradient id="waterGlassGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Living Room Wall */}
        <rect width="1920" height="740" fill="url(#livingWall)" />

        {/* Distant Balcony View of Singapore Night Sky */}
        <g transform="translate(1320, 100)">
          <rect width="480" height="580" fill="#030605" stroke="#1c2c25" strokeWidth="10" />
          {/* Distant HDB block silhouettes */}
          <rect x="40" y="220" width="90" height="340" fill="#09100d" />
          <rect x="160" y="160" width="110" height="400" fill="#070c0a" />
          <rect x="300" y="260" width="120" height="300" fill="#09100d" />
          {/* Distant tiny window lights */}
          <circle cx="70" cy="280" r="3" fill="#fef08a" opacity="0.6" />
          <circle cx="210" cy="220" r="3" fill="#fef08a" opacity="0.4" />
          <circle cx="350" cy="320" r="3" fill="#fef08a" opacity="0.5" />
        </g>

        {/* Floor */}
        <polygon points="0,740 1920,740 1920,1080 0,1080" fill="#070d0a" />
        <line x1="0" y1="740" x2="1920" y2="740" stroke="#1a2b22" strokeWidth="4" />

        {/* Sofa */}
        <g transform="translate(200, 560)">
          <rect width="580" height="220" rx="16" fill="#141f19" stroke="#22332a" strokeWidth="6" />
          <rect x="30" y="20" width="240" height="150" rx="12" fill="#192620" stroke="#273a30" strokeWidth="3" />
          <rect x="300" y="20" width="240" height="150" rx="12" fill="#192620" stroke="#273a30" strokeWidth="3" />
        </g>

        {/* Coffee Table with Glass of Water */}
        <g transform="translate(980, 680)">
          <ellipse cx="200" cy="90" rx="260" ry="85" fill="#15201a" stroke="#26382f" strokeWidth="5" />
          {/* Glass of fresh water on table */}
          <g transform="translate(175, 30)">
            <path d="M 10,0 L 50,0 L 44,70 L 16,70 Z" fill="url(#waterGlassGrad)" stroke="#7dd3fc" strokeWidth="3" />
            <path d="M 14,25 L 46,25 L 42,65 L 18,65 Z" fill="#0284c7" fillOpacity="0.5" />
            <text x="30" y="95" fill="#7dd3fc" fontSize="12" fontFamily="monospace" textAnchor="middle">
              [GLASS OF WATER]
            </text>
          </g>
        </g>
      </svg>
    );
  }

  // Hallway with Vanity Wall Mirror (bg_hallway)
  // Perfectly aligned with ACT3_HOTSPOTS (Mirror centered at x:34%-65%, y:11%-89%)
  return (
    <svg
      className={`w-full h-full object-cover select-none ${className}`}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hallwayWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080e0c" />
          <stop offset="60%" stopColor="#0f1914" />
          <stop offset="100%" stopColor="#060a08" />
        </linearGradient>
        <linearGradient id="mirrorGlassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14221b" />
          <stop offset="50%" stopColor="#1c2f26" />
          <stop offset="100%" stopColor="#101c16" />
        </linearGradient>
      </defs>

      {/* Hallway Wall */}
      <rect width="1920" height="760" fill="url(#hallwayWall)" />

      {/* Floor */}
      <polygon points="0,760 1920,760 1920,1080 0,1080" fill="#060908" />
      <line x1="0" y1="760" x2="1920" y2="760" stroke="#17261e" strokeWidth="4" />

      {/* Wall Vanity Mirror Frame (x: 660, y: 120, width: 600, height: 840) */}
      <rect x="660" y="120" width="600" height="840" rx="16" fill="#0b130f" stroke="#2e4237" strokeWidth="16" />
      <rect x="685" y="145" width="550" height="790" rx="10" fill="url(#mirrorGlassGrad)" stroke="#4d6659" strokeWidth="4" />

      {/* Reflection Header */}
      <text x="960" y="195" fill="#527062" fontSize="16" fontFamily="monospace" textAnchor="middle" letterSpacing="4">
        HALLWAY VANITY MIRROR // SELF-OBSERVATION
      </text>
    </svg>
  );
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

  // Jun in Hallway Mirror (Act 3 Mirror)
  // Aligns with hs_eyes (y: 20-34%), hs_jaw (y: 35-48%), hs_hands (y: 52-74%)
  if (id === 'jun' || isMirrorScene) {
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

  // Ravi: Red Baseball Cap & Outstretched Hand with Glass of Water
  if (id === 'ravi') {
    return (
      <svg
        className={`h-full w-auto max-w-full select-none ${className}`}
        viewBox="0 0 600 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="raviFaceGrad" cx="50%" cy="35%" r="50%">
            <stop offset="0%" stopColor={isMonster ? '#1e382e' : '#9a7b68'} />
            <stop offset="70%" stopColor={isMonster ? '#0f201a' : '#6e5241'} />
            <stop offset="100%" stopColor={isMonster ? '#060f0c' : '#4a3528'} />
          </radialGradient>
        </defs>

        {/* Torso */}
        <path
          d={
            isMonster
              ? 'M 180,480 Q 80,600 120,900 L 480,900 Q 520,600 420,480 Z'
              : 'M 180,460 Q 120,580 150,900 L 450,900 Q 480,580 420,460 Z'
          }
          fill={isMonster ? '#0d1713' : '#24323a'}
          stroke={isMonster ? '#1a2e26' : '#3b4f5a'}
          strokeWidth="6"
        />

        {/* Head */}
        <ellipse
          cx="300"
          cy="360"
          rx={isMonster ? '105' : '90'}
          ry={isMonster ? '125' : '110'}
          fill="url(#raviFaceGrad)"
        />

        {/* MANDATORY IDENTIFYING ITEM: RED BASEBALL CAP (Present in BOTH monster and human forms) */}
        <g id="red-cap-layer" transform="translate(300, 260)">
          {/* Cap Dome */}
          <path d="M -90,40 C -90,-35 90,-35 90,40 Z" fill="#b91c1c" stroke="#ef4444" strokeWidth="5" />
          {/* Cap Visor */}
          <ellipse cx="40" cy="40" rx="90" ry="24" fill="#991b1b" stroke="#dc2626" strokeWidth="4" />
        </g>

        {/* Facial Expression: Distorted Threat vs Worried Friend */}
        {isMonster ? (
          <g>
            <ellipse cx="250" cy="360" rx="18" ry="12" fill="#040706" stroke="#4ade80" strokeWidth="2" />
            <ellipse cx="350" cy="360" rx="18" ry="12" fill="#040706" stroke="#4ade80" strokeWidth="2" />
            <circle cx="250" cy="360" r="4" fill="#86efac" />
            <circle cx="350" cy="360" r="4" fill="#86efac" />
            <path d="M 260,430 Q 300,410 340,430" stroke="#162921" strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <g>
            <circle cx="265" cy="360" r="9" fill="#18181b" />
            <circle cx="335" cy="360" r="9" fill="#18181b" />
            <line x1="245" y1="335" x2="285" y2="345" stroke="#27272a" strokeWidth="4" strokeLinecap="round" />
            <line x1="355" y1="335" x2="315" y2="345" stroke="#27272a" strokeWidth="4" strokeLinecap="round" />
            <path d="M 280,420 Q 300,410 320,420" stroke="#3f3f46" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* MANDATORY ACTION: Outstretched Hand with Glass of Water */}
        <g id="ravi-water-glass" transform="translate(380, 560)">
          <path
            d="M 20,40 Q 80,70 120,40"
            stroke={isMonster ? '#101e19' : '#80614f'}
            strokeWidth="48"
            strokeLinecap="round"
            fill="none"
          />
          {/* Glass */}
          <path d="M 90,0 L 150,0 L 140,80 L 100,80 Z" fill="#38bdf8" fillOpacity="0.45" stroke="#e0f2fe" strokeWidth="5" />
          <path d="M 94,25 L 146,25 L 138,75 L 102,75 Z" fill="#0284c7" fillOpacity="0.6" />
          {/* Fingers clasping */}
          <ellipse cx="95" cy="40" rx="14" ry="10" fill={isMonster ? '#162921' : '#80614f'} />
          <ellipse cx="145" cy="40" rx="14" ry="10" fill={isMonster ? '#162921' : '#80614f'} />
        </g>
      </svg>
    );
  }

  // Mum: Jade Bracelet & Porridge Bowl in Human Form
  if (id === 'mum') {
    return (
      <svg
        className={`h-full w-auto max-w-full select-none ${className}`}
        viewBox="0 0 600 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="300" cy="340" rx="85" ry="105" fill={isMonster ? '#152620' : '#826555'} />
        {/* Hair in neat bun */}
        <ellipse cx="300" cy="270" rx="60" ry="40" fill="#18181b" />
        <path
          d="M 200,440 Q 130,560 160,900 L 440,900 Q 470,560 400,440 Z"
          fill={isMonster ? '#0c1512' : '#3d3040'}
          stroke={isMonster ? '#1b2d26' : '#5a4560'}
          strokeWidth="6"
        />

        {/* Facial Expression */}
        {isMonster ? (
          <g>
            <ellipse cx="265" cy="340" rx="14" ry="8" fill="#050a08" stroke="#4ade80" strokeWidth="2" />
            <ellipse cx="335" cy="340" rx="14" ry="8" fill="#050a08" stroke="#4ade80" strokeWidth="2" />
          </g>
        ) : (
          <g>
            <circle cx="270" cy="340" r="7" fill="#18181b" />
            <circle cx="330" cy="340" r="7" fill="#18181b" />
            <path d="M 285,395 Q 300,388 315,395" stroke="#3f3f46" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* MANDATORY IDENTIFYING ITEM: Glowing Jade Bracelet on Wrist */}
        <g id="mum-jade-bracelet" transform="translate(180, 680)">
          <path
            d="M -30,-40 Q 20,20 40,80"
            stroke={isMonster ? '#152620' : '#826555'}
            strokeWidth="38"
            strokeLinecap="round"
            fill="none"
          />
          {/* Green Jade Bracelet Ring */}
          <ellipse cx="15" cy="35" rx="28" ry="18" fill="none" stroke="#10b981" strokeWidth="12" />
          <ellipse cx="15" cy="35" rx="28" ry="18" fill="none" stroke="#6ee7b7" strokeWidth="4" />
        </g>

        {/* Human Mother Holding Warm Food Bowl */}
        {!isMonster && (
          <g transform="translate(260, 640)">
            <ellipse cx="40" cy="40" rx="55" ry="24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
            <ellipse cx="40" cy="35" rx="45" ry="16" fill="#fef08a" opacity="0.8" />
          </g>
        )}
      </svg>
    );
  }

  // Aisyah: Yellow Hairclip & Support Emergency Sheets
  return (
    <svg
      className={`h-full w-auto max-w-full select-none ${className}`}
      viewBox="0 0 600 900"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="300" cy="340" rx="85" ry="105" fill={isMonster ? '#152620' : '#826555'} />
      {/* Hair */}
      <path d="M 215,300 C 215,220 385,220 385,300 L 395,420 L 205,420 Z" fill="#18181b" />

      {/* Torso */}
      <path
        d="M 200,440 Q 130,560 160,900 L 440,900 Q 470,560 400,440 Z"
        fill={isMonster ? '#0c1512' : '#334155'}
        stroke="#1b2d26"
        strokeWidth="6"
      />

      {/* MANDATORY IDENTIFYING ITEM: Yellow Hairclip */}
      <path
        d="M 180,440 L 260,900 L 340,900 L 420,440 Q 300,500 180,440 Z"
        fill="#ca8a04"
        stroke="#eab308"
        strokeWidth="6"
        opacity={isMonster ? 0.75 : 0.95}
      />

      {/* Human Colleague Holding Emergency Helpline Printouts */}
      {!isMonster && (
        <g transform="translate(300, 600)">
          <rect x="-40" y="-30" width="80" height="100" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-8)" />
          <line x1="-30" y1="-15" x2="20" y2="-15" stroke="#64748b" strokeWidth="2" />
          <line x1="-30" y1="5" x2="25" y2="5" stroke="#64748b" strokeWidth="2" />
          <line x1="-30" y1="25" x2="15" y2="25" stroke="#10b981" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
};

// Fallback Card Art for Suspect Board and Case File Screen
export const FallbackCardArt: React.FC<{
  cardId: 'mum' | 'ravi' | 'aisyah' | 'door' | 'jun' | string;
  variant: 'monster' | 'human' | 'hallucination' | 'truth';
  useMirrorForJun?: boolean;
  className?: string;
}> = ({ cardId, variant, useMirrorForJun = false, className = '' }) => {
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
    useMirrorForJun && charId === 'jun'
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
          isMirrorScene={useMirrorForJun && charId === 'jun'}
          className="w-full h-full max-h-full object-contain"
        />
      )}
    </div>
  );
};
