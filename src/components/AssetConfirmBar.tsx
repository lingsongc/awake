import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Upload, RefreshCw, X, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { PROJECT_ASSETS, ProjectAsset, resolveBackgroundAsset, resolveCharacterAsset } from '../data/assets';

interface AssetConfirmBarProps {
  currentBg: 'bg_bedroom' | 'bg_living' | 'bg_hallway';
  onChangeBg: (bg: 'bg_bedroom' | 'bg_living' | 'bg_hallway') => void;
  currentCharacter: 'mum' | 'ravi' | 'aisyah' | 'jun';
  onChangeCharacter: (char: 'mum' | 'ravi' | 'aisyah' | 'jun') => void;
  currentVariant: 'monster' | 'human';
  onChangeVariant: (variant: 'monster' | 'human') => void;
  currentPosition: 'left' | 'center' | 'right';
  onChangePosition: (pos: 'left' | 'center' | 'right') => void;
  onCustomImageLoad: (filename: string, url: string) => void;
  customImages: Record<string, string>;
  failedAssets?: Record<string, boolean>;
  onMarkAssetMissing?: (filename: string) => void;
}

export const AssetConfirmBar: React.FC<AssetConfirmBarProps> = ({
  currentBg,
  onChangeBg,
  currentCharacter,
  onChangeCharacter,
  currentVariant,
  onChangeVariant,
  currentPosition,
  onChangePosition,
  onCustomImageLoad,
  customImages,
  failedAssets,
  onMarkAssetMissing,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadStatus, setLoadStatus] = useState<Record<string, 'found' | 'missing' | 'checking'>>({});
  const createdUrlsRef = useRef<string[]>([]);

  // Clean up object URLs on unmount to prevent leaks
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      createdUrlsRef.current = [];
    };
  }, []);

  const checkAssets = () => {
    const statuses: Record<string, 'found' | 'missing' | 'checking'> = {};
    PROJECT_ASSETS.forEach((asset) => {
      statuses[asset.filename] = 'checking';
    });
    setLoadStatus(statuses);

    PROJECT_ASSETS.forEach((asset) => {
      // Check if custom URL exists first
      if (customImages[asset.filename]) {
        setLoadStatus((prev) => ({ ...prev, [asset.filename]: 'found' }));
        return;
      }

      // Check if already known failed
      if (failedAssets && failedAssets[asset.filename]) {
        setLoadStatus((prev) => ({ ...prev, [asset.filename]: 'missing' }));
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadStatus((prev) => ({ ...prev, [asset.filename]: 'found' }));
      };
      img.onerror = () => {
        setLoadStatus((prev) => ({ ...prev, [asset.filename]: 'missing' }));
        onMarkAssetMissing?.(asset.filename);
      };
      img.src = asset.path;
    });
  };

  useEffect(() => {
    checkAssets();
  }, [customImages, failedAssets]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const lowerName = file.name.toLowerCase();
      // Match by exact filename or stem
      const matched = PROJECT_ASSETS.find(
        (a) =>
          a.filename.toLowerCase() === lowerName ||
          a.filename.toLowerCase().replace('.png', '') ===
            lowerName.replace(/\.(png|webp|jpg|jpeg)$/, '')
      );
      const objectUrl = URL.createObjectURL(file);
      createdUrlsRef.current.push(objectUrl);

      if (matched) {
        onCustomImageLoad(matched.filename, objectUrl);
      } else {
        onCustomImageLoad(file.name, objectUrl);
      }
    });
  };

  const foundCount = Object.values(loadStatus).filter((s) => s === 'found').length;
  const missingCount = Object.values(loadStatus).filter((s) => s === 'missing').length;

  // Resolve preview assets for the modal mini-stage
  const isMirror = currentCharacter === 'jun' && currentBg === 'bg_hallway';
  const previewBgAsset = resolveBackgroundAsset(currentBg);
  const previewBgSrc = customImages[previewBgAsset.filename] || previewBgAsset.path;
  const previewCharAsset = resolveCharacterAsset(currentCharacter, currentVariant, isMirror);
  const previewCharSrc =
    (currentCharacter === 'jun'
      ? (isMirror ? customImages['jun_mirror.png'] : customImages['jun_silhouette.png'])
      : customImages[previewCharAsset.filename]) || previewCharAsset.path;

  const positionAlignClass = {
    left: 'justify-start pl-[12%]',
    center: 'justify-center',
    right: 'justify-end pr-[12%]',
  }[currentPosition];

  return (
    <>
      {/* Discreet Stage 1 Control Pill at Top */}
      <div className="absolute top-3 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0e1713]/90 border border-[#233a2d] hover:border-[#385f49] text-xs font-semibold tracking-wide text-emerald-300 backdrop-blur-md shadow-lg transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Asset Inspector</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#1b2d23] text-[10px] text-emerald-400">
            {foundCount}/{PROJECT_ASSETS.length} Found
          </span>
          {missingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-950 text-[10px] text-red-400 border border-red-800">
              {missingCount} Missing
            </span>
          )}
        </button>
      </div>

      {/* Drawer / Inspector Modal */}
      {isOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1410] border border-[#21372a] rounded-2xl max-w-3xl w-full max-h-[90%] flex flex-col shadow-2xl overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#1b2d22] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  Asset Verification & Live PNG Preview
                </h3>
                <p className="text-xs text-emerald-400/80">
                  Preview canonical PNG artwork, inspect load status, and test layering overrides.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#14231b] hover:bg-[#1f372a] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Interactive PNG Mini-Stage */}
            <div className="p-4 border-b border-[#1b2d22] bg-[#080e0a]">
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                <span>Stage Visualizer (16:9 Composition)</span>
                <span className="font-mono text-[11px] text-emerald-400">
                  {currentBg}.png + {previewCharAsset.filename}
                </span>
              </div>
              <div className="relative aspect-video w-full max-h-52 mx-auto rounded-xl overflow-hidden border border-[#22392c] bg-black">
                {/* Background PNG Layer */}
                <img
                  src={previewBgSrc}
                  alt={previewBgAsset.label}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Character PNG Layer */}
                <div className={`absolute inset-0 flex items-end ${positionAlignClass} pointer-events-none`}>
                  <img
                    src={previewCharSrc}
                    alt={previewCharAsset.label}
                    className="h-[80%] w-auto max-w-[40%] object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
                  />
                </div>
              </div>
            </div>

            {/* Stage Configuration Selector */}
            <div className="p-4 border-b border-[#1b2d22] bg-[#0e1914] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Background:</label>
                <div className="flex flex-col gap-1">
                  {(['bg_bedroom', 'bg_living', 'bg_hallway'] as const).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => onChangeBg(bg)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                        currentBg === bg
                          ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200 shadow-sm'
                          : 'bg-[#14231b] border-[#22392c] text-slate-300 hover:border-emerald-700'
                      }`}
                    >
                      {bg.replace('bg_', '')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Character:</label>
                <div className="flex flex-col gap-1">
                  {(['mum', 'ravi', 'aisyah', 'jun'] as const).map((char) => (
                    <button
                      key={char}
                      onClick={() => onChangeCharacter(char)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium capitalize transition-colors cursor-pointer ${
                        currentCharacter === char
                          ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200 shadow-sm'
                          : 'bg-[#14231b] border-[#22392c] text-slate-300 hover:border-emerald-700'
                      }`}
                    >
                      {char === 'jun' ? 'Jun (Mirror)' : char}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Variant:</label>
                <div className="flex flex-col gap-1">
                  {(['monster', 'human'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => onChangeVariant(v)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium capitalize transition-colors cursor-pointer ${
                        currentVariant === v
                          ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200 shadow-sm'
                          : 'bg-[#14231b] border-[#22392c] text-slate-300 hover:border-emerald-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Position:</label>
                <div className="flex flex-col gap-1">
                  {(['left', 'center', 'right'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => onChangePosition(p)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium capitalize transition-colors cursor-pointer ${
                        currentPosition === p
                          ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200 shadow-sm'
                          : 'bg-[#14231b] border-[#22392c] text-slate-300 hover:border-emerald-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Table */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
                  Design Spec Asset Checklist ({PROJECT_ASSETS.length} files)
                </span>
                <button
                  onClick={checkAssets}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-check Paths</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {PROJECT_ASSETS.map((asset: ProjectAsset) => {
                  const status = loadStatus[asset.filename];
                  const hasCustom = !!customImages[asset.filename];

                  return (
                    <div
                      key={asset.filename}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#111c16] border border-[#1b2d23] text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {status === 'found' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="font-mono font-medium text-slate-200">
                            {asset.filename}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-2">
                            ({asset.label})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {status === 'found' ? (
                          hasCustom ? (
                            <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-600 text-sky-300 text-[10px] font-semibold">
                              Loaded (Custom)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-semibold">
                              Found on Disk
                            </span>
                          )
                        ) : status === 'missing' ? (
                          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-700/80 text-red-300 text-[10px] font-semibold">
                            Missing
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/60 text-amber-300 text-[10px]">
                            Checking...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Drop Zone */}
              <div className="mt-4 p-3 rounded-xl border border-dashed border-[#2b4837] bg-[#0c1611] text-center">
                <label className="cursor-pointer flex flex-col items-center justify-center gap-1">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">
                    Upload image files to test rendering live
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Accepts .png, .webp, .jpg (Revokes temporary memory safely on unmount)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#1b2d22] bg-[#0a120e] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Supplied PNGs render as primary path; emergency SVG fallback protects unsupplied assets.
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Close & Return to Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
