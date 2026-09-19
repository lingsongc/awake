import React, { useState } from 'react';
import {
  RotateCcw,
  Heart,
  HelpCircle,
  ExternalLink,
  Shield,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
} from 'lucide-react';

interface EndScreenProps {
  steppedBack: boolean;
  onRestart: () => void;
  reduceMotion?: boolean;
}

interface ReflectionOption {
  id: string;
  label: string;
  feedback: string;
  isRecommended: boolean;
}

const REFLECTION_OPTIONS: ReflectionOption[] = [
  {
    id: 'support_professional',
    label: 'Support them to connect with professional healthcare services or a trusted adult.',
    feedback:
      'Supporting a friend to connect with qualified healthcare professionals or community addiction services helps ensure they receive appropriate support without putting anyone in danger.',
    isRecommended: true,
  },
  {
    id: 'handle_alone',
    label: 'Try to manage or treat their condition completely on your own.',
    feedback:
      'Managing acute substance distress or mental health crises requires qualified professional care. You should not carry the burden alone or promise secrecy at the expense of safety.',
    isRecommended: false,
  },
  {
    id: 'share_gossip',
    label: 'Share their situation with others as gossip or post about it online.',
    feedback:
      'Spreading personal struggles can damage trust and discourage people from seeking help when they need it most. Respecting privacy while encouraging professional support is vital.',
    isRecommended: false,
  },
];

