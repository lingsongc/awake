import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import { PROJECT_ASSETS } from '../data/assets';

interface KioskPreloaderProps {
  onComplete: () => void;
  maxTimeoutMs?: number;
}

export const KioskPreloader: React.FC<KioskPreloaderProps> = ({
  onComplete,
  maxTimeoutMs = 1500,
}) => {
  const [settledCount, setSettledCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedFilenames, setFailedFilenames] = useState<string[]>([]);
  const completedRef = useRef(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const safeComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    // Clean up all image element references and handlers
    imagesRef.current.forEach((img) => {
      img.onload = null;
      img.onerror = null;
    });
    imagesRef.current = [];

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    onComplete();
  }, [onComplete]);

  useEffect(() => {
    completedRef.current = false;
    let settled = 0;
    let successful = 0;
    const failedList: string[] = [];
    const total = PROJECT_ASSETS.length;

    imagesRef.current = PROJECT_ASSETS.map((asset) => {
      const img = new Image();

      const onSettled = (isSuccess: boolean) => {
        settled++;
        if (isSuccess) {
          successful++;
        } else {
          failedList.push(asset.filename);
          setFailedFilenames([...failedList]);
        }
        setSettledCount(settled);
        setSuccessCount(successful);

        if (settled >= total) {
          timeoutRef.current = setTimeout(() => {
            safeComplete();
          }, 250);
        }
      };

      img.onload = () => onSettled(true);
      img.onerror = () => onSettled(false);
      img.src = asset.path;
      return img;
    });

    // Fallback bounded timeout so kiosk never freezes
    const fallbackTimer = setTimeout(() => {
      safeComplete();
    }, maxTimeoutMs);

    return () => {
      clearTimeout(fallbackTimer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      imagesRef.current.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
      imagesRef.current = [];
    };
  }, [maxTimeoutMs, safeComplete]);

  const total = PROJECT_ASSETS.length;
  const percentage = Math.round((settledCount / total) * 100);
  const failedCount = failedFilenames.length;

  return (
    <div
      id="kiosk-preloader"
      className="absolute inset-0 z-50 bg-[#050b08] flex flex-col items-center justify-center p-6 select-none"
    >
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <ShieldCheck className="w-9 h-9 text-emerald-400" />
        </div>

        <div className="space-y-1 font-mono">
          <h1 className="text-xl font-bold tracking-widest text-white uppercase">
            WIDE AWAKE
          </h1>
          <p className="text-xs text-emerald-400/80">
            Preparing your story
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-[#0e1c14] rounded-full overflow-hidden border border-[#1b3628] p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                failedCount > 0
                  ? 'bg-gradient-to-r from-amber-600 to-emerald-500'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-left">
              {settledCount < total ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-emerald-400 shrink-0" />
                  <span>Preparing assets ({settledCount}/{total})...</span>
                </>
              ) : failedCount > 0 ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-amber-300">
                    {successCount}/{total} loaded ({failedCount} missing — fallback art ready)
                  </span>
                </>
              ) : (
                <span className="text-emerald-400 font-semibold">
                  All {total} assets ready ({successCount}/{total} loaded)
                </span>
              )}
            </span>
            <span className="text-emerald-400 font-bold shrink-0 ml-2">{percentage}%</span>
          </div>

          {failedCount > 0 && settledCount >= total && (
            <div className="text-[10px] font-mono text-amber-400/80 text-left pt-1">
              Missing: {failedFilenames.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
