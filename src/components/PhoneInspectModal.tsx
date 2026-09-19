import React, { useState, useRef } from 'react';
import { Smartphone, CheckCircle2, MessageSquare, AlertCircle, X, ChevronRight } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface PhoneInspectModalProps {
  onAwardClue: () => void;
  onClose: () => void;
  isClueCollected: boolean;
}

export const PhoneInspectModal: React.FC<PhoneInspectModalProps> = ({
  onAwardClue,
  onClose,
  isClueCollected,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'notes'>('messages');
  const [messagesRead, setMessagesRead] = useState(false);

  useModalAccessibility({
    isOpen: true,
    onClose,
    modalRef,
    closeOnEscape: true,
  });

  const handleReadMessages = () => {
    setMessagesRead(true);
    if (!isClueCollected) {
      onAwardClue();
    }
  };

  return (
    <div
      id="phone-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-inspect-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        id="phone-device-container"
        tabIndex={-1}
        className="w-full max-w-md bg-[#0c1611] border-2 border-[#1f3d2b] rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between max-h-[92dvh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone Top Speaker & Notch Bar */}
        <div className="flex items-center justify-between border-b border-[#1b3426] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3
              id="phone-inspect-title"
              className="text-xs sm:text-sm font-mono font-bold text-emerald-300 tracking-wider uppercase"
            >
              JUN'S SECURE PHONE
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              03:42 AM • 14%
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Put phone down / close modal"
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#16291e] hover:bg-[#203c2c] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-3 bg-[#08100c] p-1 rounded-xl border border-[#162b1f]">
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            aria-pressed={activeTab === 'messages'}
            className={`flex-1 min-h-[44px] py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              activeTab === 'messages'
                ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Unread Group Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            aria-pressed={activeTab === 'notes'}
            className={`flex-1 min-h-[44px] py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              activeTab === 'notes'
                ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Memo / Audio Log</span>
          </button>
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-[#060c09] rounded-2xl border border-[#162b1f] p-3 sm:p-4 space-y-3 overflow-y-auto mb-3 min-h-[180px] max-h-[45dvh]">
          {activeTab === 'messages' ? (
            <div className="space-y-3">
              <div className="bg-[#0b1610] p-3 rounded-xl border border-[#1c3626]">
                <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">
                  MUM [02:15 AM]:
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  "Jun, why is your bedroom door locked from inside? Please open up. Take your pills. You've been awake for 80 hours straight."
                </p>
              </div>

              <div className="bg-[#0b1610] p-3 rounded-xl border border-[#1c3626]">
                <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">
                  RAVI [03:02 AM]:
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  "Bro, we called Dr. Aisyah. Stop nailing the windows shut. No one is coming through the vents. It's sleep deprivation."
                </p>
              </div>

              <div className="bg-[#122319] p-3 rounded-xl border border-emerald-500/40">
                <div className="text-[11px] font-mono text-amber-300 font-bold mb-1">
                  DR. AISYAH [03:20 AM]:
                </div>
                <p className="text-xs sm:text-sm text-emerald-100">
                  "Jun, this is acute stimulant-induced paranoia. The monster you think is stalking your apartment is a projection of severe sleep debt. Let us help you."
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-[#0b1610] p-3 rounded-xl border border-[#1c3626]">
                <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">
                  VOICE MEMO 4 — "NIGHT 4 NO SLEEP"
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic">
                  "...my heart won't stop racing. The walls are whispering. I taped the door seams with masking tape. But it's already inside... in the mirror..."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Read & Record Clue */}
        <div className="space-y-2">
          {!isClueCollected ? (
            <button
              type="button"
              onClick={handleReadMessages}
              aria-label="Read text logs and record clue in case notebook"
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg border border-emerald-400 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>READ LOGS & RECORD CLUE</span>
            </button>
          ) : (
            <div className="w-full py-2 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center gap-2 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Evidence "Phone Chat History" recorded in Case Notebook</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Put Phone Down and return to scene"
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#14261d] hover:bg-[#1f3c2d] active:scale-95 text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 border border-[#213f2d] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>PUT PHONE DOWN</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
