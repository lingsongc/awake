import React, { useState, useEffect, useCallback } from 'react';

interface GlitchTextProps {
  text: string;
  mode: 'hallucination' | 'clean';
  className?: string;
  onRevealAll?: () => void;
  reduceMotion?: boolean;
}

const GLITCH_CHARS = ['#', '%', '&', '§', '▓', '▒', '░', '?', '!', '0', '1', 'ø', '¥', 'Δ', '§', 'Ø'];

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  mode,
  className = '',
  onRevealAll,
  reduceMotion = false,
}) => {
  const [glitchSeed, setGlitchSeed] = useState(0);
  const [isResolved, setIsResolved] = useState(false);

  // Check reduced-motion preference
  const systemPrefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMotionReduced = reduceMotion || systemPrefersReducedMotion;

  // Clean accessible plain text with brackets removed
  const plainText = text.replace(/\[(.*?)\]/g, '$1');

  // Reset animation whenever text or mode changes
  useEffect(() => {
    if (mode === 'clean' || isMotionReduced) {
      setIsResolved(true);
      return;
    }

    setIsResolved(false);
    setGlitchSeed(0);

    // Rapid cycling glitch glyphs for only 500ms
    const glitchInterval = setInterval(() => {
      setGlitchSeed((prev) => (prev + 1) % 100);
    }, 90);

    // Resolve to stable readable text after 500ms
    const resolveTimeout = setTimeout(() => {
      setIsResolved(true);
      clearInterval(glitchInterval);
    }, 500);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(resolveTimeout);
    };
  }, [text, mode, isMotionReduced]);

  const handleInstantReveal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResolved(true);
      if (onRevealAll) onRevealAll();
    },
    [onRevealAll]
  );

  // If clean mode, reduce-motion enabled, or already resolved, render readable text
  if (mode === 'clean' || isResolved || isMotionReduced) {
    const parts: React.ReactNode[] = [];
    const regex = /\[(.*?)\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const word = match[1];
      parts.push(
        <span
          key={`resolved-${match.index}`}
          className="font-semibold text-emerald-200 underline decoration-emerald-500/40 underline-offset-4"
        >
          {word}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <span className={className} aria-label={plainText}>
        {parts}
      </span>
    );
  }

  // During brief distortion: show glitch characters with aria-hidden, accessible text preserved
  const parts: React.ReactNode[] = [];
  const regex = /\[(.*?)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const word = match[1];
    const glitchedWord = Array.from(word)
      .map((_, i) => GLITCH_CHARS[(glitchSeed + i * 3) % GLITCH_CHARS.length])
      .join('');

    parts.push(
      <button
        key={`glitch-${match.index}`}
        type="button"
        onClick={handleInstantReveal}
        aria-label={`Distorted word: ${word}. Click to reveal text immediately`}
        className="font-mono text-amber-300 font-bold bg-amber-950/60 px-1 rounded border border-amber-600/60 tracking-widest inline-block cursor-pointer hover:bg-amber-900/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <span aria-hidden="true">{glitchedWord}</span>
        <span className="sr-only">{word}</span>
      </button>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <span
      className={className}
      onClick={handleInstantReveal}
      title="Click text to reveal immediately"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsResolved(true);
        }
      }}
    >
      {parts}
    </span>
  );
};
