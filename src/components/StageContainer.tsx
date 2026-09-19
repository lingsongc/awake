import React, { useEffect, useRef, useState } from 'react';

interface StageContainerProps {
  children: React.ReactNode;
  mode?: 'hallucination' | 'clean';
  shaking?: boolean;
  flashing?: boolean;
  reduceMotion?: boolean;
  isPortrait?: boolean;
}

export const StageContainer: React.FC<StageContainerProps> = ({
  children,
  mode = 'hallucination',
  shaking = false,
  flashing = false,
  reduceMotion = false,
  isPortrait = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 960,
    height: 540,
  });

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      if (isPortrait) {
        setDimensions({ width: clientWidth, height: clientHeight });
        return;
      }

      const targetRatio = 16 / 9;
      const currentRatio = clientWidth / clientHeight;

      let w = clientWidth;
      let h = clientHeight;

      if (currentRatio > targetRatio) {
        // Window is wider than 16:9 -> pillarboxed (black bars left/right)
        h = clientHeight;
        w = clientHeight * targetRatio;
      } else {
        // Window is taller than 16:9 -> letterboxed (black bars top/bottom)
        w = clientWidth;
        h = clientWidth / targetRatio;
      }

      setDimensions({ width: Math.floor(w), height: Math.floor(h) });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [isPortrait]);

  const shouldShake = shaking && !reduceMotion;
  const shouldFlash = flashing && !reduceMotion;

  return (
    <div
      ref={containerRef}
      id="viewport-wrapper"
      className={`relative w-full h-full min-h-[100dvh] bg-black flex items-center justify-center select-none ${
        isPortrait ? 'overflow-y-auto' : 'overflow-hidden'
      }`}
    >
      {/* Stage Container */}
      <div
        id={isPortrait ? 'stage-portrait' : 'stage-16-9'}
        style={
          isPortrait
            ? { width: '100%', minHeight: '100dvh' }
            : {
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
              }
        }
        className={`relative bg-[#070b09] shadow-2xl transition-all duration-200 ${
          isPortrait
            ? 'flex flex-col min-h-[100dvh] w-full overflow-y-auto'
            : `overflow-hidden ${shouldShake ? 'animate-shake' : ''}`
        }`}
      >
        {children}

        {/* Screen flash on impact / shove (disabled in reduce-motion) */}
        {shouldFlash && (
          <div
            id="screen-flash-overlay"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-50 bg-white animate-flash"
          />
        )}

        {/* Hallucination mode vignette (subtle edge shading) */}
        {mode === 'hallucination' && (
          <div
            id="hallucination-vignette"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 mix-blend-multiply opacity-80"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(4,18,10,0.4) 75%, rgba(0,0,0,0.9) 100%)',
            }}
          />
        )}
      </div>
    </div>
  );
};