export const EndScreen: React.FC<EndScreenProps> = ({
  steppedBack,
  onRestart,
  reduceMotion = false,
}) => {
  // Tracked strictly in current run memory
  const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
  const [isFactFictionOpen, setIsFactFictionOpen] = useState(false);

  const activeOption = REFLECTION_OPTIONS.find((opt) => opt.id === selectedReflection);

  return (
    <div
      id="end-screen-overlay"
      role="region"
      aria-label="Investigation Conclusion and Support Screen"
      className="fixed inset-0 z-50 bg-gradient-to-t from-black via-[#06100a] to-[#040805] flex flex-col p-4 sm:p-6 lg:p-8 select-none overflow-y-auto min-h-[100dvh]"
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col space-y-6 my-auto py-4">
        {/* Top Case Resolution Badge */}
        <div className="w-full flex items-center justify-between border-b border-[#182e21] pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Shield className="w-4 h-4" />
            <span>CASE CONCLUSION</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {steppedBack ? 'BRANCH: GAVE SPACE' : 'BRANCH: STOOD STEADY'}
          </div>
        </div>

        {/* 1. Core Takeaway & Story Conclusion */}
        <div className="bg-[#0b1611]/95 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.12)] flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/90 border border-emerald-400/80 flex items-center justify-center text-emerald-300 shadow-md">
            <Heart className="w-6 h-6 text-emerald-400" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight leading-snug">
              “Drug use can distort what feels real.
              <br />
              Recognise the risk. Reach for help.”
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl text-center">
            When the door opened, there were no monsters or intruders. Jun was suffering from acute
            substance-induced paranoia, anxiety, and sleeplessness after methamphetamine use. Mum, Ravi,
            and his colleague Aisyah stayed by his side and called for professional medical help. The visual
            reveal marks the beginning of support, not instant recovery.
          </p>

          {/* Clearly Labelled Fictional-Story Note */}
          <div className="w-full bg-[#07100b] border border-[#1a3324] rounded-2xl p-3.5 text-left flex items-start gap-3">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] sm:text-xs text-slate-300 leading-relaxed space-y-1">
              <span className="font-bold text-emerald-300 font-mono uppercase tracking-wide">
                Fictional Narrative Note:
              </span>{' '}
              This interactive story portrays the severe perceptual distortion, paranoia, and distress that can
              accompany methamphetamine misuse. Jun is a person worthy of care and support. Recovery is a journey
              that begins with connecting to professional help.
            </div>
          </div>
        </div>

        {/* 2. Interactive Reflection Question */}
        <div className="bg-[#0a1410] border border-[#1e3b2b] rounded-3xl p-5 sm:p-7 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-white font-mono">
              Reflection Question
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            After this story, what would you do if you were worried about a friend?
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {REFLECTION_OPTIONS.map((option, index) => {
              const isSelected = selectedReflection === option.id;
              return (
                <button
                  key={option.id}
                  id={`reflection-option-${index + 1}`}
                  type="button"
                  onClick={() => setSelectedReflection(option.id)}
                  aria-pressed={isSelected}
                  className={`w-full min-h-[48px] p-3.5 sm:p-4 rounded-2xl text-left text-xs sm:text-sm font-sans transition-all flex items-center justify-between gap-3 border-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isSelected
                      ? option.isRecommended
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
                        : 'bg-amber-950/70 border-amber-500 text-slate-100 shadow-md'
                      : 'bg-[#070e0a] border-[#182e21] text-slate-300 hover:border-[#274d37] hover:text-white'
                  }`}
                >
                  <span className="leading-relaxed">{option.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? option.isRecommended
                          ? 'border-emerald-400 bg-emerald-500 text-black'
                          : 'border-amber-400 bg-amber-500 text-black'
                        : 'border-slate-600 bg-black/40'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {activeOption && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-fadeIn ${
                activeOption.isRecommended
                  ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-100'
                  : 'bg-[#141a12] border-amber-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {activeOption.isRecommended ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold font-mono text-xs uppercase tracking-wide mb-1 text-emerald-300">
                    {activeOption.isRecommended ? 'Constructive Approach' : 'Perspective & Care Note'}
                  </div>
                  <p>{activeOption.feedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Find Support & Verified Resources */}
        <div className="bg-[#0c1812] border-2 border-emerald-500/70 rounded-3xl p-5 sm:p-7 shadow-[0_0_30px_rgba(16,185,129,0.1)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                Find Support & Information
              </h3>
              <div className="text-xs text-emerald-400 font-mono">
                Professional Healthcare & Guidance
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you or someone you know is affected by substance use concerns, professional services and
            evidence-based resources can provide guidance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* NAMS Support Contact */}
            <div className="bg-[#08120d] border border-[#1b3827] rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  National Addictions Management Service (NAMS)
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Find Addiction Support
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Institute of Mental Health (IMH), Singapore
                </div>
              </div>
              <a
                href="https://www.nhghealth.com.sg/imh/nams/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open NAMS contact page in a new tab"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Contact NAMS</span>
              </a>
            </div>

            {/* Official CNB Information */}
            <div className="bg-[#08120d] border border-[#1b3827] rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Central Narcotics Bureau (CNB)
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Methamphetamine Facts & Risks
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Official Singapore Drug Information Portal
                </div>
              </div>
              <a
                href="https://www.cnb.gov.sg/drug-information/drugs-and-inhalants"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open CNB drug information page in a new tab"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#14261d] hover:bg-[#1d382b] border border-[#234533] text-emerald-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View CNB Drug Information</span>
              </a>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1">
            * In an immediate medical emergency in Singapore, please call 995 (Ambulance) or 999 (Police).
          </div>
        </div>

        {/* 4. “What was fact, what was fiction?” Collapsible Section */}
        <div className="bg-[#08120e] border border-[#1b3326] rounded-3xl overflow-hidden">
          <button
            type="button"
            onClick={() => setIsFactFictionOpen((prev) => !prev)}
            aria-expanded={isFactFictionOpen}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-mono font-bold text-slate-200 hover:text-white hover:bg-[#0c1c14] transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <div className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-emerald-400" />
              <span>WHAT WAS FACT, WHAT WAS FICTION?</span>
            </div>
            {isFactFictionOpen ? (
              <ChevronUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isFactFictionOpen && (
            <div className="p-5 pt-0 border-t border-[#162a1f] text-xs sm:text-sm text-slate-300 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-[#050c08] p-4 rounded-2xl border border-emerald-900/60 space-y-2">
                  <div className="font-mono font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CNB & Health Facts</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    • Methamphetamine is a powerful and highly addictive stimulant drug.
                    <br />
                    • Physiological effects include rapid heart rate, elevated body temperature, loss of appetite, tremors, and insomnia.
                    <br />
                    • Psychological effects include severe paranoia, intense anxiety, confusion, persecutory delusions, and auditory or visual hallucinations.
                    <br />
                    • Distortions from substance use can cause individuals to perceive safe environments and loved ones as hostile threats.
                    <br />
                    • Professional medical and addiction support are necessary for comprehensive care and recovery.
                  </p>
                </div>

                <div className="bg-[#050c08] p-4 rounded-2xl border border-amber-900/60 space-y-2">
                  <div className="font-mono font-bold text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Narrative & Game Dramatisation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    • The shadowy horned creatures, glowing eyes, and distorted case notebook were visual metaphors representing Jun’s internal terror and confusion.
                    <br />
                    • The apartment was never invaded by outside intruders; Jun barricaded the doors out of overwhelming paranoia.
                    <br />
                    • The figures outside were Mum, Ravi, and his colleague Aisyah seeking medical help for him.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Play Again / Restart Case */}
        <div className="pt-2 flex flex-col items-center">
          <button
            id="end-restart-btn"
            type="button"
            onClick={onRestart}
            aria-label="Restart entire case from Title"
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.35)] border border-emerald-300 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN / RESTART CASE</span>
          </button>
        </div>

        {/* Subtle Bottom Note */}
        <div className="text-center text-[10px] font-mono text-slate-500 pt-2">
          WIDE AWAKE • A Fictional Interactive Case on Substance Paranoia and Reaching for Help
        </div>
      </div>
    </div>
  );
};
